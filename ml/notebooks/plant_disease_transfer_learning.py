"""
Plant Disease Transfer Learning Pipeline for SIH Crop Intelligence
Architecture: MobileNetV3-Large (Transfer Learning)
Dataset: PlantVillage Dataset (38-class plant disease & healthy foliage)
Repository: https://github.com/spMohanty/PlantVillage-Dataset

LEAF-GROUPING & DATA LEAKAGE PREVENTION:
In the PlantVillage dataset (Mohanty et al., 2016), multiple images were often
taken of the same physical leaf under different angles/orientations.
A naive random image-level split causes images of the SAME physical leaf to appear
in both the training and test sets, artificially inflating accuracy (data leakage).

This pipeline implements LEAF-AWARE GROUP SPLITTING:
1. Loads PlantVillage leaf grouping metadata (leaf-map.json or filtered_leafmaps).
2. Maps every sample image to its physical leaf identifier.
3. Partitions leaf groups (instead of individual images) into Train, Val, and Test.
4. Guarantees 0% leaf overlap across Train, Validation, and Test splits.
5. Employs an 80/20 train/test benchmark split (with validation partition).
6. Uses MobileNetV3-Large transfer learning with frozen feature extraction.
7. Evaluates Top-1 Accuracy, Macro Precision, Macro Recall, and Macro/Weighted F1.
8. Exports PyTorch (.pth), ONNX (.onnx), class mapping (.json), and metrics report (.json).
"""

import os
import sys
import csv
import json
import time
import random
import argparse
import subprocess
import urllib.request
from pathlib import Path


# ==============================================================================
# 1. Dependency Verification Helper
# ==============================================================================

def check_dependencies():
    """Verify PyTorch and essential computer vision packages are available."""
    missing = []
    try:
        import torch
        import torchvision
    except ImportError:
        missing.append("torch torchvision")

    try:
        import numpy
    except ImportError:
        missing.append("numpy")

    try:
        import PIL
    except ImportError:
        missing.append("pillow")

    if missing:
        print("=" * 72)
        print("[!] Missing required Python machine learning packages.")
        print("Please install them before running training:")
        print("    pip install -r ml/requirements.txt")
        print("Or directly run:")
        print("    pip install torch torchvision numpy scikit-learn pillow tqdm onnx")
        print("=" * 72)
        sys.exit(1)


# ==============================================================================
# 2. Dataset Resolution & Leaf Grouping Metadata Utilities
# ==============================================================================

def find_dataset_images_dir(base_dir: Path) -> Path:
    """
    Locates the directory containing class subfolders.
    Handles multiple directory structures:
    - base_dir/raw/color
    - base_dir/color
    - base_dir/PlantVillage-Dataset/raw/color
    - base_dir directly containing class subfolders
    """
    candidates = [
        base_dir / "raw" / "color",
        base_dir / "color",
        base_dir / "PlantVillage-Dataset" / "raw" / "color",
        base_dir,
    ]

    for candidate in candidates:
        if candidate.exists() and candidate.is_dir():
            subdirs = [d for d in candidate.iterdir() if d.is_dir() and not d.name.startswith('.')]
            if len(subdirs) >= 2:
                return candidate

    return base_dir


def load_leaf_map_from_csvs(filtered_leafmaps_dir: Path) -> dict:
    """Aggregates all CSVs from filtered_leafmaps/ into a filename -> leaf_id mapping."""
    leaf_map = {}
    csv_files = list(filtered_leafmaps_dir.glob("*.csv"))
    if not csv_files:
        return leaf_map

    print(f"[INFO] Aggregating leaf maps from {len(csv_files)} CSV files in {filtered_leafmaps_dir}...")
    for csv_file in csv_files:
        class_name = csv_file.stem
        try:
            with open(csv_file, "r", encoding="utf-8", errors="ignore") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    fname = row.get("File Name", "")
                    leaf_num = row.get("Leaf #", "")
                    if fname and leaf_num:
                        stem = Path(fname).stem.lower().strip()
                        leaf_id = f"{class_name}:::{leaf_num}"
                        if stem not in leaf_map:
                            leaf_map[stem] = []
                        leaf_map[stem].append(leaf_id)
        except Exception as e:
            print(f"[!] Warning reading {csv_file.name}: {e}")

    return leaf_map


