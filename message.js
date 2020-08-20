function changeMessageText(message) {
    const messageTag = document.querySelector('.modal-body-message');
    messageTag.textContent = message;
    return true;
}

function generatePopUp(message) {
    let xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", chrome.extension.getURL ("message.html"), false );
    xmlHttp.send( null );
    let inject = document.createElement("div");
    inject.innerHTML = xmlHttp.responseText
    document.body.insertBefore (inject, document.body.firstChild);

    changeMessageText(message);

    return true;
}

function closeButtonAction() {
    return document.querySelector('.btn-secondary').addEventListener('click', () => {
        document.querySelector('.modal').remove();
        chrome.runtime.sendMessage({cmd: 'buttonClicked', domain: location.hostname},
            (message) => {
            console.log(message);
        });
    });
}

chrome.runtime.sendMessage({cmd: 'getMessage', domain: location.hostname},
    (message) => {
        if (message) {
            generatePopUp(message);
            document.head.insertAdjacentHTML('beforeend',
                '<link rel="stylesheet" type="text/css" href="' +
                chrome.runtime.getURL("message.css") + '">');

            closeButtonAction();
        }
    });
