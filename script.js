const doz = document.querySelectorAll('.doz-child');
const dozb = document.querySelector('.doz-body');
const endModal = document.querySelector('.end');
const h1Winner = document.getElementById('h1-winner');
const scoreRedDom = document.querySelector('.score-red');
const scoreBlueDom = document.querySelector('.score-blue');
const restartBtn = document.getElementById('btn-restart-score');
const resetModal = document.getElementById("reset-modal");
const openResetBtn = document.querySelector(".btn-restart-score");
const closeResetBtn = document.getElementById("close-reset-modal");
const redTest = document.querySelector('.red-test');
const blueTest = document.querySelector('.blue-test');

const modeBotBtn = document.getElementById('mode-bot');
const modeTwoBtn = document.getElementById('mode-two');
const colorRedBtn = document.getElementById('color-red');
const colorBlueBtn = document.getElementById('color-blue');
const startGameBtn = document.getElementById('start-game-btn');

const winCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let arr = [null, null, null, null, null, null, null, null, null];
let count = 0;
let arrr = [];
let arrb = [];
let red = 0;
let blue = 0;
let gameMode = localStorage.getItem("gameMode") || "bot";
let startColor = localStorage.getItem("startColor") || "r";
let scoreRedStorage = Number(localStorage.getItem("scoreRed")) || 0;
let scoreBlueStorage = Number(localStorage.getItem("scoreBlue")) || 0;
let endGame = false;
let zele = [0, 2, 6, 8];
let gooche = [1, 3, 5, 7];

scoreRedDom.innerText = scoreRedStorage;
scoreBlueDom.innerText = scoreBlueStorage;

let pendingMode = gameMode;
let pendingColor = startColor;

function currentColor(c) {
    const first = startColor;
    const second = first === 'r' ? 'b' : 'r';
    return c % 2 === 0 ? first : second;
}

function openModal() {
    endModal.classList.add('open-modal');
    dozb.style.pointerEvents = 'none';
}

function checkWinner() {

    for (let combo of winCombo) {
        if (combo.every(num => arrr.includes(num))) {
            h1Winner.innerText = 'قرمز برنده شد';
            h1Winner.style.color = 'red';
            red = scoreRedStorage + 1;
            localStorage.setItem('scoreRed', red);
            scoreRedDom.innerText = red;
            dozb.style.pointerEvents = 'none';
            endGame = true;
            openModal();
            return;
        }
    }

    for (let combo of winCombo) {
        if (combo.every(num => arrb.includes(num))) {
            h1Winner.innerText = 'آبی برنده شد';
            h1Winner.style.color = 'blue';
            blue = scoreBlueStorage + 1;
            localStorage.setItem('scoreBlue', blue);
            scoreBlueDom.innerText = blue;
            dozb.style.pointerEvents = 'none';
            endGame = true;
            openModal();
            return;
        }
    }

    if (count == 9) {
        h1Winner.innerText = 'بازی مساوی شد';
        h1Winner.style.color = 'white';
        dozb.style.pointerEvents = 'none';
        endGame = true;
        openModal();
    }

}

function playGame() {

    doz.forEach(item => {

        item.addEventListener("click", e => {
            const id = Number(e.target.id);
            if (arr[id] !== null) return;
            if (endGame) return;

            if (gameMode === "bot") {
                if (currentColor(count) === 'r') {
                    humanMove(id);
                }
            } else {
                twoPlayerMove(id);
            }

        })
    })
}

function twoPlayerMove(id) {
    if (endGame) return;
    if (currentColor(count) === 'r') {
        arr[id] = 'r';
        setTimeout(() => doz[id].classList.add('active'), 10);
        doz[id].classList.add('x');
        arrr.push(id);
    } else {
        arr[id] = 'b';
        doz[id].classList.add('o');
        setTimeout(() => doz[id].classList.add('active'), 10);
        arrb.push(id);
    }
    count++;
    playercheck(count);
    checkWinner();
}

function humanMove(id) {
    if (endGame) return;
    if (currentColor(count) !== 'r') return;

    count++;
    arr[id] = 'r';
    doz[id].classList.add('x');
    arrr.push(id);
    setTimeout(() => doz[id].classList.add('active'), 10);
    checkWinner();
    playercheck(count);

    if (!endGame && count < 9) {
        runBotTurnIfNeeded();
    }
}

