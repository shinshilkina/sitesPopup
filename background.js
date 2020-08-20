chrome.browserAction.setIcon({
    path: {
        "19": "icon.png",
        "38": "icon.png",
        "48": "icon.png"

    }
});

let domains = null;

function getSites(prevDomains) {
    return fetch('http://www.softomate.net/ext/employees/list.json', {
        method: 'GET',
        cache: 'reload'
    })
        .then((response) => response.json())
        .then((data) => {
            domains = {};
            for (let i = 0; i < data.length; i++) {
                let dataObj = Object.assign(data[i]);
                if (prevDomains !== null) {
                    for (let key in prevDomains) {
                        if ( dataObj.domain === key) {
                            const elementMatched = prevDomains[key];
                            dataObj.count = elementMatched.count;
                        }
                    }
                } else {
                    dataObj.count = 0;
                }
                domains[data[i].domain] = dataObj;
            }
            return domains;
        });
}

function updateList() {
    getSites(domains).then();
    setTimeout(updateList, 60 * 60 * 1000);
}
updateList();

const getDomains = () => !domains ? getSites() : Promise.resolve(domains);

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const getRecordByDomain = () => {
        return domains[message.domain] || domains[message.domain.replace(/^www\./, '')] || null;
    };

    const domains = await getDomains();
    if (message.cmd === 'list') {
        sendResponse(domains);
    } else if (message.cmd === 'getMessage') {
        const domainRecord = getRecordByDomain();
        sendResponse((domainRecord && domainRecord.count < 3) ? domainRecord.message : '');
    } else if (message.cmd === 'buttonClicked') {
        const domainRecord = getRecordByDomain();
        domainRecord.count = 3;
        sendResponse(domainRecord.count);
    }else if (message.cmd === 'searchPage') {
        sendResponse(domains);
    }
});
