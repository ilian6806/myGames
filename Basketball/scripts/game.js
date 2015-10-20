var Basketball = (function () {

    var 
        MAX_POINTS = 200;
        MAX_TIME = 30;
        SCREEN_OFFSET = 300;
        MIN_LEFT_OFFSET = 10;
        MIN_TOP_OFFSET = 120;

    var $view = {};

    function initializeComponents() {
        $view = {
            html: $('html'),
            best: $('#best'),
            ball: $('#ball'),
            basket: $('#basket'),
            score: $('#score'),
            timer: $('#timer'),
            statics: $('.static'),
        };
    }

    function randomFromInterval(from,to) {
        return Math.floor(Math.random()  *(to - from + 1) + from);
    }

    function start() {

        initializeComponents();

        //prevent images dragging
        $view.statics.on('dragstart', function(event) { event.preventDefault(); });

        $view.score.html(0);

        //check for cookie
        if (cookie.get('bestScoreBasket')) {
            $view.best.html(cookie.get('bestScoreBasket'));
        }
        
        var maxHeight = $view.html.height() - $view.basket.height() - SCREEN_OFFSET;
        var maxWidth  = $view.html.width()  - $view.basket.width()  - SCREEN_OFFSET;

        // add functionality to images
        $view.ball.draggable({ cursor: 'pointer' });
        $view.basket.droppable({
            drop: function() {

                var randHeight = randomFromInterval(MIN_TOP_OFFSET,maxHeight);
                var randWidth  = randomFromInterval(MIN_LEFT_OFFSET,maxWidth);
                
                $view.score.html($view.score.html() * 1 + 1);
                $view.basket.css('top', randHeight);
                $view.basket.css('left', randWidth);
            }
        });

        // make the ball bounce
        for (var i = 0; i <= MAX_POINTS; i++) {
            $view.ball.animate({ width : '300px', height: '300px' }, 800);
            $view.ball.animate({ width : '100px', height: '100px' }, 800);
        };

        // start the timer
        var time = MAX_TIME;
        $view.timer.html(time)

        setInterval(function() {

            $view.timer.html(--time);

            if (time == 0) {

                var score = parseInt($view.score.html());

                if (score > parseInt(cookie.get('bestScoreBasket'))) {
                    cookie.set('bestScoreBasket', score, 1000);
                    alert('Game over ! '+ score +' ! This is a high score !');
                    // update best score
                    $view.best.html(cookie.get('bestScoreBasket'));
                } else {
                    alert('Game over!');
                }

                // reset timer and score
                time = MAX_TIME;
                score = 0;
                $view.timer.html(MAX_TIME);
                $view.score.html(0);
            }
        }, 1000);
    }

    return { start: start };

}());