window.App = {
  welcome() {
    import("./pages/welcome").then((welcome) => welcome.default());
  },
  learn() {
    import("./pages/learn").then((learn) => learn.default());
  },
};
