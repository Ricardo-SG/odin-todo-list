import {projectFactory, todoFactory, userFactory} from './dataObjects.js';
import {parse, format} from 'date-fns';
import {storageData} from './saveData.js';
/* Now we gonna set a controller object */
/* Its mission will be managing the user-project-todo data to create the HTML */
export const manageData = (() => {

    const setBoard = (title, project, node) => {

        const ToDoList     = project.getToDos();

        // 1) We set the title
        if (title != undefined && title != null) {
            title.innerText = project.getTitle();
        }
        

        // 2) We clean the whole div to refill it from new.
        cleanChilds(node); 

        // 3) We refill it with every TODO object we've got in the object Project.
        ToDoList.forEach(toDo => {
            printTodo(toDo, node, project); 
        });

    };

    const setSelector = (user, node, index) => {

        const projectList       = user.getProjects();
        const firstOption       = document.createElement('option');
        const firstOptionText   = document.createTextNode('Admin dashboard');
        const lastOption        = document.createElement('option');
        const lastOptionText    = document.createTextNode('Create new Project');

        // We clean the whole select to refill it's from new.
        cleanChilds(node);

        firstOption.appendChild(firstOptionText);
        firstOption.setAttribute('value', 'Admin dashboard');
        node.appendChild(firstOption);

        // We refill it with every project object we've got in the object Project.
        projectList.forEach(prj => {
            printPrj(prj, node); 
        });

        // We put the "new project" as the last option

        lastOption.appendChild(lastOptionText);
        lastOption.setAttribute('value', 'new-project');
        node.appendChild(lastOption);

        if (index != null && index != undefined && !isNaN(parseInt(index))) {
            node.value = index;
        } else {
            index = null;
        }
        

    };

    const setDashboard = (title, user, node) => {

        title.innerText = 'Admin dashboard';

        cleanChilds(node); // we empty the dashboard holder

        if (user.getProjectNumber() > 0) {
            const projectList = user.getProjects();
            projectList.forEach(prj => {
                printCard(prj, node); // we create the html with the cards for each project
            });
        };
    }

    const setVisible = (node, mode) => {

        const nodeClass = node.className;

        switch(mode) {
        case true:
            if ((node.className).includes('invisible')) {
                node.classList.remove('invisible');
            }
        break;
        case false:
            if (!(node.className).includes('invisible')) {
                node.classList.add('invisible');
            }
        break;
        default:    
            node.classList.toggle('invisible');
        break;
        }
        
    }

    const printCard = (prj, node) => {

        const prjCard      = document.createElement('div');
        const prjCardTitle = document.createElement('H1');
        const prjCardDesc  = document.createElement('p');
        const prjCardHr    = document.createElement('hr');
        const prjCardTodos = document.createElement('ul');
        const prjCardBtns  = document.createElement('div');
        const btnEdit      = document.createElement('button');
        const btnDelete    = document.createElement('button');

        /* The edit and delete button */
        btnEdit.id              = 'prj-btn-edit-'+prj.getId();
        btnEdit.className       = 'prj-btn-edit';
        btnEdit.innerText       = 'Edit this project';
        btnDelete.id            = 'prj-btn-delete-'+prj.getId();
        btnDelete.className     = 'prj-btn-delete';
        btnDelete.innerText     = 'delete this project';

        /* The className of the rest of the elements */
        prjCard.className       = 'prj-card';
        prjCardTitle.className  = 'prj-card-title';
        prjCardDesc.className   = 'prj-card-desc';
        prjCardHr.className     = 'prj-card-separator';
        prjCardTodos.className  = 'prj-todos-list';
        prjCardBtns.className   = 'prj-button-holder';
        
        /* The innertext */
        prjCardTitle.innerText = prj.title;
        prjCardDesc.innerText  = prj.description;


        // we gonna fetch the first three todos
        const todo1 = prj.getToDo(0);
        const todo2 = prj.getToDo(1);
        const todo3 = prj.getToDo(2);

        if (todo1 != undefined && todo1 != null) {
            printTodoSimple(todo1, prjCardTodos);
        }

        if (todo2 != undefined && todo2 != null) {
            printTodoSimple(todo2, prjCardTodos);
        }

        if (todo3 != undefined && todo3 != null) {
            printTodoSimple(todo3, prjCardTodos);
        }

        prjCardBtns.append(btnEdit, btnDelete);

        prjCard.append(prjCardTitle, prjCardDesc, prjCardHr, prjCardTodos, prjCardBtns);
        node.appendChild(prjCard);

    };


    const printTodoSimple = (todo, node) => {

        const todoElement = document.createElement('li');
        todoElement.className = 'prj-todo-element';
        todoElement.innerText    = todo.title;
 

        if (todo.getState() == 'done') {
            todoElement.classList.toggle  ('striked');
        }
        
        node.appendChild(todoElement);

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


    const printTodo = (toDo, node, prj) => {

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
        btnEdit.id              = 'btn-edit-'+toDo.getId();
        btnEdit.className       = 'btn-edit';
        btnEdit.innerText       = 'Edit task';
        btnDelete.id            = 'btn-delete-'+toDo.getId();
        btnDelete.className     = 'btn-delete';
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

        /* this changes the ToDo as done or not done 
        cardCheck.addEventListener('click', () => {
            toDo.toggleState();
            cardCheck.classList.toggle  ('checked');
            cardTitle.classList.toggle  ('striked');
            cardDueDate.classList.toggle('striked');
            cardDesc.classList.toggle   ('striked');
            prj.sortToDos();
            storageData.saveUserData(user);  // we save the user data since we added a new todo
            setBoard(undefined, prj, node); 
        });*/

    }
    return {setBoard, setSelector, setDashboard, cleanChilds, setVisible};
})();

/* managePrjForm manages the form to create new projects */
export const managePrjForm = ( ()=> {

    const divBlocker    = document.getElementById('background-blocker');
    const divform       = document.getElementById("project-div-form");  
    const form          = document.forms['project-form'];
    const title         = document.getElementById('prj-title'); 
    const desc          = document.getElementById('prj-desc');
    const confirmBtn    = document.getElementById('btn-prj-form-confirm');
    const editBtn       = document.getElementById('btn-prj-form-edit');
    let isVisible       = false;

    const validate = () => {

        const title    = form.elements.prjtitle.value;

        if (title == undefined || title == null || title == '' ) {
            return false;
        }
        else {
            return true;
        }
    };

    const getData = () => {

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

    const setForm = (prj) => {

        title.value = prj.title;
        desc.value  = prj.description;

        editBtn.setAttribute('prj-id', prj.getId());

        setVisible(confirmBtn, false); 
        setVisible(editBtn, true);
        
    
    };

    return {validate, visible,getData, setForm}
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
        const title    = form.elements.title.value;

        if (title == undefined || title == null || title == '' ) {
            return false;
        }
        else {
            return true;
        }
    }

    const getData = () => {

        /* We recover each element from the form */
        //const form     = document.forms['todo-form'];
        const dTitle    = form.elements.title.value;
        const dDescr    = form.elements.desc.value;
        const dDueDate  = transformDate(form.elements.date.value, 'yyyy-MM-dd', 'dd-MM-yyyy');
        const dPriority = form.elements.priority.value;
        const dToDo     = todoFactory(dTitle,dDescr,dDueDate,dPriority, undefined, 'undone');
        
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

    const currentClasses = htmlObject.className;
    const currentState   = !currentClasses.includes('invisible');

    if (state != currentState) {
        state?
            htmlObject.classList.remove('invisible'):
            htmlObject.classList.add('invisible');
    }
};