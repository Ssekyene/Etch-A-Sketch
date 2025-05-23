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
const resolutionInput = document.querySelector('#resolutionInput');
const xResolutionValue = document.querySelector('#xResolutionValue');
const yResolutionValue = document.querySelector('#yResolutionValue');
const clearBtn = document.querySelector('#clearBtn');
const eraserToggler = document.querySelector('#eraserToggler');
const magicSketcher = document.querySelector('#magicSketcher');

let magicColorFlag = false;
let pixelColor = colorPicker.value;


createGrid(resolutionInput.value);

const pixels = document.querySelectorAll('.col');

// pick the mousedown event through event bubbling
grid.addEventListener('mousedown', shadeOnMousedown);
// apply the mouseenter listener on each individual pixel
pixels.forEach(pixel => {
  pixel.addEventListener('mouseenter', shadeOnHoverWithLeftButtonDown);
});

colorPicker.addEventListener('input', e => {
  pixelColor = colorPicker.value;
});

clearBtn.addEventListener('click', (e) => {
  const pixels = document.querySelectorAll('.col');
  pixels.forEach(pixel => {
    pixel.style.backgroundColor = '';
  });
});


resolutionInput.addEventListener('input', (e) => {
  grid.innerHTML = ''; // clear the recent grid
  xResolutionValue.textContent = resolutionInput.value;
  yResolutionValue.textContent = resolutionInput.value;
  createGrid(resolutionInput.value);
  // reapply the mouseenter event listener on each individual pixel as before
  const pixels = document.querySelectorAll('.col');

  // apply drawing or erasing effects depending on the state of the eraser toggler btn
  if (eraserToggler.textContent === 'Eraser') { // when drawing is activated
    grid.addEventListener('mousedown', shadeOnMousedown);
    grid.removeEventListener('mousedown', eraseOnMousedown);
    
    pixels.forEach(pixel => {
      pixel.addEventListener('mouseenter', shadeOnHoverWithLeftButtonDown);
      pixel.removeEventListener('mouseenter', eraseOnHoverWithLeftButtonDown);
    });
  } else { // when erasing is activated
    grid.removeEventListener('mousedown', shadeOnMousedown);
    grid.addEventListener('mousedown', eraseOnMousedown);
    
    pixels.forEach(pixel => {
      pixel.removeEventListener('mouseenter', shadeOnHoverWithLeftButtonDown);
      pixel.addEventListener('mouseenter', eraseOnHoverWithLeftButtonDown);
    });
  }
});

// this toggles the event handlers for erasing with those for drawing
eraserToggler.addEventListener('click', e => {
  const pixels = document.querySelectorAll('.col');

  eraserToggler.classList.toggle('active-control');
  // activate erasing
  if (eraserToggler.textContent === 'Eraser') {
    eraserToggler.textContent = 'Draw';
    grid.removeEventListener('mousedown', shadeOnMousedown);
    grid.addEventListener('mousedown', eraseOnMousedown);
    grid.classList.add('cursor-crosshair');
    
    pixels.forEach(pixel => {
      pixel.removeEventListener('mouseenter', shadeOnHoverWithLeftButtonDown);
      pixel.addEventListener('mouseenter', eraseOnHoverWithLeftButtonDown);
    });

  } else { // activate drawing
    eraserToggler.textContent = 'Eraser';
    grid.removeEventListener('mousdown', eraseOnMousedown);
    grid.addEventListener('mousedown', shadeOnMousedown);
    grid.classList.remove('cursor-crosshair');
    
    pixels.forEach(pixel => {
      pixel.removeEventListener('mouseenter', eraseOnHoverWithLeftButtonDown);
      pixel.addEventListener('mouseenter', shadeOnHoverWithLeftButtonDown);
    });
  }
});


magicSketcher.addEventListener('click', e => {
  // toggle magic sketch activator flag
  magicColorFlag = magicColorFlag === false ? true : false;
  magicSketcher.classList.toggle('active-control');
  // set sketching to default when magic flag is off
  if (!magicColorFlag) {
    magicSketcher.textContent = 'Magic Sketch off';
    setPixelColorToDefault();
    colorPicker.value = pixelColor;

  } else {
    magicSketcher.textContent = 'Magic Sketch on';
  }
});
/** END GLOBAL SCOPE **/


function shadeOnMousedown(e) {
  // 0 represents the left button
  if (e.button === 0) {
    e.preventDefault();
    if (magicColorFlag) {
      setRandomPixelColor();
      setPixelFillColor(e.target, pixelColor);
    } else {
      setPixelFillColor(e.target, pixelColor);
    }
  }

}

function shadeOnHoverWithLeftButtonDown (e) {
  // 1 represents the left button when using the `buttons` (not `button`) property
  if (e.buttons === 1) {
    if (magicColorFlag) {
      setRandomPixelColor();
      setPixelFillColor(e.target, pixelColor);
    } else {
      setPixelFillColor(e.target, pixelColor);
    }
  }
}


function createGridErasingEffect() {
  const rows = Array.from(grid.children);
  for (const row of rows) {
    cols = Array.from(row.children);
    cols.forEach(col => {
      col.addEventListener('mousedown', eraseOnMousedown);    
      col.addEventListener('mouseenter', eraseOnHoverWithLeftButtonDown);
    });
  }
}

function eraseOnMousedown(e) {
  // prevent the left button from dragging
  if (e.button === 0) // 0 represents the left button
    e.preventDefault();
  erasePixel(e.target);
}

function eraseOnHoverWithLeftButtonDown (e) {
  // 1 represents the left button when using the `buttons` (not `button`) property
  if (e.buttons === 1) {
     erasePixel(e.target);
  }
}


function erasePixel(pixelElem) {
  pixelElem.style.backgroundColor = '';
}



function setPixelFillColor (pixelElem, fillColor) {
    pixelElem.style.backgroundColor = fillColor;
}


function setRandomPixelColor() {
  let r, g, b;
  // assign random different number between 0 and 256(exclusive) to
  // red, green and blue variables
  r = Math.floor(Math.random() * 256);
  g = Math.floor(Math.random() * 256);
  b = Math.floor(Math.random() * 256);
  pixelColor = `rgb(${r}, ${g}, ${b})`;
}

function setPixelColorToDefault() {
  pixelColor = '#000000';
}