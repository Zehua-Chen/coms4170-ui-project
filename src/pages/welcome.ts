import otamatone from "../components/otamatone";

export default function welcome() {
  try {
    otamatone($("#otamatone"), {});
  } catch (e) {
    console.error(e);
  }

  $("#start").on("click", () => {
    console.log("start")
    window.location.href = "/learn/1";
  });
}
