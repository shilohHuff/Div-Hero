/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _firebaseUtils = __webpack_require__(1);

var _firebaseUtils2 = _interopRequireDefault(_firebaseUtils);

var _ron = __webpack_require__(12);

var _ron2 = _interopRequireDefault(_ron);

var _auth = __webpack_require__(15);

var _auth2 = _interopRequireDefault(_auth);

var _obstacle = __webpack_require__(5);

var _obstacle2 = _interopRequireDefault(_obstacle);

var _chat = __webpack_require__(3);

var _chat2 = _interopRequireDefault(_chat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Game = {
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

    respawn: function respawn() {
        Game.ron.x = 100;
        Game.ron.y = 0;
        Game.spawnCountDown(3);
    },

    spawnCountDown: function spawnCountDown(initialSpawnTime) {
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

    render: function render() {
        if (Game.timeToSpawn === -1) {
            // player applications
            Game.ron.onFrameUpdate();

            var obstacleLength = Game.obstacles.length;
            for (var i = 0; i < obstacleLength; i++) {
                Game.obstacles[i].onFrameUpdate();
            }
            // enemy applications

            var enemyLength = Game.enemies.length;
            for (var _i = 0; _i < enemyLength; _i++) {
                Game.enemies[_i].onFrameUpdate();
            }

            var projectilesLength = Game.projectiles.length;
            for (var _i2 = 0; _i2 < projectilesLength; _i2++) {
                Game.projectiles[_i2].onFrameUpdate();
            }

            var windowHalfHeight = window.innerHeight >> 1;
            var windowHalfWidth = window.innerWidth >> 1;
            var ronBoundingBox = Game.ron.node.getBoundingClientRect();
            window.scrollBy(ronBoundingBox.left - windowHalfWidth, ronBoundingBox.top - windowHalfHeight);
        }
        Game.frameCount++;
        requestAnimationFrame(Game.render);
    },

    init: function init() {
        _firebaseUtils2.default.load();
        _auth2.default.bypass();

        //Ronstructed
        Game.ron = new _ron2.default(100, 0);

        Game.ron.name = _auth2.default.result.displayName;

        var baseFloor = new _obstacle2.default(0, 720, 1920, 40, 'ground');
        Game.obstacles.push(baseFloor);

        window.onunload = function () {
            _firebaseUtils2.default.removePlayerFromRemote();
        };

        _firebaseUtils2.default.loadPlayers();
        Game.spawnCountDown(3);
        _firebaseUtils2.default.periodicPlayerCleanup();
        Game.sync();
        Game.visibleCheck();
        requestAnimationFrame(Game.render);
        _chat2.default.init();
    },

    visibleCheck: function visibleCheck() {
        var height = window.innerHeight || document.documentElement.clientHeight;
        var width = window.innerWidth || document.documentElement.clientWidth;
        var top = window.pageYOffset || document.documentElement.scrollTop;
        var left = window.pageXOffset || document.documentElement.scrollLeft;
        var obstacleLength = Game.obstacles.length;
        for (var i = 0; i < obstacleLength; i++) {
            var index = Game.visibleObstacles.indexOf(Game.obstacles[i]);
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

    isElementInViewport: function isElementInViewport(el, height, width, windowTop, windowLeft) {
        return el.y + el.h >= 0 && el.x + el.w >= 0 && el.y <= height + windowTop && el.x <= width + windowLeft;
    },

    sync: function sync() {
        _firebaseUtils2.default.writePlayerData(Game.ron.name, Game.ron.x, Game.ron.y, Game.ron.vx, Game.ron.vy, Game.ron.crouching);
        setTimeout(Game.sync, 0);
    }
};

exports.default = Game;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _game = __webpack_require__(0);

var _game2 = _interopRequireDefault(_game);

var _remotePlayer = __webpack_require__(16);

var _remotePlayer2 = _interopRequireDefault(_remotePlayer);

var _obstacle = __webpack_require__(5);

var _obstacle2 = _interopRequireDefault(_obstacle);

var _chat = __webpack_require__(3);

var _chat2 = _interopRequireDefault(_chat);

var _Settings = __webpack_require__(17);

var _Settings2 = _interopRequireDefault(_Settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
    apiKey: 'AIzaSyBk1wB1Owc9ZGpOfK413ODSsr7mKjoUoeI',
    authDomain: 'div-hero.firebaseapp.com',
    databaseURL: 'https://div-hero.firebaseio.com',
    projectId: 'div-hero',
    storageBucket: '',
    messagingSenderId: '594674907779'
};

var Firebase = {
    _internal: null,

    load: function load() {
        this._internal = window.firebase.initializeApp(config);
        var that = this;

        // change handlers
        this._internal.database().ref('obstacles').on('value', function (snapshot) {
            that.processRemoteObstacles(snapshot);
        });

        this._internal.database().ref('/chat').on('value', function (snapshot) {
            _chat2.default.log = [];
            if (snapshot.val()) {
                for (var msg in snapshot.val()) {
                    var mTime = new Date(snapshot.val()[msg].time);
                    var Min10 = 1000 * 60 * 10;

                    //If Older Than 10 min remove
                    if (mTime.getTime() < new Date().getTime() - Min10) {
                        that._internal.database().ref('chat/' + msg).remove();
                        continue;
                    }

                    _chat2.default.log.push(snapshot.val()[msg]);
                }
                var nMsg = _chat2.default.log.length;
                _chat2.default.log = _chat2.default.log.slice(nMsg - 11, nMsg);
            }
        });

        this._internal.database().ref('/settings').on('value', function (snapshot) {
            for (var key in snapshot.val()) {
                var setting = snapshot.val()[key];
                _Settings2.default[setting.name] = setting.value;
            }

            _Settings2.default.loadLocalSettings();
        });
    },

    loadPlayers: function loadPlayers() {
        var playersRef = this._internal.database().ref('players');
        var that = this;
        playersRef.on('value', function (snapshot) {
            that.processRemotePlayers(snapshot);

            _game2.default.enemies.forEach(function (enemy, index) {
                var stillExists = false;
                for (var key in snapshot.val()) {
                    var obj = snapshot.val()[key];
                    if (enemy.name === obj.name) {
                        stillExists = true;
                        enemy.deleteCounter = 0;
                    }
                }

                if (!stillExists) {
                    enemy.deleteCounter++;
                    if (enemy.deleteCounter > 50) {
                        enemy.die();
                        _game2.default.enemies.splice(index, 1);
                    }
                }
            });
        });
    },

    processRemotePlayers: function processRemotePlayers(snapshot) {
        if (snapshot.val()) {
            var snapShotKeys = Object.keys(snapshot.val());
            var numberOfKeys = snapShotKeys.length;
            var index = 0;
            var process = function process() {
                if (index < numberOfKeys) {
                    var key = snapShotKeys[index];
                    if (snapshot.val().hasOwnProperty(key)) {
                        var obj = snapshot.val()[key];

                        if (obj.name === _game2.default.ron.name) {
                            if (obj.isDead) {
                                _game2.default.respawn();
                            }
                        }
                        var exists = false;
                        var numberOfEnemies = _game2.default.enemies.length;
                        for (var i = 0; i < numberOfEnemies; i++) {
                            if (obj.name === _game2.default.enemies[i].name && obj.name !== _game2.default.ron.name) {
                                exists = true;
                                _game2.default.enemies[i].x = obj.x;
                                _game2.default.enemies[i].y = obj.y;
                                _game2.default.enemies[i].vx = obj.vx;
                                _game2.default.enemies[i].vy = obj.vy;
                                _game2.default.enemies[i].crouching = obj.crouching;
                            }
                        }

                        if (!exists && obj.name !== _game2.default.ron.name) {
                            _game2.default.enemies.push(new _remotePlayer2.default(obj.name, obj.x, obj.y, obj.vx, obj.vy));
                        }
                    }
                    index++;
                    setTimeout(process, 0);
                }
            };
            process();
        }
    },

    cleanUpRemotePlayers: function cleanUpRemotePlayers() {
        this._internal.database().ref('players').remove();
    },

    periodicPlayerCleanup: function periodicPlayerCleanup() {
        this.cleanUpRemotePlayers();
        var that = this;
        setTimeout(function () {
            that.periodicPlayerCleanup();
        }, 10000);
    },

    writePlayerData: function writePlayerData(name, x, y, vx, vy, crouching, isDead) {
        var post = {};
        post.name = name;
        if (x != null) {
            post.x = x;
        }
        if (y != null) {
            post.y = y;
        }
        if (vx != null) {
            post.vx = vx;
        }
        if (vy != null) {
            post.vy = vy;
        }
        if (crouching != null) {
            post.crouching = crouching;
        }
        if (isDead !== null && isDead !== undefined) {
            post.isDead = isDead;
        }
        this._internal.database().ref('players/' + name).update(post);
    },

    processRemoteObstacles: function processRemoteObstacles(snapshot) {
        var snapShotKeys = Object.keys(snapshot.val());
        var numberOfKeys = snapShotKeys.length;
        var index = 0;
        var process = function process() {
            if (index < numberOfKeys) {
                var key = snapShotKeys[index];
                if (snapshot.val().hasOwnProperty(key)) {
                    var remoteObstacle = snapshot.val()[key];
                    var alreadyExists = false;

                    var obstacleLength = _game2.default.obstacles.length;

                    for (var i = 0; i < obstacleLength; i++) {
                        if (key === _game2.default.obstacles[i].id) {
                            alreadyExists = true;
                            //console.log(' done');
                        }
                    }

                    if (!alreadyExists) {
                        var newObstacle = new _obstacle2.default(remoteObstacle.x, remoteObstacle.y, remoteObstacle.w, remoteObstacle.h, remoteObstacle.className);
                        newObstacle.id = key;
                        _game2.default.obstacles.push(newObstacle);
                        //console.log(' done pushing');
                    }
                }
                index++;
                setTimeout(process, 0);
            }
        };
        process();
    },

    removePlayerFromRemote: function removePlayerFromRemote() {
        this._internal.database().ref('players/' + _game2.default.ron.name).remove();
    },

    checkLocalObstaclesForRemoteExistance: function checkLocalObstaclesForRemoteExistance(snapshot) {
        var obstacleLength = _game2.default.obstacles.length;
        var index = 0;
        var process = function process() {
            if (index < obstacleLength) {
                var stillExists = false;
                for (var key in snapshot.val()) {
                    if (snapshot.val().hasOwnProperty(key)) {
                        if (_game2.default.obstacles[index].id === key) {
                            stillExists = true;
                            break;
                        }
                    }
                }

                if (!stillExists) {
                    //obstacle.destroy();
                }
                index++;
                setTimeout(process, 0);
            }
        };
        process();
    },

    writeObstacleData: function writeObstacleData(x, y, w, h, className) {
        return this._internal.database().ref('obstacles').push({
            x: x,
            y: y,
            w: w,
            h: h,
            className: className
        });
    },

    sendChatMessage: function sendChatMessage(message) {
        this._internal.database().ref('/chat').push(message);
    },

    setSetting: function setSetting(name, val) {
        var newSetting = {};
        var s = { name: name, value: val };
        newSetting[name] = s;
        this._internal.database().ref('/settings').update(newSetting);
    }
};

exports.default = Firebase;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isColliding = isColliding;
exports.willCollideY = willCollideY;
exports.willCollideXY = willCollideXY;
exports.willCollideWithAnything = willCollideWithAnything;
exports.handleCollisionsEntity = handleCollisionsEntity;

var _game = __webpack_require__(0);

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isColliding(entity1, entity2) {
    var x1 = entity1.x;
    var y1 = entity1.y;
    var w1 = entity1.w;
    var h1 = entity1.h;
    var x2 = entity2.x;
    var y2 = entity2.y;
    var w2 = entity2.w;
    var h2 = entity2.h;
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2;
}

function willCollideY(entity1, div1VY, entity2) {
    var signOfVelocity = div1VY ? div1VY < 0 ? -1 : 1 : 0;
    var x1 = entity1.x;
    var moveUpForNegativeMovement = 0;
    if (signOfVelocity === -1) {
        moveUpForNegativeMovement = div1VY;
    }
    var y1 = entity1.y + moveUpForNegativeMovement;
    var w1 = entity1.w;
    var h1 = entity1.h + div1VY * signOfVelocity;
    var x2 = entity2.x;
    var y2 = entity2.y;
    var w2 = entity2.w;
    var h2 = entity2.h;
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2;
}

function willCollideXY(entity1, entity1VX, entity1VY, entity2) {
    var signOfVelocityX = entity1VX ? entity1VX < 0 ? -1 : 1 : 0;
    var signOfVelocityY = entity1VY ? entity1VY < 0 ? -1 : 1 : 0;
    var moveUpForNegativeMovementX = 0;
    if (signOfVelocityX === -1) {
        moveUpForNegativeMovementX = entity1VX;
    }
    var moveUpForNegativeMovementY = 0;
    if (signOfVelocityY === -1) {
        moveUpForNegativeMovementY = entity1VY;
    }

    var x1 = entity1.x + moveUpForNegativeMovementX;
    var y1 = entity1.y + moveUpForNegativeMovementY;
    var w1 = entity1.w + entity1VX * signOfVelocityX;
    var h1 = entity1.h + entity1VY * signOfVelocityY;
    var x2 = entity2.x;
    var y2 = entity2.y;
    var w2 = entity2.w;
    var h2 = entity2.h;

    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2;
}

function willCollideWithAnything(entity, div1VX, div1VY, entitiesToTest) {
    var entities = entitiesToTest; //enemies.concat(obstacles, ron);
    var collidedEntities = [];
    var numberOfEntities = entities.length;
    for (var i = 0; i < numberOfEntities; i++) {
        if (entities[i] !== entity) {
            if (willCollideXY(entity, div1VX, div1VY, entities[i])) {
                collidedEntities.push(entities[i]);
            }
        }
    }
    return collidedEntities;
}

function handleCollisionsEntity(entity) {
    var div1VX = entity.vx;
    var div1VY = entity.vy;

    var signOfVelocityX = div1VX ? div1VX < 0 ? -1 : 1 : 0;
    var signOfVelocityY = div1VY ? div1VY < 0 ? -1 : 1 : 0;
    var maxMoveX = 0;
    var moveXX = 0;
    var moveXY = 0;

    var collidedEntities = willCollideWithAnything(entity, div1VX, div1VY, _game2.default.visibleObstacles);

    if (collidedEntities.length > 0) {
        for (var x = div1VX; x !== 0; x -= signOfVelocityX) {
            var y = div1VY;
            do {
                if (willCollideWithAnything(entity, x, y, collidedEntities).length === 0) {
                    var moved = Math.abs(x) + Math.abs(y);
                    if (moved > maxMoveX) {
                        maxMoveX = moved;
                        moveXX = x;
                        moveXY = y;
                    }
                }
                y -= signOfVelocityY;
            } while (y !== -signOfVelocityY);
        }

        var maxMoveY = 0;
        var moveYX = 0;
        var moveYY = 0;
        for (var _y = div1VY; _y !== 0; _y -= signOfVelocityY) {
            var _x = div1VX;
            do {
                if (willCollideWithAnything(entity, _x, _y, collidedEntities).length === 0) {
                    var _moved = Math.abs(_x) + Math.abs(_y);
                    if (_moved > maxMoveY) {
                        maxMoveY = _moved;
                        moveYX = _x;
                        moveYY = _y;
                    }
                }
                _x -= signOfVelocityX;
            } while (_x !== -signOfVelocityX);
        }

        if (maxMoveX > maxMoveY) {
            entity.vx = moveXX;
            entity.vy = moveXY;
        } else {
            entity.vx = moveYX;
            entity.vy = moveYY;
        }
    }
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _firebaseUtils = __webpack_require__(1);

var _firebaseUtils2 = _interopRequireDefault(_firebaseUtils);

var _game = __webpack_require__(0);

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*  Message Type
    Message = {
        text: "Hello World",
        from: "Cayle", 
        time: new Date()
    }
*/

var Chat = {};

Chat.init = function () {
    Chat.log = [];
    Chat.backgroundColor = 'rgba(100, 100, 100, .3)';
    Chat.textColor = 'white';
    Chat.typing = false;
    Chat.message = '';
    //Initialize the Dom Element
    Chat.element = _game2.default.world.appendChild(document.createElement('div'));
    Chat.element.id = 'chat';
    Chat.element.class = 'chat';
    Chat.element.style.backgroundColor = Chat.backgroundColor;
    Chat.element.style.color = Chat.textColor;
    Chat.element.style.marginLeft = '70%';
    Chat.element.style.width = '30%';
    Chat.element.style.position = 'fixed';
    Chat.element.style.position.marginTop = '10px';
    Chat.element.style.zIndex = 2;

    window.setInterval(Chat.update, 1000);

    //Initialize Event Listeners
    document.onkeyup = function (e) {
        var key = e.key;

        if (key === 'Enter') {
            Chat.typing = !Chat.typing;
            if (Chat.typing === true) {
                Chat.input.innerText = '';
            } else {
                Chat.send(new Chat.Message(Chat.input.innerText, new Date().toString(), _game2.default.ron.name));
            }
        } else {
            if (Chat.typing === true && Chat.keyAllowed(key)) {
                Chat.message += e.key;
            } else if (Chat.typing && key === 'Backspace') {
                Chat.message = Chat.message.substring(0, Chat.message.length - 2);
            }
        }

        Chat.update();
    };
};

Chat.keyAllowed = function (key) {
    var bl = ['Shift', 'Backspace', 'Control', 'Alt', 'Tab', 'Meta'];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = bl[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            if (s === key) {
                return false;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return true;
};
//Render Chat Log as a <p> in the top left corner
Chat.render = function () {
    //Remove all Children
    while (Chat.element.hasChildNodes()) {
        Chat.element.removeChild(Chat.element.lastChild);
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Chat.log[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var msg = _step2.value;

            var el = document.createElement('p');
            el.className = 'message';
            var date = new Date(msg.time).getHours() + ':' + new Date(msg.time).getMinutes();
            el.innerText = '[' + date + '] ' + msg.from + ': ' + msg.text;
            Chat.element.appendChild(el);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    Chat.input = document.createElement('p');
    Chat.input.id = 'chatInput';
    Chat.input.style.minHeight = '1em';
    Chat.input.style.backgroundColor = 'rgba(100, 100, 100, .5)';

    var notTyping = !Chat.typing;

    if (notTyping) {
        Chat.input.innerText = 'Press Enter To Type';
    } else {
        Chat.input.innerText = Chat.message;
    }

    Chat.element.appendChild(Chat.input);
};

//Pull updates
Chat.update = function () {
    Chat.render();
};

//Send new message
Chat.send = function (message) {
    if (message.text === '') {
        return;
    }

    _firebaseUtils2.default.sendChatMesssage(message);

    Chat.message = '';
};

//Message Type
Chat.Message = function (text, time, name) {
    this.text = text;
    this.time = time;
    this.from = name;
};

exports.default = Chat;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpriteSheetData = getSpriteSheetData;
exports.default = Animation;

// takes data for a sprite sheet and returns an array of objects with the
// metadata representing individual sprites, equal to the frameCount.
function getSpriteSheetData(config) {
  //sheetWidth, sheetHeight, offsetX, offsetY, spriteWidth, spriteHeight, spaceX, spaceY, frameCount

  var slices = [];

  // find out how many sprites fit in the remaining space on the sheet.
  var spritesPerRow = Math.floor((config.sheetHeight - config.offsetY) / (config.spriteHeight + config.spaceY));

  // slice and dice the sheet with the power of math
  for (var i = 0; i < config.frameCount; i++) {
    // if we go out-of-bounds on the sheet, go to the next row
    var spriteSheetCol = Math.floor(i % spritesPerRow);
    var spriteSheetRow = Math.floor(i / spritesPerRow);

    var x = config.offsetX + spriteSheetCol * (config.spriteWidth + config.spaceX);
    var y = config.offsetY + spriteSheetRow * (config.spriteHeight + config.spaceY);
    var w = config.spriteWidth;
    var h = config.spriteHeight;

    slices.push({
      x: x,
      y: y,
      w: w,
      h: h
    });
  }

  return slices;
}

function Animation(node, sprites, delay, scaleFactor) {
  this.node = node;
  this.sprites = sprites;
  this.delay = delay;
  this.scaleFactor = scaleFactor;

  this.framesSince = 0;
  this.currentFrame = 0;

  this.isXFlipped = false;
}

Animation.prototype.render = function () {
  if (this.framesSince > this.delay * (this.sprites.length - 1)) {
    this.framesSince = 0;
  }

  this.currentFrame = Math.floor(this.framesSince / this.delay);

  this.node.style.backgroundPosition = -this.sprites[this.currentFrame].x * this.scaleFactor + 'px ' + -this.sprites[this.currentFrame].y * this.scaleFactor + 'px';

  if (this.isXFlipped) {
    this.node.style.transform = 'scaleX(-1)';
  } else {
    this.node.style.transform = 'scaleX(1)';
  }

  this.framesSince++;
};

// mario.animations.running = new Animation(
//   document.getElementById('test'), 
//   getSpriteSheetData({
//     sheetWidth: 491, 
//     sheetHeight: 282, 
//     offsetX: 36, 
//     offsetY: 82, 
//     spriteWidth: 34, 
//     spriteHeight: 49, 
//     spaceX: 1, 
//     spaceY: 1, 
//     frameCount: 10
//   }), 
//   Math.PI
// );

// mario.animations.running.isXFlipped = true;


// // some time later...
// mario.animations.running.render();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Obstacle;

var _game = __webpack_require__(0);

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Obstacle(x, y, width, height, className) {
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

    _game2.default.world.appendChild(this.node);
}

Obstacle.prototype.destroy = function (index) {
    index = index || _game2.default.obstacles.indexOf(this);
    this.node.parentNode.removeChild(this.node);
    _game2.default.obstacles.splice(index, 1);
};

Obstacle.prototype.updatePosition = function () {
    this.node.style.top = this.y + 'px';
    this.node.style.left = this.x + 'px';
    this.node.style.width = this.w + 'px';
    this.node.style.height = this.h + 'px';
};

Obstacle.prototype.onFrameUpdate = function () {
    this.updatePosition();
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(7);

var _chat = __webpack_require__(3);

var _chat2 = _interopRequireDefault(_chat);

var _game = __webpack_require__(0);

var _game2 = _interopRequireDefault(_game);

var _obstacle = __webpack_require__(5);

var _obstacle2 = _interopRequireDefault(_obstacle);

var _collisionUtils = __webpack_require__(2);

var _firebaseUtils = __webpack_require__(1);

var _firebaseUtils2 = _interopRequireDefault(_firebaseUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.body.onkeydown = function (evt) {
    if (!_chat2.default.typing) {
        switch (evt.keyCode) {
            case 87:
                // W
                _game2.default.w = true;
                break;
            case 65:
                // A
                _game2.default.a = true;
                break;
            case 83:
                // S
                _game2.default.s = true;
                break;
            case 68:
                // D
                _game2.default.d = true;
                break;
            case 32:
                // SPACEBAR
                _game2.default.spacebar = true;
                break;
            case 16:
                _game2.default.shift = true;
                break;
            case 13:
                _game2.default.enter = true;
                break;
            default:
        }
    }
};

document.body.onkeyup = function (evt) {

    if (!_chat2.default.typing) {
        switch (evt.keyCode) {
            case 87:
                // W
                _game2.default.w = false;
                break;
            case 65:
                // A
                _game2.default.a = false;
                break;
            case 83:
                // S
                _game2.default.s = false;
                break;
            case 68:
                // D
                _game2.default.d = false;
                break;
            case 32:
                // SPACEBAR
                _game2.default.spacebar = false;
                break;
            case 16:
                _game2.default.shift = false;
                break;
            case 13:
                _game2.default.enter = false;
                break;
            default:
        }
    }
};

document.body.onmousedown = function (evt) {
    var top = window.pageYOffset || document.documentElement.scrollTop;
    var left = window.pageXOffset || document.documentElement.scrollLeft;

    _game2.default.newDivX = evt.clientX + left;
    _game2.default.newDivX = Math.floor(_game2.default.newDivX / 40) * 40;
    _game2.default.newDivY = evt.clientY + top;
    _game2.default.newDivY = Math.floor(_game2.default.newDivY / 40) * 40;

    _game2.default.newObstacle = new _obstacle2.default(_game2.default.newDivX, _game2.default.newDivY, 1, 1, _game2.default.shift ? 'ground' : 'block');
    _game2.default.obstacles.push(_game2.default.newObstacle);
};

document.body.onmousemove = function (evt) {
    if (_game2.default.newObstacle) {
        var top = window.pageYOffset || document.documentElement.scrollTop;
        var left = window.pageXOffset || document.documentElement.scrollLeft;

        var tempX = evt.clientX + left - _game2.default.newDivX;
        tempX = Math.ceil(tempX / 40) * 40;
        _game2.default.newObstacle.w = tempX;
        var tempY = evt.clientY + top - _game2.default.newDivY;
        tempY = Math.ceil(tempY / 40) * 40;
        _game2.default.newObstacle.h = tempY;
    }
};

document.body.onmouseup = function (evt) {
    if ((0, _collisionUtils.isColliding)(_game2.default.newObstacle.node, _game2.default.ron.node) || _game2.default.newObstacle.h < 40 || _game2.default.newObstacle.w < 40) {
        _game2.default.newObstacle.node.parentNode.removeChild(_game2.default.newObstacle.node);
        _game2.default.obstacles.splice(_game2.default.obstacles.indexOf(_game2.default.newObstacle), 1);
    } else {
        _game2.default.newObstacle.id = _firebaseUtils2.default.writeObstacleData(_game2.default.newObstacle.x, _game2.default.newObstacle.y, _game2.default.newObstacle.w, _game2.default.newObstacle.h, _game2.default.newObstacle.node.className);
    }
    _game2.default.newObstacle = null;
};

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#respawn-btn').addEventListener('click', function () {
        _game2.default.respawn();
    }, {
        capture: true
    });

    _game2.default.init();
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(8);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(10)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js!./main.css", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js!./main.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)(false);
// imports


// module
exports.push([module.i, "#world {\n    overflow: hidden;\n    height: 10000px;\n    min-width: 10000px;\n    margin: 0px;\n    z-index: 2;\n    background-attachment: fixed;\n    background-color: lightblue;\n    padding: 0;\n    border-collapse: collapse;\n}\n\n#auth {\n    z-index: 4;\n    position: fixed;\n    width: 50%;\n    margin-left: 25%;\n    margin-top: 25%;\n}\n\n#chat {\n    font-family: 'Dosis', sans-serif;\n    background-color: rgba(100, 100, 100, .3);\n    color: white;\n    margin-left: 69%;\n    margin-right: 1%;\n    width: 30%;\n    position: fixed;\n    z-index: 2;\n    border-radius: 5px;\n    margin-top: 5px;\n}\n\n#chat p {\n    -webkit-margin-after: 0 !important;\n}\n\n#chatInput {\n    border-bottom-left-radius: 5px;\n    border-bottom-right-radius: 5px;\n}\n\nhtml,\nbody {\n    padding: 0;\n    margin: 0;\n    overflow: hidden;\n    height: 10000px;\n    min-width: 10000px;\n}\n\n.ui-container {\n    display: flex;\n    flex-direction: row;\n    align-items: baseline;\n    justify-content: space-around;\n    position: fixed;\n    top: 0;\n    left: 0;\n    padding-left: 10px;\n}\n\n#instructables {\n    Z-index: 1;\n    color: gray;\n    font-size: 0.5em;\n    font-family: San Fransico, Helvetica Neue, Helvetica, Roboto, Segoe UI, Arial, sans-serif;\n}\n\n#spawn-time-container {\n    display: none;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    position: fixed;\n    top: 0;\n    left: 0;\n    height: 100%;\n    width: 100%;\n    background-color: rgba(100, 100, 100, .5);\n    font-family: Courier, monospace;\n    font-size: 2em;\n    font-weight: bolder;\n    color: white;\n}\n\n#spawn-time {\n    font-size: 10em;\n}\n\nelement {\n    border-collapse: collapse;\n    padding: 0;\n    margin: 0;\n}\n\n.block {\n    height: 40px;\n    width: 1920px;\n    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAABCFBMVEWQSyqRTCqPSyqPSykkHBJNKBYfGRCBRCZEJhVDLBsoHRJIJhWiVzFCJBWsXTRRKhd/RijLajs4IhRhMhzWgEvgdUD/////mlr/lVfzjFGqWDHZcT7fdUP+lliKSCkhGA/w7+5vPiRZLhm2rKjkdD/Iu7VhRTdaOy5qZ2QbDQDCZTgNAwB7cmkoGQiyXDNzTDpPJQ5XPzREIAvMdUvAuLMwGAhdUUtgX16LZVRVMyRrPyq6raZ/bGJAHgqHeHHd2tijhHeNWkH879rkpHMtKByngljFflXkiE9+Sy3/5ar/snCqnnL9zo/85L3Mcj//8NXFkXb/16uofGLok19wW0/71pvolWU9OCji8colAAADVUlEQVRoge2aC1faMBTH0wfi6gMVqM5NKChzQ3QMtjnmA+fccM7pNvb4/t9kadIXaS69LcRzdk7/0oLJvfmdpEno/xRitypbWP2wXTnf0Qk39zY5ub57jNXtN8dxhhcaOuHm9z0ZNLVVrCrjn53Or2YDndAfjUmhVNQITrX1vWL9cKNQxibo20+qDIBUbb26tmC6AKQo4GkOmCqSA3LAPABqV/JDAPIhygHzAhD6HagWwEQL/luASwiP+QHS3lXo63vpANp2tUq6vUYRq6N2gwKWmugErd0mr1+dLWHVXDRN09pYQSd0X7aITQmLWFkmI2DDz561bGI7z19YWJlM6PDDjsMABwuC6rwhUyyHZALxdQ7obDwSZHGCJZZDguIXz11A63NF1Ke/LKMRqwDE463rWMXHS5u0PtzFjMntV5phFbSdBAOzw/5YPG2/tLy542nLe7v5ckn2JQakMr6m872ENho8XmJM+uM/7krWBblGw11QZSJUwMaEr/DQefCzPrnZRRL8PUfeoLhd6dAeFdy+pwSI++78ARESFQF3WTIzgPcGBMzaA79aGcBQDYjHq7gGk/HKAWxiEaUA7x6LqLkGfonmnZUB/DsglQBNMYArB+SAHMABpbgBqaU0GuCXPjMg+xIDktZogPFau08NSK8gqlyymNGIVQBqLgHxngFZEeUbjVgFJN+YiO2ABiSl0YDiQQOS1mhA8g3IyqxGAxRkQECjceUS6mhj4hmQUeAbmOh/m3JRo3HFjQZWrgHpdvVlrCojbkzQCaujETMgtZr7SlS4wpNjeYJvQDz7AjmYrHtUsNkZSR4pKyC48QoBUxmZAcbDASaHSoTNESDvyFwBskk1Z0C8G9kBHkEK0sOeZJ+m8pYnGPpsPaB9kEAiRSw8M4AwgDtQBjhSMwEMwycEEKlmuAa+AooqQAhSBtDDTwp7oIcf5IBgZmUfIu9qR6+JEQWQ6RtvEiDE+C9DAOh8b59Oia4DABC8uScBEFkiCQCg/ZhkADINkzRERnRSwT2AEdN+NGCwk2HQQ2OHxgDFg4M3FMDKWa0fKncmLmCAfwKytt1+d3z8NsUTEHLUJ7uDuAGBVL4YOs7w/Ayd0H1/QuzdAfaBSe/UYT//Oe1hMwYn9j+DXfItOuypDwAAAABJRU5ErkJggg==');\n    background-size: 40px 40px;\n    position: absolute;\n}\n\n.ground {\n    height: 40px;\n    width: 1920px;\n    background: url('data:image/jpeg;base64,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');\n    background-size: 40px 40px;\n    position: absolute;\n}\n\n.ron {\n    height: 80px;\n    width: 40px;\n    position: absolute;\n    background-size: 30px 30px;\n    transform: scaleX(1);\n    overflow: visible;\n    top: 0px;\n    left: 300px;\n}\n\n.enemy1 {\n    position: relative;\n    height: 80px;\n    width: 80px;\n    padding: 0;\n    margin-top: -10px;\n    background-image: url('data:image/gif;base64,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');\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-position: center center;\n    transform: scaleX(1);\n}\n\n.playerModel {\n    position: relative;\n    height: 147px;\n    width: 98px;\n    image-rendering: pixelated;\n    margin-left: -30px;\n    margin-top: -61px;\n    background-size: 1473px 846px;\n    background-image: url('data:image/png;base64,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');\n    background-repeat: no-repeat;\n    background-position: top left;\n}\n\n.playerLabel {\n    position: absolute;\n    font-family: Courier, monospace;\n    font-size: 1.2em;\n    font-weight: bolder;\n    color: white;\n}", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(11);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Ron;

var _victor = __webpack_require__(13);

var _victor2 = _interopRequireDefault(_victor);

var _animator = __webpack_require__(4);

var _animator2 = _interopRequireDefault(_animator);

var _collisionUtils = __webpack_require__(2);

var _fireball = __webpack_require__(14);

var _fireball2 = _interopRequireDefault(_fireball);

var _game = __webpack_require__(0);

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Ron(x, y) {

    this.x = x || 0;
    this.y = y || 0;
    this.h = 80;
    this.w = 40;
    this.vx = 0;
    this.vy = 0;
    this.name = 'Ron';

    this.taunt = false;

    this.positionVec = new _victor2.default(this.x, this.y);
    this.velocityVec = new _victor2.default(this.vx, this.vy);
    this.frictionVec = new _victor2.default(1, 0);
    this.gravityVec = new _victor2.default(0, 1);
    this.moveVec = new _victor2.default(2, 0);
    this.jumpVec = new _victor2.default(0, 18);

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
    _game2.default.world.appendChild(this.node);
    this.animations = {};

    this.animations.running = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36,
        offsetY: 82,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 4
    }), 7, 3);

    this.animations.sprinting = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36 + 35 * 5,
        offsetY: 82,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 4
    }), 7, 3);

    this.animations.wallSliding = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36 + 35 * 9,
        offsetY: 82,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 7, 3);

    this.animations.jumping = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 211,
        offsetY: 132,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 7, 3);

    this.animations.leaping = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 351,
        offsetY: 132,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 7, 3);

    this.animations.falling = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 246,
        offsetY: 132,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 7, 3);

    this.animations.crouching = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 421,
        offsetY: 147,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 1, 3);

    this.animations.standing = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36,
        offsetY: 82,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 1, 3);

    this.animations.taunt = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36 + 35 * 6,
        offsetY: 181,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 10, 3);

    this.currentAnimation = this.animations.standing;
}

