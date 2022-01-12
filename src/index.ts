import { NoParamCallback, writeFile } from 'node:fs';
import { CHORD_LISTS } from './chordLists';
import { ChordRenderer } from './chordRenderer';
import { Command, OptionValues } from 'commander';
import { ChordDefaultOptions } from './chordDefaultOptions';

// TODO: [LOW PRIORITY]add option for custom chord to svg.
const program = new Command();
program
  .option('-a, --all', 'output all chord to svg, js, preview.html to ./dist folder')
  .option('-v, --vertical', 'rotete chord image to vertical')
  .option('--canvasw <px>', 'canvas width', ChordDefaultOptions.canvasw)
  .option('--canvash <px>', 'canvas height', ChordDefaultOptions.canvash)
  .option('--figw <px>', 'figure width', ChordDefaultOptions.figw)
  .option('--figh <px>', 'figure height', ChordDefaultOptions.figh)
  .option('--offsetx <px>', 'figure offset x', ChordDefaultOptions.offsetx)
  .option('--offsety <px>', 'figure offset y', ChordDefaultOptions.offsety)
  .option('--strokethin <px>', 'flets stroke thin width', ChordDefaultOptions.strokethin)
  .option('--strokebold <px>', 'flets stroke bold width', ChordDefaultOptions.strokebold)
  .option('--strokecolor <color>', 'flets stroke color. #RRGGBB[AA]', ChordDefaultOptions.strokecolor)
  .option('--fingerradius <px>', 'finger stroke radius', ChordDefaultOptions.fingerradius)
  .option('--fingercolor <color>', 'finger stroke color. #RRGGBB[AA]', ChordDefaultOptions.fingercolor)
  .option('--fontsize <px>', 'finger number font size', ChordDefaultOptions.fontsize)
  .option('--fontcolor <color>"', 'finger number font color. #RRGGBB[AA]', ChordDefaultOptions.fontcolor)
  .argument('[chord]', 'Chord string("Cm", "Dsus",...)')
  .action((name, options, command) => {
    const opts = {
      ...options,
      chord: name
    };
    if (opts.chord) {
      singleOutput(opts);
    } else if (opts.all) {
      allOutput(opts);
    } else {
      program.help();
    }
  })
  .parse();

function singleOutput (options: OptionValues) {
  // output single chord by svg string for redirect to file.
  // npm run build; node ./lib/index.js Cm > ./dist/Cm.svg
  Object.entries(CHORD_LISTS).forEach(
    entry => {
      const [, chordList] = entry;
      const chordDetail = chordList.find(
        chord => chord.name.toLocaleLowerCase() === options.chord.toLowerCase()
      );

      if (chordDetail !== undefined) {
        console.log(new ChordRenderer(options).getSVG(chordDetail));
      }
    }
  );
}
function allOutput (options: OptionValues) {
  // output all chord by *.svg to dist folder.
  const exitIfError: NoParamCallback = (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  };
  const jsBuffer: { chord: string, svg: string }[] = [];
  Object.entries(CHORD_LISTS).forEach(entry => {
    const [, chordList] = entry;
    chordList.forEach(chord => {
      const svg = new ChordRenderer(options).getSVG(chord);
      jsBuffer.push({
        chord: chord.name,
        svg
      });
      writeFile(`dist/${chord.name}.svg`, svg, exitIfError);
    });
  });

  // output js file
  writeFile('dist/chord.js', `let CHORD_LISTS = ${JSON.stringify(jsBuffer, null, ' ')};`, exitIfError);

  // output preview html to dist folder.
  const previewHtml = `
  <html>
    <head>
      <title>uke-chord-renderer output preview</title>
      <style type="text/css">
        body {
          padding: 2em;
        }
        h2 {
          border: 1px solid #000;
          border-width: 0 0 1px 0;
        }
        .flex-box {
          display: flex;
          flex-wrap: wrap;
        }
        .flex-box > div {
          max-width: 20%;
          min-width: 150px;
        }
      </style>
    <head>
    <body>
      <h1>uke-chord-renderer output preview</h1>
      ${Object.entries(CHORD_LISTS).map(entry => {
        const [listName, chordList] = entry;
        return `
        <h2>${listName}</h2>
        <div class="flex-box">
          ${chordList.map(chord => `
          <div>
            <h3>${chord.name}<h3>
            <img src="${encodeURIComponent(chord.name)}.svg" alt="${chord.name}">
          </div>
          `).join('\n')}
        </div>
        `;
      }).join('\n')}
    </body>
  </html>
  `;
  writeFile('dist/preview.html', previewHtml, exitIfError);

  // print success messsage.
  console.log('Finish output chord.svg and preview.html to ./dist/ folder.');
  console.log('Check it!');
}
