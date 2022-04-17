module "*.module.scss" {
  declare const classes: { [className in string]: string };
  export default classes;
}

module "*.mp3" {
  declare const url: string;
  export default url;
}

type PageFunction = (...args: any[]) => void;

interface LearnData {
  type: "learn";
  id: number;
}

interface QuizData {
  type: "quiz";
}

type Data = LearnData | QuizData;

interface AppNamespace {
  data?: Data;
  welcome: PageFunction;
  learn: PageFunction;
}

interface Window {
  App: AppNamespace;
}

interface ImportMeta {
  env: {
    MODE: "development" | "production";
  };
}
