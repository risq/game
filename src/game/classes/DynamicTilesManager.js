DynamicTilesManager = function(game, map, layer) {
 
    this.game = game;
    this.map = map;
    this.layer = layer;

	
    //console.log(tiles.length);
};
 
DynamicTilesManager.prototype = {
    preload: function () {
        
    }, 
 
    create: function () {
        var tiles = this.layer.getTiles(0,0, this.map.heightInPixels, this.map.widthInPixels);
        for (var j = tiles.length - 1; j >= 0; j--) {
            if (tiles[j].index > -1)
                tiles[j].dynamicTile = this.constructDynamicTile(tiles[j]);
        }
    },

    constructDynamicTile: function (tile) {
        var dynamicTile;
        switch (tile.index) {
            case 65:
                dynamicTile = new Safe(tile);
            break;

        }
        return dynamicTile;
    } 
};