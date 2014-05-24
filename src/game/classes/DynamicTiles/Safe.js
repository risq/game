Safe = function(tile) {
    DynamicTile.call(this, tile);

    //constants
    this.name = 'safe';
    this.tileIndex = 65;
    this.brokenTileIndex = 66;
    
    this.type = 'openable';
    this.hp = 100;


    this.aimable = true;
    this.containItems = true;
};
                        
Safe.prototype = new DynamicTile();
Safe.prototype.constructor = Safe;