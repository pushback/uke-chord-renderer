import { argv } from 'node:process';
import { ChordDetail } from './chordDetail';
import { Renderer } from './renderer';

const chord = argv[2];
const chordDetail = getChordDetail(chord);
console.log(Renderer.getSVG(chordDetail));

function getChordDetail (chord: string) : ChordDetail {
  return {
    name: chord,
    flets: [3, 3, 3, [3, 5]],
    fingers: [1, 1, 1, [1, 3]]
  };
}