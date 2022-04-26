import navbar from "../components/navbar";
import otamatone from "../components/otamatone";
import sidebar from "../components/sidebar";

function renderUserInputs(inputs: number[]) {
  $("#user-inputs")
    .empty()
    .append(inputs.map((input) => $("<span />").text(input)));
}

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

  $("#clip")
    .empty()
    .append(
      $("<audio controls />").append(
        $("<source />")
          .attr("src", `/practice/clip/${id}`)
          .attr("type", "audio/mpeg")
      )
    );

  otamatone($("#otamatone"), {
    onPlay(position) {
      positionsClicked.push(position);

      if (positionsClicked.length > positions_to_click.length) {
        positionsClicked.splice(0, positionsClicked.length);
        positionsClicked.push(position);
      }

      renderUserInputs(positionsClicked);

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
