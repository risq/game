DynamicTile = function(params) {
	this.params = params;
};
 
DynamicTile.prototype = {
	isAimable: function () {
        return (this.params.aimable !== false);
    }
};