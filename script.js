var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };


  window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
  };


var keysDown = {};
var canvas = document.getElementById('field');
var context = canvas.getContext('2d');

var cannonWidth = 50;
var cannonHeight = 50;
var shellWidth = 10;
var shellHeight = 10;
var shellSpeed = -30;
var shell;
var rows;
var winningScore = 10;
var playerScore = 0;
var showWinner = false;
var numberOfShipInRow = 6;

var fontStyle = "30px Arial";
var textColor = "white";

var rows = [];
var alienSpeed = .5;
var alienWidth = 50;
var alienHeight = 50;
var alienSideMove = .20;
var nextAlien = 0;
var numberOfRows = 3;
var cannon;
var isPlaying = true;
var gameOver = false;



init();

function init() {
    cannon = new Cannon(canvas.width / 2 - cannonWidth / 2, canvas.height - cannonHeight, cannonWidth, cannonHeight);
    createAliens();
}

window.addEventListener("mousedown", shoot);


    var step = function() {
    update();
    render();
    animate(step);
    };


  
    var update = function() {
        cannon.update();
        if (typeof shell !== "undefined") {
            shell.update();
        }
        for (var i = 0; i < rows.length; i++) {
            for (var j = 0; j < rows[i].length; j++) {
                if (rows[i][j].isAlive == true) {
                    rows[i][j].update();
                }
            }
            if ((rows[i][0].y == 100 || rows[i][numberOfShipInRow].y == 100 || rows[i][numberOfShipInRow / 2].y == 100 || rows[i][numberOfShipInRow / 3].y == 100) && rows.length < numberOfRows) {
                createAliens();
            }
        }
    
        if (playerScore >= winningScore) {
            isPlaying = false;
            showWinner = true;
        }
    };
    
    var render = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        if(showWinner) {
        var text = "Next Level!";
        context.font = fontStyle;
        context.fillStyle = textColor;
        var x = (context.measureText(text).width);
        context.fillText(text,(canvas.width-x)/2, 200);
        return;
        }

        if(gameOver) {
        var text = "Game Over!";
        context.font = fontStyle;
        context.fillStyle = textColor;
        var x = (context.measureText(text).width);
        context.fillText(text,(canvas.width-x)/2, 200);
        return;
        }


        cannon.render();
        if (typeof shell !== "undefined" && shell.hasHit == true) {
            shell.render();
        }
        for (var i = 0; i < rows.length; i++) {
            for (var j = 0; j < rows[i].length; j++) {
                if (rows[i][j].isAlive == true) {
                    rows[i][j].render();
                }
            }
        }


    };


    function Cannon(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }
    
      Cannon.prototype.render = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var img = new Image();
        img.src = 'cannon.png';
        context.drawImage(img, this.x, this.y, this.width, this.height);
    
      };
    
      Cannon.prototype.move = function(x, y) {
        this.x += x;
        this.y += y;
      }
    
      Cannon.prototype.update = function() {


        for(var key in keysDown) {
            var value = Number(key);
            if(value == 65) { // A
                if (this.x > 0) {
                    cannon.move(-4, 0);
                }
            } else if (value == 68) { // D
                if (this.x + 50 < canvas.width) {
                    cannon.move(4, 0);
                }
            } else if (value == 32) { // D
                if (isPlaying == false) {
                    nextStage();
                }
            }else {
                cannon.move(0, 0);
            }
          }
    };
    
    function Shell(x, y , width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.y_speed = shellSpeed;
        this.hasHit = true;
    }
    
    Shell.prototype.move = function() {
        this.y += this.y_speed;
      }
    
    Shell.prototype.render = function() {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
      }
    
      Shell.prototype.update = function() {
        this.move();
      }
    
    function Alien(x, y , width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.y_speed = shellSpeed;
        this.isAlive = true;
    }
    
    Alien.prototype.render = function() {
        var img = new Image();
        img.src = 'ship.png';
        context.drawImage(img, this.x, this.y, this.width, this.height);
    }
    
    Alien.prototype.move = function() {
        this.y += alienSpeed;
        if (typeof shell !== "undefined" && shell.hasHit == true) {
            if (shell.x > this.x && shell.x < this.x + cannonWidth && shell.y > this.y && shell.y < this.y + cannonHeight) {
                this.isAlive = false;
                shell.hasHit = false;
                playerScore++;
            }
        }
    }
    
    Alien.prototype.moveToRight = function() {
        this.x += alienSideMove;
    }
    
    Alien.prototype.moveToLeft = function() {
        this.x -= alienSideMove;
    }
    
    Alien.prototype.update = function() {
        this.move();
        if (this.y < 50) {
            this.moveToRight();
        } else if (this.y > 50 && this.y < 100) {
            this.moveToLeft();
        } else if (this.y > 100 && this.y < 150) {
            this.moveToRight();
        } else if (this.y < 150 && this.y < 200) {
            this.moveToLeft();
        } else if (this.y > 200 && this.y < 250) {
            this.moveToRight();
        } else if (this.y < 250 && this.y < 300) {
            this.moveToLeft();
        } else if (this.y > 300 && this.y < 350) {
            this.moveToRight();
        } else if (this.y < 350 && this.y < 400) {
            this.moveToLeft();
        } else if (this.y > 400 && this.y < 450) {
            this.moveToRight();
        } else if (this.y < 450 && this.y < 500) {
            this.moveToLeft();
        } else if (this.y > 500 && this.y < 550) {
            this.moveToRight();
        } else if (this.y < 550 && this.y < 600) {
            this.moveToLeft();
        } else if (this.y > 600 && this.y < 650) {
            this.moveToRight();
        } else if (this.y < 650 && this.y < 700) {
            this.moveToLeft();
        } else if (this.y < 700 && this.y < 750) {
            this.moveToLeft();
        }else if (this.y > canvas.height - alienHeight) {
            gameOver = true;
            isPlaying = false;
        }
    }

 
    function shoot() {
        var createShell = function() {
            shell = new Shell(cannon.x + cannonWidth / 2 - shellWidth / 2, cannon.y + cannon.height, shellWidth, shellHeight);
            shell.move();
        }
        if (typeof shell == "undefined") {
            createShell();
        } else if (typeof shell !== "undefined" && shell.y < 0) {
            shell = "undefined";
            createShell();
        }
       
    }

    
    function createAliens() {
        for (var j = 0; j < 1; j++) {
            var row = [];
            var aliens = []
            var initial = 0;
            for (var i = 0; i < numberOfShipInRow + 1; i++) {
                initial = 10;
                aliens.push(new Alien(initial + nextAlien, 0, alienWidth, alienHeight));
                nextAlien += 70;
            }
            initial = 0;
            nextAlien = 0;
            rows.push(aliens);
        }
    }
    
    function nextStage() {
        if (isPlaying == false && gameOver == false) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            cannonWidth = 50;
            cannonHeight = 50;
            shellWidth = 10;
            shellHeight = 10;
            shellSpeed = -30;
            winningScore += 2;
            playerScore = 0;
            showWinner = false;
            
            rows = [];
            alienWidth = 50;
            alienHeight = 50;
            alienSideMove = .20;
            nextAlien = 0;
            numberOfRows += 1;
            cannon;
            isPlaying = true;
            init();
            
        } else if (isPlaying == false && gameOver == true) {
            cannonWidth = 50;
            cannonHeight = 50;
            shellWidth = 10;
            shellHeight = 10;
            shellSpeed = -30;
            playerScore = 0;
            showWinner = false;
            rows = [];
            alienWidth = 50;
            alienHeight = 50;
            alienSideMove = .20;
            nextAlien = 0;
            numberOfRows = 3;
            cannon;
            isPlaying = true;
            gameOver = false;

            init();
        }
    }

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
  });
  
  window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
  });

