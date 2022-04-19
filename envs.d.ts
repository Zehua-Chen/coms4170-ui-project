module "*.module.scss" {
  declare const classes: { [className in string]: string };
  export default classes;
}

module "*.mp3" {
  declare const url: string;
  export default url;
}

namespace app {
  type PageFunction = (...args: any[]) => void;

  interface Lesson {
    id: number;
    note: string;
  }

  interface LearnData {
    type: "learn";
    lesson: Lesson;
    lessons_overview: string[];
  }

  interface QuizData {
    type: "quiz";
  }

  type Data = LearnData | QuizData;
}

interface AppNamespace {
  data?: app.Data;
  welcome: app.PageFunction;
  learn: app.PageFunction;
}

interface Window {
  App: AppNamespace;
}

interface ImportMeta {
  env: {
    MODE: "development" | "production";
  };
}