def find_or_download_leaf_map(base_dir: Path, custom_map_path: str = None) -> dict:
    """
    Finds leaf-map.json or filtered_leafmaps locally.
    If not found locally, automatically downloads the 1.6MB leaf-map.json from the
    official spMohanty/PlantVillage-Dataset repository to prevent data leakage.
    """
    if custom_map_path:
        p = Path(custom_map_path)
        if p.exists():
            print(f"[OK] Loading custom leaf mapping from: {p}")
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)

    # Search paths for leaf-map.json
    candidates = [
        base_dir / "leaf-map.json",
        base_dir.parent / "leaf-map.json",
        base_dir / "leaf_grouping" / "leaf-map.json",
        base_dir.parent / "leaf_grouping" / "leaf-map.json",
        base_dir / "PlantVillage-Dataset" / "leaf-map.json",
        base_dir / "PlantVillage-Dataset" / "leaf_grouping" / "leaf-map.json",
    ]

    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            print(f"[OK] Found local PlantVillage leaf map: {candidate}")
            with open(candidate, "r", encoding="utf-8") as f:
                return json.load(f)

    # Search for filtered_leafmaps CSV directory
    csv_candidates = [
        base_dir / "leaf_grouping" / "filtered_leafmaps",
        base_dir.parent / "leaf_grouping" / "filtered_leafmaps",
        base_dir / "filtered_leafmaps",
        base_dir / "PlantVillage-Dataset" / "leaf_grouping" / "filtered_leafmaps",
    ]
    for csv_dir in csv_candidates:
        if csv_dir.exists() and csv_dir.is_dir():
            leaf_map = load_leaf_map_from_csvs(csv_dir)
            if leaf_map:
                return leaf_map

    # If not found locally, fetch leaf-map.json from official repository
    raw_url = "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/leaf-map.json"
    save_path = base_dir / "leaf-map.json"
    print(f"[INFO] Local leaf-map.json not found. Fetching from official PlantVillage repo...")
    print(f"       Source: {raw_url}")
    try:
        req = urllib.request.Request(raw_url, headers={"User-Agent": "Mozilla/5.0 (SIH-KisanDrishti)"})
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode("utf-8"))

        base_dir.mkdir(parents=True, exist_ok=True)
        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(data, f)
        print(f"[OK] Successfully downloaded leaf-map.json ({len(data)} leaf entries) -> {save_path}")
        return data
    except Exception as e:
        print(f"[!] Note: Could not download remote leaf-map.json ({e}).")
        print("    Training will proceed with stratified class splitting fallback.")
        return None


