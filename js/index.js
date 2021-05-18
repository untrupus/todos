var model = {
    tasksList: [],
    todosList: document.getElementById('list'),
    saveToLocalStorage: function (data) {
        var dataStr = JSON.stringify(data);
        localStorage.setItem('todos', dataStr);
    },
    getFromLocalStorage: function () {
        var todosStr = localStorage.getItem('todos');
        if (todosStr) {
            this.tasksList = JSON.parse(todosStr);
        }
        else {
            this.tasksList = [];
        }
    },
    addTodo: function () {
        var _this = this;
        document.getElementById('add').addEventListener('click', function () {
            var value = document.getElementById('input').value;
            if (value !== '') {
                _this.tasksList.push({
                    text: value,
                    done: false
                });
            }
            _this.saveToLocalStorage(model.tasksList);
            document.getElementById('input').value = '';
            model.todosList.innerHTML = '';
            _this.getFromLocalStorage();
            view.getTasks();
        });
    },
    changeTask: function (i, data) {
        this.todosList.innerHTML = '';
        this.getFromLocalStorage();
        if (data) {
            this.tasksList.splice(i, 1, data);
        }
        else {
            this.tasksList.splice(i, 1);
        }
        view.getTasks();
        this.saveToLocalStorage(this.tasksList);
    },
    removeTodo: function (i) {
        var _this = this;
        document.getElementById('remove' + i).addEventListener('click', function () {
            _this.changeTask(i);
        });
    },
    editTodo: function (i) {
        var _this = this;
        document.getElementById('edit' + i).addEventListener('click', function () {
            document.getElementById('input').value = model.tasksList[i].text;
            document.getElementById('editTask').addEventListener('click', function () {
                var editedTask = {
                    text: document.getElementById('input').value,
                    done: false
                };
                if (editedTask.text !== '') {
                    _this.changeTask(i, editedTask);
                    document.getElementById('input').value = '';
                }
            });
        });
    },
    doneTodo: function (i) {
        var _this = this;
        document.getElementById('done' + i).addEventListener('click', function () {
            var editedTask = {
                text: model.tasksList[i].text,
                done: !model.tasksList[i].done
            };
            _this.changeTask(i, editedTask);
        });
    }
};
var view = {
    getTasks: function () {
        if (model.tasksList.length > 0) {
            for (var i = 0; i < model.tasksList.length; i++) {
                var newTask = document.createElement('li');
                newTask.className = 'task';
                var checked = void 0;
                var done = void 0;
                if (model.tasksList[i].done) {
                    checked = '<p class="checked">&#9745;	</p>';
                    done = 'Open';
                }
                else {
                    checked = '<p class="notChecked">&#9745;	</p>';
                    done = 'Done';
                }
                newTask.innerHTML = (checked + "<p class=\"text\">" +
                    model.tasksList[i].text +
                    "</p>\n                <button type=\"button\" class=\"btn\" id=\"edit" + i + "\">Edit</button>\n                <button type=\"button\" class=\"btn\" id=\"done" + i + "\">" + done + "</button>\n                <button type=\"button\" class=\"btn\" id=\"remove" + i + "\">Remove</button>");
                model.todosList.append(newTask);
                controller.edit(i);
                controller.done(i);
                controller.remove(i);
            }
        }
        else {
            model.todosList.innerHTML = '<h3>There`s nothing here...</h3>';
        }
    }
};
var controller = {
    run: function () {
        model.getFromLocalStorage();
        view.getTasks();
        this.viewAll();
        this.showActive();
        this.showComplete();
        this.find();
        this.add();
    },
    add: function () {
        model.addTodo();
    },
    remove: function (i) {
        model.removeTodo(i);
    },
    done: function (i) {
        model.doneTodo(i);
    },
    edit: function (i) {
        model.editTodo(i);
    },
    viewAll: function () {
        document.getElementById('all').addEventListener('click', function () {
            model.todosList.innerHTML = '';
            model.getFromLocalStorage();
            view.getTasks();
        });
    },
    isComplete: function (key, value) {
        model.getFromLocalStorage();
        var result = model.tasksList.filter(function (task) { return task[key] === value; });
        model.tasksList = [];
        model.todosList.innerHTML = '';
        model.tasksList = model.tasksList.concat(result);
        view.getTasks();
    },
    showActive: function () {
        var _this = this;
        document.getElementById('active').addEventListener('click', function () {
            _this.isComplete('done', false);
        });
    },
    showComplete: function () {
        var _this = this;
        document.getElementById('complete').addEventListener('click', function () {
            _this.isComplete('done', true);
        });
    },
    find: function () {
        var _this = this;
        document.getElementById('find').addEventListener('click', function () {
            var word = document.getElementById('findText').value;
            if (word !== '') {
                _this.isComplete('text', word);
                document.getElementById('findText').value = '';
            }
        });
    }
};
controller.run();
