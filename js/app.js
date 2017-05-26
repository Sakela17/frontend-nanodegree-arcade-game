/**
 * This file provides the game entities including
 * a player, random collectible items, and enemies
 * to avoid.  It also controls game settings and
 * player movement.

 */

var allEnemies = [];
var allPlayers = [];
var enemy,
    player,
    selector,
    hearts;

// Enemies our player must avoid
var Enemy = function() {
    this.x;
    this.y;
    this.sprite = 'images/enemy-bug.png';
    this.speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //this.x = this.x + this.speed * dt;

    if (this.x < 505) {

        //var velocity = this.speed * dt;
        this.x += this.speed * dt;
    } else {
        this.resetEnemy();
    }
    // handle collision


};

Enemy.prototype.resetEnemy = function() {
    var yCoordinates = [63, 146, 229, 312];
    this.x = -201;
    /* Sef-invoking function randomly selects Y coordinates for enemy objects
     */
    this.y = (function() {
        var choice = Math.floor(Math.random() * yCoordinates.length);
        return yCoordinates[choice];
    })();
    this.speed = Math.ceil((Math.random()) * 400) + 100;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(url,x,y) {
    this.x = x;
    this.y = y;
    this.sprite = url;
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

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.clearRect(380, -5, 125, 55);
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    var text = "Score: " + this.scoreCount;
    ctx.fillText(text, 380, 30);
};

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



// function spawnPlayer(x) {
//     for (var i = 0, len = allPlayers.length; i < len; i++) {
//         if (allPlayers[i].x = x) {
//             player = new Player(allPlayers[i].sprite, 202.5);
//         }
//     }
//
//}

var playerCatGirl = new Player('images/char-cat-girl.png', 0.5, 229);
var playerHornGirl = new Player('images/char-horn-girl.png', 101.5, 229);
var playerBoy = new Player('images/char-boy.png', 202.5, 229);
var playerPinkGirl = new Player('images/char-pink-girl.png', 303.5, 229);
var playerPrincess = new Player('images/char-princess-girl.png', 404.5, 229);
allPlayers.push(playerCatGirl,playerHornGirl,playerBoy,playerPinkGirl,playerPrincess);

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
            for (var i = 0; i < allPlayers.length; i++) {
                if (allPlayers[i].x === this.x) {
                    player = new Player(allPlayers[i].sprite);
                   player.resetPlayer();

                }
            }
            allPlayers = [];
            this.x = 202.5;
            //spawnPlayer(this.x);

            // if (this.x === 0.5) {
            //     player.sprite = allPlayers[0].sprite;
            //     player.resetPlayer();
            //     main();
            // } else if (this.x === 101.5) {
            //     player.sprite = allPlayers[1].sprite;
            //     player.resetPlayer();
            // } else if (this.x === 202.5) {
            //     player.sprite = allPlayers[2].sprite;
            //     player.resetPlayer();
            // } else if (this.x === 303.5) {
            //     player.sprite = allPlayers[3].sprite;
            //     player.resetPlayer();
            // } else {
            //     player.sprite = allPlayers[4].sprite;
            //     player.resetPlayer();
            // }
            // switch(this.x) {
            //     case(0.5):
            //         player.sprite = allPlayers[0].sprite;
            //         player.resetPlayer();
            //     break;
            //     case(101.5): player.sprite = allPlayers[1].sprite; break;
            //     case(202.5):
            //         player.sprite = allPlayers[2].sprite;
            //         player.resetPlayer();
            //         break;
            //     case(303.5): player.sprite = allPlayers[3].sprite; break;
            //     case(404.5): player.sprite = allPlayers[4].sprite; break;
            //     default:
            // }
        }
    }
};

// document.addEventListener('keyup', function(e) {
//     var allowedKeys = {
//         37: 'left',
//         39: 'right',
//         13: 'enter'
//     };
//     selector.handlePlayerSelection(allowedKeys[e.keyCode]);
// });

function spawnEnemies() {
    for (var i = 0; i < 4; i++) {
        enemy = new Enemy();
        allEnemies.push(enemy);
    }
}


hearts = {
    x: 101,
    y: -5,
    sprite: 'images/Heart.png',
    imageWidth: 45,
    imageHeight: 65,
    heartCount: 3,
    renderHearts: function(count) {
        /* Loop through the number of hearts passed as parameter to draw Heart images
         * with defined width and height
         */
        for (var i = 0; i < count; i++) {
            ctx.drawImage(Resources.get(this.sprite), i * this.x / 2, this.y, this.imageWidth, this.imageHeight);
        }
    }
};

score = {
    scoreCount: "",
    renderScore: function() {
        ctx.fillStyle = "#000000";
        ctx.font = "20px Arial";
        var text = "Score: " + scoreCount;
        ctx.fillText(text, 5, 30);
    }

};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
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
