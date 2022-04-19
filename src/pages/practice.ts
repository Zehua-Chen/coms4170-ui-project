import navbar from "../components/navbar";
import otamatone from "../components/otamatone";
import sidebar from "../components/sidebar";

function practice(): void {
  navbar({ active: "Practice" });
  const { data } = window.App;

  if (!data) {
    throw Error("window.App.data should not be undefined");
  }

  if (data.type !== "practice") {
    throw Error(`expect data type to be 'learn', got ${data.type}`);
  }

  const { practice, practices_overview } = data;
  const { id, positions_to_click } = practice;

  const nextID = id + 1;
  const positionsClicked: number[] = [];

  $("#next").on("click", () => {
    if (nextID > practices_overview.length) {
      window.location.href = "/quiz/1";
    } else {
      window.location.href = `/practice/${nextID}`;
    }
  });

  const audio = new Audio(`/practice/clip/${id}.mp3`);

  $("#clip")
    .empty()
    .append(
      $("<audio controls />").append(
        $("<source />")
          .attr("src", `/practice/clip/${id}.mp3`)
          .attr("type", "audio/mpeg")
      )
    );

  otamatone($("#otamatone"), {
    onPlay(position) {
      positionsClicked.push(position);

      console.log(positions_to_click);

      if (
        JSON.stringify(positionsClicked) === JSON.stringify(positions_to_click)
      ) {
        $("#next").removeAttr("disabled");
      }
    },
  });

  sidebar({ elements: practices_overview, active: practice.title });
}

export default practice;
