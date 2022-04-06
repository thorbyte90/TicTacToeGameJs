var origBoard;
const humanPlayer = 'O';
const iaPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const cells = document.querySelectorAll('.box');
const player = document.querySelector('.display-player');
startGame();

function startGame() {
    document.querySelector('.announcer').style.display = "none";
    player.style.display = "block"
    player.innerText = "Tu turno!"
    origBoard = Array.from(Array(9).keys())
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false)
    }
}

function turnClick(square) {
    if(typeof origBoard[square.target.id] === 'number'){  
        turn(square.target.id, humanPlayer)
        if(!checkWin(origBoard, humanPlayer) && !checkTie()) {
            player.innerText = "Turno IA"
            removeListeners()
            setTimeout(function(){ 
                turn(bestSpot(), iaPlayer)
                addListeners();
                player.innerText = "Tu turno!"
             }, 1500);
        }
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if(gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (const index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
                gameWon.player == humanPlayer ? 'blue' : 'red'
    }
    removeListeners();
    declareWinner(gameWon.player == humanPlayer ? "Ganaste!!!" : "Perdiste :(")
}

function removeListeners() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
}

function addListeners() {
    for (let i = 0; i < origBoard.length; i++) {
        if(typeof origBoard[i] == 'number') {
            cells[i].addEventListener('click', turnClick, false);
        }
    }
}

function declareWinner(winner) {
    document.querySelector(".announcer").style.display = "block";
    document.querySelector(".announcer .text").innerText = winner;
    player.style.display = "none";
}

function emptySquares() {
    return origBoard.filter(e => typeof e == 'number');
}

function bestSpot(){
    return minimax(origBoard, iaPlayer).index;
}

function checkTie() {
    if(emptySquares().length == 0){
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener("click", turnClick, false);    
        }
        declareWinner("Empate");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, iaPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == iaPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, iaPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === iaPlayer) {
		var bestScore = -1000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 1000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}