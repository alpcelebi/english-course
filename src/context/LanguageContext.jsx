import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'lingua-language'
const LanguageContext = createContext(null)

const DICTIONARY = {
  tr: {
    navHome: 'Ana Sayfa',
    navLevels: 'Seviyeler',
    navTest: 'Test',
    navMistakes: 'Yanlışlar',
    navProgress: 'İlerleme',
    brandSub: 'İngilizce Dilbilgisi',
    navAria: 'Ana menü',
    menuOpen: 'Menüyü aç',
    menuClose: 'Menüyü kapat',
    themeLight: 'Açık tema',
    themeDark: 'Koyu tema',
    toLightTheme: 'Açık temaya geç',
    toDarkTheme: 'Koyu temaya geç',
    boot: 'Veri tabanı hazırlanıyor…',
    footerBrand: 'Lingua · İngilizce Dilbilgisi',
    footerCreditLead: 'Created by',
    footerCreditYear: '2026',
    unit: 'Ünite',
    section: 'bölüm',
    sections: 'bölüm',
    example: 'örnek',
    examples: 'örnek',
    topic: 'konu',
    topics: 'konu',
    question: 'soru',
    questions: 'soru',
    completed: 'Tamamlandı',
    started: 'Başlanmadı',
    quiz: 'Quiz',
    best: 'En iyi',
    correct: 'doğru',
    score: 'Skor',
    nextQuestion: 'Sonraki Soru',
    seeResult: 'Sonucu Gör',
    retry: 'Tekrar Dene',
    correctFeedback: 'Doğru! ',
    explanation: 'Açıklama: ',
    resultGreat: 'Mükemmel! Bu konuya hâkimsin.',
    resultOk: 'İyi gidiyor — birkaç noktayı tekrar et.',
    resultLow: 'Sorun değil, dersi tekrar gözden geçir ve yeniden dene.',
    searchPlaceholder: 'Konu ara',
    searchAria: 'Konu ara',
    clearSearch: 'Aramayı temizle',
    searchResults: 'Arama sonuçları',
    noTopicFound: 'Konu bulunamadı',
    soon: 'Yakında',
  },
  en: {
    navHome: 'Home',
    navLevels: 'Levels',
    navTest: 'Tests',
    navMistakes: 'Mistakes',
    navProgress: 'Progress',
    brandSub: 'English Grammar',
    navAria: 'Primary navigation',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    toLightTheme: 'Switch to light theme',
    toDarkTheme: 'Switch to dark theme',
    boot: 'Preparing local database…',
    footerBrand: 'Lingua · English Grammar',
    footerCreditLead: 'Created by',
    footerCreditYear: '2026',
    unit: 'Unit',
    section: 'section',
    sections: 'sections',
    example: 'example',
    examples: 'examples',
    topic: 'topic',
    topics: 'topics',
    question: 'question',
    questions: 'questions',
    completed: 'Completed',
    started: 'Not started',
    quiz: 'Quiz',
    best: 'Best',
    correct: 'correct',
    score: 'Score',
    nextQuestion: 'Next Question',
    seeResult: 'See Result',
    retry: 'Try Again',
    correctFeedback: 'Correct! ',
    explanation: 'Explanation: ',
    resultGreat: 'Excellent. You have a strong command of this topic.',
    resultOk: 'Good progress. Review a few points and try again.',
    resultLow: 'No problem. Review the lesson and try again.',
    searchPlaceholder: 'Search topics',
    searchAria: 'Search topics',
    clearSearch: 'Clear search',
    searchResults: 'Search results',
    noTopicFound: 'No topic found',
    soon: 'Soon',
  },
}

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : 'tr'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((value) => (value === 'tr' ? 'en' : 'tr')),
      t: (key) => DICTIONARY[language][key] ?? DICTIONARY.tr[key] ?? key,
    }),
    [language]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
