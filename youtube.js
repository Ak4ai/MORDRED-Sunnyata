let player;
let isSeeking = false;
let isPaused = false;
let isPlaying = false;
let currentVideoIndex = 0; // Índice do vídeo atual (não utilizado diretamente neste caso)
const videoQueue = []; // Agora armazena objetos: { id, title }
let currentQueueIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
  const db = firebase.firestore();
  const videoDocRef = db.collection("sync").doc("videoStatus");

  // Listener do Firestore para sincronizar vídeo atual e fila
  videoDocRef.onSnapshot((doc) => {
    if (!doc.exists) return;
    const data = doc.data();
    const { videoId, currentTime, lastUpdated, paused } = data;
  
    if (!videoId) return;
  
    const now = Date.now();
    const diff = Math.min((now - lastUpdated) / 1000, 5); // máx 5 segundos de compensação
    const targetTime = currentTime + diff;
  
    // Inicializa ou atualiza o player do YouTube
    const loadOrUpdateVideo = () => {
      if (!player) {
        player = new YT.Player('youtubePlayer', {
          height: '360',
          width: '640',
          videoId: videoId,
          events: {
            'onReady': (event) => {
              const curTime = event.target.getCurrentTime();
              if (Math.abs(curTime - targetTime) > 1) {
                isSeeking = true;
                console.log("Sync Debug =>", {
                  localTime: player.getCurrentTime(),
                  firestoreTime: currentTime,
                  diff,
                  targetTime
                });                
                event.target.seekTo(targetTime, true);
                isSeeking = false;
              }
              paused ? event.target.pauseVideo() : event.target.playVideo();
            },
            'onStateChange': (event) => {
              if (event.data === YT.PlayerState.ENDED) {
                const duration = player.getDuration();
                const curTime = player.getCurrentTime();
                if (duration - curTime < 1) {
                  document.getElementById('skipButton').click();
                }
              }
            }
          }
        });
      } else {
        if (player.getVideoData().video_id !== videoId) {
          player.loadVideoById(videoId);
        }
        const curTime = player.getCurrentTime();
        if (Math.abs(curTime - targetTime) > 1) {
          isSeeking = true;
          console.log("Sync Debug =>", {
            localTime: player.getCurrentTime(),
            firestoreTime: currentTime,
            diff,
            targetTime
          });          
          player.seekTo(targetTime, true);
          isSeeking = false;
        }
        paused ? player.pauseVideo() : player.playVideo();
      }
    };
  
    // Recupera a fila e o índice atual salvos no Firestore
    const { queue = [], currentQueueIndex: queueIndexFromFirestore = 0 } = data;
  
    // Atualiza a fila local
    videoQueue.length = 0;
    videoQueue.push(...queue);
    currentQueueIndex = queueIndexFromFirestore;
    isPaused = paused;
  
    updateVideoQueueDisplay();
  
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      window.onYouTubeIframeAPIReady = loadOrUpdateVideo;
    } else {
      loadOrUpdateVideo();
    }
  });
  

  // ▶️ Carregar vídeo: adicionar à fila (limite 10)
  document.getElementById('loadVideo').addEventListener('click', async () => {
    const link = document.getElementById('youtubeLink').value;
    const videoId = extractVideoID(link);

    if (!videoId) {
      alert("Link inválido!");
      return;
    }
    
    // Verifica o limite da fila
    if (videoQueue.length >= 10) {
      alert("Limite da fila atingido (10 músicas).");
      return;
    }

    // Busca o título do vídeo usando o endpoint oEmbed do YouTube
    const title = await fetchVideoTitle(videoId);

    // Novo objeto para a fila
    const videoObj = { id: videoId, title };

    const playerStateSafe = player && typeof player.getPlayerState === "function"
      ? player.getPlayerState()
      : null;

    if (videoQueue.length === 0 && (!player || playerStateSafe !== YT.PlayerState.PLAYING)) {
      videoQueue.push(videoObj);
      currentQueueIndex = 0;
      await videoDocRef.set({
        videoId,
        currentTime: 0,
        lastUpdated: Date.now(),
        paused: false,
        queue: [...videoQueue],
        currentQueueIndex
      });
    } else {
      videoQueue.push(videoObj);
      updateVideoQueueDisplay();
      // Atualiza apenas a fila no Firestore
      const doc = await videoDocRef.get();
      if (doc.exists) {
        await videoDocRef.update({
          queue: [...videoQueue]
        });
      }
    }

    document.getElementById('youtubeLink').value = "";
  });

  // Atualiza a exibição da fila na interface
  function updateVideoQueueDisplay() {
    const queueList = document.getElementById('videoQueueList');
    queueList.innerHTML = "";
  
    videoQueue.forEach((videoObj, index) => {
      const li = document.createElement("li");
      li.textContent = `Vídeo ${index + 1} - ${videoObj.title}`;
      if (index === currentQueueIndex) {
        li.classList.add("current");
      }
      queueList.appendChild(li);
    });
  }

  // Toggle do player
  const togglevideoButton = document.getElementById("togglevideoPlayer");
  const playerContainer = document.querySelector(".player-container");
  const queueContainer = document.getElementById("videoQueueDisplay");
  
  togglevideoButton.addEventListener("click", () => {
    // Alterna a classe de ocultar em ambos
    playerContainer.classList.toggle("player-hidden");
    queueContainer.classList.toggle("queue-hidden");
    
    togglevideoButton.innerHTML = playerContainer.classList.contains("player-hidden")
      ? '<i class="fa-solid fa-chevron-down"></i>'
      : '<i class="fa-solid fa-chevron-up"></i>';
  });
  
  // Opcionalmente, defina ambos como hidden no início:
  playerContainer.classList.add("player-hidden");
  queueContainer.classList.add("queue-hidden");
  

  // Atualiza o tempo atual a cada 5 segundos
  setInterval(() => {
    if (player && player.getPlayerState() === YT.PlayerState.PLAYING && !isSeeking) {
      videoDocRef.update({
        currentTime: player.getCurrentTime(),
        lastUpdated: Date.now(),
        paused: isPaused
      });
    }
  }, 2000);

  // Botão Play/Pause
  document.getElementById('playPauseButton').addEventListener('click', async () => {
    if (isPaused) {
      player.playVideo();
      isPaused = false;
    } else {
      player.pauseVideo();
      isPaused = true;
    }
    await videoDocRef.update({
      paused: isPaused,
      lastUpdated: Date.now()
    });
  });

  // Controle de Volume
  document.getElementById('volumeControl').addEventListener('input', () => {
    const volume = document.getElementById('volumeControl').value;
    player.setVolume(volume);
  });

  // Skip: Avança para o próximo vídeo (somente avança 1)
  document.getElementById('skipButton').addEventListener('click', async () => {
    if (currentQueueIndex + 1 < videoQueue.length) {
      currentQueueIndex++;
      const nextVideoObj = videoQueue[currentQueueIndex];

      // Se o histórico tiver mais de 1 vídeo atrás, "limpamos" removendo os anteriores
      if (currentQueueIndex > 1) {
        // Remove os itens antes do vídeo imediatamente anterior ao atual
        videoQueue.splice(0, currentQueueIndex - 1);
        // Ajusta o índice relativo da fila
        currentQueueIndex = 1;
      }

      await videoDocRef.update({
        videoId: nextVideoObj.id,
        currentTime: 0,
        lastUpdated: Date.now(),
        paused: false,
        queue: [...videoQueue],
        currentQueueIndex
      });
    }
  });

  // Unskip: Volta para o vídeo anterior (permite voltar apenas 1)
  document.getElementById('unskipButton').addEventListener('click', async () => {
    if (currentQueueIndex > 0) {
      currentQueueIndex--;
      const previousVideoObj = videoQueue[currentQueueIndex];

      await videoDocRef.update({
        videoId: previousVideoObj.id,
        currentTime: 0,
        lastUpdated: Date.now(),
        paused: false,
        currentQueueIndex
      });
    }
  });

});

// Função para extrair o ID do vídeo do link do YouTube
function extractVideoID(url) {
  const regExp = /^.*(?:youtu\.be\/|v=|\/embed\/|watch\?v=)([^#\&\?]{11}).*/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

// Função para buscar o título do vídeo via oEmbed do YouTube
async function fetchVideoTitle(videoId) {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (!response.ok) {
      throw new Error('Não foi possível buscar o título.');
    }
    const data = await response.json();
    return data.title;
  } catch (error) {
    console.error("Erro ao buscar o título do vídeo:", error);
    return "Título indisponível";
  }
}

// Estilo do controle de volume
document.getElementById('volumeControl').addEventListener('input', (event) => {
  const value = event.target.value;
  const percentage = (value / 100) * 100;
  event.target.style.background = `linear-gradient(to right,rgb(151, 147, 175) ${percentage}%,rgba(39, 36, 62, 0) ${percentage}%)`;
  event.target.style.borderRadius = "15px";
});
