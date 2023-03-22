window.onload = function() {
	newGame();
	buildBoard();
	
	document.querySelectorAll(".boxes").forEach(
	function(item){
		item.addEventListener("click", activeSquare);
	})
	
	document.getElementById("playAgain").addEventListener("click", newGame);
} //end window.onload

var turnCounter;

var sqID;
var available = true;

function Square (id, mark) {
	this.id = id;
	this.mark = mark;
	this.place = function () {
		//console.log("Current game turn: " + currentGame.turn);
		this.mark = currentGame.turn;
		document.getElementById(this.id).innerHTML = this.mark;	
	}
	this.isEmpty = function () {
		if (this.mark == "empty") {
			available = true;	
		} 
		else {
			available = false;
		}
	}
}

function Game (turn, gameOver) {
	this.turn = turn;
	this.gameOver = gameOver;
	this.switchTurn = function () {
		turnCounter++;
		if (this.gameOver == "yes") {
			console.log("Game is over"); 
			document.getElementById("turnIndicator").style.visibility = "hidden";
		} else {
			if (turnCounter % 2 == 0) {
				this.turn = "O";
			}
			else {
				this.turn = "X";
			}
		document.getElementById("turnID").innerHTML = currentGame.turn;
	}
	}
	this.checkWin = function () {
		getSquareValues();
		checkGameOver();
	}
}

var currentGame = new Game ("X", "no");

var s0 = new Square (0, "empty");
var s1 = new Square (1, "empty");
var s2 = new Square (2, "empty");
var s3 = new Square (3, "empty");
var s4 = new Square (4, "empty");
var s5 = new Square (5, "empty");
var s6 = new Square (6, "empty");
var s7 = new Square (7, "empty");
var s8 = new Square (8, "empty");

function newGame () {
	currentGame = new Game ("X", "no");
	s0 = new Square (0, "empty");
	s1 = new Square (1, "empty");
	s2 = new Square (2, "empty");
	s3 = new Square (3, "empty");
	s4 = new Square (4, "empty");
	s5 = new Square (5, "empty");
	s6 = new Square (6, "empty");
	s7 = new Square (7, "empty");
	s8 = new Square (8, "empty");
	
	document.querySelectorAll(".boxes").forEach(function(item){
		item.innerHTML = "&nbsp;"
	});
	
	turnCounter = 0;
	available = true;
	currentGame.switchTurn();
	
	
	document.getElementById("turnIndicator").style.visibility = "visible";
}



function buildBoard() {
	
	arrayIdx = Array(9).fill().map((_,i)=>i);
	divs = arrayIdx.map(i=>"<div class='boxes' id='" + i + "'>&nbsp;</div>");
	
	document.getElementById("gameboard").innerHTML = divs.join('');
	document.getElementById("turnID").innerHTML = currentGame.turn;
		
}

function activeSquare() {
	
	if (currentGame.gameOver == "yes") {
		console.log("No action.");
	}
	else {
	//check id of clicked square
	sqID = (this.getAttribute("id"));

	if (sqID == 0) {
		s0.isEmpty();
		if (available == true) {
			s0.place();
			currentGame.switchTurn();
		}
		else {
			alert("That square is taken. Choose again.");
		}
	}
	else if (sqID == 1) {
		s1.isEmpty();
		if (available == true) {
			s1.place();
			currentGame.switchTurn();
		}
		else {
			alert("That square is taken. Choose again.");
		}
	}
	else if (sqID == 2) {
		s2.isEmpty();
		if (available == true) {
			s2.place();
			currentGame.switchTurn();
		}
		else {
		alert("That square is taken. Choose again.");
		}
	}
	else if (sqID == 3)  {
		s3.isEmpty();
		if (available == true) {
			s3.place();
			currentGame.switchTurn();
		}
		else {
		alert("That square is taken. Choose again.");
		}
	}
		else if (sqID == 4)  {
		s4.isEmpty();
		if (available == true) {
			s4.place();
			currentGame.switchTurn();
		}
		else {
			alert("That square is taken. Choose again.");
		}
	}
	else if (sqID == 5)  {
		s5.isEmpty();
		if (available == true) {
			s5.place();
			currentGame.switchTurn();
		}
		else {
		alert("That square is taken. Choose again.");
		}
	}
	else if (sqID == 6)  {
		s6.isEmpty();
		if (available == true) {
			s6.place();
			currentGame.switchTurn();
		}
		else {
		alert("That square is taken. Choose again.");
		}
	}
	else if (sqID == 7)  {
		s7.isEmpty();
		if (available == true) {
			s7.place();
			currentGame.switchTurn();
		}
		else {
		alert("That square is taken. Choose again.");
		}
	}
	else if (sqID == 8)  {
		s8.isEmpty();
		if (available == true) {
			s8.place();
			currentGame.switchTurn();
		}
		else {
		alert("That square is taken. Choose again.");
		}
	}
	
	currentGame.checkWin();
	}	
}

function getSquareValues() {
	values = [];
	document.querySelectorAll(".boxes").forEach(obj=>
		{values.push(obj.innerHTML == '&nbsp;'?'-':obj.innerHTML)})
	return values;
}

function checkGameOver() {
	var [a, b, c, d, e, f, g, h, i] = getSquareValues();
	
	combos = [ [a, b, c].join(''),
			   [d, e, f].join(''),
			   [g, h, i].join(''),
			   [a, d, g].join(''),
			   [b, e, h].join(''),
			   [c, f, i].join(''),
			   [a, e, i].join(''),
			   [c, e, g]]
	
	if (combos.indexOf("XXX") != -1) {
		currentGame.gameOver = "yes";
		document.getElementById("turnIndicator").style.visibility = "hidden";
		document.getElementById("playAgain").style.visibility = "visible";
		return endGame("X Wins");
		}
	else if (combos.indexOf("OOO") != -1){
		currentGame.gameOver = "yes";
		document.getElementById("turnIndicator").style.visibility = "hidden";
		document.getElementById("playAgain").style.visibility = "visible";
		return endGame("O Wins");
	} else if (boardFull()) {
		currentGame.gameOver = "yes";
		document.getElementById("turnIndicator").style.visibility = "hidden";
		document.getElementById("playAgain").style.visibility = "visible";
		return endGame("Game Over. It's a stalemate.");
	}
}

boardFull = () => getSquareValues().join('').indexOf('-') == -1;

function endGame (theMessage) {
	alert(theMessage);
}
