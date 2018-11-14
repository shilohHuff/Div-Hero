import Firebase from './firebase-utils';
import Game from './game';

/*  Message Type
    Message = {
        text: "Hello World",
        from: "Cayle", 
        time: new Date()
    }
*/

let Chat = {};

Chat.init = function() {
    Chat.log = [];
    Chat.backgroundColor = 'rgba(100, 100, 100, .3)';
    Chat.textColor = 'white';
    Chat.typing = false;
    Chat.message = '';
    //Initialize the Dom Element
    Chat.element = Game.world.appendChild(document.createElement('div'));
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
    document.onkeyup = function(e) {
        let key = e.key;

        if (key === 'Enter') {
            Chat.typing = !Chat.typing;
            if (Chat.typing === true) {
                Chat.input.innerText = '';
            } else {
                Chat.send(new Chat.Message(Chat.input.innerText, new Date().toString(), Game.ron.name));
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

Chat.keyAllowed = function(key) {
    let bl = ['Shift', 'Backspace', 'Control', 'Alt', 'Tab', 'Meta'];

    for (let s of bl) {
        if (s === key) {
            return false;
        }
    }

    return true;
};
//Render Chat Log as a <p> in the top left corner
Chat.render = function() {
    //Remove all Children
    while (Chat.element.hasChildNodes()) {
        Chat.element.removeChild(Chat.element.lastChild);
    }

    for (let msg of Chat.log) {
        let el = document.createElement('p');
        el.className = 'message';
        let date = new Date(msg.time).getHours() + ':' + new Date(msg.time).getMinutes();
        el.innerText = '[' + date + '] ' + msg.from + ': ' + msg.text;
        Chat.element.appendChild(el);
    }

    Chat.input = document.createElement('p');
    Chat.input.id = 'chatInput';
    Chat.input.style.minHeight = '1em';
    Chat.input.style.backgroundColor = 'rgba(100, 100, 100, .5)';

    let notTyping = !Chat.typing;

    if (notTyping) {
        Chat.input.innerText = 'Press Enter To Type';
    } else {
        Chat.input.innerText = Chat.message;
    }

    Chat.element.appendChild(Chat.input);
};


//Pull updates
Chat.update = function() {
    Chat.render();
};

//Send new message
Chat.send = function(message) {
    if (message.text === '') {
        return;
    }

    Firebase.sendChatMesssage(message);
    
    Chat.message = '';
};

//Message Type
Chat.Message = function(text, time, name) {
    this.text = text;
    this.time = time;
    this.from = name;
};

export default Chat;