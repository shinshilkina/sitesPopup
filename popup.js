class List {
    constructor(listElements) {
        this.listElements = listElements;
    }

    createList(listElements) {
        const container = document.createElement('ul');
        container.className = 'list-group';

        const node = document.createElement('li');
        node.className = 'list-group-item';
        const textNode = document.createTextNode(listElements.name);
        node.href = 'https://' + listElements.domain;
        node.appendChild(textNode);
        node.addEventListener('click', () => {
            const listActions = new ListActions(node.href);
            listActions.clickUrl(listActions.newTabUrl);
        });
        container.append(node);

        document.body.appendChild(container);
    }
}

class ListActions {
    constructor(newTabUrl) {
        this.newTabUrl = newTabUrl;
    }

    clickUrl(newTabUrl) {
        chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.update({
                url: newTabUrl
            });
        });
        return true;
    }
}


document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({cmd: "list"}, (data) => {
        const keys = Object.keys(data);
        for (let key of keys) {
            const newList = new List(data[key]);
            newList.createList(newList.listElements);
        }
    });
});
