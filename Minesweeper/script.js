//function for creating 2D array
function Create2DArray(rows) {
  var arr = [];
  for (var i=0; i<rows; i++) {
     arr[i] = [];
  }
  return arr;
}

//Array size
var len = 15;

//create the 2D array and fill it with * and 0
var arr = Create2DArray(len);
var sumBombs= 0;
for(var i = 0; i < len; i++) {
    //td
    for(var j = 0; j < len; j++){
        var rand = Math.floor(Math.random()*10);
        if(rand<2){
            arr[i][j] = "*";
            sumBombs += 1; 
        }
        else {
            arr[i][j] = 0;
        }
    }
}   

//count how many neighbours of each cell are bombs
for(var i = 0; i < len; i++) {
    for(var j = 0; j < len; j++){
        if(arr[i][j] != "*"){
            arr[i][j] = countBombs();
        }
    }
}   

//create heading and timer
document.writeln('<h1>Minesweeper</h1>');
document.writeln('<input type="text" id="timer"/>');
document.writeln('<div id="best"></div>');
var span = document.createElement('span');
span.innerHTML = "Best <br/> time:";
var record = document.createElement('div');
if(getCookie('best')){
    record.innerHTML = getCookie('best');
}
document.getElementById("best").appendChild(span);
document.getElementById("best").appendChild(record);

//create the table
document.writeln('<table>');
    //rows
    for(var i = 0; i < len; i++) {
        document.writeln("<tr>");
            //td
            for(var j = 0; j < len; j++){
                document.writeln("<td>"+arr[i][j]+"</td>");
            }
        document.writeln("</tr>");
    }   
document.writeln('</table>');

//create display
document.writeln('<div id="bombs">Bombs:</div>');
document.writeln('<div id="display"></div>');
var disp = document.getElementById('display');
disp.innerHTML = sumBombs;

//start timer
var time = 0;
function displayCount() {
    document.getElementById('timer').value = time;
}
function count() {
        time++;
        if(time==900){ //Max time is 15 minutes. 
            alert("Time's over!");
            window.location.reload();
        }
        displayCount();
}
var interval = setInterval(count,1000);

//add style and functionality to TD's
var td = document.getElementsByTagName('td');
for(i=0; i<td.length; i++){
    td[i].style.width = td[i].style.height = td[i].style.lineHeight = 20 + "px";
    td[i].style.textAlign = "center";
    td[i].style.backgroundColor = "gray";
    td[i].style.color = "#BCBCBC";
    td[i].id = i;
    td[i].onclick = function click() {
        this.className = "checked";
        this.style.color = "black";
        this.style.backgroundImage = "url('open.gif')";
        //for empty cells
        if(this.innerHTML == 0){
            this.style.backgroundImage = "url('open.gif')";
            this.innerHTML= "";
            var id = (this.id)*1;
            open(id); //open empty neighbours
        }
        //for bombs cells
        var cont = this.innerHTML;
            if(cont == "*"){
                for(i=0; i<td.length; i++)  {
                    if(td[i].innerHTML == "*"){
                        td[i].innerHTML = "&#8224;";
                        td[i].style.color = "black";
                        td[i].style.backgroundColor = "#FC0204";
                        td[i].style.backgroundImage = "url('bombdeath.gif')";
                    }
                }
                alert("BOOM !");
                window.location.reload();
            }
    }
    td[i].oncontextmenu = function() {
        if(this.className != 'checked'){
            if(this.className != 'flag'){
                this.className = 'flag';
                this.onclick = 'return false;'; //non-clickable when flagged
                sumBombs -= 1;
                disp.innerHTML = sumBombs;
                if(sumBombs == 0){
                    if(time<(getCookie('best'))){
                        setCookie("best",time,1000);
                    }
                    alert('You made it !');
                    window.location.reload();
                }
            }
            else {
                this.className = 'notFlag';
                sumBombs += 1;
                disp.innerHTML = sumBombs;
                this.onclick = function click() { //give back the functionality if the flag is removed
                    this.style.color = "black";
                    //for empty cells
                    if(this.innerHTML == 0){
                        this.style.backgroundImage = "url('open.gif')";
                        this.innerHTML= "";
                        var id = (this.id)*1;
                        open(id); //open empty neighbours
                    }
                    //for bombs cells
                    var cont = this.innerHTML;
                    if(cont == "*"){
                        for(i=0; i<td.length; i++)  {
                            if(td[i].innerHTML == "*"){
                                td[i].innerHTML = "&#8224;"; 
                                td[i].style.color = "black";
                                td[i].style.backgroundColor = "#FC0204";
                                td[i].style.backgroundImage = "url('bombdeath.gif')";
                            }
                        }
                        alert("BOOM !");
                        window.location.reload();
                    }
                }
            }
        }
        return false; //removes context menu
    }
}

