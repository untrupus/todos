interface todoObj {
    text: string,
    done: boolean
}

class Model {
    tasksList: todoObj[]
    todosList

    constructor() {
        this.tasksList = []
        this.todosList = document.getElementById('list')
    }

    getFromLocalStorage(): void {
        const todosStr: string = localStorage.getItem('todos');
        if (todosStr) {
            this.tasksList = JSON.parse(todosStr);
        } else {
            this.tasksList = [];
        }
    }

    saveToLocalStorage(data: todoObj[]): void {
        const dataStr: string = JSON.stringify(data);
        localStorage.setItem('todos', dataStr);
    }

    addTodo(): void {
        document.getElementById('add').addEventListener('click', (): void => {
            let value: string = (<HTMLInputElement>document.getElementById('input')).value;

            if (value !== '') {
                this.tasksList.push({
                    text: value,
                    done: false
                });
            }

            this.saveToLocalStorage(this.tasksList);
            (<HTMLInputElement>document.getElementById('input')).value = '';
            this.todosList.innerHTML = '';
            this.getFromLocalStorage();

        });
    }

    changeTask(i, data?): void {
        this.todosList.innerHTML = '';
        this.getFromLocalStorage();

        if (data) {
            this.tasksList.splice(i, 1, data);
        } else {
            this.tasksList.splice(i, 1);
        }

        // view.getTasks();
        this.saveToLocalStorage(this.tasksList);
    }

    removeTodo(i: number): void {
        document.getElementById('remove' + i).addEventListener('click', (): void => {
            this.changeTask(i);
        })
    }

    editTodo(i: number): void {
        document.getElementById('edit' + i).addEventListener('click', (): void => {
            (<HTMLInputElement>document.getElementById('input')).value = this.tasksList[i].text;
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
    }

    doneTodo(i: number): void {
        document.getElementById('done' + i).addEventListener('click', (): void => {
            const editedTask: todoObj = {
                text: this.tasksList[i].text,
                done: !this.tasksList[i].done
            }
            this.changeTask(i, editedTask);
        });
    }
}


class View {
    constructor() {

    }

    getTasks(tasks): void {
        if (tasks.length > 0) {
            for (let i = 0; i < tasks.length; i++) {
                const newTask = document.createElement('li');
                newTask.className = 'task';
                let checked: string;
                let done: string;
                if (tasks[i].done) {
                    checked = '<p class="checked">&#9745;	</p>'
                    done = 'Open'
                } else {
                    checked = '<p class="notChecked">&#9745;	</p>'
                    done = 'Done'
                }

                newTask.innerHTML = (
                    checked + `<p class="text">` +
                    tasks[i].text +
                    `</p>
                <button type="button" class="btn" id="edit` + i + `">Edit</button>
                <button type="button" class="btn" id="done` + i + `">` + done + `</button>
                <button type="button" class="btn" id="remove` + i + `">Remove</button>`
                );

                // model.todosList.append(newTask);
                // controller.edit(i);
                // controller.done(i);
                // controller.remove(i);
            }
        } else {
            // model.todosList.innerHTML = '<h3>There`s nothing here...</h3>'
        }
    }
}

class Controller {
    model: any
    view: any

    constructor(model: any, view: any) {
        this.model = model
        this.view = view

        this.model.getFromLocalStorage();
        this.view.getTasks(this.model.tasksList);
        this.viewAll();
        this.showActive();
        this.showComplete();
        this.find();
        this.add(this.view.getTasks(this.model.tasksList));
    }

    add(): void {
        this.model.addTodo();
    }

    remove(i: number): void {
        this.model.removeTodo(i)
    }

    done(i): void {
        this.model.doneTodo(i);
    }

    edit(i): void {
        this.model.editTodo(i);
    }

    viewAll(): void {
        document.getElementById('all').addEventListener('click', (): void => {
            this.model.todosList.innerHTML = '';
            this.model.getFromLocalStorage();
            this.view.getTasks(this.model.tasksList);
        });
    }

    isComplete(key: string, value: string | boolean): void {
        this.model.getFromLocalStorage();
        const result: todoObj[] = this.model.tasksList.filter(task => task[key] === value);
        this.model.tasksList = [];
        this.model.todosList.innerHTML = '';
        this.model.tasksList = this.model.tasksList.concat(result);
        this.view.getTasks(this.model.tasksList);
    }

    showActive(): void {
        document.getElementById('active').addEventListener('click', (): void => {
            this.isComplete('done', false);
        });
    }

    showComplete(): void {
        document.getElementById('complete').addEventListener('click', (): void => {
            this.isComplete('done', true);
        });
    }

    find(): void {
        document.getElementById('find').addEventListener('click', (): void => {
            let word: string = (<HTMLInputElement>document.getElementById('findText')).value;
            if (word !== '') {
                this.isComplete('text', word);
                (<HTMLInputElement>document.getElementById('findText')).value = '';
            }
        });
    }

}

const app = new Controller(new Model(), new View());