import navbar from "../components/navbar";
import otamatone from "../components/otamatone";
import sidebar from "../components/sidebar";

function userInputs(inputs: number[]) {
  $("#user-inputs")
    .empty()
    .append(inputs.map((input) => $("<span />").text(input)));
}

function practice(): void {
  navbar({ active: "Quiz" });
  const { data } = window.App;

  if (!data) {
    throw Error("window.App.data should not be undefined");
  }

  if (data.type !== "quiz") {
    throw Error(`expect data type to be 'learn', got ${data.type}`);
  }

  const { quiz, quizzes_overview } = data;
  const { id } = quiz;

  const nextID = id + 1;
  const positionsClicked: number[] = [];

  $("#next").on("click", async (e) => {
    e.preventDefault();

    await fetch(`/quiz/submit/${id}`, {
      method: "POST",
      body: JSON.stringify(positionsClicked),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (nextID > quizzes_overview.length) {
      window.location.href = "/quiz/finish";
    } else {
      window.location.href = `/quiz/${nextID}`;
    }
  });

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

      userInputs(positionsClicked);
      $("#next").removeAttr("disabled");

      // if (
      //   JSON.stringify(positionsClicked) === JSON.stringify(quiz)
      // ) {
      //   $("#next").removeAttr("disabled");
      // }
    },
  });

  sidebar({ elements: quizzes_overview, active: quiz.title });
}

export default practice;
