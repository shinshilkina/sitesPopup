const body = document.querySelector('body');

function createList(elem) {
    const container = document.createElement('div');

    const node = document.createElement('a');
    const textNode = document.createTextNode(elem.name);
    node.href = 'https://' + elem.domain;
    node.appendChild(textNode);
    node.addEventListener('click', () => clickUrl(node.href));
    container.append(node);

    body.appendChild(container);
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({cmd: "list"}, (data) => {
        const keys = Object.keys(data);
        for (let key of keys) {
            createList(data[key]);
        }
    });
});

function clickUrl(new_url) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
        chrome.tabs.update({
            url: new_url
        });
    });
    return false;
}
