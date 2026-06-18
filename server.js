const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const port = process.env.PORT || 3000;

const db = new DatabaseSync("messages.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());
app.use(express.static("public"));

app.get("/api/messages", function (req, res) {
  const messages = db
    .prepare("SELECT id, name, content, created_at FROM messages ORDER BY id DESC")
    .all();

  res.json(messages);
});

app.post("/api/messages", function (req, res) {
  const name = req.body.name;
  const content = req.body.content;

  if (!name || !content) {
    res.status(400).json({
      error: "名字和留言内容不能为空"
    });
    return;
  }

  const result = db
    .prepare("INSERT INTO messages (name, content) VALUES (?, ?)")
    .run(name, content);

  const message = db
    .prepare("SELECT id, name, content, created_at FROM messages WHERE id = ?")
    .get(result.lastInsertRowid);

  res.json(message);
});

app.delete("/api/messages/:id", function (req, res) {
  const id = req.params.id;

  const result = db
    .prepare("DELETE FROM messages WHERE id = ?")
    .run(id);

  if (result.changes === 0) {
    res.status(404).json({
      error: "留言不存在"
    });
    return;
  }

  res.json({
    success: true
  });
});

app.listen(port, function () {
  console.log("Server running at http://localhost:" + port);
});