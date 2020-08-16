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
            const bodyArea = document.getElementsByTagName('body')[0];
            bodyArea.insertAdjacentHTML('afterbegin', generatePopUp(message));
            const headerArea = document.getElementsByTagName('head')[0];
            headerArea.insertAdjacentHTML('afterbegin', generateHeader());

            closeButtonAction();
        }
    });
