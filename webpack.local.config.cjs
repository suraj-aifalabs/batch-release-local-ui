const { merge } = require("webpack-merge");
const webpack = require("webpack");
const commonConfig = require("./webpack.config.cjs");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;

const extraConfig = merge(commonConfig, {
    mode: "development",
    output: {
        publicPath: "http://localhost:5176/",
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "certificate_mfe",
            filename: "remoteEntry.js",
            exposes: {
                "./App": "./src/App.tsx",
                './QCManagement': './src/pages/config/QCManagement.tsx',
                './ViewPdf': './src/pages/release_page/ViewPdf.tsx',
            },
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: '19.1.0',
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: '19.1.0',
                },
                'react-redux': {
                    singleton: true,
                    requiredVersion: '9.2.0',
                },
            },
        }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify({
                API_URL: "http://localhost:3003",
            }),
        }),
    ],
});

module.exports = extraConfig;
