import responseSites from './getSites.js';

const body = document.querySelector('body');

function createList(elem) {
    if (typeof elem == "string") {
        elem = JSON.parse(elem);
    }
    const container = document.createElement('div');

    const node = document.createElement('div');
    const textNode = document.createTextNode(elem.name);
    node.href = 'https://' + elem.domain;
    node.target = '_blank';
    node.dataset.message = elem.message;
    node.appendChild(textNode);

    node.addEventListener('click', function () {
        clickUrl(node.href, node.dataset.message);
    });
    container.append(node);

    body.appendChild(container);

}

document.addEventListener('DOMContentLoaded', function () {
    const data = responseSites;
    if (data instanceof Promise) {
        data.then((res) => {
            for (let i=0; i< localStorage.length; i++) {
                const key = Object.keys(localStorage)[i];
                createList(localStorage[key]);
            }
        })
    } else {
        for (let i=0; i< localStorage.length; i++) {
            const key = Object.keys(localStorage)[i];
            createList(localStorage[key]);
        }
    }
});


function clickUrl(new_url, message) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
        chrome.tabs.update({
            url: new_url
        });
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    //if page load completed, then generate popup window with message
    let message;
    let count;
    let name;
    if(tab.url !== undefined && changeInfo && changeInfo.status == "complete"
    ){
        for (let key in localStorage) {
            try {
                let str = localStorage[key];
                const siteData = JSON.parse(str);
                if (typeof(siteData["domain"])!== undefined ) {
                    if (tab.url.includes(siteData["domain"])) {
                        message = siteData["message"];
                        count = siteData["count"];
                        name = siteData["name"];
                    }
                }
            } catch (e) {
                console.log('Error: ' + e);
            }
        }

        const maxCount = 100;
        if (count < maxCount) {
            for (let key in localStorage) {
                if (key === name) {
                    let str = localStorage[key];
                    const siteData = JSON.parse(str);
                    const number = siteData["count"] + 1;
                    siteData["count"] = number;
                    localStorage[key] = JSON.stringify(siteData);
                }
            }
            const executing = chrome.tabs.executeScript(
                tabId,
                { file: 'messageScript.js' },
                function() {
                    chrome.tabs.sendMessage(
                        tab.id,
                        {
                            text: message,
                            localStorage: localStorage,
                            tabId: tab.id
                        }
                    )
                }
            );
            executing.then();
        }
    }
});

chrome.runtime.onConnect.addListener(function(port) {
    //debugger
    console.assert(port.name == "closePopup");
    if (port.name === "closePopup") {
        port.onMessage.addListener(function(msg) {
            alert('message delivered!');
        });
    }

});
/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    debugger
    alert('message delivered! text: ' + request);
    /*
    for (let key in localStorage) {
        if (key === name) {
            let str = localStorage[key];
            const siteData = JSON.parse(str);
            const number = siteData["count"] + 10;
            siteData["count"] = number;
            localStorage[key] = JSON.stringify(siteData);

        }
    }
     */
//});