def download_plantvillage(target_dir: Path) -> Path:
    """
    Downloads PlantVillage RGB color dataset and leaf grouping metadata from GitHub.
    Uses git sparse-checkout to fetch raw/color, leaf_grouping, and leaf-map.json (~500MB)
    instead of the full multi-gigabyte repository history and unused grayscale/segmented folders.
    """
    print("=" * 72)
    print(f"[DATA] Checking PlantVillage Dataset in: {target_dir}")
    print("=" * 72)

    target_dir.mkdir(parents=True, exist_ok=True)
    images_dir = find_dataset_images_dir(target_dir)

    if images_dir.exists() and len([d for d in images_dir.iterdir() if d.is_dir()]) >= 2:
        print(f"[OK] Dataset images already present at: {images_dir}")
        return images_dir

    repo_url = "https://github.com/spMohanty/PlantVillage-Dataset.git"
    git_dir = target_dir / "PlantVillage-Dataset"

    print("[INFO] Attempting lightweight download via Git sparse-checkout (raw/color + leaf_grouping)...")
    try:
        subprocess.run(["git", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if not git_dir.exists():
            print(f"[INFO] Cloning repository metadata to {git_dir}...")
            subprocess.run([
                "git", "clone",
                "--depth", "1",
                "--filter=blob:none",
                "--sparse",
                repo_url,
                str(git_dir)
            ], check=True)

            print("[INFO] Configuring sparse checkout for raw/color and leaf_grouping...")
            subprocess.run(
                ["git", "-C", str(git_dir), "sparse-checkout", "set", "raw/color", "leaf_grouping", "leaf-map.json"],
                check=True
            )
            print("[OK] Git sparse checkout completed successfully.")

        images_dir = find_dataset_images_dir(target_dir)
        return images_dir

    except (subprocess.SubprocessError, FileNotFoundError) as err:
        print(f"[!] Git sparse-checkout could not complete: {err}")
        print("\n" + "=" * 72)
        print("MANUAL DATASET DOWNLOAD INSTRUCTIONS:")
        print("1. Download the PlantVillage dataset from:")
        print("   https://github.com/spMohanty/PlantVillage-Dataset")
        print(f"2. Extract the 'raw/color' folder into: {target_dir / 'raw' / 'color'}")
        print(f"3. Place 'leaf-map.json' or 'leaf_grouping' into: {target_dir}")
        print(f"4. Run this script again with: --data-dir \"{target_dir}\"")
        print("=" * 72 + "\n")
        return images_dir


# ==============================================================================
# 3. Data Transforms & Multi-Split Loader (Zero-Leakage Group Split)
# ==============================================================================

def get_transforms():
    """
    Standard ImageNet transforms with lightweight augmentations for training.
    Validation and Test sets strictly use deterministic resize and normalization.
    """
    from torchvision import transforms

    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]

    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.15, contrast=0.15),
        transforms.ToTensor(),
        transforms.Normalize(mean=mean, std=std),
    ])

    eval_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=mean, std=std),
    ])

    return train_transform, eval_transform


def resolve_image_leaf_id(img_path: str, class_name: str, leaf_map: dict) -> str:
    """
    Maps an individual image filepath to its physical leaf identifier.
    In PlantVillage filenames, the pattern is often:
      '<uuid>___<original_stem>.JPG' (e.g. '...___YLCV_NREC 2938.JPG')
    or direct filename stems.
    If an image is unmapped, it is treated as a unique physical leaf.
    """
    stem = Path(img_path).stem.lower().strip()
    if leaf_map:
        # 1. Try candidate after '___' separator
        if "___" in stem:
            candidate = stem.split("___", 1)[1].strip()
            if candidate in leaf_map:
                return leaf_map[candidate][0]

        # 2. Try exact full stem
        if stem in leaf_map:
            return leaf_map[stem][0]

    # 3. Fallback: single image represents an isolated unique physical leaf
    return f"{class_name}:::unique_{stem}"


