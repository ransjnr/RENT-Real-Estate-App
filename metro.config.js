const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(
  config,
  { input: "./app/globals.css" },
  {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "app"),
        "@/constants": path.resolve(__dirname, "constants"),
        "@/assets": path.resolve(__dirname, "assets"),
        "@/components": path.resolve(__dirname, "components"),
        "@/hooks": path.resolve(__dirname, "hooks"),
        "@/utils": path.resolve(__dirname, "utils"),
        "@/types": path.resolve(__dirname, "types"),
      },
    },
  }
);
