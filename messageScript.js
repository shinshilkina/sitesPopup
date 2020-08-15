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
    const script = document.createElement('script');
    script.textContent = `
        const removePopUp = () => {
            const modal = document.querySelector('.modal');
            modal.remove();
        }
    `;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
    const htmlCode = `
    <div class="modal" style="z-index: 2">
        <div class="modal-body">
            <p>${message}</p>
        </div>
        <div class="modal-footer">
            <button type="button" id="close" class="btn btn-secondary" data-dismiss="modal" onclick=removePopUp()>Close</button>
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

let buttonClose;
debugger
    const find = () => {
        buttonClose = document.querySelector('.btn-secondary');
        buttonClose.addEventListener('click', function (event) {
            alert('clicked!!!!');
        });
    }
