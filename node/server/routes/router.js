const express = require('express');
const router = express.Router();

const TodoModel = require('../model/todos');
const db = new TodoModel();

router.get('/all', async (req, res) => {
  const data = await db.fetch();
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const ok = await db.put(id, req.body);
  if (ok) {
    const data = await db.fetch({ id: id });
    res.json(data);
  }
});

module.exports = router;
