import {projectFactory, todoFactory} from './dataObjects.js';

/* Now we gonna set a controller object */
/* Its mission will be managing the user-project-todo data to create the HTML */
export const manageData = (() => {

    const setBoard = (title, project, node) => {
 
        const ToDoList     = project.getToDos();

        // 1) We set the title
        title.innerText = project.getTitle();

        // 2) We clean the whole div to refill it's from new.
        cleanChilds(node); 

        // 3) We refill it with every TODO object we've got in the object Project.
        ToDoList.forEach(toDo => {
            printTodo(toDo, node, project); 
        });

    };

    const setSelector = (user, node) => {

        const projectList     = user.getProjects();

        // We clean the whole select to refill it's from new.
        cleanChilds(node);

        // We refill it with every project object we've got in the object Project.
        projectList.forEach(prj => {
            printPrj(prj, node); 
        });

        // We put the "new project" as the last option
        const lastOption        = document.createElement('option');
        const lastOptionText    = document.createTextNode('Create new Project');
        lastOption.appendChild(lastOptionText);
        lastOption.setAttribute('value', 'new-project');
        node.appendChild(lastOption);

    };

    

    const cleanChilds = (node) => {

        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };

    const printPrj = (prj, node) => {

        const newOption  = document.createElement('option');
        const optionText = document.createTextNode(prj.getTitle());
        newOption.appendChild(optionText);
        newOption.setAttribute('value', prj.getId());
        node.appendChild(newOption);

    };


    const printTodo = (toDo, node, project) => {

        const todoCard     = document.createElement('div');
        const visibleDiv   = document.createElement('div');
        const clickDiv     = document.createElement('div');
        const toggleDiv    = document.createElement('div');

        const cardTitle    = document.createElement('div');
        const cardDueDate  = document.createElement('div');
        const cardDesc     = document.createElement('div');
        const cardPriority = document.createElement('div');

        const cardLabel    = document.createElement('label');
        const cardCheck    = document.createElement('input');
        const cardSlider   = document.createElement('span');

        const btnEdit      = document.createElement('button');
        const btnDelete    = document.createElement('button');

    
        /* The Checkbutton */
        cardLabel.className = 'switch';
        cardCheck.setAttribute('type','checkbox');
        cardCheck.id            = 'card-'+toDo.getId();
        cardCheck.className     = 'card-check';
        cardSlider.className    = 'slider round';

        /* The delete and edit button */
        btnDelete.id            = 'btn-delete-'+toDo.getId();
        btnEdit.id              = 'btn-edit-'+toDo.getId();
        btnEdit.className       = 'btn-edit';
        btnDelete.className     = 'btn-delete';
        btnEdit.innerText       = 'Edit task';
        btnDelete.innerText     = 'Delete task';


        /* All classes (except check) and some id. */
        todoCard.className      = 'todo-card';
        visibleDiv.className    = 'main-todo';
        clickDiv.className      = 'click-todo';
        toggleDiv.className     = 'toggle-todo invisible';
        cardTitle.className     = 'card-title';
        cardDueDate.className   = 'card-due-date';
        cardDesc.className      = 'card-description';
        cardPriority.className  = 'priority'; 


        cardTitle.innerText    = toDo.title;
        cardDueDate.innerText  = toDo.dueDate;
        cardDesc.innerText     = toDo.description;
        cardPriority.innerText = toDo.priorityValue();


        // if the checkbutton has to be checked */
        if (toDo.getState() == 'done') {
            cardCheck.checked   = true;
            cardCheck.classList.toggle  ('checked');
            cardTitle.classList.toggle  ('striked');
            cardDueDate.classList.toggle('striked');
            cardDesc.classList.toggle   ('striked');
        }

        
        clickDiv.append(cardTitle, cardDueDate, cardPriority);
        cardLabel.append(cardCheck,cardSlider);
        visibleDiv.append(cardLabel, clickDiv, btnEdit, btnDelete);
        toggleDiv.appendChild(cardDesc);
        todoCard.append(visibleDiv, toggleDiv); 
        node.appendChild(todoCard);    

        /* This makes the ToDo show or hide the description on click */
        clickDiv.addEventListener('click', () => {
            toggleDiv.classList.toggle('invisible');
        });
        toggleDiv.addEventListener('click', () => {
            toggleDiv.classList.toggle('invisible');
        });

        /* this changes the ToDo as done or not done */
        cardCheck.addEventListener('click', () => {
            toDo.toggleState();
            cardCheck.classList.toggle  ('checked');
            cardTitle.classList.toggle  ('striked');
            cardDueDate.classList.toggle('striked');
            cardDesc.classList.toggle   ('striked');
        });

    }
    return {setBoard, setSelector};
})();

/* managePrjForm manages the form to create new projects */
export const managePrjForm = ( ()=> {

    const divBlocker    = document.getElementById('background-blocker');
    const divform       = document.getElementById("project-div-form");  
    const form          = document.forms['project-form'];
    const title         = document.getElementById('prj-title'); 
    // const desc          = document.getElementById('prj-desc');
    let isVisible       = false;

    const validate = () => {
        console.log('<validate>');


        const title    = form.elements.prjtitle.value;

        if (title == undefined || title == null || title == '' ) {
            return false;
        }
        else {
            return true;
        }
    };

    const getData = () => {
        console.log('<getData>');

        /* We recover each element from the form */
        const dTitle    = form.elements.prjtitle.value;
        const dDescr    = form.elements.prjdesc.value;
        
        return projectFactory(dTitle,dDescr);

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
            setBlocker(divBlocker, false);
        }
        else {
            cleanData();
            isVisible = true;
            setBlocker(divBlocker, true);
            title.focus({focusVisible: true});
            
        }
    };

    return {validate, visible,getData}
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
            setBlocker(divBlocker,false);
        }
        else {
            cleanData();
            isVisible = true;
            setBlocker(divBlocker,true);
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

function setBlocker(divToBlock, activate) {
    if (activate) {
        divToBlock.classList.add('blocker');
    }
    else {
        divToBlock.classList.remove('blocker');
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