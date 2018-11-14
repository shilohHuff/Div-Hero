import Game from '../game';
import Animation, {getSpriteSheetData} from '../animator';
import {handleCollisionsEntity, willCollideY, willCollideWithAnything} from '../collision-utils';

export default function RemotePlayer(name, x, y, vx, vy) {
    
    this.name = name;
    this.x = x || 0;
    this.y = y || 0;
    this.h = 80;
    this.w = 40;
    this.vx = vx || 0;
    this.vy = vy || 0;

    this.facingRight = true;
    this.grounded = false;
    this.crouching = false;
    this.node = document.createElement('div');
    this.node.className = 'ron';

    this.label = document.createElement('span');
    this.label.innerText = name;
    this.label.className = 'playerLabel';
    Game.world.appendChild(this.label);

    this.model = document.createElement('div');
    this.model.className = 'playerModel';
    this.node.appendChild(this.model);
    
    this.isBig = true;
    Game.world.appendChild(this.node);
    this.animations = {};

    this.animations.running = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 36,
            offsetY: 82,
            spriteWidth: 34,
            spriteHeight: 49,
            spaceX: 1,
            spaceY: 1,
            frameCount: 4
        }),
        7,
        3
    );

    this.animations.sprinting = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 36 + (35 * 5),
            offsetY: 82,
            spriteWidth: 34,
            spriteHeight: 49,
            spaceX: 1,
            spaceY: 1,
            frameCount: 4
        }),
        7,
        3
    );

    this.animations.jumping = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 211,
            offsetY: 132,
            spriteWidth: 34,
            spriteHeight: 49,
            spaceX: 1,
            spaceY: 1,
            frameCount: 1
        }),
        7,
        3
    );

    this.animations.leaping = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 351,
            offsetY: 132,
            spriteWidth: 34,
            spriteHeight: 49,
            spaceX: 1,
            spaceY: 1,
            frameCount: 1
        }),
        7,
        3
    );

    this.animations.falling = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 246,
            offsetY: 132,
            spriteWidth: 34,
            spriteHeight: 49,
            spaceX: 1,
            spaceY: 1,
            frameCount: 1
        }),
        7,
        3
    );

    this.animations.crouching = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 421,
            offsetY: 147,
            spriteWidth: 34,
            spriteHeight: 49,
            spaceX: 1,
            spaceY: 1,
            frameCount: 1
        }),
        1,
        3
    );

    this.animations.standing = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 36,
            offsetY: 82,
            spriteWidth: 34,
            spriteHeight: 49,
            spaceX: 1,
            spaceY: 1,
            frameCount: 1
        }),
        1,
        3
    );


    this.currentAnimation = this.animations.standing;
}

RemotePlayer.prototype.makeBig = function() {
    
    this.h = 80;
    
    this.node.style.height = '80px';
    //this.y = this.y - 44;
    this.node.style.top = (this.y) + 'px';
    this.isBig = true;
};

RemotePlayer.prototype.makeSmall = function() {
    
    this.h = 36;
    this.node.style.height = '36px';
    //this.y = this.y + 44;
    this.node.style.top = (this.y) + 'px';
    this.isBig = false;
};


RemotePlayer.prototype.applyVelocity = function() {
    
    handleCollisionsEntity(this);
    this.y += this.vy;
    this.x += this.vx;
    if (this.vx > 0) {
        this.facingRight = true;
    } else if (this.vx < 0) {
        this.facingRight = false;
    }
};

RemotePlayer.prototype.grounder = function() {
    for (let i = 0; i < Game.visibleObstacles.length; i++) {
        let obstacle = Game.visibleObstacles[i];
        if (willCollideY(this, 1, obstacle)) {
            this.grounded = true;
            return;
        }
    }
    this.grounded = false;
};

RemotePlayer.prototype.animate = function() {
    

    if (this.grounded) {
        if (this.vx === 0) {
            //standing
            this.currentAnimation = this.animations.standing;
        } else {
            //sprinting
            if (Math.abs(this.vx) > 10) {
                this.currentAnimation = this.animations.sprinting;
            } else {
                //running
                this.currentAnimation = this.animations.running;
            }

            this.currentAnimation.delay = Math.max(1, 15 - Math.abs(this.vx));
        }
    } else {
        if (this.vy < 0) {
            //climbing
            if (Math.abs(this.vx) > 10) {
                this.currentAnimation = this.animations.leaping;
            } else {
                this.currentAnimation = this.animations.jumping;
            }
        } else {
            this.currentAnimation = this.animations.falling;
        }
    }

    if (this.crouching) {
        this.currentAnimation = this.animations.crouching;
        if (this.isBig) {
            this.makeSmall();
        }
    } else {
        if (!this.isBig) {
            this.makeBig();
            if (willCollideWithAnything(this, 0, 0, Game.visibleObstacles).length === 0) {
                this.crouching = false;
            } else {
                this.currentAnimation = this.animations.crouching;
                this.makeSmall();
            }
        }
    }

    this.currentAnimation.isXFlipped = !this.facingRight;

    this.currentAnimation.render();
};

RemotePlayer.prototype.updatePosition = function() {
    
    this.node.style.left = this.x + 'px';
    this.node.style.top = this.y + 'px';

    this.label.style.left = (this.x) + 'px';
    this.label.style.top = (this.y - 25) + 'px';
};

RemotePlayer.prototype.die = function() {
    
    this.label.parentNode.removeChild(this.label);
    this.node.parentNode.removeChild(this.node);
};

RemotePlayer.prototype.onFrameUpdate = function() {
    
    this.grounder();
    this.applyVelocity();
    this.animate();
    this.updatePosition();
};