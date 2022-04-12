type PageFunction = (root: string) => void;

interface AppNamespace {
  welcome: PageFunction;
}

interface Window {
  App: AppNamespace;
}
