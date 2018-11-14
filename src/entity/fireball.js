import Animation, {getSpriteSheetData} from '../animator';
import Game from '../game';
import {handleCollisionsEntity, willCollideY, willCollideXY, isColliding} from '../collision-utils';

export default function Fireball(x, y, direction) {
    
    this.x = x || 0;
    this.y = y || 0;
    this.h = 2;
    this.w = 40;
    this.vx = direction ? 10 : -10;
    this.vy = 0;
    this.isSmoke = false;
    this.grounded = false;
    this.wallTouch = false;

    this.node = document.createElement('div');
    this.node.className = 'ron';
    this.model = document.createElement('div');
    this.model.className = 'playerModel';
    this.node.appendChild(this.model);
    Game.world.appendChild(this.node);
    this.node.style.height = '2px';
    this.model.style.height = '50px';
    this.animations = {};

    this.animations.fireBall = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 36 + (35 * 4),
            offsetY: 232,
            spriteWidth: 34,
            spriteHeight: 10,
            spaceX: 1,
            spaceY: 1,
            frameCount: 4
        }),
        7,
        3
    );
    

    this.animations.smoke = new Animation(
        this.model,
        getSpriteSheetData({
            sheetWidth: 491,
            sheetHeight: 282,
            offsetX: 36 + (35 * 9),
            offsetY: 232,
            spriteWidth: 34,
            spriteHeight: 10,
            spaceX: 1,
            spaceY: 1,
            frameCount: 3
        }),
        7,
        3
    );

    this.currentAnimation = this.animations.fireBall;

    Game.projectiles.push(this);
}

Fireball.prototype.applyGravity = function() {
    
    let terminalVelocity = 10;
    if (this.vy < terminalVelocity) {
        this.vy += 1;
    }
};

Fireball.prototype.applyVelocity = function() {
    
    handleCollisionsEntity(this);
    this.y += this.vy;
    this.x += this.vx;
};

Fireball.prototype.grounder = function() {
    
    let obstaclesLength = Game.obstacles.length;
    for (let i = 0; i < obstaclesLength; i++) {
        if (willCollideY(this, 1, Game.obstacles[i])) {
            this.vy = -8;
            return;
        }
    }

    for (let i = 0; i < Game.enemies.length; i++) {
        if (willCollideY(this, 1, Game.enemies[i])) {
            this.vy = -8;
            return;
        }
    }
    this.grounded = false;
};

Fireball.prototype.wallCheck = function() {
    
    let obstaclesLength = Game.obstacles.length;
    for (let i = 0; i < obstaclesLength; i++) {
        if (willCollideXY(this, -1, 0, Game.obstacles[i])) {
            this.contact();
            return;
        }
        if (willCollideXY(this, 1, 0, Game.obstacles[i])) {
            this.contact();
            return;
        }
    }
    this.wallTouch = null;
};

Fireball.prototype.handlePlayerCollisions = function() {
    
    for (let i = 0; i < Game.enemies.length; i++) {
        let enemy = Game.enemies[i];
        if (isColliding(this, enemy)) {
            this.contact();
        }
    }
};

Fireball.prototype.handleObstacleCollisions = function() {
    
    let obstaclesLength = Game.obstacles.length;
    for (let i = 0; i < obstaclesLength; i++) {
        if (Game.obstacles[i]) {
            if (isColliding(this, Game.obstacles[i])) {
                this.contact();
            }
        }
    }
};

Fireball.prototype.animate = function() {
    

    this.currentAnimation.isXFlipped = (this.vx < 0);

    this.currentAnimation.render();
};

Fireball.prototype.contact = function() {
    
    this.currentAnimation = this.animations.smoke;
    this.currentAnimation.render();
    this.vx = 0;
    this.vy = 0;
    setTimeout(this.destroy.bind(this), 0);
};

Fireball.prototype.destroy = function() {
    
    let index = Game.projectiles.indexOf(this);
    if (index >= 0 && this.node && this.node.parentNode) {
        this.node.parentNode.removeChild(this.node);
        Game.projectiles.splice(index, 1);
    }
};

Fireball.prototype.updatePosition = function() {
    
    this.node.style.left = this.x + 'px';
    this.node.style.top = this.y + 'px';
};

Fireball.prototype.onFrameUpdate = function() {
    
    this.applyGravity();
    this.grounder();
    this.wallCheck();
    this.applyVelocity();
    this.handlePlayerCollisions();
    //this.handleObstacleCollisions();
    this.animate();
    this.updatePosition();
};