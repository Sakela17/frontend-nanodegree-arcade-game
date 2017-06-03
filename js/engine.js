/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* This is the stop point before the game starts.
         * Check if character is selected: tester = 0 = not selected => call resetPlayerMenu().
         */
        if (!selector.tester) {
            resetPlayerMenu();
        } else {
            /* tester = 1 = character is selected => call update and render functions, pass along
             * the time delta to update function since it may be used for smooth animation.
             */
            update(dt);
            render();
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function sets the lastTime variable that is required for the game loop,
     * then invokes reset and main functions to prepare canvas for a new game.
     * First time it gets invoked when all the images are loaded and cashed.
     * Then we call it each time Player looses.
     * It can also be invoked at any time by pressing 'New Game' button on the page.
     */
    function init() {
        lastTime = Date.now();
        reset();
        main();
    }

    /* This function is called by main (our game loop) and itself calls
     * updateEntities() and checkCollisions().
     */
    function update(dt) {
        updateEntities(dt);
        /* Call init() if Player loses (has no lives/hearts left).
         */
        if (!player.heartCount) init();
    }

    /* This is called by the update function and loops through all of the
     * objects within the allEnemies array and calls
     * their update() method. It then calls the update function for the Player object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy,i) {
            /* i argument is index position of Enemy object in array. */
            enemy.update(dt,i);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        renderBlocks();
        ctx.clearRect(0, -5, 505, 55);
        renderEntities();
    }

    function renderBlocks() {
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 4 of stone
                'images/stone-block.png',   // Row 2 of 4 of stone
                'images/stone-block.png',   // Row 3 of 4 of stone
                'images/stone-block.png',   // Row 4 of 4 of stone
                'images/grass-block.png'    // Row 1 of 1 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
    }

    function renderPlayerSelection() {
        var rowImages = [
                'images/char-cat-girl.png',
                'images/char-horn-girl.png',
                'images/char-boy.png',
                'images/char-pink-girl.png',
                'images/char-princess-girl.png'
            ],
            numCols = 5,
            x = -100.5,
            col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        function f() {
            for (col = 0; col < numCols; col++) {
                x += 101;
                ctx.drawImage(Resources.get(rowImages[col]), x, 229);
            }
        }
        return f();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
    }

    /* This function is called by init() every time the game is reset.
     * It changes selector tester property value back to '0' since it gets set to '1' when Player is selected.
     * It resets selector x coordinates back to initial location.
     * It deletes all elements of the allEnemies array and calls spawnEnemies() to populate that
     * array with new Enemy objects.
    */
    function reset() {
        selector.tester = 0;
        selector.x = 202.5;
        allEnemies.length = 0;
        spawnEnemies();
    }

    function resetPlayerMenu() {
        renderBlocks();
        selector.render();
        renderPlayerSelection();
        ctx.clearRect(0, -5, 505, 55);
        ctx.fillStyle = "#000000";
        ctx.font = "20px Arial";
        var text = "Use arrows to choose a player. When ready, click enter.";
        ctx.fillText(text, 5, 30);
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png',
        'images/Heart.png'

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js file.
     */
    global.ctx = ctx;

    /* Assign the init variable to the global variable (the window
     * object when run in a browser) so the init function can be called
     * from within the index.html file.
     */
    global.init = init;

})(this);
