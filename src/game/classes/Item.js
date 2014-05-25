Item = function(params) {
	this.params = params;
	this.timeout = null;
};
 
Item.prototype = {
	useItem: function (game, mapManager, tile) {
		var sprite = game.add.sprite(tile.worldX, tile.worldY, 'items', this.params.tileIndex);
		if (!this.params.instantUse && (this.params.useTime > 0)) {
			var self = this;
			this.timeout = setTimeout(function() {
				self.launchAction(game, mapManager, tile, sprite);
			}, this.params.useTime);
		}
		else {
			this.launchAction();
		}
	},
	launchAction: function (game, mapManager, tile, sprite) {
		var emitter = game.add.emitter(tile.worldX, tile.worldY, 250);

	    emitter.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

	    emitter.minParticleSpeed.setTo(-50, -50);
	    emitter.maxParticleSpeed.setTo(50, 50);
	    emitter.minParticleScale = 0.1;
	    emitter.maxParticleScale = 2;
	    emitter.minParticleAlpha = 0.1;
	    emitter.maxParticleAlpha = 0.6;
	    emitter.gravity = 0;
	    emitter.start(false, 2000, 0, 80);

	    var brokenTileIndex;
	    if (typeof(tile.dynamicTile) !== 'undefined') {
	    	console.log (tile.dynamicTile);
			mapManager.map.putTile(tile.dynamicTile.params.brokenTileIndex, tile.x, tile.y, mapManager.dynamics);
	    }
	    else {
	    	mapManager.map.putTile(17, tile.x, tile.y, mapManager.ground);
	    }
		
		sprite.kill();
	}
};