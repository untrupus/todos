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

            const changeTask = (data) => {
                todosList.innerHTML = '';
                getFromLocalStorage();

                if (data) {
                    tasksList.splice(i, 1, data);
                } else {
                    tasksList.splice(i, 1);
                }

                getTasks();
                saveToLocalStorage(tasksList);
            }

            document.getElementById('remove' + i).addEventListener('click', () => {
                changeTask();
            });

            document.getElementById('edit' + i).addEventListener('click', () => {
                document.getElementById('input').value = tasksList[i].text;
                document.getElementById('editTask').addEventListener('click', () => {
                    const editedTask = {
                        text: document.getElementById('input').value
                    }

                    if (editedTask.text !== '') {
                        changeTask(editedTask);
                        document.getElementById('input').value = '';
                    }
                });
            });

            document.getElementById('done' + i).addEventListener('click', () => {
                const editedTask = {
                    text: tasksList[i].text,
                    done: !tasksList[i].done
                }
                changeTask(editedTask);
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

const isComplete = (key, value) => {
    getFromLocalStorage();
    const result = tasksList.filter(task => task[key] === value);
    tasksList = [];
    todosList.innerHTML = '';
    tasksList = tasksList.concat(result);
    getTasks();
};

document.getElementById('active').addEventListener('click', () => {
    isComplete('done', false);
});

document.getElementById('complete').addEventListener('click', () => {
    isComplete('done', true);
});

document.getElementById('find').addEventListener('click', () => {
    let word = document.getElementById('findText').value;
    if (word !== '') {
        isComplete('text', word);
        document.getElementById('findText').value = '';
    }
});