
import './styles/main.css';
import Chat from './chat';
import Game from './game';
import Obstacle from './entity/obstacle';
import {isColliding} from './collision-utils';
import Firebase from './firebase-utils';

document.body.onkeydown = function(evt) {
    if (!Chat.typing) {
        switch (evt.keyCode) {
            case 87:
                // W
                Game.w = true;
                break;
            case 65:
                // A
                Game.a = true;
                break;
            case 83:
                // S
                Game.s = true;
                break;
            case 68:
                // D
                Game.d = true;
                break;
            case 32:
                // SPACEBAR
                Game.spacebar = true;
                break;
            case 16:
                Game.shift = true;
                break;
            case 13:
                Game.enter = true;
                break;
            default:
        }
    }
};

document.body.onkeyup = function(evt) {
    
    if (!Chat.typing) {
        switch (evt.keyCode) {
            case 87:
                // W
                Game.w = false;
                break;
            case 65:
                // A
                Game.a = false;
                break;
            case 83:
                // S
                Game.s = false;
                break;
            case 68:
                // D
                Game.d = false;
                break;
            case 32:
                // SPACEBAR
                Game.spacebar = false;
                break;
            case 16:
                Game.shift = false;
                break;
            case 13:
                Game.enter = false;
                break;
            default:
        }
    }
};

document.body.onmousedown = function(evt) {
    let top  = window.pageYOffset || document.documentElement.scrollTop;
    let left = window.pageXOffset || document.documentElement.scrollLeft;

    Game.newDivX = evt.clientX + left;
    Game.newDivX = Math.floor(Game.newDivX / 40) * 40;
    Game.newDivY = evt.clientY + top;
    Game.newDivY = Math.floor(Game.newDivY / 40) * 40;
    
    Game.newObstacle = new Obstacle(Game.newDivX, Game.newDivY, 1, 1, Game.shift ? 'ground' : 'block');
    Game.obstacles.push(Game.newObstacle);
};

document.body.onmousemove = function(evt) {
    if (Game.newObstacle) {
        let top  = window.pageYOffset || document.documentElement.scrollTop;
        let left = window.pageXOffset || document.documentElement.scrollLeft;

        let tempX = evt.clientX + left - Game.newDivX;
        tempX = Math.ceil(tempX / 40) * 40;
        Game.newObstacle.w = tempX;
        let tempY = evt.clientY + top - Game.newDivY;
        tempY = Math.ceil(tempY / 40) * 40;
        Game.newObstacle.h = tempY;
    }
};

document.body.onmouseup = function(evt) {
    if (isColliding(Game.newObstacle.node, Game.ron.node) || Game.newObstacle.h < 40 || Game.newObstacle.w < 40) {
        Game.newObstacle.node.parentNode.removeChild(Game.newObstacle.node);
        Game.obstacles.splice(Game.obstacles.indexOf(Game.newObstacle), 1);
    } else {
        Game.newObstacle.id = Firebase.writeObstacleData(Game.newObstacle.x, Game.newObstacle.y, Game.newObstacle.w, Game.newObstacle.h, Game.newObstacle.node.className);
    }
    Game.newObstacle = null;
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#respawn-btn').addEventListener('click', function() {
        Game.respawn();
    }, {
        capture: true
    });

    Game.init();
});
