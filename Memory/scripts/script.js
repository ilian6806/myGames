//start timer
var time = 0;

function displayCount() {
    document.getElementById('time').innerHTML = ("000" + time).slice(-3);
}

function count() {
    time++;
    if(time == 900){ //Max time is 15 minutes. 
        alert("Time's over!");
        window.location.reload(true);
    }
    displayCount();
}
var interval = setInterval(count,1000);

//check for cookie and set record 
var best = document.getElementById('best');
if(getCookie('best')){
    best.innerHTML = ("000" + getCookie('best')).slice(-3);
}
else {
    setCookie("best",999,1000);
    best.innerHTML = ("000" + getCookie('best')).slice(-3);
}

//function for creating 2D array
function Create2DArray(rows) {
    var arr = [];
    for (var i=0; i<rows; i++) {
        arr[i] = [];
    }
    return arr;
}

//function to shuffle arrays
function Shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

//create the 2D array and fill it with * and 0
var arr = Create2DArray(8);

//initialize fruits
var cherry = "<div><img src='img/cherry.jpg' width='100' height='100' class='cherry hide' onclick='play(this)'/></div>";
var lemon  = "<div><img src='img/lemon.jpg'  width='100' height='100' class='lemon hide'  onclick='play(this)'/></div>";
var apple  = "<div><img src='img/apple.jpg'  width='100' height='100' class='apple hide'  onclick='play(this)'/></div>";
var kivi   = "<div><img src='img/kivi.jpg'   width='100' height='100' class='kivi hide'   onclick='play(this)'/></div>";
var orange = "<div><img src='img/orange.png' width='100' height='100' class='orange hide' onclick='play(this)'/></div>";
var mango  = "<div><img src='img/mango.jpg'  width='100' height='100' class='mango hide'  onclick='play(this)'/></div>";
var peatch = "<div><img src='img/peatch.jpg' width='100' height='100' class='peatch hide' onclick='play(this)'/></div>";
var banana = "<div><img src='img/banana.jpg' width='100' height='100' class='banana hide' onclick='play(this)'/></div>";

//create and shuffle fruits array
var fruits = [cherry, lemon, apple, kivi, orange, mango, peatch, banana];
fruits = fruits.concat(fruits);
Shuffle(fruits);

//append elements
var fruit;
var len = fruits.length; 

for(var i = 0; i < len; i++){
    document.getElementById('wrapper').innerHTML += fruits[i];
}

//prevent images dragging
$('img').on('dragstart', function(event) { event.preventDefault(); });

//main game logic
var state = 0; //0 for 0 opened, 1 for 1 opened
var tempSrc;
var tempImg;
var guessed = 0;

function play(fruit) {
    if(state === 0){
        tempSrc = fruit.getAttribute('src');
        tempImg = fruit;
        $(fruit).removeClass('hide').addClass('show');
        state = 1;
    }
    else {
        if(fruit.getAttribute('src') === tempSrc){
            $(fruit).removeClass('hide').addClass('show');
            $(fruit).addClass('nonclickable');
            $(tempImg).addClass('nonclickable');
            guessed ++;
            if(guessed === 8) { //game over
                //set cookie if needed
                if(time<(getCookie('best'))){
                    alert(time + ' !!! This is new record !');
                    setCookie("best",time,1000);
                }
                else {
                    alert('Game over ! Your time is ' + time + '. You can do it better !');
                }
                document.location.reload(true);
            }
        }
        else {
            $(fruit).removeClass('hide').addClass('show');
            setTimeout(function() {
                $(fruit).removeClass('show').addClass('hide');
                $(tempImg).removeClass('show').addClass('hide');
            }, 150);
        }
        state = 0;
    }
}

//cookies
/*** no cookies on local files (best will be null if the game is not on server) ***/
function setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name){
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
      {
      c_start = c_value.indexOf(c_name + "=");
      }
    if (c_start == -1)
      {
      c_value = null;
      }
    else
      {
      c_start = c_value.indexOf("=", c_start) + 1;
      var c_end = c_value.indexOf(";", c_start);
      if (c_end == -1)
      {
    c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

