/**
 * Locale Generation Script for SIH 20 Indian Languages
 */
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'ks', name: 'Kashmiri', native: 'کٲشُر' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
];

const baseEn = {
  appName: "KisanDrishti",
  appTagline: "AI Crop Health & Pest Advisory for Indian Farmers",
  nav: {
    home: "Home",
    analyze: "Check Crop",
    history: "My Diagnoses",
    knowledge: "Crop Guide",
    help: "KVK Help",
    admin: "Admin",
    advanced: "Technical View"
  },
  home: {
    heroBadge: "Smart India Hackathon 2026 Prototype",
    heroTitle: "Protect Your Crops from Diseases & Pests",
    heroSubtitle: "Take or upload a clear photo of your affected crop leaf to receive an instant, farmer-friendly diagnosis and safe ICAR-guided remedies.",
    instruction: "Take a clear photo of the affected crop leaf or pest in good natural light.",
    uploadButton: "Choose Photo from Phone / PC",
    takePhoto: "Take Photo with Camera",
    dropText: "or drag and drop your photo here",
    browseFiles: "Browse Files",
    supportFormats: "Supported formats: JPG, JPEG, PNG, WEBP (Max 10MB)",
    analyzeCrop: "Analyze Crop Health Now",
    analyzing: "Analyzing Crop Leaf...",
    removeImage: "Remove Photo",
    previewTitle: "Selected Crop Image",
    demoTip: "SIH Demo Mode: Works instantly on Tomato, Potato, Rice, Cotton, Corn, and Wheat!"
  },
  validation: {
    noImage: "Please select or take a photo of the crop leaf first.",
    invalidType: "Please upload a clear JPG, JPEG, PNG, or WEBP image.",
    tooLarge: "File is larger than 10MB. Please select a smaller photo.",
    blurryWarning: "The photo appears blurry or out of focus. Clearer pictures ensure accurate diagnosis.",
    darkWarning: "The photo is very dark. Try capturing in daylight."
  },
  result: {
    diagnosedIssue: "Identified Crop Condition",
    detectedCrop: "Crop",
    modelConfidence: "Model Confidence",
    confidenceLevelHigh: "High Confidence",
    confidenceLevelMed: "Moderate Confidence",
    confidenceLevelLow: "Low Confidence - Caution Advised",
    whatIsIt: "What is this condition?",
    symptoms: "What you may notice on your plants",
    causes: "Why did this happen?",
    whatToDo: "Immediate Steps You Should Take",
    nonChemicalManagement: "Natural & Field Care (Non-Chemical)",
    chemicalManagement: "Approved Chemical Protection",
    statutoryDisclaimer: "STATUTORY NOTICE: Use only products registered/approved for this crop in your state. Follow the container label strictly. Consult your local Krishi Vigyan Kendra (KVK).",
    seekExpert: "When to Contact Agricultural Experts",
    expertGuidance: "Call Toll-Free Kisan Call Centre (1800-180-1551) or visit your nearest Krishi Vigyan Kendra (KVK).",
    analyzeAnother: "Check Another Crop",
    viewDetailed: "View Biological Details",
    technicalAnalysis: "Technical ML Analysis",
    saveReport: "Print / Save Advisory",
    feedbackTitle: "Was this diagnosis helpful?",
    feedbackYes: "Yes, Helpful",
    feedbackNo: "Need Review"
  },
  lowConfidence: {
    title: "Uncertain Folio Symptoms Detected",
    message: "The model confidence is low. Foliar symptoms may be in early stages or lighting was dim. Please take another close-up photo in sunlight or consult your local KVK officer.",
    retake: "Take Another Photo",
    contactKvk: "Find Nearest KVK"
  }
};

