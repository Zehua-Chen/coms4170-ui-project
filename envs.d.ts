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
    position_to_click: number;
  }

  interface LearnData {
    type: "learn";
    lesson: Lesson;
    lessons_overview: string[];
  }

  interface Practice {
    id: number;
    positions_to_click: number[];
  }

  interface PracticeData {
    type: "practice";
    practice: Practice;
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
  practice: app.PageFunction;
}

interface Window {
  App: AppNamespace;
}

interface ImportMeta {
  env: {
    MODE: "development" | "production";
  };
}
