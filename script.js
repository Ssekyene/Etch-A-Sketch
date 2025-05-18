const grid = document.querySelector('#grid');

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

createGrid(16);

