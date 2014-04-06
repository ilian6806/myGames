
$(document).ready(function() {
    game();
});

//prevent images dragging
$('.static').on('dragstart', function(event) { event.preventDefault(); });

function game(){
    var MAX_POINTS      = 200;
    var MAX_TIME        = 30;
    var SCREEN_OFFSET   = 300;
    var MIN_LEFT_OFFSET = 10;
    var MIN_TOP_OFFSET  = 120;

    $('#score').html(0);

    //check for cookie
    if(getCookie('bestScoreBasket')){
        $('#best').html(getCookie('bestScoreBasket'));
    }
    
    var maxHeight = $('html').height() - $('#basket').height() - SCREEN_OFFSET;
    var maxWidth  = $('html').width()  - $('#basket').width()  - SCREEN_OFFSET;

    //add functionality to images
    $('#ball').draggable({cursor: "pointer"});
    $('#basket').droppable({
      drop: function() {

            var randHeight = randomFromInterval(MIN_TOP_OFFSET,maxHeight);
            var randWidth  = randomFromInterval(MIN_LEFT_OFFSET,maxWidth);
            
            $('#score').html($('#score').html()*1 + 1);
            $('#basket').css('top', randHeight);
            $('#basket').css('left', randWidth);
      }
    });

    //make the ball bounce
    for (var i = 0; i <= MAX_POINTS; i++) {
        $('#ball').animate({width : '300px', height: '300px'}, 800);
        $('#ball').animate({width : '100px', height: '100px' },800);
    };

    //start the timer
    var time = MAX_TIME;
    $('#timer').html(time)

    setInterval(function(){
        time -= 1;
        $('#timer').html(time)
        if(time == 0){
            var score = $('#score').html();

            if(score>(getCookie('bestScoreBasket'))){
                setCookie("bestScoreBasket",score,1000);
                alert('Game over ! '+score+' ! This is a high score !');
                //update best score
                $('#best').html(getCookie('bestScoreBasket'))
            }
            else {
                alert('Game over!');
            }

            //reset timer and score
            time  = MAX_TIME;
            score = 0;
            $('#timer').html(MAX_TIME)
            $('#score').html(0);
        }
    },1000)
}

//cookies
function setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name){
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1){
      c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1){
      c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
        c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

//random number from interval
function randomFromInterval(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}