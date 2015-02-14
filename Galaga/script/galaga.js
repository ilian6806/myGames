mainFrame = 0;  // must be global variable to cancel it

var Galaga = (function() {

    var
        canvas = _get.id('stage'),
        ctx = canvas.getContext('2d'),
        scoreEl = _get.id('score'),
        levelEl = _get.id('level'),
        bestEl = _get.id('best'),
        dialogEl = {
            container: _get.id('dialog'),
            header:    _get.id('dialog-header'),
            content:   _get.id('dialog-content'),
            footer:    _get.id('dialog-footer'),
            overlay:   _get.id('dialog-overlay')
        },
        ship, 
        level = 1,
        currentStage = 1,
        score = 0,
        soundOn = true;
        gameOver = false;
        best = (localStorage.getItem('galaga-best')) ? (localStorage.getItem('galaga-best') * 1) : 0,
        moveBugsInterval = 0,
        bugs  = [],
        bombs = [],
        lives = [],
        stars = [],
        starsCount = 100,
        bugsAlign = 'left',
        bugMove = 7,
        sounds = {
            theme: new Audio('./audio/theme.mp3'),
            dead: new Audio('./audio/dead.mp3'),
            hit: new Audio('./audio/hit.mp3')
        },
        stages = { // level config
            1: {
                bombsRatio: 0.002,
                rowCounts: [4, 8, 10],
                rowStarts: [3, 1, 0]
            },
            2: {
                bombsRatio: 0.003,
                rowCounts: [6, 8, 10],
                rowStarts: [2, 1, 0]
            },
            3: {
                bombsRatio: 0.004,
                rowCounts: [6, 8, 12],
                rowStarts: [3, 2, 0]
            },
            4: {
                bombsRatio: 0.005,
                rowCounts: [6, 10, 12],
                rowStarts: [3, 1, 0]
            },
            5: {
                bombsRatio: 0.0055,
                rowCounts: [8, 10, 12],
                rowStarts: [2, 1, 0]
            },
            6: {
                bombsRatio: 0.006,
                rowCounts: [8, 12, 12],
                rowStarts: [2, 0, 0]
            },
            7: {
                bombsRatio: 0.0065,
                rowCounts: [8, 12, 14],
                rowStarts: [3, 1, 0]
            },
            8: {
                bombsRatio: 0.007,
                rowCounts: [10, 12, 14],
                rowStarts: [2, 1, 0]
            },
            9: {
                bombsRatio: 0.0075,
                rowCounts: [10, 12, 16],
                rowStarts: [3, 2, 0]
            },
            10: {
                bombsRatio: 0.008,
                rowCounts: [10, 14, 16],
                rowStarts: [3, 1, 0]
            },
            11: {
                bombsRatio: 0.0085,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            12: {
                bombsRatio: 0.009,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            13: {
                bombsRatio: 0.0095,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            13: {
                bombsRatio: 0.01,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            14: {
                bombsRatio: 0.013,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            15: {
                bombsRatio: 0.018,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            16: {
                bombsRatio: 0.023,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            17: {
                bombsRatio: 0.024,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            18: {
                bombsRatio: 0.025,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            19: {
                bombsRatio: 0.025,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            20: {
                bombsRatio: 0.026,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            21: {
                bombsRatio: 0.027,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            22: {
                bombsRatio: 0.028,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            23: {
                bombsRatio: 0.029,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            24: {
                bombsRatio: 0.03,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            },
            25: {
                bombsRatio: 0.04,
                rowCounts: [12, 14, 16],
                rowStarts: [2, 1, 0]
            }
        };

    if (localStorage.getItem('galaga-best')) {
        bestEl.innerHTML = padToSeven(best);
    } else {
        localStorage.setItem('galaga-best', '0');
    }

    ctx.clear = function() {
        this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    function playAudio(name) {
        if (!soundOn) return false;
        var sound = sounds[name].cloneNode();
        sound.oncanplay = function() {
            sound.play();
        };
    }

    function setScore() {
        return padToSeven(score);
    }

    function setBest() {
        best = score;
        localStorage.setItem('galaga-best', score);
        var formatedBest = padToSeven(best);
        bestEl.innerHTML = formatedBest;
        scoreEl.innerHTML = formatedBest;
    }

    function reset() {
        if (score > best) {
            setBest();
        }
        cancelAnimationFrame(mainFrame);
        clearInterval(moveBugsInterval);
        gameOver = false;
        level = 1;
        score = 0;
        bugs  = [];
        bombs = [];
        lives = [];
        stars = [];
        starsCount = 100;
        bugsAlign = 'left';
        bugMove = 7;
        currentStage = 1;
        scoreEl.innerHTML = setScore();
        levelEl.innerHTML = level;
    }

    function playAgain() {
        closeDialog();
        reset();
        init();
    }

    function requestFullScreen(element) {
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    function closeDialog() {
        dialogEl.overlay.style.display = 'none';
        dialogEl.container.style.display = 'none';
    }

    function openDialog(type) {

        switch (type) {
            case 'Game over':
                gameOver = true;
                if (score > best) {
                    setBest();
                }
                dialogEl.header.innerHTML = 'Game over';
                dialogEl.content.innerHTML = 'Your score is: <b>' + score + '</b>. <br /> Play again ?';
                dialogEl.footer.innerHTML = '<button id="play-again-btn">Play</button>';
                _get.id('play-again-btn').addEventListener('click', playAgain);
                break;
            case 'WIN':
                gameOver = true;
                dialogEl.header.innerHTML = 'Game over';
                dialogEl.content.innerHTML = 'You win !!! Your score is: <b>' + score + '</b>. <br /> Play again ?';
                dialogEl.footer.innerHTML = '<button id="play-again-btn">Play</button>';
                _get.id('play-again-btn').addEventListener('click', playAgain);
                break;
        }

        dialogEl.overlay.style.display = 'block';
        dialogEl.container.style.display = 'block';
    }

    // Main constructors
    function Ship(x, y, speed) {

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.bullets = [];

        this.draw = function(ctx) {
            // --- draw base ---
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#fff';

            // tail
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y - 5);

            ctx.moveTo(this.x - 10, this.y - 6);
            ctx.lineTo(this.x + 10, this.y - 6);

            // first wings
            ctx.moveTo(this.x - 25, this.y - 18);
            ctx.lineTo(this.x - 25, this.y - 9);
            ctx.lineTo(this.x + 25, this.y - 9);
            ctx.lineTo(this.x + 25, this.y - 18);

            ctx.moveTo(this.x - 17, this.y - 11);
            ctx.lineTo(this.x + 17, this.y - 11);

            ctx.moveTo(this.x - 14, this.y - 14);
            ctx.lineTo(this.x + 14, this.y - 14);

            // second wings
            ctx.moveTo(this.x - 14, this.y - 12);
            ctx.lineTo(this.x - 14, this.y - 25);

            ctx.moveTo(this.x + 14, this.y - 12);
            ctx.lineTo(this.x + 14, this.y - 25);

            // nose
            ctx.moveTo(this.x - 6, this.y - 12);
            ctx.lineTo(this.x - 6, this.y - 25);
            ctx.moveTo(this.x + 6, this.y - 12);
            ctx.lineTo(this.x + 6, this.y - 25);

            ctx.moveTo(this.x - 4, this.y - 12);
            ctx.lineTo(this.x - 4, this.y - 40);
            ctx.moveTo(this.x + 4, this.y - 12);
            ctx.lineTo(this.x + 4, this.y - 40);

            ctx.moveTo(this.x - 2, this.y - 12);
            ctx.lineTo(this.x - 2, this.y - 40);
            ctx.moveTo(this.x + 2, this.y - 12);
            ctx.lineTo(this.x + 2, this.y - 40);

            ctx.moveTo(this.x, this.y - 12);
            ctx.lineTo(this.x, this.y - 50);

            ctx.stroke();

            // --- draw red parts ---
            ctx.beginPath();
            ctx.strokeStyle = '#D12441';
            // center
            ctx.moveTo(this.x, this.y - 20);
            ctx.lineTo(this.x, this.y - 14);
            ctx.moveTo(this.x - 3, this.y - 17);
            ctx.lineTo(this.x - 3, this.y - 11);
            ctx.moveTo(this.x + 3, this.y - 17);
            ctx.lineTo(this.x + 3, this.y - 11);
            // engines
            ctx.moveTo(this.x - 9, this.y - 7);
            ctx.lineTo(this.x - 9, this.y - 1);
            ctx.moveTo(this.x - 6, this.y - 9);
            ctx.lineTo(this.x - 6, this.y - 1);

            ctx.moveTo(this.x + 9, this.y - 7);
            ctx.lineTo(this.x + 9, this.y - 1);
            ctx.moveTo(this.x + 6, this.y - 9);
            ctx.lineTo(this.x + 6, this.y - 1);
            // guns
            ctx.moveTo(this.x + 14, this.y - 25);
            ctx.lineTo(this.x + 14, this.y - 30);
            ctx.moveTo(this.x - 14, this.y - 25);
            ctx.lineTo(this.x - 14, this.y - 30);
            ctx.moveTo(this.x + 25, this.y - 18);
            ctx.lineTo(this.x + 25, this.y - 23);
            ctx.moveTo(this.x - 25, this.y - 18);
            ctx.lineTo(this.x - 25, this.y - 23);

            ctx.stroke();

            this.bullets.each(function() {
                this.draw(ctx);
            });
        };

        this.moveLeft = function() {
            if (this.x < 33) return;
            this.x -= speed;
        };

        this.moveRight = function() {
            if (this.x > ctx.canvas.width -33) return;
            this.x += speed;
        };

        this.fire = function() {
            var startPoints = [
                { x: this.x - 27, y: this.y - 25 }, 
                { x: this.x + 24, y: this.y - 25 }, 
                { x: this.x - 16, y: this.y - 32 }, 
                { x: this.x + 13, y: this.y - 32 }
            ];
            var idx = randomNumber(0, startPoints.length - 1);
            var startPoint = startPoints[idx];
            var bullet = new Bullet(startPoint.x, startPoint.y, 10);
            this.bullets.push(bullet);
        };

        this.bulletsMove = function () {
            for (var i = 0; i < this.bullets.length; i += 1) {

                this.bullets[i].move();

                if (this.bullets[i].y < 0) {
                    this.bullets.splice(i, 1);
                    i--;
                }
            }
        };
    }

    function Bug(x, y, speed) {

        this.x = x;
        this.y = y;
        this.speed = speed;

        this.draw = function(ctx) {
            // --- blue ---
            ctx.beginPath();
            ctx.strokeStyle = '#0465B2';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y - 5);
            ctx.moveTo(this.x - 6, this.y - 6);
            ctx.lineTo(this.x + 6, this.y - 6);
            ctx.moveTo(this.x - 6, this.y - 12);
            ctx.lineTo(this.x + 6, this.y - 12);
            ctx.moveTo(this.x - 6, this.y - 15);
            ctx.lineTo(this.x + 6, this.y - 15);
            //eyes
            ctx.moveTo(this.x - 6, this.y - 25);
            ctx.lineTo(this.x - 3, this.y - 25);
            ctx.moveTo(this.x + 6, this.y - 25);
            ctx.lineTo(this.x + 3, this.y - 25);
            ctx.stroke();
            // --- white ---
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.moveTo(this.x - 6, this.y - 9);
            ctx.lineTo(this.x + 6, this.y - 9);
            ctx.moveTo(this.x - 8, this.y - 22);
            ctx.lineTo(this.x - 8, this.y - 16);
            ctx.moveTo(this.x + 8, this.y - 22);
            ctx.lineTo(this.x + 8, this.y - 16);
            ctx.moveTo(this.x - 5, this.y - 19);
            ctx.lineTo(this.x - 5, this.y - 16);
            ctx.moveTo(this.x + 5, this.y - 19);
            ctx.lineTo(this.x + 5, this.y - 16);
            ctx.moveTo(this.x - 3, this.y - 22);
            ctx.lineTo(this.x - 3, this.y - 16);
            ctx.moveTo(this.x + 3, this.y - 22);
            ctx.lineTo(this.x + 3, this.y - 16);
            ctx.moveTo(this.x, this.y - 22);
            ctx.lineTo(this.x, this.y - 16);
            ctx.stroke();

            // --- red ---
            ctx.beginPath();
            ctx.strokeStyle = '#DE1F3D';

            ctx.moveTo(this.x - 12, this.y);
            ctx.lineTo(this.x - 12, this.y - 10);
            ctx.moveTo(this.x - 9, this.y);
            ctx.lineTo(this.x - 9, this.y - 10);

            ctx.moveTo(this.x + 12, this.y);
            ctx.lineTo(this.x + 12, this.y - 10);
            ctx.moveTo(this.x + 9, this.y);
            ctx.lineTo(this.x + 9, this.y - 10);

            ctx.moveTo(this.x - 6, this.y - 6);
            ctx.lineTo(this.x - 6, this.y - 15);

            //right hand
            ctx.moveTo(this.x + 6, this.y - 6);
            ctx.lineTo(this.x + 6, this.y - 15);
            ctx.lineTo(this.x + 14, this.y - 15);

            ctx.lineTo(this.x + 14, this.y - 30);

            // left hand
            ctx.moveTo(this.x - 4, this.y - 15);
            ctx.lineTo(this.x - 14, this.y - 15);
            ctx.lineTo(this.x - 14, this.y - 30);

            ctx.moveTo(this.x - 6, this.y - 21);
            ctx.lineTo(this.x - 3, this.y - 21);
            ctx.moveTo(this.x + 6, this.y - 21);
            ctx.lineTo(this.x + 3, this.y - 21);

            ctx.stroke();
        };

        this.dropBomb = function() {
            var bomb = new Bomb(this.x, this.y, 5);
            bombs.push(bomb);
        };
    }

    function Bullet(x, y, speed) {

        this.x = x;
        this.y = y;
        this.speed = speed;

        this.draw = function (ctx) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + 3, this.y - 1);
            ctx.strokeStyle = 'white';
            ctx.stroke();
        };

        this.move = function () {
            this.y -= this.speed;
            this.checkForHit();
        };

        this.checkForHit = function() {
            for (var i = 0; i < bugs.length; i++) {
                if (bugs[i].x - 15 < this.x  
                 && bugs[i].x + 15 > this.x 
                 && bugs[i].y - 8 < this.y 
                 && bugs[i].y + 8 > this.y) {

                    bugs.splice(i, 1);
                    i--;
                    this.y = 0;
                    playAudio('hit');

                    var config = stages[currentStage];
                    score += Math.floor((config.bombsRatio * 1000) 
                            * (config.rowCounts[0] + config.rowCounts[1] + config.rowCounts[2]));
                    scoreEl.innerHTML = setScore();

                    if (bugs.length === 0) {
                        currentStage++;
                        if (currentStage > 25) {
                            openDialog('WIN');
                            return;
                        }
                        setTimeout(function() {
                            ship.bullets = [];
                            levelEl.innerHTML = currentStage;
                            clearInterval(moveBugsInterval);
                            loadBugs();
                        }, 2000);
                    }
                }
            }
        };
    }

    function Bomb(x, y, speed) {

        this.x = x;
        this.y = y;
        this.speed = speed;

        this.draw = function (ctx) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + 3, this.y - 1);
            ctx.strokeStyle = 'red';
            ctx.stroke();
        };

        this.move = function () {
            this.y += this.speed;
            if (this.y > ctx.canvas.height * 0.7) {
                this.checkForHit();
            }
        };

        this.checkForHit = function() {
            if (this.x < ship.x + 24 
             && this.x > ship.x - 24 
             && this.y > ship.y - 23
             && this.y < ship.y) {

                this.y = 5000;
                lives.pop();
                playAudio('dead');

                if (lives.length === 0) {
                    // stop bullets and remove ship from the scene
                    ship.bullets = [];
                    ship.y = -100;
                    openDialog('Game over');
                }
            }
        };
    }

    function Star(x, y) {

        this.x = x;
        this.y = y;

        this.draw = function(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + 1, this.y);
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        };
    }

    function loadStars() {

        function createRandomStar() {
            var x = randomNumber(0, ctx.canvas.width);
            var y = randomNumber(0, ctx.canvas.height)
            stars.push(new Star(x, y));
        }

        function removeRandomStar() {
            var index = randomNumber(0, stars.length);
            stars.splice(index, 1);
        }

        for (var i = 0; i < starsCount; i++) {
            createRandomStar();
        }

        setInterval(function() {
            removeRandomStar();
            createRandomStar();
        }, 400);

        setInterval(function() {
            stars.each(function() {
                this.x --;
            });
        }, 100);

    }

    function loadBugs() {

        var 
            config = stages[currentStage],
            stepX = 50,
            stepY = 50,
            // center bugs
            startPosX = (ctx.canvas.width / 2) - (stepX * (config.rowCounts[2] / 2)),
            startPosY = 100,
            nextPosX = startPosX,
            nextPosY = startPosY,
            i, j;

        // first row
        nextPosX = startPosX + (stepX * config.rowStarts[0]);;

        for (i = 0; i < config.rowCounts[0]; i++) {
            nextPosX += stepX;
            bugs.push(new Bug(nextPosX, nextPosY, 20));
        }

        // second rows
        for (j = 0; j < 2; j++) {
            nextPosX = startPosX + (stepX * config.rowStarts[1]);
            nextPosY += stepY;

            for (i = 0; i < config.rowCounts[1]; i++) {
                nextPosX += stepX;
                bugs.push(new Bug(nextPosX, nextPosY, 20));
            }
        }

        // third rows
        for (j = 0; j < 2; j++) {
            nextPosX = startPosX + (stepX * config.rowStarts[2]);
            nextPosY += stepY;

            for (i = 0; i < config.rowCounts[2]; i++) {
                nextPosX += stepX;
                bugs.push(new Bug(nextPosX, nextPosY, 20));
            }
        }

        moveBugsInterval = setInterval(moveBugs, 1500);
    }

    function moveBugs() {
        if (bugsAlign == 'left') {
            bugsAlign = 'right';
            bugs.each(function() {
                this.x += bugMove;
            });
        } else if (bugsAlign == 'right') {
            bugsAlign = 'left';
            bugs.each(function() {
                this.x -= bugMove;
            });
        }
    }

    function init() {

        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('height', window.innerHeight);

        ship = new Ship(ctx.canvas.width / 2, ctx.canvas.height - 50, 20);

        lives = [
            new Ship(30, 50, 20),
            new Ship(90, 50, 20),
            new Ship(150, 50, 20)
        ];

        loadStars();
        loadBugs();

        function animationFrame() {
            ctx.clear();

            stars.each(function() {
                this.draw(ctx);
            });

            lives.each(function() {
                this.draw(ctx);
            });

            for (var i = 0; i < bombs.length; i++) {
                bombs[i].move();
                bombs[i].draw(ctx);
                if (bombs[i].y > ctx.canvas.height) {
                    bombs.splice(i, 1);
                    i--;
                }
            }

            ship.draw(ctx);
            ship.bulletsMove(ctx);

            bugs.each(function() {
                this.draw(ctx);
                if (Math.random() < stages[currentStage].bombsRatio) {
                    this.dropBomb();
                }
            });

            mainFrame = requestAnimationFrame(animationFrame);
        };

        mainFrame = requestAnimationFrame(animationFrame);

        return this;
    }

    function bindEvents() {

        _get.id('sound-icon').addEventListener('click', function() {
            if (soundOn) {
                soundOn = false;
                this.src = 'img/soundoff.png';
                sounds.theme.volume = 0;
            } else {
                soundOn = true;
                this.src = 'img/soundon.png';
            }
        });

        _get.id('fullscreen-icon').addEventListener('click', function() {
            requestFullScreen(document.body);
        });

        KeyboardController({
            37: function() { ship.moveLeft(); },
            39: function() { ship.moveRight(); },
            32: function() { ship.fire(); }
        }, 50);

        document.addEventListener('keydown', function(e) {
            if (gameOver && e.keyCode == 13) {
                playAgain();
            }
        });

        sounds.theme.oncanplay = function() {
            sounds.theme.play();
            sounds.theme.volume = 0.07;
        };
    }

    return {
        init: init,
        bindEvents: bindEvents
    };
}());