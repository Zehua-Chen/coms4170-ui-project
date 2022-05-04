import { observable, autorun, action } from "mobx";
import navbar from "../components/navbar";
import otamatone from "../components/otamatone";
import sidebar from "../components/sidebar";
import { equals } from "../utils";

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

  const positions = observable([] as number[]);

  autorun(() => {
    $("#user-inputs").empty().append(positions.join(", "));
    $("#progress").text(
      `${positions.length} out of ${positions_to_click.length} notes`
    );

    if (positions.length === 0) {
      $("#next").attr("disabled", "disabled");
    } else {
      $("#next").removeAttr("disabled");
    }
  });

  $("#next").on("click", () => {
    if (equals(positions, positions_to_click)) {
      if (nextID > practices_overview.length) {
        window.location.href = "/quiz/1";
      } else {
        window.location.href = `/practice/${nextID}`;
      }
    } else {
      alert("Please try again!");
    }

    // if (nextID > practices_overview.length) {
    //   window.location.href = "/quiz/1";
    // } else {
    //   window.location.href = `/practice/${nextID}`;
    // }
  });

  $("#redo").on(
    "click",
    action(() => {
      positions.splice(0, positions.length);
    })
  );

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
    onPlay: action((position) => {
      positions.push(position);

      if (positions.length > positions_to_click.length) {
        positions.splice(0, positions.length);
        positions.push(position);
      }
    }),
  });

  sidebar(
    { elements: practices_overview, active: practice.title },
    (id) => `/practice/${id}`
  );
}

export default practice;
