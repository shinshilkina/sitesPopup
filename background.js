import getData from "./request.js";

const body = document.querySelector('body');

function createList(elem) {
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
    dataExtension();
});

function dataExtension () {
    getData().then( (res) => {
        //write objects to localStorage
        for (let i=0; i< res.length; i++) {
            let dataObj = Object.assign(res[i]);
            Object.assign(dataObj, {count: 0});
            const serialObj = JSON.stringify(dataObj);
            try {
                localStorage.setItem(res[i].name, Object.assign(serialObj));
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Превышен лимит');
                }
            }
        }
        //generate list of cites
        for (let i = 0; i < res.length; i++) {
            createList(res[i]);
        }

    });
    //автообновление содержимого раширения
    setTimeout(dataExtension, 60 * 60 * 1000);
}

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

        if (count < 3) {
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
                            localStorage: localStorage
                        }
                    )
                }
            );
            executing.then();
        }
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    for (let key in localStorage) {
        if (key === name) {
            let str = localStorage[key];
            const siteData = JSON.parse(str);
            const number = siteData["count"] + 10;
            siteData["count"] = number;
            localStorage[key] = JSON.stringify(siteData);

        }
    }
});
