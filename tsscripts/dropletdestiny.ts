/*{# jslib files #}*/
/*{{ javascript("../jslib/physics2ddevice.js") }}*/
/*{{ javascript("../jslib/boxtree.js") }}*/
/*{{ javascript("../jslib/canvas.js") }}*/
/*{{ javascript("../jslib/draw2d.js") }}*/
/*{{ javascript("../jslib/observer.js") }}*/
/*{{ javascript("../jslib/requesthandler.js") }}*/
/*{{ javascript("../jslib/utilities.js") }}*/

/// <reference path="../jslib-modular/vmath.d.ts" />
/// <reference path="../jslib-modular/canvas.d.ts" />
/// <reference path="../jslib-modular/fontmanager.d.ts" />
/// <reference path="../jslib-modular/debug.d.ts" />
/// <reference path="../jslib-modular/turbulenz.d.ts" />
/// <reference path="../jslib-modular/aabbtree.d.ts" />
/// <reference path="../jslib-modular/jsengine.d.ts" />
/// <reference path="../jslib-modular/jsengine_base.d.ts" />
/// <reference path="../jslib-modular/jsengine_debug.d.ts" />
/// <reference path="../jslib-modular/physics2d.d.ts" />
/// <reference path="../jslib-modular/tzdraw2d.d.ts" />
/// <reference path="../jslib-modular/utilities.d.ts" />

/*{# our scripts #}*/
// Example:
/// <reference path="math.ts" />
/// <reference path="player.ts" />
/// <reference path="field.ts" />
/// <reference path="droplet.ts" />
/// <reference path="obstacle.ts" />
/// <reference path="imageSprite.ts" />
/// <reference path="background.ts" />


