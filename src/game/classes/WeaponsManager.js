WeaponsManager = function(game, mapManager) {
 
    this.game = game;
    this.mapManager = mapManager;

    this.items = null;
    this.itemUseList = [];

    this.currentItem = null;
    
};
 
WeaponsManager.prototype = {
 
    preload: function () {
    	this.game.load.spritesheet('items', 'assets/tiles/items.png', 24, 24, 64, 1, 1);
        this.game.load.json('items_json', 'assets/datas/items.json');
        game.load.spritesheet('explosion', 'assets/tiles/explosion.png', 24, 24, 16, 1, 1);
    },
 
    create: function () {
        this.items = this.game.cache.getJSON('items_json');
        var dynamite = this.constructItem('dynamite');
        console.log(dynamite);
        this.currentItem = dynamite;
    },
 
    useItemOnDynamicTile: function(dynamicTile) {
        this.currentItem.useItem(game, mapManager, dynamicTile);
    },

    useItemOnGroundTile: function(aimedTile) {
        this.currentItem.useItem(game, mapManager, aimedTile);
    },

    constructItem: function (name) {
        return new Item(this.getItemParams(name));
    },

    getItemParams: function (name) {
        for(var i = 0 ; i < this.items.length ; i++){
            if(this.items[i].name == name){
                return this.items[i]; 
            }  
        }
        return null;
    }
 
};