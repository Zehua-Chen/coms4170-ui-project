import { observable, autorun, action } from "mobx";
import navbar from "../components/navbar";
import otamatone from "../components/otamatone";
import sidebar from "../components/sidebar";

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
  const positions = observable([] as number[]);

  autorun(() => {
    $("#user-inputs").empty().append(positions.join(", "));

    if (positions.length === 0) {
      $("#next").attr("disabled", "disabled");
    } else {
      $("#next").removeAttr("disabled");
    }
  });

  $("#next").on("click", async (e) => {
    e.preventDefault();

    await fetch(`/quiz/submit/${id}`, {
      method: "POST",
      body: JSON.stringify(positions),
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

  $("#redo").on(
    "click",
    action((e: JQuery.ClickEvent) => {
      e.preventDefault();

      positions.splice(0, positions.length);
    })
  );

  $("#clip")
    .empty()
    .append(
      $("<audio controls />").append(
        $("<source />")
          .attr("src", `/quiz/clip/${id}`)
          .attr("type", "audio/mpeg")
      )
    );

  otamatone($("#otamatone"), {
    onPlay: action((position) => {
      positions.push(position);
    }),
  });

  sidebar({ elements: quizzes_overview, active: quiz.title });
}

export default practice;
