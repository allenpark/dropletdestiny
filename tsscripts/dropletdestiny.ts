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
    var trees = [];
    var keyCodes;
    var trail;
    var playerSpeed;
    var PSpeed;

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

            //Update position of rigid body associated with player
            protagonist.getRigidBody().setPosition(protagonist.getPosition());
            // Moves the droplets and obstacles.
            playerSpeed = 1.0 + (trail.length)*.05;
            field.setSpeed(playerSpeed);
            PSpeed = .1 * (playerSpeed);
            field.update(world.timeStamp, draw2D);

            if (world.timeStamp % 4 == 0) {
              trees.push(new Tree(graphicsDevice, md, stageWidth, stageHeight, -1*(Math.random()*100) - 25, 300, 100, 100));
            }

            // TODO: check for collisions.
            //console.log("About to check collisions");
            //var length = world.rigidBodies.length;
            //var playerPosition = protagonist.getRigidBody().getPosition();
            //console.log("Num rigid bodies" + length);
            //console.log("Position of rigid body " + playerPosition[0] + ", " + playerPosition[1]);
            var arbiters = world.staticArbiters;
            for (var i = 0, nArbs = arbiters.length; i < nArbs; i++){
                var arb = arbiters[i];
                //console.log("We're in this loop");
                if(!arb.active){
                    continue;
                }
                //TODO: What happens when player hits droplet?
                //Testing to see if collisions are detected
                if(arb.bodyA.isDynamic() && arb.bodyB.isDynamic()){
                    //world.removeRigidBody(arb.bodyA);
                    //console.log("Collisions!");
                } else if(arb.bodyA.isDynamic()) {
                    if(arb.bodyB.isKinematic()){
                        //console.log("Collisions!!");
                        //Remove Droplet rigid body from world
                        
                        var id = arb.bodyB.userData;
                        if(id == "obstacle") {
                            isOver = true;
                            score = trail.length;
                        } else {
                            world.removeRigidBody(arb.bodyB);
                            //Remove Droplet sprite from world
                            var removedDroplet = field.removeDroplet(id);
                            trail.push([0]);
                        }
                    }
                } else if(arb.bodyB.isDynamic()){
                    if(arb.bodyA.isKinematic()){
                        //console.log("Collisions!!!");
                        //Remove Droplet rigid body from world
                        var id = arb.bodyA.userData;
                        if(id == "obstacle") {
                            isOver = true;
                            score = trail.length;
                        } else {
                            world.removeRigidBody(arb.bodyA);
                            //Remove Droplet sprite from world
                            var removedDroplet = field.removeDroplet(id);
                            //Add new position to player droplet list
                            trail.push([0]);
                        }
                    }
                }
            }

            //DRAWS EVERYTHING
            // additive makes dark colors transparent...
            draw2D.begin('alpha');

            bgSprites[1].setSpeed(.03*PSpeed);
            bgSprites[2].setSpeed(.06*PSpeed);
            bgSprites[3].setSpeed(.1*PSpeed);
            bgSprites[4].setSpeed(.3*PSpeed);
            bgSprites[5].setSpeed(.33*PSpeed);
        
            //Clouds
            for (var i = 6; i < 30; i++) {
                bgSprites[i].setSpeed((Math.random()*.1 + .1)*PSpeed);
            }
        
            for (var i = 30; i < 50; i++) {
                bgSprites[i].setSpeed((Math.random()*.2 + .5)*PSpeed);
            }

            //rendering background
            for (var i = 0; i < bgSprites.length; i++) {
                bgSprites[i].draw(draw2D);
            }

            for (var i = 0; i < trees.length; i++) {
                trees[i].setSpeed(playerSpeed);
                trees[i].draw(draw2D);
                if (!trees[i].inCanvasY()) {
                  trees.splice(i,1);
                }
            }


            field.draw(draw2D);

            trail.unshift(protagonist.getPosition()[0]);
            trail.pop();

            for (var i = 0; i < 4; i++) {
                // Uncomment following line to make a border.
                //draw2D.draw(borders[i]);
            }
            draw2D.end();

            // Drawing the polygon border.
            ctx.beginFrame(graphicsDevice, [0, 0, canvas.width, canvas.height]);
            //var borderPoints = [[0, 0], [0, protagonist.height], [(canvas.height - protagonist.height) / 2.0, canvas.height], [5 * protagonist.max_x / 2.0 + protagonist.height / 2.0 + protagonist.width / 2.0 + canvas.height / 2.0, canvas.height], [5 * protagonist.max_x / 2.0 + protagonist.height / 2.0 + protagonist.width / 2.0, 0]];
            //var point = borderPoints[0];
            var yPosition = protagonist.getPosition()[1];
            for(var i = 0; i < trail.length; i++){
                ctx.save();
                ctx.beginPath();
                ctx.arc(2 * trail[i] + yPosition + 16, -trail[i] + 2 * yPosition + 16, 16, 0, 2*Math.PI, false);
                ctx.closePath();
                yPosition-= 3;
                ctx.fillStyle = "#42C2E9";
                ctx.fill();
                ctx.restore();
            }

            //ctx.save();
            //ctx.beginPath();
            //ctx.moveTo(point[0], point[1]);
            //for (i = 1; i < borderPoints.length; i += 1) {
            //    point = borderPoints[i];
            //    ctx.lineTo(point[0], point[1]);
            //}
            //ctx.closePath();
            ////ctx.fillStyle = '#00F';
            ////ctx.fill();
            //ctx.strokeStyle = '#FFF';
            //ctx.stroke();
            //ctx.restore();
            ctx.endFrame();

            draw2D.begin('alpha');
            protagonist.draw(draw2D);
            draw2D.end();

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
        trail = [];
        trees = [];

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

        field = new Field(graphicsDevice, md, phys2D, stageWidth, stageHeight, [], [], world);
        protagonist = new Player(graphicsDevice, phys2D, md, stageWidth, stageHeight);
	    world.addRigidBody(protagonist.getRigidBody());

        //Replace this with speed of player! (Keep it low!)
        PSpeed = .4;

        bgSprites = []

        //Sky
        bgSprites[0] = new Sky(graphicsDevice, md, stageWidth, stageHeight, 0, 0, 640, 540);
        
        //Mountain Ranges
        bgSprites[1] = new Mountain3(graphicsDevice, md, stageWidth, stageHeight, 110, 100, 540, 540);
        bgSprites[1].setSpeed(.05*PSpeed);
        
        bgSprites[2] = new Mountain2(graphicsDevice, md, stageWidth, stageHeight, 110, 140, 540, 540);
        bgSprites[2].setSpeed(.08*PSpeed);
        
        bgSprites[3] = new Mountain1(graphicsDevice, md, stageWidth, stageHeight, 110, 200, 540, 540);
        bgSprites[3].setSpeed(.12*PSpeed);
        
        //Hills
        bgSprites[4] = new Hill2(graphicsDevice, md, stageWidth, stageHeight, 110, 400, 540, 540);
        bgSprites[4].setSpeed(.3*PSpeed);
        
        bgSprites[5] = new Hill1(graphicsDevice, md, stageWidth, stageHeight, 110, 500, 540, 540);
        bgSprites[5].setSpeed(.33*PSpeed);
        
        //Clouds
        for (var i = 6; i < 30; i++) {
            bgSprites[i] = new Cloud1(graphicsDevice, md, stageWidth, stageHeight, 50 + Math.random()*400, Math.random()*200, 150, 50);
            bgSprites[i].setSpeed((Math.random()*.1 + .1)*PSpeed);
        }
        
        for (var i = 30; i < 50; i++) {
            bgSprites[i] = new Cloud2(graphicsDevice, md, stageWidth, stageHeight, 50 + Math.random()*400, Math.random()*500, 300, 100);
            bgSprites[i].setSpeed((Math.random()*.2 + .5)*PSpeed);
        }

        bgSprites[50] = new MountainSide(graphicsDevice, md, stageWidth, stageHeight, 0, 0, 640, 540);
        
        //Trees
        for (var i = 0; i < 50; i++) {
            trees[i] = new Tree(graphicsDevice, md, stageWidth, stageHeight, -1*(Math.random()*100) - 25, 50 + (1200)*Math.random(), 100, 100);
            trees[i].setSpeed(playerSpeed);
        }
		
		////Bushes
		//for (var i = 100; i < 150; i++) {
		//	bgSprites[i] = new Shrub(graphicsDevice, md, stageWidth, stageHeight, 0 - Math.random()*100, 300 + Math.random()*10000, 50, 50);
        //    bgSprites[i].setSpeed(7*PSpeed);
		//}
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
