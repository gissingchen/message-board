const submitBtn = document.getElementById("submitBtn");
const nameInput = document.getElementById("nameInput");
const contentInput = document.getElementById("contentInput");
const messageList = document.getElementById("messageList");

async function loadMessages() {
  const response = await fetch("/api/messages");
  const messages = await response.json();

  messageList.innerHTML = "";

  messages.forEach(function (message) {
    addMessageToPage(message);
  });
}

function addMessageToPage(message) {
  const item = document.createElement("div");
  item.className = "message-item";
  item.dataset.id = message.id;

  const text = document.createElement("div");
  text.innerHTML =
    "<strong>" +
    message.name +
    "：</strong><span>" +
    message.content +
    "</span>";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "删除";

  deleteBtn.addEventListener("click", async function () {
    const ok = confirm("确定要删除这条留言吗？");

    if (!ok) {
      return;
    }

    const response = await fetch("/api/messages/" + message.id, {
      method: "DELETE"
    });

    if (!response.ok) {
      alert("删除失败");
      return;
    }

    item.remove();
  });

  item.appendChild(text);
  item.appendChild(deleteBtn);

  messageList.appendChild(item);
}

submitBtn.addEventListener("click", async function () {
  const name = nameInput.value.trim();
  const content = contentInput.value.trim();

  if (name === "" || content === "") {
    alert("请填写名字和留言内容");
    return;
  }

  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      content: content
    })
  });

  if (!response.ok) {
    alert("发布失败");
    return;
  }

  const message = await response.json();

  addMessageToPage(message);

  nameInput.value = "";
  contentInput.value = "";
});

loadMessages();