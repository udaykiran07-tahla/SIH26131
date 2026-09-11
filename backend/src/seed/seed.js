/**
 * Comprehensive Database Seeder
 * Populates MongoDB with realistic Indian crop data, verified conditions,
 * authoritative references (ICAR, KVK), sample dataset records, and default admin user.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Crop = require('../models/Crop');
const Condition = require('../models/Condition');
const Admin = require('../models/Admin');
const ModelVersion = require('../models/ModelVersion');
const DatasetSample = require('../models/DatasetSample');
const Prediction = require('../models/Prediction');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crop_intelligence';

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected. Clearing old seed collections...');

    await Promise.all([
      Crop.deleteMany({}),
      Condition.deleteMany({}),
      Admin.deleteMany({}),
      ModelVersion.deleteMany({}),
      DatasetSample.deleteMany({}),
      Prediction.deleteMany({}),
    ]);

    console.log('[Seed] Creating default Admin...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    await Admin.create({
      username: 'admin',
      passwordHash,
      name: 'Dr. Ramesh Kumar (Agricultural Scientist / Admin)',
      role: 'admin',
    });

    console.log('[Seed] Seeding Crops...');
    const crops = await Crop.insertMany([
      {
        name: 'Tomato',
        localNames: {
          hi: 'टमाटर',
          te: 'టమోటా',
          ta: 'தக்காளி',
          mr: 'टोमॅटो',
          bn: 'টমেটো',
          gu: 'ટામેટા',
          kn: 'ಟೊಮೆಟೊ',
          ml: 'തക്കാളി',
          pa: 'ਟਮਾਟਰ',
        },
        scientificName: 'Solanum lycopersicum',
        category: 'Vegetable',
        description: 'Major vegetable crop cultivated widely across India in Kharif, Rabi, and summer seasons.',
        imageUrl: '/images/crops/tomato.jpg',
      },
      {
        name: 'Potato',
        localNames: {
          hi: 'आलू',
          te: 'బంగాళాదుంప',
          ta: 'உருளைக்கிழங்கு',
          mr: 'बटाटा',
          bn: 'আলু',
          gu: 'બટાકા',
          kn: 'ಆಲೂಗಡ್ಡೆ',
          ml: 'ഉരുളക്കിഴങ്ങ്',
          pa: 'ਆਲੂ',
        },
        scientificName: 'Solanum tuberosum',
        category: 'Vegetable',
        description: 'Key tuber crop heavily grown in Uttar Pradesh, West Bengal, Bihar, and Punjab.',
        imageUrl: '/images/crops/potato.jpg',
      },
      {
        name: 'Rice',
        localNames: {
          hi: 'चावल / धान',
          te: 'వరి / బియ్యం',
          ta: 'நெல் / அரிசி',
          mr: 'भात / तांदूळ',
          bn: 'ধান / চাল',
          gu: 'ડાંગર / ચોખા',
          kn: 'ಭತ್ತ / ಅಕ್ಕಿ',
          ml: 'നെല്ല് / അരി',
          pa: 'ਝੋਨਾ / ਚਾਵਲ',
        },
        scientificName: 'Oryza sativa',
        category: 'Cereal',
        description: 'Staple cereal crop of India, covering the largest cultivated acreage in the country.',
        imageUrl: '/images/crops/rice.jpg',
      },
      {
        name: 'Cotton',
        localNames: {
          hi: 'कपास',
          te: 'ప్రత్తి',
          ta: 'பருத்தி',
          mr: 'कापूस',
          bn: 'তুলা',
          gu: 'કપાસ',
          kn: 'ಹತ್ತಿ',
          ml: 'പരുത്തി',
          pa: 'ਕਪਾਹ',
        },
        scientificName: 'Gossypium hirsutum',
        category: 'Cash Crop',
        description: 'Major commercial fiber crop predominantly grown in Gujarat, Maharashtra, Telangana, and Andhra Pradesh.',
        imageUrl: '/images/crops/cotton.jpg',
      },
      {
        name: 'Corn (Maize)',
        localNames: {
          hi: 'मक्का',
          te: 'మొక్కజొన్న',
          ta: 'மக்காச்சோளம்',
          mr: 'मका',
          bn: 'ভুট্টা',
          gu: 'મકાઈ',
          kn: 'ಮೆಕ್ಕೆಜೋಳ',
          ml: 'ചോളം',
          pa: 'ਮੱਕੀ',
        },
        scientificName: 'Zea mays',
        category: 'Cereal',
        description: 'Versatile food and fodder grain crop grown in Karnataka, Madhya Pradesh, Maharashtra, and Bihar.',
        imageUrl: '/images/crops/maize.jpg',
      },
      {
        name: 'Wheat',
        localNames: {
          hi: 'गेहूं',
          te: 'గోధుమలు',
          ta: 'கோதுமை',
          mr: 'गहू',
          bn: 'গম',
          gu: 'ઘઉં',
          kn: 'ಗೋಧಿ',
          ml: 'ഗോതമ്പ്',
          pa: 'ਕਣਕ',
        },
        scientificName: 'Triticum aestivum',
        category: 'Cereal',
        description: 'Leading Rabi season cereal crop across the Indo-Gangetic plains.',
        imageUrl: '/images/crops/wheat.jpg',
      },
    ]);

    console.log('[Seed] Seeding Agricultural Conditions with ICAR References...');
    await Condition.insertMany([
      {
        name: 'Tomato Early Blight',
        type: 'disease',
        crop: 'Tomato',
        scientificName: 'Alternaria solani',
        affectedParts: ['Leaves', 'Stems', 'Fruit calyx'],
        description: 'A common fungal infection characterized by concentric target-like brown spots on older lower leaves, eventually spreading upward.',
        symptoms: [
          'Dark brown to black spots with concentric rings (target board pattern) on older leaves.',
          'Surrounding yellow halo around circular lesions.',
          'Premature yellowing and drop of lower leaves exposing fruit to sunscald.',
          'Collar rot or dark sunken cankers on young stems near ground level.',
        ],
        causes: [
          'Prolonged leaf wetness caused by heavy dew or overhead irrigation.',
          'Warm temperatures (24°C - 29°C) combined with high relative humidity.',
          'Overwintering fungal spores in infected crop debris from previous solanaceous seasons.',
        ],
        prevention: [
          'Use certified disease-free seeds or hot-water treated seedlings.',
          'Practice a minimum 2-3 year crop rotation away from solanaceous crops (potato, eggplant, pepper).',
          'Provide wide plant spacing (60 x 45 cm) to facilitate quick foliage drying and good airflow.',
          'Mulch around plant bases with organic straw or plastic mulch to avoid soil splashing on lower leaves.',
        ],
        management: {
          nonChemical: [
            'Prune and safely destroy lower infected leaves at the earliest sign of spotting.',
            'Drip irrigate at root level rather than using overhead sprinklers.',
            'Spray neem-based formulation (Azadirachtin 0.03% EC or cold-pressed neem kernel extract) as preventative protective wash.',
            'Apply Trichoderma viride or Bacillus subtilis bio-fungicide formulations to root rhizosphere during transplanting.',
          ],
          chemical: {
            guidance: 'Apply protective contact or systemic fungicides registered specifically for tomato early blight in your region upon threshold detection.',
            activeIngredients: [
              { name: 'Mancozeb 75% WP', registeredTarget: 'Early blight of tomato (protective)', note: 'Follow Central Insecticide Board & Registration Committee (CIBRC) approved dosage.' },
              { name: 'Copper Oxychloride 50% WP', registeredTarget: 'Foliar blight protection', note: 'Ensure proper agitation in spray tank.' },
            ],
            disclaimer: 'IMPORTANT STATUTORY NOTICE: Use only products registered and approved for tomato early blight in your specific district/state. Follow product label guidelines, spray intervals, and pre-harvest intervals (PHI). Consult your local Krishi Vigyan Kendra (KVK) or Block Agriculture Officer before chemical application.',
          },
        },
        whenToSeekExpert: 'If brown spotting spreads past 25% of the canopy or stem cankers appear within 48 hours, bring a fresh leaf sample in a sealed plastic bag to your nearest KVK officer.',
        severity: 'Moderate',
        references: [
          {
            organization: 'Indian Council of Agricultural Research (ICAR)',
            title: 'Integrated Pest and Disease Management in Tomato (Extension Bulletin No. 42)',
            url: 'https://icar.org.in',
            dateChecked: new Date('2026-01-15'),
          },
          {
            organization: 'Tamil Nadu Agricultural University (TNAU) Agritech Portal',
            title: 'Crop Protection: Tomato Diseases - Alternaria leaf spot',
            url: 'http://agritech.tnau.ac.in',
            dateChecked: new Date('2026-02-10'),
          },
        ],
        sampleImages: ['/uploads/demo-tomato-early-blight.jpg'],
      },
      {
        name: 'Potato Late Blight',
        type: 'disease',
        crop: 'Potato',
        scientificName: 'Phytophthora infestans',
        affectedParts: ['Leaves', 'Stems', 'Tubers'],
        description: 'Devastating water-mold disease that causes rapid water-soaked lesions, white downy mold underneath leaves, and foul rotting.',
        symptoms: [
          'Irregular water-soaked brown lesions beginning near leaf margins and tips.',
          'Delicate white fungal-like growth visible on the undersides of leaves during high humidity/morning dew.',
          'Blackened stems that turn brittle and snap easily.',
          'Tubers exhibit shallow bronze/purplish dry decay beneath skin.',
        ],
        causes: [
          'Cool nights (10°C - 15°C) and warm days (15°C - 20°C) with prolonged relative humidity (> 90%).',
          'Infected seed tubers or volunteer potato plants acting as primary inoculum reservoir.',
        ],
        prevention: [
          'Plant certified disease-free seed tubers from verified seed agencies (e.g. CPRI Shimla).',
          'Avoid excessive nitrogen fertilization which produces overly succulent, susceptible foliage.',
          'Hill up soil properly to provide a physical soil barrier protecting developing tubers from washed-down spores.',
        ],
        management: {
          nonChemical: [
            'Destroy infected cull piles and volunteer plants prior to season emergence.',
            'Dehaulm (cut and destroy tops) 10-15 days before harvest if late blight is detected in the field.',
            'Ensure complete tuber drying before storage and maintain cool, well-ventilated godown conditions.',
          ],
          chemical: {
            guidance: 'Fungicides must be applied preventatively based on regional blight forecast warnings.',
            activeIngredients: [
              { name: 'Cymoxanil 8% + Mancozeb 64% WP', registeredTarget: 'Late blight curative/protective blend', note: 'Apply strictly in rotation to prevent pathogen resistance.' },
            ],
            disclaimer: 'IMPORTANT STATUTORY NOTICE: Use only CIBRC-registered products. Adhere strictly to safety waiting periods prior to harvest and wear protective eye/mask gear.',
          },
        },
        whenToSeekExpert: 'Late blight can destroy an entire field within 5-7 days under conducive weather. Immediately report outbreaks to the District Potato Development Officer or ICAR-CPRI.',
        severity: 'Severe',
        references: [
          {
            organization: 'ICAR - Central Potato Research Institute (CPRI)',
            title: 'Management of Potato Late Blight in Subtropical Plains',
            url: 'https://cpri.icar.gov.in',
            dateChecked: new Date('2026-01-20'),
          },
        ],
        sampleImages: ['/uploads/demo-potato-late-blight.jpg'],
      },
      {
        name: 'Rice Blast',
        type: 'disease',
        crop: 'Rice',
        scientificName: 'Magnaporthe oryzae',
        affectedParts: ['Leaves', 'Nodes', 'Neck/Panicle'],
        description: 'Major fungal disease causing spindle-shaped lesions with grey centers, leading to neck rot and empty grains.',
        symptoms: [
          'Spindle or diamond-shaped lesions with ash-grey or white centers and dark brown margins.',
          'Lesions enlarge and coalesce, causing entire leaves to dry and die.',
          'Infected panicle neck rots, turning black and causing panicles to fall over ("neck blast").',
        ],
        causes: [
          'High relative humidity (> 90%), prolonged leaf wetness, and cool night temperatures (18°C - 22°C).',
          'Excessive applications of nitrogenous fertilizer beyond recommended soil test doses.',
        ],
        prevention: [
          'Cultivate blast-tolerant or resistant cultivars recommended for your state agro-climatic zone.',
          'Treat seeds with Trichoderma harzianum (10g/kg seed) before nursery sowing.',
          'Apply nitrogen in 3 split doses rather than heavy single doses.',
        ],
        management: {
          nonChemical: [
            'Keep nursery beds weed-free and avoid dense seedling overcrowding.',
            'Maintain a shallow water layer in the field during critical vegetative phases.',
            'Spray 5% Neem Seed Kernel Extract (NSKE) at early boot leaf stage.',
          ],
          chemical: {
            guidance: 'Targeted spraying at nursery or early tillering upon observing characteristic spindle lesions.',
            activeIngredients: [
              { name: 'Tricyclazole 75% WP', registeredTarget: 'Foliar and neck blast management', note: 'Consult official university package of practices for recommended timing.' },
            ],
            disclaimer: 'STATUTORY NOTICE: Comply with state agricultural department advisories and local water protection guidelines.',
          },
        },
        whenToSeekExpert: 'Contact your block Agricultural Extension Officer (AEO) if spindle lesions appear on more than 5% of tillers.',
        severity: 'Severe',
        references: [
          {
            organization: 'ICAR - National Rice Research Institute (NRRI Cuttack)',
            title: 'Disease Management Guidelines for High-Yielding Rice Varieties',
            url: 'https://icar-nrri.gov.in',
            dateChecked: new Date('2026-02-01'),
          },
        ],
        sampleImages: ['/uploads/demo-rice-blast.jpg'],
      },
      {
        name: 'Cotton Bollworm Infestation',
        type: 'pest',
        crop: 'Cotton',
        scientificName: 'Helicoverpa armigera',
        affectedParts: ['Squares', 'Flowers', 'Bolls'],
        description: 'Vigorous caterpillar pest that bores into cotton squares and bolls, leaving characteristic round entry holes with excreta.',
        symptoms: [
          'Caterpillars visible feeding on squares and young green bolls.',
          'Flared squares (bracteoles open outwards) with bored entrance holes.',
          'Granular dark fecal droppings (frass) accumulated near holes.',
          'Premature boll shedding and stained, unmarketable lint.',
        ],
        causes: [
          'High adult moth migration, warm dry weather, and continuous planting of alternate host crops (chickpea, pigeonpea).',
        ],
        prevention: [
          'Install pheromone traps (5 traps per hectare) for monitoring adult moth emergence.',
          'Grow 2-3 border rows of trap crops such as marigold or castor around cotton plots.',
          'Regular field scouting: randomly sample 20 plants per acre to observe larval presence.',
        ],
        management: {
          nonChemical: [
            'Release egg parasitoids (Trichogramma chilonis @ 1,50,000/ha) at weekly intervals during early square formation.',
            'Hand-pick and safely destroy large caterpillars in smallholdings.',
            'Spray HaNPV (Helicoverpa nuclear polyhedrosis virus) @ 250 LE/ha in evening hours with 1% jaggery as feeding stimulant.',
          ],
          chemical: {
            guidance: 'Chemical intervention is only advised when economic threshold level (ETL: 1 larva per plant or 5-10% damaged bolls) is breached.',
            activeIngredients: [
              { name: 'Emamectin Benzoate 5% SG', registeredTarget: 'Lepidopteran borer control', note: 'Strictly follow label concentration.' },
            ],
            disclaimer: 'STATUTORY CAUTION: Never use broad-spectrum synthetic pyrethroids repeatedly as this triggers pest resurgence and kills beneficial pollinators and parasitoid wasps.',
          },
        },
        whenToSeekExpert: 'If flared squares exceed 10% or pheromone traps catch more than 8 moths/night for 3 consecutive nights, contact your local KVK entomologist immediately.',
        severity: 'Severe',
        references: [
          {
            organization: 'ICAR - Central Institute for Cotton Research (CICR Nagpur)',
            title: 'Integrated Pest Management Protocol for Cotton Bollworms',
            url: 'https://cicr.org.in',
            dateChecked: new Date('2026-02-15'),
          },
        ],
        sampleImages: ['/uploads/demo-cotton-bollworm.jpg'],
      },
      {
        name: 'Fall Armyworm Infestation',
        type: 'pest',
        crop: 'Corn (Maize)',
        scientificName: 'Spodoptera frugiperda',
        affectedParts: ['Whorl', 'Leaves', 'Tassels', 'Cobs'],
        description: 'Invasive caterpillar pest causing severe skeletonized leaf damage and sawdust-like frass inside the central whorl.',
        symptoms: [
          'Pinholes and ragged "window-pane" feeding signs on leaves emerging from whorl.',
          'Copious amounts of yellowish-brown frass resembling sawdust packed in the leaf funnel.',
          'Larva exhibits inverted "Y" shape on head and four dark spots arranged in a square on the 8th abdominal segment.',
        ],
        causes: [
          'High pest reproduction rates in consecutive maize plantings under warm tropical conditions.',
        ],
        prevention: [
          'Maintain synchronized sowing in the farming cluster within a 2-week window.',
          'Intercrop maize with cowpea, pigeonpea, or desmodium to repel ovipositing female moths.',
          'Apply sand mixed with neem seed powder (9:1 ratio) directly into whorls of young plants at 15-20 days after germination.',
        ],
        management: {
          nonChemical: [
            'Install bird perches (10-15 per acre) to invite predatory birds to feed on larvae.',
            'Soil-dwelling beneficial nematodes (Heterorhabditis indica) or entomopathogenic fungi (Metarhizium anisopliae) application.',
          ],
          chemical: {
            guidance: 'Apply directed whorl sprays when more than 10-20% of plants show active larval presence at mid-whorl stage.',
            activeIngredients: [
              { name: 'Chlorantraniliprole 18.5% SC', registeredTarget: 'Maize whorl caterpillar management', note: 'Direct nozzle into central plant funnel.' },
            ],
            disclaimer: 'STATUTORY NOTICE: Follow local university advisories and adhere to required personal protective equipment (PPE).',
          },
        },
        whenToSeekExpert: 'Notify the local agricultural department upon first detection in a new district as Fall Armyworm is a monitored invasive pest under national biosecurity protocols.',
        severity: 'Severe',
        references: [
          {
            organization: 'ICAR - Indian Institute of Maize Research (IIMR Ludhiana)',
            title: 'Management Strategy for Fall Armyworm in Maize',
            url: 'https://iimr.icar.gov.in',
            dateChecked: new Date('2026-01-30'),
          },
        ],
        sampleImages: ['/uploads/demo-maize-armyworm.jpg'],
      },
    ]);

    console.log('[Seed] Seeding Initial Model Version Tracker...');
    await ModelVersion.insertMany([
      {
        name: 'MobileNetV3-PlantDisease-Transfer',
        version: 'v1.0.0-baseline',
        framework: 'PyTorch / MobileNetV3-Large',
        datasetVersion: 'PlantVillage-India-v1.2 (38 Classes)',
        trainingDate: new Date('2026-01-10'),
        accuracy: 94.2,
        precision: 93.8,
        recall: 94.1,
        f1Score: 93.9,
        status: 'Active',
        notes: 'Pre-trained on ImageNet, fine-tuned on PlantVillage dataset with data augmentations (flips, rotations, illumination shifts). Prototype deployment.',
      },
      {
        name: 'EfficientNet-B0-CropHealth',
        version: 'v1.1.0-beta',
        framework: 'PyTorch / EfficientNet-B0',
        datasetVersion: 'PlantVillage + KVK Field Samples (42 Classes)',
        trainingDate: new Date('2026-02-14'),
        accuracy: 95.8,
        precision: 95.1,
        recall: 95.6,
        f1Score: 95.3,
        status: 'Testing',
        notes: 'Incorporates additional field photos from local Andhra Pradesh and Karnataka KVKs to enhance outdoor lighting robustness.',
      },
    ]);

    console.log('[Seed] Seeding Dataset Samples (Admin Scalability Showcase)...');
    await DatasetSample.insertMany([
      {
        imagePath: '/uploads/samples/tomato-early-blight-01.jpg',
        originalFileName: 'tomato_eb_001.jpg',
        crop: 'Tomato',
        condition: 'Tomato Early Blight',
        label: 'Tomato - Early Blight (Alternaria solani)',
        category: 'diseased',
        description: 'Lower leaf target spot lesion with visible concentric rings and chlorosis.',
        source: 'PlantVillage Public Dataset',
        uploadedBy: 'admin',
        status: 'Verified',
      },
      {
        imagePath: '/uploads/samples/potato-late-blight-01.jpg',
        originalFileName: 'potato_lb_001.jpg',
        crop: 'Potato',
        condition: 'Potato Late Blight',
        label: 'Potato - Late Blight (Phytophthora infestans)',
        category: 'diseased',
        description: 'Water-soaked lesion spreading inward from leaflet tip with downy mildew underside.',
        source: 'ICAR-CPRI Research Farm',
        uploadedBy: 'admin',
        status: 'Verified',
      },
      {
        imagePath: '/uploads/samples/rice-blast-01.jpg',
        originalFileName: 'rice_blast_001.jpg',
        crop: 'Rice',
        condition: 'Rice Blast',
        label: 'Rice - Blast Spindle Lesion',
        category: 'diseased',
        description: 'Classic spindle-shaped lesion on vegetative leaf blade with gray center.',
        source: 'State Agriculture University Field Trial',
        uploadedBy: 'admin',
        status: 'Verified',
      },
      {
        imagePath: '/uploads/samples/cotton-bollworm-01.jpg',
        originalFileName: 'cotton_bw_001.jpg',
        crop: 'Cotton',
        condition: 'Cotton Bollworm Infestation',
        label: 'Cotton - Bollworm Borer Damage',
        category: 'pest',
        description: 'Bored entrance hole on young green boll surrounded by frass droppings.',
        source: 'CICR Surveillance Survey',
        uploadedBy: 'admin',
        status: 'Verified',
      },
      {
        imagePath: '/uploads/samples/maize-armyworm-01.jpg',
        originalFileName: 'maize_faw_001.jpg',
        crop: 'Corn (Maize)',
        condition: 'Fall Armyworm Infestation',
        label: 'Corn - Fall Armyworm Whorl Damage',
        category: 'pest',
        description: 'Severe ragged window-paning on unfurling leaf with frass accumulation.',
        source: 'IIMR Monitoring Station',
        uploadedBy: 'admin',
        status: 'Verified',
      },
      {
        imagePath: '/uploads/samples/tomato-healthy-01.jpg',
        originalFileName: 'tomato_healthy_001.jpg',
        crop: 'Tomato',
        condition: 'Tomato Healthy',
        label: 'Tomato - Healthy Foliage',
        category: 'healthy',
        description: 'Vigorous deep-green compound leaves without any lesions or discoloration.',
        source: 'Field Baseline',
        uploadedBy: 'admin',
        status: 'Verified',
      },
    ]);

    console.log('[Seed] Seeding Initial Farmer Predictions for History & Analytics...');
    await Prediction.insertMany([
      {
        imagePath: '/uploads/samples/tomato-early-blight-01.jpg',
        originalFileName: 'farmer_field_leaf_01.jpg',
        fileSize: 482910,
        dimensions: { width: 1024, height: 768 },
        crop: 'Tomato',
        condition: 'Tomato Early Blight',
        conditionType: 'disease',
        confidence: 0.91,
        confidenceLevel: 'HIGH',
        isLowConfidence: false,
        alternatives: [
          { crop: 'Tomato', condition: 'Tomato Late Blight', confidence: 0.05, conditionType: 'disease' },
          { crop: 'Tomato', condition: 'Tomato Healthy', confidence: 0.03, conditionType: 'healthy' },
        ],
        preprocessingDetails: {
          resized: '224x224',
          normalized: true,
          blurScore: 48,
          brightnessScore: 132,
          isBlurry: false,
          isTooDark: false,
          isTooBright: false,
          format: 'JPEG',
        },
        inferenceTimeMs: 412,
        modelVersion: 'Demo-CNN-MobileNetV3-v1.0',
        isDemo: true,
        createdAt: new Date(Date.now() - 3600 * 1000 * 4), // 4 hours ago
      },
      {
        imagePath: '/uploads/samples/potato-late-blight-01.jpg',
        originalFileName: 'potato_sample_village.jpg',
        fileSize: 612800,
        dimensions: { width: 1200, height: 900 },
        crop: 'Potato',
        condition: 'Potato Late Blight',
        conditionType: 'disease',
        confidence: 0.88,
        confidenceLevel: 'HIGH',
        isLowConfidence: false,
        alternatives: [
          { crop: 'Potato', condition: 'Potato Early Blight', confidence: 0.08, conditionType: 'disease' },
        ],
        preprocessingDetails: {
          resized: '224x224',
          normalized: true,
          blurScore: 52,
          brightnessScore: 140,
          isBlurry: false,
          isTooDark: false,
          isTooBright: false,
          format: 'JPEG',
        },
        inferenceTimeMs: 385,
        modelVersion: 'Demo-CNN-MobileNetV3-v1.0',
        isDemo: true,
        createdAt: new Date(Date.now() - 3600 * 1000 * 24), // 1 day ago
      },
      {
        imagePath: '/uploads/samples/cotton-bollworm-01.jpg',
        originalFileName: 'cotton_boll_check.jpg',
        fileSize: 320140,
        dimensions: { width: 800, height: 600 },
        crop: 'Cotton',
        condition: 'Cotton Bollworm Infestation',
        conditionType: 'pest',
        confidence: 0.92,
        confidenceLevel: 'HIGH',
        isLowConfidence: false,
        alternatives: [
          { crop: 'Cotton', condition: 'Cotton Whitefly', confidence: 0.05, conditionType: 'pest' },
        ],
        preprocessingDetails: {
          resized: '224x224',
          normalized: true,
          blurScore: 44,
          brightnessScore: 126,
          isBlurry: false,
          isTooDark: false,
          isTooBright: false,
          format: 'JPEG',
        },
        inferenceTimeMs: 440,
        modelVersion: 'Demo-CNN-MobileNetV3-v1.0',
        isDemo: true,
        createdAt: new Date(Date.now() - 3600 * 1000 * 48), // 2 days ago
      },
      {
        imagePath: '/uploads/samples/tomato-healthy-01.jpg',
        originalFileName: 'healthy_leaf_test.jpg',
        fileSize: 512000,
        dimensions: { width: 1024, height: 768 },
        crop: 'Tomato',
        condition: 'Tomato Healthy',
        conditionType: 'healthy',
        confidence: 0.95,
        confidenceLevel: 'HIGH',
        isLowConfidence: false,
        alternatives: [],
        preprocessingDetails: {
          resized: '224x224',
          normalized: true,
          blurScore: 50,
          brightnessScore: 135,
          isBlurry: false,
          isTooDark: false,
          isTooBright: false,
          format: 'JPEG',
        },
        inferenceTimeMs: 370,
        modelVersion: 'Demo-CNN-MobileNetV3-v1.0',
        isDemo: true,
        createdAt: new Date(Date.now() - 3600 * 1000 * 72), // 3 days ago
      },
    ]);

    console.log('✅ [Seed] Database successfully seeded with crops, conditions, admin, models, datasets, and history!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Error]:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
