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
                dataObj.count = 0; //TODO delete this code
                domains[data[i].domain] = dataObj;
            }
            return domains;
        });
}

function updateList() {
    getSites(domains);
    setTimeout(updateList, 60 * 60 * 1000);
}
updateList();

const getDomains = () => !domains ? getSites() : Promise.resolve(domains);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.cmd === 'list') {
        return getDomains()
            .then((domains) => sendResponse(domains));
    } else if (message.cmd === 'getMessage') {
        return getDomains()
            .then((domains) => {
                let domainRecord = domains[message.domain] || null;
                if (!domainRecord) {
                    domainRecord = domains[message.domain.replace(/^www\./, '')] || null;
                }
                domainRecord.count++;
                sendResponse((domainRecord && domainRecord.count < 3) ? domainRecord.message : '');
            });
    } else if (message.cmd === 'buttonClicked') {
        let domainRecord = domains[message.domain] || null;
        if (!domainRecord) {
            domainRecord = domains[message.domain.replace(/^www\./, '')] || null;
        }
        domainRecord.count = 3;
        sendResponse(domainRecord.count);
    }
});
