const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.resolver.assetExts = Array.from(new Set([...config.resolver.assetExts, 'ttf', 'otf']));

module.exports = config;