//function to count how many neighbours of each cell are bombs
function countBombs(){
    var counter = 0;
    if((i - 1 >= 0)&&(arr[i-1][j] == "*")){ //check top cell
        counter++;
    }
    if((i + 1 < len)&&(arr[i+1][j] == "*")){ //check bottom cell
        counter++;
    }
    if((j - 1 >= 0)&&(arr[i][j-1] == "*")){ //check left cell
        counter++;
    }
    if((j + 1 < len)&&(arr[i][j+1] == "*")){ //check right cell
        counter++;
    }
    if((i - 1 >= 0)&&(j - 1 >= 0)&&(arr[i-1][j-1] == "*")){ //check top-left cell
        counter++;
    }
    if((i - 1 >= 0)&&(j + 1 < len)&&(arr[i-1][j+1] == "*")){ //check top-right cell
        counter++;
    }
    if((i + 1 < len)&&(j - 1 >= 0)&&(arr[i+1][j-1] == "*")){ //check bottom-left cell
        counter++;
    }
    if((i + 1 < len)&&(j + 1 < len)&&(arr[i+1][j+1] == "*")){ //check bottom-right cell
        counter++;
    }
    return counter;
}

//function to "open" neighbours empty cells
function open(i){
    td[i].className = "checked";
/*
Conditions:
left: i%len !=0
right: (i+1)%len !=0
top: i > len-1
bottom: i < len.len-len
*/

/******************for empty cells*******************/
    
    //check top cell
    if((i > len-1)&&(td[i-len].innerHTML == 0)&&(td[i-len].className != "checked")){ 
        fillEmpty((i-len));
    }
    //check bottom cell
    if((i < len*len-len)&&(td[i+len].innerHTML == 0)&&(td[i+len].className != "checked")){ 
        fillEmpty((i+len));
    }
    //check left cell
    if((i%len != 0)&&(td[i-1].innerHTML == 0)&&(td[i-1].className != "checked")){ 
        fillEmpty((i-1));
    }
    //check right cell
    if(((i+1)%len != 0)&&(td[i+1].innerHTML == 0)&&(td[i+1].className != "checked")){ 
        fillEmpty((i+1));
    }
    //check top-left cell
    if((i > len-1)&&(i%len != 0)&&(td[i-len-1].innerHTML == 0)&&(td[i-len-1].className != "checked")){ 
        fillEmpty((i-len-1));
    }
    //check top-right cell
    if((i > len-1)&&((i+1)%len != 0)&&(td[i-len+1].innerHTML == 0)&&(td[i-len+1].className != "checked")){ 
        fillEmpty((i-len+1));
    }
    //check bottom-left cell
    if((i < len*len-len)&&(i%len != 0)&&(td[i+len-1].innerHTML == 0)&&(td[i+len-1].className != "checked")){ 
        fillEmpty((i+len-1));
    }
    //check bottom-right cell
    if((i < len*len-len)&&((i+1)%len != 0)&&(td[i+len+1].innerHTML == 0)&&(td[i+len+1].className != "checked")){ 
        fillEmpty((i+len+1));
    }

/******************for numbers*******************/

    //check top cell
    if((i > len-1)&&(td[i-len].innerHTML != 0)&&(td[i-len].className != "checked")){ 
        fillNumber((i-len));
    }
    //check bottom cell
    if((i < len*len-len)&&(td[i+len].innerHTML != 0)&&(td[i+len].className != "checked")){ 
        fillNumber((i+len));
    }
    //check left cell
    if((i%len != 0)&&(td[i-1].innerHTML != 0)&&(td[i-1].className != "checked")){ 
        fillNumber((i-1));
    }
    //check right cell
    if(((i+1)%len != 0)&&(td[i+1].innerHTML != 0)&&(td[i+1].className != "checked")){ 
        fillNumber((i+1));
    }
    //check top-left cell
    if((i > len-1)&&(i%len != 0)&&(td[i-len-1].innerHTML != 0)&&(td[i-len-1].className != "checked")){ 
        fillNumber((i-len-1));
    }
    //check top-right cell
    if((i > len-1)&&((i+1)%len != 0)&&(td[i-len+1].innerHTML != 0)&&(td[i-len+1].className != "checked")){ 
        fillNumber((i-len+1));
    }
    //check bottom-left cell
    if((i < len*len-len)&&(i%len != 0)&&(td[i+len-1].innerHTML != 0)&&(td[i+len-1].className != "checked")){ 
        fillNumber((i+len-1));
    }
    //check bottom-right cell
    if((i < len*len-len)&&((i+1)%len != 0)&&(td[i+len+1].innerHTML != 0)&&(td[i+len+1].className != "checked")){ 
        fillNumber((i+len+1));
    }
}

//functions for checked cells 
function fillEmpty(p){
    td[p].className = "checked";
    td[p].style.backgroundImage = "url('open.gif')";
    td[p].innerHTML= "";
    open((p));
}
function fillNumber(p){
    td[p].style.color = "black";
    td[p].style.backgroundImage = "url('open.gif')";
    td[p].className = "checked";
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