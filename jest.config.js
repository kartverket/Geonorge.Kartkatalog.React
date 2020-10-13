const {defaults} = require('jest-config');
module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions],
  transformIgnorePatterns: ["node_modules/(?!(ol|r_map|react-dropdown-tree-select|bootstrap)/).*/"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|scss|less)$": "identity-obj-proxy"
  }
};