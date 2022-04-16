import navbar from "../components/navbar";
import sidebar from "../components/sidebar";
import otamatone from "../components/otamatone";

export default function learn() {
  navbar({ active: "Music Scale" });
  const { data } = window.App;

  if (!data) {
    throw Error("window.App.data should not be undefined");
  }

  if (data.type !== "learn") {
    throw Error(`expect data type to be 'learn', got ${data.type}`);
  }

  $("#next").on("click", () => {
    alert(`Next page ${data.id + 1}`);
  });

  sidebar({ elements: ["Do", "Re", "Mi"], active: "Do" });
  otamatone($("#otamatone"), {});
}
