"use strict";

const addTaskBtn = document.querySelector('.workspace__add-btn');
const task = document.querySelector('.workspace__input');
const taskList = document.querySelector('.workspace__task-list');
const taskItem = document.createElement('li');
const todoList = [];

export function createTask() {
  addTaskBtn.addEventListener('click', () => {
    let todo = {
      task: task.value,
      checked: false,
    };
    todoList.push(todo);
    console.log(todoList);
    renderTask();
  });
}

todoList.forEach(e => {
  taskList.innerHTML = e.task;
});

export function renderTask() {
  let displayTask = '';
  todoList.forEach(e => {
    displayTask += `
    <li>
    <input type="checkbox">
    <p>${e.task}</p>
    </li>`;
    taskList.innerHTML = displayTask;
  });
}