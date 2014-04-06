//main constructor
function Player(name, sign){
    this.name = name;
    this.sign = sign;
    this.choises = [];
}

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

//selectors
var $body      = $('body');
var $wrapper   = $('#wrapper');
var $board     = $('#main-board');
var $td        = $('#main-board tr td');
var $resetBtn  = $('#reset-stats');
var $changeBtn = $('#change-name');
var $diff      = $('input[name=diff]');
var $score1    = $('#first-score');
var $score2    = $('#second-score');
var $name1     = $('#first-name');
var $name2     = $('#second-name');
var $time      = $('#timeToThink');
var $selected  = $('#timeToThink option:selected');
var $seconds   = $('#seconds');

//initialize
var turnCount  = 0;
var turn       = [1,2].random();
var difficulty = 1;

var player1;
var player2;

var changedName = sessionStorage.getItem('nameChanged');
var playerName = (changedName) ? changedName : 'Player';

var cells;
var timeToMove = $selected.val();

var winningCombos = [
    [11, 12, 13],
    [21, 22, 23],
    [31, 32, 33],
    [11, 21, 31],
    [12, 22, 32],
    [13, 23, 33],
    [11, 22, 33],
    [13, 22, 31]
];

//set storage
sessionStorage.setItem('firstToMove', turn);
sessionStorage.setItem('difficulty', difficulty);
sessionStorage.setItem('timeToMove', $selected.val());

function checkForWin(playerChoises, winningCombos){
    var w = false;
    var l = winningCombos.length;
    var c = 0;
    for(var i = 0; i < l; i++){
        for(var j = 0; j <= 3; j++){
            if(playerChoises.find(winningCombos[i][j])){
                c++;
            }
        }
        if(c === 3){
            return winningCombos[i];
        }
        c = 0;
    }
    return false;
}

function checkForClose(player1, player2, winningCombos){
    var m = false;
    var l = winningCombos.length;
    var playerChoises = player1.choises;

    for(var i = 0; i < l; i++){
        var winCombo = winningCombos[i];
        var misses = [];
        for(var j = 0; j < 3; j++){
            var el = playerChoises.find(winCombo[j]);
            if(!el){
                misses.push(winCombo[j]);
            }
        }
        if(misses.length === 1 && $("#" + misses[0]).html() !== player2.sign){
            return misses[0];
        }
    }
    return false;
}

var game = (function() {

    function win(cell1, cell2, cell3, player){
        $td.off('click');
        $('#' + cell1 + ', #' + cell2 + ', #' + cell3).animate({opacity: .3}, 700);

        $body.append('<div id="win-wrapper"></div>');
        $winWrapeer = $('#win-wrapper');
        $winWrapeer.html('<p id="win-msg">' + player.name + ' wins !</p><button id="new-game">New game</button>');

        var currScore = Number(sessionStorage.getItem(player.name));
        sessionStorage.setItem(player.name, currScore + 1);

        setTimeout(function(){
            $score1.html(sessionStorage.getItem(player1.name));
            $score2.html(sessionStorage.getItem(player2.name));
        }, 1000);

        var firstToMove = Number(sessionStorage.getItem('firstToMove'));

        if(firstToMove === 1){
            sessionStorage.setItem('firstToMove', 2);
        }
        else if(firstToMove === 2){
            sessionStorage.setItem('firstToMove', 1);
        }

        $('#new-game').on('click', function(){
            game.init();
        });
    }

    function draw(){
        $body.append('<div id="win-wrapper"></div>');
        $winWrapeer = $('#win-wrapper');
        $winWrapeer.html('<p id="win-msg">Nobody wins !</p><button id="new-game">New game</button>');
        $('#new-game').on('click', function(){
            game.init();
        });
    }

    function init(){

        turn      = Number(sessionStorage.getItem('firstToMove'));
        turnCount = 0;

        player1 = new Player(playerName, 'X');
        player2 = new Player('Computer', 'O');

        cells = [11, 12, 13, 21, 22, 23, 31, 32, 33];

        getScores(player1, player2);

        //reset board
        $td.html('');
        $td.css('opacity', 1);
        $name1.css('text-decoration', 'underline');
        $('#win-wrapper').remove();

        $resetBtn.on('click', function(){
            turn      = 1;
            turnCount = 0;
            sessionStorage.setItem(player1.name, 0);
            sessionStorage.setItem(player2.name, 0);
            $score1.html(0);
            $score2.html(0);
            cells = [11, 12, 13, 21, 22, 23, 31, 32, 33];
        });

        if(turn === 2){
            AI.move();
        }

        $td.on('click', function(){

            var cellId = Number($(this).attr('id'));

            $name1.css('text-decoration', 'none');
            $name2.css('text-decoration', 'underline');

            if(turn == 1 && $(this).html() == ''){
                $(this).html(player1.sign).addClass('sign1');

                player1.choises.push(cellId);
                cells.remove(cellId);
                turn = 2;

                var winCombo = checkForWin(player1.choises, winningCombos);
                if(winCombo){
                    win(winCombo[0], winCombo[1], winCombo[2], player1);
                }
                else if(Number(turnCount) == 8 && $('#win-wrapper').length == 0){
                    draw();
                }
                else {
                    turnCount++;
                    setTimeout(AI.move, timeToMove);
                }
            }
        });
    }

    function getScores(player1, player2){

        var firstRecord  = sessionStorage.getItem(player1.name);
        var secondRecord = sessionStorage.getItem(player2.name);

        $name1.html(player1.name + ':');
        $name2.html(player2.name + ':');

        if(firstRecord && secondRecord){
            $score1.html(firstRecord);
            $score2.html(secondRecord);
        }
        else {
            sessionStorage.setItem(player1.name, 0);
            sessionStorage.setItem(player2.name, 0);
            $score1.html(0);
            $score2.html(0);
        }
    }

    function bindButtonEvents(){
        $changeBtn.on('click', function(){
            var newName = prompt('Enter your name: ');
            if(newName){
                newName = String(newName).trim();
                var len = newName.length;
                if(len > 0 && len < 10){
                    var score = sessionStorage.getItem(player1.name);
                    sessionStorage.removeItem(player1.name);
                    player1.name = newName;
                    playerName   = newName;
                    sessionStorage.setItem(player1.name, score);
                    sessionStorage.setItem('nameChanged', player1.name);
                    $name1.html(newName + ' :');
                }
            }
        });

        $diff.on("change", function(){
            sessionStorage.setItem('difficulty', $(this).val());
            difficulty = Number($(this).val());
        });

        $time.on('change', function(){
            sessionStorage.setItem('timeToMove', $(this).val());
            timeToMove = Number($(this).val());
            if(timeToMove == 1000){
                $seconds.html('second.');
            }
            else {
                $seconds.html('seconds.');
            }
        });

    }

    return {
        init : init,
        bindButtonEvents : bindButtonEvents,
        checkForWin : checkForWin,
        win : win,
        draw : draw
    };
}());

