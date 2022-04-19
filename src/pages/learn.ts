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

  const { lessons_overview: lessons_summary, lesson } = data;

  $("#next").on("click", () => {
    alert(`Next page ${lesson.id + 1}`);
  });

  sidebar({ elements: lessons_summary, active: lesson.note });
  otamatone($("#otamatone"), {});
}
