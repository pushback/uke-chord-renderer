import { OptionValues } from 'commander';

// default value
const strokethin = 1;
const strokebold = 5;
const strokecolor = '#000';
const fingerradius = 7;
const fingercolor = '#f06';
const fontsize = fingerradius * 1.75;
const fontcolor = '#fff';

const strings = 4;
const frets = 12;
const viewfrets = 5;
const offsetx = 8;
const offsety = Math.ceil(fontsize + 0.5);
const canvasw = 128;
const canvash = canvasw * (strings - 0.5) / viewfrets;
const figw = (canvasw - offsetx) * frets / viewfrets - strokethin / 2;
const figh = canvash - offsety * 2 - fontsize;

export const ChordDefaultOptions: OptionValues = {
  strings,
  frets,
  viewfrets,
  canvasw,
  canvash,
  figw,
  figh,
  offsetx,
  offsety,
  strokethin,
  strokebold,
  strokecolor,
  fingerradius,
  fingercolor,
  fontsize,
  fontcolor
};
