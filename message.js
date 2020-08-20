class Message {

    generatePopUp() {
        let xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", chrome.extension.getURL ("message.html"), false );
        xmlHttp.send( null );
        let inject = document.createElement("div");
        inject.innerHTML = xmlHttp.responseText
        document.body.insertBefore (inject, document.body.firstChild);
        return true;
    }

    closeButtonAction() {
        return document.querySelector('.btn-secondary').addEventListener('click', () => {
            document.querySelector('.modal').remove();
            chrome.runtime.sendMessage({cmd: 'buttonClicked', domain: location.hostname},
                (message) => {
                    console.log(message);
                });
        });
    }

    addStyle() {
        return document.head.insertAdjacentHTML('beforeend',
            '<link rel="stylesheet" type="text/css" href="' +
            chrome.runtime.getURL("message.css") + '">');
    }
}

class ChangeMessage {
    constructor(message) {
        this.message = message;
    }

    changeText(message) {
        const messageTag = document.querySelector('.modal-body-message');
        messageTag.textContent = message;
        return true;
    }
}


chrome.runtime.sendMessage({cmd: 'getMessage', domain: location.hostname},
    (message) => {
        if (message) {
            const currentMessage = new Message();
            currentMessage.generatePopUp();
            currentMessage.addStyle();
            currentMessage.closeButtonAction();

            const changeMessage = new ChangeMessage(message);
            changeMessage.changeText(changeMessage.message);
        }
    });
