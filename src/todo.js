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

    const getToDos = () => {
        return toDos;
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


    return {title, description, addToDo, getToDos, getTitle, sortToDos};
    
};

/* Its mission is to hold the data relative to the user, by default we'll have one and save data in his local storage */
/* this holds the projects which at the same time hold the todo lists */
export const userFactory = () => {
    const projects = [];

        const addProject = (project) => {
            projects.push(project);
        }

        const getProjects = () => {
            return projects;
        }

     return {addProject,getProjects};
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
            printTodo(toDo, node); 
        });

    };

    const cleanChilds = (node) => {

        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };

    const newTodo = (project, toDo, node) => {
        /* we add to the project a new todo */
        project.addToDo(toDo);
        printTodo(toDo, node);
    }

    const printTodo = (toDo, node) => {

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

    
        /* The Checkbutton */
        cardLabel.className = 'switch';
        cardCheck.setAttribute('type','checkbox');
        cardCheck.id            = 'card-'+toDo.getId();
        cardCheck.className     = 'card-check';
        cardSlider.className    = 'slider round';



        /* All classes (except check) */
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
        visibleDiv.append(cardLabel, clickDiv);
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
    return {setBoard, newTodo};
})();

/* This object will recover the data inserted in the form, validate it, and if everything is okay return a todo object.*/
export const manageForm = (() => {

    const divform       = document.getElementById("div-form");  
    const form          = document.forms['todo-form'];
    const title         = document.getElementById("input-title"); 
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
        const dDueDate  = transformDate(form.elements.date.value);
        const dPriority = form.elements.priority.value;
        const dToDo     = todoFactory(title,descr,dueDate,priority);
        
        return dToDo;

    } 

    const transformDate = (stringDate) => {
        // We transform from YYYY-MM-DD to DD-MM-YYYY, we return as an string.
        const date = parse(stringDate, 'yyyy-MM-dd', new Date());
        return format(date, 'dd-MM-yyyy');
    }

    const visible = () => {
        console.log('<visible>');
        divform.classList.toggle('invisible');
        if (isVisible == true) {
            isVisible = false;
        }
        else {
            isVisible = true;
            console.log('title: ' + title);
            title.focus({focusVisible: true});
        }


    }

    return {validate, getData, visible};

})();