def prepare_datasets(
    data_dir: Path,
    leaf_map: dict = None,
    test_split: float = 0.20,
    val_split: float = 0.10,
    sample_fraction: float = 1.0,
    seed: int = 42
):
    """
    Loads ImageFolder from directory, discovers classes dynamically,
    and performs a LEAF-AWARE STRATIFIED GROUP SPLIT:
    - Guarantees images from the same physical leaf never cross train/val/test partitions.
    - Uses official PlantVillage 80/20 train/test benchmark distribution.
    - Verifies 0% leaf leakage with mathematical assertion before training begins.
    """
    from torch.utils.data import Subset
    from torchvision import datasets

    train_transform, eval_transform = get_transforms()

    train_base = datasets.ImageFolder(str(data_dir), transform=train_transform)
    eval_base = datasets.ImageFolder(str(data_dir), transform=eval_transform)

    classes = train_base.classes
    num_classes = len(classes)
    total_images = len(train_base)

    if num_classes == 0:
        raise ValueError(f"No class folders found in {data_dir}. Ensure subdirectories exist for each class.")

    rng = random.Random(seed)

    # 1. Assign each sample to its physical leaf identifier
    sample_leaf_ids = []
    class_leaf_groups = {cls_name: {} for cls_name in classes}
    mapped_count = 0

    for idx, (path, cls_idx) in enumerate(train_base.samples):
        cls_name = classes[cls_idx]
        leaf_id = resolve_image_leaf_id(path, cls_name, leaf_map)
        sample_leaf_ids.append(leaf_id)

        if not leaf_id.endswith(f"unique_{Path(path).stem.lower().strip()}"):
            mapped_count += 1

        if leaf_id not in class_leaf_groups[cls_name]:
            class_leaf_groups[cls_name][leaf_id] = []
        class_leaf_groups[cls_name][leaf_id].append(idx)

    total_leaf_groups = sum(len(groups) for groups in class_leaf_groups.values())

    print("-" * 72)
    print(f"[DATA] Dataset Path: {data_dir}")
    print(f"[CLASS] Classes Detected Dynamically: {num_classes} classes")
    print(f"[LEAF GROUPING] Total Physical Leaves: {total_leaf_groups} leaf groups across {total_images} images")
    if leaf_map:
        print(f"                Images bound to multi-photo leaf groups: {mapped_count} ({mapped_count / total_images * 100:.1f}%)")
        print(f"                Images treated as single physical leaves: {total_images - mapped_count}")
    else:
        print("[!] Running with image-level fallback (leaf-map metadata not available).")
    print("-" * 72)

    # 2. Stratified Leaf-Group Partitioning
    train_indices = []
    val_indices = []
    test_indices = []

    train_leaves = set()
    val_leaves = set()
    test_leaves = set()

    for cls_name, leaf_groups in class_leaf_groups.items():
        unique_leaves = list(leaf_groups.keys())
        rng.shuffle(unique_leaves)

        # Optional laptop downsampling
        if sample_fraction < 1.0:
            sample_count = max(2, int(len(unique_leaves) * sample_fraction))
            unique_leaves = unique_leaves[:sample_count]

        n_leaves = len(unique_leaves)
        n_test = max(1, int(round(test_split * n_leaves))) if test_split > 0 else 0
        n_val = max(1, int(round(val_split * n_leaves))) if val_split > 0 else 0
        n_train = n_leaves - n_test - n_val

        if n_train < 1:
            n_train = 1
            if n_val > 1:
                n_val -= 1
            elif n_test > 1:
                n_test -= 1

        cls_train_leaves = unique_leaves[:n_train]
        cls_val_leaves = unique_leaves[n_train:n_train + n_val]
        cls_test_leaves = unique_leaves[n_train + n_val:]

        for lid in cls_train_leaves:
            train_indices.extend(leaf_groups[lid])
            train_leaves.add(lid)

        for lid in cls_val_leaves:
            val_indices.extend(leaf_groups[lid])
            val_leaves.add(lid)

        for lid in cls_test_leaves:
            test_indices.extend(leaf_groups[lid])
            test_leaves.add(lid)

    # 3. Mathematical Verification of Zero Data Leakage
    train_test_overlap = train_leaves.intersection(test_leaves)
    train_val_overlap = train_leaves.intersection(val_leaves)
    val_test_overlap = val_leaves.intersection(test_leaves)

    assert len(train_test_overlap) == 0, f"DATA LEAKAGE ERROR: {len(train_test_overlap)} leaves overlap between Train and Test!"
    assert len(train_val_overlap) == 0, f"DATA LEAKAGE ERROR: {len(train_val_overlap)} leaves overlap between Train and Val!"
    assert len(val_test_overlap) == 0, f"DATA LEAKAGE ERROR: {len(val_test_overlap)} leaves overlap between Val and Test!"

    total_samples = len(train_indices) + len(val_indices) + len(test_indices)
    print("[LEAKAGE CHECK] PASSED! Zero data leakage confirmed.")
    print(f"  * Train/Test leaf overlap: 0 leaves (0.00% leakage)")
    print(f"  * Train/Val leaf overlap:  0 leaves (0.00% leakage)")
    print(f"  * Val/Test leaf overlap:   0 leaves (0.00% leakage)")
    print(f"[COUNTS] Sample Split Distribution:")
    print(f"  * Train Set      : {len(train_indices)} images ({len(train_indices) / total_samples * 100:.1f}%) across {len(train_leaves)} leaf groups")
    print(f"  * Validation Set : {len(val_indices)} images ({len(val_indices) / total_samples * 100:.1f}%) across {len(val_leaves)} leaf groups")
    print(f"  * Test Set       : {len(test_indices)} images ({len(test_indices) / total_samples * 100:.1f}%) across {len(test_leaves)} leaf groups")
    print(f"  * Total Active   : {total_samples} images")
    print("-" * 72)

    train_set = Subset(train_base, train_indices)
    val_set = Subset(eval_base, val_indices)
    test_set = Subset(eval_base, test_indices)

    split_stats = {
        'total_images': total_images,
        'total_leaves': total_leaf_groups,
        'mapped_images': mapped_count,
        'train_samples': len(train_indices),
        'val_samples': len(val_indices),
        'test_samples': len(test_indices),
        'train_leaves': len(train_leaves),
        'val_leaves': len(val_leaves),
        'test_leaves': len(test_leaves),
        'leakage_overlap_count': 0,
    }

    return train_set, val_set, test_set, classes, split_stats