TurbulenzEngine.onload = function onloadFn() {

    var intervalID;
    var isOver;

    var graphicsDevice;
    var inputDevice = TurbulenzEngine.createInputDevice({});
    var md;
    var phys2D;

    graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    md = TurbulenzEngine.createMathDevice({});
    phys2D = Physics2DDevice.create();

    var canvasElem;
    var canvas;
    var ctx;

    canvasElem = TurbulenzEngine.canvas;
    canvas = Canvas.create(graphicsDevice, md);
    ctx = canvas.getContext('2d');

    var stageWidth;
    var stageHeight;

    var clearColor = [0.0, 0.3, 1.0, 1.0];
    var draw2D;
    var mainMaterial;
    var world;
    var borderThickness;
    var borders = [];
    var borderColor;
    var score;

    inputDevice.addEventListener('keydown', handleKeyDown);
    inputDevice.addEventListener('keyup', handleKeyUp);

    document.getElementById("playButtonM").addEventListener("click", handlePlayButtonM);
    document.getElementById("creditsButtonM").addEventListener("click", handleCreditsButtonM);
    document.getElementById("mainMenuButtonC").addEventListener("click", handleMainMenuButtonC);
    document.getElementById("resumeButtonP").addEventListener("click", handleResumeButtonP);
    document.getElementById("quitButtonP").addEventListener("click", handleQuitButtonP);
    document.getElementById("replayButtonGO").addEventListener("click", handleReplayButtonGO);
    document.getElementById("mainMenuButtonGO").addEventListener("click", handleMainMenuButtonGO);

    var field;
    var protagonist;
    var bgSprites = [];
    var keyCodes;

    document.getElementById("mainMenu").className = "";
    intervalID = TurbulenzEngine.setInterval(menuUpdate, 1000 / 60);

    function menuUpdate() {
        var canvasBox = md.v4Build(0, 0, canvas.width, canvas.height);

        if (graphicsDevice.beginFrame()) {
            graphicsDevice.clear(clearColor, 1.0);
            graphicsDevice.endFrame();
        }
    }

    function gameUpdate() {
        /* Update code goes here */

        var canvasBox = md.v4Build(0, 0, canvas.width, canvas.height);

        if (graphicsDevice.beginFrame()) {
            graphicsDevice.clear([0.0, 0.0, 0.0, 1.0], 1.0);
            world.step(1.0 / 60);

            // Moves the player.
            protagonist.update(keyCodes);
            // Moves the droplets and obstacles.
            field.update(world.timeStamp);

            // TODO: check for collisions.

            //DRAWS EVERYTHING
            // additive makes dark colors transparent...
            draw2D.begin('alpha');

            //rendering background
            for (var i = 0; i < bgSprites.length; i++) {
                bgSprites[i].draw(draw2D);
            }

            field.draw(draw2D);
            protagonist.draw(draw2D);

            for (var i = 0; i < 4; i++) {
                // Uncomment following line to make a border.
                //draw2D.draw(borders[i]);
            }
            draw2D.end();

            // Drawing the polygon border.
            ctx.beginFrame(graphicsDevice, [0, 0, canvas.width, canvas.height]);
            var borderPoints = [[0, 0], [0, protagonist.height], [(canvas.height - protagonist.height) / 2.0, canvas.height], [5 * protagonist.max_x / 2.0 + protagonist.height / 2.0 + protagonist.width / 2.0 + canvas.height / 2.0, canvas.height], [5 * protagonist.max_x / 2.0 + protagonist.height / 2.0 + protagonist.width / 2.0, 0]];
            var point = borderPoints[0];
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(point[0], point[1]);
            for (i = 1; i < borderPoints.length; i += 1) {
                point = borderPoints[i];
                ctx.lineTo(point[0], point[1]);
            }
            ctx.closePath();
            //ctx.fillStyle = '#00F';
            //ctx.fill();
            ctx.strokeStyle = '#FFF';
            ctx.stroke();
            ctx.restore();
            ctx.endFrame();

            graphicsDevice.endFrame();

            if (isOver) {
                endGame();
            }
        }
    }

    function handleKeyDown(e) {
        var index = keyCodes.indexOf(e);
        // pause the game if p is pressed
        if (e == inputDevice.keyCodes.P) {
            document.getElementById("pauseMenu").className = "";
            TurbulenzEngine.clearInterval(intervalID);
            intervalID = TurbulenzEngine.setInterval(menuUpdate, 1000 / 60);

            clearColor = [0.3, 0.3, 0.3, 1];

        } else if (index > -1) {
            console.log('Error: adding existing key ' + e + ' to keyCodes.');
        }
        keyCodes.push(e);
    }

    function handleKeyUp(e) {
        var index = keyCodes.indexOf(e);
        if (index > -1) {
            keyCodes.splice(index, 1);
        } else {
            console.log('Error: attempted to remove missing key ' + e + ' from keyCodes.');
        }
    }

    function handlePlayButtonM(e) {
        document.getElementById("mainMenu").className = "hidden";
        startGame();
    }

    function handleCreditsButtonM() {
        document.getElementById("mainMenu").className = "hidden";
        document.getElementById("creditsMenu").className = "";
    }

    function handleMainMenuButtonC() {
        document.getElementById("creditsMenu").className = "hidden";
        document.getElementById("mainMenu").className = "";
    }

    function handleResumeButtonP() {
        document.getElementById("pauseMenu").className = "hidden";
        TurbulenzEngine.clearInterval(intervalID);
        intervalID = TurbulenzEngine.setInterval(gameUpdate, 1000 / 60);
        document.getElementById("turbulenz_game_engine_canvas").focus();
    }

    function handleQuitButtonP() {
        document.getElementById("pauseMenu").className = "hidden";
        document.getElementById("mainMenu").className = "";
        startMenu();
        clearColor = [0.0, 0.3, 1.0, 1.0];
    }

    function handleReplayButtonGO() {
        document.getElementById("gameOverMenu").className = "hidden";
        startGame();
    }

    function handleMainMenuButtonGO() {
        document.getElementById("gameOverMenu").className = "hidden";
        document.getElementById("mainMenu").className = "";
        startMenu();
        clearColor = [0.0, 0.3, 1.0, 1.0];
    }

    function startMenu() {
        TurbulenzEngine.clearInterval(intervalID);
        intervalID = TurbulenzEngine.setInterval(menuUpdate, 1000 / 60);
    }

    function startGame() {
        TurbulenzEngine.clearInterval(intervalID);
        intervalID = TurbulenzEngine.setInterval(gameUpdate, 1000 / 60);
        //document.getElementById("turbulenz_game_engine_canvas").focus();

        isOver = false;
        score = 0;

        stageWidth = canvas.width;
        stageHeight = canvas.height;

        draw2D = Draw2D.create({
            graphicsDevice: graphicsDevice,
            viewportRectangle: [0, 0, stageWidth, stageHeight],
            scaleMode: 'scale'
        });

        mainMaterial = phys2D.createMaterial({
            elasticity: 0,
        });

        world = phys2D.createWorld({
            gravity: [0, 0],
            velocityIterations: 8,
            positionIterations: 8
        });

        borderThickness = 1;
        borders = [];
        borderColor = [1.0, 0.0, 0.0, 1.0];
        borders.push({ color: borderColor, destinationRectangle: [0, 0, borderThickness, stageHeight] });
        borders.push({ color: borderColor, destinationRectangle: [0, 0, stageWidth, borderThickness] });
        borders.push({ color: borderColor, destinationRectangle: [(stageWidth - borderThickness), 0, stageWidth, stageHeight] });
        borders.push({ color: borderColor, destinationRectangle: [0, (stageHeight - borderThickness), stageWidth, stageHeight] });

        field = new Field(graphicsDevice, md, stageWidth, stageHeight, [new Droplet(graphicsDevice, md, 50, 50, 5, 2.0)], [new Obstacle(graphicsDevice, md, 100, 100, -50, 2.0)]);
        protagonist = new Player(graphicsDevice, md, stageWidth, stageHeight);

        bgSprites = []
	for (var i = 0; i < 100; i++) {
            bgSprites[i] = new imageSprite(graphicsDevice, md, stageWidth, stageHeight, 150 + Math.random() * 100, 300 + Math.random() * 1000, 32, 32);
            bgSprites[i].setSpeed(Math.random() * 5);
        }

        for (var i = 100; i < 120; i++) {
            bgSprites[i] = new Tree(graphicsDevice, md, stageWidth, stageHeight, 0, 300 + Math.random() * 10000, 100, 100);
            bgSprites[i].setSpeed(3);
        }

        for (var i = 120; i < 140; i++) {
            bgSprites[i] = new Tree(graphicsDevice, md, stageWidth, stageHeight, 110, 300 + Math.random() * 10000, 100, 100);
            bgSprites[i].setSpeed(3);
        }

        bgSprites[0] = new Background(graphicsDevice, md, stageWidth, stageHeight, 0, 0, 640, 540);

        keyCodes = [];
    }

    function endGame() {
        document.getElementById("gameOverMenu").className = "";
        TurbulenzEngine.clearInterval(intervalID);
        intervalID = TurbulenzEngine.setInterval(menuUpdate, 1000 / 60);
        clearColor = [0.0, 0.3, 1.0, 1.0];
        document.getElementById("scoreLabel").innerHTML = "Score: " + score;
    }
}
