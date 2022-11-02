/* managePrjForm manages the form to create new projects */
export const managePrjForm = ( ()=> {

    // const divBlocker    = document.getElementById('background-blocker');
    const divform       = document.getElementById("project-div-form");  
    const form          = document.forms['project-form'];
    // const title         = document.getElementById('prj-title'); 
    // const desc          = document.getElementById('prj-desc');
    let isVisible       = false;

    const validate = () => {
        console.log('<validate>');
        const title    = form.elements.title.value;

        if (title == undefined || title == null || title == '' ) {
            return false;
        }
        else {
            return true;
        }
    };

    const cleanData = () => {

        form.reset();
        
        //setVisible(confirmBtn, true); 
        //setVisible(editBtn, false);

    };

    const visible = () => {
        console.log('<visible>');
        divform.classList.toggle('invisible');
        if (isVisible == true) {
            isVisible = false;
            setBlocker(false);
        }
        else {
            cleanData();
            isVisible = true;
            setBlocker(true);
            title.focus({focusVisible: true});
            
        }
    };

    return {validate, visible}
}


)();


/* manageForm manages the ToDo form */
export const manageForm = (() => {

    const divBlocker    = document.getElementById('background-blocker');
    const divform       = document.getElementById('div-form');  
    const form          = document.forms['todo-form'];
    const title         = document.getElementById('input-title'); 
    const dueDate       = document.getElementById('input-date');
    const priority      = document.getElementById('input-priority');
    const desc          = document.getElementById('input-desc');
    const confirmBtn    = document.getElementById('btn-form-confirm');
    const editBtn       = document.getElementById('btn-form-edit');
    //const cancelBtn     = document.getElementById("btn-form-cancel"); not used for now
    let   isVisible     = false;

    const validate = () => {
        console.log('<validate>');
        const title    = form.elements.title.value;

        if (title == undefined || title == null || title == '' ) {
            return false;
        }
        else {
            return true;
        }
    }

    const getData = () => {
        console.log('<getData>');

        /* We recover each element from the form */
        //const form     = document.forms['todo-form'];
        const dTitle    = form.elements.title.value;
        const dDescr    = form.elements.desc.value;
        const dDueDate  = transformDate(form.elements.date.value, 'yyyy-MM-dd', 'dd-MM-yyyy');
        const dPriority = form.elements.priority.value;
        const dToDo     = todoFactory(dTitle,dDescr,dDueDate,dPriority);
        
        return dToDo;

    } 

    const cleanData = () => {

        form.reset();
        dueDate.setAttribute('value', getDateToday());
        setVisible(confirmBtn, true); 
        setVisible(editBtn, false);
        

        

    }

    const transformDate = (stringDate, originFormat, destinyFormat) => {
        // We transform from  origin to destiny, we return as an string.

        const date = parse(stringDate, originFormat, new Date());
        return format(date, destinyFormat);
    }


    const visible = () => {
        console.log('<visible>');
        divform.classList.toggle('invisible');
        if (isVisible == true) {
            isVisible = false;
            setBlocker(false);
        }
        else {
            cleanData();
            isVisible = true;
            setBlocker(true);
            title.focus({focusVisible: true});
            
        }
    };

    const setForm = (todo) => {

        console.log('<setForm> ' +todo);
        console.log('todo.title    : ' + todo.title         );
        console.log('todo.priority : ' + todo.priority      );
        console.log('todo.desc     : ' + todo.description   );
        console.log('todo.dueDate  : ' + todo.dueDate       );
        title.value    = todo.title;
        priority.value = todo.priority;
        desc.value     = todo.description;

        dueDate.setAttribute('value', transformDate(todo.dueDate,'dd-MM-yyyy','yyyy-MM-dd'));
        editBtn.setAttribute('todo-id', todo.getId());

        setVisible(confirmBtn, false); 
        setVisible(editBtn, true);
        
    
    };

    return {validate, getData, visible, setForm};

})();


function getDateToday() {
    // We return yyyy-MM-dd of today
    const varDate = new Date();
    const year    = varDate.getFullYear();
    const month   = varDate.getMonth()+1;
    const day     = parseInt(varDate.getDate()) < 10? '0'+varDate.getDate():varDate.getDate();
    
    return`${year}-${(month)}-${day}`;
};

function setBlocker(activate) {
    if (activate) {
        divBlocker.classList.add('blocker');
    }
    else {
        divBlocker.classList.remove('blocker');
    }

};


const setVisible = (htmlObject, state) => {
    console.log('<setVisible>')
    
    console.log('htmlObject.id: ' + htmlObject.id);
    const currentClasses = htmlObject.className;
    const currentState   = !currentClasses.includes('invisible');

    console.log('currentClasses: ' + currentClasses);
    console.log('currentState  : ' + currentState);
    console.log('state         : ' + state);

    if (state != currentState) {
        state?
            htmlObject.classList.remove('invisible'):
            htmlObject.classList.add('invisible');
    }
};