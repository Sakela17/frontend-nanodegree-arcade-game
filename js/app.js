// App.js
// This file defines constructors for Enemy and Player objects. Constructor's prototypes
// amended with methods that provide functionality to Enemy and Player instances.
// Selector object implemented to add player selection feature to the game. It assigns a sprite
// image to Player based on the user input.
// Score count implemented and is a property of Player. It increases by 10 points each time
// Player reaches the water. It's rendered as text+number format in the upper right hand corner above the board game.
// Player has limited number of lives. This property defined with Player and set to 3. It
// decreases each time Player occupies the same space with Enemy. It's rendered with heart
// images in the upper left corner above the board game.
//

"use strict";

// Declare global variables that will be used in app.js and engine.js scopes.
var enemy,
    player = new Player("images/Selector.png"),
    allEnemies = [];

// This Constructor initializes Enemy instances.
function Enemy() {
    this.sprite = "images/enemy-bug.png";
    this.x = -201;
    this.y = randomY();
    // Immediately-invoked function returns random numbers between 100 and 500.
    this.speed = (function() {
        return Math.ceil(Math.random() * 400 + 100);
    })();
}

// Update the Enemy position.
// Invoked by a function in forEach method nested within updateEntities().
// param dt - delta is number of seconds passed since last game tick.
// param index - index position of Enemy object in array.
Enemy.prototype.update = function(dt,index) {
    // Check if Enemy X coordinate less than canvas width.
    // True: increase X coordinate by number of pixels defined by multiplying Enemy speed by dt parameter.
    // False: reset x and y coordinates to the starting position, and update speed.
    if (this.x < 505) {
        this.x += this.speed * dt;
    } else {
        allEnemies[index].x = -201;
        allEnemies[index].y = randomY();
        allEnemies[index].speed = (function() {
            return Math.ceil(Math.random() * 400 + 100);
        })();
    }
};

// Draw Enemy on the canvas
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This Constructor initializes Player instance.
// param url - url path for sprite images.
function Player(url) {
    this.sprite = url;
    this.x = 202.5;
    this.y = 209;
    this.scoreCount = 0;
    // limit number of lives to 3
    this.heartCount = 3;
    // conditional param: 0 = user did not select character for Player; 1 = user made a selection.
    this.tester = 0;
}

// This method updates Player score and checks for collision.
Player.prototype.update = function() {
    // Save object referenced by 'this' to var 'self' in order to use the proper 'this' in forEach function.
    var self = this;
    // When Player reaches the water, increase score by 10 points and move Player to the initial location.
    if (this.y === -40) {
        this.scoreCount += 10;
        this.resetPlayer();
    }

    // When collision with Enemy occurs, decrement life count by 1, clear canvas, move Player to the initial location.
    allEnemies.forEach(function(enemy) {
        if (enemy.y === this.y && enemy.x - 50 < this.x && enemy.x + 75 > this.x) {
            this.heartCount -= 1;
            ctx.clearRect(0, -5, 145, 55);
            this.resetPlayer();
        }
    },self);
};

// Move Player to the initial location. Invoked at the beginning of the game when user makes a player selection,
// and, when Player reaches the water or encounters Enemy.
Player.prototype.resetPlayer = function() {
    this.x = 202.5;
    this.y = 375;
};

// Draw Player, score and heart images. This method invoked by renderEntities() on each game tick.
Player.prototype.render = function() {
    var text, i;
    // Draw Player image.
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Clear then draw text that shows score count.
    ctx.clearRect(380, -5, 125, 55);
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    text = "Score: " + this.scoreCount;
    ctx.fillText(text, 380, 30);
    // Loop through the number of hearts and draw Heart images
    for (i = 0; i < this.heartCount; i+=1) {
        ctx.drawImage(Resources.get("images/Heart.png"), i * 101 / 2, -5, 45, 65);
    }
};

// This method is invoked by a function called in addEventListener() method. It moves Player
// according to user input within defined boundaries.
// param key - values received from allowedKeys object.
Player.prototype.handleInput = function(key) {
    if (key === "left" && this.x > 0.5) {
        this.x -= 101;
    } else if (key === "up" && this.y > -40) {
        this.y -= 83;
    } else if (key === "right" && this.x < 404.5) {
        this.x += 101;
    } else if (key === "down" && this.y < 375) {
        this.y += 83;
    } else if (key === "enter") {
        // Assign a sprite image based on a selection.
        // Reset x, y, scoreCount, heartCount and tester properties.
        switch (this.x) {
            case 0.5: this.sprite = "images/char-cat-girl.png"; break;
            case 101.5: this.sprite = "images/char-horn-girl.png"; break;
            case 202.5: this.sprite = "images/char-boy.png"; break;
            case 303.5: this.sprite = "images/char-pink-girl.png"; break;
            case 404.5: this.sprite = "images/char-princess-girl.png"; break;
        }
        this.resetPlayer();
        this.scoreCount = 0;
        this.heartCount = 3;
        this.tester = 1;
    }
};

// Instantiate 4 Enemies and place them in allEnemies array. Invoked at the beginning of
// each new game by reset().
function spawnEnemies() {
    for (var i = 0; i < 4; i++) {
        enemy = new Enemy();
        allEnemies.push(enemy);
    }
}

// This function randomly returns one of the defined values that are used for Y coordinates in Enemy objects.
// Invoked by Enemy constructor and enemy.update() method.
function randomY() {
    var yCoordinates = [43, 126, 209, 292];
    function f() {
        var choice = Math.floor(Math.random() * yCoordinates.length);
        return yCoordinates[choice];
    }
    return f();
}

// This listens for key presses and sends the key values to player.handleInput()
// and selector.handlePlayerSelection() methods.
document.addEventListener("keydown", function(e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        13: "enter"
    };
    player.handleInput(allowedKeys[e.keyCode]);
});