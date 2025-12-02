const randomInt = (max) => Math.floor(Math.random() * max)

const clearGame = (game) => {
    for (let x=0; x<game.grid.length; x++) {
        for (let y=0; y<game.grid.length; y++) {
            const cell = document.querySelector(`#cell-${game.grid.length*x+y+1}`)
            cell.innerHTML = null
            cell.className = null
        }
    }
}

const displayGame = (game) => {
    document.querySelector(`#score`).innerHTML = game.score
    for (let x=0; x<game.grid.length; x++) {
        for (let y=0; y<game.grid.length; y++) {
            if (game.grid[x][y] !== 0) {
                const cell = document.querySelector(`#cell-${game.grid.length*x+y+1}`)
                cell.innerHTML = game.grid[x][y]
                cell.classList.add(`nb-${game.grid[x][y]}`)
            }
        }
    }
}

class Game_2048 {
    grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    score = 0

    constructor () {
        for (let nb=0; nb<2; nb++) {
            let x = randomInt(4), y = randomInt(4)
            while (this.grid[x][y] !== 0) {
                x = randomInt(4)
                y = randomInt(4)
            }
            this.grid[x][y] = this.twoOrFour()
        }
    }

    clone () {
        const newGame = new Game_2048();
        newGame.grid = this.grid.map((arr) => arr.slice())
        newGame.score = this.score
        return newGame
    }

    twoOrFour () {
        if (randomInt(10) === 9)
            return 4
        else
            return 2
    }

    left () {
        for (let nb=0; nb<2; nb++) {
            // Mouvement
            for (let x=0; x < this.grid.length; x++) {
                for (let y=1; y < this.grid.length; y++) {
                    if (this.grid[x][y] !== 0) {
                        let gap = 1
                        while (y-gap >= 0 && y-gap <= this.grid.length-1 && this.grid[x][y-gap] === 0) {
                            this.grid[x][y-gap] = this.grid[x][y-gap+1]
                            this.grid[x][y-gap+1] = 0
                            gap++
                        }
                    }
                }
            }

            // Fusion
            if (nb === 0) {
                for (let x=0; x < this.grid.length; x++) {
                    for (let y=1; y < this.grid.length; y++) {
                        if (this.grid[x][y] !== 0) {
                            if (this.grid[x][y-1] === this.grid[x][y]) {
                                this.score += this.grid[x][y]*2
                                this.grid[x][y-1] = this.grid[x][y]*2
                                this.grid[x][y] = 0
                            }
                        }
                    }
                }
            }
        }
    }

    right () {
        for (let nb=0; nb<2; nb++) {
            // Mouvement
            for (let x=0; x<this.grid.length; x++) {
                for (let y=this.grid.length-2; y>-1; y--) {
                    if (this.grid[x][y] !== 0) {
                        let gap = 1
                        while (0 <= y+gap && y+gap <= this.grid.length-1 && this.grid[x][y+gap] === 0) {
                            this.grid[x][y+gap] = this.grid[x][y+gap-1]
                            this.grid[x][y+gap-1] = 0
                            gap++
                        }
                    }
                }
            }

            // Fusion
            if (nb == 0) {
                for (let x=0; x<this.grid.length; x++) {
                    for (let y=this.grid.length-2; y>-1; y--) {
                        if (this.grid[x][y] !== 0) {
                            if (this.grid[x][y+1] === this.grid[x][y]) {
                                this.grid[x][y+1] = this.grid[x][y]*2
                                this.score += this.grid[x][y]*2
                                this.grid[x][y] = 0
                            }
                        }
                    }
                }
            }
        }
    }

    up () {
        for (let nb=0; nb<2; nb++) {
            // Mouvement
            for (let x=1; x<this.grid.length; x++) {
                for (let y=0; y<this.grid.length; y++) {
                    if (this.grid[x][y] !== 0) {
                        let gap = 1
                        while (0 <= x-gap && x-gap <= this.grid.length-1 && this.grid[x-gap][y] === 0) {
                            this.grid[x-gap][y] = this.grid[x-gap+1][y]
                            this.grid[x-gap+1][y] = 0
                            gap++
                        }
                    }
                }
            }
            // Fusion
            if (nb == 0) {
                for (let x=1; x<this.grid.length; x++) {
                    for (let y=0; y<this.grid.length; y++) {
                        if (this.grid[x][y] !== 0) {
                            if (this.grid[x-1][y] === this.grid[x][y]) {
                                this.grid[x-1][y] = this.grid[x][y]*2
                                this.score += this.grid[x][y]*2
                                this.grid[x][y] = 0
                            }
                        }
                    }
                }
            }
        }
    }

