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


// Declare global variables that will be used in app.js and engine.js scopes.
var enemy,
    player = new Player(),
    selector,
    allEnemies = [];

// This Constructor initializes Enemy instances.
function Enemy() {
    this.sprite = "images/enemy-bug.png";
    this.x = -201;
    // Immediately-invoked function randomly returns one of the Y coordinates defined in yCoordinates array.
    this.y = (function () {
        var yCoordinates = [63, 146, 229, 312];
        function f() {
            var choice = Math.floor(Math.random() * yCoordinates.length);
            return yCoordinates[choice];
        }
        return f();
    })();
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
    // False: replace current Enemy object in the allEnemies array with a new Enemy object.
    // This ensures that x, y, and speed properties change each time the Enemy reappears on the screen.
    if (this.x < 505) {
        this.x += this.speed * dt;
    } else {
        allEnemies.splice(index, 1, new Enemy());
    }
};

// Draw Enemy on the canvas
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This Constructor initializes Player instances.
// param url - url path to sprite image.
function Player(url) {
    this.sprite = url;
    this.x = 202.5;
    this.y = 395;
    this.scoreCount = 0;
    // limit Player number of lives to 3
    this.heartCount = 3;
}

// This method updates Player score and checks for collision.
Player.prototype.update = function() {
    // When Player reaches the water, increase score by 10 points and move Player to the initial location.
    if (this.y === -20) {
        this.scoreCount += 10;
        this.resetPlayer();
    }

    // When collision with Enemy occurs, decrement life count by 1, clear canvas, move Player to the initial location.
    allEnemies.forEach(function(enemy) {
        if (enemy.y === player.y && enemy.x - 50 < player.x && enemy.x + 75 > player.x) {
            player.heartCount -= 1;
            ctx.clearRect(0, -5, 145, 55);
            player.resetPlayer();
        }
    });
};

// Move Player to the initial location. Invoked when Player reaches the water or encounters Enemy.
Player.prototype.resetPlayer = function() {
    this.x = 202.5;
    this.y = 395;
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
    } else if (key === "up" && this.y > -20) {
        this.y -= 83;
    } else if (key === "right" && this.x < 404.5) {
        this.x += 101;
    } else if (key === "down" && this.y < 395) {
        this.y += 83;
    }
};

// This object created for implementation of character selection.
selector = {
    "image": "images/Selector.png",
    "x": 202.5,
    "y": 209,
    // This property acts as on/off switch. While '0', means user did not make character
    // selection and resetPlayerMenu() is called on each tick.
    "tester": 0,
    // Draw selector image that user navigates to highlight a character image.
    // It's called by resetPlayerMenu() function.
    "render": function() {
        ctx.drawImage(Resources.get(this.image), this.x, this.y);
    },
    // This method is invoked by a function called in addEventListener() method. It moves Selector
    // according to user input within defined boundaries. It handles only left/right and enter values.
    // param key - values received from allowedKeys object.
    "handlePlayerSelection": function(key) {
        if (key === "left" && this.x > 0.5) {
            this.x -= 101;
        } else if (key === "right" && this.x < 404.5) {
            this.x += 101;
        } else if (key === "enter") {
            // When image is selected, create new Player and pass that image as an argument.
            // Update selector.tester to 1.
            switch (this.x) {
                case 0.5: player = new Player("images/char-cat-girl.png"); break;
                case 101.5: player = new Player("images/char-horn-girl.png"); break;
                case 202.5: player = new Player("images/char-boy.png"); break;
                case 303.5: player = new Player("images/char-pink-girl.png"); break;
                case 404.5: player = new Player("images/char-princess-girl.png"); break;
            }
            this.tester = 1;
        }
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
    selector.handlePlayerSelection(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});