"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define available languages
const languages = {
  en: {
    name: "English",
    code: "en",
    translations: {
      home: "Home",
      about: "About",
      contact: "Contact",
      light: "Light",
      dark: "Dark",
      system: "System",
      language: "Language",
      cropType: "Crop Type",
      landArea: "Land Area",
      fertilizer: "Fertilizer Usage",
      rainfall: "Recent Rainfall",
      soilType: "Soil Type",
      weather: "Weather",
      temperature: "Temperature",
      humidity: "Humidity",
      sunlight: "Sunlight Hours",
      historicalYield: "Historical Yield",
      predict: "Predict Yield",
      reset: "Reset",
      yieldPrediction: "Yield Prediction",
      suggestions: "Suggestions",
      marketPrices: "Market Prices",
      weatherForecast: "Weather Forecast",
      hectares: "Hectares",
      acres: "Acres",
      kgPerHectare: "kg/hectare",
      mm: "mm",
      celsius: "°C",
      percent: "%",
      hours: "hours",
      tons: "tons",
      selectCrop: "Select a crop",
      selectSoil: "Select soil type",
      low: "Low",
      medium: "Medium",
      high: "High",
      estimatedYield: "Estimated Yield",
      yieldCategory: "Yield Category",
      improvementTips: "Improvement Tips",
      currentLocation: "Current Location",
      locationNotAvailable: "Location not available",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      notice: "Notice",
      footer: {
        rights: "All rights reserved",
        developed: "Developed with ❤️ for farmers",
      },
    },
  },
  hi: {
    name: "हिन्दी",
    code: "hi",
    translations: {
      home: "होम",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      light: "उजला",
      dark: "अंधेरा",
      system: "सिस्टम",
      language: "भाषा",
      cropType: "फसल प्रकार",
      landArea: "भूमि क्षेत्र",
      fertilizer: "उर्वरक उपयोग",
      rainfall: "हाल की बारिश",
      soilType: "मिट्टी का प्रकार",
      weather: "मौसम",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      sunlight: "धूप के घंटे",
      historicalYield: "ऐतिहासिक उपज",
      predict: "उपज की भविष्यवाणी करें",
      reset: "रीसेट करें",
      yieldPrediction: "उपज भविष्यवाणी",
      suggestions: "सुझाव",
      marketPrices: "बाजार मूल्य",
      weatherForecast: "मौसम पूर्वानुमान",
      hectares: "हेक्टेयर",
      acres: "एकड़",
      kgPerHectare: "किग्रा/हेक्टेयर",
      mm: "मिमी",
      celsius: "°C",
      percent: "%",
      hours: "घंटे",
      tons: "टन",
      selectCrop: "फसल चुनें",
      selectSoil: "मिट्टी का प्रकार चुनें",
      low: "कम",
      medium: "मध्यम",
      high: "उच्च",
      estimatedYield: "अनुमानित उपज",
      yieldCategory: "उपज श्रेणी",
      improvementTips: "सुधार के टिप्स",
      currentLocation: "वर्तमान स्थान",
      locationNotAvailable: "स्थान उपलब्ध नहीं है",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      notice: "सूचना",
      footer: {
        rights: "सर्वाधिकार सुरक्षित",
        developed: "किसानों के लिए ❤️ के साथ विकसित",
      },
    },
  },
  bn: {
    name: "বাংলা",
    code: "bn",
    translations: {
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      contact: "যোগাযোগ",
      light: "আলো",
      dark: "অন্ধকার",
      system: "সিস্টেম",
      language: "ভাষা",
      cropType: "ফসলের ধরন",
      landArea: "জমির পরিমাণ",
      fertilizer: "সার ব্যবহার",
      rainfall: "সাম্প্রতিক বৃষ্টিপাত",
      soilType: "মাটির ধরন",
      weather: "আবহাওয়া",
      temperature: "তাপমাত্রা",
      humidity: "আর্দ্রতা",
      sunlight: "সূর্যালোকের ঘন্টা",
      historicalYield: "ঐতিহাসিক ফলন",
      predict: "ফলন পূর্বাভাস",
      reset: "রিসেট",
      yieldPrediction: "ফলন পূর্বাভাস",
      suggestions: "পরামর্শ",
      marketPrices: "বাজার দর",
      weatherForecast: "আবহাওয়া পূর্বাভাস",
      hectares: "হেক্টর",
      acres: "একর",
      kgPerHectare: "কেজি/হেক্টর",
      mm: "মিমি",
      celsius: "°C",
      percent: "%",
      hours: "ঘন্টা",
      tons: "টন",
      selectCrop: "ফসল নির্বাচন করুন",
      selectSoil: "মাটির ধরন নির্বাচন করুন",
      low: "কম",
      medium: "মাঝারি",
      high: "বেশি",
      estimatedYield: "অনুমানিত ফলন",
      yieldCategory: "ফলন বিভাগ",
      improvementTips: "উন্নতির টিপস",
      currentLocation: "বর্তমান অবস্থান",
      locationNotAvailable: "অবস্থান পাওয়া যায়নি",
      loading: "লোড হচ্ছে...",
      error: "ত্রুটি",
      success: "সফল",
      notice: "বিজ্ঞপ্তি",
      footer: {
        rights: "সর্বস্বত্ব সংরক্ষিত",
        developed: "কৃষকদের জন্য ❤️ দিয়ে তৈরি",
      },
    },
  },
  ta: {
    name: "தமிழ்",
    code: "ta",
    translations: {
      home: "முகப்பு",
      about: "எங்களை பற்றி",
      contact: "தொடர்பு",
      light: "வெளிச்சம்",
      dark: "இருள்",
      system: "கணினி",
      language: "மொழி",
      cropType: "பயிர் வகை",
      landArea: "நில பரப்பளவு",
      fertilizer: "உரம் பயன்பாடு",
      rainfall: "சமீபத்திய மழை",
      soilType: "மண் வகை",
      weather: "வானிலை",
      temperature: "வெப்பநிலை",
      humidity: "ஈரப்பதம்",
      sunlight: "சூரிய ஒளி மணிநேரம்",
      historicalYield: "வரலாற்று விளைச்சல்",
      predict: "விளைச்சல் கணிப்பு",
      reset: "மீட்டமை",
      yieldPrediction: "விளைச்சல் கணிப்பு",
      suggestions: "பரிந்துரைகள்",
      marketPrices: "சந்தை விலைகள்",
      weatherForecast: "வானிலை முன்னறிவிப்பு",
      hectares: "ஹெக்டேர்",
      acres: "ஏக்கர்",
      kgPerHectare: "கிலோ/ஹெக்டேர்",
      mm: "மிமீ",
      celsius: "°C",
      percent: "%",
      hours: "மணிநேரம்",
      tons: "டன்",
      selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
      selectSoil: "மண் வகையைத் தேர்ந்தெடுக்கவும்",
      low: "குறைவு",
      medium: "நடுத்தரம்",
      high: "அதிகம்",
      estimatedYield: "மதிப்பிடப்பட்ட விளைச்சல்",
      yieldCategory: "விளைச்சல் வகை",
      improvementTips: "மேம்பாட்டு குறிப்புகள்",
      currentLocation: "தற்போதைய இடம்",
      locationNotAvailable: "இடம் கிடைக்கவில்லை",
      loading: "ஏற்றுகிறது...",
      error: "பிழை",
      success: "வெற்றி",
      notice: "அறிவிப்பு",
      footer: {
        rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை",
        developed: "விவசாயிகளுக்காக ❤️ உடன் உருவாக்கப்பட்டது",
      },
    },
  },
  te: {
    name: "తెలుగు",
    code: "te",
    translations: {
      home: "హోమ్",
      about: "మా గురించి",
      contact: "సంప్రదించండి",
      light: "లైట్",
      dark: "డార్క్",
      system: "సిస్టమ్",
      language: "భాష",
      cropType: "పంట రకం",
      landArea: "భూమి విస్తీర్ణం",
      fertilizer: "ఎరువుల వినియోగం",
      rainfall: "ఇటీవలి వర్షపాతం",
      soilType: "నేల రకం",
      weather: "వాతావరణం",
      temperature: "ఉష్ణోగ్రత",
      humidity: "తేమ",
      sunlight: "సూర్యరశ్మి గంటలు",
      historicalYield: "చారిత్రక దిగుబడి",
      predict: "దిగుబడిని అంచనా వేయండి",
      reset: "రీసెట్",
      yieldPrediction: "దిగుబడి అంచనా",
      suggestions: "సూచనలు",
      marketPrices: "మార్కెట్ ధరలు",
      weatherForecast: "వాతావరణ సూచన",
      hectares: "హెక్టార్లు",
      acres: "ఎకరాలు",
      kgPerHectare: "కేజీ/హెక్టార్",
      mm: "మిమీ",
      celsius: "°C",
      percent: "%",
      hours: "గంటలు",
      tons: "టన్నులు",
      selectCrop: "పంటను ఎంచుకోండి",
      selectSoil: "నేల రకాన్ని ఎంచుకోండి",
      low: "తక్కువ",
      medium: "మధ్యస్థం",
      high: "ఎక్కువ",
      estimatedYield: "అంచనా దిగుబడి",
      yieldCategory: "దిగుబడి వర్గం",
      improvementTips: "మెరుగుదల చిట్కాలు",
      currentLocation: "ప్రస్తుత స్థానం",
      locationNotAvailable: "స్థానం అందుబాటులో లేదు",
      loading: "లోడ్ అవుతోంది...",
      error: "లోపం",
      success: "విజయం",
      notice: "నోటీసు",
      footer: {
        rights: "సర్వహక్కులు కలివి",
        developed: "రైతుల కోసం ❤️ తో అభివృద్ధి చేయబడింది",
      },
    },
  },
  es: {
    name: "Español",
    code: "es",
    translations: {
      home: "Inicio",
      about: "Acerca de",
      contact: "Contacto",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema",
      language: "Idioma",
      cropType: "Tipo de Cultivo",
      landArea: "Área de Tierra",
      fertilizer: "Uso de Fertilizante",
      rainfall: "Lluvia Reciente",
      soilType: "Tipo de Suelo",
      weather: "Clima",
      temperature: "Temperatura",
      humidity: "Humedad",
      sunlight: "Horas de Sol",
      historicalYield: "Rendimiento Histórico",
      predict: "Predecir Rendimiento",
      reset: "Reiniciar",
      yieldPrediction: "Predicción de Rendimiento",
      suggestions: "Sugerencias",
      marketPrices: "Precios de Mercado",
      weatherForecast: "Pronóstico del Tiempo",
      hectares: "Hectáreas",
      acres: "Acres",
      kgPerHectare: "kg/hectárea",
      mm: "mm",
      celsius: "°C",
      percent: "%",
      hours: "horas",
      tons: "toneladas",
      selectCrop: "Seleccionar cultivo",
      selectSoil: "Seleccionar tipo de suelo",
      low: "Bajo",
      medium: "Medio",
      high: "Alto",
      estimatedYield: "Rendimiento Estimado",
      yieldCategory: "Categoría de Rendimiento",
      improvementTips: "Consejos de Mejora",
      currentLocation: "Ubicación Actual",
      locationNotAvailable: "Ubicación no disponible",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      notice: "Aviso",
      footer: {
        rights: "Todos los derechos reservados",
        developed: "Desarrollado con ❤️ para agricultores",
      },
    },
  },
}

// Create context
type LanguageContextType = {
  currentLanguage: string
  setLanguage: (lang: string) => void
  t: (key: string, section?: string) => string
  availableLanguages: typeof languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check for saved language preference
    const savedLang = localStorage.getItem("language") || "en"
    setCurrentLanguage(savedLang)
    setMounted(true)
  }, [])

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang)
    localStorage.setItem("language", lang)
  }

  // Translation function
  const t = (key: string, section?: string) => {
    if (!mounted) return ""

    const lang = languages[currentLanguage as keyof typeof languages]
    if (!lang) return key

    if (section) {
      const sectionObj = lang.translations[section as keyof typeof lang.translations]
      if (typeof sectionObj === "object" && sectionObj !== null) {
        return (sectionObj as any)[key] || key
      }
      return key
    }

    return (lang.translations[key as keyof typeof lang.translations] || key) as string
  }

  const value = {
    currentLanguage,
    setLanguage,
    t,
    availableLanguages: languages,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
