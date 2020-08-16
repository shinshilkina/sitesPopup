let domains = null;

function getSites() {
    return fetch('http://www.softomate.net/ext/employees/list.json', {
        method: 'GET',
        cache: 'reload'
    })
        .then((response) => response.json())
        .then((data) => {
            domains = {};
            for (let i = 0; i < data.length; i++) {
                let dataObj = Object.assign(data[i]);
                dataObj.count = 0;
                domains[data[i].domain] = dataObj;
            }
            return domains;
        });
}

function updateList() {
    getSites();
    setTimeout(updateList, 5000);//60 * 60 * 1000
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
    }
});
