import getData from "./request.js";

function getSites() {
    const data = getData().then((res) => {
        for (let i = 0; i < res.length; i++) {
            let dataObj = Object.assign(res[i]);
            Object.assign(dataObj, {count: 0});
            //alert('from get lists: ' + JSON.stringify(dataObj));
            const serialObj = JSON.stringify(dataObj);
            try {
                localStorage.setItem(res[i].name, Object.assign(serialObj));
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Превышен лимит');
                }
            }
        }
        return localStorage;
    })
    return data;
}

const responseSites = () => {
    if (localStorage.length == 0) {
        const result = getSites().then((res) => {
            return res;
        });
        return result;
    }
    else {
        //localStorage.clear();
        return localStorage;
    }
}


//не понимаю почему, но работает только когда расширение развернуто...
function updateList() {
    getSites().then((res) => {
        return res;
    });
    setTimeout(updateList,  5000);//60 * 60 * 1000
}
updateList();


export default responseSites();


