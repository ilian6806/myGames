//make the input accepts only cyrillic symbols
var charInput;
function char() {
    charInput = document.getElementById('symbol');
    charInput.onkeydown = charInput.onblur = charInput.onkeyup = function()
    {
        charInput.value = charInput.value.replace(/[^\u0400-\u04FF]/gi, "");
    }
}

//click the button with enter
document.onkeydown = function (evt) {
  var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
  if (keyCode == 13) {
    document.getElementById('btn').click();
    }
 else {
    return true;
  }
};

//create words
var words = ["кок","крава","прасе","къща","стена","футбол","плод","фокус","кремък","водолаз","трева","хралупа","кестен","кроасан","ябълка","ястие","пренос","брак","крак","овен","кокал", "план", "овал", "орех", "слива", "кран", "телбод", "кофа", "теле", "чаша", "чиния", "вилица", "камера", "кабел", "плик", "пила", "листо", "спрей", "молив", "ножица", "лук", "книга", "срам", "страх", "сова", "есен", "лято", "зима", "пролет"];

//global variables
var word; 
var ctx;
var countWin;
var countErrors;
var display2;
var div;

//current score
var curr = document.getElementById('score');  
var score = 0;
curr.innerHTML = score;

//total score
var persTotal = document.getElementById('total'); 
var total = 0;
persTotal.innerHTML = total;

//record score
var persRecord = document.getElementById('record'); 
var record = 0;
var bestRecord = 0;
persRecord.innerHTML = bestRecord;

//alphabet for validation
var letters = ["а","б","в","г","д","е","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ь","ю","я"];

function game() {
    //clearing
    document.getElementById('symbol').value = "";
    document.getElementById('symbol').focus(); 
    countWin = 0;
    countErrors = 0;
    curr.innerHTML = score;
    persTotal.innerHTML = total;
    persRecord.innerHTML = bestRecord;

    //create canvas
    ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
    ctx.fillStyle = "rgba(0, 0, 1, 0.00001)";
    ctx.fillRect(0,0, ctx.canvas.width,ctx.canvas.height)
    ctx.beginPath();
    ctx.strokeStyle = "#77411B";
    ctx.lineWidth = 17;

    //drawing the gallow
    ctx.moveTo(55, 400);
    ctx.lineTo(55, 50);
    ctx.lineTo(250, 50);
    ctx.lineTo(250, 100);
    ctx.stroke();
    
    //take random word
    var newWord = words[Math.floor(Math.random()*words.length)];
    word = newWord;

    //create divs for word's symbols 
    for(var i = 0; i < word.length; i++) {
        div = document.createElement('div');
        div.id = "div" + i;
        div.style.borderBottom = "1px solid black";
        div.style.width = 50 + "px";
        div.style.height = 50 + "px";
        div.style.lineHeight = 50 + "px";
        div.style.textAlign = "center";
        div.style.textTransform = "uppercase";
        div.style.color = "white";
        div.style.display = "inline-block";
        div.style.marginRight = 5 + "px";
        div.style.verticalAlign = "bottom";
        div.innerHTML = word.substring(i, i+1);
        display2 = document.getElementById('display2');
        display2.appendChild(div);
    }
    var missed = document.getElementById('missed');  
}

//submit best score
 function submit(){
    var name = prompt('Enter your name');
    document.getElementById('first').innerHTML = name;
    document.getElementById('sc1').innerHTML = bestRecord;
    document.getElementById('symbol').focus();
}

//start the game
function play() {
    //uppercase validation
    document.getElementById('symbol').value = document.getElementById('symbol').value.toLowerCase();

    //alphabet validation   
    var letterCount = 0;
    for(var i = 0; i < letters.length; i++){
        if (document.getElementById('symbol').value == letters[i]){
           letterCount++;
        }
    }
    if(letterCount == 0){
        alert("Моля, въведете буква от А до Я.");
        document.getElementById('symbol').value = "";
        document.getElementById('symbol').focus();
    }
    
    var countGuess = 0;
    var guessed = 0;
    var input = document.getElementById('symbol');
    var val = input.value;

    for(var i = 0; i <= word.length; i++){
        if(val == word.substring(i, i+1)) {
           var guessed = document.getElementById("div" + i);
           guessed.style.color = "black";
           countGuess++;
           countWin++;
           word = word.substring(0, i) + 0 + word.substring(i+1, word.length);
        }
    }

    if(countWin==word.length){
        window.alert("YOU WIN !");
        while (display2.firstChild) {
            display2.removeChild(display2.firstChild);
        }
        
        record += 1;  
        score += 1;
        total += 1;
        ctx.clearRect(0,0, ctx.canvas.width,ctx.canvas.height);
        missed.innerHTML = "";
        game();
    }

    if(countGuess == 0) {
        countErrors++;
        missed.innerHTML += val + "  ";
    }

    //drawing
    switch(countErrors) {
        case 1: 
                //drawing the hangman
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.fillStyle = "#F1B68C";
                ctx.strokeStyle = "black";
                //leg1
                ctx.moveTo(250 - 25, 215 + 50);
                ctx.lineTo(250 - 40, 320);
                ctx.stroke();   
                break;
        case 2: 
                //leg2
                ctx.beginPath();
                ctx.moveTo(250 + 25, 215 + 50);
                ctx.lineTo(250 + 40, 320);
                ctx.stroke();
                break;
        case 3: 
                //body
                ctx.beginPath();
                ctx.arc(250, 215, 55, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.stroke();
                break;   
        case 4: 
                //head
                ctx.beginPath();
                ctx.arc(250, 125, 25, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.stroke();

                //eyes
                ctx.beginPath();
                ctx.arc(250 - 10, 125 - 10, 2, 0, 2 * Math.PI, false);
                ctx.moveTo(250 + 10, 125 - 10);
                ctx.arc(250 + 10, 125 - 10, 2, 0, 2 * Math.PI, false);
                ctx.stroke();

                //nose
                ctx.moveTo(250, 115);
                ctx.lineTo(245, 130);
                ctx.lineTo(255, 130);
                ctx.stroke();

                //mouth
                ctx.beginPath();
                ctx.arc(250, 140, 5, 0, 2 * Math.PI, false);
                ctx.stroke();

                //neck
                ctx.moveTo(250, 150);
                ctx.lineTo(250, 160);
                ctx.stroke();
                ctx.beginPath();
                    //display the word, when loose
                    for(var i = 0; i < word.length; i++){
                           var guessed = document.getElementById("div" + i);
                           guessed.style.color = "black";
                    }
                window.alert("GAME OVER !");
                while (display2.firstChild) {
                    display2.removeChild(display2.firstChild);
                }
                score = 0;
                 if(bestRecord <= record){
                   bestRecord = record; 
                }
                record = 0;
                ctx.clearRect(0,0, ctx.canvas.width,ctx.canvas.height);
                missed.innerHTML = "";
                game();
                break;                  
    }
    input.value = "";
    input.focus();
}