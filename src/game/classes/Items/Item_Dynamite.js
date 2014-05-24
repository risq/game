Item_Dynamite = function() {
    Item.call(this);

    //constants
    this.name = 'dynamite';
    this.tileIndex = 0;

};
                        
Item_Dynamite.prototype = new Item();
Item_Dynamite.prototype.constructor = Item_Dynamite;