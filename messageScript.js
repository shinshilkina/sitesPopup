function generateHeader() {
    return `
        <style>
            .modal {
            max-width: 30vh;
            max-height: 10vh;
            position: absolute;
            top: 0;
            right: auto;
            left: auto;
            
            border: 1px solid black;
            background-color: azure;
            }
            .modal-body {
               text-align: center;
            }
            .modal-footer {
                margin: 1rem;
                text-align: end;
            }
        </style>
    `;
}

function generatePopUp(message) {
    const htmlCode = `
    <div class="modal" style="z-index: 2">
        <div class="modal-body">
            <p>${message}</p>
        </div>
        <div class="modal-footer">
            <button type="button" id="close" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
    </div>
    `;

    return htmlCode;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    const bodyArea = document.getElementsByTagName('body')[0];
    bodyArea.insertAdjacentHTML('afterbegin', generatePopUp(message.text));
    const headerArea = document.getElementsByTagName('head')[0];
    headerArea.insertAdjacentHTML('afterbegin', generateHeader());
});
//debugger
/*
const port = chrome.runtime.connect('nahkkeilipolgghjgajpbgibpnfgjblo', {name: "closePopup"});
port.postMessage({source: "page", status: "ready"});
*/
function handleCanvas(buttonClose) {
    buttonClose.addEventListener('click', function (event) {
        //debugger

        /*
        chrome.runtime.onConnect.addListener(function (incomingPort) {
            //debugger
            incomingPort.onMessage.addListener(function( msg ){
                port.postMessage( 'button clicked' );
            });
        })
         */
        const modal = document.querySelector('.modal');
        modal.remove();
    });
}

// set up the mutation observer
const myobserver = new MutationObserver(function (mutations, me) {
    // `mutations` is an array of mutations that occurred
    // `me` is the MutationObserver instance
    const buttonClose = document.querySelector('.btn-secondary');
    if (buttonClose) {
        handleCanvas(buttonClose);
        me.disconnect(); // stop observing
        return true;
    }
});

// start observing
myobserver.observe(document, {
    childList: true,
    subtree: true
});


