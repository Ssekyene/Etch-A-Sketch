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
const magicSketchBtn = document.querySelector('#magicSketcher');
const smoothShadeBtn = document.querySelector('#smoothShading');

let magicColorFlag = false;
let pixelColor = colorPicker.value;
let smoothShadeFlag = false;
let previousPixelColor = '';
// let opacity = 0.1;


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


magicSketchBtn.addEventListener('click', e => {
  // first deactivate the smooth shading effect if its on
  if (smoothShadeFlag) {
    smoothShadeFlag = false;
    smoothShadeBtn.classList.remove('active-control');
  }
  // toggle magic sketching
  magicColorFlag = magicColorFlag === false ? true : false;
  magicSketchBtn.classList.toggle('active-control');
  // when the magic color feature is off
  if (!magicColorFlag) {
    magicSketchBtn.textContent = 'Magic Sketch off';
    // retrive shading to the previous color
    pixelColor = colorPicker.value;

  } else {
    magicSketchBtn.textContent = 'Magic Sketch on';
  }
});

smoothShadeBtn.addEventListener('click', e => {
  // first deactivate magic color effect if its on
  if (magicColorFlag) {
    magicColorFlag = false;
    magicSketchBtn.classList.remove('active-control');
    // retrive shading to the previous color
    pixelColor = colorPicker.value;
  }
  // toggle smooth shading
  smoothShadeFlag = smoothShadeFlag === false ? true : false;
  smoothShadeBtn.classList.toggle('active-control');
  // apply button state
  if (smoothShadeFlag) {
    smoothShadeBtn.textContent = 'Smooth Shading on';
  } else {
    smoothShadeBtn.textContent = 'Smooth Shading off';
  }


});

/** END GLOBAL SCOPE **/


function shadeOnMousedown(e) {
  // 0 represents the left button
  if (e.button === 0) {
    const pixelElem = e.target;
    e.preventDefault();
    if (magicColorFlag) {
      setRandomPixelColor();
    } else if (smoothShadeFlag) {
      // if the pixel is not visited yet give it 10% opacity
      if (pixelElem.style.opacity === '') {
        pixelElem.style.opacity = 0.1;
      } else {
        // get the current opacity
        let opacity = +pixelElem.style.opacity;
        if (opacity < 1) {  // maximum opacity is 100%
          // update the current opacity by adding 10%
          opacity = opacity + 0.1;
          pixelElem.style.opacity = opacity;
        }

      }
    }
    setPixelFillColor(pixelElem, pixelColor);
  }

}

function shadeOnHoverWithLeftButtonDown (e) {
  // 1 represents the left button when using the `buttons` (not `button`) property
  if (e.buttons === 1) {
    const pixelElem = e.target;
    if (magicColorFlag) {
      setRandomPixelColor();
    } else if (smoothShadeFlag) {
      // if the pixel is not visited yet give it 10% opacity
      if (pixelElem.style.opacity === '') {
        pixelElem.style.opacity = 0.1;
      } else {
        // get the current opacity
        let opacity = +pixelElem.style.opacity;
        if (opacity < 1) { // maximum opacity is 100%
          // update the current opacity by adding 10%
          opacity = opacity + 0.1;
          pixelElem.style.opacity = opacity;
        }
      }
    }
    setPixelFillColor(pixelElem, pixelColor);
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

