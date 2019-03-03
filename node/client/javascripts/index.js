const $ = require('jquery');
const TodoListView = require('./view/todo_list');

$(() => {
  const todoListView = new TodoListView();
  todoListView.events.addEventListener('checked', data => {
    $.ajax({
      method: 'PUT',
      url: '/todo/' + data.id,
      data: JSON.stringify({ completed: data.completed }),
      dataType: 'json', // response
      contentType: 'application/json' // request
    }).done(res => {
      console.log(res);
    });
  });

  $.get('/todo/all').done(res => {
    todoListView.render(res);
  });
});
