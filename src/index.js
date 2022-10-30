/* Import section --------------------------------------------------- */
import './styles.scss';
import {todoFactory, projectFactory, userFactory, manageData, manageValidations, manageForm} from './todo.js';
/* ------------------------------------------------------------------ */
// Dom elements we're working on load
const todoHolder    = document.getElementById('todo-holder');  
const projectTitle  = document.querySelector('.project-title');
const btnNewTodo    = document.getElementById('btn-new-todo');
const btnForm       = document.getElementById('btn-form-new-todo');
const btnSort       = document.getElementById('btn-sort');
const inpDate       = document.getElementById('input-date');

const varDate       = new Date();
const today         =`${varDate.getFullYear()}-${(varDate.getMonth() + 1)}-${varDate.getDate()}`;

// for test, we set user and project
const user = userFactory();
const testProject = projectFactory('I wanna be the very best', 'Roadmap to become the best Pokemon trainer that no one ever was');
user.addProject(testProject);




// Listeners
btnNewTodo.addEventListener('click', manageForm.visible); // we add invisible the first time on web load.
btnForm.addEventListener('click', newFormButton);
btnSort.addEventListener('click', () => { 
    testProject.sortToDos();  // We sort the list
    manageData.setBoard(projectTitle, testProject, todoHolder); // we rebuild the board
});



// We set the attribute for the input date with the value of today
inpDate.setAttribute('value', today);
 


// Functions to make the main html work
function newFormButton () {

   if (manageForm.validate()) {
        manageForm.visible();
        manageData.newTodo(testProject, manageForm.getData(), todoHolder); // inserts new task throught manageObjects into the project object.
   }  
    
};


fillForDefault(); // for now to have something visible to work with, we will have this.
function fillForDefault () {
    
    testProject.addToDo(todoFactory('Get your first Pokemon', 'You must choose between Charmander, Squirtle or Bulbasaur. Only losers pick Bulbasaur.','26-10-2022', '0'));
    testProject.addToDo(todoFactory('Get your 8 medals', 'You must give tremendous beating to any guy owning a gym and steal their wallets which contains the medals you\'re looking for and also some cash','26-10-2022', '1'));
    testProject.addToDo(todoFactory('Get throught Victory Road', 'You got to beat every guy who went here to spend the weekend, and also, travel to the other side.','26-10-2022', '2'));
    testProject.addToDo(todoFactory('Face the Elite 4', 'Unless you trained property you\'re the one getting a beat this time. Hope you\'re into BDSM.','26-10-2022', '3'));
    testProject.addToDo(todoFactory('Go catch mewtwo', 'Never use another pokemon for the rest of the game. Just fucking psychic the hell out of everyone.','26-10-2022', '3'));   
    manageData.setBoard(projectTitle, testProject, todoHolder);
}

/*
x 1) Añadir check de hecho/no hecho 
x 2) añadir librería de fechas
x 3) Ordenar los toDos (Poner botón de ordenar/refrescar)
	Si no hecho > sí hecho
		prioridad menor > prioridad mayor
			fecha menor > fecha mayor
4) Hacer popup absoluto para insertar nuevos todos o, en un futuro, editarlos.
5) Poner botón de borrado de ToDos.
6) Poner botón de editado de ToDos.
7) Permitir cambiar de proyecto.
8) Permitir crear proyectos.
9) Visibilizar la descripción de proyectos.
10) añadir librería para guardar datos en local. Ser capaz de guardar y leer en local.
11) ¿Rehacer la interfaz?
*/
