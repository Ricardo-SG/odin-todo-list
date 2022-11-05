export const storageData = (() => {

    const storageAvailable = (type) => {
        let storage;
        try {
            storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    };

    const saveUserData = (obj) => {
        console.log('<saveUserData>');
        // console.log('<saveUserData> ' + JSON.stringify(obj.getProjects()));
        // console.log('obj.getProjectNumber: ' + obj.getProjectNumber());
        // console.table(JSON.stringify(obj.getProjects()));
        localStorage.removeItem('userProjects'); 
        console.log('JSON.stringify(obj.getProjects()): ' +JSON.stringify(obj.getProjects()));
        localStorage.setItem('userProjects', JSON.stringify(obj.getProjects()));
        
        
    }

    const loadUserData = () => {
        console.log('<loadUserData>');
        console.log(localStorage.getItem('userProjects'));
        return JSON.parse(localStorage.getItem('userProjects'));
    }

    return {storageAvailable, saveUserData, loadUserData};
})();





