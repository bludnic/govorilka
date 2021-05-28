// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
// @source https://github.com/mui-org/material-ui/blob/master/docs/src/pages/components/autocomplete/CountrySelect.js#L9
export function countryToFlag(isoCode: string): string {
    return typeof String.fromCodePoint !== 'undefined'
        ? isoCode
              .toUpperCase()
              .replace(/./g, (char) =>
                  String.fromCodePoint(char.charCodeAt(0) + 127397),
              )
        : isoCode;
}
