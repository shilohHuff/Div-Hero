import Victor from './../victor';
import Animation, {getSpriteSheetData} from '../animator';
import {isColliding, willCollideWithAnything, handleCollisionsEntity, willCollideY, willCollideXY} from '../collision-utils';
import Fireball from './fireball';
import Game from '../game';

export default function Ron(x, y) {
    
    this.x = x || 0;
    this.y = y || 0;
    this.h = 80;
    this.w = 40;
    this.vx = 0;
    this.vy = 0;
    this.name = 'Ron';

    this.taunt = false;

    this.positionVec = new Victor(this.x, this.y);
    this.velocityVec = new Victor(this.vx, this.vy);
    this.frictionVec = new Victor(1, 0);
    this.gravityVec = new Victor(0, 1);
    this.moveVec = new Victor(2, 0);
    this.jumpVec = new Victor(0, 18);

    this.jumped = false;
    this.facingRight = true;
    this.grounded = false;
    this.wallTouch = null;
    this.crouching = false;
    this.fired = false;
    this.node = document.createElement('div');
    this.node.className = 'ron';
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

    this.animations.wallSliding = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 36 + (35 * 9),
            offsetY: 82,
            spriteWidth: 34,
            spriteHeight: 49,
            spaceX: 1,
            spaceY: 1,
            frameCount: 1
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

    this.animations.taunt = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 36 + (35 * 6),
            offsetY: 181,
            spriteWidth: 34,
            spriteHeight: 49,
            spaceX: 1,
            spaceY: 1,
            frameCount: 1
        }),
        10,
        3
    );


    this.currentAnimation = this.animations.standing;
}

Ron.prototype.makeBig = function() {
    
    this.h = 80;
    
    this.node.style.height = '80px';
    this.y = this.y - 44;
    this.node.style.top = (this.y) + 'px';
    this.isBig = true;
};

Ron.prototype.makeSmall = function() {
    
    this.h = 36;
    this.node.style.height = '36px';
    this.y = this.y + 44;
    this.node.style.top = (this.y) + 'px';
    this.isBig = false;
};

Ron.prototype.applyFriction = function() {
    
    if (this.grounded) {
        if (Game.s && Game.frameCount % 3 > 0) {
            return;
        }
        if (this.vx > 0) {
            this.vx -= 1;
        }
        if (this.vx < 0) {
            this.vx += 1;
        }
        if (this.velocityVec.x > 0) {
            this.velocityVec.subtract(this.frictionVec);
        }
        if (this.velocityVec.x < 0) {
            this.velocityVec.add(this.frictionVec);
        }
    } else if ((this.wallTouch === 'left' && Game.a) || (this.wallTouch === 'right' && Game.d)) {
        if (this.vy > 2) {
            this.vy -= 2;
        }
    }
};

Ron.prototype.applyGravity = function() {
    
    let terminalVelocity = Game.w ? 10 : 10;
    terminalVelocity = ((this.wallTouch === 'left' && Game.a) || (this.wallTouch === 'right' && Game.d)) ? 2 : terminalVelocity;
    if (this.vy < terminalVelocity) {
        this.vy += 1;
    }
    if (this.velocityVec.y < terminalVelocity) {
        this.velocityVec.add(this.gravityVec);
    }
};

Ron.prototype.applyJump = function() {
    
    if (!Game.spacebar) {
        this.jumped = false;
    }
    if ((Game.spacebar && !this.jumped) && this.grounded) {
        this.vy = -18;
        this.velocityVec.subtract(this.jumpVec);
        this.jumped = true;
    } else if ((Game.spacebar && !this.jumped) && this.wallTouch) {
        //if((this.wallTouch === 'left' && a) || (this.wallTouch === 'right' && d)){
        this.vx = (this.wallTouch === 'left') ? 10 : -10;
        this.vy = -15;
        this.velocityVec.subtract(this.jumpVec);
        this.jumped = true;
        // }
    }
};

Ron.prototype.applyMove = function() {
    let terminalVelocity = Game.shift ? 15 : 10;
    terminalVelocity = this.crouching ? 1 : terminalVelocity;
    terminalVelocity = this.grounded ? terminalVelocity : 4;

    if (!this.grounded && Game.frameCount % 3 > 0) {
        return;
    }
    //playervelocityX = 20 * direction;
    if ((!Game.spacebar) && this.crouching) {
        return;
    }
    if (Game.a && this.vx > -terminalVelocity) {
        this.vx -= 2;
    }
    if (Game.d && this.vx < terminalVelocity) {
        this.vx += 2;
    }

    if (Game.a && this.velocityVec.x > -terminalVelocity) {
        this.velocityVec.subtract(this.moveVec);
    }
    if (Game.d && this.velocityVec.x < terminalVelocity) {
        this.velocityVec.add(this.moveVec);
    }
};

Ron.prototype.applyVelocity = function() {
    handleCollisionsEntity(this);

    this.positionVec.add(this.velocityVec);
    this.y += this.vy;
    this.x += this.vx;

    if (this.vx > 0) {
        this.facingRight = true;
    } else if (this.vx < 0) {
        this.facingRight = false;
    }

    if (this.velocityVec.x > 0) {
        //this.facingRight = true;
    } else if (this.velocityVec.x < 0) {
        //this.facingRight = false;
    }
};

