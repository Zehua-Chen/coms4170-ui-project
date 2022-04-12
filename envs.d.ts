type PageFunction = (...args: any[]) => void;

interface AppNamespace {
  welcome: PageFunction;
  learn: PageFunction;
}

interface Window {
  App: AppNamespace;
}
