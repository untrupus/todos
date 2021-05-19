var Model = /** @class */ (function () {
    function Model() {
        this.tasksList = [];
        this.todosList = document.getElementById('list');
    }
    Model.prototype.getFromLocalStorage = function () {
        var todosStr = localStorage.getItem('todos');
        if (todosStr) {
            this.tasksList = JSON.parse(todosStr);
        }
        else {
            this.tasksList = [];
        }
    };
    Model.prototype.saveToLocalStorage = function (data) {
        var dataStr = JSON.stringify(data);
        localStorage.setItem('todos', dataStr);
    };
    Model.prototype.addTodo = function (handler) {
        var _this = this;
        document.getElementById('add').addEventListener('click', function () {
            var value = document.getElementById('input').value;
            if (value !== '') {
                _this.tasksList.push({
                    text: value,
                    done: false
                });
            }
            _this.saveToLocalStorage(_this.tasksList);
            document.getElementById('input').value = '';
            _this.todosList.innerHTML = '';
            _this.getFromLocalStorage();
            handler();
        });
    };
    Model.prototype.changeTask = function (i, data) {
        this.todosList.innerHTML = '';
        this.getFromLocalStorage();
        if (data) {
            this.tasksList.splice(i, 1, data);
        }
        else {
            this.tasksList.splice(i, 1);
        }
        // view.getTasks();
        this.saveToLocalStorage(this.tasksList);
    };
    Model.prototype.removeTodo = function (i) {
        var _this = this;
        document.getElementById('remove' + i).addEventListener('click', function () {
            _this.changeTask(i);
        });
    };
    Model.prototype.editTodo = function (i) {
        var _this = this;
        document.getElementById('edit' + i).addEventListener('click', function () {
            document.getElementById('input').value = _this.tasksList[i].text;
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
    };
    Model.prototype.doneTodo = function (i) {
        var _this = this;
        document.getElementById('done' + i).addEventListener('click', function () {
            var editedTask = {
                text: _this.tasksList[i].text,
                done: !_this.tasksList[i].done
            };
            _this.changeTask(i, editedTask);
        });
    };
    return Model;
}());
var View = /** @class */ (function () {
    function View() {
    }
    View.prototype.getTasks = function (tasks) {
        if (tasks.length > 0) {
            for (var i = 0; i < tasks.length; i++) {
                var newTask = document.createElement('li');
                newTask.className = 'task';
                var checked = void 0;
                var done = void 0;
                if (tasks[i].done) {
                    checked = '<p class="checked">&#9745;	</p>';
                    done = 'Open';
                }
                else {
                    checked = '<p class="notChecked">&#9745;	</p>';
                    done = 'Done';
                }
                newTask.innerHTML = (checked + "<p class=\"text\">" +
                    tasks[i].text +
                    "</p>\n                <button type=\"button\" class=\"btn\" id=\"edit" + i + "\">Edit</button>\n                <button type=\"button\" class=\"btn\" id=\"done" + i + "\">" + done + "</button>\n                <button type=\"button\" class=\"btn\" id=\"remove" + i + "\">Remove</button>");
                // model.todosList.append(newTask);
                // controller.edit(i);
                // controller.done(i);
                // controller.remove(i);
            }
        }
        else {
            // model.todosList.innerHTML = '<h3>There`s nothing here...</h3>'
        }
    };
    return View;
}());
var Controller = /** @class */ (function () {
    function Controller(model, view) {
        this.model = model;
        this.view = view;
        this.model.getFromLocalStorage();
        this.view.getTasks(this.model.tasksList);
        this.viewAll();
        this.showActive();
        this.showComplete();
        this.find();
        this.add(this.view.getTasks(this.model.tasksList));
    }
    Controller.prototype.add = function (handler) {
        this.model.addTodo(handler);
    };
    Controller.prototype.remove = function (i) {
        this.model.removeTodo(i);
    };
    Controller.prototype.done = function (i) {
        this.model.doneTodo(i);
    };
    Controller.prototype.edit = function (i) {
        this.model.editTodo(i);
    };
    Controller.prototype.viewAll = function () {
        var _this = this;
        document.getElementById('all').addEventListener('click', function () {
            _this.model.todosList.innerHTML = '';
            _this.model.getFromLocalStorage();
            _this.view.getTasks(_this.model.tasksList);
        });
    };
    Controller.prototype.isComplete = function (key, value) {
        this.model.getFromLocalStorage();
        var result = this.model.tasksList.filter(function (task) { return task[key] === value; });
        this.model.tasksList = [];
        this.model.todosList.innerHTML = '';
        this.model.tasksList = this.model.tasksList.concat(result);
        this.view.getTasks(this.model.tasksList);
    };
    Controller.prototype.showActive = function () {
        var _this = this;
        document.getElementById('active').addEventListener('click', function () {
            _this.isComplete('done', false);
        });
    };
    Controller.prototype.showComplete = function () {
        var _this = this;
        document.getElementById('complete').addEventListener('click', function () {
            _this.isComplete('done', true);
        });
    };
    Controller.prototype.find = function () {
        var _this = this;
        document.getElementById('find').addEventListener('click', function () {
            var word = document.getElementById('findText').value;
            if (word !== '') {
                _this.isComplete('text', word);
                document.getElementById('findText').value = '';
            }
        });
    };
    return Controller;
}());
var app = new Controller(new Model(), new View());
