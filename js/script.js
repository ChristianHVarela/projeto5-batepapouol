let mensagens = [];
let nomeJSON = null;
let urlParticipants = "https://mock-api.driven.com.br/api/v6/uol/participants";
let urlMessages = "https://mock-api.driven.com.br/api/v6/uol/messages";
let urlStatus = "https://mock-api.driven.com.br/api/v6/uol/status";
let loginSuccess = false;

window.onload = (e) => {
  login();
  console.log(loginSuccess);
  if (loginSuccess) {
    manterConexao();
    renderMessages();
    setIntervalMessages();
  }
};

function login() {
  const nomePrompt = prompt("Qual é o seu lindo nome?");
  const nomeStringfy = `{"name": "${nomePrompt}"}`;
  nomeJSON = JSON.parse(nomeStringfy);
  axios
    .post(urlParticipants, nomeJSON)
    .then((response) => {
      console.log("login ok ");
      console.log(response);
    })
    .catch((error) => {
      console.log("login error ");
      console.log(error);
    });
  loginSuccess = true;
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
    messagesHTML += `<div class="mensagem-caixa ${
      mess.to === "Todos" ? "" : "messagem-private"
    }">
    <p>
      <span class="time ${
        messages.length - 1 === index ? "last-message" : ""
      }">(${mess.time})</span>
      <span class="name">${mess.from}</span> ${
      mess.to === "Todos" ? "para" : "reservamente para"
    }
      <span class="name">${mess.to}</span>: ${mess.text}
    </p>
  </div>`;
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
  console.log(mensagemJSON);
  axios
    .post(urlMessages, mensagemJSON)
    .then((response) => {
      console.log(response);
      renderMessages();
    })
    .catch((error) => {
      console.log(error);
    });
  document.querySelector(".rodape input").value = "";
}
