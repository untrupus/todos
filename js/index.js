let tasksList = [];

const saveToLocalStorage = (data) => {
    const dataStr = JSON.stringify(data);
    localStorage.setItem('todos', dataStr);
};

const getFromLocalStorage = () => {
    const todosStr = localStorage.getItem('todos');
    if (todosStr) {
        tasksList = JSON.parse(todosStr);
    } else {
        tasksList = [];
    }
};

const getActiveFromLocalStorage = () => {
    const todosStr = localStorage.getItem('todos');
    if (todosStr) {
        let todos = JSON.parse(todosStr);
        for (let i = 0; i < todos.length; i++) {
            if (!todos[i].done) {
                tasksList.push(todos[i]);
            }
        }
    } else {
        tasksList = [];
    }
};

const getCompletedFromLocalStorage = () => {
    const todosStr = localStorage.getItem('todos');
    if (todosStr) {
        let todos = JSON.parse(todosStr);

        for (let i = 0; i < todos.length; i++) {
            if (todos[i].done) {
                tasksList.push(todos[i]);
            }
        }
    } else {
        tasksList = [];
    }
};

const todosList = document.getElementById('list');

const getTasks = () => {
    if (tasksList.length > 0) {
        for (let i = 0; i < tasksList.length; i++) {
            const newTask = document.createElement('li');
            newTask.className = 'task';
            let checked;
            if (tasksList[i].done) {
                checked = '<p class="checked">&#9745;	</p>'
            } else {
                checked = '<p class="notChecked">&#9745;	</p>'
            }

            newTask.innerHTML = (
                checked + `<p class="text">` +
                tasksList[i].text +
                `</p>
                <button type="button" class="btn" id="edit` + i + `">Edit</button>
                <button type="button" class="btn" id="done` + i + `">Done</button>
                <button type="button" class="btn" id="remove` + i + `">Remove</button>`
            );

            todosList.append(newTask);

            document.getElementById('remove' + i).addEventListener('click', () => {
                todosList.innerHTML = '';
                getFromLocalStorage();
                tasksList.splice(i, 1);
                getTasks();
                saveToLocalStorage(tasksList);
            });

            document.getElementById('edit' + i).addEventListener('click', () => {
                document.getElementById('input').value = tasksList[i].text;
                document.getElementById('editTask').addEventListener('click', () => {
                    const editedTask = {
                        text: document.getElementById('input').value
                    }

                    if (editedTask.text !== '') {
                        todosList.innerHTML = '';
                        getFromLocalStorage();
                        tasksList.splice(i, 1, editedTask);
                        getTasks();
                        saveToLocalStorage(tasksList);
                        document.getElementById('input').value = '';
                    }
                });
            });

            document.getElementById('done' + i).addEventListener('click', () => {

                const editedTask = {
                    text: tasksList[i].text,
                    done: !tasksList[i].done
                }

                todosList.innerHTML = '';
                getFromLocalStorage();
                tasksList.splice(i, 1, editedTask);
                getTasks();
                saveToLocalStorage(tasksList);
            });
        }
    } else {
        todosList.innerHTML = '<h3>There`s nothing here...</h3>'
    }



};

getFromLocalStorage();
getTasks();

document.getElementById('add').addEventListener('click', () => {
    let value = document.getElementById('input').value;

    if (value !== '') {
        tasksList.push({
            text: value,
            done: false
        });
    }

    saveToLocalStorage(tasksList);
    document.getElementById('input').value = '';
    todosList.innerHTML = '';
    getFromLocalStorage();
    getTasks();

});

document.getElementById('all').addEventListener('click', () => {
    todosList.innerHTML = '';
    getFromLocalStorage();
    getTasks();
});

document.getElementById('active').addEventListener('click', () => {
    tasksList = [];
    todosList.innerHTML = '';
    getActiveFromLocalStorage();
    getTasks();
});

document.getElementById('complete').addEventListener('click', () => {
    tasksList = [];
    todosList.innerHTML = '';
    getCompletedFromLocalStorage();
    getTasks();
});

document.getElementById('find').addEventListener('click', () => {
    let word = document.getElementById('findText').value;
    getFromLocalStorage();
    if (word !== '') {
        const result = tasksList.filter(task => task.text === word);
        tasksList = [];
        todosList.innerHTML = '';
        tasksList = tasksList.concat(result);
        getTasks();
        document.getElementById('findText').value = '';
    }
});