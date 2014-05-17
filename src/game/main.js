// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('desert', 'assets/tiles/tileset.png');
    game.load.spritesheet('player', 'assets/sprites/player.png', 48, 48, 7, 1, 2);
}

var map;
var ground;
var layer2;
var layer3;
var debugMode;

var cursors;
var showLayersKey;
var groundKey;
var layer2Key;
var layer3Key;

var walkAnim;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Add a Tileset image to the map
    map.addTilesetImage('desert', 'desert', 24, 24, 1, 1);

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    ground = map.create('level1', 40, 30, 24, 24);
    // ground.scrollFactorX = 0.5;
    // ground.scrollFactorY = 0.5;

    //  Resize the world
    ground.resizeWorld();

    layer2 = map.createBlankLayer('level2', 40, 30, 24, 24);
    // layer2.scrollFactorX = 0.8;
    // layer2.scrollFactorY = 0.8;

    layer3 = map.createBlankLayer('level3', 40, 30, 24, 24);


    //  Create our tile selector at the top of the screen
    // createTileSelector();

    generateMap();

    map.setCollisionBetween(0, 48, true, layer2);

    game.physics.startSystem(Phaser.Physics.ARCADE);


    player = game.add.sprite(200, 200, 'player');
    player.anchor.set(0.5);

    walkAnim = player.animations.add('walk');

    game.camera.follow(player);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(28, 28, 0, 0);
    



    game.physics.enable(layer2, Phaser.Physics.ARCADE);

    






    
    cursors = game.input.keyboard.createCursorKeys();

    showLayersKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    groundKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    layer2Key = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    layer3Key = game.input.keyboard.addKey(Phaser.Keyboard.THREE);

    showLayersKey.onDown.add(function() {
        debugMode = !debugMode;
    }, this);

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;





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
                map.putTile(4, x_cursor, y_cursor, layer2);
            }
            else if ((x_cursor === (x + 2) || x_cursor === (x + 3)) && y_cursor === y) {
                map.putTile(8, x_cursor, y_cursor, ground);
            }
            else if (x_cursor === (x + 4) && y_cursor === y) {
                map.putTile(5, x_cursor, y_cursor, layer2);
            }
            // top
            else if (y_cursor === y) {
                // top left
                if (x_cursor === x) {
                    map.putTile(1, x_cursor, y_cursor, layer2);
                }
                // top right
                else if (x_cursor === (x + width - 1)) {
                    map.putTile(3, x_cursor, y_cursor, layer2);
                }
                // top between
                else {
                    map.putTile(2, x_cursor, y_cursor, layer2);
                }
            }
            // bottom
            else if (y_cursor === (y + height - 1)) {
                // bottom left
                if (x_cursor === x) {
                    map.putTile(17, x_cursor, y_cursor, layer2);
                }
                // bottom right
                else if (x_cursor === (x + width - 1)) {
                    map.putTile(19, x_cursor, y_cursor, layer2);
                }
                // bottom between
                else {
                    map.putTile(18, x_cursor, y_cursor, layer2);
                }
            }
            // left between
            else if (x_cursor === x && y_cursor != y && y_cursor != (y + height + 1)) {
                map.putTile(9, x_cursor, y_cursor, layer2);
            }
            // right between
            else if (x_cursor === (x + width - 1) && y_cursor != y && y_cursor != (y + height + 1)) {
                map.putTile(11, x_cursor, y_cursor, layer2);
            }
            else {
                map.putTile(10, x_cursor, y_cursor, ground);
            }
        }
    }
}


function update() {
    var velX   = 0,
        velY   = 0,
        moving = false;

    player.body.velocity.setTo(0, 0);

    var angleToPointer = game.physics.arcade.angleToPointer(player);
    if (Math.round(player.rotation * 100) / 100 != Math.round(angleToPointer * 100) / 100) {
        player.rotation = angleToPointer;
        moving = true;
    }


    game.physics.arcade.collide(player, layer2, function() {
        console.log("collide");
    });

    //player.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
        velX = -200;
        moving = true;
    }
    else if (cursors.right.isDown)
    {
        velX = 200;
        moving = true;
    }

    if (cursors.up.isDown)
    {
        if (velX !== 0) {
            velX = velX * 0.7;
            velY = -200 * 0.7;
        }
        else {
            velY = -200;
            moving = true;
        }
    }
    else if (cursors.down.isDown)
    {
        if (velX !== 0) {
            velX = velX * 0.7;
            velY =  200 * 0.7;
        }
        else {
            velY = 200;
            moving = true;
        }
    }

    player.body.velocity.set(velX, velY);
    if (moving && !walkAnim.isPlaying) {
        walkAnim.play(12, true);
    }
    else if (!moving) {
        walkAnim.stop();
    }


}

function render() {
    if (debugMode) {
        game.debug.bodyInfo(player, 32, 32);
        game.debug.body(player);
        game.debug.body(layer2);
    }
}

function createTileSelector() {

    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.5);
    tileSelectorBackground.drawRect(0, 0, 800, 34);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, 'ground_1x1');
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(pickTile, this);

    tileSelector.fixedToCamera = true;

    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

}
