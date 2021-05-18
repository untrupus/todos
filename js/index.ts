interface todoObj {
    text: string,
    done: boolean
}

const model = {
    tasksList: [],
    todosList: document.getElementById('list'),
    saveToLocalStorage: function (data: todoObj[]): void {
        const dataStr: string = JSON.stringify(data);
        localStorage.setItem('todos', dataStr);
    },
    getFromLocalStorage: function (): void {
        const todosStr: string = localStorage.getItem('todos');
        if (todosStr) {
            this.tasksList = JSON.parse(todosStr);
        } else {
            this.tasksList = [];
        }
    },
    addTodo: function (): void {
        document.getElementById('add').addEventListener('click', (): void => {
            let value: string = (<HTMLInputElement>document.getElementById('input')).value;

            if (value !== '') {
                this.tasksList.push({
                    text: value,
                    done: false
                });
            }

            this.saveToLocalStorage(model.tasksList);
            (<HTMLInputElement>document.getElementById('input')).value = '';
            model.todosList.innerHTML = '';
            this.getFromLocalStorage();
            view.getTasks();
        });
    },
    changeTask: function (i, data?): void {
        this.todosList.innerHTML = '';
        this.getFromLocalStorage();

        if (data) {
            this.tasksList.splice(i, 1, data);
        } else {
            this.tasksList.splice(i, 1);
        }

        view.getTasks();
        this.saveToLocalStorage(this.tasksList);
    },
    removeTodo: function (i: number): void {
        document.getElementById('remove' + i).addEventListener('click', (): void => {
            this.changeTask(i);
        })
    },
    editTodo: function (i: number): void {
        document.getElementById('edit' + i).addEventListener('click', (): void => {
            (<HTMLInputElement>document.getElementById('input')).value = model.tasksList[i].text;
            document.getElementById('editTask').addEventListener('click', (): void => {
                const editedTask: todoObj = {
                    text: (<HTMLInputElement>document.getElementById('input')).value,
                    done: false
                }

                if (editedTask.text !== '') {
                    this.changeTask(i, editedTask);
                    (<HTMLInputElement>document.getElementById('input')).value = '';
                }
            });
        });
    },
    doneTodo: function (i: number): void {
        document.getElementById('done' + i).addEventListener('click', (): void => {
            const editedTask: todoObj = {
                text: model.tasksList[i].text,
                done: !model.tasksList[i].done
            }
            this.changeTask(i, editedTask);
        });
    },
}

const view = {
    getTasks: function (): void {
        if (model.tasksList.length > 0) {
            for (let i = 0; i < model.tasksList.length; i++) {
                const newTask = document.createElement('li');
                newTask.className = 'task';
                let checked: string;
                let done: string;
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

const controller = {
    run: function (): void {
        model.getFromLocalStorage();
        view.getTasks();
        this.viewAll();
        this.showActive();
        this.showComplete();
        this.find();
        this.add();
    },
    add: function (): void {
        model.addTodo();
    },

    remove: function (i: number): void {
        model.removeTodo(i)
    },

    done: function (i): void {
      model.doneTodo(i);
    },

    edit: function (i): void {
      model.editTodo(i);
    },

    viewAll: function (): void {
        document.getElementById('all').addEventListener('click', (): void => {
            model.todosList.innerHTML = '';
            model.getFromLocalStorage();
            view.getTasks();
        });
    },
    isComplete: function (key: string, value: string | boolean): void {
        model.getFromLocalStorage();
        const result: todoObj[] = model.tasksList.filter(task => task[key] === value);
        model.tasksList = [];
        model.todosList.innerHTML = '';
        model.tasksList = model.tasksList.concat(result);
        view.getTasks();
    },
    showActive: function (): void {
        document.getElementById('active').addEventListener('click', (): void => {
            this.isComplete('done', false);
        });
    },
    showComplete: function (): void {
        document.getElementById('complete').addEventListener('click', (): void => {
            this.isComplete('done', true);
        });
    },
    find: function (): void {
        document.getElementById('find').addEventListener('click', (): void => {
            let word: string = (<HTMLInputElement>document.getElementById('findText')).value;
            if (word !== '') {
                this.isComplete('text', word);
                (<HTMLInputElement>document.getElementById('findText')).value = '';
            }
        });
    }
}

controller.run();