var AI = (function(){
    var hasChanse; 

    function getChance(){
        //genrate random percent
        var percents = [];
        for(var i = 1; i < 101; i++){
            percents.push(i);
        }
        var rand = percents.random();

        //chanse for AI to play ranodom in percents
        var easy   = 25;
        var medium = 9;
        var hard   = 0;

        switch(difficulty){
            case 0:
                hasChanse = (rand > easy) ? true : false;
                break;
            case 1:
                hasChanse = (rand > medium) ? true : false;
                break;
            case 2:
                hasChanse = (rand > hard) ? true : false;
                break;
        }
    }

    function move(){
        AI.getChance();
        var cellId  = cells.random();
        var corners = [11,13,31,33];
        var rand    = Math.floor(Math.random()*100);

        switch(turnCount){
            case 0:
                cellId = (rand > 50) ? corners.random() : 22;
                break;
            case 1:
                if(difficulty > 0){
                    if(corners.find(player1.choises[0])){
                        cellId = 22;
                    }
                    else {
                        cellId = corners.random();
                    }
                }
                break;
            case 2:
                if(difficulty > 0){
                    if(player1.choises[0] == 22){                       
                        var emptyCorners = corners.remove(player2.choises[0]);
                        switch(player2.choises[0]){
                            case 11: emptyCorners.remove(33); break;
                            case 13: emptyCorners.remove(31); break;
                            case 33: emptyCorners.remove(11); break;
                            case 31: emptyCorners.remove(13); break;
                        }
                        cellId = emptyCorners.random();
                    }
                    else if(corners.find(player1.choises[0])){
                        var emptyCorners = corners.remove(player1.choises[0]);
                        switch(player1.choises[0]){
                            case 11: emptyCorners.remove(33); break;
                            case 13: emptyCorners.remove(31); break;
                            case 33: emptyCorners.remove(11); break;
                            case 31: emptyCorners.remove(13); break;    
                        }
                        cellId = emptyCorners.random();
                    }
                }
                break;
            default:
                    if(turnCount == 3 && player2.choises[0] == 22 && difficulty > 1){
                        if((player1.choises.find(11) && player1.choises.find(33))
                        || (player1.choises.find(13) && player1.choises.find(31))){
                            cellId = [12,21,23,32].random();
                        }
                    }
                    else {
                        var winCell   = checkForClose(player2, player1, winningCombos);
                        var closeCell = checkForClose(player1, player2, winningCombos);
                        cellId    = (winCell && hasChanse) ? winCell : (closeCell && hasChanse) ? closeCell : cells.random();
                    }
                break;
        }
        


        $('#' + cellId).html(player2.sign);
        
        player2.choises.push(cellId);
        cells.remove(cellId);
        turn = 1;

        var winCombo = game.checkForWin(player2.choises, winningCombos);

        if(winCombo){
            game.win(winCombo[0], winCombo[1], winCombo[2], player2);
        }
        else if(Number(turnCount) == 8 && $('#win-wrapper').length == 0){
            game.draw();
        }
        else {
            turnCount++;
        }
        $name1.css('text-decoration', 'underline');
        $name2.css('text-decoration', 'none');
    }

    return {
        move : move,
        getChance : getChance
    }
}());