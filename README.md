# try_nodejs_mysql

## Node.js で MySQL を使ってみた

- DB のデータを取得，操作
- jQuery で JSON の送受信

## 詰まったところをめも

### DB 操作

mysql/init/1_ddl.sql:

```sql
CREATE DATABASE IF NOT EXISTS todo_database;
CREATE TABLE IF NOT EXISTS todo_table (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, contents TEXT, completed BOOL DEFAULT false);
```

`BOOL`として指定すると`TINYINT(1)`として保存される:

```sql
mysql> show columns from todo_table;
+-----------+------------+------+-----+---------+----------------+
| Field     | Type       | Null | Key | Default | Extra          |
+-----------+------------+------+-----+---------+----------------+
| id        | int(11)    | NO   | PRI | NULL    | auto_increment |
| contents  | text       | YES  |     | NULL    |                |
| completed | tinyint(1) | YES  |     | 0       |                |
+-----------+------------+------+-----+---------+----------------+
3 rows in set (0.00 sec)
```

`INSERT INTO`文で`true/false`を指定しても大丈夫．`true=1, false=0`として DB に挿入される．

node/server/model/todos.js:

```javascript
const mysql = require('mysql');
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
```

DB からデータを取り出すときに`TINYINT(1)`を`boolean`に変換するために`typeCast`を記述．  
公式そのままこぴぺ: https://github.com/mysqljs/mysql#type-casting

### Ajax で JSON データ送信

node/client/javascripts/index.js:

```javascript
$.ajax({
  method: 'PUT',
  url: '/todo/' + data.id,
  data: JSON.stringify({ completed: data.completed }),
  dataType: 'json', // response
  contentType: 'application/json' // request
}).done(res => {
  console.log(res);
});
```

`contentType`を`'application/json'`と指定する．  
`data.completed`は`boolean`型．
`contentType`を指定しないとサーバーで受け取ったデータは`string`になってしまう．
