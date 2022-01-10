import { ChordDefine } from './chordDefine';

export interface ChordFinger{
  finger: number;
  flet: number;
  strings: number;
  barre: number;
}

export class ChordToFingerConverter {
  static getFingers (chord: ChordDefine) : ChordFinger[] {
    const results: ChordFinger[] = [];
    const ignoreFingers: number[] = [];

    chord.fingers.forEach((x, strings) => {
      const fingers: number[] = toArrayIfNot(x);
      const flets: number[] = toArrayIfNot(chord.flets[strings]);
      fingers.forEach((finger, idx) => {
        if (finger === 0 || ignoreFingers.includes(finger)) {
          return;
        }
        ignoreFingers.push(finger);
        const flet = flets[idx];
        const barre = chord.fingers
          .slice(strings)
          .filter(x => Array.isArray(x) ? x.includes(finger) : x === finger)
          .length;
        results.push(
          {
            finger,
            flet,
            strings,
            barre
          }
        );
      });
    });

    return results;
  }
}

function toArrayIfNot<T> (x: T | T[]) : T[] {
  if (Array.isArray(x)) {
    return x;
  } else {
    return [x];
  }
}
