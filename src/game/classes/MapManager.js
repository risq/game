MapManager = function(game) {
 
    this.game = game;
    this.map = null;

    //Layers
    this.ground             = null;
    this.groundEffectsGroup = null;
    this.walls              = null;
    this.dynamics           = null;
    this.usedItemsGroup     = null;
    this.playerGroup        = null;
    this.effectsGroup       = null;
};
 
MapManager.prototype = {
 
    preload: function () {
        this.game.load.tilemap('map1', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    	this.game.load.image('tileset', 'assets/tiles/tileset.png');
    	this.game.load.image('dynamic', 'assets/tiles/dynamic.png');
    },
 
    create: function () {
        this.map = this.game.add.tilemap('map1');
	    this.map.addTilesetImage('tileset', 'tileset');
	    this.map.addTilesetImage('dynamic', 'dynamic');

        //layers ordering
	    this.ground             = this.map.createLayer('ground');
        this.groundEffectsGroup = this.game.add.group();
	    this.walls              = this.map.createLayer('walls');    
	    this.dynamics           = this.map.createLayer('dynamic');
        this.usedItemsGroup     = this.game.add.group();
        this.playerGroup        = this.game.add.group();
        this.effectsGroup       = this.game.add.group();

	    this.ground.resizeWorld();

	    this.map.setCollisionBetween(0, 64, true, this.walls);
	    this.map.setCollisionBetween(65, 128, true, this.dynamics);
	    
    },
 
    update: function() {
 
        
	    
    },

    orderLayers: function() {

    }
 
};