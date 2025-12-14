import { createI18n } from 'vue-i18n'
import ko from './locales/ko.json'
import en from './locales/en.json'

// const savedLocale = localStorage.getItem('locale') || 'ko'
const getDefaultLocale = () => {
  // const saved = localStorage.getItem('locale')
  // if (saved) return saved

  const lang = navigator.language || navigator.userLanguage
  return lang.startsWith('ko') ? 'ko' : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    ko,
    en,
  },
})

export default i18n
