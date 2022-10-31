let mensagens = [];
let nomeJSON = null;
let urlParticipants = "https://mock-api.driven.com.br/api/v6/uol/participants";
let urlMessages = "https://mock-api.driven.com.br/api/v6/uol/messages";
let urlStatus = "https://mock-api.driven.com.br/api/v6/uol/status";
let loginSuccess = false;

window.onload = (e) => {
  document.querySelector(".container-login button").onclick = function (e) {
    document.querySelector(".pre-login").classList.toggle("escondido");
    document.querySelector(".loadingscreen").classList.toggle("escondido");
    const val = document.querySelector(".container-login input").value;
    if (val) {
      login(val);
    } else {
      document.querySelector(".pre-login").classList.toggle("escondido");
      document.querySelector(".loadingscreen").classList.toggle("escondido");
      document
        .querySelector(".container-login input")
        .classList.add("border-red");
    }
  };

  document
    .querySelector(".container-login input")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        document.querySelector(".container-login button").click();
      }
    });
};

function configMensagens() {
  manterConexao();
  renderMessages();
  setIntervalMessages();
}

function login(nome) {
  const nomeStringfy = `{"name": "${nome}"}`;
  nomeJSON = JSON.parse(nomeStringfy);
  axios
    .post(urlParticipants, nomeJSON)
    .then((response) => {
      console.log("login ok ");
      console.log(response);
      document.querySelector(".tela-login").classList.toggle("escondido");
      document.querySelector(".tela-mensagens").classList.toggle("escondido");
      console.log(nomeJSON);
      configMensagens();
    })
    .catch((error) => {
      console.log("login error ");
      console.log(error);
      document.querySelector(".pre-login").classList.toggle("escondido");
      document.querySelector(".loadingscreen").classList.toggle("escondido");
      document
        .querySelector(".container-login input")
        .classList.add("border-red");
    });
}

function manterConexao() {
  setInterval(() => {
    axios
      .post(urlStatus, nomeJSON)
      .then((response) => {
        console.log("status ok ");
        console.log(response);
      })
      .catch((error) => {
        console.log("status error ");
        console.log(error);
        document.querySelector(".tela-login").classList.toggle("escondido");
        document.querySelector(".tela-mensagens").classList.toggle("escondido");
        clearInterval();
      });
  }, 5000);
}

function renderMessages() {
  axios
    .get(urlMessages)
    .then((response) => {
      if (response.data) {
        appendMessages(response.data);
        document.querySelector(".last-message").scrollIntoView();
      }
    })
    .catch((error) => {
      console.log("messages error ");
      console.log(error);
    });
}

function setIntervalMessages() {
  setInterval(() => {
    axios
      .get(urlMessages)
      .then((response) => {
        if (response.data) {
          appendMessages(response.data);
        }
      })
      .catch((error) => {
        console.log("messages error ");
        console.log(error);
      });
  }, 3000);
}

function appendMessages(messages) {
  let messagesHTML = "";
  messages.map((mess, index) => {
    if (mess.to === "Todos") {
      messagesHTML += `<div class="mensagem-caixa">
      <p>
        <span class="time ${
          messages.length - 1 === index ? "last-message" : ""
        }">(${mess.time})</span>
        <span class="name">${mess.from}</span> para
        <span class="name">${mess.to}</span>: ${mess.text}
      </p>
    </div>`;
    } else if (mess.to === nomeJSON.name) {
      messagesHTML += `<div class="mensagem-caixa messagem-private">
      <p>
        <span class="time ${
          messages.length - 1 === index ? "last-message" : ""
        }">(${mess.time})</span>
        <span class="name">${mess.from}</span> reservamente para
        <span class="name">${mess.to}</span>: ${mess.text}
      </p>
    </div>`;
    }
  });
  document.querySelector(".messages").innerHTML = messagesHTML;
}

function enviarMensagem() {
  const mensagem = document.querySelector(".rodape input").value;
  let mensagemJSON = {
    from: nomeJSON.name,
    to: "Todos",
    text: mensagem,
    type: "message",
  };
  axios
    .post(urlMessages, mensagemJSON)
    .then((response) => {
      console.log(response);
      renderMessages();
    })
    .catch((error) => {
      console.log(error);
      document.querySelector(".tela-login").classList.toggle("escondido");
      document.querySelector(".tela-mensagens").classList.toggle("escondido");
    });
  document.querySelector(".rodape input").value = "";
}
