model = {
    tasksList: [],
    todosList: document.getElementById('list')
}

view = {
    getTasks: function () {
        if (model.tasksList.length > 0) {
            for (let i = 0; i < model.tasksList.length; i++) {
                const newTask = document.createElement('li');
                newTask.className = 'task';
                let checked;
                let done;
                if (model.tasksList[i].done) {
                    checked = '<p class="checked">&#9745;	</p>'
                    done = 'Open'
                } else {
                    checked = '<p class="notChecked">&#9745;	</p>'
                    done = 'Done'
                }

                newTask.innerHTML = (
                    checked + `<p class="text">` +
                    model.tasksList[i].text +
                    `</p>
                <button type="button" class="btn" id="edit` + i + `">Edit</button>
                <button type="button" class="btn" id="done` + i + `">` + done + `</button>
                <button type="button" class="btn" id="remove` + i + `">Remove</button>`
                );

                model.todosList.append(newTask);
                controller.edit(i);
                controller.done(i);
                controller.remove(i);
            }
        } else {
            model.todosList.innerHTML = '<h3>There`s nothing here...</h3>'
        }
    }
}

controller = {
    saveToLocalStorage: function (data) {
        const dataStr = JSON.stringify(data);
        localStorage.setItem('todos', dataStr);
    },

    getFromLocalStorage: function () {
        const todosStr = localStorage.getItem('todos');
        if (todosStr) {
            model.tasksList = JSON.parse(todosStr);
        } else {
            model.tasksList = [];
        }
    },
    run: function () {
        this.getFromLocalStorage();
        view.getTasks();
        this.viewAll();
        this.showActive();
        this.showComplete();
        this.find();
        this.add();
    },
    add: function () {
        document.getElementById('add').addEventListener('click', () => {
            let value = document.getElementById('input').value;

            if (value !== '') {
                model.tasksList.push({
                    text: value,
                    done: false
                });
            }

            this.saveToLocalStorage(model.tasksList);
            document.getElementById('input').value = '';
            model.todosList.innerHTML = '';
            this.getFromLocalStorage();
            view.getTasks();
        });
    },
    changeTask: function (i, data) {
        model.todosList.innerHTML = '';
        this.getFromLocalStorage();

        if (data) {
            model.tasksList.splice(i, 1, data);
        } else {
            model.tasksList.splice(i, 1);
        }

        view.getTasks();
        this.saveToLocalStorage(model.tasksList);
    },
    remove: function (i) {
        document.getElementById('remove' + i).addEventListener('click', () => {
            this.changeTask(i);
        })
    },
    edit: function (i) {
        document.getElementById('edit' + i).addEventListener('click', () => {
            document.getElementById('input').value = model.tasksList[i].text;
            document.getElementById('editTask').addEventListener('click', () => {
                const editedTask = {
                    text: document.getElementById('input').value
                }

                if (editedTask.text !== '') {
                    this.changeTask(i, editedTask);
                    document.getElementById('input').value = '';
                }
            });
        });
    },
    done: function (i) {
        document.getElementById('done' + i).addEventListener('click', () => {
            const editedTask = {
                text: model.tasksList[i].text,
                done: !model.tasksList[i].done
            }
            this.changeTask(i, editedTask);
        });
    },
    viewAll: function () {
        document.getElementById('all').addEventListener('click', () => {
            model.todosList.innerHTML = '';
            this.getFromLocalStorage();
            view.getTasks();
        });
    },
    isComplete: function (key, value) {
        this.getFromLocalStorage();
        const result = model.tasksList.filter(task => task[key] === value);
        model.tasksList = [];
        model.todosList.innerHTML = '';
        model.tasksList = model.tasksList.concat(result);
        view.getTasks();
    },
    showActive: function () {
        document.getElementById('active').addEventListener('click', () => {
            this.isComplete('done', false);
        });
    },
    showComplete: function () {
        document.getElementById('complete').addEventListener('click', () => {
            this.isComplete('done', true);
        });
    },
    find: function () {
        document.getElementById('find').addEventListener('click', () => {
            let word = document.getElementById('findText').value;
            if (word !== '') {
                this.isComplete('text', word);
                document.getElementById('findText').value = '';
            }
        });
    }
}

controller.run();
