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
  pixels.forEach(pixel => {
    pixel.addEventListener('mouseenter', shadeOnHoverWithLeftButtonDown);
  });
});

// this toggles the event handlers for erasing with those for shading/drawing
eraserToggler.addEventListener('click', e => {
  const pixels = document.querySelectorAll('.col');
  if (eraserToggler.textContent === 'Eraser') {
    eraserToggler.textContent = 'Draw';
    grid.removeEventListener('mousedown', shadeOnMousedown);
    grid.addEventListener('mousedown', eraseOnMousedown);
    
    pixels.forEach(pixel => {
      pixel.removeEventListener('mouseenter', shadeOnHoverWithLeftButtonDown);
      pixel.addEventListener('mouseenter', eraseOnHoverWithLeftButtonDown);
    });

  } else {
    eraserToggler.textContent = 'Eraser';
    grid.removeEventListener('mousdown', eraseOnMousedown);
    grid.addEventListener('mousedown', shadeOnMousedown);
    
    pixels.forEach(pixel => {
      pixel.removeEventListener('mouseenter', eraseOnHoverWithLeftButtonDown);
      pixel.addEventListener('mouseenter', shadeOnHoverWithLeftButtonDown);
    });
  }
});

/** END GLOBAL SCOPE **/


function shadeOnMousedown(e) {
  if (e.button === 0) // 0 represents the left button
    e.preventDefault();
  setPixelFillColor(e.target, pixelColor);
}

function shadeOnHoverWithLeftButtonDown (e) {
  // 1 represents the left button when using the `buttons` (not `button`) property
  if (e.buttons === 1) {
    setPixelFillColor(e.target, pixelColor);
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