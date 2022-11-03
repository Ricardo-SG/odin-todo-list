/* Import section --------------------------------------------------- */
import './styles.scss';
import {todoFactory, projectFactory, userFactory} from './dataObjects.js';
import {manageForm, managePrjForm, manageData} from './manageDOM.js'
import {storageData} from './saveData.js';
/* ------------------------------------------------------------------ */



// variables we're gonna use for index.js
const user              = userFactory(); /* The user */
let   currentProject;
const projectSelect     = document.getElementById('project-selector');
const todoHolder        = document.getElementById('todo-holder');  
const projectTitle      = document.querySelector('.project-title');
const btnPrjConfirm     = document.getElementById('btn-prj-form-confirm');  
const btnPrjEdit        = document.getElementById('btn-prj-form-edit');  
const btnPrjCancel      = document.getElementById('btn-prj-form-cancel');  
const btnNewTodo        = document.getElementById('btn-new-todo');
const btnConfirmForm    = document.getElementById('btn-form-confirm');
const btnEditForm       = document.getElementById('btn-form-edit');
const btnCancelForm     = document.getElementById('btn-form-cancel');


load();



function load() {
    loadUser();
    loadListeners();


    // If the user has at least one project, we set the web with it. If not, we set a default
    if (user.getProjectNumber() > 0) {
        // For now, the user can only have one project
        currentProject = user.getProject(0);
        manageData.setBoard(projectTitle, currentProject, todoHolder);
        manageData.setSelector(user, projectSelect);
        
    } else {
        // We should load here a default version of the web. For now, we do nothing
        console.log('nothing to do here');
    }
}

function loadUser() {

    // We check if we can access local storage and if we can, we load data into user from the storage.
    if (storageData.storageAvailable('localStorage')) {
       user.setProjects(storageData.loadUserData());
       user.setProjectsId();
    }
    else {
        return false;
    }
}

function loadListeners() {

    /* Listeners related to manage projects */
    projectSelect.addEventListener ('change', projectSelector );
    btnPrjConfirm.addEventListener ('click' , confirmPrjButton);
    btnPrjEdit.addEventListener    ('click' , editPrjButton   );
    btnPrjCancel.addEventListener  ('click' , cancelPrjButton );


    /* Listeners related to manage ToDo's inside a project */
    btnNewTodo.addEventListener    ('click', addFormButton    ); 
    btnConfirmForm.addEventListener('click', confirmFormButton);
    btnEditForm.addEventListener   ('click', editFormButton   );
    btnCancelForm.addEventListener ('click', cancelFormButton );

    futureListeners('.btn-delete', 'click', (e) => { deleteToDoButton(e) }); // for the delete buttons in the ToDos
    futureListeners('.btn-edit',   'click', (e) => { editToDoButton(e)   }); // for the edit buttons in the ToDos

}

function futureListeners(selector, event, handler) {
    const rootElement = document.getElementById('todo-holder'); 
    rootElement.addEventListener(event, (e) => {
        let targetElement = e.target;
        let iWantToBreakFree = false;
        while(targetElement != null) {
            if (targetElement.matches(selector)) {
                handler(e);
                return;
            }
            else {
                targetElement = targetElement.parentElement;
            }
            
            
        }
    });
};

function confirmPrjButton() {
    console.log('confirm project');
    if (managePrjForm.validate()) {
        showProjectForm();
        user.addProject(managePrjForm.getData());
        storageData.saveUserData(user);  // we save the user data since we added a new project
        manageData.setSelector(user, projectSelect);
    }
    
    
};

function editPrjButton() {
    console.log('edit project');
};

function cancelPrjButton() {
    showProjectForm();
};
    
function projectSelector() {
    console.log('projectSelector');
    const selectedValue = projectSelect.value;

    console.log('selectedValue: ' + selectedValue);

    if (!isNaN(parseInt(selectedValue))) {
        //loadProject(parseInt(selectedValue));     not for now    for now 
        console.log('yippi ka yei hijos de puta');
    }
    else {
        switch(selectedValue) {
            case 'select-text': // we do nothing
            break;
            case 'new-project': // we show form to start a new project
               // startNewProject(); not for now
               showProjectForm();
            break;
            default: // we do nothing as nothing shall we do
            break;
        }
    }
    
};

// function loadProject(index) {
    
//}
function showProjectForm() {
    managePrjForm.visible();

};

function addFormButton() {
    manageForm.visible();
};


