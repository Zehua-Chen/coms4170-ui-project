import "./index.scss";

window.App = {
  async welcome() {
    const { default: welcome } = await import("./pages/welcome");
    welcome();
  },
  async learn() {
    const { default: learn } = await import("./pages/learn");
    learn();
  },
  async practice() {
    const { default: practice } = await import("./pages/practice");
    practice();
  },
  async quiz() {
    const { default: quiz } = await import("./pages/quiz");
    quiz();
  },
  async finish() {
    const { default: finish } = await import("./pages/finish");
    finish();
  },
};
