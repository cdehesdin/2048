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

class Game_2048 {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;

    constructor() {
        this.addRandomTile();
        this.addRandomTile();
    }

    clone() {
        const newGame = new Game_2048();
        newGame.grid = this.grid.map(row => row.slice());
        newGame.score = this.score;
        return newGame;
    }

    twoOrFour() {
        return randomInt(10) === 9 ? 4 : 2;
    }

    addRandomTile() {
        let x, y;
        do {
            x = randomInt(4);
            y = randomInt(4);
        } while (this.grid[x][y] !== 0);
        this.grid[x][y] = this.twoOrFour();
    }

    slideAndMergeLine(line) {
        // Déplacement vers la gauche
        let arr = line.filter(n => n !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                this.score += arr[i];
                arr[i + 1] = 0;
            }
        }
        arr = arr.filter(n => n !== 0);
        while (arr.length < line.length) arr.push(0);
        return arr;
    }

    moveLeft() {
        for (let x = 0; x < 4; x++)
            this.grid[x] = this.slideAndMergeLine(this.grid[x]);
    }

    moveRight() {
        for (let x = 0; x < 4; x++)
            this.grid[x] = this.slideAndMergeLine([...this.grid[x]].reverse()).reverse();
    }

    moveUp() {
        for (let y = 0; y < 4; y++) {
            const col = this.grid.map(row => row[y]);
            const merged = this.slideAndMergeLine(col);
            for (let x = 0; x < 4; x++) this.grid[x][y] = merged[x];
        }
    }

    moveDown() {
        for (let y = 0; y < 4; y++) {
            const col = this.grid.map(row => row[y]).reverse();
            const merged = this.slideAndMergeLine(col).reverse();
            for (let x = 0; x < 4; x++) this.grid[x][y] = merged[x];
        }
    }

    movement(direction) {
        const clone = this.clone();
        switch (direction) {
            case 'l': this.moveLeft(); break;
            case 'r': this.moveRight(); break;
            case 'u': this.moveUp(); break;
            case 'd': this.moveDown(); break;
        }
        // Ajouter une tuile seulement si mouvement réel
        if (JSON.stringify(clone.grid) !== JSON.stringify(this.grid)) this.addRandomTile();
    }

    isValid(direction) {
        const clone = this.clone();
        clone.movement(direction);
        return JSON.stringify(clone.grid) !== JSON.stringify(this.grid);
    }

    isFinish() {
        return !['l', 'r', 'u', 'd'].some(dir => this.isValid(dir));
    }
}

// ------------------- Gestion interface -------------------
let game;

const gameActive = (direction) => {
    if (!game || !game.isValid(direction)) return;
    game.movement(direction);
    displayGame(game);

    if (game.isFinish()) {
        document.querySelector(`.game-message`).classList.remove("hidden");
        document.querySelector(`.stop`).classList.add("hidden");
        document.querySelector(`.game-message span`).classList.remove("hidden");
    }
};

// Boutons
document.querySelector(`.stop`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.remove("hidden");
    document.querySelector(`.stop`).classList.add("hidden");
    document.querySelector(`.game-message a.continue`).classList.remove("hidden");
    document.querySelector(`.game-message span`).classList.add("hidden");
});

document.querySelector(`.retry`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.add("hidden");
    document.querySelector(`.game-message a.retry`).innerHTML = "Recommencez une partie";
    document.querySelector(`.stop`).classList.remove("hidden");
    game = new Game_2048();
    displayGame(game);
});

document.querySelector(`.game-message a.continue`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.add("hidden");
    document.querySelector(`.game-message a.continue`).classList.add("hidden");
    document.querySelector(`.stop`).classList.remove("hidden");
});

// Clavier
document.addEventListener("keydown", (e) => {
    if (!game || game.isFinish()) return;
    switch (e.key) {
        case "ArrowUp": gameActive('u'); break;
        case "ArrowDown": gameActive('d'); break;
        case "ArrowLeft": gameActive('l'); break;
        case "ArrowRight": gameActive('r'); break;
    }
});

// Tactile
let startX = 0, startY = 0;
const seuil = 30;

document.querySelector(`.game`).addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.querySelector(`.game`).addEventListener("touchend", (e) => {
    if (!game || game.isFinish()) return;
    const deltaX = e.changedTouches[0].clientX - startX;
    const deltaY = e.changedTouches[0].clientY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > seuil)
        gameActive(deltaX > 0 ? 'r' : 'l');
    else if (Math.abs(deltaY) > seuil)
        gameActive(deltaY > 0 ? 'd' : 'u');

    startX = 0; startY = 0;
});