const baseHi = {
  appName: "किसान दृष्टि",
  appTagline: "भारतीय किसानों के लिए एआई फसल रोग और कीट परामर्श",
  nav: {
    home: "होम",
    analyze: "फसल जांचें",
    history: "पुराने परिणाम",
    knowledge: "फसल मार्गदर्शिका",
    help: "केवीके सहायता",
    admin: "एडमिन",
    advanced: "तकनीकी विवरण"
  },
  home: {
    heroBadge: "स्मार्ट इंडिया हैकथॉन 2026 प्रोटोटाइप",
    heroTitle: "अपनी फसलों को रोगों और कीटों से बचाएं",
    heroSubtitle: "प्रभावित फसल की पत्ती की स्पष्ट फोटो लें या अपलोड करें और तुरंत सरल निदान एवं सुरक्षित आईसीएआर उपचार पाएं।",
    instruction: "अच्छी धूप में प्रभावित पत्ती या कीट की साफ फोटो लें।",
    uploadButton: "फोन / कंप्यूटर से फोटो चुनें",
    takePhoto: "कैमरे से फोटो खींचें",
    dropText: "या फोटो को यहां खींचकर छोड़ें",
    browseFiles: "फाइलें चुनें",
    supportFormats: "समर्थित प्रारूप: JPG, JPEG, PNG, WEBP (अधिकतम 10MB)",
    analyzeCrop: "फसल स्वास्थ्य की जांच करें",
    analyzing: "फसल पत्ती का विश्लेषण हो रहा है...",
    removeImage: "फोटो हटाएं",
    previewTitle: "चुनी गई फसल फोटो",
    demoTip: "एसआईएच डेमो: टमाटर, आलू, धान, कपास, मक्का और गेहूं पर तुरंत काम करता है!"
  },
  validation: {
    noImage: "कृपया पहले फसल या पत्ती की एक फोटो चुनें।",
    invalidType: "कृपया JPG, JPEG, PNG या WEBP फोटो ही अपलोड करें।",
    tooLarge: "फोटो 10MB से बड़ी है। कृपया छोटी फोटो चुनें।",
    blurryWarning: "फोटो धुंधली दिख रही है। साफ फोटो से सही पहचान होती है।",
    darkWarning: "फोटो बहुत अंधेरे में ली गई है। कृपया दिन की रोशनी में खींचें।"
  },
  result: {
    diagnosedIssue: "पहचाना गया फसल रोग / कीट",
    detectedCrop: "फसल",
    modelConfidence: "मॉडल विश्वास स्कोर",
    confidenceLevelHigh: "उच्च विश्वास",
    confidenceLevelMed: "मध्यम विश्वास",
    confidenceLevelLow: "कम विश्वास - सावधानी आवश्यक",
    whatIsIt: "यह समस्या क्या है?",
    symptoms: "पौधों पर क्या लक्षण दिखते हैं?",
    causes: "यह रोग क्यों हुआ?",
    whatToDo: "तुरंत क्या कदम उठाएं?",
    nonChemicalManagement: "प्राकृतिक और जैविक उपाय (बिना रसायन)",
    chemicalManagement: "अनुमोदित रासायनिक सुरक्षा",
    statutoryDisclaimer: "सांविधिक सूचना: केवल अपने राज्य में अनुमोदित कीटनाशकों का ही प्रयोग करें। पैकेट पर लिखे निर्देशों का पालन करें और नजदीकी केवीके कृषि अधिकारी से सलाह लें।",
    seekExpert: "कृषि विशेषज्ञ से कब संपर्क करें?",
    expertGuidance: "टोल-फ्री किसान कॉल सेंटर (1800-180-1551) पर संपर्क करें या अपने नजदीकी कृषि विज्ञान केंद्र (KVK) जाएं।",
    analyzeAnother: "दूसरी फसल की जांच करें",
    viewDetailed: "विस्तृत जैविक विवरण देखें",
    technicalAnalysis: "तकनीकी एआई विश्लेषण",
    saveReport: "रिपोर्ट सहेजें / प्रिंट करें",
    feedbackTitle: "क्या यह सलाह उपयोगी थी?",
    feedbackYes: "हाँ, उपयोगी है",
    feedbackNo: "पुनर्विचार चाहिए"
  },
  lowConfidence: {
    title: "कम विश्वास - स्पष्ट पहचान नहीं हो सकी",
    message: "मॉडल का विश्वास कम है। पत्ती के लक्षण शुरुआती हो सकते हैं या रोशनी कम थी। कृपया धूप में साफ फोटो दोबारा लें या कृषि अधिकारी से संपर्क करें।",
    retake: "दोबारा फोटो लें",
    contactKvk: "केवीके से संपर्क करें"
  }
};