Ron.prototype.makeBig = function () {

    this.h = 80;

    this.node.style.height = '80px';
    this.y = this.y - 44;
    this.node.style.top = this.y + 'px';
    this.isBig = true;
};

Ron.prototype.makeSmall = function () {

    this.h = 36;
    this.node.style.height = '36px';
    this.y = this.y + 44;
    this.node.style.top = this.y + 'px';
    this.isBig = false;
};

Ron.prototype.applyFriction = function () {

    if (this.grounded) {
        if (_game2.default.s && _game2.default.frameCount % 3 > 0) {
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
    } else if (this.wallTouch === 'left' && _game2.default.a || this.wallTouch === 'right' && _game2.default.d) {
        if (this.vy > 2) {
            this.vy -= 2;
        }
    }
};

Ron.prototype.applyGravity = function () {

    var terminalVelocity = _game2.default.w ? 10 : 10;
    terminalVelocity = this.wallTouch === 'left' && _game2.default.a || this.wallTouch === 'right' && _game2.default.d ? 2 : terminalVelocity;
    if (this.vy < terminalVelocity) {
        this.vy += 1;
    }
    if (this.velocityVec.y < terminalVelocity) {
        this.velocityVec.add(this.gravityVec);
    }
};

Ron.prototype.applyJump = function () {

    if (!_game2.default.spacebar) {
        this.jumped = false;
    }
    if (_game2.default.spacebar && !this.jumped && this.grounded) {
        this.vy = -18;
        this.velocityVec.subtract(this.jumpVec);
        this.jumped = true;
    } else if (_game2.default.spacebar && !this.jumped && this.wallTouch) {
        //if((this.wallTouch === 'left' && a) || (this.wallTouch === 'right' && d)){
        this.vx = this.wallTouch === 'left' ? 10 : -10;
        this.vy = -15;
        this.velocityVec.subtract(this.jumpVec);
        this.jumped = true;
        // }
    }
};

Ron.prototype.applyMove = function () {
    var terminalVelocity = _game2.default.shift ? 15 : 10;
    terminalVelocity = this.crouching ? 1 : terminalVelocity;
    terminalVelocity = this.grounded ? terminalVelocity : 4;

    if (!this.grounded && _game2.default.frameCount % 3 > 0) {
        return;
    }
    //playervelocityX = 20 * direction;
    if (!_game2.default.spacebar && this.crouching) {
        return;
    }
    if (_game2.default.a && this.vx > -terminalVelocity) {
        this.vx -= 2;
    }
    if (_game2.default.d && this.vx < terminalVelocity) {
        this.vx += 2;
    }

    if (_game2.default.a && this.velocityVec.x > -terminalVelocity) {
        this.velocityVec.subtract(this.moveVec);
    }
    if (_game2.default.d && this.velocityVec.x < terminalVelocity) {
        this.velocityVec.add(this.moveVec);
    }
};

Ron.prototype.applyVelocity = function () {
    (0, _collisionUtils.handleCollisionsEntity)(this);

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

Ron.prototype.grounder = function () {
    var visibleObstaclesLength = _game2.default.visibleObstacles.length;
    for (var i = 0; i < visibleObstaclesLength; i++) {
        if ((0, _collisionUtils.willCollideY)(this, 1, _game2.default.visibleObstacles[i])) {
            this.grounded = true;
            return;
        }
    }

    for (var _i = 0; _i < _game2.default.enemies.length; _i++) {
        if ((0, _collisionUtils.willCollideY)(this, 1, _game2.default.enemies[_i])) {
            this.grounded = true;
            return;
        }
    }
    this.grounded = false;
};

Ron.prototype.wallCheck = function () {

    var visibleObstaclesLength = _game2.default.visibleObstacles.length;
    for (var i = 0; i < visibleObstaclesLength; i++) {
        if ((0, _collisionUtils.willCollideXY)(this, -1, 0, _game2.default.visibleObstacles[i])) {
            this.wallTouch = 'left';
            //console.log(this.wallTouch);
            return;
        }
        if ((0, _collisionUtils.willCollideXY)(this, 1, 0, _game2.default.visibleObstacles[i])) {
            this.wallTouch = 'right';
            //console.log(this.wallTouch);
            return;
        }
    }
    this.wallTouch = null;
};

Ron.prototype.handlePlayerCollisions = function () {
    for (var i = 0; i < _game2.default.enemies.length; i++) {
        var enemy = _game2.default.enemies[i];
        if ((0, _collisionUtils.isColliding)(this, enemy)) {
            var thisBottom = this.y + (this.crouching ? 80 : 36);
            var enemyBottom = enemy.y + (enemy.crouching ? 80 : 36);
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
                _game2.default.respawn();
            }
        }
    }
};

Ron.prototype.handleObstacleCollisions = function () {

    var visibleObstaclesLength = _game2.default.visibleObstacles.length;
    for (var i = 0; i < visibleObstaclesLength; i++) {
        if (_game2.default.visibleObstacles[i]) {
            if ((0, _collisionUtils.isColliding)(this, _game2.default.visibleObstacles[i])) {
                _game2.default.respawn();
            }
        }
    }
};

Ron.prototype.animate = function () {
    if (_game2.default.w) {
        this.taunt = true;
        this.currentAnimation = this.animations.taunt;
        if (_game2.default.frameCount % 10 === 0) {
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
            if (_game2.default.shift) {
                this.currentAnimation = this.animations.sprinting;
            } else {
                //running
                this.currentAnimation = this.animations.running;
            }

            this.currentAnimation.delay = Math.max(1, 15 - Math.abs(this.vx));
        }
    } else if (this.wallTouch === 'left' && _game2.default.a || this.wallTouch === 'right' && _game2.default.d) {
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
            if (_game2.default.w || _game2.default.spacebar) {
                this.currentAnimation = this.animations.falling;
            } else {
                //falling
                this.currentAnimation = this.animations.falling;
            }
        }
    }

    if (_game2.default.s) {
        this.currentAnimation = this.animations.crouching;
        this.crouching = true;
        if (this.isBig) {
            this.makeSmall();
        }
    } else {
        if (!this.isBig) {
            this.makeBig();
            if ((0, _collisionUtils.willCollideWithAnything)(_game2.default.ron, 0, 0, _game2.default.visibleObstacles).length === 0) {
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

Ron.prototype.shootFireball = function () {
    if (this.fired && !_game2.default.w) {
        this.fired = false;
    }
    if (_game2.default.w && !this.fired) {
        this.fired = true;
        if (this.facingRight) {
            new _fireball2.default(this.x + 45, this.y + 44, this.facingRight);
        } else {
            new _fireball2.default(this.x - 5, this.y + 44, this.facingRight);
        }
    }
};

Ron.prototype.updatePosition = function () {
    this.node.style.left = this.x + 'px';
    this.node.style.top = this.y + 'px';
};

Ron.prototype.onFrameUpdate = function () {
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

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Victor;
exports.random = random;
exports.radian2degrees = radian2degrees;
exports.degrees2radian = degrees2radian;
/* eslint-disable */

/*!
MIT License

Copyright (c) 2011 Max Kueng, George Crabtree
 
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
     * # Victor - A JavaScript 2D vector class with methods for common vector operations
     */

/**
     * Constructor. Will also work without the `new` keyword
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = Victor(42, 1337);
     *
     * @param {Number} x Value of the x axis
     * @param {Number} y Value of the y axis
     * @return {Victor}
     * @api public
     */
function Victor(x, y) {
    if (!(this instanceof Victor)) {
        return new Victor(x, y);
    }

    /**
         * The X axis
         *
         * ### Examples:
         *     var vec = new Victor.fromArray(42, 21);
         *
         *     vec.x;
         *     // => 42
         *
         * @api public
         */
    this.x = x || 0;

    /**
         * The Y axis
         *
         * ### Examples:
         *     var vec = new Victor.fromArray(42, 21);
         *
         *     vec.y;
         *     // => 21
         *
         * @api public
         */
    this.y = y || 0;
}

/**
     * # Static
     */

/**
     * Creates a new instance from an array
     *
     * ### Examples:
     *     var vec = Victor.fromArray([42, 21]);
     *
     *     vec.toString();
     *     // => x:42, y:21
     *
     * @name Victor.fromArray
     * @param {Array} array Array with the x and y values at index 0 and 1 respectively
     * @return {Victor} The new instance
     * @api public
     */
Victor.fromArray = function (arr) {
    return new Victor(arr[0] || 0, arr[1] || 0);
};

/**
     * Creates a new instance from an object
     *
     * ### Examples:
     *     var vec = Victor.fromObject({ x: 42, y: 21 });
     *
     *     vec.toString();
     *     // => x:42, y:21
     *
     * @name Victor.fromObject
     * @param {Object} obj Object with the values for x and y
     * @return {Victor} The new instance
     * @api public
     */
Victor.fromObject = function (obj) {
    return new Victor(obj.x || 0, obj.y || 0);
};

/**
     * # Manipulation
     *
     * These functions are chainable.
     */

/**
     * Adds another vector's X axis to this one
     *
     * ### Examples:
     *     var vec1 = new Victor(10, 10);
     *     var vec2 = new Victor(20, 30);
     *
     *     vec1.addX(vec2);
     *     vec1.toString();
     *     // => x:30, y:10
     *
     * @param {Victor} vector The other vector you want to add to this one
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.addX = function (vec) {
    this.x += vec.x;
    return this;
};

/**
     * Adds another vector's Y axis to this one
     *
     * ### Examples:
     *     var vec1 = new Victor(10, 10);
     *     var vec2 = new Victor(20, 30);
     *
     *     vec1.addY(vec2);
     *     vec1.toString();
     *     // => x:10, y:40
     *
     * @param {Victor} vector The other vector you want to add to this one
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.addY = function (vec) {
    this.y += vec.y;
    return this;
};

/**
     * Adds another vector to this one
     *
     * ### Examples:
     *     var vec1 = new Victor(10, 10);
     *     var vec2 = new Victor(20, 30);
     *
     *     vec1.add(vec2);
     *     vec1.toString();
     *     // => x:30, y:40
     *
     * @param {Victor} vector The other vector you want to add to this one
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.add = function (vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
};

/**
     * Adds the given scalar to both vector axis
     *
     * ### Examples:
     *     var vec = new Victor(1, 2);
     *
     *     vec.addScalar(2);
     *     vec.toString();
     *     // => x: 3, y: 4
     *
     * @param {Number} scalar The scalar to add
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.addScalar = function (scalar) {
    this.x += scalar;
    this.y += scalar;
    return this;
};

/**
     * Adds the given scalar to the X axis
     *
     * ### Examples:
     *     var vec = new Victor(1, 2);
     *
     *     vec.addScalarX(2);
     *     vec.toString();
     *     // => x: 3, y: 2
     *
     * @param {Number} scalar The scalar to add
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.addScalarX = function (scalar) {
    this.x += scalar;
    return this;
};

/**
     * Adds the given scalar to the Y axis
     *
     * ### Examples:
     *     var vec = new Victor(1, 2);
     *
     *     vec.addScalarY(2);
     *     vec.toString();
     *     // => x: 1, y: 4
     *
     * @param {Number} scalar The scalar to add
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.addScalarY = function (scalar) {
    this.y += scalar;
    return this;
};

/**
     * Subtracts the X axis of another vector from this one
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(20, 30);
     *
     *     vec1.subtractX(vec2);
     *     vec1.toString();
     *     // => x:80, y:50
     *
     * @param {Victor} vector The other vector you want subtract from this one
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.subtractX = function (vec) {
    this.x -= vec.x;
    return this;
};

/**
     * Subtracts the Y axis of another vector from this one
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(20, 30);
     *
     *     vec1.subtractY(vec2);
     *     vec1.toString();
     *     // => x:100, y:20
     *
     * @param {Victor} vector The other vector you want subtract from this one
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.subtractY = function (vec) {
    this.y -= vec.y;
    return this;
};

/**
     * Subtracts another vector from this one
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(20, 30);
     *
     *     vec1.subtract(vec2);
     *     vec1.toString();
     *     // => x:80, y:20
     *
     * @param {Victor} vector The other vector you want subtract from this one
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.subtract = function (vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
};

/**
     * Subtracts the given scalar from both axis
     *
     * ### Examples:
     *     var vec = new Victor(100, 200);
     *
     *     vec.subtractScalar(20);
     *     vec.toString();
     *     // => x: 80, y: 180
     *
     * @param {Number} scalar The scalar to subtract
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.subtractScalar = function (scalar) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
};

/**
     * Subtracts the given scalar from the X axis
     *
     * ### Examples:
     *     var vec = new Victor(100, 200);
     *
     *     vec.subtractScalarX(20);
     *     vec.toString();
     *     // => x: 80, y: 200
     *
     * @param {Number} scalar The scalar to subtract
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.subtractScalarX = function (scalar) {
    this.x -= scalar;
    return this;
};

/**
     * Subtracts the given scalar from the Y axis
     *
     * ### Examples:
     *     var vec = new Victor(100, 200);
     *
     *     vec.subtractScalarY(20);
     *     vec.toString();
     *     // => x: 100, y: 180
     *
     * @param {Number} scalar The scalar to subtract
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.subtractScalarY = function (scalar) {
    this.y -= scalar;
    return this;
};

/**
     * Divides the X axis by the x component of given vector
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *     var vec2 = new Victor(2, 0);
     *
     *     vec.divideX(vec2);
     *     vec.toString();
     *     // => x:50, y:50
     *
     * @param {Victor} vector The other vector you want divide by
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.divideX = function (vector) {
    this.x /= vector.x;
    return this;
};

/**
     * Divides the Y axis by the y component of given vector
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *     var vec2 = new Victor(0, 2);
     *
     *     vec.divideY(vec2);
     *     vec.toString();
     *     // => x:100, y:25
     *
     * @param {Victor} vector The other vector you want divide by
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.divideY = function (vector) {
    this.y /= vector.y;
    return this;
};

/**
     * Divides both vector axis by a axis values of given vector
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *     var vec2 = new Victor(2, 2);
     *
     *     vec.divide(vec2);
     *     vec.toString();
     *     // => x:50, y:25
     *
     * @param {Victor} vector The vector to divide by
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.divide = function (vector) {
    this.x /= vector.x;
    this.y /= vector.y;
    return this;
};

/**
     * Divides both vector axis by the given scalar value
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.divideScalar(2);
     *     vec.toString();
     *     // => x:50, y:25
     *
     * @param {Number} The scalar to divide by
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.divideScalar = function (scalar) {
    if (scalar !== 0) {
        this.x /= scalar;
        this.y /= scalar;
    } else {
        this.x = 0;
        this.y = 0;
    }

    return this;
};

/**
     * Divides the X axis by the given scalar value
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.divideScalarX(2);
     *     vec.toString();
     *     // => x:50, y:50
     *
     * @param {Number} The scalar to divide by
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.divideScalarX = function (scalar) {
    if (scalar !== 0) {
        this.x /= scalar;
    } else {
        this.x = 0;
    }
    return this;
};

/**
     * Divides the Y axis by the given scalar value
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.divideScalarY(2);
     *     vec.toString();
     *     // => x:100, y:25
     *
     * @param {Number} The scalar to divide by
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.divideScalarY = function (scalar) {
    if (scalar !== 0) {
        this.y /= scalar;
    } else {
        this.y = 0;
    }
    return this;
};

/**
     * Inverts the X axis
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.invertX();
     *     vec.toString();
     *     // => x:-100, y:50
     *
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.invertX = function () {
    this.x *= -1;
    return this;
};

/**
     * Inverts the Y axis
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.invertY();
     *     vec.toString();
     *     // => x:100, y:-50
     *
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.invertY = function () {
    this.y *= -1;
    return this;
};

/**
     * Inverts both axis
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.invert();
     *     vec.toString();
     *     // => x:-100, y:-50
     *
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.invert = function () {
    this.invertX();
    this.invertY();
    return this;
};

/**
     * Multiplies the X axis by X component of given vector
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *     var vec2 = new Victor(2, 0);
     *
     *     vec.multiplyX(vec2);
     *     vec.toString();
     *     // => x:200, y:50
     *
     * @param {Victor} vector The vector to multiply the axis with
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.multiplyX = function (vector) {
    this.x *= vector.x;
    return this;
};

/**
     * Multiplies the Y axis by Y component of given vector
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *     var vec2 = new Victor(0, 2);
     *
     *     vec.multiplyX(vec2);
     *     vec.toString();
     *     // => x:100, y:100
     *
     * @param {Victor} vector The vector to multiply the axis with
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.multiplyY = function (vector) {
    this.y *= vector.y;
    return this;
};

/**
     * Multiplies both vector axis by values from a given vector
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *     var vec2 = new Victor(2, 2);
     *
     *     vec.multiply(vec2);
     *     vec.toString();
     *     // => x:200, y:100
     *
     * @param {Victor} vector The vector to multiply by
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.multiply = function (vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
};

/**
     * Multiplies both vector axis by the given scalar value
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.multiplyScalar(2);
     *     vec.toString();
     *     // => x:200, y:100
     *
     * @param {Number} The scalar to multiply by
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.multiplyScalar = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
};

/**
     * Multiplies the X axis by the given scalar
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.multiplyScalarX(2);
     *     vec.toString();
     *     // => x:200, y:50
     *
     * @param {Number} The scalar to multiply the axis with
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.multiplyScalarX = function (scalar) {
    this.x *= scalar;
    return this;
};

/**
     * Multiplies the Y axis by the given scalar
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.multiplyScalarY(2);
     *     vec.toString();
     *     // => x:100, y:100
     *
     * @param {Number} The scalar to multiply the axis with
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.multiplyScalarY = function (scalar) {
    this.y *= scalar;
    return this;
};

/**
     * Normalize
     *
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.normalize = function () {
    var length = this.length();

    if (length === 0) {
        this.x = 1;
        this.y = 0;
    } else {
        this.divide(Victor(length, length));
    }
    return this;
};

Victor.prototype.norm = Victor.prototype.normalize;

/**
     * If the absolute vector axis is greater than `max`, multiplies the axis by `factor`
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.limit(80, 0.9);
     *     vec.toString();
     *     // => x:90, y:50
     *
     * @param {Number} max The maximum value for both x and y axis
     * @param {Number} factor Factor by which the axis are to be multiplied with
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.limit = function (max, factor) {
    if (Math.abs(this.x) > max) {
        this.x *= factor;
    }
    if (Math.abs(this.y) > max) {
        this.y *= factor;
    }
    return this;
};

/**
     * Randomizes both vector axis with a value between 2 vectors
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.randomize(new Victor(50, 60), new Victor(70, 80`));
     *     vec.toString();
     *     // => x:67, y:73
     *
     * @param {Victor} topLeft first vector
     * @param {Victor} bottomRight second vector
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.randomize = function (topLeft, bottomRight) {
    this.randomizeX(topLeft, bottomRight);
    this.randomizeY(topLeft, bottomRight);

    return this;
};

/**
     * Randomizes the y axis with a value between 2 vectors
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.randomizeX(new Victor(50, 60), new Victor(70, 80`));
     *     vec.toString();
     *     // => x:55, y:50
     *
     * @param {Victor} topLeft first vector
     * @param {Victor} bottomRight second vector
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.randomizeX = function (topLeft, bottomRight) {
    var min = Math.min(topLeft.x, bottomRight.x);
    var max = Math.max(topLeft.x, bottomRight.x);
    this.x = random(min, max);
    return this;
};

/**
     * Randomizes the y axis with a value between 2 vectors
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.randomizeY(new Victor(50, 60), new Victor(70, 80`));
     *     vec.toString();
     *     // => x:100, y:66
     *
     * @param {Victor} topLeft first vector
     * @param {Victor} bottomRight second vector
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.randomizeY = function (topLeft, bottomRight) {
    var min = Math.min(topLeft.y, bottomRight.y);
    var max = Math.max(topLeft.y, bottomRight.y);
    this.y = random(min, max);
    return this;
};

/**
     * Randomly randomizes either axis between 2 vectors
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.randomizeAny(new Victor(50, 60), new Victor(70, 80));
     *     vec.toString();
     *     // => x:100, y:77
     *
     * @param {Victor} topLeft first vector
     * @param {Victor} bottomRight second vector
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.randomizeAny = function (topLeft, bottomRight) {
    if (Math.round(Math.random())) {
        this.randomizeX(topLeft, bottomRight);
    } else {
        this.randomizeY(topLeft, bottomRight);
    }
    return this;
};

/**
     * Rounds both axis to an integer value
     *
     * ### Examples:
     *     var vec = new Victor(100.2, 50.9);
     *
     *     vec.unfloat();
     *     vec.toString();
     *     // => x:100, y:51
     *
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.unfloat = function () {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
};

/**
     * Rounds both axis to a certain precision
     *
     * ### Examples:
     *     var vec = new Victor(100.2, 50.9);
     *
     *     vec.unfloat();
     *     vec.toString();
     *     // => x:100, y:51
     *
     * @param {Number} Precision (default: 8)
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.toFixed = function (precision) {
    if (typeof precision === 'undefined') {
        precision = 8;
    }
    this.x = this.x.toFixed(precision);
    this.y = this.y.toFixed(precision);
    return this;
};

/**
     * Performs a linear blend / interpolation of the X axis towards another vector
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 100);
     *     var vec2 = new Victor(200, 200);
     *
     *     vec1.mixX(vec2, 0.5);
     *     vec.toString();
     *     // => x:150, y:100
     *
     * @param {Victor} vector The other vector
     * @param {Number} amount The blend amount (optional, default: 0.5)
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.mixX = function (vec, amount) {
    if (typeof amount === 'undefined') {
        amount = 0.5;
    }

    this.x = (1 - amount) * this.x + amount * vec.x;
    return this;
};

/**
     * Performs a linear blend / interpolation of the Y axis towards another vector
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 100);
     *     var vec2 = new Victor(200, 200);
     *
     *     vec1.mixY(vec2, 0.5);
     *     vec.toString();
     *     // => x:100, y:150
     *
     * @param {Victor} vector The other vector
     * @param {Number} amount The blend amount (optional, default: 0.5)
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.mixY = function (vec, amount) {
    if (typeof amount === 'undefined') {
        amount = 0.5;
    }

    this.y = (1 - amount) * this.y + amount * vec.y;
    return this;
};

/**
     * Performs a linear blend / interpolation towards another vector
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 100);
     *     var vec2 = new Victor(200, 200);
     *
     *     vec1.mix(vec2, 0.5);
     *     vec.toString();
     *     // => x:150, y:150
     *
     * @param {Victor} vector The other vector
     * @param {Number} amount The blend amount (optional, default: 0.5)
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.mix = function (vec, amount) {
    this.mixX(vec, amount);
    this.mixY(vec, amount);
    return this;
};

/**
     * # Products
     */

/**
     * Creates a clone of this vector
     *
     * ### Examples:
     *     var vec1 = new Victor(10, 10);
     *     var vec2 = vec1.clone();
     *
     *     vec2.toString();
     *     // => x:10, y:10
     *
     * @return {Victor} A clone of the vector
     * @api public
     */
Victor.prototype.clone = function () {
    return new Victor(this.x, this.y);
};

/**
     * Copies another vector's X component in to its own
     *
     * ### Examples:
     *     var vec1 = new Victor(10, 10);
     *     var vec2 = new Victor(20, 20);
     *     var vec2 = vec1.copyX(vec1);
     *
     *     vec2.toString();
     *     // => x:20, y:10
     *
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.copyX = function (vec) {
    this.x = vec.x;
    return this;
};

/**
     * Copies another vector's Y component in to its own
     *
     * ### Examples:
     *     var vec1 = new Victor(10, 10);
     *     var vec2 = new Victor(20, 20);
     *     var vec2 = vec1.copyY(vec1);
     *
     *     vec2.toString();
     *     // => x:10, y:20
     *
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.copyY = function (vec) {
    this.y = vec.y;
    return this;
};

/**
     * Copies another vector's X and Y components in to its own
     *
     * ### Examples:
     *     var vec1 = new Victor(10, 10);
     *     var vec2 = new Victor(20, 20);
     *     var vec2 = vec1.copy(vec1);
     *
     *     vec2.toString();
     *     // => x:20, y:20
     *
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.copy = function (vec) {
    this.copyX(vec);
    this.copyY(vec);
    return this;
};

/**
     * Sets the vector to zero (0,0)
     *
     * ### Examples:
     *     var vec1 = new Victor(10, 10);
     *		 var1.zero();
     *     vec1.toString();
     *     // => x:0, y:0
     *
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.zero = function () {
    this.x = this.y = 0;
    return this;
};

/**
     * Calculates the dot product of this vector and another
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(200, 60);
     *
     *     vec1.dot(vec2);
     *     // => 23000
     *
     * @param {Victor} vector The second vector
     * @return {Number} Dot product
     * @api public
     */
Victor.prototype.dot = function (vec2) {
    return this.x * vec2.x + this.y * vec2.y;
};

Victor.prototype.cross = function (vec2) {
    return this.x * vec2.y - this.y * vec2.x;
};

/**
     * Projects a vector onto another vector, setting itself to the result.
     *
     * ### Examples:
     *     var vec = new Victor(100, 0);
     *     var vec2 = new Victor(100, 100);
     *
     *     vec.projectOnto(vec2);
     *     vec.toString();
     *     // => x:50, y:50
     *
     * @param {Victor} vector The other vector you want to project this vector onto
     * @return {Victor} `this` for chaining capabilities
     * @api public
     */
Victor.prototype.projectOnto = function (vec2) {
    var coeff = (this.x * vec2.x + this.y * vec2.y) / (vec2.x * vec2.x + vec2.y * vec2.y);
    this.x = coeff * vec2.x;
    this.y = coeff * vec2.y;
    return this;
};

Victor.prototype.horizontalAngle = function () {
    return Math.atan2(this.y, this.x);
};

Victor.prototype.horizontalAngleDeg = function () {
    return radian2degrees(this.horizontalAngle());
};

Victor.prototype.verticalAngle = function () {
    return Math.atan2(this.x, this.y);
};

Victor.prototype.verticalAngleDeg = function () {
    return radian2degrees(this.verticalAngle());
};

Victor.prototype.angle = Victor.prototype.horizontalAngle;
Victor.prototype.angleDeg = Victor.prototype.horizontalAngleDeg;
Victor.prototype.direction = Victor.prototype.horizontalAngle;

Victor.prototype.rotate = function (angle) {
    var nx = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    var ny = this.x * Math.sin(angle) + this.y * Math.cos(angle);

    this.x = nx;
    this.y = ny;

    return this;
};

Victor.prototype.rotateDeg = function (angle) {
    angle = degrees2radian(angle);
    return this.rotate(angle);
};

Victor.prototype.rotateTo = function (rotation) {
    return this.rotate(rotation - this.angle());
};

Victor.prototype.rotateToDeg = function (rotation) {
    rotation = degrees2radian(rotation);
    return this.rotateTo(rotation);
};

Victor.prototype.rotateBy = function (rotation) {
    var angle = this.angle() + rotation;

    return this.rotate(angle);
};

Victor.prototype.rotateByDeg = function (rotation) {
    rotation = degrees2radian(rotation);
    return this.rotateBy(rotation);
};

/**
     * Calculates the distance of the X axis between this vector and another
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(200, 60);
     *
     *     vec1.distanceX(vec2);
     *     // => -100
     *
     * @param {Victor} vector The second vector
     * @return {Number} Distance
     * @api public
     */
Victor.prototype.distanceX = function (vec) {
    return this.x - vec.x;
};

/**
     * Same as `distanceX()` but always returns an absolute number
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(200, 60);
     *
     *     vec1.absDistanceX(vec2);
     *     // => 100
     *
     * @param {Victor} vector The second vector
     * @return {Number} Absolute distance
     * @api public
     */
Victor.prototype.absDistanceX = function (vec) {
    return Math.abs(this.distanceX(vec));
};

/**
     * Calculates the distance of the Y axis between this vector and another
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(200, 60);
     *
     *     vec1.distanceY(vec2);
     *     // => -10
     *
     * @param {Victor} vector The second vector
     * @return {Number} Distance
     * @api public
     */
Victor.prototype.distanceY = function (vec) {
    return this.y - vec.y;
};

/**
     * Same as `distanceY()` but always returns an absolute number
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(200, 60);
     *
     *     vec1.distanceY(vec2);
     *     // => 10
     *
     * @param {Victor} vector The second vector
     * @return {Number} Absolute distance
     * @api public
     */
Victor.prototype.absDistanceY = function (vec) {
    return Math.abs(this.distanceY(vec));
};

/**
     * Calculates the euclidean distance between this vector and another
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(200, 60);
     *
     *     vec1.distance(vec2);
     *     // => 100.4987562112089
     *
     * @param {Victor} vector The second vector
     * @return {Number} Distance
     * @api public
     */
Victor.prototype.distance = function (vec) {
    return Math.sqrt(this.distanceSq(vec));
};

/**
     * Calculates the squared euclidean distance between this vector and another
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(200, 60);
     *
     *     vec1.distanceSq(vec2);
     *     // => 10100
     *
     * @param {Victor} vector The second vector
     * @return {Number} Distance
     * @api public
     */
Victor.prototype.distanceSq = function (vec) {
    var dx = this.distanceX(vec),
        dy = this.distanceY(vec);

    return dx * dx + dy * dy;
};

/**
     * Calculates the length or magnitude of the vector
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.length();
     *     // => 111.80339887498948
     *
     * @return {Number} Length / Magnitude
     * @api public
     */
Victor.prototype.length = function () {
    return Math.sqrt(this.lengthSq());
};

/**
     * Squared length / magnitude
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *
     *     vec.lengthSq();
     *     // => 12500
     *
     * @return {Number} Length / Magnitude
     * @api public
     */
Victor.prototype.lengthSq = function () {
    return this.x * this.x + this.y * this.y;
};

Victor.prototype.magnitude = Victor.prototype.length;

/**
     * Returns a true if vector is (0, 0)
     *
     * ### Examples:
     *     var vec = new Victor(100, 50);
     *     vec.zero();
     *
     *     // => true
     *
     * @return {Boolean}
     * @api public
     */
Victor.prototype.isZero = function () {
    return this.x === 0 && this.y === 0;
};

/**
     * Returns a true if this vector is the same as another
     *
     * ### Examples:
     *     var vec1 = new Victor(100, 50);
     *     var vec2 = new Victor(100, 50);
     *     vec1.isEqualTo(vec2);
     *
     *     // => true
     *
     * @return {Boolean}
     * @api public
     */
Victor.prototype.isEqualTo = function (vec2) {
    return this.x === vec2.x && this.y === vec2.y;
};

/**
     * # Utility Methods
     */

/**
     * Returns an string representation of the vector
     *
     * ### Examples:
     *     var vec = new Victor(10, 20);
     *
     *     vec.toString();
     *     // => x:10, y:20
     *
     * @return {String}
     * @api public
     */
Victor.prototype.toString = function () {
    return 'x:' + this.x + ', y:' + this.y;
};

/**
     * Returns an array representation of the vector
     *
     * ### Examples:
     *     var vec = new Victor(10, 20);
     *
     *     vec.toArray();
     *     // => [10, 20]
     *
     * @return {Array}
     * @api public
     */
Victor.prototype.toArray = function () {
    return [this.x, this.y];
};

/**
     * Returns an object representation of the vector
     *
     * ### Examples:
     *     var vec = new Victor(10, 20);
     *
     *     vec.toObject();
     *     // => { x: 10, y: 20 }
     *
     * @return {Object}
     * @api public
     */
Victor.prototype.toObject = function () {
    return { x: this.x, y: this.y };
};

var degrees = 180 / Math.PI;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function radian2degrees(rad) {
    return rad * degrees;
}

function degrees2radian(deg) {
    return deg / degrees;
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Fireball;

var _animator = __webpack_require__(4);

var _animator2 = _interopRequireDefault(_animator);

var _game = __webpack_require__(0);

var _game2 = _interopRequireDefault(_game);

var _collisionUtils = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Fireball(x, y, direction) {

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
    _game2.default.world.appendChild(this.node);
    this.node.style.height = '2px';
    this.model.style.height = '50px';
    this.animations = {};

    this.animations.fireBall = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36 + 35 * 4,
        offsetY: 232,
        spriteWidth: 34,
        spriteHeight: 10,
        spaceX: 1,
        spaceY: 1,
        frameCount: 4
    }), 7, 3);

    this.animations.smoke = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36 + 35 * 9,
        offsetY: 232,
        spriteWidth: 34,
        spriteHeight: 10,
        spaceX: 1,
        spaceY: 1,
        frameCount: 3
    }), 7, 3);

    this.currentAnimation = this.animations.fireBall;

    _game2.default.projectiles.push(this);
}

