// Wrapper for native 'get element' methods for better performance 
_get = {

    id: function(str) {
        return document.getElementById(str);
    },

    class: function(str) {
        return document.getElementsByClassName(str);
    },

    tag: function(str) {
        return document.getElementsByTagName(str);
    },

    name: function(str) {
        return document.getElementsByName(str);
    },

    body: function() {
        return document.body;
    }
};

function randomNumber(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function log(m) {
    console.log(m);
};

function padToSeven(number) {
    return (number < 9999999) ? String('0000000' + number).slice(-7) : number;
}

// Calls function to every element of an array
Array.prototype.each = function(func) {
    var i, l = this.length;
    for (i = 0; i < l; i++) {
        func.call(this[i], i);
    }
}
