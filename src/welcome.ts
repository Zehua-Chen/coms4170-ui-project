import otamatone from "./components/otamatone";

export default function welcome(id: string = "app") {
  const update = () => {
    otamatone($("#app"), {});

    setTimeout(update, 1000);
  };

  setTimeout(update);
}