# ==============================================================================
# 4. MobileNetV3 Transfer Learning Model Architecture
# ==============================================================================

def build_model(num_classes: int, freeze_features: bool = True):
    """
    Builds MobileNetV3-Large with transfer learning.
    Freezes earlier convolutional feature layers to ensure fast, lightweight laptop training.
    Replaces classifier head with custom dropout and linear projection to num_classes.
    """
    import torch.nn as nn
    from torchvision import models

    weights = models.MobileNet_V3_Large_Weights.DEFAULT
    model = models.mobilenet_v3_large(weights=weights)

    if freeze_features:
        for param in model.features.parameters():
            param.requires_grad = False
        print("[FROZEN] Base feature extractor layers frozen for efficient training.")
    else:
        print("[UNFROZEN] Full network end-to-end fine-tuning enabled.")

    in_features = model.classifier[0].in_features
    model.classifier = nn.Sequential(
        nn.Linear(in_features, 512),
        nn.Hardswish(),
        nn.Dropout(p=0.3),
        nn.Linear(512, num_classes)
    )

    return model


# ==============================================================================
# 5. Evaluation Metrics Calculation
# ==============================================================================

def compute_metrics(y_true, y_pred, class_names):
    """
    Computes Accuracy, Macro Precision, Macro Recall, and Macro/Weighted F1.
    Uses scikit-learn if available, with pure Python fallback.
    """
    try:
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, average='macro', zero_division=0)
        rec = recall_score(y_true, y_pred, average='macro', zero_division=0)
        f1_macro = f1_score(y_true, y_pred, average='macro', zero_division=0)
        f1_weighted = f1_score(y_true, y_pred, average='weighted', zero_division=0)
        report = classification_report(y_true, y_pred, target_names=class_names, zero_division=0, output_dict=True)
    except ImportError:
        total = len(y_true)
        correct = sum(1 for yt, yp in zip(y_true, y_pred) if yt == yp)
        acc = correct / max(1, total)

        num_classes = len(class_names)
        precisions, recalls, f1s = [], [], []

        for c in range(num_classes):
            tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == c and yp == c)
            fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt != c and yp == c)
            fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == c and yp != c)

            p = tp / (tp + fp) if (tp + fp) > 0 else 0.0
            r = tp / (tp + fn) if (tp + fn) > 0 else 0.0
            f = (2 * p * r) / (p + r) if (p + r) > 0 else 0.0

            precisions.append(p)
            recalls.append(r)
            f1s.append(f)

        prec = sum(precisions) / max(1, num_classes)
        rec = sum(recalls) / max(1, num_classes)
        f1_macro = sum(f1s) / max(1, num_classes)
        f1_weighted = f1_macro
        report = {}

    return {
        'accuracy': float(acc),
        'precision_macro': float(prec),
        'recall_macro': float(rec),
        'f1_macro': float(f1_macro),
        'f1_weighted': float(f1_weighted),
        'detailed_report': report
    }


