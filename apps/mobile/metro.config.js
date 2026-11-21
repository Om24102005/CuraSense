const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Code shared with the website (API client, translations, theme tokens) lives outside this folder, in packages/shared.
const shared = path.resolve(__dirname, '../../packages/shared/src');
config.watchFolders = [...(config.watchFolders ?? []), shared];
config.resolver.extraNodeModules = { ...(config.resolver.extraNodeModules ?? {}), '@curasense/shared': shared };

module.exports = config;