function botMove() {
    let thirdNumber = WinBot();
    let notLose = notLoseBot();
    let forkIndex = fork();

    let randomIndex;
    if (thirdNumber !== null && arr[thirdNumber] === null) {
        randomIndex = thirdNumber;
    } else if (notLose !== null && arr[notLose] === null) {
        randomIndex = notLose;
    } else if (arr[4] === null) {
        randomIndex = 4;
    } else if (forkIndex !== null && arr[forkIndex] === null) {
        randomIndex = forkIndex;
    } else if (arr[0] == null || arr[2] == null || arr[6] == null || arr[8] == null) {
        do {
            randomIndex = zele[Math.floor(Math.random() * zele.length)];
        } while (arr[randomIndex] !== null);
    } else {
        do {
            randomIndex = gooche[Math.floor(Math.random() * gooche.length)];
        } while (arr[randomIndex] !== null);
    }

    arr[randomIndex] = 'b';
    doz[randomIndex].classList.add('o');
    arrb.push(Number(randomIndex));
    setTimeout(() => doz[randomIndex].classList.add('active'), 10);
    count++;

    checkWinner();
    playercheck(count);
}

function runBotTurnIfNeeded() {
    if (gameMode !== 'bot') return;
    if (endGame || count >= 9) return;
    if (currentColor(count) !== 'b') return;

    doz.forEach(item => item.style.pointerEvents = 'none');
    setTimeout(() => {
        if (!endGame) botMove();
        if (!endGame) doz.forEach(item => item.style.pointerEvents = 'auto');
        if (!endGame && count < 9 && currentColor(count) === 'b') {
            runBotTurnIfNeeded();
        }
    }, 1000);
}

function fork() {
    let emptyCells = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === null) {
            emptyCells.push(i);
        }
    }

    for (let item of emptyCells) {
        let r2r = 0;
        for (let combo of winCombo) {
            if (combo.includes(item)) {
                let hasRivial = false;

                for (let com of combo) {
                    if (arr[com] === 'r') {
                        hasRivial = true;
                        break;
                    }
                }

                if (!hasRivial) {
                    r2r++;
                }
            }
        }

        if (r2r >= 2) {
            return item;
        }
    }
    return null;
}

function WinBot() {
    for (let combo of winCombo) {
        const botCells = combo.filter(i => arrb.includes(i));
        const emptyCells = combo.filter(i => arr[i] === null);
        if (botCells.length === 2 && emptyCells.length === 1) {
            return emptyCells[0];
        }
    }
    return null;
}

function notLoseBot() {
    for (let combo of winCombo) {
        const playerCells = combo.filter(i => arrr.includes(i));
        const emptyCells = combo.filter(i => arr[i] === null);
        if (playerCells.length === 2 && emptyCells.length === 1) {
            return emptyCells[0];
        }
    }
    return null;
}

function playercheck(countPlayerCheck) {
    if (currentColor(countPlayerCheck) === 'r') {
        redTest.classList.add('active-turn');
        blueTest.classList.remove('active-turn');
    } else {
        blueTest.classList.add('active-turn');
        redTest.classList.remove('active-turn');
    }
}

openResetBtn.addEventListener("click", () => {
    resetModal.classList.add("show");
});

closeResetBtn.addEventListener("click", () => {
    resetModal.classList.remove("show");
});

restartBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});

function setModeSelection(mode) {
    pendingMode = mode;
    modeBotBtn.classList.toggle('opt-selected', mode === 'bot');
    modeTwoBtn.classList.toggle('opt-selected', mode === 'two');
}

function setColorSelection(color) {
    pendingColor = color;
    colorRedBtn.classList.toggle('opt-selected', color === 'r');
    colorBlueBtn.classList.toggle('opt-selected', color === 'b');
}

modeBotBtn.addEventListener('click', () => setModeSelection('bot'));
modeTwoBtn.addEventListener('click', () => setModeSelection('two'));
colorRedBtn.addEventListener('click', () => setColorSelection('r'));
colorBlueBtn.addEventListener('click', () => setColorSelection('b'));

startGameBtn.addEventListener('click', () => {
    localStorage.setItem('gameMode', pendingMode);
    localStorage.setItem('startColor', pendingColor);
    sessionStorage.setItem('visited', 'true');
    location.reload();
});

setModeSelection(pendingMode);
setColorSelection(pendingColor);

playercheck(count);
playGame();

if (!sessionStorage.getItem("visited")) {
    openModal();
} else if (gameMode === 'bot') {
    runBotTurnIfNeeded();
}