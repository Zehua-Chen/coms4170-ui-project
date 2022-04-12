function page() {
  console.log("page");
}
window.App = {
  index(root = "app") {
    const rootElement = document.getElementById(root);
    rootElement.innerText = "hello world";
    page();
  }
};
