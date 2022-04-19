import "./index.scss";

window.App = {
  welcome() {
    import("./pages/welcome").then((welcome) => welcome.default());
  },
  learn() {
    import("./pages/learn").then((learn) => learn.default());
  },
  practice() {
    import("./pages/practice").then((learn) => learn.default());
  },
  quiz() {
    import("./pages/test").then((learn) => learn.default());
  },
};
