import { OptionValues } from 'commander';

// default value
const strings = 4;
const frets = 5;
const offsetx = 8;
const offsety = 8;
const canvasw = 128;
const canvash = canvasw * (strings - 1) / frets;
const figw = canvasw - offsetx * 2;
const figh = canvash - offsety * 2;
const strokethin = 1;
const strokebold = 5;
const strokecolor = '#000';
const fingerradius = 7;
const fingercolor = '#f06';
const fontsize = fingerradius * 1.75;
const fontcolor = '#fff';

export const ChordDefaultOptions: OptionValues = {
  strings,
  frets,
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
