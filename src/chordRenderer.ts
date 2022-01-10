import { registerWindow, Svg, SVG } from '@svgdotjs/svg.js';
import { ChordDefine } from './chordDefine';
import { ChordFinger, ChordToFingerConverter } from './chordToFingerConverter';
const { createSVGWindow } = require('svgdom');

export class Renderer {
  static readonly CANVAS_W = 150;
  static readonly CANVAS_H = 100;
  static readonly OFFSET_X = 25;
  static readonly OFFSET_Y = 25;
  static readonly FIG_W = 100;
  static readonly FIG_H = 50;
  static readonly STRINGS_NUMBER = 4;
  static readonly FLET_NUMBER = 5;
  static readonly STROKE_THIN = 1;
  static readonly STROKE_BOLD = 5;
  static readonly FINGER_RADIUS = 5;
  static readonly FONT_SIZE = Math.ceil(Renderer.FINGER_RADIUS * 1.75);

  static getSVG (chord: ChordDefine) {
  // setup
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);
    const canvas = SVG().size(Renderer.CANVAS_W, Renderer.CANVAS_H);

    // draw string, flet
    Renderer.drawBackGround(canvas);

    // draw finger position
    Renderer.drawFingers(canvas, chord);

    // return svg string
    return canvas.svg();
  }

  private static drawBackGround (canvas : Svg) {
    for (let i = 0; i < Renderer.STRINGS_NUMBER; i++) {
      const y = (Renderer.FIG_H / (Renderer.STRINGS_NUMBER - 1)) * i;
      canvas
        .line(0, y, Renderer.FIG_W, y)
        .stroke({ color: '#000', linecap: 'square', width: Renderer.STROKE_THIN })
        .dmove(Renderer.OFFSET_X, Renderer.OFFSET_Y);
    }
    for (let i = 0; i < Renderer.FLET_NUMBER; i++) {
      const x = (Renderer.FIG_W / Renderer.FLET_NUMBER) * i;
      const dx = i === 0 ? Renderer.STROKE_BOLD / 2 : 0;
      const dy = i === 0 ? Renderer.STROKE_THIN / 2 : 0;
      const strokeWidth = i === 0 ? Renderer.STROKE_BOLD : Renderer.STROKE_THIN;
      canvas
        .line(x - dx, -dy, x - dx, Renderer.FIG_H + dy)
        .stroke({ color: '#000', width: strokeWidth })
        .dmove(Renderer.OFFSET_X, Renderer.OFFSET_Y);
    }
  }

  private static drawFingers (canvas: Svg, chord: ChordDefine) {
    const fingers = ChordToFingerConverter.getFingers(chord);
    fingers.forEach(finger => this.drawFinger(canvas, finger));
  }

  private static drawFinger (canvas: Svg, finger: ChordFinger) {
    const x = (Renderer.FIG_W / Renderer.FLET_NUMBER) * (finger.flet - 0.5);
    const y1 = (Renderer.FIG_H / (Renderer.STRINGS_NUMBER - 1)) * finger.strings;
    const y2 = (Renderer.FIG_H / (Renderer.STRINGS_NUMBER - 1)) * (finger.strings + finger.barre - 1);
    // draw finger line
    canvas
      .line(x, y1, x, y2)
      .stroke({ color: '#f06', linecap: 'round', width: Renderer.FINGER_RADIUS * 2 })
      .dmove(Renderer.OFFSET_X, Renderer.OFFSET_Y);
    // draw finger number
    const text = canvas
      .text(finger.finger + '')
      .text(finger.finger + '')
      .font({ fill: '#fff', family: 'monospace', size: Renderer.FONT_SIZE });
    const bbox = text.bbox();
    text
      .move(x - bbox.width / 2, y2 - bbox.height / 2)
      .dmove(Renderer.OFFSET_X, Renderer.OFFSET_Y);
  }
}
