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
        if (JSON.stringify(clone.grid) !== JSON.stringify(this.grid))
            this.addRandomTile();
    }

    isValid(direction) {
        const clone = this.clone();
        clone.movement(direction);
        return JSON.stringify(clone.grid) !== JSON.stringify(this.grid);
    }

    isFinish() {
        return !['l', 'r', 'u', 'd'].some(dir => this.isValid(dir));
    }

    // Méthode pour le bot
    bestMoveMonteCarlo(simulations = 100) {
        const directions = ['l','r','u','d'];
        let bestScore = -Infinity;
        let bestMove = null;

        for (let dir of directions) {
            if (!this.isValid(dir)) continue;
            let total = 0;

            for (let i = 0; i < simulations; i++) {
                const clone = this.clone();
                clone.movement(dir);

                while (!clone.isFinish()) {
                    const moves = directions.filter(d => clone.isValid(d));
                    clone.movement(moves[randomInt(moves.length)]);
                }
                total += clone.score;
            }

            if (total / simulations > bestScore) {
                bestScore = total / simulations;
                bestMove = dir;
            }
        }

        return bestMove;
    }
}