//selectors
var $body      = $('body');
var	$wrapper   = $('#wrapper');
var	$board     = $('#board');
var	$td        = $('#board tr td');
var $miniTd    = $('#mini-board tr td');
var $startBtn  = $('#startBtn');
var $stopBtn   = $('#stopBtn');
var $cntrBtn   = $('#controlsBtn');
var $speed     = $('#speed');
var $currSpeed = $('#speed option:selected');
var $points    = $('#points');
var $lines     = $('#lines');
var $status    = $('#status');
var $best 	   = $('#best');
var $controls  = $('#controls');

//global functions
function getCell(r, c){
	return $('td[data-row="' + r + '"][data-col="' + c + '"]');
}

function clearBoard(){
	$('#board tr td').removeClass('black gray').addClass('gray');
}

//function for creating 2D array
function create2DArray(rows) {
    var arr = [];
    for (var i = 0; i < rows; i++) {
    	arr[i] = [];
    }
    return arr;
}

//log functions 
function l(e){
	console.log(e);
}

function lArr(arr){
	for (var i = 0; i < arr.length; i++) {
		var r = '';
		for (var j = 0; j < arr[i].length; j++) {
			r += ' ' + arr[i][j];
		};
		l(r);
	};
	l('-------------');
}

//inital cordinates of each brick
var c = 4; //center the brick
_initPos = {
	1 : [[0, c],   [1, c],   [2, c],   [2, c+1]], // L
	2 : [[0, c+1], [1, c+1], [2, c+1], [2, c]],   // rL
	3 : [[0, c],   [1, c],   [2, c],   [3, c]],   // |
	4 : [[0, c],   [0, c+1], [1, c],   [1, c+1]], // []
	5 : [[0, c+1], [1, c],   [1, c+1], [1, c+2]], // T
	6 : [[0, c+1], [1, c],   [1, c+1], [2, c]],   // Z
	7 : [[0, c],   [1, c],   [1, c+1], [2, c+1]]  // rZ
}

//shapes
_shape = {
	1 : 'L',
	2 : 'rL',
	3 : '|',
	4 : '[]',
	5 : 'T',
	6 : 'Z',
	7 : 'rZ'
}

