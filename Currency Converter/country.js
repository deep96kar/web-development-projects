const allCountryList = {
  USD: "US",
  INR: "IN",
  EUR: "FR",
  GBP: "GB",
  JPY: "JP",
  AUD: "AU",
  CAD: "CA",
  CNY: "CN",
  SGD: "SG",
  RUB: "RU",
  PKR: "PK",
  BDT: "BD",
  NPR: "NP",
  LKR: "LK",
  AED: "AE",
  SAR: "SA",
  NZD: "NZ",
  HKD: "HK",
  ZAR: "ZA",
  KRW: "KR",
  NOK: "BV",
  SEK: "SE",
  DKK: "DK",
  PLN: "PL",
  BRL: "BR",
  MXN: "MX"
};

// currency metadata
const currencyMeta = {
  USD: { name: 'United States Dollar', country: 'United States' },
  INR: { name: 'Indian Rupee', country: 'India' },
  EUR: { name: 'Euro', country: 'European Union' },
  GBP: { name: 'British Pound', country: 'United Kingdom' },
  JPY: { name: 'Japanese Yen', country: 'Japan' },
  AUD: { name: 'Australian Dollar', country: 'Australia' },
  CAD: { name: 'Canadian Dollar', country: 'Canada' },
  CNY: { name: 'Chinese Yuan', country: 'China' },
  SGD: { name: 'Singapore Dollar', country: 'Singapore' },
  RUB: { name: 'Russian Ruble', country: 'Russia' },
  PKR: { name: 'Pakistani Rupee', country: 'Pakistan' },
  BDT: { name: 'Bangladeshi Taka', country: 'Bangladesh' },
  NPR: { name: 'Nepalese Rupee', country: 'Nepal' },
  LKR: { name: 'Sri Lankan Rupee', country: 'Sri Lanka' },
  AED: { name: 'United Arab Emirates Dirham', country: 'United Arab Emirates' },
  SAR: { name: 'Saudi Riyal', country: 'Saudi Arabia' },
  NZD: { name: 'New Zealand Dollar', country: 'New Zealand' },
  HKD: { name: 'Hong Kong Dollar', country: 'Hong Kong' },
  ZAR: { name: 'South African Rand', country: 'South Africa' },
  KRW: { name: 'South Korean Won', country: 'South Korea' },
  NOK: { name: 'Norwegian Krone', country: 'Norway' },
  SEK: { name: 'Swedish Krona', country: 'Sweden' },
  DKK: { name: 'Danish Krone', country: 'Denmark' },
  PLN: { name: 'Polish Zloty', country: 'Poland' },
  BRL: { name: 'Brazilian Real', country: 'Brazil' },
  MXN: { name: 'Mexican Peso', country: 'Mexico' }
};

// Auto-filter: Only export currencies that have metadata
export const countryList = Object.fromEntries(
  Object.entries(allCountryList).filter(([code]) => currencyMeta[code])
);

export { currencyMeta };
console.log(countryList)
