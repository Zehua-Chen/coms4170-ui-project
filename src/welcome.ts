export default function welcome(id: string = "app") {
  const rootElement = document.getElementById(id);

  if (!rootElement) {
    return;
  }

  rootElement.innerText = "hello world";
}
