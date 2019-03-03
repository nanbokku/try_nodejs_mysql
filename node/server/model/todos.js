const mysql = require('mysql');
const _ = require('underscore');

class TodosModel {
  constructor() {
    this.connection = mysql.createConnection({
      host: 'db',
      user: 'root',
      password: 'root',
      port: 3306,
      database: 'todo_database',
      // booleanはDBでTINY(1)として保存される(true===1, false===0)
      // 値を取り出すときにbooleanに変換されるように設定する
      typeCast: (field, next) => {
        if (field.type === 'TINY' && field.length === 1) {
          return field.string() === '1';
        }

        return next();
      }
    });

    this.connection.connect();
  }

  async post(data) {
    if (!data) return false;
    if ('contents' in data) {
      try {
        await this.add(data.contents);
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  add(contents) {
    const todo = {
      contents: contents,
      completed: false
    };

    return new Promise((resolve, reject) => {
      this.connection.query(
        'INSERT INTO todo_table SET ?',
        [todo],
        (err, result) => {
          if (err) {
            reject(err);
            throw err;
          }

          resolve();
        }
      );
    });
  }

  fetch(where) {
    let query = 'SELECT * FROM todo_table';
    let values = [];

    if (where) {
      values = Object.values(where);
      const keys = Object.keys(where);

      _.each(keys, (key, i) => {
        if (i === 0) {
          query += ' WHERE ';
        } else {
          query += ', ';
        }
        query += key + ' = ?';
      });
    }

    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
          throw err;
        }

        let data = JSON.parse(JSON.stringify(result));
        data = data.length === 1 ? data[0] : data;
        resolve(data);
      });
    });
  }

  async put(id, data) {
    if (!data) {
      return false;
    }

    if ('completed' in data) {
      try {
        await this.changeStatus(id, data.completed);
        return true;
      } catch (e) {
        return false;
      }
    }

    return false;
  }

  changeStatus(id, completed) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        'UPDATE todo_table SET completed = ? WHERE id = ?',
        [completed, id],
        (err, result) => {
          if (err) {
            reject(err);
            throw err;
          }

          resolve();
        }
      );
    });
  }
}

module.exports = TodosModel;