Fireball.prototype.applyGravity = function () {

    var terminalVelocity = 10;
    if (this.vy < terminalVelocity) {
        this.vy += 1;
    }
};

Fireball.prototype.applyVelocity = function () {

    (0, _collisionUtils.handleCollisionsEntity)(this);
    this.y += this.vy;
    this.x += this.vx;
};

Fireball.prototype.grounder = function () {

    var obstaclesLength = _game2.default.obstacles.length;
    for (var i = 0; i < obstaclesLength; i++) {
        if ((0, _collisionUtils.willCollideY)(this, 1, _game2.default.obstacles[i])) {
            this.vy = -8;
            return;
        }
    }

    for (var _i = 0; _i < _game2.default.enemies.length; _i++) {
        if ((0, _collisionUtils.willCollideY)(this, 1, _game2.default.enemies[_i])) {
            this.vy = -8;
            return;
        }
    }
    this.grounded = false;
};

Fireball.prototype.wallCheck = function () {

    var obstaclesLength = _game2.default.obstacles.length;
    for (var i = 0; i < obstaclesLength; i++) {
        if ((0, _collisionUtils.willCollideXY)(this, -1, 0, _game2.default.obstacles[i])) {
            this.contact();
            return;
        }
        if ((0, _collisionUtils.willCollideXY)(this, 1, 0, _game2.default.obstacles[i])) {
            this.contact();
            return;
        }
    }
    this.wallTouch = null;
};

