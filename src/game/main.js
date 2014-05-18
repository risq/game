// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('map1', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', 'assets/tiles/tileset.png');
    game.load.image('dynamic', 'assets/tiles/dynamic.png');
    game.load.image('tileSelector', 'assets/sprites/tileSelector.png');
    player = new Player(game);
    player.preload();
}

var map;
var ground;
var walls;
var dynamics;
var debugMode;

var cursors;
var showLayersKey;
var groundKey;
var wallsKey;
var layer3Key;

var walkAnim;

var ray;
var tileSelector;

var toDebug;

function create() {
    map = game.add.tilemap('map1');
    map.addTilesetImage('tileset', 'tileset');
    

    ground = map.createLayer('ground');
    ground.resizeWorld();

    walls = map.createLayer('walls');
    
    map.addTilesetImage('dynamic', 'dynamic');
    dynamics = map.createLayer('dynamic');
    map.setCollisionBetween(65, 128, true, dynamics);
    map.setCollisionBetween(0, 64, true, walls);
    
    dynamicTilesManager = new DynamicTilesManager(game, map, dynamics);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    tileSelector = game.add.sprite(-1, -1, 'tileSelector');
    player.create();
    

    game.camera.follow(player.sprite);

    game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    player.sprite.body.setSize(22, 22, 0, 0);

    game.physics.enable(walls, Phaser.Physics.ARCADE);

    

    showLayersKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    showLayersKey.onDown.add(function() {
        debugMode = !debugMode;
    }, this);

}


function update() {
    player.update();
    this.game.physics.arcade.collide(player.sprite, walls, function() {
    });
    this.game.physics.arcade.collide(player.sprite, dynamics, function(player, tile) {
        //tile.debug = true;
    });

    var foundTile = false,
        selectedX,
        selectedY;


    if (this.game.physics.arcade.distanceToXY(player.sprite, game.input.worldX, game.input.worldY) < 72) 
    {
        ray = new Phaser.Line(player.sprite.x, player.sprite.y, game.input.worldX, game.input.worldY);
        var wallsCheck = walls.getRayCastTiles(ray, 1, true, false);
        if (wallsCheck.length === 0)
        {
            var objectsCheck = dynamics.getRayCastTiles(ray, 1, true, false);
            if (objectsCheck.length === 0)
            {
                var selectedTile = map.getTileWorldXY(game.input.worldX, game.input.worldY, 24, 24, ground);
                selectedX = selectedTile.worldX;
                selectedY = selectedTile.worldY;
                foundTile = true;
            }
        }
    }
    if (!foundTile) 
    {
        ray = new Phaser.Line(player.sprite.x, player.sprite.y, game.input.worldX, game.input.worldY);
        var tileHits = dynamics.getRayCastTiles(ray, 1, true, false);
        if (tileHits.length > 0)
        {
            var closest;
            var closestDistance = 999999999;

            for (var i = 0; i < tileHits.length; i++)
            {
                ray.setTo(player.sprite.x, player.sprite.y, tileHits[i].worldX + tileHits[i].centerX, tileHits[i].worldY + tileHits[i].centerY); 
                var tileDistance = ray.length;
                if (tileDistance < 72 && tileDistance < closestDistance) {
                    var wallsCheck = walls.getRayCastTiles(ray, 1, true, false);
                    if (wallsCheck.length === 0)
                    {
                        closest = tileHits[i];
                        closestDistance = tileDistance;
                        //console.log('VALID - tileDistance (i = '+ i +') :' + tileDistance);

                    }
                }
            }
            if (closest) {
                selectedX = closest.worldX;
                selectedY = closest.worldY;
                foundTile = true;
            }
            
        }
    }
    if (foundTile) {
        tileSelector.visible = true;
        tileSelector.x = selectedX;
        tileSelector.y = selectedY;
    }
    else {
        tileSelector.visible = false;
    }
}

function render() {
    if (debugMode) {
        game.debug.text(toDebug, 700, 500);
        game.debug.bodyInfo(player.sprite, 32, 32);
        game.debug.body(player.sprite);
        game.debug.body(dynamics);
        game.debug.body(walls);
        game.debug.geom(ray);

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


