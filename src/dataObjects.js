import { parse, isAfter } from 'date-fns';

/* this is an exercise, we gonna be simples, each todo will have:
1) The title ("Remember to take a shower today")
2) The description ("Taking shower is important cause after your walk you are too sweaty and you smell bad and that makes it hard for your partner to sleep at your side")
3) The dueDate (Today, DD-MM-YYYY)
4) Priority, a number from 0 to 9, being 9 highes priority and 9 lowest.
*/

/* Its mission is to hold the data relative to the todos */
export const todoFactory = (
  title,
  description,
  dueDate,
  priority,
  idNumber,
  state
) => {
  const getId = () => {
    return idNumber;
  };

  const setId = (id) => {
    idNumber = id;
  };

  const getState = () => {
    return state;
  };

  const toggleState = () => {
    if (state === 'done') {
      state = 'undone';
    } else {
      state = 'done';
    }
  };

  const priorityValue = () => {
    switch (priority) {
      case '0':
        return 'low';
      case '1':
        return 'medium';
      case '2':
        return 'high';
      case '3':
        return 'critical';
      default:
        return 0;
    }
  };

  return {
    title,
    description,
    dueDate,
    priority,
    get state() {
      return state;
    },
    setId,
    getId,
    getState,
    toggleState,
    priorityValue,
  };
};

/* Its mission is to hold the data relative to one project, which contain the ToDos */
export const projectFactory = (title, description) => {
  const toDos = [];
  let idNumber;

  const getId = () => {
    return idNumber;
  };

  const setId = (index) => {
    idNumber = index;
  };

  const addToDo = (todo) => {
    todo.setId(toDos.length);
    toDos.push(todo);
  };

  const removeToDo = (index) => {
    toDos.splice(index, 1);

    for (let i = index; i < toDos.length; i++) {
      toDos[i].setId(i); /* We adjust the ID of the todos */
    }
  };

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
    toDos.sort((a, b) => {
      const compStates = compareState(a, b);

      if (compStates !== 0) return compStates;
      else {
        const compPriority = comparePriority(a, b);

        if (compPriority !== 0) return compPriority;
        else {
          return compareTime(a, b);
        }
      }
    });

    // we got to rearrange the ID of the todo
    // Id should be the same as the index in the array
    for (let i = 0; i < toDos.length; i++) {
      toDos[i].setId(i);
    }
  };

  const compareState = (a, b) => {
    if (a.getState() === 'undone' && b.getState() === 'done') {
      return -1;
    } else if (a.getState() === 'done' && b.getState() === 'undone') {
      return +1;
    }
    return 0;
  };

  const comparePriority = (a, b) => {
    if (b.priority - a.priority > 0) {
      return +1;
    } else if (b.priority - a.priority < 0) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareTime = (a, b) => {
    // We parse the string of due date to real object date
    const date1 = parse(a.dueDate, 'dd-MM-yyyy', new Date());
    const date2 = parse(b.dueDate, 'dd-MM-yyyy', new Date());

    if (isAfter(date1, date2)) {
      return +1;
    } else if (isAfter(date2, date1)) {
      return -1;
    }
    return 0;
  };

  return {
    title,
    description,
    toDos,
    getId,
    setId,
    addToDo,
    removeToDo,
    getToDos,
    getToDo,
    setToDos,
    getTitle,
    sortToDos,
  };
};

/* Its mission is to hold the data relative to the user, by default we'll have one and save data in his local storage */
/* this holds the projects which at the same time hold the todo lists */
export const userFactory = () => {
  const projects = [];

  const addProject = (project, index) => {
    if (!isNaN(parseInt(index))) {
      // si el parámetro index llega y es numérico
      project.setId(index);
      projects.splice(index, 0, project);
    } else {
      project.setId(projects.length);
      projects.push(project);
    }

    return project;
  };

  const getProjectNumber = () => {
    return projects.length;
  };

  const getProjects = () => {
    return projects;
  };

  const setProjects = (projectList) => {
    // The project List we receive is a parsed JSON which only have string values.
    // we create projects and todos with those values efectively restoring the object data and functionality

    projectList.forEach((prj) => {
      const newPrj = projectFactory(prj.title, prj.description);
      prj.toDos.forEach((todo) => {
        const newToDo = todoFactory(
          todo.title,
          todo.description,
          todo.dueDate,
          todo.priority,
          todo.idNumber,
          todo.state
        );
        newPrj.addToDo(newToDo);
      });

      projects.push(newPrj);
    });
  };

  const getProject = (index) => {
    return projects[index];
  };

  const setProjectsId = () => {
    // for now to work well we're gonna manually assign the id's
    for (let i = 0; i < projects.length; i++) {
      projects[i].setId(i);
    }
  };

  const removeProject = (index) => {
    projects.splice(index, 1);

    for (let i = index; i < projects.length; i++) {
      projects[i].setId(i); /* We adjust the ID of the todos */
    }
  };

  return {
    addProject,
    getProjectNumber,
    getProjects,
    setProjects,
    getProject,
    setProjectsId,
    removeProject,
  };
};
