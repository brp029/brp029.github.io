document.getElementById("gameboard").innerHTML = grid;document.getElementById("gameboard").innerHTML = grid;document.getElementById("gameboard").innerHTML = grid;document.getElementById("gameboard").innerHTML = grid;document.getElementById("gameboard").innerHTML = grid;//margin object
let margin = {top: 20, right: 10, bottom: 20, left: 10};

let width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let turncounter;

function startGame() {
	turncounter = 0;
	console.log("game started" + turncounter);
	turncounter++;
	console.log(turncounter);
	document.getElementById("directions").innerHTML = "Click any open square to claim it."
	yourTurn();
}

function yourTurn() {
	if (turncounter % 2 == 0) {
		console.log("Os Turn");
		document.getElementById("whoseTurn").innerHTML = "Player 2's Turn (0)";
		
	}
	else {
		console.log("Xs Turn");
		document.getElementById("whoseTurn").innerHTML = "Player 1's Turn (X)";
	}
}

function myFunction() {
	
//create variables
var userinput;
	

//get user input

//create X axis scale

//create y axis scale

//call axes

//other operations

} //end myFunction
