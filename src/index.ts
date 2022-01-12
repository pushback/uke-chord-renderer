import { NoParamCallback, writeFile } from 'node:fs';
import { argv } from 'node:process';
import { CHORD_LISTS } from './chordLists';
import { ChordOption } from './chordOption';
import { Renderer } from './chordRenderer';

const option: ChordOption = {
  allChordOutput: argv[2] !== '--all',
  vertical: argv[3] === '--vertical',
  chordName: argv.reverse()[0]
};
// TODO: [LOW PRIORITY]add option for custom chord to svg.
if (option.allChordOutput) {
  // TODO: split function
  // output single chord by svg string for redirect to file.
  // npm run build; node ./lib/index.js Cm > ./dist/Cm.svg
  Object.entries(CHORD_LISTS).forEach(
    entry => {
      const [, chordList] = entry;
      const chordDetail = chordList.find(
        chord => chord.name.toLocaleLowerCase() === option.chordName.toLowerCase()
      );

      if (chordDetail !== undefined) {
        console.log(Renderer.getSVG(chordDetail, option));
      }
    }
  );
} else {
  // TODO: split function
  // output all chord by *.svg to dist folder.
  const exitIfError: NoParamCallback = (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  };
  const jsBuffer: { chord : string, svg : string }[] = [];
  Object.entries(CHORD_LISTS).forEach(entry => {
    const [, chordList] = entry;
    chordList.forEach(chord => {
      const svg = Renderer.getSVG(chord, option);
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
