const randomInt = (max) => Math.floor(Math.random() * max);

const updateCell = (x, y, value, size) => {
    const cell = document.querySelector(`#cell-${size * x + y + 1}`);
    cell.innerHTML = value || '';
    cell.className = '';
    if (value !== 0) cell.classList.add(`nb-${value}`);
};

const displayGame = (game) => {
    document.querySelector(`#score`).innerHTML = game.score;
    for (let x = 0; x < game.grid.length; x++)
        for (let y = 0; y < game.grid.length; y++)
            updateCell(x, y, game.grid[x][y], game.grid.length);
};