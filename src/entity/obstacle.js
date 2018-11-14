import Game from '../game';


export default function Obstacle(x, y, width, height, className) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = width || 20;
    this.h = height || 20;
    this.id = null;

    this.node = document.createElement('div');
    this.node.className = className || 'block';
    this.node.style.position = 'absolute';
    this.node.style.top = this.y + 'px';
    this.node.style.left = this.x + 'px';
    this.node.style.width = this.w + 'px';
    this.node.style.height = this.h + 'px';

    Game.world.appendChild(this.node);
}

Obstacle.prototype.destroy = function(index) {
    index = index || Game.obstacles.indexOf(this);
    this.node.parentNode.removeChild(this.node);
    Game.obstacles.splice(index, 1);
};

Obstacle.prototype.updatePosition = function() {
    this.node.style.top = this.y + 'px';
    this.node.style.left = this.x + 'px';
    this.node.style.width = this.w + 'px';
    this.node.style.height = this.h + 'px';
};

Obstacle.prototype.onFrameUpdate = function() {
    this.updatePosition();
};