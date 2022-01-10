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
    <head><title>uke-chord-renderer output preview</title><head>
    <body>
      <h1>uke-chord-renderer output preview</h1>
      ${CHRORD_LISTS.map(chord => `
        <h2>${chord.name}<h2>
        <div><image src="${chord.name}.svg"></div>
      `).join('\n')}
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
