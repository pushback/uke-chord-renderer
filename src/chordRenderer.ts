import { registerWindow, Svg, SVG } from '@svgdotjs/svg.js';
import { ChordDefine } from './chordDefine';
import { ChordOption } from './chordOption';
import { ChordFinger, ChordToFingerConverter } from './chordToFingerConverter';
const { createSVGWindow } = require('svgdom');

export class Renderer {
  // TODO: support setting overwrite by args.
  static readonly STRINGS_NUMBER = 4;
  static readonly FLET_NUMBER = 5;
  static readonly CANVAS_W = 128;
  static readonly CANVAS_H = Renderer.CANVAS_W * (Renderer.STRINGS_NUMBER - 1) / Renderer.FLET_NUMBER;
  static readonly OFFSET_X = 8;
  static readonly OFFSET_Y = 8;
  static readonly FIG_W = Renderer.CANVAS_W - Renderer.OFFSET_X * 2;
  static readonly FIG_H = Renderer.CANVAS_H - Renderer.OFFSET_Y * 2;
  static readonly STROKE_THIN = 1;
  static readonly STROKE_BOLD = 5;
  static readonly FINGER_RADIUS = 7;
  static readonly FONT_SIZE = Math.ceil(Renderer.FINGER_RADIUS * 1.75);

  static getSVG (chord: ChordDefine, option: ChordOption) {
    // setup
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);
    const canvas = SVG().size(Renderer.CANVAS_W, Renderer.CANVAS_H);
    const group = canvas.group();

    // draw string, flet
    group.add(Renderer.drawBackGround(canvas, option));

    // draw finger position
    group.add(Renderer.drawFingers(canvas, option, chord));

    // rotate when vertical
    if (option.vertical) {
      canvas.size(Renderer.CANVAS_H, Renderer.CANVAS_W);
      group
        .center(Renderer.CANVAS_H / 2, Renderer.CANVAS_W / 2)
        .rotate(90);
    }

    // return svg string
    return canvas.svg();
  }

  private static drawBackGround (canvas: Svg, option: ChordOption) {
    const group = canvas.group();

    for (let i = 0; i < Renderer.STRINGS_NUMBER; i++) {
      const y = (Renderer.FIG_H / (Renderer.STRINGS_NUMBER - 1)) * i;
      group
        .line(0, y, Renderer.FIG_W, y)
        .stroke({ color: '#000', linecap: 'square', width: Renderer.STROKE_THIN });
    }
    for (let i = 0; i < Renderer.FLET_NUMBER; i++) {
      const x = (Renderer.FIG_W / Renderer.FLET_NUMBER) * i;
      const dx = i === 0 ? Renderer.STROKE_BOLD / 2 : 0;
      const dy = i === 0 ? Renderer.STROKE_THIN / 2 : 0;
      const strokeWidth = i === 0 ? Renderer.STROKE_BOLD : Renderer.STROKE_THIN;
      group
        .line(x - dx, -dy, x - dx, Renderer.FIG_H + dy)
        .stroke({ color: '#000', width: strokeWidth });
    }

    // slide offset
    return group.dmove(Renderer.OFFSET_X, Renderer.OFFSET_Y);
  }

  private static drawFingers (canvas: Svg, option: ChordOption, chord: ChordDefine) {
    const group = canvas.group();
    const fingers = ChordToFingerConverter.getFingers(chord);
    fingers.forEach(finger => group.add(this.drawFinger(canvas, option, finger)));

    return group;
  }

  private static drawFinger (canvas: Svg, option: ChordOption, finger: ChordFinger) {
    const group = canvas.group();
    const x = (Renderer.FIG_W / Renderer.FLET_NUMBER) * (finger.flet - 0.5);
    const y1 = (Renderer.FIG_H / (Renderer.STRINGS_NUMBER - 1)) * finger.strings;
    const y2 = (Renderer.FIG_H / (Renderer.STRINGS_NUMBER - 1)) * (finger.strings + finger.barre - 1);
    // draw finger line
    group
      .line(x, y1, x, y2)
      .stroke({ color: '#f06', linecap: 'round', width: Renderer.FINGER_RADIUS * 2 });
    // draw finger number
    const text = group
      .text(finger.finger + '')
      .text(finger.finger + '')
      .font({ fill: '#fff', family: 'monospace', size: Renderer.FONT_SIZE });
    const bbox = text.bbox();
    text
      .move(x - bbox.width / 2, y2 - bbox.height / 2);

    // rotate when vertical
    if (option.vertical) {
      text.rotate(-90);
    }

    // slide offset
    return group.dmove(Renderer.OFFSET_X, Renderer.OFFSET_Y);
  }
}
