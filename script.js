/*
creates a nXn grid
*/
function createGrid(numOfSquares) {
  for (let i = 0; i < numOfSquares; i++) {
    const row = document.createElement('div');
    row.classList.add('row', 'pixel');
    for (j = 0; j < numOfSquares; j++) {
      const col = document.createElement('div');
      col.classList.add('col', 'pixel');
      row.appendChild(col);
    }
    grid.appendChild(row);
  }
}

/** GLOBAL SCOPE **/
const grid = document.querySelector('#grid');
const colorPicker = document.querySelector('#colorPicker');

createGrid(90);
createGridShadingEffect(colorPicker.value);

/** END GLOBAL SCOPE **/

// creates a shading effect to all pixels in the grid
function createGridShadingEffect(pixelColor) {
  const rows = Array.from(grid.children);
  for (const row of rows) {
    cols = Array.from(row.children);
    cols.forEach(col => {
      col.addEventListener('mousedown', e => {
        // prevent the left button from dragging
        if (e.button === 0) // 0 represents the left button
          e.preventDefault();
        setPixelFillColor(col, pixelColor);
      });    
      col.addEventListener('mouseenter', e => {
        // shade the pixel if the left button is held down while hovering over it
        if (e.buttons === 1) { // 1 represents the left button when using the `buttons` (not `button`) property
          setPixelFillColor(col, pixelColor);
        }
      });
    
    });
  }

}

colorPicker.addEventListener('input', e => {
  createGridShadingEffect(colorPicker.value);
});

function setPixelFillColor (pixelElem, fillColor) {
  pixelElem.style.backgroundColor = fillColor;
}