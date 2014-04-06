//extent Array and String prototypes
String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g, '');
};

Array.prototype.random = function() {
	return r = this[Math.floor(Math.random() * this.length)];
}

Array.prototype.remove = function(el) {
	var index = this.indexOf(el);
	if (index > -1) {
	    this.splice(index, 1);
	}
	return this;
}

Array.prototype.find = function(el) {
	var index = this.indexOf(el);
	return (index > -1) ? el : false;
}

function l(e){
	console.log(e)
}

if(localStorage.getItem('snakeBest') == null) localStorage.setItem('snakeBest', 0);

var snake = (function() {

	//selectors
	var $body      = $('body');
	var	$wrapper   = $('#wrapper');
	var	$board     = $('#board');
	var	$td        = $('#board tr td');
	var $startBtn  = $('#startBtn');
	var $stopBtn   = $('#stopBtn');
	var $cntrBtn   = $('#controlsBtn');
	var $speed     = $('#speed');
	var $currSpeed = $('#speed option:selected');
	var $points    = $('#points');
	var $food      = $('#food');
	var $status    = $('#status');
	var $controls  = $('#controls');
	var $best 	   = $('#best');

	//constants
	_boardSize   = 20;
	_tdSizeIndex = 0.013;
	_speed       = 1000;
	_boardMap 	 = Create2DArray(_boardSize);
	_interval    = 0;
	_msg 		 = {
		pressStart : 'Press start(enter) !',
		paused : 'Paused',
		loose : 'You loose !'
	}

	//main variables
	_snake       = [[7,5], [7,6], [7,7]];
	_direction   = 2; //right
	_food 		 = [];
	_foodCount   = 0;
	_points      = 0;
	_foodVal     = 0;
	_isDone      = true;
	_paused      = false;
	_currBest  	 = Number(localStorage.getItem('snakeBest'));


	function init(){
		_snake       = [[7,5], [7,6], [7,7]];
		_direction   = 2;
		_foodCount   = 0;
		_points      = 0;
		_paused      = false;
		_isDone      = true;
		_speed       = $('#speed').find('option:selected').val();
		getFoodVal($('#speed').find('option:selected').html());
		showSnake(_snake);
		generateFood();
		_interval = setInterval(function(){
			moveSnake(_direction);
		}, _speed);
		$points.html(_points);
		$best.html(_currBest);
		$food.html(_foodCount);
		$speed.prop('disabled', false);
	}

	//function for creating 2D array
	function Create2DArray(rows) {
	    var arr = [];
	    for (var i = 0; i < rows; i++) {
	    	arr[i] = [];
	    }
	    return arr;
	}

	//create the 2D array and fill it with 0
	for(var i = 0; i < _boardSize; i++) {
		for(var j = 0; j < _boardSize; j++){
			_boardMap[i][j] = 0;
		}
	}

	//create the board
	var table = '';
	table += '<table id="board" border="0">';
		//rows
		for(var i = 0; i < _boardSize; i++){
			table += '<tr>';
				//td
				for(var j = 0; j < _boardSize; j++){
					table += '<td data-row="'+i+'" data-col="'+j+'" class="cell"></td>';
				}
			table += '</tr>';
		}	
	table += '</table>';

	var tdWidth = Math.round($body.width()*_tdSizeIndex) + 'px';

	$.when($wrapper.find('#inner-wrapper').html(table)).then(function(){
		$('#board tr td').width(tdWidth);
		$('#board tr td').height(tdWidth);
	});

	$('#inner-wrapper').width($('#board').width());
	$('#inner-wrapper').height($('#board').height());
	$('#outer-wrapper').width($('#board').width());
	$('#outer-wrapper').height($('#board').height() + 25);

	function getCell(r, c){
		return $('td[data-row="' + r + '"][data-col="' + c + '"]');
	}

	function getFoodVal(level){
		switch(Number(level)){
			case 1: _foodVal = 5; break;
			case 2: _foodVal = 6; break;
			case 3: _foodVal = 7; break;
			case 4: _foodVal = 8; break;
			case 5: _foodVal = 9; break;
			case 6: _foodVal = 10; break;
			case 7: _foodVal = 11; break;
			case 8: _foodVal = 12; break;
			case 9: _foodVal = 13; break;
		}
	}

	function showSnake(arr){
		var len = arr.length;
		$('#board tr td').removeClass('snake food').addClass('cell');
		for(var i = 0; i < len; i++){
			getCell(arr[i][0], arr[i][1]).removeClass('cell food').addClass('snake');
		}
	}

	function moveSnake(direction){
		//snake's head
		var lastEl  = _snake[(_snake.length)-1];
		var firstEl = _snake[0];
		var nextEl;
		switch(direction){
			case 1: //left
				nextEl = [lastEl[0],lastEl[1]-1];
				_snake.push(nextEl);
				_snake.shift();
				break;
			case 2: //rigth
				nextEl = [lastEl[0],lastEl[1]+1];
				_snake.push(nextEl);
				_snake.shift();
				break;
			case 3: //up
				nextEl = [lastEl[0]-1,lastEl[1]];
				_snake.push(nextEl);
				_snake.shift();
				break;
			case 4: //down
				nextEl = [lastEl[0]+1,lastEl[1]];
				_snake.push(nextEl);
				_snake.shift();
				break;
		}
		checkHead(nextEl, firstEl, nextEl);
		_isDone = true;
	}

	function checkHead(head, firstEl, nextEl){
		if(head[0] == _food[0]
		&& head[1] == _food[1]){
			_foodCount++;
			_points += _foodVal;
			$food.html(_foodCount);
			$points.html(_points);
			_snake.unshift(firstEl);
			getCell(nextEl[0], nextEl[1]).removeClass('food').addClass('snake');
			generateFood();
		}
		else if(isSelfEating(_snake, head) || isOutOfBox(head)){
			$status.html(_msg.loose);
			for(var i = 0; i < 4; i++){
				$('.snake').animate({opacity: 0}, 100).animate({opacity: 1000}, 100);
			}
			if(_currBest < _points){
				localStorage.setItem('snakeBest', _points);
				$best.html(_points);
				_currBest = _points;
			}
			clearInterval(_interval);
			$startBtn.show();
			$stopBtn.hide();
			$speed.prop('disabled', false);
			return;
		}
		else {
			getCell(nextEl[0], nextEl[1]).removeClass('cell').addClass('snake');;
			getCell(firstEl[0], firstEl[1]).removeClass('snake').addClass('cell');

			if(nextEl[0] == firstEl[0]
		    && nextEl[1] == firstEl[1]){
		    	setTimeout(function(){
		    		getCell(nextEl[0], nextEl[1]).removeClass('cell').addClass('snake');
		    	}, _speed);
			}
		}
	}

	function isSelfEating(arr, el){
		for(var i = 0; i < arr.length-1; i++){
			if(arr[i][0] == el[0] && arr[i][1] == el[1]) return true;
		}
		return false;
	}

	function isOutOfBox(head){
		if(head[0] < 0 || head[1] < 0) return true;
		if(head[0] > _boardSize-1 || head[1] > _boardSize-1) return true;
		return false;
	}

	function generateFood(){
		//set snake's fields to 1
		for(var i = 0; i < _snake.length; i++){
			_boardMap[_snake[i][0]][_snake[i][1]] = 1;
		}

		//generate random row and col
		var row, col;
		do {
			row = Math.floor(Math.random() * (_boardSize-1));
			col = Math.floor(Math.random() * (_boardSize-1));
		} while(_boardMap[row][col] == 1);
		
		//set snake's fields to 0
		for(var i = 0; i < _snake.length; i++){
			_boardMap[_snake[i][0]][_snake[i][1]] = 0;
		}

		_food = [row, col];
		getCell(row, col).removeClass('cell snake').addClass('food');
	}

	function bindButtonEvents(){
		$startBtn.off('click').on('click', function(){
			if(_interval) clearInterval(_interval);
			$startBtn.hide();
			$stopBtn.show();
			init();
			$speed.prop('disabled', true);
			$status.html('');
		});

		$stopBtn.off('click').on('click', function(){
			clearInterval(_interval);
			$('#board tr td').removeClass('snake food').addClass('cell');
			$startBtn.show();
			$stopBtn.hide();
			$speed.prop('disabled', false);
			$status.html(_msg.pressStart);
		});

		$cntrBtn.off('click').on('click', function(){
			if($controls.css('display') == 'none'){
				$controls.show(400);
			}
			else {
				$controls.hide(400);
			}
			$cntrBtn.trigger('blur');
		});
	}

	$(document).keydown(function(e){
	    switch(e.keyCode) {
		    //Key left.
		    case 37:
		    	if((_direction == 3 || _direction == 4) && _isDone) {
		    		_direction = 1;
		    		_isDone = false;
		    		return false;
		    	}
		    	return false;
	        // Key up.
	        case 38: 
	        	if((_direction == 1 || _direction == 2) && _isDone) {
	        		_direction = 3;
	        		_isDone = false;
	        		return false;
	        	}
	        	return false;
	        // Key right.
	        case 39: 
	        	if((_direction == 3 || _direction == 4) && _isDone) {
	        		_direction = 2;
	        		_isDone = false;
	        		return false;
	        	}
	        	return false;
	        // Key down.
	        case 40: 
	        	if((_direction == 1 || _direction == 2) && _isDone) {
	        		_direction = 4;
	        		_isDone = false;
	        		return false;
	        	}
	        	return false;
	       	//enter 
	        case 13:
				if($startBtn.css('display') !== 'none'){
	        		$startBtn.trigger('click');
	        	}
	        	break;
	        //space
	        case 32:
	        	if(_paused && $status.html() == _msg.paused){
	        		_interval = setInterval(function(){
						moveSnake(_direction);
					}, _speed);
					_paused = false;
					$status.html('');
	        	}
	        	else if(!_paused 
	        		&& $status.html() !== _msg.pressStart 
	        		&& $status.html() !== _msg.loose){
	        		clearInterval(_interval);
	        		_paused = true;
	        		$status.html(_msg.paused);
	        	}
	        	break;
	        //esc
	        case 27:
	        	if($stopBtn.css('display') !== 'none'){
	        		$stopBtn.trigger('click');
	        	}
	        	break;
	        //+
	        case 107:
	        	if($speed.prop('disabled') !== true){
	        		$('#speed')
		        		.find('option:selected').prop('selected', false)
		        		.next().prop('selected', true);
	        	}
	        break;
	        //-
	        case 109:
	        	if($speed.prop('disabled') !== true){
	        		$('#speed')
		        		.find('option:selected').prop('selected', false)
		        		.prev().prop('selected', true);
	        	}
	        break;
		}
	});

	return {
		bindButtonEvents : bindButtonEvents
	};
})();