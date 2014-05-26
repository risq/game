// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


function preload() {
    
    playerManager = new PlayerManager(game);
    playerManager.preload();

    mapManager = new MapManager(game);
    mapManager.preload();

    weaponsManager = new WeaponsManager(game);
    weaponsManager.preload();

    aimManager = new AimManager(game);
    aimManager.preload();

    dynamicTilesManager = new DynamicTilesManager(game);
    dynamicTilesManager.preload();

    cameraManager = new CameraManager(game);
    cameraManager.preload();

    game.playerManager       = playerManager;
    game.mapManager          = mapManager;
    game.weaponsManager      = weaponsManager;
    game.aimManager          = aimManager;
    game.dynamicTilesManager = dynamicTilesManager;
    game.cameraManager       = cameraManager;

}


var debugMode;

var cursors;
var debugKey;
var groundKey;
var wallsKey;
var layer3Key;

var walkAnim;

var tileSelector;

var toDebug;

var foundTile_debug;



//counters
var updateAiming_counter = {count: 0};



function create() {

    mapManager.create();
    playerManager.create();
    aimManager.create();
    weaponsManager.create();
    dynamicTilesManager.create();
    cameraManager.create();
    
    game.physics.startSystem(Phaser.Physics.ARCADE);

    debugKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    debugKey.onDown.add(function() {
        debugMode = !debugMode;
    }, this);

    game.input.onDown.add(function() {
        aimManager.click();
    });

}


function update() {
    
    game.physics.arcade.collide(playerManager.sprite, mapManager.walls, function() {
    });
    game.physics.arcade.collide(playerManager.sprite, mapManager.dynamics, function(playerManager, tile) {
        //tile.debug = true;
    });
    playerManager.update();


    oneInNFrame(2, updateAiming_counter, function() {
        aimManager.updateAiming(playerManager, mapManager);
    });

    cameraManager.update();



    
}

function render() {
    if (debugMode) {
        game.debug.text(toDebug, 600, 550);
        game.debug.bodyInfo(playerManager.sprite, 32, 32);
        game.debug.body(playerManager.sprite);
        //game.debug.body(mapManager.dynamics);
        //game.debug.body(mapManager.walls);

        if (aimManager.isFoundTile)
        	game.debug.geom(aimManager.ray, 'green');
        else 
        	game.debug.geom(aimManager.ray, 'red');

        if (aimManager.aimedDynamicTile)
            game.debug.text(aimManager.aimedDynamicTile.dynamicTile.name, 600, 500);
        else if (aimManager.isFoundTile)
            game.debug.text('ground', 600, 500);

    }
}



function generateMap() {
    for (var i = 0; i < 40; i++) {
        for (var j = 0; j < 30; j++) {
            map.putTile(0, i, j, ground);
        }
    }
    createRoom( Math.floor(Math.random() * 15) + 1,
                Math.floor(Math.random() * 15) + 1,
                Math.floor(Math.random() * 15) + 6,
                Math.floor(Math.random() * 15) + 6);

}

function createRoom(x, y, width, height) {
    console.log("x = " + x + " y = " + y + " width = " + width + " height = " + height );
    for (var x_cursor = x; x_cursor < (x + width); x_cursor++) {
        for (var y_cursor = y; y_cursor < (y + height); y_cursor++) {
            //door
            if (x_cursor === (x + 1) && y_cursor === y) {
                map.putTile(4, x_cursor, y_cursor, walls);
            }
            else if ((x_cursor === (x + 2) || x_cursor === (x + 3)) && y_cursor === y) {
                map.putTile(8, x_cursor, y_cursor, ground);
            }
            else if (x_cursor === (x + 4) && y_cursor === y) {
                map.putTile(5, x_cursor, y_cursor, walls);
            }
            // top
            else if (y_cursor === y) {
                // top left
                if (x_cursor === x) {
                    map.putTile(1, x_cursor, y_cursor, walls);
                }
                // top right
                else if (x_cursor === (x + width - 1)) {
                    map.putTile(3, x_cursor, y_cursor, walls);
                }
                // top between
                else {
                    map.putTile(2, x_cursor, y_cursor, walls);
                }
            }
            // bottom
            else if (y_cursor === (y + height - 1)) {
                // bottom left
                if (x_cursor === x) {
                    map.putTile(17, x_cursor, y_cursor, walls);
                }
                // bottom right
                else if (x_cursor === (x + width - 1)) {
                    map.putTile(19, x_cursor, y_cursor, walls);
                }
                // bottom between
                else {
                    map.putTile(18, x_cursor, y_cursor, walls);
                }
            }
            // left between
            else if (x_cursor === x && y_cursor != y && y_cursor != (y + height + 1)) {
                map.putTile(9, x_cursor, y_cursor, walls);
            }
            // right between
            else if (x_cursor === (x + width - 1) && y_cursor != y && y_cursor != (y + height + 1)) {
                map.putTile(11, x_cursor, y_cursor, walls);
            }
            else {
                map.putTile(10, x_cursor, y_cursor, ground);
            }
        }
    }
}


