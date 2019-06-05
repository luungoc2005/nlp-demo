import regions from './regions.json'

export const getProbabilityTagColor = (probability) => {
  if (probability > .7) {
    return 'green'
  }
  else if (probability > .3) {
    return 'orange'
  }
  else {
    return 'red'
  }
}

export const getCountryFromLanguage = (language) => {
  return regions
    .filter(item => item.indexOf(`${language}_`) === 0)
    .map(item => item.split('_')[1]);
}

// https://github.com/umpirsky/language-list/tree/master/data
const symbols = '🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿'.split(' ')
export const getFlagEmoji = (country) => {
  if (country && country.length === 2) {
    country = country.toLowerCase();
    // 97 is 'a' char code
    return `${symbols[country[0].charCodeAt() - 97]}${symbols[country[1].charCodeAt() - 97]}`
  }
  else {
    console.log(country)
    return ''
  }
}