Ron.prototype.grounder = function() {
    let visibleObstaclesLength = Game.visibleObstacles.length;
    for (let i = 0; i < visibleObstaclesLength; i++) {
        if (willCollideY(this, 1, Game.visibleObstacles[i])) {
            this.grounded = true;
            return;
        }
    }

    for (let i = 0; i < Game.enemies.length; i++) {
        if (willCollideY(this, 1, Game.enemies[i])) {
            this.grounded = true;
            return;
        }
    }
    this.grounded = false;
};

Ron.prototype.wallCheck = function() {
    
    let visibleObstaclesLength = Game.visibleObstacles.length;
    for (let i = 0; i < visibleObstaclesLength; i++) {
        if (willCollideXY(this, -1, 0, Game.visibleObstacles[i])) {
            this.wallTouch = 'left';
            //console.log(this.wallTouch);
            return;
        }
        if (willCollideXY(this, 1, 0, Game.visibleObstacles[i])) {
            this.wallTouch = 'right';
            //console.log(this.wallTouch);
            return;
        }
    }
    this.wallTouch = null;
};

Ron.prototype.handlePlayerCollisions = function() {
    for (let i = 0; i < Game.enemies.length; i++) {
        let enemy = Game.enemies[i];
        if (isColliding(this, enemy)) {
            let thisBottom = this.y + (this.crouching ? 80 : 36);
            let enemyBottom = enemy.y + (enemy.crouching ? 80 : 36);
            if (thisBottom < enemyBottom) {
                this.vy -= 4;
                //writePlayerData(enemy.name, enemy.x, enemy.y, 0, 0, false, true)
            } else if (thisBottom > enemyBottom) {
                this.vy += 4;
            } else if (this.x > enemy.x) {
                this.vx += 4;
            } else if (this.x < enemy.x) {
                this.vx -= 4;
            } else {
                Game.respawn();
            }
        }
    }
};

Ron.prototype.handleObstacleCollisions = function() {
    
    let visibleObstaclesLength = Game.visibleObstacles.length;
    for (let i = 0; i < visibleObstaclesLength; i++) {
        if (Game.visibleObstacles[i]) {
            if (isColliding(this, Game.visibleObstacles[i])) {
                Game.respawn();
            }
        }
    }
};

Ron.prototype.animate = function() {
    if (Game.w) {
        this.taunt = true;
        this.currentAnimation = this.animations.taunt;
        if ((Game.frameCount % 10) === 0) {
            this.currentAnimation.isXFlipped = !this.currentAnimation.isXFlipped;
        }
        this.currentAnimation.render();
        return;
    }

    if (this.grounded) {
        if (this.vx === 0) {
            //standing
            this.currentAnimation = this.animations.standing;
        } else {
            //sprinting
            if (Game.shift) {
                this.currentAnimation = this.animations.sprinting;
            } else {
                //running
                this.currentAnimation = this.animations.running;
            }

            this.currentAnimation.delay = Math.max(1, 15 - Math.abs(this.vx));
        }
    } else if ((this.wallTouch === 'left' && Game.a) || (this.wallTouch === 'right' && Game.d)) {
        this.currentAnimation = this.animations.wallSliding;
        if (this.wallTouch === 'left') {
            this.facingRight = true;
        } else {
            this.facingRight = false;
        }
    } else {
        if (this.vy < 0) {
            //climbing
            if (Math.abs(this.vx) > 11) {
                this.currentAnimation = this.animations.leaping;
            } else {
                this.currentAnimation = this.animations.jumping;
            }
        } else {
            //gliding
            if (Game.w || Game.spacebar) {
                this.currentAnimation = this.animations.falling;
            } else {
                //falling
                this.currentAnimation = this.animations.falling;
            }
        }
    }

    if (Game.s) {
        this.currentAnimation = this.animations.crouching;
        this.crouching = true;
        if (this.isBig) {
            this.makeSmall();
        }
    } else {
        if (!this.isBig) {
            this.makeBig();
            if (willCollideWithAnything(Game.ron, 0, 0, Game.visibleObstacles).length === 0) {
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

Ron.prototype.shootFireball = function() {
    if (this.fired && !Game.w) {
        this.fired = false;
    }
    if (Game.w && !this.fired) {
        this.fired = true;
        if (this.facingRight) {
            new Fireball((this.x + 45), this.y + 44, this.facingRight);
        } else {
            new Fireball((this.x - 5), this.y + 44, this.facingRight);
        }
    }
};

Ron.prototype.updatePosition = function() {
    this.node.style.left = this.x + 'px';
    this.node.style.top = this.y + 'px';
};

Ron.prototype.onFrameUpdate = function() {
    this.applyGravity();
    this.grounder();
    this.wallCheck();
    this.applyJump();
    this.applyMove();
    this.applyFriction();
    this.shootFireball();
    this.applyVelocity();
    this.handlePlayerCollisions();
    this.handleObstacleCollisions();
    this.animate();
    this.updatePosition();
};