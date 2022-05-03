module "*.module.scss" {
  declare const classes: { [className in string]: string };
  export default classes;
}

module "*.mp3" {
  declare const url: string;
  export default url;
}

namespace app {
  type PageFunction = (...args: any[]) => Promise<any>;

  interface OverviewItem {
    id: number;
    name: string;
  }

  interface Lesson {
    id: number;
    note: string;
    position_to_click: number;
  }

  interface LearnData {
    type: "learn";
    lesson: Lesson;
    lessons_overview: OverviewItem[];
  }

  interface Practice {
    id: number;
    title: string;
    positions_to_click: number[];
  }

  interface PracticeData {
    type: "practice";
    practice: Practice;
    practices_overview: OverviewItem[];
  }

  interface Quiz {
    id: number;
    title: string;
  }

  interface QuizData {
    type: "quiz";
    quiz: Quiz;
    quizzes_overview: OverviewItem[];
  }

  type Data = LearnData | PracticeData | QuizData;
}

interface AppNamespace {
  data?: app.Data;
  welcome: app.PageFunction;
  learn: app.PageFunction;
  practice: app.PageFunction;
  quiz: app.PageFunction;
  finish: app.PageFunction;
}

interface Window {
  App: AppNamespace;
}

interface ImportMeta {
  env: {
    MODE: "development" | "production";
  };
}
