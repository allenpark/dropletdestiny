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


TurbulenzEngine.onload = function onloadFn()
{

    var intervalID;
    var isOver = false;

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var inputDevice = TurbulenzEngine.createInputDevice({});
    var md = TurbulenzEngine.createMathDevice({});
    var phys2D = Physics2DDevice.create();

    var canvasElem = TurbulenzEngine.canvas;
    var canvas = Canvas.create(graphicsDevice, md);
    var ctx = canvas.getContext('2d');

    var stageWidth  = canvas.width;
    var stageHeight = canvas.height;

    var draw2D = Draw2D.create({
        graphicsDevice: graphicsDevice,
        viewportRectangle: [0,0, stageWidth, stageHeight],
        scaleMode: 'scale'
    });

    var mainMaterial = phys2D.createMaterial({
        elasticity: 0,
    });

    var world = phys2D.createWorld({
        gravity : [0, 0],
        velocityIterations : 8,
        positionIterations : 8
    });

    var borderThickness = 1;
    var borders =  []
    var borderColor = [1.0, 0.0, 0.0, 1.0];
    borders.push({color: borderColor, destinationRectangle: [0, 0, borderThickness, stageHeight]});
    borders.push({color: borderColor, destinationRectangle: [0, 0, stageWidth, borderThickness]});
    borders.push({color: borderColor, destinationRectangle: [(stageWidth - borderThickness), 0, stageWidth, stageHeight]});
    borders.push({color: borderColor, destinationRectangle: [0, (stageHeight - borderThickness), stageWidth, stageHeight]});

    inputDevice.addEventListener('keydown', handleKeyDown);

    inputDevice.addEventListener('keyup', handleKeyUp)

    var field = new Field(graphicsDevice, md, stageWidth, stageHeight, [new Droplet(graphicsDevice, md, 50, 50, 5, 2.0)], [new Obstacle(graphicsDevice, md, 100, 100, -50, 2.0)]);
    var protagonist = new Player(graphicsDevice, md, stageWidth, stageHeight);
	
	//Instatiates all the background sprites!!
	var bgSprites = []
	for (var i = 0; i < 100; i++) {
		bgSprites[i] = new imageSprite(graphicsDevice, md, stageWidth, stageHeight, 150 + Math.random()*100, 300 + Math.random()*1000, 32, 32);
		bgSprites[i].setSpeed(Math.random()*5);
	}
	
	for (var i = 100; i < 120; i++) {
		bgSprites[i] = new Tree(graphicsDevice, md, stageWidth, stageHeight, 0, 300 + Math.random()*10000, 100, 100);
		bgSprites[i].setSpeed(3);
	}
	
	for (var i = 120; i < 140; i++) {
		bgSprites[i] = new Tree(graphicsDevice, md, stageWidth, stageHeight, 110, 300 + Math.random()*10000, 100, 100);
		bgSprites[i].setSpeed(3);
	}
	
	bgSprites[0] = new Background(graphicsDevice, md, stageWidth, stageHeight, 0, 0, 640, 540);
	
    var keyCodes = [];

    function update() {
        /* Update code goes here */

        var canvasBox = md.v4Build(0,0, canvas.width, canvas.height);
    
        if (graphicsDevice.beginFrame())
        {
            //graphicsDevice.clear([1.0, 0.5, 0.25, 1.0], 1.0);
            world.step(1.0/60);

            // Moves the player.
            protagonist.update(keyCodes);
            // Moves the droplets and obstacles.
            field.update(world.timeStamp);
            
            // TODO: check for collisions.

            //DRAWS EVERYTHING
            // additive makes dark colors transparent...
            draw2D.begin('alpha');
			
			//rendering background
			for(var i = 0; i < bgSprites.length; i++){
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
            for(i = 1; i < borderPoints.length; i += 1) {
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
        }
    }

    function handleKeyDown(e) {
        var index = keyCodes.indexOf(e);
        if (index > -1) {
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

    restartGame();

    function restartGame() {
      intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
      isOver = false;
    }
}