Fireball.prototype.handlePlayerCollisions = function () {

    for (var i = 0; i < _game2.default.enemies.length; i++) {
        var enemy = _game2.default.enemies[i];
        if ((0, _collisionUtils.isColliding)(this, enemy)) {
            this.contact();
        }
    }
};

Fireball.prototype.handleObstacleCollisions = function () {

    var obstaclesLength = _game2.default.obstacles.length;
    for (var i = 0; i < obstaclesLength; i++) {
        if (_game2.default.obstacles[i]) {
            if ((0, _collisionUtils.isColliding)(this, _game2.default.obstacles[i])) {
                this.contact();
            }
        }
    }
};

Fireball.prototype.animate = function () {

    this.currentAnimation.isXFlipped = this.vx < 0;

    this.currentAnimation.render();
};

Fireball.prototype.contact = function () {

    this.currentAnimation = this.animations.smoke;
    this.currentAnimation.render();
    this.vx = 0;
    this.vy = 0;
    setTimeout(this.destroy.bind(this), 0);
};

Fireball.prototype.destroy = function () {

    var index = _game2.default.projectiles.indexOf(this);
    if (index >= 0 && this.node && this.node.parentNode) {
        this.node.parentNode.removeChild(this.node);
        _game2.default.projectiles.splice(index, 1);
    }
};

