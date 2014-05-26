Item = function(params) {
	this.params = params;
	this.timeout = null;

	this.explosionEmitter = null;
};
 
Item.prototype = {
	useItem: function (game, tile) {
		var sprite = game.add.sprite(tile.worldX, tile.worldY, 'items', this.params.tileIndex);
		game.mapManager.usedItemsGroup.add(sprite);
		if (!this.params.instantUse && (this.params.useTime > 0)) {
			var self = this;
			this.timeout = setTimeout(function() {
				self.launchAction(game, tile, sprite);
			}, this.params.useTime);
		}
		else {
			this.launchAction();
		}
	},
	launchAction: function (game, tile, sprite) {
		if (this.params.explodes) {
			var emitter = game.add.emitter(tile.worldX, tile.worldY, 250);
			game.mapManager.effectsGroup.add(emitter);
		    emitter.minParticleSpeed.setTo(-50, -50);
		    emitter.maxParticleSpeed.setTo(50, 50);
		    emitter.minParticleScale = 0.1;
		    emitter.maxParticleScale = 2;
		    emitter.minParticleAlpha = 0.1;
		    emitter.maxParticleAlpha = 0.6;
		    emitter.gravity = 0;
		    emitter.start(false, 2000, 0, 80);
		    emitter.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
		}

		//item used on dynamic tile	    
	    if (typeof(tile.dynamicTile) !== 'undefined') {
	    	console.log (tile.dynamicTile);
			game.mapManager.map.putTile(tile.dynamicTile.params.brokenTileIndex, tile.x, tile.y, mapManager.dynamics);
	    }
	    //item used on ground tile	    
	    else {
	    	
	    }

	    //ground explosion sprite
	    if (this.params.explosionSprite) {
	    	var groundExplosion = game.add.sprite(tile.worldX + 12, 
	    										  tile.worldY + 12, 
	    										  this.params.explosionSprite);
	    	groundExplosion.anchor.setTo(0.5);
	    	groundExplosion.angle = 90 * game.rnd.integerInRange(0,3);
	    	game.mapManager.groundEffectsGroup.add(groundExplosion);
	    }
	    
		//camera shake
		if (this.params.shakeOnExplode) {
	    	game.cameraManager.shake();
	    }

	    //kill sprite
		sprite.kill();
	}
};