import Game from './game';
import RemotePlayer from './entity/remote-player';
import Obstacle from './entity/obstacle';
import Chat from './chat';
import Settings from './Settings';

const config = {
    apiKey: 'AIzaSyBk1wB1Owc9ZGpOfK413ODSsr7mKjoUoeI',
    authDomain: 'div-hero.firebaseapp.com',
    databaseURL: 'https://div-hero-9b356-default-rtdb.firebaseio.com/',
    projectId: 'div-hero-9b356',
    storageBucket: '',
    messagingSenderId: '594674907779'
};

let Firebase = {
    _internal: null,
    
    load: function() {
        this._internal = window.firebase.initializeApp(config);
        const that = this;

        // change handlers
        this._internal.database().ref('obstacles')
            .on('value', function(snapshot) {
                that.processRemoteObstacles(snapshot);
            });

        this._internal.database().ref('/chat')
            .on('value', function(snapshot) {
                Chat.log = [];
                if (snapshot.val()) {
                    for (let msg in snapshot.val()) {
                        let mTime = new Date(snapshot.val()[msg].time);
                        let Min10 = 1000 * 60 * 10;
    
                        //If Older Than 10 min remove
                        if (mTime.getTime() < (new Date().getTime() - Min10)) {
                            that._internal.database().ref('chat/' + msg)
                                .remove();
                            continue;
                        }
    
                        Chat.log.push(snapshot.val()[msg]);
                    }
                    let nMsg = Chat.log.length;
                    Chat.log = Chat.log.slice(nMsg - 11, nMsg);
                }
            });

        this._internal.database().ref('/settings')
            .on('value', (snapshot) => {
                for (let key in snapshot.val()) {
                    let setting = snapshot.val()[key];
                    Settings[setting.name] = setting.value;
                }

                Settings.loadLocalSettings();
            });
    },

    loadPlayers: function() {
        let playersRef = this._internal.database().ref('players');
        const that = this;
        playersRef.on('value', function(snapshot) {
            that.processRemotePlayers(snapshot);
        
            Game.enemies.forEach(function (enemy, index) {
                let stillExists = false;
                for (let key in snapshot.val()) {
                    let obj = snapshot.val()[key];
                    if (enemy.name === obj.name) {
                        stillExists = true;
                        enemy.deleteCounter = 0;
                    }
                }
        
                if (!stillExists) {
                    enemy.deleteCounter++;
                    if (enemy.deleteCounter > 50) {
                        enemy.die();
                        Game.enemies.splice(index, 1);
                    }
                }
            });
        });
    },

    processRemotePlayers: function(snapshot) {
        if (snapshot.val()) {
            let snapShotKeys = Object.keys(snapshot.val());
            let numberOfKeys = snapShotKeys.length;
            let index = 0;
            let process = function() {
                if (index < numberOfKeys) {
                    let key = snapShotKeys[index];
                    if (snapshot.val().hasOwnProperty(key)) {
                        let obj = snapshot.val()[key];
                        
                        if (obj.name === Game.ron.name) {
                            if (obj.isDead) {
                                Game.respawn();
                            }
                        }
                        let exists = false;
                        let numberOfEnemies = Game.enemies.length;
                        for (let i = 0; i < numberOfEnemies; i++) {
                            if (obj.name === Game.enemies[i].name && obj.name !== Game.ron.name) {
                                exists = true;
                                Game.enemies[i].x = obj.x;
                                Game.enemies[i].y = obj.y;
                                Game.enemies[i].vx = obj.vx;
                                Game.enemies[i].vy = obj.vy;
                                Game.enemies[i].crouching = obj.crouching;
                            }
                        }
                    
                        if (!exists && obj.name !== Game.ron.name) {
                            Game.enemies.push(new RemotePlayer(obj.name, obj.x, obj.y, obj.vx, obj.vy));
                        }
                    }
                    index++;
                    setTimeout(process, 0);
                }
            };
            process();
        }
    },

    cleanUpRemotePlayers: function() {
        this._internal.database().ref('players')
            .remove();
    },

    periodicPlayerCleanup: function() {
        this.cleanUpRemotePlayers();
        const that = this;
        setTimeout(function() {
            that.periodicPlayerCleanup(); 
        }, 10000);
    },

    writePlayerData: function(name, x, y, vx, vy, crouching, isDead) {
        let post = {};
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
        this._internal.database().ref('players/' + name)
            .update(post);
    },

    processRemoteObstacles: function(snapshot) {
        let snapShotKeys = Object.keys(snapshot.val());
        let numberOfKeys = snapShotKeys.length;
        let index = 0;
        let process = function() {
            if (index < numberOfKeys) {
                let key = snapShotKeys[index];
                if (snapshot.val().hasOwnProperty(key)) {
                    let remoteObstacle = snapshot.val()[key];
                    let alreadyExists = false;
            
                    let obstacleLength = Game.obstacles.length;
                    
                    for (let i = 0; i < obstacleLength; i++) {
                        if (key === Game.obstacles[i].id) {
                            alreadyExists = true;
                            //console.log(' done');
                        }
                    }
                    
                    if (!alreadyExists) {
                        let newObstacle = new Obstacle(remoteObstacle.x, remoteObstacle.y, remoteObstacle.w, remoteObstacle.h, remoteObstacle.className);
                        newObstacle.id = key;
                        Game.obstacles.push(newObstacle);
                        //console.log(' done pushing');
                    }
                }
                index++;
                setTimeout(process, 0);
            }
        };
        process();
    },

    removePlayerFromRemote: function() {
        this._internal.database().ref('players/' + Game.ron.name)
            .remove();
    },

    checkLocalObstaclesForRemoteExistance: function(snapshot) {
        let obstacleLength = Game.obstacles.length;
        let index = 0;
        let process = function() {
            if (index < obstacleLength) {
                let stillExists = false;
                for (let key in snapshot.val()) {
                    if (snapshot.val().hasOwnProperty(key)) {
                        if (Game.obstacles[index].id === key) {
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

    writeObstacleData: function(x, y, w, h, className) {
        return this._internal.database().ref('obstacles')
            .push({
                x,
                y,
                w,
                h,
                className
            });
    },

    sendChatMessage: function(message) {
        this._internal.database().ref('/chat')
            .push(message);
    },

    setSetting: function(name, val) {
        let newSetting = {};
        let s = {name: name, value: val};
        newSetting[name] = s;
        this._internal.database().ref('/settings')
            .update(newSetting);
    }
};

export default Firebase;
