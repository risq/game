DynamicTilesManager = function(game) {
 
    this.game = game;

	this.dynamicTiles = null;

};
 
DynamicTilesManager.prototype = {
    preload: function () {
        this.game.load.json('dynamicTiles_json', 'assets/datas/dynamicTiles.json');
    }, 
 
    create: function () {
        this.dynamicTiles = this.game.cache.getJSON('dynamicTiles_json');

        var tiles = this.game.mapManager.dynamics.getTiles(0,0, this.game.mapManager.map.heightInPixels, this.game.mapManager.map.widthInPixels);
        for (var j = tiles.length - 1; j >= 0; j--) {
            if (tiles[j].index > -1)
                tiles[j].dynamicTile = this.constructDynamicTile(tiles[j].index);
        }
    },

    constructDynamicTile: function (tileIndex) {
        return new DynamicTile(this.getDynamicTileParams(tileIndex));
    },

    getDynamicTileParams: function (tileIndex) {
        for(var i = 0 ; i < this.dynamicTiles.length ; i++){
            if(this.dynamicTiles[i].tileIndex == tileIndex){
                return this.dynamicTiles[i]; 
            }  
        }
        return null;
    }
};