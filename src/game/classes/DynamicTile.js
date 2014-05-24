DynamicTile = function(tile) {
	this.tile = tile;

    if (this.tile) {
    	this.init();
    }
};
 
DynamicTile.prototype = {
	init: function () {

	},
	isAimable: function () {
        return (this.aimable !== false);
    }
};