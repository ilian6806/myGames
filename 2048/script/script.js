"use strict";

var initStatsJSON = {
    "win" : 0, 
    "lose" : 0, 
    "top" : {
        "1": [0, 0],
        "2": [0, 0],
        "3": [0, 0],
        "4": [0, 0],
        "5": [0, 0]
    }
}

if(localStorage.getItem('2048-Best') == null) localStorage.setItem('2048-Best', 0);
if(localStorage.getItem('2048-Stats') == null) localStorage.setItem('2048-Stats', JSON.stringify(initStatsJSON));

var game = (function() {

    "use strict";

    //when half board is full there is a chance to spawn 4 instead of 2
    var CHANCE_TO_GET_BIGGER = 30; //%
    var MIN_EMPTY_CELLS_TO_GET_BIGGER = 8;

    //main variables 
    var _score   = 0;
    var _isDone  = true;
    var _isMoved = false;
    var _statsActive = false;

    function createBoard(elementId, rolls, coll) {
        var table = '';
        table += '<table id="board">';
            for(var i = 0; i < rolls; i++) {
                table += '<tr>';
                    for(var j = 0; j < coll; j++) {
                        table += '<td class="cell-0" id="' + i + '-'+ j +'"></td>';
                    }
                table += '</tr>';
            }   
        table += '</table>';

        $(elementId).html(table);
    }

    function start() {
        $("#board tr td").removeClass().addClass("cell-0").html("");
        $("#best-score").html(localStorage.getItem('2048-Best'));
        $("#current-score").html(0);
        var stats = JSON.parse(localStorage.getItem("2048-Stats"));
        setStats(stats)
        _score   = 0;
        _isMoved = false;
        spawnNewCell();
        spawnNewCell();
    }

    function end() {
        var currBest  = parseInt(localStorage.getItem('2048-Best'));
        var currStats = JSON.parse(localStorage.getItem('2048-Stats'));

        if(_score > currBest) {
            localStorage.setItem('2048-Best', _score);
        }

        if(_score < 2048) {
            currStats.lose += 1;
        } 

        if(_score > currStats.top['5'][0]){
            var currLevel = getBestLevel();
            var currScoresArr = [];
            var topObj = {};

            for(var i = 1; i <= 5; i++) {
                currScoresArr.push([currStats.top[i][0], currStats.top[i][1]]);
            }

            currScoresArr.push([_score, currLevel]);
            currScoresArr.sort(function(a,b) { return a[0] < b[0]; });

            for(var i = 1; i <= 5; i++) {
                topObj[i] = currScoresArr[i-1];
            }

            currStats.top = topObj;
        }

        setStats(currStats);
        localStorage.setItem("2048-Stats", JSON.stringify(currStats));

        $("#new-game-btn").show().off("click").on("click", game.restart);

        var wantToRestart = confirm("Game over! Your score is " + _score + ". Try again ?");
        if(wantToRestart) game.restart() 
    }

    function restart() {
        $("#new-game-btn").hide();
        game.start();
    }

    function isNewCellBigger() {
        var randomPercent = Math.floor(Math.random() * 100);
        if(randomPercent > CHANCE_TO_GET_BIGGER){
            return false;
        } else {
            return true;
        }
    }

    function getRandomEmptyCellId() {
        var emptyCells = $(".cell-0");
        var randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        return randomCell.id;
    }

    function checkForCombinations() {
        for(var r = 0; r <= 3; r++) {
            for(var c = 0; c <= 3; c++) {
                var el  = document.getElementById(r + "-" + c);
                var top = document.getElementById((r + 1) + "-" + c);
                if(top && top.innerHTML == el.innerHTML) return true;
                var btm = document.getElementById((r - 1) + "-" + c);
                if(btm && btm.innerHTML == el.innerHTML) return true;
                var lft = document.getElementById(r + "-" + (c - 1));
                if(lft && lft.innerHTML == el.innerHTML) return true;
                var rgh = document.getElementById(r + "-" + (c + 1));
                if(rgh && rgh.innerHTML == el.innerHTML) return true;
            }
        }
        return false;
    }

    /********STATISTICS***********/
    function getBestLevel() {
        var values = [];
        $("#board tr td").each(function(){
            values.push($(this).html() * 1);
        });
        return values.sort(function(a,b){return b - a})[0];
    }

    function setStats(json) {
        $("#win").html(json.win);
        $("#lose").html(json.lose);

        for(var i = 1; i <= 5; i++) {
            $("#score-" + i).html(json.top[i][0]);
            $("#level-" + i).html(json.top[i][1]);
        }
    }

    function resetStats() {
        var wantToResetStats = confirm("Are you sure ?");
        if(wantToResetStats) {
            localStorage.setItem("2048-Stats", JSON.stringify(initStatsJSON));
            setStats(initStatsJSON);
        }
    }

    function toggleStats() {
        if(!_statsActive){
            _statsActive = true;
            $("#statistics").animate({"margin-right": "0px"}, 300);
        } else {
            _statsActive = false;
            $("#statistics").animate({"margin-right": "-205px"}, 300);
        }
    }

    $("#stats-reset-btn").off("click").on("click", resetStats);
    $("#stats-btn").off("click").on("click", toggleStats);
    
    /**********************/

    function spawnNewCell() {
        
        $("#board tr td").removeClass("merged");
        
        var emptyCellsCount = $(".cell-0").length;
        var newCellValue = (emptyCellsCount > MIN_EMPTY_CELLS_TO_GET_BIGGER) ? 2 : (isNewCellBigger()) ? 4 : 2;
        var newCellId = getRandomEmptyCellId();

        var timeout = setTimeout(function() {
            $("#" + newCellId)
                .removeClass()
                .html(newCellValue)
                .animate({"font-size": "18px"}, 150)
                .addClass("cell-" + newCellValue)       
                .animate({"font-size": "16px"}, 150);

            //check for game ending
            if(emptyCellsCount == 1 && !checkForCombinations()) {
                clearTimeout(timeout);
                game.end();
            }
        }, 100);
    }

    function animateMerge(el) {
        var currVal = parseInt(el.innerHTML);
        var newVal  = currVal * 2;

        $(el)
            .removeClass("cell-" + currVal)
            .addClass("cell-" + newVal)
            .addClass("merged") //this class prevent multiple merges
            .html(newVal);

        _score += newVal;
        $("#current-score").html(_score);

        //check for win
        if(newVal == 2048){
            var interval = setTimeout(function(){
                clearInterval(interval);
                var currStats = JSON.parse(localStorage.getItem('2048-Stats'));
                currStats.win++;
                setStats(currStats);
                localStorage.setItem("2048-Stats", JSON.stringify(currStats));
                alert("2048 ! You win ! Continue to get high score !");
            }, 200);
        }
    }

    function emptyCell(el) {
        $(el).text('').removeClass().addClass("cell-0");
    }

    function checkForMerge(currItem, nextItem) {
        if(nextItem.innerHTML == currItem.innerHTML 
        && !$(nextItem).hasClass('merged') 
        && !$(nextItem).hasClass('cell-0')) {
            animateMerge(nextItem);
            emptyCell(currItem);
            _isMoved = true;
            return true;
        }
        return false;
    }

    function moveToNextCell(currItem, nextItem) {
        nextItem.innerHTML = currItem.innerHTML;
        nextItem.className = currItem.className;
        emptyCell(currItem);
        _isMoved = true;
    }

    function getCellId(r, c, direction, i) {
        var ids = [];
        switch(direction) {
            case 'left':  ids = [r + '-' + c,  r + '-' + (c - 1), r + '-' + (c - 2), r + '-' + (c - 3)]; break;
            case 'right': ids = [r + '-' + c,  r + '-' + (c + 1), r + '-' + (c + 2), r + '-' + (c + 3)]; break;
            case 'up':    ids = [r + '-' + c,  (r - 1) + '-' + c, (r - 2) + '-' + c, (r - 3) + '-' + c]; break;
            case 'down':  ids = [r + '-' + c,  (r + 1) + '-' + c, (r + 2) + '-' + c, (r + 3) + '-' + c]; break;
        }
        return ids[i];
    }

    /*
      If this function returns true, the cell is merged.
      If not, it will move the cell to next empty slot.
    */
    function moveCellByDirection(direction, r, c) {

        var currItem = document.getElementById(getCellId(r, c, direction, 0));
        var nextItem = document.getElementById(getCellId(r, c, direction, 1));

        if((nextItem.innerHTML != currItem.innerHTML && !$(nextItem).hasClass('cell-0'))
        || checkForMerge(currItem, nextItem)
        || $(currItem).hasClass('cell-0')
        || ($(nextItem).hasClass('merged'))) {
            return true;
        }
        
        if($(nextItem).hasClass('cell-0')) {
            //try to merge with next cell
            var tempNext = document.getElementById(getCellId(r, c, direction, 2));
            if(tempNext && checkForMerge(currItem, tempNext)) return true;
            //if not, try to move
            if(tempNext && $(tempNext).hasClass('cell-0')) {
                nextItem = tempNext;
                //try to merge with next cell
                tempNext = document.getElementById(getCellId(r, c, direction, 3));                    
                if(tempNext && checkForMerge(currItem, tempNext)) return true;
                //if not, try to move
                if(tempNext && $(tempNext).hasClass('cell-0')) {
                    nextItem = tempNext;
                    if(checkForMerge(currItem, nextItem)) {
                        return true;
                    } else {
                        moveToNextCell(currItem, nextItem)
                    }
                } else {
                    moveToNextCell(currItem, nextItem)
                }
            } else {
                moveToNextCell(currItem, nextItem)
            }
        }
    }

    function moveLeft() {
        for(var c = 1; c <= 3; c++) {
            for(var r = 0; r <= 3; r++) {
                if(moveCellByDirection('left', r, c)) continue;
            }
        }
    }

    function moveRight() {
        for(var c = 2; c >= 0; c--) {
            for(var r = 0; r <= 3; r++) {
                if(moveCellByDirection('right', r, c)) continue;
            }
        }
    }

    function moveUp() {
        for(var r = 1; r <= 3; r++) {
            for(var c = 0; c <= 3; c++) {
                if(moveCellByDirection('up', r, c)) continue;
            }
        }
    }

    function moveDown() {
        for(var r = 2; r >= 0; r--) {
            for(var c = 0; c <= 3; c++) {
                if(moveCellByDirection('down', r, c)) continue;
            }
        }
    }

    function clickHandler(func) {
        if(_isDone){
            _isDone = false;
            func();
            if(_isMoved) {
                _isMoved = false;
                spawnNewCell();
            } 
            _isDone = true;
        }
        return false;
    }

    $(document).keydown(function(e){
        switch(e.keyCode) {
            case 37: clickHandler(moveLeft); break; 
            case 38: clickHandler(moveUp); break; 
            case 39: clickHandler(moveRight); break; 
            case 40: clickHandler(moveDown); break;         
        }
    });

    return {
        createBoard : createBoard,
        start : start,
        end : end,
        restart : restart
    };
})();
