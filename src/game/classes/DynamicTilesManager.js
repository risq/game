DynamicTilesManager = function(game, map, layer) {
 
    this.game = game;
    this.tiles = [];


	var tiles = layer.getTiles(0,0, map.heightInPixels, map.widthInPixels);
    for (var j = tiles.length - 1; j >= 0; j--) {
        if (tiles[j].index > 0) {
        	dynamicTile = new DynamicTile(tiles[j]);
        	this.tiles.push(dynamicTile);
        	tiles[j].dynamicTileID = this.tiles.length;
        }
    }
    console.log(tiles.length);
};
 
DynamicTilesManager.prototype = {

};