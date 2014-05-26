AimManager = function(game) {
 
    this.game = game;

    this.isFoundTile = false;
    this.aimedDynamicTile  = false;
    this.aimedTile = null;

    this.tileSelector = null;

    this.hoveredTile = null;
    this.hoveredTileWorldXCenter = 0;
    this.hoveredTileWorldYCenter = 0;

    this.ray = null;

    //constants
    this.useRadius = 72;

  
};
 
AimManager.prototype = {
 
    preload: function () {
        this.game.load.image('tileSelector', 'assets/sprites/tileSelector.png');
    }, 
 
    create: function () {
        this.tileSelector = this.game.add.sprite(-1, -1, 'tileSelector');
    },
 
    updateAiming: function() {
        var foundTileOnCurrentFrame = false,
            wallsBlocking = false;

        
        this.hoveredTile = this.game.mapManager.map.getTileWorldXY(game.input.worldX, game.input.worldY);
        this.hoveredTileWorldXCenter = this.hoveredTile.worldX + this.hoveredTile.centerX;
        this.hoveredTileWorldYCenter = this.hoveredTile.worldY + this.hoveredTile.centerY;

        if (this.hoveredTileCloseEnough()) 
        {
            if (this.checkWallsRayCast())
            {
                var dynamicsHits = this.game.mapManager.dynamics.getRayCastTiles(this.ray, 1, true, false);
                if (dynamicsHits.length === 0)
                {
                    //close ground tile aimed
                    this.aimedTile = this.hoveredTile;
                    foundTileOnCurrentFrame = true;
                    this.aimedDynamicTile = false;
                }
            }
            else {
                wallsBlocking = true;
            }
        }
        if (!foundTileOnCurrentFrame && ! wallsBlocking) {
            var dynamicTilesHitsList = this.getDynamicRayCast();
            if (dynamicTilesHitsList.length > 0)
            {
                var closestTileHit = this.getClosestTile(dynamicTilesHitsList);
                if (closestTileHit && closestTileHit.dynamicTile.isAimable()) {
                    //close dynamic tile aimed
                    this.aimedTile = closestTileHit;
                    foundTileOnCurrentFrame = true;
                    this.aimedDynamicTile  = true;
                }
            }
        }
        if (foundTileOnCurrentFrame) {
            this.tileSelector.visible = true;
            this.tileSelector.x = this.aimedTile.worldX;
            this.tileSelector.y = this.aimedTile.worldY;
        }
        else {
            this.tileSelector.visible = false;
        }

        this.isFoundTile = foundTileOnCurrentFrame;
    },

    click: function() {
        if (this.isFoundTile) {
            if (this.aimedDynamicTile) {
                this.game.weaponsManager.useItemOnDynamicTile(this.aimedTile);
            }
            else {
                this.game.weaponsManager.useItemOnGroundTile(this.aimedTile);
            }
        }
    },

    hoveredTileCloseEnough: function() {
        return this.game.physics.arcade.distanceToXY(this.game.playerManager.sprite, this.hoveredTileWorldXCenter, this.hoveredTileWorldYCenter) < this.useRadius;
    },

    checkWallsRayCast: function() {
        this.ray = new Phaser.Line(this.game.playerManager.sprite.x, this.game.playerManager.sprite.y, this.hoveredTileWorldXCenter, this.hoveredTileWorldYCenter);
        return (this.game.mapManager.walls.getRayCastTiles(this.ray, 1, true, false).length === 0);
    },

    getDynamicRayCast: function() {
        this.ray = new Phaser.Line(this.game.playerManager.sprite.x, this.game.playerManager.sprite.y, game.input.worldX, game.input.worldY);
        return this.game.mapManager.dynamics.getRayCastTiles(this.ray, 1, true, false);
    },

    getClosestTile: function(dynamicTilesHitsList) {
        var closest = null;
        var closestDistance = 9999;

        for (var i = 0; i < dynamicTilesHitsList.length; i++)
        {
            this.ray.setTo(this.game.playerManager.sprite.x, this.game.playerManager.sprite.y, dynamicTilesHitsList[i].worldX + dynamicTilesHitsList[i].centerX, dynamicTilesHitsList[i].worldY + dynamicTilesHitsList[i].centerY); 
            var tileDistance = this.ray.length;
            if (tileDistance < this.useRadius && tileDistance < closestDistance) {
                var walls2ndCheck = this.game.mapManager.walls.getRayCastTiles(this.ray, 1, true, false);
                if (walls2ndCheck.length === 0)
                {
                    closest = dynamicTilesHitsList[i];
                    closestDistance = tileDistance;
                }
            }
        }
        return closest;
    },
 
};