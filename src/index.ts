import { NoParamCallback, writeFile } from 'node:fs';
import { argv } from 'node:process';
import { CHRORD_LISTS } from './chordLists';
import { Renderer } from './chordRenderer';

const option = argv[2];
if (option === '--all') {
  // output all chord by *.svg to dist folder.
  const exitIfError: NoParamCallback = (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  };
  CHRORD_LISTS.forEach(
    chord => {
      const svg = Renderer.getSVG(chord);
      writeFile(`dist/${chord.name}.svg`, svg, exitIfError);
    }
  );
  // output preview html to dist folder.
  const previewHtml = `
  <html>
    <head>
      <title>uke-chord-renderer output preview</title>
      <style type="text/css">
        body {
          padding: 2em;
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
      <div class="flex-box">
        ${CHRORD_LISTS.map(chord => `
        <div>
          <h2>${chord.name}<h2>
          <img src="${encodeURIComponent(chord.name)}.svg">
        </div>
        `).join('\n')}
      </div>
    </body>
  </html>
  `;
  writeFile('dist/preview.html', previewHtml, exitIfError);
} else {
  // output single chord by svg string for redirect to file.
  // npm run build; node ./lib/index.js Cm > ./dist/Cm.svg
  const chordDetail = CHRORD_LISTS.find(
    chord => chord.name.toLocaleLowerCase() === option.toLowerCase()
  );
  if (chordDetail !== undefined) {
    console.log(Renderer.getSVG(chordDetail));
  }
}
