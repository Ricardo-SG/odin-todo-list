/* Import section --------------------------------------------------- */
import './styles.scss';
import {todoFactory, projectFactory, userFactory, manageData, manageForm} from './todo.js';
import {storageData} from './saveData.js';
import {thePickOfDestiniy} from './test.js';
/* ------------------------------------------------------------------ */
thePickOfDestiniy();


// variables we're gonna use for index.js
const user          = userFactory(); /* The user */
let   currentProject;
const todoHolder    = document.getElementById('todo-holder');  
const projectTitle  = document.querySelector('.project-title');
const btnNewTodo    = document.getElementById('btn-new-todo');
const btnForm       = document.getElementById('btn-form-new-todo');
const btnSort       = document.getElementById('btn-sort');
//we create the object user, which holds the projects (and the projects the list of to dos)

load();
//fillForDefault();

// functions to load() the index.html
function load() {
    loadUser();
    loadListeners();


    // If the user has at least one project, we set the web with it. If not, we set a default
    if (user.getProjectNumber() > 0) {
        // For now, the user can only have one project
        currentProject = user.getProject(0);
        manageData.setBoard(projectTitle, currentProject, todoHolder);
        
    } else {
        // We should load here a default version of the web. For now, we do nothing
        console.log('nothing to do here');
    }
}

function loadUser() {

    // We check if we can access local storage and if we can, we load data into user from the storage.
    if (storageData.storageAvailable('localStorage')) {
       user.setProjects(storageData.loadUserData());
    }
    else {
        return false;
    }
}

function loadListeners() {

    // Listeners
    btnNewTodo.addEventListener('click', manageForm.visible); // we add invisible the first time on web load.
    btnForm.addEventListener('click', newFormButton);
    btnSort.addEventListener('click', () => { 
        currentProject.sortToDos();  // We sort the list
        manageData.setBoard(projectTitle, currentProject, todoHolder); // we rebuild the board
    });
    futureListeners('.btn-delete', 'click', (e) => { deleteButton(e);}); // for the delete buttons
    futureListeners('.btn-edit', 'click', () => { console.log('pa k kieres saber eso jajaj saludos');}); // for the edit buttons
}


// Functions to make the main html work
function newFormButton () {

   if (manageForm.validate()) {
        manageForm.visible();
        currentProject.addToDo(manageForm.getData());
        currentProject.sortToDos();  // We sort the list
        storageData.saveUserData(user);  // we save the user data since we added a new todo
        manageData.setBoard(projectTitle, currentProject, todoHolder); // we rebuild the board       
   }  
    
};

function deleteButton(event) {
    console.log('<deleteButton>');
    const delBtn = event.target.id;
    const index = parseInt(delBtn.substr(11));
    console.log('delBtn:' +delBtn+'index: '+index);
    
    currentProject.subtractToDo(index);
    currentProject.sortToDos();
    storageData.saveUserData(user);  // we save the user data since we added a new todo
    manageData.setBoard(projectTitle, currentProject, todoHolder); // we rebuild the board        
}

function futureListeners(selector, event, handler) {
    const rootElement = document.querySelector('body'); // cambiar por el board?
    rootElement.addEventListener(event, (e) => {
        let targetElement = e.target;
        let iWantToBreakFree = false;
        while(targetElement != null) {
            if (targetElement.matches(selector)) {
                handler(e);
                targetElement = null; // we break the loop
                console.log('AND I WILL BREAK THE LOOP FOREEEEEVER');
            }
            else {
                console.log('THIS LOOP NEVER ENDS');
                targetElement = targetElement.parentElement;
            }
            
            
        }
    });
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
6) Poner botón de editado de ToDos.
7) Permitir cambiar de proyecto.
8) Permitir crear proyectos.
9) Visibilizar la descripción de proyectos.
x 10) añadir librería para guardar datos en local. Ser capaz de guardar y leer en local.
11) ¿Rehacer la interfaz?
*/
