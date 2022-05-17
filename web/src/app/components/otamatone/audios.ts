/**
 * Map position on the otamatone stick to audio files
 */
export type AudioFiles = { [position in number]: string };

const audios: AudioFiles = {
  7: 'assets/audios/ti.mp3',
  6: 'assets/audios/la.mp3',
  5: 'assets/audios/so.mp3',
  4: 'assets/audios/fa.mp3',
  3: 'assets/audios/mi.mp3',
  2: 'assets/audios/re.mp3',
  1: 'assets/audios/do.mp3',
};

export default audios;
