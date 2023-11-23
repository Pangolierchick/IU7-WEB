/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  verbose: true,
  randomize: true,
  collectCoverage: true,
  testEnvironment: "allure-jest/node",
  testEnvironmentOptions: {
    resultsDir: "./allure-results",
  },
};
