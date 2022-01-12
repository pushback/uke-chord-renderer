import { G, registerWindow, SVG } from '@svgdotjs/svg.js';
import { ChordDefine } from './chordDefine';
import { ChordFinger, ChordToFingerConverter } from './chordToFingerConverter';
import { OptionValues } from 'commander';
import { ChordDefaultOptions } from './chordDefaultOptions';
const { createSVGWindow } = require('svgdom');

export class ChordRenderer {
  options: OptionValues = ChordDefaultOptions;

  constructor (options: OptionValues) {
    this.options = Object.entries(options).reduce((acc, cur) => {
      const n = typeof cur[1] === 'string' ? Number(cur[1]) : cur[1];
      return {
        ...acc,
        [cur[0]]: isNaN(n) ? cur[1] : n
      };
    }, this.options);
  }

  public getSVG (chord: ChordDefine) {
    // setup
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);
    const canvas = SVG().size(this.options.canvasw, this.options.canvash);
    const group = canvas.group();

    // draw string, fret
    group.add(this.drawBackGround());

    // draw finger position
    group.add(this.drawFingers(chord));

    // rotate when vertical
    if (this.options.vertical) {
      canvas.size(this.options.canvash, this.options.canvasw);
      group
        .center(this.options.canvash / 2, this.options.canvasw / 2)
        .rotate(90);
    }

    // return svg string
    return canvas.svg();
  }

  private drawBackGround () {
    const group = new G();

    for (let i = 0; i < this.options.strings; i++) {
      const y = (this.options.figh / (this.options.strings - 1)) * i;
      group
        .line(0, y, this.options.figw, y)
        .stroke({ color: '#000', linecap: 'square', width: this.options.strokethin });
    }
    for (let i = 0; i < this.options.frets; i++) {
      const x = (this.options.figw / this.options.frets) * i;
      const dx = i === 0 ? this.options.strokebold / 2 : 0;
      const dy = i === 0 ? this.options.strokethin / 2 : 0;
      const width = i === 0 ? this.options.strokebold : this.options.strokethin;
      group
        .line(x - dx, -dy, x - dx, this.options.figh + dy)
        .stroke({ color: this.options.strokecolor, width });
    }

    // slide offset
    return group.dmove(this.options.offsetx, this.options.offsety);
  }

  private drawFingers (chord: ChordDefine) {
    const group = new G();
    const fingers = ChordToFingerConverter.getFingers(chord);
    fingers.forEach(finger => group.add(this.drawFinger(finger)));

    return group;
  }

  private drawFinger (finger: ChordFinger) {
    const group = new G();
    const x = (this.options.figw / this.options.frets) * (finger.fret - 0.5);
    const y1 = (this.options.figh / (this.options.strings - 1)) * finger.strings;
    const y2 = (this.options.figh / (this.options.strings - 1)) * (finger.strings + finger.barre - 1);
    // draw finger line
    group
      .line(x, y1, x, y2)
      .stroke({ color: this.options.fingercolor, linecap: 'round', width: this.options.fingerradius * 2 });
    // draw finger number
    const text = group
      .text(finger.finger + '')
      .text(finger.finger + '')
      .font({ fill: this.options.fontcolor, family: 'monospace', size: this.options.fontsize });
    const bbox = text.bbox();
    text.move(x - bbox.width / 2, y2 - bbox.height / 2);

    // rotate when vertical
    if (this.options.vertical) {
      text.rotate(-90);
    }

    // slide offset
    return group.dmove(this.options.offsetx, this.options.offsety);
  }
}
