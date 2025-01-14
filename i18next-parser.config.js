module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'common',
  defaultValue: '',
  indentation: 2,
  keepRemoved: false,
  keySeparator: '.',
  lineEnding: 'auto',
  locales: ['en', 'fi', 'sv'],
  namespaceSeparator: ':',
  output: 'src/i18n/$LOCALE/$NAMESPACE.json',
  pluralSeparator: '_',
  input: ['src/**/*.{ts,tsx,js,jsx}'],
  sort: true,
  skipDefaultValues: (locale) => locale !== 'en',
  useKeysAsDefaultValue: false,
  verbose: false,
  failOnWarnings: false,
  failOnUpdate: false,
  customValueTemplate: null,
  resetDefaultValueLocale: 'en',
  i18nextOptions: {},
  transSupportBasicHtmlNodes: true,
};

