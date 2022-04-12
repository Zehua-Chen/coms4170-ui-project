window.App = {
  welcome(root: string) {
    import("./welcome").then((welcome) => welcome.default(root));
  },
};
