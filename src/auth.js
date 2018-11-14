let Auth = {};

Auth.init = function() {
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

Auth.success = function(result) {
    Auth.result = result;

    //If no settings obj exists, create it
    if (window.localStorage.getItem('Settings') === '0' || undefined) {
        window.localStorage.setItem('Settings', JSON.stringify({}));
    }
    return false;
};

Auth.fail = function(error) {
    //console.log(error);
};

Auth.bypass = function() {
    Auth.result = {};
    Auth.result.displayName = '' + (10000 * Math.random()).toFixed(0);
    Auth.success(Auth.result);
};

export default Auth;
