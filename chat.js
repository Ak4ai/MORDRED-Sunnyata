// Referência à coleção de mensagens no Firestore
const mensagensRef = db.collection("chatMensagens");

const input = document.getElementById("chat-input");
const enviarBtn = document.getElementById("chat-enviar");
const mensagensDiv = document.getElementById("chat-mensagens");

// Define o nome do usuário com valor padrão
let nomeUsuario = "Usuário";

// Aguarda window.nomepersonagem ser definido para atualizar nomeUsuario
const esperarNomePersonagem = setInterval(() => {
  if (typeof window.nomepersonagem !== "undefined") {
    nomeUsuario = window.nomepersonagem;
    console.log("Nome do usuário definido:", nomeUsuario);
    clearInterval(esperarNomePersonagem);  // Interrompe a checagem
  }
}, 100);  // Verifica a cada 100ms

// Função para gerar uma cor aleatória em formato hexadecimal (6 dígitos)
function gerarCorAleatoria() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF)
    .toString(16)
    .padStart(6, '0');
}

// Função para obter a cor do usuário, armazenando-a caso ainda não exista
function obterCorUsuario(usuario) {
  const chave = `chatColor-${usuario}`;
  let cor = localStorage.getItem(chave);
  if (!cor) {
    cor = gerarCorAleatoria();
    localStorage.setItem(chave, cor);
  }
  return cor;
}

// Enviar mensagem
enviarBtn.addEventListener("click", async () => {
  // Verifica se o nome do usuário foi alterado
  if (typeof window.nomepersonagem !== "undefined" && window.nomepersonagem !== nomeUsuario) {
    nomeUsuario = window.nomepersonagem;
    console.log("Nome do usuário atualizado:", nomeUsuario);
  }
  
  const texto = input.value.trim();
  if (texto === "") return;

  try {
    await mensagensRef.add({
      texto,
      autor: nomeUsuario,
      timestamp: new Date()
    });
    input.value = "";
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
  }
});

// Escuta mensagens em tempo real
mensagensRef.orderBy("timestamp").onSnapshot(snapshot => {
  mensagensDiv.innerHTML = ""; // Limpa o container antes de renderizar
  snapshot.forEach(doc => {
    const msg = doc.data();
    const mensagemEl = document.createElement("div");
    mensagemEl.classList.add("chat-message");

    // Obtém a cor associada ao autor e insere no HTML
    const corAutor = obterCorUsuario(msg.autor);
    mensagemEl.innerHTML = `<strong style="color: ${corAutor}">${msg.autor}:</strong> ${msg.texto}`;
    mensagensDiv.appendChild(mensagemEl);
  });

  // Rola automaticamente para o final
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
});

// Permite enviar mensagem com a tecla Enter
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    enviarBtn.click();
  }
});
