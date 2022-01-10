import { ChordDefine } from './chordDefine';
import { CHRORD_LISTS_C } from './chordLists/00_C';
import { CHRORD_LISTS_CS_DF } from './chordLists/01_C#Db';
import { CHRORD_LISTS_B } from './chordLists/11_B';
import { CHRORD_LISTS_D } from './chordLists/02_D';
import { CHRORD_LISTS_DS_EF } from './chordLists/03_D#Eb';
import { CHRORD_LISTS_E } from './chordLists/04_E';
import { CHRORD_LISTS_F } from './chordLists/05_F';
import { CHRORD_LISTS_FS_GF } from './chordLists/06_F#Gb';
import { CHRORD_LISTS_G } from './chordLists/07_G';
import { CHRORD_LISTS_GS_AF } from './chordLists/08_G#Ab';
import { CHRORD_LISTS_A } from './chordLists/09_A';
import { CHRORD_LISTS_AS_BF } from './chordLists/10_A#Bb';

export const CHRORD_LISTS: ChordDefine[] = [
  ...CHRORD_LISTS_C,
  ...CHRORD_LISTS_CS_DF,
  ...CHRORD_LISTS_D,
  ...CHRORD_LISTS_DS_EF,
  ...CHRORD_LISTS_E,
  ...CHRORD_LISTS_F,
  ...CHRORD_LISTS_FS_GF,
  ...CHRORD_LISTS_G,
  ...CHRORD_LISTS_GS_AF,
  ...CHRORD_LISTS_A,
  ...CHRORD_LISTS_AS_BF,
  ...CHRORD_LISTS_B
];
