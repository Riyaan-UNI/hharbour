import countries from "i18n-iso-countries";
import english from "i18n-iso-countries/langs/en.json";

countries.registerLocale(english);
export const countryOptions = Object.entries(countries.getNames("en"))
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function countryName(code) {
  if (!code) return "Not added";
  if (code === "OTHER") return "Another region";
  return countries.getName(code, "en") || code;
}
