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
const dashboardDiv      = document.getElementById('dashboard-div');  
const projectTitle      = document.querySelector('.project-title');

/* The much many buttons we have */
/* The buttons of the admin dashboard */

/* The three buttons that govern the new/edit project form */
const btnPrjConfirm     = document.getElementById('btn-prj-form-confirm');  
const btnPrjEdit        = document.getElementById('btn-prj-form-edit');  
const btnPrjCancel      = document.getElementById('btn-prj-form-cancel');  

/* The three buttons that govern the new/edit to do form */
const btnConfirmForm    = document.getElementById('btn-form-confirm');
const btnEditForm       = document.getElementById('btn-form-edit');
const btnCancelForm     = document.getElementById('btn-form-cancel');

/* The new buttons to initiate a TODO in the todo-holder or a project in the dashboard */
const btnNewPrj         = document.getElementById('btn-new-prj');
const btnNewTodo        = document.getElementById('btn-new-todo');


load();



function load() {
    loadUser();
    loadListeners();


    setDashboard();
    setSelector();

}

function loadUser() {

    // We check if we can access local storage and if we can, we load data into user from the storage.
    if (storageData.storageAvailable('localStorage')) {
        if (user.getProjectNumber > 0) {   
            user.setProjects(storageData.loadUserData());
            user.setProjectsId();
        }
    }
    else {
        return false;
    }
}

function loadListeners() {

    /* Listeners related to manage projects */
    projectSelect.addEventListener ('change', projectSelector      );
    btnNewPrj.addEventListener     ('click',  btnNewProject        );
    btnPrjConfirm.addEventListener ('click' , confirmPrjFormButton );
    btnPrjEdit.addEventListener    ('click' , editPrjFormButton    );
    btnPrjCancel.addEventListener  ('click' , cancelPrjFormButton  );

    futureListeners('dashboard-div', '.prj-btn-delete', 'click', (e) => { deletePrjButton(e) }); // for the delete buttons in the ToDos
    futureListeners('dashboard-div', '.prj-btn-edit',   'click', (e) => { editPrjButton(e)   }); // for the edit buttons in the ToDos


    /* Listeners related to manage ToDo's inside a project */
    btnNewTodo.addEventListener    ('click', addFormButton    ); 
    btnConfirmForm.addEventListener('click', confirmFormButton);
    btnEditForm.addEventListener   ('click', editFormButton   );
    btnCancelForm.addEventListener ('click', cancelFormButton );
    
    futureListeners('todo-holder', '.card-check', 'click', (e) => { checkToDo(e)   }); // for the edit buttons in the ToDos
    futureListeners('todo-holder', '.btn-delete', 'click', (e) => { deleteToDoButton(e) }); // for the delete buttons in the ToDos
    futureListeners('todo-holder', '.btn-edit',   'click', (e) => { editToDoButton(e)   }); // for the edit buttons in the ToDos

}

