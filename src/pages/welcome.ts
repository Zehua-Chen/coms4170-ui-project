import otamatone from "../components/otamatone";

export default function welcome() {
  otamatone($("#otamatone"), {});

  $("#start").on("click", () => {
    window.location.href = "/learn/1";
  });
}
