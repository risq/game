CameraManager = function(game) {
 
    this.game = game;

    this.shakeWorld = 0;
    this.shakeWorldMax = 10;
    this.shakeWorldTime = 0;
    this.shakeWorldTimeMax = 25;
};
 
CameraManager.prototype = {
 
    preload: function () {

    },
 
    create: function () {
	    this.game.camera.follow(this.game.playerManager.sprite);
    },
 
    update: function() {
        if (this.shakeWorldTime > 0) {
            var magnitude = ( this.shakeWorldTime / this.shakeWorldTimeMax ) * this.shakeWorldMax;
            var rand1 = this.game.rnd.integerInRange(-magnitude,magnitude);
            var rand2 = this.game.rnd.integerInRange(-magnitude,magnitude);
            this.game.world.setBounds(rand1, rand2, this.game.width + rand1, this.game.height + rand2);
            this.shakeWorldTime--;
            if (this.shakeWorldTime <= 0) {
                this.game.world.setBounds(0, 0, this.game.width,this.game.height);
                this.game.camera.setBoundsToWorld();
                this.game.camera.follow(this.game.playerManager.sprite);
            }
        }
    },

    shake: function() {
        //todo: fix camera not following after shake
        //this.shakeWorldTime = this.shakeWorldTimeMax;
    }
};