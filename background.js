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
    getSites(domains);
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
        domainRecord.count = 100000; //TODO count = 3
        sendResponse(domainRecord.count);
    }else if (message.cmd === 'searchPage') {
        sendResponse(domains);
    }
});

/* TODO
    Код-стиль нормальный. Не используются классы, неудобно
    ориентироваться в коде, тк просто "куча" (в рамках данного объема тз)
     функций, с классами код был бы более структурированный.
    message.js: мне не нравится подход, что в js файле есть строчки
    стилей и тимплейтов, тогда уж нужно было использоввать какой-то
    компонентный подход, а лучше использовать React/Vue, стили можно
    собирать отдельно и грузить в контент скрипты.
*/
