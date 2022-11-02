import { parse, format, isAfter } from 'date-fns';

/* this is an exercise, we gonna be simples, each todo will have:
1) The title ("Remember to take a shower today")
2) The description ("Taking shower is important cause after your walk you are too sweaty and you smell bad and that makes it hard for your partner to sleep at your side")
3) The dueDate (Today, DD-MM-YYYY)
4) Priority, a number from 0 to 9, being 9 highes priority and 9 lowest.
*/

/* Its mission is to hold the data relative to the todos */
export const todoFactory = (title, description, dueDate, priority) => {
    let idNumber;
    let state = 'undone';
    
    const getId = () => {
        return idNumber;
    };

    const setId = (id) => {
        idNumber = id;
    };

    const getState = () => {
        return state;
    }

    const toggleState = () => {

        if (state == 'done') {
            state = 'undone';
        } else {
            state = 'done';
        }

    }

    const priorityValue = () => {

        switch(priority) {
            case '0': return 'low';       break;
            case '1': return 'medium';    break;
            case '2': return 'high';      break;
            case '3': return 'critical';  break;
            default: return 0;
        };
   

    }

    return {idNumber, title, description, dueDate, priority, 
            setId, getId, getState, toggleState, priorityValue};
};

/* Its mission is to hold the data relative to one project, which contain the ToDos */
export const projectFactory = (title, description) => {

    const toDos = [];

    const addToDo = (todo) => {
        todo.setId(toDos.length);
        toDos.push(todo);
    };

    const subtractToDo = (index) => {
        console.log('<subtractToDo> ' +index );
        console.log('before --- ');
        console.table(toDos);
        
        toDos.splice(index, 1);
        console.log('middle --- ');
        console.table(toDos);
        for (let i=index;i<toDos.length;i++) {
            toDos[i].setId(i); /* We adjust the ID of the todos */
        }

        console.log('after --- ');
        console.table(toDos);
    }
    const getToDos = () => {
        return toDos;
    };

    const getToDo = (index) => {
        return toDos[index];
    };


    const setToDos = (toDos) => {
        toDos.push(toDos);
    };

    const getTitle = () => {
        return title;
    };

    const sortToDos = () => {

        toDos.sort(
            (a,b) => {

            
            const compStates = compareState(a,b);
            
            if (compStates != 0) return compStates;
            else {
            
                const compPriority = comparePriority(a,b);
            
                if (compPriority != 0) return compPriority;
                else {
            
                    return compareTime(a,b);
                }
            }   

            }
        ); 

        // we got to rearrange the ID of the todo
        // Id should be the same as the index in the array
        for (let i=0;i<toDos.length;i++) {
            toDos[i].setId(i);
        }

    }

    const compareState = (a,b) => {


        if (a.getState() == 'undone' && b.getState() == 'done') {
            return -1; 
        }
        else if (a.getState() == 'done' && b.getState() == 'undone') {
            return +1;
        }
        return 0;
    }

    const comparePriority = (a,b) => {

        if (b.priority - a.priority > 0) { 
            return +1;
        }
        else if (b.priority - a.priority < 0) {
            return -1;
        }
        else {
            return 0;
        }

    }

    const compareTime = (a,b) => {
        // We parse the string of due date to real object date
        const date1 = parse(a.dueDate, 'dd-MM-yyyy', new Date());
        const date2 = parse(b.dueDate, 'dd-MM-yyyy', new Date());

        if (isAfter(date1, date2)) {
            return +1
        }
        else if (isAfter(date2, date1)) {
            return -1;
        }
        return 0;
    }


    return {title, description, toDos, addToDo, subtractToDo, getToDos, getToDo, setToDos, getTitle, sortToDos};
    
};

/* Its mission is to hold the data relative to the user, by default we'll have one and save data in his local storage */
/* this holds the projects which at the same time hold the todo lists */
export const userFactory = () => {
    const projects = [];

        const addProject = (project) => {
            projects.push(project);
        }
        const getProjectNumber = () => {
            return projects.length;
        }

        const getProjects = () => {
            return projects;
        }

        const setProjects = (projectList) => {
            // to clean the projects array --> projects.splice(0,projects.length);

            // console.log('projectList: ' + projectList);
            // console.table(projectList);

            projectList.forEach(prj => {
                let newPrj = projectFactory(prj.title, prj.description);
                prj.toDos.forEach(todo => {
                    // console.table(todo);
                    let newToDo = todoFactory(todo.title, todo.description, todo.dueDate, todo.priority);
                    newPrj.addToDo(newToDo);
                })

                //newPrj.setToDos = prj.toDos;
                projects.push(newPrj);

            })
            
        }

        const getProject = (index) => {
            return projects[index];
        }



     return {addProject, getProjectNumber, getProjects, setProjects, getProject};
};


/* Now we gonna set a controller object */
/* Its mission will be managing the user-project-todo data to create the HTML */
export const manageData = (() => {

    const setBoard = (title, project, node) => {
 
        const ToDoList     = project.getToDos();

        // 1) We set the title
        title.innerText = project.getTitle();

        // 2) We clean the whole div to refill it's from new.
        cleanChilds(node); /* have to code this */

        // 3) We refill it with every TODO object we've got in the object Project.
        ToDoList.forEach(toDo => {
            printTodo(toDo, node, project); 
        });

    };

    const cleanChilds = (node) => {

        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
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
    return {setBoard};
})();

/* This object will recover the data inserted in the form, validate it, and if everything is okay return a todo object.*/
export const manageForm = (() => {

    const divBlocker    = document.getElementById('background-blocker');
    const form          = document.forms['todo-form'];
    const divform       = document.getElementById("div-form");  
    const title         = document.getElementById("input-title"); 
    const dueDate       = document.getElementById("input-date");
    const priority      = document.getElementById("input-priority");
    const desc          = document.getElementById("input-desc");
    const confirmBtn    = document.getElementById("btn-form-confirm");
    const editBtn       = document.getElementById("btn-form-edit");
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

    const setBlocker = (activate) => {
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
/*
        if (state != currentState) {
            if (state) {
                console.log('remove invisible');
                htmlObject.classList.remove('invisible');
                console.log('htmlObject.className: '+ htmlObject.className);

            } else {
                console.log('remove invisible');
                htmlObject.classList.remove('invisible');
                console.log('htmlObject.className: '+ htmlObject.className);
            }
        }*/

    }

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
        
    
    }

    return {validate, getData, visible, setForm};

})();


function getDateToday() {
    // We return yyyy-MM-dd of today
    const varDate = new Date();
    const year    = varDate.getFullYear();
    const month   = varDate.getMonth()+1;
    const day     = parseInt(varDate.getDate()) < 10? '0'+varDate.getDate():varDate.getDate();
    
    return`${year}-${(month)}-${day}`;
}


