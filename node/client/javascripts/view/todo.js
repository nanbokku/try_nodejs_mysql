const $ = require('jquery');
const _ = require('underscore');

const Reactor = require('../utils/reactor');

class TodoView {
  constructor() {
    this.events = new Reactor();
    this.$el = $('<li>');
    this.template = _.template($('#template-todo').html());
  }

  setEvents() {
    this.checkbox = this.$el.find('.checkbox');
    this.checkbox.on('change', () => {
      this.events.dispatchEvent('checked', this.checkbox.prop('checked'));
    });
  }

  render(todo) {
    const tmp = this.template(todo);
    this.$el.html(tmp);

    this.setEvents();

    return this.$el;
  }
}

module.exports = TodoView;
