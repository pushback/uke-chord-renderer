# uke-chord-renderer

Ukulele chord renderer.

Outputs ukulele chord images to svg and js files.

Output horizontal:

![Horizontal Sample](https://user-images.githubusercontent.com/1241251/149176308-6dbc6ffa-df29-4720-9791-aa5c4e946115.png)

Or vertical:

![Vertical Sample](https://user-images.githubusercontent.com/1241251/149179489-721f8bda-63b5-445a-9b05-8e4f9010f4fb.png)

## Usage

Output the image with the following commands.

### Setup

```bash
# git clone
git clone https://github.com/pushback/uke-chord-renderer.git

# setup & build once
cd ./uke-chord-renderer
yarn
npm build
```
### Run

```bash
# Output all chord image to under ./dist folder
# *.svg, chord.js, preview.html
npm all

# Or output all chord vertical image
npm all:vertical

# Or output single chord image to svg string
npm run single Cm > ./dist/Cm.svg

# Or output single chord vertical image
npm run single:vertical Cm > ./dist/Cm.svg
```

## Example

### HTML

#### Use svg file with img element

```html
<img src="Cm.svg" />
```

#### Use chord.js with img element

```html
<div id="chord"></div>
<script src="chord.js"></script>
<script>
  let svgStr = CHORD_LISTS.find((e) => e.chord === "Cm").svg;
  document.getElementById("chord").innerHTML =
    '<img src="data:image/svg+xml;base64,' + window.btoa(svgStr) + '">';
</script>
```

### Rendering results of both

![HTML Sample](https://user-images.githubusercontent.com/1241251/149176308-6dbc6ffa-df29-4720-9791-aa5c4e946115.png)

## Preview chord image

Open `./dist/preview.html` to see all chord image.

![preview.html sample](https://user-images.githubusercontent.com/1241251/149176760-96a42a57-444e-4bdc-8147-39ee2b168730.png)

## Inside chord data format

See `./src/chordLists/*.ts`.

### Definition

```javascript
  {
    // name of chord
    name: 'Cm',
    // Fret numbers for the 1st through 4th strings.
    // In the case of barre(ceja), multiple pressed strings are listed in an array
    frets: [3, 3, 3, [3, 5]],
    // Finger numbers for the 1st through 4th strings.
    // In the case of ballet(Ceja), multiple pressed strings are listed in an array
    fingers: [1, 1, 1, [1, 3]]
  },
```

### Rendering results

![Cm sample](https://user-images.githubusercontent.com/1241251/149176308-6dbc6ffa-df29-4720-9791-aa5c4e946115.png)
