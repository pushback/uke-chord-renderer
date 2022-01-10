import { NoParamCallback, writeFile } from 'node:fs';
import { argv } from 'node:process';
import { CHRORD_LISTS } from './chordLists';
import { Renderer } from './chordRenderer';

const option = argv[2];
if (option !== '--all') {
  // output single chord by svg string for redirect to file.
  // npm run build; node ./lib/index.js Cm > ./dist/Cm.svg
  Object.entries(CHRORD_LISTS).forEach(
    entry => {
      const [, chordList] = entry;
      const chordDetail = chordList.find(chord => chord.name.toLocaleLowerCase() === option.toLowerCase());

      if (chordDetail !== undefined) {
        console.log(Renderer.getSVG(chordDetail));
      }
    }
  );
} else {
  // output all chord by *.svg to dist folder.
  const exitIfError: NoParamCallback = (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  };
  Object.entries(CHRORD_LISTS).forEach(entry => {
    const [, chordList] = entry;
    chordList.forEach(chord => {
      const svg = Renderer.getSVG(chord);
      writeFile(`dist/${chord.name}.svg`, svg, exitIfError);
    });
  });

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
      ${Object.entries(CHRORD_LISTS).map(entry => {
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
}