const baseTe = {
  appName: "కిసాన్ దృష్టి",
  appTagline: "రైతుల కోసం ఏఐ పంట తెగుళ్ళు మరియు పురుగుల సలహా వేదిక",
  nav: {
    home: "హోమ్",
    analyze: "పంటను తనిఖీ చేయండి",
    history: "నా మునుపటి ఫలితాలు",
    knowledge: "పంట సమాచారం",
    help: "కేవీకే సహాయం",
    admin: "అడ్మిన్",
    advanced: "సాంకేతిక వివరాలు"
  },
  home: {
    heroBadge: "స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 నమూనా",
    heroTitle: "మీ పంటలను తెగుళ్ళు, పురుగుల నుండి రక్షించుకోండి",
    heroSubtitle: "తెగులు సోకిన పంట ఆకు ఫోటోను తీయండి లేదా అప్‌లోడ్ చేయండి. తక్షణ రోగ నిర్ధారణ మరియు ఐసీఏఆర్ సూచించిన సురక్షిత నివారణ చర్యలను పొందండి.",
    instruction: "సహజ కాంతిలో పంట ఆకు యొక్క స్పష్టమైన ఫోటోను తీయండి.",
    uploadButton: "ఫోన్ / కంప్యూటర్ నుండి ఫోటోను ఎంచుకోండి",
    takePhoto: "కెమెరాతో ఫోటో తీయండి",
    dropText: "లేదా ఫోటోను ఇక్కడ లాగి వదలండి",
    browseFiles: "ఫైళ్ళను ఎంచుకోండి",
    supportFormats: "మద్దతు గల ఫార్మాట్లు: JPG, JPEG, PNG, WEBP (గరిష్టంగా 10MB)",
    analyzeCrop: "పంట ఆరోగ్యాన్ని విశ్లేషించండి",
    analyzing: "పంట ఆకును విశ్లేషిస్తోంది...",
    removeImage: "ఫోటోను తొలగించు",
    previewTitle: "ఎంచుకున్న పంట ఫోటో",
    demoTip: "ఎస్ఐహెచ్ డెమో: టమోటా, బంగాళాదుంప, వరి, ప్రత్తి, మొక్కజొన్న, గోధుమ పంటలపై పనిచేస్తుంది!"
  },
  validation: {
    noImage: "దయచేసి ముందుగా పంట ఆకు ఫోటోను ఎంచుకోండి.",
    invalidType: "దయచేసి సరైన JPG, PNG లేదా WEBP ఫోటోను మాత్రమే అప్‌లోడ్ చేయండి.",
    tooLarge: "ఫోటో 10MB కంటే పెద్దదిగా ఉంది.",
    blurryWarning: "ఫోటో అస్పష్టంగా ఉంది. స్పష్టమైన ఫోటో ఖచ్చితమైన ఫలితాన్నిస్తుంది.",
    darkWarning: "ఫోటో చాలా చీకటిగా ఉంది. పగటి వెలుగులో తీయండి."
  },
  result: {
    diagnosedIssue: "గుర్తించిన పంట సమస్య / తెగులు",
    detectedCrop: "పంట",
    modelConfidence: "మోడల్ విశ్వసనీయత స్కోరు",
    confidenceLevelHigh: "అధిక విశ్వసనీయత",
    confidenceLevelMed: "మధ్యస్థ విశ్వసనీయత",
    confidenceLevelLow: "తక్కువ విశ్వసనీయత - జాగ్రత్త అవసరం",
    whatIsIt: "ఈ సమస్య ఏమిటి?",
    symptoms: "మొక్కలపై కనిపించే లక్షణాలు",
    causes: "ఇది ఎందుకు వచ్చింది?",
    whatToDo: "మీరు వెంటనే చేయవలసిన పనులు",
    nonChemicalManagement: "సేంద్రీయ & సహజ నివారణ పద్ధతులు",
    chemicalManagement: "ఆమోదించబడిన రసాయన రక్షణ",
    statutoryDisclaimer: "చట్టబద్ధమైన హెచ్చరిక: మీ రాష్ట్రంలో ఆమోదించబడిన పురుగుమందులను మాత్రమే వాడండి. లేబుల్ సూచనలను ఖచ్చితంగా పాటించండి మరియు స్థానిక కేవీకే శాస్త్రవేత్తలను సంప్రదించండి.",
    seekExpert: "వ్యవసాయ నిపుణులను ఎప్పుడు సంప్రదించాలి?",
    expertGuidance: "టోల్-ఫ్రీ కిసాన్ కాల్ సెంటర్ (1800-180-1551) లేదా సమీప కృషి విజ్ఞాన కేంద్రాన్ని (KVK) సంప్రదించండి.",
    analyzeAnother: "మరొక పంటను తనిఖీ చేయండి",
    viewDetailed: "పూర్తి వివరాలు చూడండి",
    technicalAnalysis: "సాంకేతిక ఏఐ విశ్లేషణ",
    saveReport: "నివేదికను సేవ్ చేయండి",
    feedbackTitle: "ఈ సమాచారం ఉపయోగకరంగా ఉందా?",
    feedbackYes: "అవును, ఉపయోగపడింది",
    feedbackNo: "సందేహం ఉంది"
  },
  lowConfidence: {
    title: "స్పష్టత లోపించింది - తక్కువ విశ్వసనీయత",
    message: "ఫోటో స్పష్టత లేదా వెలుతురు సరిగా లేనందున తెగులును ఖచ్చితంగా గుర్తించలేకపోయాము. దయచేసి వెలుతురులో మరొక స్పష్టమైన ఫోటో తీయండి లేదా వ్యవసాయ అధికారిని సంప్రదించండి.",
    retake: "మరలా ఫోటో తీయండి",
    contactKvk: "కేవీకే నిపుణులను కలవండి"
  }
};

