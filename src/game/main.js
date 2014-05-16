// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('desert', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
}

var map;
var ground;
var layer2;
var layer3;

var marker;
var currentTile = 0;
var currentLayer;

var cursors;
var showLayersKey;
var groundKey;
var layer2Key;
var layer3Key;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Add a Tileset image to the map
    map.addTilesetImage('desert', 'desert', 32, 32, 1, 1);

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    ground = map.create('level1', 40, 30, 32, 32);
    // ground.scrollFactorX = 0.5;
    // ground.scrollFactorY = 0.5;

    //  Resize the world
    ground.resizeWorld();

    layer2 = map.createBlankLayer('level2', 40, 30, 32, 32);
    // layer2.scrollFactorX = 0.8;
    // layer2.scrollFactorY = 0.8;

    layer3 = map.createBlankLayer('level3', 40, 30, 32, 32);

    currentLayer = layer3;

    //  Create our tile selector at the top of the screen
    // createTileSelector();

    generateMap();

    game.input.setMoveCallback(updateMarker, this);

    cursors = game.input.keyboard.createCursorKeys();

    showLayersKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    groundKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    layer2Key = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    layer3Key = game.input.keyboard.addKey(Phaser.Keyboard.THREE);

    showLayersKey.onDown.add(changeLayer, this);
    groundKey.onDown.add(changeLayer, this);
    layer2Key.onDown.add(changeLayer, this);
    layer3Key.onDown.add(changeLayer, this);

}

function changeLayer(key) {

    switch (key.keyCode)
    {
        case Phaser.Keyboard.SPACEBAR:
            ground.alpha = 1;
            layer2.alpha = 1;
            layer3.alpha = 1;
            break;

        case Phaser.Keyboard.ONE:
            currentLayer = ground;
            ground.alpha = 1;
            layer2.alpha = 0.2;
            layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.TWO:
            currentLayer = layer2;
            ground.alpha = 0.2;
            layer2.alpha = 1;
            layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.THREE:
            currentLayer = layer3;
            ground.alpha = 0.2;
            layer2.alpha = 0.2;
            layer3.alpha = 1;
            break;
    }

}

function pickTile(sprite, pointer) {

    currentTile = game.math.snapToFloor(pointer.x, 32) / 32;

}

function updateMarker() {

    marker.x = currentLayer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = currentLayer.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown)
    {
        map.putTile(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), currentLayer);
        // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
    }

}

function generateMap() {
    for (var i = 0; i < 30; i++) {
        for (var j = 0; j < 30; j++) {
            map.putTile(29, i, j, ground);
        }
    }
    createRoom( Math.floor(Math.random() * 15) + 1,
                Math.floor(Math.random() * 15) + 1,
                Math.floor(Math.random() * 15) + 4,
                Math.floor(Math.random() * 15) + 4);
}

function createRoom(x, y, width, height) {
    for (var x_cursor = x; x_cursor < (x + width); x_cursor++) {
        for (var y_cursor = y; y_cursor < (y + height); y_cursor++) {
            // top
            if (y_cursor === y) {
                // top left
                if (x_cursor === x) {
                    map.putTile(0, x_cursor, y_cursor, layer2);
                }
                // top right
                else if (x_cursor === (x + width - 1)) {
                    map.putTile(2, x_cursor, y_cursor, layer2);
                }
                // top between
                else {
                    map.putTile(1, x_cursor, y_cursor, layer2);
                }
            }
            // bottom
            else if (y_cursor === (y + height - 1)) {
                // bottom left
                if (x_cursor === x) {
                    map.putTile(16, x_cursor, y_cursor, layer2);
                }
                // bottom right
                else if (x_cursor === (x + width - 1)) {
                    map.putTile(18, x_cursor, y_cursor, layer2);
                }
                // bottom between
                else {
                    map.putTile(17, x_cursor, y_cursor, layer2);
                }
            }
            // left between
            else if (x_cursor === x && y_cursor != y && y_cursor != (y + width)) {
                map.putTile(8, x_cursor, y_cursor, layer2);
            }
            // right between
            else if (x_cursor === (x + width - 1) && y_cursor != y && y_cursor != (y + width)) {
                map.putTile(10, x_cursor, y_cursor, layer2);
            }
            else {
                map.putTile(9, x_cursor, y_cursor, ground);
            }
        }
    }
}


function update() {

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

}

function render() {

    game.debug.text('Current Layer: ' + currentLayer.name, 16, 550);
    game.debug.text('1-3 Switch Layers. SPACE = Show All. Cursors = Move Camera', 16, 570);

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
