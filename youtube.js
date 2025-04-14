let player;
let isSeeking = false;
let isPaused = false;
let currentVideoIndex = 0; // Índice do vídeo atual
const videoList = ["videoId1", "videoId2", "videoId3"]; // IDs dos vídeos que podem ser alternados

document.addEventListener('DOMContentLoaded', () => {
  const db = firebase.firestore();
  const videoDocRef = db.collection("sync").doc("videoStatus");

  // 🔁 Listener do Firestore
  videoDocRef.onSnapshot((doc) => {
    if (!doc.exists) return;
    const data = doc.data();
    const { videoId, currentTime, lastUpdated, paused } = data;

    if (!videoId) return;

    const now = Date.now();
    const diff = (now - lastUpdated) / 1000; // em segundos
    const targetTime = currentTime + diff;

    const loadOrUpdateVideo = () => {
      if (!player) {
        player = new YT.Player('youtubePlayer', {
          height: '360',
          width: '640',
          videoId: videoId,
          events: {
            'onReady': (event) => {
              isSeeking = true;
              event.target.seekTo(targetTime, true);
              if (!paused) {
                event.target.playVideo();
              } else {
                event.target.pauseVideo();
              }
              isSeeking = false;
            }
          }
        });
      } else {
        if (player.getVideoData().video_id !== videoId) {
          player.loadVideoById(videoId);
        }
        isSeeking = true;
        player.seekTo(targetTime, true);
        if (!paused) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
        isSeeking = false;
      }
    };

    // Aguarda player estar pronto
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      window.onYouTubeIframeAPIReady = loadOrUpdateVideo;
    } else {
      loadOrUpdateVideo();
    }
  });

  // ▶️ Quando clicar para carregar vídeo
  document.getElementById('loadVideo').addEventListener('click', async () => {
    const link = document.getElementById('youtubeLink').value;
    const videoId = extractVideoID(link);

    if (!videoId) {
      alert("Link inválido!");
      return;
    }

    const currentTime = player ? player.getCurrentTime() : 0;

    await videoDocRef.set({
      videoId,
      currentTime,
      lastUpdated: Date.now(),
      paused: isPaused
    });

    console.log("Vídeo e tempo sincronizado!");
  });

  // 🎯 Toggle da setinha
  const togglevideoButton = document.getElementById("togglevideoPlayer");
  const playerContainer = document.querySelector(".player-container");

  togglevideoButton.addEventListener("click", () => {
    playerContainer.classList.toggle("player-hidden");
    togglevideoButton.innerHTML = playerContainer.classList.contains("player-hidden")
    ? '<i class="fa-solid fa-chevron-down"></i>'
    : '<i class="fa-solid fa-chevron-up"></i>';
    });

  // 🔒 Esconde player no início
  playerContainer.classList.add("player-hidden");

  // ⏱ Atualiza o tempo atual a cada 5 segundos (só se não estiver pulando manualmente)
  setInterval(() => {
    if (player && player.getPlayerState() === YT.PlayerState.PLAYING && !isSeeking) {
      videoDocRef.update({
        currentTime: player.getCurrentTime(),
        lastUpdated: Date.now(),
        paused: isPaused
      });
    }
  }, 5000);

  // Controles de Play/Pause, Volume e Skip

  // Botão de Pausar/Retomar
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

  // Skip para o próximo vídeo
  document.getElementById('skipButton').addEventListener('click', async () => {
    currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
    const nextVideoId = videoList[currentVideoIndex];
    player.loadVideoById(nextVideoId);
    await videoDocRef.update({
      videoId: nextVideoId,
      currentTime: 0,
      lastUpdated: Date.now(),
      paused: false
    });
  });

  // Unskip para voltar ao vídeo anterior
  document.getElementById('unskipButton').addEventListener('click', async () => {
    currentVideoIndex = (currentVideoIndex - 1 + videoList.length) % videoList.length;
    const prevVideoId = videoList[currentVideoIndex];
    player.loadVideoById(prevVideoId);
    await videoDocRef.update({
      videoId: prevVideoId,
      currentTime: 0,
      lastUpdated: Date.now(),
      paused: false
    });
  });
});

// 🎯 API do YouTube
function extractVideoID(url) {
  const regExp = /^.*(?:youtu\.be\/|v=|\/embed\/|watch\?v=)([^#\&\?]{11}).*/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

// Função para atualizar o estilo do volume conforme o slider é movido
document.getElementById('volumeControl').addEventListener('input', (event) => {
    const value = event.target.value;
    const percentage = (value / 100) * 100;
    event.target.style.background = `linear-gradient(to right,rgb(151, 147, 175) ${percentage}%,rgba(39, 36, 62, 0) ${percentage}%)`;
    event.target.style.borderRadius = "15px";
});
  