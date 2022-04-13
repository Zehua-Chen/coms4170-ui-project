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
