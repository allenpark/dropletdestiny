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


TurbulenzEngine.onload = function onloadFn()
{

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

    var thickness = 1
    var border = phys2D.createRigidBody({
        type: 'static',
        shapes: [
            phys2D.createPolygonShape({
                vertices: phys2D.createRectangleVertices(
                    0, 0, thickness, stageHeight)
            }), 
            phys2D.createPolygonShape({
                vertices: phys2D.createRectangleVertices(
                    0, 0, stageWidth, thickness)
            }), 
            phys2D.createPolygonShape({
                vertices: phys2D.createRectangleVertices(
                    (stageWidth - thickness), 0, stageWidth, stageHeight)
            }), 
            phys2D.createPolygonShape({
                vertices: phys2D.createRectangleVertices(
                    0, (stageHeight - thickness), stageWidth, stageHeight)
            })
        ]
    });

    world.addRigidBody(border);

    function update() {
        /* Update code goes here */

        var canvasBox = md.v4Build(0,0, canvas.width, canvas.height);
    
        if (graphicsDevice.beginFrame())
        {
            world.step(1.0/60);

            graphicsDevice.endFrame();
        }
    }

}
