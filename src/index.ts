window.App = {
  welcome(root: string) {
    import("./pages/welcome").then((welcome) => welcome.default(root));
  },
};