//rotate left and rigth methods
_rotateLeft = {
	1 : function(){
		var testArr = $.extend(true, [], this.pos); // deep copy
		switch(this.state){
			case 1:
				testArr[0][0]++; testArr[0][1]--;
				testArr[2][0]--; testArr[2][1]++;
				testArr[3][0] -= 2;
				return testArr;
			case 2:
				testArr[0][0]++; testArr[0][1]++;
				testArr[2][0]--; testArr[2][1]--;
				testArr[3][1] -= 2;
				return testArr;
			case 3:
				testArr[0][0]--; testArr[0][1]++;
				testArr[2][0]++; testArr[2][1]--;
				testArr[3][0] += 2;
				return testArr;
			case 4:
				testArr[0][0]--; testArr[0][1]--;
				testArr[2][0]++; testArr[2][1]++;
				testArr[3][1] += 2;
				return testArr;
		}
	},
	2 : function(){
		var testArr = $.extend(true, [], this.pos); // deep copy
		switch(this.state){
			case 1:
				testArr[0][0]++; testArr[0][1]--;
				testArr[2][0]--; testArr[2][1]++;
				testArr[3][1] += 2;
				return testArr;
			case 2:
				testArr[0][0]++; testArr[0][1]++;
				testArr[2][0]--; testArr[2][1]--;
				testArr[3][0] -= 2;
				return testArr;
			case 3:
				testArr[0][0]--; testArr[0][1]++;
				testArr[2][0]++; testArr[2][1]--;
				testArr[3][1] -= 2;
				return testArr;
			case 4:
				testArr[0][0]--; testArr[0][1]--;
				testArr[2][0]++; testArr[2][1]++;
				testArr[3][0] += 2;
				return testArr;
		}
	},
	3 : function(){
		var testArr = $.extend(true, [], this.pos); // deep copy
		switch(this.state){
			case 1:
			case 3:
				testArr[0][0]++;    testArr[0][1]--;
				testArr[2][0]--;    testArr[2][1]++;
				testArr[3][0] -= 2; testArr[3][1] += 2;
				return testArr;
			case 2:
			case 4:
				testArr[0][0]--;    testArr[0][1]++;
				testArr[2][0]++;    testArr[2][1]--;
				testArr[3][0] += 2; testArr[3][1] -= 2;
				return testArr;
		}
	},
	4 : function(){
		return this.pos;
	},
	5 : function(){
		var testArr = $.extend(true, [], this.pos); // deep copy
		switch(this.state){
			case 1:
				testArr[0][0]++; testArr[0][1]--;
				testArr[1][0]++; testArr[1][1]++;
				testArr[3][0]--; testArr[3][1]--;
				return testArr;
			case 2:
				testArr[0][0]++; testArr[0][1]++;
				testArr[1][0]--; testArr[1][1]++;
				testArr[3][0]++; testArr[3][1]--;
				return testArr;
			case 3:
				testArr[0][0]--; testArr[0][1]++;
				testArr[1][0]--; testArr[1][1]--;
				testArr[3][0]++; testArr[3][1]++;
				return testArr;
			case 4:
				testArr[0][0]--; testArr[0][1]--;
				testArr[1][0]++; testArr[1][1]--;
				testArr[3][0]--; testArr[3][1]++;
				return testArr;
		}
	},
	6 : function(){
		var testArr = $.extend(true, [], this.pos); // deep copy
		switch(this.state){
			case 1:
			case 3:
				testArr[0][0] += 2;
				testArr[2][0]++; testArr[2][1]--;
				testArr[3][0]--; testArr[3][1]--;	
				return testArr;
			case 2:
			case 4:
				testArr[0][0] -= 2;
				testArr[2][0]--; testArr[2][1]++;
				testArr[3][0]++; testArr[3][1]++;
				return testArr;
		}
	},
	7 : function(){
		var testArr = $.extend(true, [], this.pos); // deep copy
		switch(this.state){
			case 1:
			case 3:
				testArr[0][0] += 2;
				testArr[3][1] -= 2;	
				return testArr;
			case 2:
			case 4:
				testArr[0][0] -= 2;
				testArr[3][1] += 2;
				return testArr;
		}
	}
}

