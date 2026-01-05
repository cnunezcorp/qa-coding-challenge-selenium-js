module.exports = {
  default: {
    require: ['src/test/js/stepDefinitions/**/*.js'],
    format: [
      'progress-bar',
      ['json', { file: 'allure-results/cucumber-report.json' }],
      ['html', { file: 'reports/cucumber-report.html' }],
      ['@cucumber/pretty-formatter', { file: 'reports/cucumber-pretty.txt' }]
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true
  }
};

