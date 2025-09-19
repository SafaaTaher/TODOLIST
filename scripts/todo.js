class TodoApp {
  constructor() {
    this.currentLang = localStorage.getItem("lang") || "en";
    this.translations = {};

    
    this.title = document.getElementById('title');
    this.todoInput = document.getElementById('todoInput');
    this.addBtn = document.getElementById('addBtn');
    this.todoList = document.getElementById('todoList');
    this.toggleLangBtn = document.getElementById('toggleLang');

    
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    this.todos = this.currentUser.todos || []; //هخزن هنا المهام

    
    this.toggleLangBtn.addEventListener('click', () => this.toggleLanguage());
    this.addBtn.addEventListener('click', () => this.addTask());

    
    this.loadLang(this.currentLang).then(() => {
      this.updateLanguage();
      this.renderTodos();
    });
  }

  async loadLang(lang) {
    const res = await fetch(`lang/${lang}.json`);
    this.translations = await res.json();
  }

  updateLanguage() {
    this.title.innerText = this.translations.todotitle;
    this.todoInput.placeholder = this.translations.input;
    this.addBtn.innerText = this.translations.add;
    this.renderTodos();
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === "en" ? "ar" : "en";
    localStorage.setItem("lang", this.currentLang);
    this.loadLang(this.currentLang).then(() => this.updateLanguage());
  }

  renderTodos() {
  this.todoList.innerHTML = '';
  this.todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = "todo-item";

    
    const span = document.createElement('span');
    span.innerText = todo;
    li.appendChild(span);

    
    const editBtn = document.createElement('button');
    editBtn.className = "editBtn";
    editBtn.innerText = this.translations.edit || "Edit";
    editBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = "text";
      input.value = todo;

      const saveBtn = document.createElement('button');
      saveBtn.innerText = this.translations.save || "Save";
      saveBtn.addEventListener('click', () => {
        this.todos[index] = input.value.trim();
        this.saveTodos();
        this.renderTodos();
      });

      li.innerHTML = '';
      li.appendChild(input);
      li.appendChild(saveBtn);
    });

    const delBtn = document.createElement('button');
    delBtn.className = "delBtn";
    delBtn.innerText = this.translations.delete;
    delBtn.addEventListener('click', () => {
      this.todos.splice(index, 1);
      this.saveTodos();
      this.renderTodos();
    });

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    this.todoList.appendChild(li);
  });
}


  saveTodos() {
    this.currentUser.todos = this.todos;
    this.users = this.users.map(u => u.email === this.currentUser.email ? this.currentUser : u);
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  addTask() {
    const task = this.todoInput.value.trim();
    if (task) {
      this.todos.push(task);
      this.saveTodos();
      this.renderTodos();
      this.todoInput.value = '';
    }
  }
}

new TodoApp();
