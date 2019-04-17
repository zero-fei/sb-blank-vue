module.exports = {
  presets: [
    '@vue/app',
    ["@babel/env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "ie >= 10"]
      },
      "useBuiltIns": "usage",
      "debug": false
    }],
  ],
  plugins: ["@babel/transform-runtime"]
};
