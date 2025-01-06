const configs = {
  // plugins
  plugins: ['prettier-plugin-jsdoc'],

  // prettier options
  printWidth: 160,
  quoteProps: 'consistent',
  singleAttributePerLine: true,
  singleQuote: true,

  // jsdoc options
  jsdocDescriptionWithDot: true,
  jsdocSeparateReturnsFromParam: true,
  jsdocPreferCodeFences: true,

  // overrides
  overrides: [
    // jsdoc options
    {
      files: ['*.ts', '*.tsx'],
      options: {
        tsdoc: true,
      },
    },
  ],
};

export default configs;
