import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";

export default {
    mode: "production",
    entry: "./src/index.js",
    output: {
        filename: "index.js",
        path: path.resolve(import.meta.dirname, "dist"),
        clean:true,
    },
    devtool: "eval-source-map",
    devServer:{
        watchFiles: ["./src/index.html"]
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./src/index.html"})
    ],
    module:{
        rules:[
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.html$/i,
                use: ["html-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            }
        ]
    }
}