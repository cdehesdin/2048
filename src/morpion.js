const clearGame = (game) => {
    for (let x=0; x<game.grid.length; x++) {
        for (let y=0; y<game.grid.length; y++) {
            const cell = document.querySelector(`#cell-${game.grid.length*x+y+1}`)
            cell.innerHTML = ''
            //cell.classList.add(`nb-${game.grid[x][y]}`)
        }
    }
}

const displayGame = (game) => {
    document.querySelector(`#score > div:first-child`).innerHTML = game.score[0]
    document.querySelector(`#score > div:last-child`).innerHTML = game.score[1]
    document.querySelector(`#nbGame`).innerHTML = game.nbGame

    if (game.player === 1) {
        document.querySelector(`#score > div:first-child`).classList.add(`play-1`)
        document.querySelector(`#score > div:last-child`).classList.remove(`play-2`)
    } else {
        document.querySelector(`#score > div:first-child`).classList.remove(`play-1`)
        document.querySelector(`#score > div:last-child`).classList.add(`play-2`)
    }

    for (let x=0; x<game.grid.length; x++) {
        for (let y=0; y<game.grid.length; y++) {
            if (game.grid[x][y] !== 0) {
                const cell = document.querySelector(`#cell-${game.grid.length*x+y+1}`)
                if (game.grid[x][y] === 1)
                    cell.innerHTML = '<i class="fa-regular fa-circle"></i>'
                else if (game.grid[x][y] === 2)
                    cell.innerHTML = '<i class="fa-solid fa-xmark"></i>'
            }
        }
    }
}

class Game_Morpion {
    #grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    #score = [0, 0]
    #nbGame = 1
    player = 1

    get grid () {
        return this.#grid
    }

    get score () {
        return this.#score
    }

    get nbGame () {
        return this.#nbGame
    }

    add (nb) {
        if (0 < nb && nb <= 9) {
            let x = undefined, y = undefined
            if (nb % 3 === 0) {
                x = nb / 3 - 1
                y = 2
            } else {
                x = Math.floor(nb / 3)
                y = nb % 3 - 1
            }
            if (this.#grid[x][y] === 0) {
                this.#grid[x][y] = this.player

                if (this.player === 2)
                    this.player = 1
                else
                    this.player = 2
            }
        }
    }

    isFinish () {
        for (let x=0; x<3; x++) {
            for (let y=1; y<3-1; y++) {
                if (this.#grid[x][y] !== 0 && this.#grid[x][y] === this.#grid[x][y-1] && this.#grid[x][y] === this.#grid[x][y+1]) {
                    this.#score[this.#grid[x][y]-1]++
                    return true
                }
                if (this.#grid[y][x] !== 0 && this.#grid[y][x] === this.#grid[y-1][x] && this.#grid[y][x] === this.#grid[y+1][x]) {
                    this.#score[this.#grid[y][x]-1]++
                    return true
                }
                if (1 <= x && x < 3-1) {
                    if (this.#grid[x][y] !== 0) {
                        if ((this.#grid[x][y] === this.#grid[x-1][y-1] && this.#grid[x][y] === this.#grid[x+1][y+1]) || (this.#grid[x][y] === this.#grid[x+1][y-1] && this.#grid[x][y] === this.#grid[x-1][y+1])) {
                            this.#score[this.#grid[x][y]-1]++
                            return true
                        }
                    }
                }
            }
        }
        if (!this.#grid.map((arr) => arr.includes(0)).includes(true)) {
            this.player = 0
            return true
        }
        return false
    }

    clear () {
        this.#grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        this.#nbGame++

        if (this.player === 2)
            this.player = 1
        else
            this.player = 2
    }
}

let game = undefined

document.querySelector(`.stop`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.remove("hidden")
    document.querySelector(`.stop`).classList.add("hidden")
    document.querySelector(`.game-message a.continue`).classList.remove("hidden")
    document.querySelector(`.game-message span`).classList.add("hidden")
    document.querySelector(`.game-message a.retry`).classList.add("hidden")
    document.querySelector(`#score > div:first-child`).classList.remove(`play-1`)
    document.querySelector(`#score > div:last-child`).classList.remove(`play-2`)
})

document.querySelector(`.game-message a.start`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.add("hidden")
    document.querySelector(`.game-message a.start`).innerHTML = "Recommencez une partie"
    document.querySelector(`.stop`).classList.remove("hidden")

    game = new Game_Morpion(2)
    clearGame(game)
    displayGame(game)
})

document.querySelector(`.game-message a.continue`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.add("hidden")
    document.querySelector(`.game-message a.continue`).classList.add("hidden")
    document.querySelector(`.stop`).classList.remove("hidden")

    if (game.player === 1) {
        document.querySelector(`#score > div:first-child`).classList.add(`play-1`)
        document.querySelector(`#score > div:last-child`).classList.remove(`play-2`)
    } else {
        document.querySelector(`#score > div:first-child`).classList.remove(`play-1`)
        document.querySelector(`#score > div:last-child`).classList.add(`play-2`)
    }
})

document.querySelector(`.game-message a.retry`).addEventListener("click", () => {
    document.querySelector(`.game-message`).classList.add("hidden")
    document.querySelector(`.game-message a.retry`).classList.add("hidden")
    document.querySelector(`.stop`).classList.remove("hidden")
    
    game.clear()
    clearGame(game)
    displayGame(game)
})

document.querySelectorAll('.table > div:not(.game-message) > div').forEach(function(cell, nb) {
    cell.addEventListener('click', () => {
        game.add(nb+1)
        displayGame(game)

        if (game.isFinish()) {
            displayGame(game)
            document.querySelector(`.game-message`).classList.remove("hidden")
            document.querySelector(`.game-message span`).classList.remove("hidden")
            document.querySelector(`.game-message a.continue`).classList.add("hidden")
            document.querySelector(`.game-message a.retry`).classList.remove("hidden")
            document.querySelector(`.stop`).classList.add("hidden")

            document.querySelector(`#score > div:first-child`).classList.remove(`play-1`)
            document.querySelector(`#score > div:last-child`).classList.remove(`play-2`)

            if (game.player === 2) {
                document.querySelector(`.game-message span`).innerHTML = `Joueur 1 a gagné !`
            } else if (game.player === 1) {
                document.querySelector(`.game-message span`).innerHTML = `Joueur 2 a gagné !`
            } else {
                document.querySelector(`.game-message span`).innerHTML = `Match nul !`
                game.player = 2
            }
        }
    })
})