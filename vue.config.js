module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/variables.scss";
          @import "@/styles/global.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Translate | Appknox";
      return args;
    });
  }
};
