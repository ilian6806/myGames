//main constructors
function Choise(row, col){
	this.row  = row;
	this.col  = col;
}

function Player(name, sign){
	this.name = name;
	this.sign = sign;
}

//log function
function log(a){
	console.log(a);
}

var game = (function() {

	var turn;
	var countTurns;
	var player1;
	var player2;

	//selectors
	var	wrapper  = $('#wrapper');
	var	board    = $('#main-board');
	var	cells    = $('#main-board tr td');
	var	resetBtn = $('#reset-stats');

	function getCell(r, c){
		return $('#'+r+''+c);
	}

	function checkCell(r, c, sign){
		if($('#'+r+''+c).html() == sign){
			return true;
		} else {
			return false;
		}
	}

	function win(cell1, cell2, cell3, player){

		$('#' + cell1 + ', #' + cell2 + ', #' + cell3).animate({opacity: .3}, 700);
		cells.off('click');

		wrapper.append('<div id="win-wrapper"></div>');
		winWrapeer = $('#win-wrapper');
		winWrapeer.html('<p id="win-msg">' + player.name + ' wins !</p><button id="new-game">New game</button>');

		var currScore = Number(localStorage.getItem(player.name));
		localStorage.setItem(player.name, currScore + 1);

		$('#new-game').on('click', function(){
			game.init();
		});
	}

	function checkForWin(cellId, player){

		var sign = player.sign;

		switch(Number(cellId)){
			case 11: 
				if(checkCell(1,2,sign) && checkCell(1,3,sign)){ win(11, 12, 13, player); };
				if(checkCell(2,1,sign) && checkCell(3,1,sign)){ win(11, 21, 31, player); };
				if(checkCell(2,2,sign) && checkCell(3,3,sign)){ win(11, 22, 33, player); };
				break;
			case 12:
				if(checkCell(1,1,sign) && checkCell(1,3,sign)){ win(11, 12, 13, player); };
				if(checkCell(2,2,sign) && checkCell(3,2,sign)){ win(22, 12, 32, player); };
				break;
			case 13:
				if(checkCell(1,1,sign) && checkCell(1,2,sign)){ win(11, 12, 13, player); };
				if(checkCell(2,3,sign) && checkCell(3,3,sign)){ win(23, 33, 13, player); };
				if(checkCell(2,2,sign) && checkCell(3,1,sign)){ win(22, 31, 13, player); };
				break;
			case 21:
				if(checkCell(1,1,sign) && checkCell(3,1,sign)){ win(21, 11, 31, player); };
				if(checkCell(2,2,sign) && checkCell(2,3,sign)){ win(21, 22, 23, player); };
				break;
			case 22:
				if(checkCell(1,1,sign) && checkCell(3,3,sign)){ win(11, 22, 33, player); };
				if(checkCell(3,1,sign) && checkCell(1,3,sign)){ win(31, 22, 13, player); };
				if(checkCell(2,1,sign) && checkCell(2,3,sign)){ win(21, 22, 23, player); };
				if(checkCell(1,2,sign) && checkCell(3,2,sign)){ win(12, 22, 32, player); };
				break;
			case 23:
				if(checkCell(1,3,sign) && checkCell(3,3,sign)){ win(13, 23, 33, player); };
				if(checkCell(2,1,sign) && checkCell(2,2,sign)){ win(21, 23, 22, player); };
				break;
			case 31:
				if(checkCell(3,2,sign) && checkCell(3,3,sign)){ win(32, 33, 31, player); };
				if(checkCell(1,1,sign) && checkCell(2,1,sign)){ win(11, 21, 31, player); };
				if(checkCell(2,2,sign) && checkCell(1,3,sign)){ win(22, 13, 31, player); };
				break;
			case 32:
				if(checkCell(3,1,sign) && checkCell(3,3,sign)){ win(31, 33, 32, player); };
				if(checkCell(1,2,sign) && checkCell(2,2,sign)){ win(12, 22, 32, player); };
				break;
			case 33:
				if(checkCell(3,1,sign) && checkCell(3,2,sign)){ win(31, 32, 33, player); };
				if(checkCell(1,3,sign) && checkCell(2,3,sign)){ win(13, 23, 33, player); };
				if(checkCell(1,1,sign) && checkCell(2,2,sign)){ win(11, 22, 33, player); };
				break;
		}

		if(countTurns == 9 && $('#win-wrapper').length == 0){
			wrapper.append('<div id="win-wrapper"></div>');
			winWrapeer = $('#win-wrapper');
			winWrapeer.html('<p id="win-msg">No body wins !</p><button id="new-game">New game</button>');
			$('#new-game').on('click', function(){
				game.init();
			});
		}
	}

	function init(){

		turn       = 1;
		countTurns = 0;
		player1 = new Player('Player 1', 'X');
		player2 = new Player('Player 2', 'O');

		var name1 = player1.name;
		var name2 = player2.name;

		getScores(name1, name2);

		//reset board
		cells.html('');
		cells.css('opacity', 1);

		var winDiv = $('#win-wrapper');
		if(winDiv.length == 1){
			winDiv.remove();
		}

		resetBtn.off('click').on('click', function(){
			localStorage.setItem(name1, 0);
			localStorage.setItem(name2, 0);
			$('#first-score').html(0);
			$('#second-score').html(0);

		});

		cells.off('click').on('click', function(){

			var cellId = $(this).attr('id');
			countTurns += 1;
			switch(turn){
				case 1 :
					if($(this).html() == ''){
						$(this).html(player1.sign).addClass('sign1');
						checkForWin(cellId, player1);
						turn = 2;
					}
					break;

				case 2 :
					if($(this).html() == ''){
						$(this).html(player2.sign).addClass('sign2');
						checkForWin(cellId, player2);
						turn = 1;
					}
					break;

				default: 
					throw('error: Invalid turn parameter');
					break; 
			}
		});
	}

	function getScores(name1, name2){

		var firstRecord  = localStorage.getItem(name1);
		var secondRecord = localStorage.getItem(name2);

		$('#first-name').html(name1 + ':');
		$('#second-name').html(name2 + ':');

		if(firstRecord && secondRecord){
			$('#first-score').html(firstRecord);
			$('#second-score').html(secondRecord);
		}
		else {
			localStorage.setItem(name1, 0);
			localStorage.setItem(name2, 0);
			$('#first-score').html(0);
			$('#second-score').html(0);

		}
	}

	return {
		init : init
	};
}());