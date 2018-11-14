import Firebase from './firebase-utils';

let Settings = {};

//Pull settings from firebase
Settings.loadLocalSettings = function() {
    //console.log('Loading Local Settings');
    let settings = JSON.parse(window.localStorage.getItem('Settings'));
    for (let key in settings) {
        Settings[key] = settings[key];
    }
};

Settings.setGlobal = function(name, val) {
    Firebase.setSetting(name, val);
};

Settings.setLocal = function(name, val) {
    let settings = JSON.parse(window.localStorage.getItem('Settings'));
    settings[name] = val;
    window.localStorage.setItem('Settings', JSON.stringify(settings));
};

//Regen Settings Cache
Settings.clearLocal = function() {
    window.localStorage.setItem('Settings', JSON.stringify({}));
};

export default Settings;