const $ = require('jquery');
const _ = require('underscore');

const TodoView = require('./todo');
const Reactor = require('../utils/reactor');

class TodoListView {
  constructor() {
    this.events = new Reactor();
    this.$el = $('#list');
    this.views = [];

    _.bindAll(this, 'findIndex');
  }

  render(todos) {
    _.each(todos, todo => {
      const view = new TodoView();
      view.events.addEventListener('checked', checked => {
        this.events.dispatchEvent('checked', {
          id: this.findIndex(view) + 1,
          completed: checked
        });
      });

      this.views.push(view);
      this.$el.prepend(view.render(todo));
    });

    return this.$el;
  }

  findIndex(view) {
    return _.findIndex(this.views, v => {
      return v === view;
    });
  }
}

module.exports = TodoListView;
