import Firebase from './firebase-utils';
import Ron from './entity/ron';
import Auth from './auth';
import Obstacle from './entity/obstacle';
import Chat from './chat';

const Game = {
    world: document.querySelector('#world'),
    spawnTime: document.querySelector('#spawn-time'),
    spawnTimeContainer: document.querySelector('#spawn-time-container'),
    newObstacle: null,
    newDivX: null,
    newDivY: null,
    ron: null,
    
    enemies: [],
    obstacles: [],
    visibleObstacles: [],
    projectiles: [],
    
    frameCount: 0,
    timeToSpawn: 3,
    spawnTimer: null,
    
    isReadyToSendVelocity: true,
    isReadyToSendPosition: true,
    
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    spacebar: false,
    enter: false,

    respawn: function() {
        Game.ron.x = 100;
        Game.ron.y = 0;
        Game.spawnCountDown(3);
    },
    
    spawnCountDown: function(initialSpawnTime) {
        if (Game.spawnTimer === null || Game.spawnTimer === undefined) {
            Game.timeToSpawn = initialSpawnTime;
            Game.spawnTimer = setInterval(Game.spawnCountDown, 1000);
            Game.spawnTime.innerText = ' ' + Game.timeToSpawn;
            Game.spawnTimeContainer.style.display = 'flex';
            Game.timeToSpawn--;
        } else if (Game.timeToSpawn > -1) {
            Game.spawnTime.innerText = ' ' + Game.timeToSpawn;
            Game.spawnTimeContainer.style.display = 'flex';
    
            if (Game.timeToSpawn < 1) {
                Game.spawnTimeContainer.style.display = 'none';
            }
    
            Game.timeToSpawn--;
        } else {
            clearInterval(Game.spawnTimer);
            Game.spawnTimer = null;
        }
    },
    
    render: function() {
        if (Game.timeToSpawn === -1) {
            // player applications
            Game.ron.onFrameUpdate();
    
            let obstacleLength = Game.obstacles.length;
            for (let i = 0; i < obstacleLength; i++) {
                Game.obstacles[i].onFrameUpdate();
            }
            // enemy applications
    
            let enemyLength = Game.enemies.length;
            for (let i = 0; i < enemyLength; i++) {
                Game.enemies[i].onFrameUpdate();
            }
    
            let projectilesLength = Game.projectiles.length;
            for (let i = 0; i < projectilesLength; i++) {
                Game.projectiles[i].onFrameUpdate();
            }
    
            let windowHalfHeight = (window.innerHeight >> 1);
            let windowHalfWidth = (window.innerWidth >> 1);
            let ronBoundingBox = Game.ron.node.getBoundingClientRect();
            window.scrollBy((ronBoundingBox.left - windowHalfWidth), ronBoundingBox.top - windowHalfHeight);
        }
        Game.frameCount++;
        requestAnimationFrame(Game.render);
    },
    
    init: function() {
        Firebase.load();
        Auth.bypass();

        //Ronstructed
        Game.ron = new Ron(100, 0);
    
        Game.ron.name = Auth.result.displayName;
        
        let baseFloor = new Obstacle(0, 720, 1920, 40, 'ground');
        Game.obstacles.push(baseFloor);
    
        window.onunload = function() {
            Firebase.removePlayerFromRemote();
        };
        
        Firebase.loadPlayers();
        Game.spawnCountDown(3);
        Firebase.periodicPlayerCleanup();
        Game.sync();
        Game.visibleCheck();
        requestAnimationFrame(Game.render);
        Chat.init();
    },
    
    visibleCheck: function() {
        let height = window.innerHeight || document.documentElement.clientHeight;
        let width = window.innerWidth || document.documentElement.clientWidth;
        let top  = window.pageYOffset || document.documentElement.scrollTop;
        let left = window.pageXOffset || document.documentElement.scrollLeft;
        let obstacleLength = Game.obstacles.length;
        for (let i = 0; i < obstacleLength; i++) {
            let index = Game.visibleObstacles.indexOf(Game.obstacles[i]);
            if (Game.isElementInViewport(Game.obstacles[i], height, width, top, left)) {
                if (index === -1) {
                    Game.visibleObstacles.push(Game.obstacles[i]);
                }
            } else if (index > -1) {
                Game.visibleObstacles.splice(index, 1);
            }
        }
        setTimeout(Game.visibleCheck, 0);
    },
    
    isElementInViewport: function(el, height, width, windowTop, windowLeft) {
        return (
            (el.y + el.h) >= 0 && 
            (el.x + el.w) >= 0 && 
            el.y <= (height + windowTop) &&
            el.x <= (width + windowLeft)
        );
    },
    
    sync: function() {
        Firebase.writePlayerData(Game.ron.name, Game.ron.x, Game.ron.y, Game.ron.vx, Game.ron.vy, Game.ron.crouching);
        setTimeout(Game.sync, 0);
    }
};

export default Game;