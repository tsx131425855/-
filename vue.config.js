"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title;
const port = 9528;

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    disableHostCheck: true, // 跳过检查
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      "/api": {
        target: defaultSettings.LinkPath,
        pathRewrite: {
          "^/api": "/"
        },
        changeOrigin: true
      },
      "/proxy/": {
        target:
          "http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp", // 访问淘宝时间
        changeOrigin: true, // 跨域访问设置，true代表跨域
        pathRewrite: {
          // 路径改写规则
          "^/proxy": "" // 以/proxy/为开头的改写为''
        }
      }
    }
    // public: defaultSettings.LinkPath
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    // 预先加载模块 禁用 不然会进入首页加载全部的路由
    config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader 通过vue-cli脚手架创建的项目默认情况下会使用 url-loader 对svg进行处理
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", config =>
        config.devtool("cheap-source-map")
      );

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // runtime`必须与runtimechunk名称相同。默认值为“runtime”`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial"
          },
          elementUI: {
            name: "chunk-elementUI", // 文件名
            priority: 20, // 层级
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // 可以自定义规则
            minChunks: 3, //  最小公共数
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