//base constuctor
function Brick(type){
	var that = this;
	this.state = 1;
	this.shape = _shape[type];
	this.pos = _initPos[type];
	this.testRotateLeft  = _rotateLeft[type];
	this.currLine = 0;
	this.stopHardDrop = false; //flag for hard drop

	//brick methods
	this.clean = function(arr){
		var i;
		for(i = 0; i < arr.length; i++) {
			_boardMap[arr[i][0]][arr[i][1]] = 0;
			$('td[data-row="' + arr[i][0] + '"][data-col="' + arr[i][1] + '"]')
			.removeClass('black')
			.addClass('gray');
		}
	}

	this.draw = function(arr){
		var i;
		for(i = 0; i < arr.length; i++) {
			_boardMap[arr[i][0]][arr[i][1]] = 1;
			$('td[data-row="' + arr[i][0] + '"][data-col="' + arr[i][1] + '"]')
			.removeClass('gray')
			.addClass('black');
		}
	}

	this.stick = function(arr){
		that.stopHardDrop = true; //flag for hard drop
		var i;
		for(i = 0; i < arr.length; i++) {
			_boardMap[arr[i][0]][arr[i][1]] = 2;
		}
	}

	this.softDrop = function(){
		var i;
		var testArr = $.extend(true, [], that.pos); // deep copy

		for(i = 0; i < that.pos.length; i++) {
			testArr[i][0]++;
		}

		if(that.testPos(testArr)){
			that.clean(that.pos);
			that.pos = testArr;
			that.draw(that.pos);
			that.currLine++;
		}
		else {
			if(that.currLine > 0){
				that.stick(that.pos);
				that.checkLines();
				tetris.newBrick();
			}
			else {
				tetris.lose();
			}
		}
	}

	this.testPos = function(arr){
		var i;
		for(i = 0; i < arr.length; i++) {
			if(!_boardMap[arr[i][0]]) return false;
			if(_boardMap[arr[i][0]][arr[i][1]] == 2) return false;
		}
		return arr;
	}

	this.hardDrop = function(arr){
		while(that.stopHardDrop == false){
			that.softDrop();
		}
		that.stopHardDrop = false;
	}

	this.moveLeft = function(){
		var i;
		var testArr = $.extend(true, [], that.pos); // deep copy

		for(i = 0; i < testArr.length; i++) {
			if(testArr[i][1] == 0) return;
		}

		for(i = 0; i < testArr.length; i++) {
			testArr[i][1]--;
		}

		for(i = 0; i < testArr.length; i++) {
			if(_boardMap[testArr[i][0]][testArr[i][1]] == 2) return;
		}

		that.clean(that.pos);
		that.pos = testArr;
		that.draw(that.pos);
	}

	this.moveRight = function(arr){
		var i;
		var testArr = $.extend(true, [], that.pos); // deep copy

		for(i = 0; i < testArr.length; i++) {
			if(testArr[i][1] == _boardCols-1) return;
		}

		for(i = 0; i < testArr.length; i++) {
			testArr[i][1]++;
		}

		for(i = 0; i < testArr.length; i++) {
			if(_boardMap[testArr[i][0]][testArr[i][1]] == 2) return;
		}

		that.clean(that.pos);
		that.pos = testArr;
		that.draw(that.pos);
	}

	this.rotateLeft = function(){
		var testArr = that.testRotateLeft();
		var floor   = false;
		for(i = 0; i < testArr.length; i++) {
			if(testArr[i][1] == -1) return;
			if(testArr[i][1] == _boardCols) return;
			if(!_boardMap[testArr[i][0]]) return;
			if(_boardMap[testArr[i][0]][testArr[i][1]] == 2) {
				floor = true;
				return;
			}
		}
		if(!floor){
			that.switchState();
			that.clean(that.pos);
			that.pos = testArr;
			that.draw(that.pos);
		}
	}

	this.switchState = function(direction){
		that.state = (that.state == 4) ? 1 : that.state + 1;
	}

	this.checkLines = function(){

		function clearLine(row){
			//animate
			var blinkSpeed = 15;
			$("#board").find('tr[data-line=' + row + ']')
				.fadeTo(blinkSpeed, 0.1).fadeTo(blinkSpeed * 2, 1.0)
				.fadeTo(blinkSpeed, 0.1).fadeTo(blinkSpeed * 2, 1.0)
				.removeAttr('style');

			//update board map
			var currLine = row;
			for(; currLine >= 2; currLine--) {
				_boardMap[currLine] = _boardMap[currLine - 1];
			}

			//clear hiden lines
			_boardMap[0] = _boardMap[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			//redraw
			$('#board tr td').removeClass('black gray').addClass('gray');
			var r = _boardRols - 1;
			for(; r >= 2; r--) {
				var c = _boardCols - 1;
				for(; c >= 0; c--) {
					if(_boardMap[r][c] == 2){
						getCell(r, c).removeClass('gray').addClass('black');
					}
				}
			}
			_points += _linesVal;
			_lines++;
			$('#points').html(_points);
			$('#lines').html(_lines);
			//recursive call for more than one line
			that.checkLines();
		}

		//2 hiden rows will not be checked
		var r = _boardRols - 1;
		for(; r >= 2; r--) {
			var n = 0;
			var c = _boardCols - 1;
			for(; c >= 0; c--) {
				if(_boardMap[r][c] == 2) n++;
			}
			if(n == _boardCols) {
				n = 0;
				clearLine(r);
				break;
			}
		}
		return;
	}
}

if(localStorage.getItem('tetrisBest') == null) localStorage.setItem('tetrisBest', 0);

var tetris = (function() {

	//constants
	_boardRols    = 22;
	_boardCols    = 10;
	_brickTypes   = 7;
	_tdSizeIndex  = 0.013;
	_speed        = 1000;
	_boardMapOrig = create2DArray(_boardRols);
	_topCenter	  = Math.ceil(((_boardCols + 1) / 2) - 2);
	_interval     = 0;
	_msg 		  = {
		pressStart : 'Press start(enter) !',
		paused : 'Paused',
		lose : 'You lose !',
		hiScore : 'This is hi-score !'
	};

	//main variables
	_brick 		 = {};
	_nextBrick   = {};
	_points      = 0;
	_lines		 = 0;
	_linesVal    = 0;

	//game status
	_isDone      = true;
	_paused      = false;
	_active      = false;

	//user top score
	_currBest  	 = Number(localStorage.getItem('tetrisBest'));

	//create the 2D array and fill it with 0
	for(var i = 0; i < _boardRols; i++) {
		for(var j = 0; j < _boardCols; j++) {
			_boardMapOrig[i][j] = 0; //0 - empty, 1 - brick, 2 - wall
		}
	}

	//create the board
	var table = '';
	table += '<table id="board" border="1">';
		for(var i = 0; i < _boardRols; i++){
			table += '<tr data-line="' + i + '">';
				for(var j = 0; j < _boardCols; j++){
					table += '<td data-row="'+i+'" data-col="'+j+'" class="gray" ';
					if(i == 0 || i == 1) table += 'style="display : none"';
					table += '></td>';
				}
			table += '</tr>';
		}	
	table += '</table>';

	//make board responsive
	var tdWidth = Math.round($body.width()*_tdSizeIndex) + 'px';

	$.when($wrapper.find('#inner-wrapper').prepend(table)).then(function(){
		$('#board tr td').width(tdWidth);
		$('#board tr td').height(tdWidth);
	});

	$('#inner-wrapper').height($('#board').height());
	$('#inner-wrapper').width($('#board').width() + $('#score').width() + 25);
	$('#outer-wrapper').width($('#board').width() + $('#score').width() + 35);

	//create mini board
	var minitable = '';
	minitable += '<table id="mini-board" border="1">';
		for(var i = 0; i < 4; i++){
			minitable += '<tr>';
				for(var j = 0; j < 4; j++){
					minitable += '<td class="gray" id="'+i+'-'+j+'"></td>';
				}
			minitable += '</tr>';
		}	
	minitable += '</table>';

	$.when($wrapper.find('#mini-table-container').append(minitable)).then(function(){
		$('#mini-board tr td').width(tdWidth);
		$('#mini-board tr td').height(tdWidth);
	});

	function init(){
		_points    = 0;
		_lines     = 0;
		_active    = true;
		_paused    = false;
		_isDone    = true;
		_boardMap  = $.extend(true, [], _boardMapOrig); // deep copy
		_nextBrick = new Brick(Math.floor(Math.random() * _brickTypes) + 1);
		_brick     = new Brick(Math.floor(Math.random() * _brickTypes) + 1);
		_speed     = $speed.find('option:selected').val();
		_linesVal  = getLinesVal();
 		_interval  = setInterval(_brick.softDrop, _speed);
 		_currBest  = Number(localStorage.getItem('tetrisBest'));
 		$points.html(_points);
		$best.html(_currBest);
		$lines.html(_lines);
		$speed.prop('disabled', false);
		drawNext(_nextBrick.shape);
	}

	function newBrick(){
		clearInterval(_interval);
		_brick     = $.extend(true, [], _nextBrick); // deep copy
		_nextBrick = new Brick(Math.floor(Math.random() * _brickTypes) + 1);
		_interval  = setInterval(_brick.softDrop, _speed);
		drawNext(_nextBrick.shape);
	}

	function lose(){
		clearInterval(_interval);
		_active = false;
		$startBtn.show();
		$stopBtn.hide();
		$speed.prop('disabled', false);
		if(_currBest < _points){
			localStorage.setItem('tetrisBest', _points);
			$status.html(_points +' !!! ' + _msg.hiScore);
		}
		else {
			$status.html(_msg.lose);
		}
		animateStatus();
	}

	function drawNext(shape){
		var arr = [];
		switch(shape){
			case 'L':  arr = ['#0-1','#1-1','#2-1','#2-2']; break;
			case 'rL': arr = ['#0-2','#1-2','#2-2','#2-1']; break;
			case '|':  arr = ['#0-1','#1-1','#2-1','#3-1']; break;
			case '[]': arr = ['#1-1','#1-2','#2-1','#2-2']; break;
			case 'T':  arr = ['#1-1','#2-0','#2-1','#2-2']; break;
			case 'Z':  arr = ['#3-1','#2-1','#2-2','#1-2']; break;
			case 'rZ': arr = ['#3-2','#2-2','#2-1','#1-1']; break;
		}

		$('#mini-board tr td').removeClass('black gray').addClass('gray');

		for(i = 0; i < arr.length; i++) {
			$(arr[i]).addClass('black');
		}
	}

	function getLinesVal(){
		var level    = Number($speed.find('option:selected').html());
		var linesVal = 0;
		switch(level){
			case 1: linesVal = 100; break;
			case 2: linesVal = 120; break;
			case 3: linesVal = 160; break;
			case 4: linesVal = 200; break;
			case 5: linesVal = 250; break;
			case 6: linesVal = 300; break;
			case 7: linesVal = 380; break;
			case 8: linesVal = 500; break;
			case 9: linesVal = 700; break;
		}
		return linesVal;
	}

	function animateStatus(){
		var blinkSpeed = 80;
		$status
		.fadeTo(blinkSpeed, 0.1).fadeTo(blinkSpeed * 2, 1.0)
		.fadeTo(blinkSpeed, 0.1).fadeTo(blinkSpeed * 2, 1.0)
		.fadeTo(blinkSpeed, 0.1).fadeTo(blinkSpeed * 2, 1.0);
	}

	function bindButtonEvents(){
		$startBtn.off('click').on('click', function(){
			if(_interval) clearInterval(_interval);
			clearBoard();
			$startBtn.hide();
			$stopBtn.show();
			init();
			$speed.prop('disabled', true);
			$status.html('');
		});

		$stopBtn.off('click').on('click', function(){
			clearInterval(_interval);
			clearBoard();
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
		    	if(_isDone && !_paused && _active){
		    		_isDone = false;
		    		_brick.moveLeft();
		    		_isDone = true;
		    	}
		    	break;
	        // Key up.
	        case 38: 
	        	if(_isDone && !_paused && _active){
		    		_isDone = false;
		    		_brick.rotateLeft();
		    		_isDone = true;
		    	}
		    	break;
	        // Key right.
	        case 39: 
	        	if(_isDone && !_paused && _active){
		    		_isDone = false;
		    		_brick.moveRight();
		    		_isDone = true;
		    	}
	        	break;
	        //Key down.
	        case 40: 
	        	if(_isDone && !_paused && _active){
	        		_isDone = false;
	        		_brick.softDrop();
	        		_isDone = true;
	        	}
	        	break;
	       	//Key X.
	        case 88: 
	        	if(_isDone && !_paused && _active){
	        		_isDone = false;
	        		_brick.hardDrop();
	        		_isDone = true;
	        	}
	        	break;
	       	//enter 
	        case 13:
				if($startBtn.css('display') !== 'none'){
	        		$startBtn.trigger('click');
	        	}
	        	break;
	        //esc
	        case 27:
	        	if($stopBtn.css('display') !== 'none'){
	        		$stopBtn.trigger('click');
	        	}
	        	break;
	        //space
	        case 32:
	        	if(_paused && $status.html() == _msg.paused){
	        		_interval  = setInterval(_brick.softDrop, _speed);
					_paused = false;
					$status.html('');
	        	}
	        	else if(!_paused 
	        		&& _active
	        		&& $status.html() !== _msg.pressStart 
	        		&& $status.html() !== _msg.lose){
	        		clearInterval(_interval);
	        		_paused = true;
	        		$status.html(_msg.paused);
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
		bindButtonEvents : bindButtonEvents,
		newBrick : newBrick,
		lose : lose
	};
})();