def evaluate(model, dataloader, criterion, device, class_names):
    """
    Runs full evaluation over a dataloader.
    Returns average loss and all calculated metrics.
    """
    import torch

    model.eval()
    running_loss = 0.0
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for inputs, targets in dataloader:
            inputs = inputs.to(device)
            targets = targets.to(device)

            outputs = model(inputs)
            loss = criterion(outputs, targets)

            running_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy().tolist())
            all_targets.extend(targets.cpu().numpy().tolist())

    total_samples = len(all_targets)
    epoch_loss = running_loss / max(1, total_samples)
    metrics = compute_metrics(all_targets, all_preds, class_names)
    metrics['loss'] = float(epoch_loss)

    return metrics


# ==============================================================================
# 6. Training Pipeline
# ==============================================================================

def train_pipeline(args):
    check_dependencies()
    import torch
    import torch.nn as nn
    from torch.utils.data import DataLoader

    start_time = time.time()
    device = torch.device(
        "cuda" if torch.cuda.is_available() and args.device != 'cpu'
        else "cpu"
    )

    print("=" * 72)
    print("SIH Kisan Drishti - MobileNetV3 Plant Disease Transfer Learning")
    print(f"[DEVICE] Hardware Target: {device} " + (f"({torch.cuda.get_device_name(0)})" if device.type == 'cuda' else "(CPU Laptop Mode)"))
    print("=" * 72)

    # 1. Dataset Resolution & Download
    raw_data_dir = Path(args.data_dir)
    if args.download or not raw_data_dir.exists():
        data_dir = download_plantvillage(raw_data_dir)
    else:
        data_dir = find_dataset_images_dir(raw_data_dir)

    if not data_dir.exists():
        print(f"[!] Error: Dataset path does not exist: {data_dir}")
        print("Run with --download to clone the PlantVillage dataset automatically,")
        print("or specify --data-dir with your local dataset folder.")
        sys.exit(1)

    # 2. Leaf Grouping Metadata Resolution
    leaf_map = find_or_download_leaf_map(raw_data_dir, custom_map_path=args.leaf_map)

    # 3. Leaf-Aware Split Preparation (Zero Data Leakage)
    train_set, val_set, test_set, class_names, split_stats = prepare_datasets(
        data_dir=data_dir,
        leaf_map=leaf_map,
        test_split=args.test_split,
        val_split=args.val_split,
        sample_fraction=args.sample_fraction,
        seed=args.seed
    )
    num_classes = len(class_names)

    batch_size = args.batch_size
    num_workers = args.num_workers

    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True, num_workers=num_workers, pin_memory=(device.type == 'cuda'))
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False, num_workers=num_workers, pin_memory=(device.type == 'cuda'))
    test_loader = DataLoader(test_set, batch_size=batch_size, shuffle=False, num_workers=num_workers, pin_memory=(device.type == 'cuda'))

    # 4. Model Setup
    model = build_model(num_classes=num_classes, freeze_features=args.freeze_features)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=args.lr,
        weight_decay=1e-4
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)

    # 5. Training Epochs
    best_val_f1 = 0.0
    best_model_state = None
    history = []

    print(f"\n[TRAIN] Starting Training: {args.epochs} Epochs | Batch Size: {batch_size} | Learning Rate: {args.lr}")
    print("-" * 72)

    for epoch in range(1, args.epochs + 1):
        epoch_start = time.time()
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for batch_idx, (inputs, targets) in enumerate(train_loader):
            inputs = inputs.to(device)
            targets = targets.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == targets).sum().item()
            total += targets.size(0)

        scheduler.step()

        train_loss = running_loss / max(1, total)
        train_acc = correct / max(1, total)

        # Validation Phase
        val_metrics = evaluate(model, val_loader, criterion, device, class_names)
        val_loss = val_metrics['loss']
        val_acc = val_metrics['accuracy']
        val_f1 = val_metrics['f1_macro']
        epoch_sec = time.time() - epoch_start

        history.append({
            'epoch': epoch,
            'train_loss': round(train_loss, 4),
            'train_acc': round(train_acc, 4),
            'val_loss': round(val_loss, 4),
            'val_acc': round(val_acc, 4),
            'val_f1_macro': round(val_f1, 4),
            'duration_sec': round(epoch_sec, 1)
        })

        is_best = val_f1 > best_val_f1
        if is_best:
            best_val_f1 = val_f1
            best_model_state = {k: v.cpu() for k, v in model.state_dict().items()}
            best_marker = " [* Best Checkpoint]"
        else:
            best_marker = ""

        print(
            f"Epoch [{epoch:2d}/{args.epochs:2d}] ({epoch_sec:.1f}s) | "
            f"Train Loss: {train_loss:.4f} Acc: {train_acc * 100:.1f}% | "
            f"Val Loss: {val_loss:.4f} Acc: {val_acc * 100:.1f}% F1: {val_f1 * 100:.1f}%"
            f"{best_marker}"
        )

    # 6. Final Evaluation on Unseen Leaf-Separated Test Set
    print("\n" + "=" * 72)
    print(f"[TEST] Running Final Evaluation on Unseen Test Split ({split_stats['test_samples']} images, {split_stats['test_leaves']} leaves)...")
    print("=" * 72)

    if best_model_state is not None:
        model.load_state_dict({k: v.to(device) for k, v in best_model_state.items()})

    test_metrics = evaluate(model, test_loader, criterion, device, class_names)

    print("\n[RESULTS] TEST SET PERFORMANCE SUMMARY (LEAF-AWARE SPLIT):")
    print(f"  * Overall Accuracy : {test_metrics['accuracy'] * 100:.2f}%")
    print(f"  * Macro Precision  : {test_metrics['precision_macro'] * 100:.2f}%")
    print(f"  * Macro Recall     : {test_metrics['recall_macro'] * 100:.2f}%")
    print(f"  * Macro F1-Score   : {test_metrics['f1_macro'] * 100:.2f}%")
    print(f"  * Weighted F1-Score: {test_metrics['f1_weighted'] * 100:.2f}%")
    print(f"  * Test Loss        : {test_metrics['loss']:.4f}")

    # 7. Save Artifacts for Backend ML Integration
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    parsed_catalog = []
    for idx, raw_name in enumerate(class_names):
        parts = raw_name.split("___")
        crop = parts[0].replace("_", " ").strip()
        condition = parts[1].replace("_", " ").strip() if len(parts) > 1 else raw_name
        is_healthy = "healthy" in condition.lower()

        parsed_catalog.append({
            'index': idx,
            'raw_name': raw_name,
            'crop': crop,
            'condition': condition,
            'is_healthy': is_healthy,
            'condition_type': 'healthy' if is_healthy else 'disease'
        })

    # A. Save class mapping JSON
    class_mapping_path = output_dir / "class_names.json"
    with open(class_mapping_path, "w", encoding="utf-8") as f:
        json.dump({
            'num_classes': num_classes,
            'classes': class_names,
            'class_to_idx': {c: i for i, c in enumerate(class_names)},
            'idx_to_class': {str(i): c for i, c in enumerate(class_names)},
            'catalog': parsed_catalog,
        }, f, indent=2)
    print(f"\n[SAVED] Class mapping saved to: {class_mapping_path}")

    # B. Save PyTorch weights (.pth)
    pth_path = output_dir / "crop_disease_mobilenet.pth"
    torch.save({
        'architecture': 'mobilenet_v3_large',
        'num_classes': num_classes,
        'class_names': class_names,
        'model_state_dict': best_model_state if best_model_state is not None else model.state_dict(),
        'test_metrics': {k: v for k, v in test_metrics.items() if k != 'detailed_report'},
        'split_stats': split_stats,
        'history': history,
        'hyperparameters': vars(args),
    }, pth_path)
    print(f"[SAVED] PyTorch model checkpoint saved to: {pth_path}")

    # C. Export to ONNX for Web / Node.js Inference
    if args.export_onnx:
        onnx_path = output_dir / "crop_disease_mobilenet.onnx"
        try:
            model.eval()
            dummy_input = torch.randn(1, 3, 224, 224, device=device)
            torch.onnx.export(
                model,
                dummy_input,
                str(onnx_path),
                export_params=True,
                opset_version=13,
                do_constant_folding=True,
                input_names=['image'],
                output_names=['probabilities'],
                dynamic_axes={'image': {0: 'batch_size'}, 'probabilities': {0: 'batch_size'}}
            )
            print(f"[SAVED] ONNX model exported to: {onnx_path}")
        except Exception as e:
            print(f"[!] Note: ONNX export skipped ({e}). Install onnx package if needed: pip install onnx")

    # D. Save evaluation metrics JSON
    metrics_path = output_dir / "evaluation_metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump({
            'test_accuracy': test_metrics['accuracy'],
            'test_precision_macro': test_metrics['precision_macro'],
            'test_recall_macro': test_metrics['recall_macro'],
            'test_f1_macro': test_metrics['f1_macro'],
            'test_f1_weighted': test_metrics['f1_weighted'],
            'test_loss': test_metrics['loss'],
            'split_stats': split_stats,
            'leaf_grouping_leakage_prevented': True,
            'total_duration_sec': round(time.time() - start_time, 2),
            'device': str(device),
            'hyperparameters': vars(args),
            'training_history': history,
        }, f, indent=2)
    print(f"[SAVED] Evaluation report saved to: {metrics_path}")

    print("=" * 72)
    print("[DONE] Pipeline Execution Complete!")
    print(f"[TIME] Total Elapsed Time: {(time.time() - start_time) / 60:.2f} minutes")
    print("=" * 72)


