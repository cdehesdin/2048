// ------------------- Etat global -------------------
const gameState = {
    playing: true,      // false = partie terminée
    paused: false,
    botRunning: false,
    history: [],
    undoLimit: 2,
    swapLimit: 2,
    botTimeoutId: null
};

let game = new Game_2048();
displayGame(game);

// ------------------- Fonctions utilitaires -------------------

const setGameMessage = (show, text = '') => {
    const message = document.querySelector('.game-message');
    if (!message) return;

    message.textContent = text;
    message.style.display = show ? 'flex' : 'none';
};

const updateButtons = () => {
    const startLogo = document.querySelector('#pause svg:first-child');
    const pauseLogo = document.querySelector('#pause svg:last-child');

    if (gameState.paused) {
        startLogo.style.display = 'inline-block';
        pauseLogo.style.display = 'none';
    } else {
        startLogo.style.display = 'none';
        pauseLogo.style.display = 'inline-block';
    }

    // RELOAD : TOUJOURS ACTIF
    document.querySelector('#reload').classList.add('active');

    // Si partie terminée → tout bloqué sauf reload
    if (!gameState.playing) {
        document.querySelector('#pause').classList.remove('active');
        document.querySelector('#undo').classList.remove('active');
        document.querySelector('#echange').classList.remove('active');
        document.querySelector('#ai').classList.remove('active');
        return;
    }

    // UNDO
    const undoSlots = document.querySelectorAll('#undo + div .active');
    document.querySelector('#undo').classList.toggle(
        'active',
        undoSlots.length > 0 &&
        gameState.history.length > 0 &&
        !gameState.paused
    );

    // SWAP
    const swapSlots = document.querySelectorAll('#echange + div .active');
    document.querySelector('#echange').classList.toggle(
        'active',
        swapSlots.length > 0 && !gameState.paused
    );

    document.querySelector('#pause').classList.add('active');
    document.querySelector('#ai').classList.toggle('active', !gameState.paused);
};

const saveState = () => {
    if (!gameState.playing) return;

    if (gameState.history.length >= gameState.undoLimit) {
        gameState.history.shift();
    }

    gameState.history.push({
        grid: game.grid.map(r => r.slice()),
        score: game.score
    });

    updateButtons();
};

const checkGameOver = () => {
    const hasMove =
        game.isValid('l') ||
        game.isValid('r') ||
        game.isValid('u') ||
        game.isValid('d');

    if (!hasMove) {
        gameState.playing = false;
        gameState.paused = true;

        setGameMessage(true, 'Partie terminée');

        clearTimeout(gameState.botTimeoutId);
        updateButtons();
    }
};

// ------------------- Clavier -------------------
window.addEventListener('keydown', (e) => {
    if (!gameState.playing || gameState.paused) return;

    const map = {
        ArrowLeft: 'l', a: 'l', A: 'l',
        ArrowRight: 'r', d: 'r', D: 'r',
        ArrowUp: 'u', w: 'u', W: 'u',
        ArrowDown: 'd', s: 'd', S: 'd'
    };

    const dir = map[e.key];
    if (!dir || !game.isValid(dir)) return;

    saveState();
    game.movement(dir);
    displayGame(game);
    checkGameOver();

    if (gameState.botRunning) {
        gameState.botRunning = false;
        clearTimeout(gameState.botTimeoutId);
    }

    updateButtons();
});

// ------------------- Boutons -------------------

// Pause
document.querySelector('#pause').addEventListener('click', () => {
    if (!gameState.playing) return;

    gameState.paused = !gameState.paused;

    if (gameState.paused) {
        setGameMessage(true);
        clearTimeout(gameState.botTimeoutId);
    } else {
        setGameMessage(false);
        if (gameState.botRunning) {
            autoPlayStep();
        }
    }

    updateButtons();
});

// Reload (TOUJOURS DISPONIBLE)
document.querySelector('#reload').addEventListener('click', () => {
    game = new Game_2048();
    gameState.history = [];
    gameState.paused = false;
    gameState.playing = true;
    gameState.botRunning = false;

    document.querySelectorAll('#undo + div div')
        .forEach(s => s.classList.add('active'));
    document.querySelectorAll('#echange + div div')
        .forEach(s => s.classList.add('active'));

    setGameMessage(false);

    clearTimeout(gameState.botTimeoutId);
    displayGame(game);
    updateButtons();
});

// ------------------- UNDO -------------------
document.querySelector('#undo').addEventListener('click', () => {
    if (!document.querySelector('#undo').classList.contains('active')) return;

    const slots = document.querySelectorAll('#undo + div .active');
    if (!slots.length || !gameState.history.length) return;

    slots[slots.length - 1].classList.remove('active');

    const previous = gameState.history.pop();
    game.grid = previous.grid.map(r => r.slice());
    game.score = previous.score;

    displayGame(game);
    updateButtons();
});

// ------------------- SWAP -------------------
document.querySelector('#echange').addEventListener('click', () => {
    if (!document.querySelector('#echange').classList.contains('active')) return;

    const slots = document.querySelectorAll('#echange + div .active');
    if (!slots.length) return;

    const positions = [];
    for (let x = 0; x < 4; x++)
        for (let y = 0; y < 4; y++)
            if (game.grid[x][y] !== 0) positions.push([x, y]);

    if (positions.length < 2) return;

    saveState();

    const i1 = Math.floor(Math.random() * positions.length);
    let i2;
    do { i2 = Math.floor(Math.random() * positions.length); } while (i2 === i1);

    const [x1, y1] = positions[i1];
    const [x2, y2] = positions[i2];

    [game.grid[x1][y1], game.grid[x2][y2]] =
    [game.grid[x2][y2], game.grid[x1][y1]];

    slots[slots.length - 1].classList.remove('active');

    displayGame(game);
    updateButtons();
});

// ------------------- AI -------------------
document.querySelector('#ai').addEventListener('click', () => {
    if (!document.querySelector('#ai').classList.contains('active')) return;
    if (!gameState.playing) return;

    if (gameState.botRunning) {
        gameState.botRunning = false;
        clearTimeout(gameState.botTimeoutId);
    } else {
        gameState.botRunning = true;
        autoPlayStep();
    }

    updateButtons();
});

// ------------------- TACTILE -------------------

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const minSwipeDistance = 30;
const gridElement = document.querySelector('.x-grid');

gridElement.addEventListener('touchstart', (e) => {
    if (!gameState.playing || gameState.paused) return;

    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: true });

gridElement.addEventListener('touchend', (e) => {
    if (!gameState.playing || gameState.paused) return;

    const touch = e.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) return;

    let dir = null;
    if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? 'r' : 'l';
    } else {
        dir = dy > 0 ? 'd' : 'u';
    }

    if (!dir || !game.isValid(dir)) return;

    saveState();
    game.movement(dir);
    displayGame(game);
    checkGameOver();

    if (gameState.botRunning) {
        gameState.botRunning = false;
        clearTimeout(gameState.botTimeoutId);
    }

    updateButtons();
}

updateButtons();