window.App = {
  welcome() {
    import("./welcome").then((welcome) => welcome.default());
  },
};
