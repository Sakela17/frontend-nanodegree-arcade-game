// App.js
// This file defines the Enemy and Player classes.
// game entities and their methods.
//
// a player, random collectible items, and enemies
// to avoid.  It also controls game settings and
// player movement.

var allEnemies = [];
var enemy,
    player,
    selector,
    hearts;

// Enemy constructor initializes
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = -201;
    this.y = (function() {
        var yCoordinates = [63, 146, 229, 312];
        // Sef-invoking function randomly selects Y coordinates for enemy objects
        function f() {
            var choice = Math.floor(Math.random() * yCoordinates.length);
            return yCoordinates[choice];
        }
        return f();
    })();
    // Sef-invoking function randomly selects Y coordinates for enemy objects
    this.speed = (function() {
        return Math.ceil(Math.random() * 400 + 100);
    })()
};

// Update the Enemy position by changing x, y, and speed property values.
// Invoked by a function in forEach method nested within updateEntities().
// Param 'dt': number of seconds passed since last game tick.
// Param 'index': Enemy position in array.
Enemy.prototype.update = function(dt,index) {
    // Check if Enemy X position less than canvas width.
    // True: increase position by number of pixels defined by multiplying Enemy speed by dt parameter.
    // False: replace current Enemy object in the allEnemies array with a new Enemy object.
    // This ensures the Enemy objects are assigned new x, y, and speed property values
    // each time the Enemy reappears on the screen.
    if (this.x < 505) {
        this.x += this.speed * dt;
    } else {
        allEnemies.splice(index, 1, new Enemy);
    }
};

// Draw the Enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(url,x,y) {
    this.sprite = url;
    this.x = x;
    this.y = y;
    this.scoreCount = 0;
};

Player.prototype.update = function() {
    if (this.y === -20) {
        this.scoreCount += 10;
        this.resetPlayer();
    }
};

Player.prototype.resetPlayer = function() {
    this.x = 202.5;
    this.y = 395;
};

// Draw Player and score images. This method invoked by renderEntities() on each game tick,
// and by resetPlayerMenu() at the beginning of the game.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Clear old score and render new score incremented by 10 points
    ctx.clearRect(380, -5, 125, 55);
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    var text = "Score: " + this.scoreCount;
    ctx.fillText(text, 380, 30);
};



// Player.prototype.handleInput = function(key) {
//     if (this.y > -20 && this.y < 395 && this.x > -100.5 && this.x < 505.5) {
//         switch (key) {
//             case "left": this.x -= 101; break;
//             case "up": this.y -= 83; break;
//             case "right": this.x += 101; break;
//             case "down": this.y += 83; break;
//         }
//     }
// };


// Receive user input (key which was pressed) and move the player according to that input
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player





selector = {
    'image': 'images/Selector.png',
    'x': 202.5,
    'y': 209,
    'tester': 0,
    'render': function() {
        ctx.drawImage(Resources.get(this.image), this.x, this.y);
    },
    'handlePlayerSelection': function(key) {
        if (key === 'left' && this.x > 0.5) {
            this.x -= 101;
        } else if (key === 'right' && this.x < 404.5) {
            this.x += 101;
        } else if (key === 'enter') {
            this.tester = 1;
            switch (this.x) {
                case 0.5: player = new Player('images/char-cat-girl.png'); break;
                case 101.5: player = new Player('images/char-horn-girl.png'); break;
                case 202.5: player = new Player('images/char-boy.png'); break;
                case 303.5: player = new Player('images/char-pink-girl.png'); break;
                case 404.5: player = new Player('images/char-princess-girl.png'); break;
            }
            player.resetPlayer();
            this.x = 202.5;
        }
    }
};


// This creates object which properties are used to draw hearts/lives for the Player
hearts = {
    x: 101,
    y: -5,
    sprite: 'images/Heart.png',
    imageWidth: 45,
    imageHeight: 65,
    // limits Player number of lives to 3
    heartCount: 3,
    renderHearts: function(count) {
        /* Loop through the number of hearts passed as parameter and draw Heart images
         * with defined width and height
         */
        for (var i = 0; i < count; i++) {
            ctx.drawImage(Resources.get(this.sprite), i * this.x / 2, this.y, this.imageWidth, this.imageHeight);
        }
    }
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    selector.handlePlayerSelection(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});

function spawnEnemies() {
    for (var i = 0; i < 4; i++) {
        enemy = new Enemy;
        allEnemies.push(enemy);
    }
}