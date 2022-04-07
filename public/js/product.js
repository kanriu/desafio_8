const btnSubmit = document.getElementById("btn-submit");
const title = document.getElementById("title");
const price = document.getElementById("price");
const thumbnail = document.getElementById("thumbnail");
const contentTable = document.getElementById("content-table");
const btnSend = document.getElementById("btn-send");
const email = document.getElementById("email");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const edad = document.getElementById("edad");
const alias = document.getElementById("alias");
const avatar = document.getElementById("avatar");
const message = document.getElementById("message");
const contentChat = document.getElementById("content-chat");
const h1Logout = document.getElementById("h1-logout");
const welcome = document.getElementById("welcome");

axios
  .get("http://localhost:8080/api/productos-test")
  .then((response) => {
    response.data.forEach((element) => {
      render(element);
    });
  })
  .catch((err) => console.log(err));

// conectar con socket io
const socket = io();

const clearInputs = () => {
  title.value = "";
  price.value = "";
  thumbnail.value = "";
};

const renderEmpty = () => {
  const rowElement = document.createElement("tr");
  rowElement.setAttribute("id", "empty");
  rowElement.innerHTML = `
    <td class="empty" colspan="3">No se encontraron productos</td>
  `;
  contentTable.appendChild(rowElement);
};

const render = (data) => {
  if (contentTable) {
    if (document.getElementById("empty")) {
      contentTable.removeChild(document.getElementById("empty"));
    }
    const rowElement = document.createElement("tr");
    rowElement.innerHTML = `
      <td>${data.title}</td>
      <td>$${data.price}</td>
      <td><img src="${data.thumbnail}" width="50px"/></td>
    `;
    contentTable.appendChild(rowElement);
  }
};

socket.on("send_products", (data) => {
  if (data.length !== 0) {
    data.forEach((element) => {
      render(element);
    });
  }
});

socket.on("product", render);

if (btnSubmit) {
  btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    const product = {
      title: title.value,
      price: price.value,
      thumbnail: thumbnail.value,
    };

    socket.emit("product", product);
    render(product);
    clearInputs();
  });
}

const cookieParser = () => {
  return (document.cookie || "").split("; ").reduce((obj, cookie) => {
    const [name, value] = cookie.split("=");
    obj[name] = decodeURI(value);
    return obj;
  }, {});
};

if (h1Logout) {
  h1Logout.innerHTML = `Hasta luego ${cookieParser().username}`;
  setTimeout(() => {
    window.location.replace("/login");
  }, 2000);
}

if (welcome) {
  welcome.innerHTML = `Bienvenido ${cookieParser().username}`;
}

const renderChat = (data) => {
  const msgElement = document.createElement("div");
  msgElement.innerHTML = `
    <span class="span-email">${
      data.author ? data.author.email : data.email
    }&nbsp;</span><span class="span-fecha">[${
    data.timestamp
  }]&nbsp;</span><span class="span-message">:&nbsp;${data.text}</span>
  `;
  contentChat.appendChild(msgElement);
};

if (btnSend) {
  btnSend.addEventListener("click", (e) => {
    e.preventDefault();
    const chat = {
      email: email.value,
      nombre: nombre.value,
      apellido: apellido.value,
      edad: edad.value,
      alias: alias.value,
      avatar: avatar.value,
      text: message.value,
      timestamp: moment().format("DD/MM/YYYY hh:mm:ss"),
    };

    socket.emit("message", chat);
    renderChat(chat);
    message.value = "";
  });
}

socket.on("send_messages", async (data) => {
  if (data.result.length !== 0) {
    const author = new normalizr.schema.Entity(
      "authors",
      {},
      { idAttribute: "email" }
    );
    const message = new normalizr.schema.Entity("messages", { author });
    const denormalizedData = normalizr.denormalize(
      data.result,
      [message],
      data.entities
    );
    denormalizedData.forEach((element) => {
      renderChat(element);
    });
  }
});

socket.on("message", renderChat);
