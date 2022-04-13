import "./learn.css";
import navbar from "../components/navbar";

export default function learn() {
  navbar({ active: "Music Scale" });

  $("#next").on("click", () => {
    alert("Next page");
  });
}
