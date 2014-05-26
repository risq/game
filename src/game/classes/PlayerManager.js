PlayerManager = function(game) {
 
    this.game = game;
    this.sprite = null;

 	this.walkAnim = null;

 	this.speed = 300;

 	this.upKey    = null;
 	this.downKey  = null;
 	this.leftKey  = null;
 	this.rightKey = null;
};
 
PlayerManager.prototype = {
 
    preload: function () {
        this.game.load.spritesheet('player', 'assets/sprites/player.png', 48, 48, 7, 1, 2);
    },
 
    create: function () {
        this.sprite = this.game.add.sprite(100, 100, 'player');
	    this.sprite.anchor.set(0.5);

	    this.game.mapManager.playerGroup.add(this.sprite);

	    this.game.physics.enable(this.sprite);
	    this.sprite.body.setSize(22, 22, 0, 0);

	    this.walkAnim = this.sprite.animations.add('walk');

	    this.upKey    = game.input.keyboard.addKey(Phaser.Keyboard.Z);
	    this.downKey  = game.input.keyboard.addKey(Phaser.Keyboard.S);
	    this.leftKey  = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    },
 
    update: function() {
        var velX   = 0,
	        velY   = 0,
	        moving = false;

	    this.sprite.body.velocity.setTo(0, 0);

	    var angleToPointer = this.game.physics.arcade.angleToPointer(this.sprite);
	    if (this.sprite.rotation != angleToPointer) {
	        this.sprite.rotation = angleToPointer;
	    }

	    if (this.leftKey.isDown)
	    {
	        velX = -this.speed;
	        moving = true;
	    }
	    else if (this.rightKey.isDown)
	    {
	        velX = this.speed;
	        moving = true;
	    }

	    if (this.upKey.isDown)
	    {
	        if (velX !== 0) {
	            velX = velX * 0.7;
	            velY = -this.speed * 0.7;
	        }
	        else {
	            velY = -this.speed;
	            moving = true;
	        }
	    }
	    else if (this.downKey.isDown)
	    {
	        if (velX !== 0) {
	            velX = velX * 0.7;
	            velY =  this.speed * 0.7;
	        }
	        else {
	            velY = this.speed;
	            moving = true;
	        }
	    }

	    this.sprite.body.velocity.set(velX, velY);
	    if (moving && !this.walkAnim.isPlaying) {
	        this.walkAnim.play(16, true);
	    }
	    else if (!moving) {
	        this.walkAnim.stop();
	    }    
    }
 
};