function futureListeners(idnode, selector, event, handler) {
    const rootElement = document.getElementById(idnode); 
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

function checkToDo(event) {
    const checkBtn = event.target.id;
    const index = parseInt(checkBtn.substr(5));
    
    // We recover the todo whose checkbutton triggered the event
    const toDo = currentProject.getToDo(index);

    // We instruct to toggle it's done/undone state in the object
    toDo.toggleState();

    // We sort the whole ToDo arrays of the project
    currentProject.sortToDos();

    // we save the user data since we changed the data
    storageData.saveUserData(user); 

    // We reset the board
    setBoard();

}

function confirmPrjFormButton() {

    if (managePrjForm.validate()) {
        managePrjForm.visible();

        currentProject = user.addProject(managePrjForm.getData());
        storageData.saveUserData(user);  // we save the user data since we added a new project
        setSelector(currentProject.getId());
        setBoard();
    }
    
    
};

function editPrjFormButton() {


    if (managePrjForm.validate()) {
        const index = btnPrjEdit.getAttribute('prj-id');

        user.removeProject(index);
        user.addProject(managePrjForm.getData(), index);
        managePrjForm.visible();
        storageData.saveUserData(user);
        setSelector();
        setDashboard();
    }
};

function cancelPrjFormButton() {
    managePrjForm.visible();
};
    

function projectSelector() {

    const selectedValue = projectSelect.value;

    if (!isNaN(parseInt(selectedValue))) {
        currentProject = user.getProject(parseInt(selectedValue));     
        setBoard();
    }
    else {
        switch(selectedValue) {
            case 'Admin dashboard': 
                setDashboard();
            break;
            case 'new-project': // we show form to start a new project
                btnNewProject()
            break;
            default: // we do nothing as nothing shall we do
            break;
        }
    }
    
};
function btnNewProject() {

    manageData.setVisible(btnPrjConfirm, true); 
    manageData.setVisible(btnPrjEdit, false);
    managePrjForm.visible();
}

function setSelector(index) {

    manageData.setSelector(user, projectSelect, index);
}

function setBoard() {
    cleanBoardContent('dashboard');
    manageData.setBoard(projectTitle, currentProject, todoHolder);
}

function setDashboard() {
    cleanBoardContent('todo-holder');
    manageData.setDashboard(projectTitle, user, dashboardDiv);
}


function addFormButton() {
    manageForm.visible();
};

function confirmFormButton () {

   if (manageForm.validate()) {
        manageForm.visible();
        currentProject.addToDo(manageForm.getData());
        currentProject.sortToDos();  // We sort the list
        storageData.saveUserData(user);  // we save the user data since we added a new todo
        setBoard();      
   }  
    
};

 function editFormButton(event) {

    
    if (manageForm.validate()) {
        const index = btnEditForm.getAttribute('todo-id');

        currentProject.removeToDo(index);
        currentProject.addToDo(manageForm.getData());
        currentProject.sortToDos();  // We sort the list
        manageForm.visible();
        storageData.saveUserData(user);
        setBoard();
    }
    
};

 function cancelFormButton () {
    manageForm.visible();    
 };

function deleteToDoButton(event) {

    const delBtn = event.target.id;
    const index = parseInt(delBtn.substr(11));
    
    currentProject.removeToDo(index);
    currentProject.sortToDos();
    storageData.saveUserData(user);  // we save the user data since we added a new todo
    setBoard();      
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

function deletePrjButton(event) {
    console.log('<deletePrjButton>');
    const delBtn = event.target.id;
    const index = parseInt(delBtn.substr(15));
    console.log('index: ' +index);
    user.removeProject(index);
    storageData.saveUserData(user);  // we save the user data since we made a change
    setSelector();
    setDashboard();


};

function editPrjButton(event) {
    console.log('<editPrjButton>');
    
    const editBtn = event.target.id;
    const index   = parseInt(editBtn.substr(13));
    const prj     = user.getProject(index);
    managePrjForm.visible();
    managePrjForm.setForm(prj);

};

function cleanBoardContent(type) {
    
    // We are lazy comfy programmers and this is the fastest to obscure the part of the web we don't want to be seen
    switch(type) {
        case 'dashboard':
            manageData.cleanChilds(dashboardDiv);
            manageData.setVisible(dashboardDiv, false);
            manageData.setVisible(btnNewPrj,    false);
            manageData.setVisible(todoHolder,   true);
            manageData.setVisible(btnNewTodo,   true);
        break;
        break;
        case 'todo-holder':
            manageData.cleanChilds(todoHolder);
            manageData.setVisible(dashboardDiv, true);
            manageData.setVisible(btnNewPrj,    true);
            manageData.setVisible(todoHolder,   false);
            manageData.setVisible(btnNewTodo,   false);
        default:
        break;
    }
}


    


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
x 7) Permitir cambiar de proyecto.
x 8) Permitir crear proyectos.
x 9) añadir librería para guardar datos en local. Ser capaz de guardar y leer en local.
x10) Crear Admin Dashboard
x11) Permitir borrar proyectos
x12) Permitir editar proyectos
x13) Visibilizar la descripción de proyectos.
14) ¿Rehacer la interfaz?
*/