Fireball.prototype.updatePosition = function () {

    this.node.style.left = this.x + 'px';
    this.node.style.top = this.y + 'px';
};

Fireball.prototype.onFrameUpdate = function () {

    this.applyGravity();
    this.grounder();
    this.wallCheck();
    this.applyVelocity();
    this.handlePlayerCollisions();
    //this.handleObstacleCollisions();
    this.animate();
    this.updatePosition();
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var Auth = {};

Auth.init = function () {
    //Hide World Stage

    // Game.world.style.display = "none";
    // var uiConfig = {
    //     signInOptions: [
    //         Firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //         Firebase.auth.PhoneAuthProvider.PROVIDER_ID
    //     ],
    //     callbacks:{
    //         signInSuccess: Auth.success,
    //         signInFailure: Auth.fail
    //     }
    // }
    //var ui = new window['firebaseui'].auth.AuthUI(Firebase.auth());
    // The start method will wait until the DOM is loaded.
    //ui.start('#auth', uiConfig);
};

Auth.success = function (result) {
    Auth.result = result;

    //If no settings obj exists, create it
    if (window.localStorage.getItem('Settings') === '0' || undefined) {
        window.localStorage.setItem('Settings', JSON.stringify({}));
    }
    return false;
};

Auth.fail = function (error) {
    //console.log(error);
};

Auth.bypass = function () {
    Auth.result = {};
    Auth.result.displayName = '' + (10000 * Math.random()).toFixed(0);
    Auth.success(Auth.result);
};

exports.default = Auth;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = RemotePlayer;

var _game = __webpack_require__(0);

var _game2 = _interopRequireDefault(_game);

var _animator = __webpack_require__(4);

var _animator2 = _interopRequireDefault(_animator);

var _collisionUtils = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RemotePlayer(name, x, y, vx, vy) {

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
    _game2.default.world.appendChild(this.label);

    this.model = document.createElement('div');
    this.model.className = 'playerModel';
    this.node.appendChild(this.model);

    this.isBig = true;
    _game2.default.world.appendChild(this.node);
    this.animations = {};

    this.animations.running = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36,
        offsetY: 82,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 4
    }), 7, 3);

    this.animations.sprinting = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36 + 35 * 5,
        offsetY: 82,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 4
    }), 7, 3);

    this.animations.jumping = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 211,
        offsetY: 132,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 7, 3);

    this.animations.leaping = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 351,
        offsetY: 132,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 7, 3);

    this.animations.falling = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 246,
        offsetY: 132,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 7, 3);

    this.animations.crouching = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 421,
        offsetY: 147,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 1, 3);

    this.animations.standing = new _animator2.default(this.model, (0, _animator.getSpriteSheetData)({
        sheetWidth: 491,
        sheetHeight: 282,
        offsetX: 36,
        offsetY: 82,
        spriteWidth: 34,
        spriteHeight: 49,
        spaceX: 1,
        spaceY: 1,
        frameCount: 1
    }), 1, 3);

    this.currentAnimation = this.animations.standing;
}