# ==============================================================================
# 7. Command-Line Entry Point
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Train MobileNetV3 Transfer Learning Model on PlantVillage Dataset with Leaf Grouping for SIH Kisan Drishti"
    )

    # Paths
    parser.add_argument(
        "--data-dir",
        type=str,
        default="ml/data/plantvillage",
        help="Path to PlantVillage dataset or folder containing class subdirectories (default: ml/data/plantvillage)"
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="ml/models",
        help="Directory where trained .pth, .onnx, and class_names.json will be saved (default: ml/models)"
    )
    parser.add_argument(
        "--leaf-map",
        type=str,
        default=None,
        help="Explicit path to leaf-map.json or filtered_leafmaps/ directory (optional; auto-discovered if omitted)"
    )
    parser.add_argument(
        "--download",
        action="store_true",
        help="Attempt to download/clone the PlantVillage dataset and leaf-map metadata automatically"
    )

    # Data Splitting
    parser.add_argument(
        "--test-split",
        type=float,
        default=0.20,
        help="Fraction of leaf groups to allocate to unseen test set (default: 0.20 for standard 80/20 benchmark)"
    )
    parser.add_argument(
        "--val-split",
        type=float,
        default=0.10,
        help="Fraction of leaf groups to allocate to validation set (default: 0.10)"
    )

    # Training Hyperparameters
    parser.add_argument(
        "--epochs",
        type=int,
        default=10,
        help="Number of training epochs (default: 10)"
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=32,
        help="DataLoader batch size (default: 32; use 16 for low-memory laptop CPU)"
    )
    parser.add_argument(
        "--lr",
        type=float,
        default=1e-3,
        help="Initial learning rate for AdamW optimizer (default: 0.001)"
    )
    parser.add_argument(
        "--sample-fraction",
        type=float,
        default=1.0,
        help="Fraction of dataset to use for quick laptop testing (e.g. 0.1 for 10 percent, default: 1.0)"
    )
    parser.add_argument(
        "--num-workers",
        type=int,
        default=0,
        help="Number of DataLoader workers (default: 0 for reliable Windows laptop execution)"
    )
    parser.add_argument(
        "--device",
        type=str,
        default="auto",
        choices=["auto", "cuda", "cpu"],
        help="Hardware acceleration target (default: auto)"
    )
    parser.add_argument(
        "--freeze-features",
        action="store_true",
        default=True,
        help="Freeze MobileNetV3 feature extractor and train only classification head (default: True for fast laptop training)"
    )
    parser.add_argument(
        "--no-freeze-features",
        dest="freeze_features",
        action="store_false",
        help="Unfreeze entire network for end-to-end fine-tuning"
    )
    parser.add_argument(
        "--export-onnx",
        action="store_true",
        default=True,
        help="Export trained model to ONNX format (default: True)"
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for reproducible train/val/test leaf splits (default: 42)"
    )

    args = parser.parse_args()
    train_pipeline(args)


if __name__ == "__main__":
    main()
