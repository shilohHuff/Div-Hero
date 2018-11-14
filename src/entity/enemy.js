import {handleCollisionsEntity, willCollideXY} from '../collision-utils';
import Game from '../game';

// Enemy constructor
export default function Enemy(name, x, y) {
    
    this.name = name;
    this.x = x || 0;
    this.y = y || 0;
    this.vx = 0;
    this.vy = 0;

    this.deleteCounter = 0;

    this.node = document.createElement('div');
    this.node.className = 'enemy1';
    this.node.style.position = 'absolute';
    this.node.style.top = 0;
    this.node.style.left = 0;
    this.node.style.width = '60px';
    this.node.style.height = '60px';
    Game.world.appendChild(this.node);

    Game.enemies.push(this);
}

Enemy.prototype.applyGravity = function() {
    
    if (this.vy < 10) {
        this.vy += 1;
    }
};

Enemy.prototype.applyMove = function() {
    
    let rand = Math.random();

    if (rand < 0.02) {
        this.vx = 3;
    } else if (rand < 0.04) {
        this.vx = -3;
    }
};

Enemy.prototype.updatePosition = function() {
    
    this.node.style.left = this.x + 'px';
    this.node.style.top = this.y + 'px';
};

Enemy.prototype.applyVelocity = function() {
    
    handleCollisionsEntity(this);
    if (this.vx > 0) {
        //look right
        this.node.style.transform = 'scaleX(1)';
    } else if (this.vx < 0) {
        //look left
        this.node.style.transform = 'scaleX(-1)';
    }
    this.y += this.vy;
    this.x += this.vx;
};

Enemy.prototype.die = function(index) {
    
    index = index || Game.enemies.indexOf(this);
    this.node.parentNode.removeChild(this.node);
    Game.enemies.splice(index, 1);
};

Enemy.prototype.onFrameUpdate = function(index) {
    
    //this.applyGravity();
    //this.applyMove();
    //this.applyVelocity();
    this.updatePosition();
    if (willCollideXY(Game.ron.node, Game.ron.vx, Game.ron.vy, this.node)) {
        if (Game.ron.y + 60 <= this.y) {
            this.die(index);
        } else {
            //Death to Ron 
            //ron.die();
        }
        Game.ron.vy -= 10;  
    }
    if (this.y > 3000) {
        this.die(index);
    }
};