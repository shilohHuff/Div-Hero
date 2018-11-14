let Debug = {};

Debug.conf = {
    timeStamp: true,
    activated: false
};

Debug.time = function(date) {
    return '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ']';
};

//Get Conf From Settings
Debug.init = function() {
    Debug.conf = {};
    Debug.activated = true;
};

Debug.log = function(message, showTimeStamp) {
    if (Debug.activated === true) {
        if (showTimeStamp === true || Debug.showTimeStamp === true) {
            //console.log(Debug.time(new Date()) + ' ' + message);
        } else if (showTimeStamp === false || Debug.conf.timeStamp === false) {
            //console.log(message);
        }
    }
};

Debug.json = function(object) {
    if (Debug.activated === true) {
        if (this.showTimeStamp === true || Debug.conf.showTimeStamp === true) {
            //console.log(Debug.time(new Date()) + ' ' + JSON.stringify(object));
        } else if (this.showTimeStamp === false || Debug.conf.showTimeStamp === false) {
            //console.log(JSON.stringify('message'));
        }
    }
};

export default Debug;