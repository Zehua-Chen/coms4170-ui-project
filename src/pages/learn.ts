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

  const { lessons_overview, lesson } = data;
  const { position_to_click } = lesson;

  const nextLesson = lesson.id + 1;

  $("#next").on("click", () => {
    if (nextLesson <= lessons_overview.length) {
      window.location.href = `/learn/${nextLesson}`;
    } else {
      window.location.href = "/practice/1";
    }
  });

  sidebar(
    { elements: lessons_overview, active: lesson.note },
    (id) => `/learn/${id}`
  );

  otamatone($("#otamatone"), {
    positions: [position_to_click],
    onPlay: (position) => {
      if (position === position_to_click) {
        $("#next").removeAttr("disabled");
      }
    },
  });
}
