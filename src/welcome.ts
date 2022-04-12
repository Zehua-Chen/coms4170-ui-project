export default function welcome(id: string = "app") {
  const rootElement = document.getElementById(id);
  rootElement.innerText = "hello world";
}