    down () {
        for (let nb=0; nb<2; nb++) {
            // Mouvement
            for (let x=this.grid.length-2; x>-1; x--) {
                for (let y=0; y<this.grid.length; y++) {
                    if (this.grid[x][y] !== 0) {
                        let gap = 1
                        while (0 <= x+gap && x+gap <= this.grid.length-1 && this.grid[x+gap][y] === 0) {
                            this.grid[x+gap][y] = this.grid[x+gap-1][y]
                            this.grid[x+gap-1][y] = 0
                            gap++
                        }
                    }
                }
            }

            // Fusion
            if (nb == 0) {
                for (let x=this.grid.length-2; x>-1; x--) {
                    for (let y=0; y<this.grid.length; y++) {
                        if (this.grid[x][y] !== 0) {
                            if (this.grid[x+1][y] === this.grid[x][y]) {
                                this.grid[x+1][y] = this.grid[x][y]*2
                                this.score += this.grid[x][y]*2
                                this.grid[x][y] = 0
                            }
                        }
                    }
                }
            }
        }
    }

    movement (axes) {
        switch (axes) {
            case 'd': case 0:
                this.down()
                break
            case 'u': case 1:
                this.up()
                break
            case 'l': case 2:
                this.left()
                break
            case 'r': case 3:
                this.right()
                break
        }
    }

    isValid (axes) {
        const newGame = this.clone()
        newGame.movement(axes)
        for (let x=0; x<this.grid.length; x++) {
            for (let y=0; y<this.grid.length; y++) {
                if (newGame.grid[x][y] != this.grid[x][y])
                    return true
            }
        }
        return false
    }

    isFinish () {
        for (let axes=0; axes<this.grid.length; axes++) {
            if (this.isValid(axes))
                return false
        }
        return true
    }
}

const gameActive = (axes) => {
    if (game.isValid(axes)) {
        game.movement(axes)
                
        let x = randomInt(4), y = randomInt(4)
        while (game.grid[x][y] !== 0) {
            x = randomInt(4)
            y = randomInt(4)
        }
        game.grid[x][y] = game.twoOrFour()
    }

    document.querySelector(`#score`).innerHTML = game.score
    for (let x=0; x<game.grid.length; x++) {
        for (let y=0; y<game.grid.length; y++) {
            const cell = document.querySelector(`#cell-${game.grid.length*x+y+1}`)
            cell.innerHTML = null
            cell.classList = []
            if (game.grid[x][y] !== 0) {
                cell.innerHTML = game.grid[x][y]
                cell.classList.add(`nb-${game.grid[x][y]}`)
            }
        }
    }

    if (game.isFinish()) {
        document.querySelector(`.game-message`).classList.remove("hidden")
        document.querySelector(`.stop`).classList.add("hidden")
        document.querySelector(`.game-message span`).classList.remove("hidden")
    }
}

let game = undefined

document.querySelector(`.stop`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.remove("hidden")
    document.querySelector(`.stop`).classList.add("hidden")
    document.querySelector(`.game-message a.continue`).classList.remove("hidden")
    document.querySelector(`.game-message span`).classList.add("hidden")
})

document.querySelector(`.retry`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.add("hidden")
    document.querySelector(`.game-message a.retry`).innerHTML = "Recommencez une partie"
    document.querySelector(`.stop`).classList.remove("hidden")

    game = new Game_2048()
    clearGame(game)
    displayGame(game)
})

document.querySelector(`.game-message a.continue`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.add("hidden")
    document.querySelector(`.game-message a.continue`).classList.add("hidden")
    document.querySelector(`.stop`).classList.remove("hidden")
})

// Pour le mouvement avec les flèches
document.addEventListener("keydown", (e) => {
    if (typeof game !== 'undefined' && !game.isFinish()) {
        switch (e.key) {
            case "ArrowUp":
                gameActive('u')
                break
            case "ArrowDown":
                gameActive('d')
                break
            case "ArrowRight":
                gameActive('r')
                break
            case "ArrowLeft":
                gameActive('l')
                break
        }
    }
})

// Pour le mouvement avec les doigts
let startX = 0;
let startY = 0;

document.querySelector(`.game`).addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.querySelector(`.game`).addEventListener("touchend", function (e) {
    if (typeof game !== 'undefined' && !game.isFinish()) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        const seuil = 30;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > seuil) {
                if (deltaX > 0)
                    gameActive('r')
                else
                    gameActive('l')
            }
        } else {
            if (Math.abs(deltaY) > seuil) {
                if (deltaY > 0)
                    gameActive('d')
                else
                    gameActive('u')
            }
        }
    }
    startX = 0
    startY = 0
});