RemotePlayer.prototype.makeBig = function () {

    this.h = 80;

    this.node.style.height = '80px';
    //this.y = this.y - 44;
    this.node.style.top = this.y + 'px';
    this.isBig = true;
};

RemotePlayer.prototype.makeSmall = function () {

    this.h = 36;
    this.node.style.height = '36px';
    //this.y = this.y + 44;
    this.node.style.top = this.y + 'px';
    this.isBig = false;
};

RemotePlayer.prototype.applyVelocity = function () {

    (0, _collisionUtils.handleCollisionsEntity)(this);
    this.y += this.vy;
    this.x += this.vx;
    if (this.vx > 0) {
        this.facingRight = true;
    } else if (this.vx < 0) {
        this.facingRight = false;
    }
};

RemotePlayer.prototype.grounder = function () {
    for (var i = 0; i < _game2.default.visibleObstacles.length; i++) {
        var obstacle = _game2.default.visibleObstacles[i];
        if ((0, _collisionUtils.willCollideY)(this, 1, obstacle)) {
            this.grounded = true;
            return;
        }
    }
    this.grounded = false;
};

RemotePlayer.prototype.animate = function () {

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
            if ((0, _collisionUtils.willCollideWithAnything)(this, 0, 0, _game2.default.visibleObstacles).length === 0) {
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

RemotePlayer.prototype.updatePosition = function () {

    this.node.style.left = this.x + 'px';
    this.node.style.top = this.y + 'px';

    this.label.style.left = this.x + 'px';
    this.label.style.top = this.y - 25 + 'px';
};

RemotePlayer.prototype.die = function () {

    this.label.parentNode.removeChild(this.label);
    this.node.parentNode.removeChild(this.node);
};

RemotePlayer.prototype.onFrameUpdate = function () {

    this.grounder();
    this.applyVelocity();
    this.animate();
    this.updatePosition();
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _firebaseUtils = __webpack_require__(1);

var _firebaseUtils2 = _interopRequireDefault(_firebaseUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Settings = {};

//Pull settings from firebase
Settings.loadLocalSettings = function () {
    //console.log('Loading Local Settings');
    var settings = JSON.parse(window.localStorage.getItem('Settings'));
    for (var key in settings) {
        Settings[key] = settings[key];
    }
};

Settings.setGlobal = function (name, val) {
    _firebaseUtils2.default.setSetting(name, val);
};

Settings.setLocal = function (name, val) {
    var settings = JSON.parse(window.localStorage.getItem('Settings'));
    settings[name] = val;
    window.localStorage.setItem('Settings', JSON.stringify(settings));
};

//Regen Settings Cache
Settings.clearLocal = function () {
    window.localStorage.setItem('Settings', JSON.stringify({}));
};

exports.default = Settings;

/***/ })
/******/ ]);