require("dotenv").config();
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = webpack.container;

//mfe child config
module.exports = {
    entry: "./src/main.tsx",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].[contenthash].js",
        chunkFilename: "[name].[contenthash].js",
        uniqueName: "certificate_mfe",
        clean: true,
        publicPath: "http://localhost:5176/",
    },
    devServer: {
        hot: true, // Must be enabled
        liveReload: true,
        open: ["/"],
        static: {
            directory: path.join(__dirname, "public"),
        },
        port: 5176,
        compress: true,
        historyApiFallback: true,
        allowedHosts: "all",
        webSocketServer: false,
        client: {
            overlay: {
                errors: true,
                warnings: true,
                runtimeErrors: true,
            },
        },
        headers: {
            "Access-Control-Allow-Origin": "*", // Critical for cross-origin loading
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    resolve: {
        symlinks: false,
        fallback: {
            // stream: require.resolve("stream-browserify"),
            // zlib: require.resolve("browserify-zlib"),
            // http: require.resolve("stream-http"),
            // crypto: require.resolve("crypto-browserify"),
            // os: require.resolve("os-browserify/browser"),
            // https: require.resolve("https-browserify"),
            // buffer: require.resolve("buffer/"),
            // assert: require.resolve("assert/"),
            // url: require.resolve("url/"),
            symlinks: false,
        },
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|ico|ttf|woff2|eot|woff)$/,
                use: ["file-loader?name=[name].[ext]"],
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            '@babel/preset-typescript'
                        ],
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx|mjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, "postcss.config.cjs")
                            }
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: ["@svgr/webpack", "url-loader"],
            },
            {
                test: /\.mjs/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: "async",
        },
        minimize: false,
        usedExports: true,
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.html"),
            publicPath: "/",
        }),

        // new webpack.ProvidePlugin({
        //     Buffer: ["buffer", "Buffer"],
        //     process: "process/browser",
        //     assert: "assert",
        // }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