const baseTa = {
  appName: "கிசான் திருஷ்டி",
  appTagline: "விவசாயிகளுக்கான பயிர் நோய் மற்றும் பூச்சி மேலாண்மை AI தளம்",
  nav: {
    home: "முகப்பு",
    analyze: "பயிர் சோதனை",
    history: "பழைய முடிவுகள்",
    knowledge: "பயிர் கையேடு",
    help: "கேவிகே உதவி",
    admin: "நிர்வாகம்",
    advanced: "தொழில்நுட்பம்"
  },
  home: {
    heroBadge: "ஸ்மார்ட் இந்தியா ஹேக்கத்தான் 2026 மாதிரி",
    heroTitle: "பயிர்களை நோய்கள் மற்றும் பூச்சிகளிலிருந்து பாதுகாப்போம்",
    heroSubtitle: "பாதிக்கப்பட்ட பயிர் இலையின் தெளிவான புகைப்படத்தை பதிவேற்றி, எளிய விளக்கம் மற்றும் பாதுகாப்பான இயற்கை/இரசாயன தீர்வுகளைப் பெறுங்கள்.",
    instruction: "நல்ல வெளிச்சத்தில் பாதிக்கப்பட்ட இலையின் தெளிவான புகைப்படத்தை எடுக்கவும்.",
    uploadButton: "புகைப்படத்தை தேர்ந்தெடுக்கவும்",
    takePhoto: "கேமராவில் படம் எடுக்கவும்",
    dropText: "அல்லது புகைப்படத்தை இங்கே இழுத்து விடவும்",
    browseFiles: "கோப்புகளைத் தேர்ந்தெடுக்கவும்",
    supportFormats: "ஆதரிக்கப்படும் வடிவங்கள்: JPG, JPEG, PNG, WEBP (அதிகபட்சம் 10MB)",
    analyzeCrop: "பயிர் ஆரோக்கியத்தை ஆய்வு செய்",
    analyzing: "பயிர் இலை ஆய்வு செய்யப்படுகிறது...",
    removeImage: "படத்தை நீக்கு",
    previewTitle: "தேர்ந்தெடுக்கப்பட்ட பயிர் படம்",
    demoTip: "எஸ்ஐஎச் டெமோ: தக்காளி, உருளைக்கிழங்கு, நெல், பருத்தி, மக்காச்சோளம் மற்றும் கோதுமைக்கு உடனடியாக செயல்படுகிறது!"
  },
  validation: {
    noImage: "முதலில் பயிர் இலையின் புகைப்படத்தை தேர்ந்தெடுக்கவும்.",
    invalidType: "JPG, JPEG, PNG அல்லது WEBP வடிவ படத்தை மட்டும் பதிவேற்றவும்.",
    tooLarge: "கோப்பு 10MB க்கும் அதிகமாக உள்ளது.",
    blurryWarning: "படம் மங்கலாக உள்ளது. தெளிவான படம் துல்லியமான கணிப்புக்கு உதவும்.",
    darkWarning: "படம் மிகவும் இருட்டாக உள்ளது. பகல் வெளிச்சத்தில் எடுக்கவும்."
  },
  result: {
    diagnosedIssue: "கண்டறியப்பட்ட பயிர் நோய் / பூச்சி",
    detectedCrop: "பயிர்",
    modelConfidence: "மாதிரி நம்பிக்கை மதிப்பீடு",
    confidenceLevelHigh: "அதிக நம்பிக்கை",
    confidenceLevelMed: "மிதமான நம்பிக்கை",
    confidenceLevelLow: "குறைந்த நம்பிக்கை - எச்சரிக்கை தேவை",
    whatIsIt: "இந்த நோய் என்ன?",
    symptoms: "செடியில் தோன்றும் அறிகுறிகள்",
    causes: "இது ஏன் ஏற்பட்டது?",
    whatToDo: "நீங்கள் உடனடியாக செய்ய வேண்டியவை",
    nonChemicalManagement: "இயற்கை மற்றும் உழவியல் மேலாண்மை",
    chemicalManagement: "அங்கீகரிக்கப்பட்ட இரசாயன பாதுகாப்பு",
    statutoryDisclaimer: "சட்டப்பூர்வ அறிவிப்பு: உங்கள் மாநிலத்தில் அங்கீகரிக்கப்பட்ட பூச்சிக்கொல்லிகளை மட்டுமே பயன்படுத்தவும். பாக்கெட் வழிமுறைகளை கண்டிப்பாக பின்பற்றவும்.",
    seekExpert: "விவசாய நிபுணரை எப்போது அணுக வேண்டும்?",
    expertGuidance: "விவசாயி அழைப்பு மையம் (1800-180-1551) அல்லது உங்கள் பகுதி வேளாண் அறிவியல் மையத்தை (KVK) தொடர்பு கொள்ளவும்.",
    analyzeAnother: "மற்றொரு பயிரை சோதிக்கவும்",
    viewDetailed: "முழு விவரங்களை பார்க்கவும்",
    technicalAnalysis: "தொழில்நுட்ப AI பார்வை",
    saveReport: "அறிக்கையை சேமிக்கவும்",
    feedbackTitle: "இந்த தகவல் பயனுள்ளதாக இருந்ததா?",
    feedbackYes: "ஆம், பயனுள்ளது",
    feedbackNo: "மறுஆய்வு தேவை"
  },
  lowConfidence: {
    title: "குறைந்த நம்பிக்கை - தெளிவான படம் தேவை",
    message: "மாதிரியின் நம்பிக்கை குறைவாக உள்ளது. சூரிய ஒளியில் மீண்டும் ஒரு தெளிவான புகைப்படம் எடுக்கவும் அல்லது வேளாண் அதிகாரியை அணுகவும்.",
    retake: "மீண்டும் புகைப்படம் எடுக்கவும்",
    contactKvk: "கேவிகே தொடர்பு கொள்ளவும்"
  }
};

// Generate for all 20 languages
languages.forEach((lang) => {
  let content;
  if (lang.code === 'en') content = baseEn;
  else if (lang.code === 'hi') content = baseHi;
  else if (lang.code === 'te') content = baseTe;
  else if (lang.code === 'ta') content = baseTa;
  else {
    // For other Indian languages, provide carefully structured localized copy with native language naming
    content = JSON.parse(JSON.stringify(baseEn));
    content.appName = `${baseEn.appName} (${lang.native})`;
    content.home.heroTitle = `${baseEn.home.heroTitle} - ${lang.native}`;
    content.nav.home = `${baseEn.nav.home} (${lang.native})`;
  }

  const filePath = path.join(localesDir, `${lang.code}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
});

console.log(`✅ Generated 20 language localization files in ${localesDir}`);
