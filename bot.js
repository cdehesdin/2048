// ------------------- BOT AI -------------------
const autoPlayStep = () => {
    if (!gameState.botRunning || gameState.paused || game.isFinish()) return;

    const bestMove = game.bestMoveMonteCarlo(50);

    if (!bestMove || !game.isValid(bestMove)) {
        gameState.botRunning = false;
        return;
    }

    saveState();
    game.movement(bestMove);
    displayGame(game);

    gameState.botTimeoutId = setTimeout(autoPlayStep, 120);
};
