import doAudio from "./do.mp3";
import reAudio from "./re.mp3";
import miAudio from "./mi.mp3";
import faAudio from "./fa.mp3";
import soAudio from "./so.mp3";
import laAudio from "./la.mp3";
import tiAudio from "./ti.mp3";

type Audios = { [position in number]: string };

const audios: Audios = {
  7: tiAudio,
  6: laAudio,
  5: soAudio,
  4: faAudio,
  3: miAudio,
  2: reAudio,
  1: doAudio,
};

export default audios;