function confirmFormButton () {

   if (manageForm.validate()) {
        manageForm.visible();
        currentProject.addToDo(manageForm.getData());
        currentProject.sortToDos();  // We sort the list
        storageData.saveUserData(user);  // we save the user data since we added a new todo
        manageData.setBoard(projectTitle, currentProject, todoHolder); // we rebuild the board       
   }  
    
};


 function editFormButton(event) {
    console.log('<editFormButton>');
    
    if (manageForm.validate()) {
        const index = btnEditForm.getAttribute('todo-id');
        console.log('index  : ' +index);
        currentProject.subtractToDo(index);
        currentProject.addToDo(manageForm.getData());
        currentProject.sortToDos();  // We sort the list
        manageForm.visible();
        storageData.saveUserData(user);
        manageData.setBoard(projectTitle, currentProject, todoHolder); // we rebuild the board
    }
    
};

 function cancelFormButton () {
    manageForm.visible();    
 };



function deleteToDoButton(event) {
    console.log('<deleteToDoButton>');
    const delBtn = event.target.id;
    const index = parseInt(delBtn.substr(11));
    console.log('delBtn:' +delBtn+'index: '+index);
    
    currentProject.subtractToDo(index);
    currentProject.sortToDos();
    storageData.saveUserData(user);  // we save the user data since we added a new todo
    manageData.setBoard(projectTitle, currentProject, todoHolder); // we rebuild the board        
};

function editToDoButton(event) {
    console.log('<editToDoButton>');
    
    const editBtn = event.target.id;
    const index   = parseInt(editBtn.substr(9));
    const todo    = currentProject.getToDo(index);

    console.log('editBtn: ' +editBtn);
    console.log('index  : ' +index);
    console.log('todo   : ' +todo );


    manageForm.visible();       // always makes edit button invisible and confirm button visible
    manageForm.setForm(todo);   // always makes edit button visible   and confirm button invisible

};




    


// for test, we set user and project

//user.addProject(testProject);
/*
// fillForDefault(); // for now to have something visible to work with, we will have this.*/
// function fillForDefault () {
    
//     const testProject = projectFactory('I wanna be the very best', 'Roadmap to become the best Pokemon trainer that no one ever was');
//     testProject.addToDo(todoFactory('Get your first Pokemon', 'You must choose between Charmander, Squirtle or Bulbasaur. Only losers pick Bulbasaur.','26-10-2022', '0'));
//     testProject.addToDo(todoFactory('Get your 8 medals', 'You must give tremendous beating to any guy owning a gym and steal their wallets which contains the medals you\'re looking for and also some cash','26-10-2022', '1'));
//     testProject.addToDo(todoFactory('Get throught Victory Road', 'You got to beat every guy who went here to spend the weekend, and also, travel to the other side.','26-10-2022', '2'));
//     testProject.addToDo(todoFactory('Face the Elite 4', 'Unless you trained property you\'re the one getting a beat this time. Hope you\'re into BDSM.','26-10-2022', '3'));
//     testProject.addToDo(todoFactory('Go catch mewtwo', 'Never use another pokemon for the rest of the game. Just fucking psychic the hell out of everyone.','26-10-2022', '3'));   
//     user.addProject(testProject);
//     //manageData.setBoard(projectTitle, testProject, todoHolder);
//     // console.log('user: ' + user);
//     // console.table(user.getProjects());
//     // console.log('--> user.getProjectNumber: ' +user.getProjectNumber());
//     //storageData.saveUserData(user); // test
// }

// function storageAvailable(type) {
//     let storage;
//     try {
//         storage = window[type];
//         const x = '__storage_test__';
//         storage.setItem(x, x);
//         storage.removeItem(x);
//         return true;
//     }
//     catch (e) {
//         return e instanceof DOMException && (
//             // everything except Firefox
//             e.code === 22 ||
//             // Firefox
//             e.code === 1014 ||
//             // test name field too, because code might not be present
//             // everything except Firefox
//             e.name === 'QuotaExceededError' ||
//             // Firefox
//             e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
//             // acknowledge QuotaExceededError only if there's something already stored
//             (storage && storage.length !== 0);
//     }
// }
/*
x 1) Añadir check de hecho/no hecho 
x 2) añadir librería de fechas
x 3) Ordenar los toDos (Poner botón de ordenar/refrescar)
	Si no hecho > sí hecho
		prioridad menor > prioridad mayor
			fecha menor > fecha mayor
x 4) Hacer popup absoluto para insertar nuevos todos o, en un futuro, editarlos.
x 5) Poner botón de borrado de ToDos.
x 6) Poner botón de editado de ToDos.
7) Permitir cambiar de proyecto.
8) Permitir crear proyectos.
9) Visibilizar la descripción de proyectos.
x 10) añadir librería para guardar datos en local. Ser capaz de guardar y leer en local.
11) ¿Rehacer la interfaz?
*/
