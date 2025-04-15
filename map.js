const tabuleiro = document.getElementById('tabuleiro');

for (let i = 0; i < 50 * 50; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    tabuleiro.appendChild(cell);
}
  
let resizing = false;
let currentHandle = null;
let initialMouseX = 0;
let initialMouseY = 0;
let initialWidth = 0;
let initialHeight = 0;
let initialLeft = 0;
let initialTop = 0;


const toggleButton = document.getElementById('toggle-container');
const container = document.querySelector('.container');
const anotacoes = document.getElementById('essential-info2');
const essentialInfo = document.getElementById('essential-info');
const playerContainer = document.querySelector('.player-container');
const barrafichas = document.getElementById('barra-fichas');
let hidden = false;
let backgroundChecked = true; // ← Essa flag deve ser controlada por algum checkbox ou opção no menu.

toggleButton.addEventListener('click', () => {
    hidden = !hidden;
  
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
    // Esconde apenas em dispositivos não móveis
    container.style.display = hidden ? 'none' : 'block';
    barrafichas.style.display = hidden ? 'flex' : 'none';

    if (window.totalFichas < 2) {
      barrafichas.style.display = 'none';
    }
  
    if (!isMobile) {
      anotacoes.style.display = hidden ? 'none' : 'block';
      playerContainer.style.display = hidden ? 'none' : 'flex';
    }
  
    // Tornar vertical apenas em dispositivos não móveis
    if (!isMobile) {
      essentialInfo.classList.toggle('vertical');
    }
  
    // IDs das barras de preenchimento
    const barras = [
      { barraId: 'status-bar-vida1', valor: personagem.vida, max: personagem.vidaMax },
      { barraId: 'status-bar-alma1', valor: personagem.alma, max: personagem.almaMax },
      { barraId: 'status-bar-escudo1', valor: personagem.escudo, max: personagem.escudoMax }
    ];
  
    barras.forEach(({ barraId, valor, max }) => {
      const barra = document.getElementById(barraId);
      const containerBarra = barra.parentElement;
  
      // Aplicar/remover classe vertical apenas se for desktop
      if (!isMobile) {
        if (essentialInfo.classList.contains('vertical')) {
          containerBarra.classList.add('vertical');
        } else {
          containerBarra.classList.remove('vertical');
        }
      }
  
      // Atualizar visual da barra
      atualizarBarra(barraId, valor, max);
    });
  
    toggleButton.innerHTML = hidden
    ? '<i class="fa-solid fa-arrows-to-eye"></i>'
    : '<i class="fa-solid fa-eye-slash"></i>'; // ou qualquer outro ícone que você queira
});
  


// -------------------- //
// FUNCIONALIDADES MAPA //
// -------------------- //

const tokenLayer = document.getElementById('token-layer');
let selectedToken = null;
let offsetX = 0;
let offsetY = 0;
const cellSize = 100; // ← Adicione esta linha

  
document.addEventListener('mousemove', (e) => {
  if (resizing && selectedToken && currentHandle) {
      // Calcula os deltas convertendo para coordenadas lógicas
      const dx = (e.clientX - initialMouseX) / zoomLevel;
      const dy = (e.clientY - initialMouseY) / zoomLevel;

      let newWidth = initialWidth;
      let newHeight = initialHeight;
      let newLeft = initialLeft;
      let newTop = initialTop;

      if (currentHandle.classList.contains('bottom-right')) {
          newWidth += dx;
          newHeight += dy;
      } else if (currentHandle.classList.contains('bottom-left')) {
          newWidth -= dx;
          newHeight += dy;
          newLeft += dx;
      } else if (currentHandle.classList.contains('top-right')) {
          newWidth += dx;
          newHeight -= dy;
          newTop += dy;
      } else if (currentHandle.classList.contains('top-left')) {
          newWidth -= dx;
          newHeight -= dy;
          newLeft += dx;
          newTop += dy;
      }

      // Aplicar novas dimensões e posição sem multiplicar pelo zoom novamente
      selectedToken.style.width = `${newWidth}px`;
      selectedToken.style.height = `${newHeight}px`;      
      selectedToken.style.left = `${newLeft}px`;
      selectedToken.style.top = `${newTop}px`;      
      selectedToken.style.lineHeight = `${newHeight}px`; // manter emoji centralizado
  } else if (selectedToken && !resizing) {
      // Movimento padrão
      const wrapperRect = tokenLayer.getBoundingClientRect();
      const x = (e.clientX - wrapperRect.left) / zoomLevel - offsetX;
      const y = (e.clientY - wrapperRect.top) / zoomLevel - offsetY;      

      selectedToken.style.left = `${x}px`;
      selectedToken.style.top = `${y}px`;
  }
});

  
  
// Selecionar token ao clicar nele
tokenLayer.addEventListener('click', (e) => {
  // Verifica se o clique foi num token ou num background
  if (!e.target.classList.contains('token') && !e.target.classList.contains('background-img')) return;
  
  // Remove a seleção de todos os tokens e backgrounds, removendo também seus handles
  const selecionados = tokenLayer.querySelectorAll('.token.selected, .background-img.selected');
  selecionados.forEach(el => {
    el.classList.remove('selected');
    const handles = el.querySelectorAll('.resize-handle');
    handles.forEach(handle => handle.remove());
  });

  // Adiciona a classe de seleção ao elemento clicado
  e.target.classList.add('selected');

  // Cria âncoras (handles) para redimensionamento para os 4 cantos
  ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(pos => {
    const handle = document.createElement('div');
    handle.classList.add('resize-handle', pos);
    e.target.appendChild(handle);
  });
});

  
tokenLayer.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('resize-handle')) {
      // Começar resize
      e.stopPropagation(); // Evita conflito com drag
      resizing = true;
      currentHandle = e.target;
      selectedToken = currentHandle.parentElement;
  
      const rect = selectedToken.getBoundingClientRect();
      const wrapperRect = tokenLayer.getBoundingClientRect();
  
      initialMouseX = e.clientX;
      initialMouseY = e.clientY;
      initialLeft = (rect.left - wrapperRect.left) / zoomLevel;
      initialTop = (rect.top - wrapperRect.top) / zoomLevel;
      initialLeft = (rect.left - wrapperRect.left) / zoomLevel;
      initialTop = (rect.top - wrapperRect.top) / zoomLevel;
  
    } else if (e.target.classList.contains('token')) {
      // Começar drag
      selectedToken = e.target;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      selectedToken.style.cursor = 'grabbing';
    }
});
  
document.addEventListener('mouseup', () => {
  if (selectedToken && !resizing) {
    selectedToken.style.cursor = 'grab';

    // Atualizar posição no Firestore
    const id = selectedToken.getAttribute('data-id');
    if (id) {
      db.collection('tokens').doc(id).update({
        x: parseFloat(selectedToken.style.left),
        y: parseFloat(selectedToken.style.top)
      }).catch(console.error);
    }
  }

  if (selectedToken && resizing) {
    // Atualizar posição e tamanho no Firestore após resize
    const id = selectedToken.getAttribute('data-id');
    if (id) {
      db.collection('tokens').doc(id).update({
        x: parseFloat(selectedToken.style.left),
        y: parseFloat(selectedToken.style.top),
        size: parseFloat(selectedToken.style.width)
      }).catch(console.error);
    }
  }

  resizing = false;
  currentHandle = null;
  selectedToken = null;
});


// Função para deletar o token
function deletarToken(id) {
  // Remover o token do Firestore
  db.collection('tokens').doc(id).delete().catch(console.error);

  // Remover o token do DOM
  const tokenElement = document.querySelector(`[data-id="${id}"]`);
  if (tokenElement) {
    tokenElement.remove();
  }
}

// Variável para controlar se o menu de contexto está aberto
let contextMenuOpen = null;

// Adicionando o menu de contexto para deletar o token
tokenLayer.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // Evitar o menu de contexto padrão do navegador

  const token = e.target;
  if (!token.classList.contains('token')) return;

  // Fechar o menu de contexto anterior, se houver
  if (contextMenuOpen) {
    document.body.removeChild(contextMenuOpen);
    contextMenuOpen = null;
  }

  // Criar o novo menu de contexto
  const menu = document.createElement('div');
  menu.classList.add('context-menu');
  menu.innerHTML = `<ul><li id="delete-token">Deletar Token</li></ul>`;

  // Posicionar o menu na posição do clique
  menu.style.position = 'absolute';
  menu.style.left = `${e.clientX}px`;
  menu.style.top = `${e.clientY}px`;

  // Adicionar o menu ao body
  document.body.appendChild(menu);

  // Armazenar o menu aberto
  contextMenuOpen = menu;

  // Ao clicar em "Deletar Token", chamamos a função de deletar
  document.getElementById('delete-token').addEventListener('click', () => {
    const tokenId = token.getAttribute('data-id');
    deletarToken(tokenId);
    document.body.removeChild(menu); // Fechar o menu
    contextMenuOpen = null; // Limpar o estado
  });

  // Remover o menu de contexto ao clicar fora
  document.addEventListener('click', () => {
    if (contextMenuOpen) {
      document.body.removeChild(contextMenuOpen);
      contextMenuOpen = null;
    }
  }, { once: true });

  // Fechar o menu ao tirar o mouse de cima
  menu.addEventListener('mouseleave', () => {
    document.body.removeChild(menu);
    contextMenuOpen = null;
  });
});

function criarToken({ x, y }) {
  // Criar o modal
  const modal = document.createElement('div');
  modal.classList.add('token-modal');
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Criar Token</h3>
      <label>Imagem (URL):</label>
      <input type="text" id="token-img-url" placeholder="https://..." required />

      <label>Tamanho (em células):</label>
      <input type="number" id="token-size" placeholder="1" min="1" />

      <div class="modal-buttons">
        <button id="confirmar-criacao">Criar</button>
        <button id="cancelar-criacao">Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Cancelar
  document.getElementById('cancelar-criacao').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Criar
  document.getElementById('confirmar-criacao').addEventListener('click', () => {
    const image = document.getElementById('token-img-url').value.trim();
    const sizeInCells = parseInt(document.getElementById('token-size').value) || 1;

    if (!image) {
      alert("Por favor, insira o link da imagem.");
      return;
    }

    const pixelSize = sizeInCells * cellSize;

    const tokenData = {
      x,
      y,
      size: pixelSize,
      image,
      timestamp: Date.now()
    };

    db.collection('tokens').add(tokenData).catch(console.error);
    document.body.removeChild(modal);
  });
}

tokenLayer.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('token')) {
    e.stopPropagation(); // Impede que o evento alcance o wrapper
    // Código de início do drag do token...
    selectedToken = e.target;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    selectedToken.style.cursor = 'grabbing';
  }
  // Verifica se é uma âncora de redimensionamento e trata, se necessário.
  if (e.target.classList.contains('resize-handle')) {
    e.stopPropagation(); // Evitar conflito com o drag do tabuleiro
    resizing = true;
    currentHandle = e.target;
    selectedToken = currentHandle.parentElement;

    const rect = selectedToken.getBoundingClientRect();
    const wrapperRect = tokenLayer.getBoundingClientRect();

    initialMouseX = e.clientX;
    initialMouseY = e.clientY;
    initialWidth = rect.width / zoomLevel;
    initialHeight = rect.height / zoomLevel;    
    initialLeft = (rect.left - wrapperRect.left) / zoomLevel;
    initialTop = (rect.top - wrapperRect.top) / zoomLevel;
  }
});
const tabuleiroBG = document.getElementById('tabuleiro-bg'); // importante garantir que esse ID está certo

tabuleiroBG.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // Impede o menu padrão do navegador

  // Fecha qualquer menu de contexto anterior
  if (contextMenuOpen) {
    document.body.removeChild(contextMenuOpen);
    contextMenuOpen = null;
  }

  // Criar o novo menu de contexto com duas opções
  const menu = document.createElement('div');
  menu.classList.add('context-menu');
  menu.innerHTML = `
    <ul>
      <li id="criar-personagem">Criar Personagem</li>
      <li id="criar-background">Criar Background</li>
    </ul>`;

  // Posicionar o menu na posição do clique
  menu.style.position = 'absolute';
  menu.style.left = `${e.clientX}px`;
  menu.style.top = `${e.clientY}px`;

  document.body.appendChild(menu);
  contextMenuOpen = menu;

  // Ações dos botões do menu
  document.getElementById('criar-personagem').addEventListener('click', () => {
    const wrapperRect = tokenLayer.getBoundingClientRect();
    const posX = (e.clientX - wrapperRect.left) / zoomLevel;
    const posY = (e.clientY - wrapperRect.top) / zoomLevel;

    criarToken({ x: posX, y: posY });

    document.body.removeChild(menu);
    contextMenuOpen = null;
  });

  document.getElementById('criar-background').addEventListener('click', () => {
    const wrapperRect = tokenLayer.getBoundingClientRect();
    const posX = (e.clientX - wrapperRect.left) / zoomLevel;
    const posY = (e.clientY - wrapperRect.top) / zoomLevel;

    criarBackground({ x: posX, y: posY });

    document.body.removeChild(menu);
    contextMenuOpen = null;
  });

  // Fecha ao clicar fora
  document.addEventListener('click', () => {
    if (contextMenuOpen) {
      document.body.removeChild(contextMenuOpen);
      contextMenuOpen = null;
    }
  }, { once: true });

  // Fecha ao sair com o mouse
  menu.addEventListener('mouseleave', () => {
    if (contextMenuOpen) {
      document.body.removeChild(contextMenuOpen);
      contextMenuOpen = null;
    }
  });
});

function criarBackground({ x, y }) {
  const modal = document.createElement('div');
  modal.classList.add('token-modal');
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Criar Background</h3>
      <label>Imagem (URL):</label>
      <input type="text" id="bg-img-url" placeholder="https://..." required />

      <label>Tamanho (em células):</label>
      <input type="number" id="bg-size" placeholder="1" min="1" />

      <div class="modal-buttons">
        <button id="confirmar-bg">Criar</button>
        <button id="cancelar-bg">Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('cancelar-bg').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  document.getElementById('confirmar-bg').addEventListener('click', () => {
    const image = document.getElementById('bg-img-url').value.trim();
    const sizeInCells = parseInt(document.getElementById('bg-size').value) || 1;

    if (!image) {
      alert("Por favor, insira o link da imagem.");
      return;
    }

    const pixelSize = sizeInCells * cellSize;

    const bgData = {
      x,
      y,
      size: pixelSize,
      image,
      timestamp: Date.now()
    };

    db.collection('backgrounds').add(bgData).catch(console.error);
    document.body.removeChild(modal);
  });
}


// ------------------------ //
// FUNÇÕES DE Celular //
// ------------------------ //

tokenLayer.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];

  if (e.target.classList.contains('resize-handle')) {
    e.stopPropagation();
    resizing = true;
    currentHandle = e.target;
    selectedToken = currentHandle.parentElement;

    const rect = selectedToken.getBoundingClientRect();
    const wrapperRect = tokenLayer.getBoundingClientRect();

    initialMouseX = touch.clientX;
    initialMouseY = touch.clientY;
    initialLeft = (rect.left - wrapperRect.left) / zoomLevel;
    initialTop = (rect.top - wrapperRect.top) / zoomLevel;
    initialLeft = (rect.left - wrapperRect.left) / zoomLevel;
    initialTop = (rect.top - wrapperRect.top) / zoomLevel;
  } else if (e.target.classList.contains('token')) {
    selectedToken = e.target;
    const rect = selectedToken.getBoundingClientRect();
    const wrapperRect = tokenLayer.getBoundingClientRect();

    offsetX = (touch.clientX - rect.left) / zoomLevel;
    offsetY = (touch.clientY - rect.top) / zoomLevel;

    selectedToken.style.cursor = 'grabbing';
  }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (!selectedToken) return;

  const touch = e.touches[0];

  if (resizing && currentHandle) {
    const dx = (touch.clientX - initialMouseX) / zoomLevel;
    const dy = (touch.clientY - initialMouseY) / zoomLevel;

    let newWidth = initialWidth;
    let newHeight = initialHeight;
    let newLeft = initialLeft;
    let newTop = initialTop;

    if (currentHandle.classList.contains('bottom-right')) {
      newWidth += dx;
      newHeight += dy;
    } else if (currentHandle.classList.contains('bottom-left')) {
      newWidth -= dx;
      newHeight += dy;
      newLeft += dx;
    } else if (currentHandle.classList.contains('top-right')) {
      newWidth += dx;
      newHeight -= dy;
      newTop += dy;
    } else if (currentHandle.classList.contains('top-left')) {
      newWidth -= dx;
      newHeight -= dy;
      newLeft += dx;
      newTop += dy;
    }

    selectedToken.style.width = `${newWidth * zoomLevel}px`;
    selectedToken.style.height = `${newHeight * zoomLevel}px`;    
    selectedToken.style.left = `${newLeft * zoomLevel}px`;
    selectedToken.style.top = `${newTop * zoomLevel}px`;    
    selectedToken.style.lineHeight = `${newHeight}px`; // para centralizar o emoji

  } else {
    const wrapperRect = tokenLayer.getBoundingClientRect();
    const x = (touch.clientX - wrapperRect.left) / zoomLevel - offsetX;
    const y = (touch.clientY - wrapperRect.top) / zoomLevel - offsetY;

    selectedToken.style.left = `${x}px`;
    selectedToken.style.top = `${y}px`;
  }

  e.preventDefault(); // Evita rolagem da página
}, { passive: false });

document.addEventListener('touchend', () => {
  if (selectedToken && !resizing) {
    selectedToken.style.cursor = 'grab';

    const id = selectedToken.getAttribute('data-id');
    if (id) {
      db.collection('tokens').doc(id).update({
        x: parseFloat(selectedToken.style.left),
        y: parseFloat(selectedToken.style.top)
      }).catch(console.error);
    }
  }

  if (selectedToken && resizing) {
    const id = selectedToken.getAttribute('data-id');
    if (id) {
      db.collection('tokens').doc(id).update({
        x: parseFloat(selectedToken.style.left),
        y: parseFloat(selectedToken.style.top),
        size: parseFloat(selectedToken.style.width)
      }).catch(console.error);
    }
  }

  resizing = false;
  currentHandle = null;
  selectedToken = null;
});


// ------------------------ //
// ZOOM: Tamanho das células //
// ------------------------ //

let zoomLevel = 1;
const zoomStep = 0.1;
const maxZoom = 2;
const minZoom = 0.5;

const tabuleiroInner = document.getElementById('tabuleiro-inner');

function aplicarZoom() {
  tabuleiroInner.style.transform = `scale(${zoomLevel})`;
}

// Botões de zoom
document.getElementById('zoom-in').addEventListener('click', () => {
  if (zoomLevel < maxZoom) {
    zoomLevel += zoomStep;
    aplicarZoom();
  }
});

document.getElementById('zoom-out').addEventListener('click', () => {
  if (zoomLevel > minZoom) {
    zoomLevel -= zoomStep;
    aplicarZoom();
  }
});

// Aplicar zoom inicial
aplicarZoom();

// ------------------------ //
// FUNÇÕES FIREBASE //
// ------------------------ //
// Escuta em tempo real para novos tokens
db.collection('tokens').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const tokenId = change.doc.id;
    const data = change.doc.data();

    if (change.type === 'added') {
      // Verifica se o token já existe no DOM
      if (!document.querySelector(`[data-id="${tokenId}"]`)) {
        const token = document.createElement('div');
        token.classList.add('token');
        token.setAttribute('data-id', tokenId);
        token.setAttribute('tabindex', '0'); // Permite o foco
        
        // Define a imagem de fundo
        token.style.backgroundImage = `url('${data.image}')`;
        token.style.backgroundSize = 'contain';
        token.style.backgroundPosition = 'center';
        token.style.backgroundRepeat = 'no-repeat';

        token.style.position = 'absolute';
        token.style.left = `${data.x}px`;
        token.style.top = `${data.y}px`;
        token.style.width = `${data.size}px`;
        token.style.height = `${data.size}px`;
        token.style.fontSize = `${data.size * 0.6}px`;
        token.style.lineHeight = `${data.size}px`;
        token.style.textAlign = 'center';
        token.style.cursor = 'grab';

        tokenLayer.appendChild(token);
      }

    } else if (change.type === 'removed') {
      const token = document.querySelector(`[data-id="${tokenId}"]`);
      if (token) token.remove();
    }

    // Se quiser lidar com updates no futuro:
    else if (change.type === 'modified') {
      const token = document.querySelector(`[data-id="${tokenId}"]`);
      if (token) {
        token.style.left = `${data.x}px`;
        token.style.top = `${data.y}px`;
        token.style.width = `${data.size}px`;
        token.style.height = `${data.size}px`;
        token.textContent = data.emoji;

        // Atualiza a imagem de fundo
        token.style.backgroundImage = `url('${data.image}')`;
      }
    }
    db.collection('backgrounds').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const bgId = change.doc.id;
        const data = change.doc.data();
    
        if (change.type === 'added') {
          if (!document.querySelector(`[data-bg-id="${bgId}"]`)) {
            const bg = document.createElement('div');
            bg.classList.add('background-img');
            bg.setAttribute('data-bg-id', bgId);
    
            bg.style.backgroundImage = `url('${data.image}')`;
            bg.style.backgroundSize = 'cover';
            bg.style.backgroundPosition = 'center';
            bg.style.backgroundRepeat = 'no-repeat';
    
            bg.style.position = 'absolute';
            bg.style.left = `${data.x}px`;
            bg.style.top = `${data.y}px`;
            bg.style.width = `${data.size}px`;
            bg.style.height = `${data.size}px`;
            bg.style.zIndex = '0';
    
            tokenLayer.appendChild(bg);
          }
        } else if (change.type === 'removed') {
          const bg = document.querySelector(`[data-bg-id="${bgId}"]`);
          if (bg) bg.remove();
        } else if (change.type === 'modified') {
          const bg = document.querySelector(`[data-bg-id="${bgId}"]`);
          if (bg) {
            bg.style.left = `${data.x}px`;
            bg.style.top = `${data.y}px`;
            bg.style.width = `${data.size}px`;
            bg.style.height = `${data.size}px`;
            bg.style.backgroundImage = `url('${data.image}')`;
          }
        }
      });
    });         
  });
});

// ------------------------ //
// FUNÇÕES DE ANIMAÇÃO //
// ------------------------ //

function criarScrollCustomizado() {
  const barra = document.getElementById('barra-fichas');

  // Cria barra falsa
  const barraScroll = document.createElement('div');
  barraScroll.style.position = 'fixed';
  barraScroll.style.bottom = '0.3rem';
  barraScroll.style.left = '50%';
  barraScroll.style.transform = 'translateX(-50%)';
  barraScroll.style.width = '60%'; // tamanho desejado da barra falsa
  barraScroll.style.height = '6px';
  barraScroll.style.background = '#9995';
  barraScroll.style.borderRadius = '4px';
  barraScroll.style.overflow = 'hidden';
  barraScroll.style.zIndex = '1001';
  barraScroll.style.display = 'none'; // começa escondida

  const polegar = document.createElement('div');
  polegar.style.height = '100%';
  polegar.style.background = '#fff';
  polegar.style.width = '20%'; // será ajustado dinamicamente
  polegar.style.borderRadius = '4px';
  polegar.style.transition = 'left 0.1s ease';

  barraScroll.appendChild(polegar);
  document.body.appendChild(barraScroll);

  // Função para verificar visibilidade e overflow
  function atualizarBarraScroll() {
    const precisaScroll = barra.scrollWidth > barra.clientWidth;
    const visivel = getComputedStyle(barra).display !== 'none';

    if (visivel && precisaScroll) {
      barraScroll.style.display = 'block';

      // Atualiza tamanho do polegar proporcional
      const proporcao = barra.clientWidth / barra.scrollWidth;
      polegar.style.width = `${proporcao * 100}%`;
      atualizarPosicaoPolegar();
    } else {
      barraScroll.style.display = 'none';
    }
  }

  // Atualiza posição do polegar
  function atualizarPosicaoPolegar() {
    const percent = barra.scrollLeft / (barra.scrollWidth - barra.clientWidth);
    const maxLeft = barraScroll.clientWidth - polegar.clientWidth;
    polegar.style.position = 'relative';
    polegar.style.left = `${percent * maxLeft}px`;
  }

  // Scroll do conteúdo → move polegar
  barra.addEventListener('scroll', () => {
    atualizarPosicaoPolegar();
    atualizarBarraScroll();
  });

  // Clique na barra falsa → move conteúdo
  barraScroll.addEventListener('click', (e) => {
    const clickX = e.offsetX;
    const percent = clickX / barraScroll.clientWidth;
    barra.scrollLeft = percent * (barra.scrollWidth - barra.clientWidth);
  });

  // Scroll horizontal com o mouse (dentro da barra)
  barra.addEventListener('wheel', function (e) {
    if (e.deltaY !== 0) {
      e.preventDefault();
      barra.scrollLeft += e.deltaY * 2;
    }
  });

  // Monitorar mudanças de layout/dimensão
  const observer = new ResizeObserver(() => atualizarBarraScroll());
  observer.observe(barra);

  // Primeira checagem após carregar
  setTimeout(atualizarBarraScroll, 500);
}

criarScrollCustomizado();

// arrastar da barra //
// Permite que o tabuleiro receba o drop
tabuleiro.addEventListener('dragover', (e) => {
  e.preventDefault(); // Necessário para habilitar o drop
});

tabuleiro.addEventListener('drop', (e) => {
  e.preventDefault();

  // Recupera os dados enviados no dragstart
  const imageUrl = e.dataTransfer.getData('image');
  const fichaNome = e.dataTransfer.getData('text/plain'); // Caso queira usar o nome para outros fins

  // Obtém a posição do drop relativa ao tabuleiro
  const tabuleiroRect = tabuleiro.getBoundingClientRect();
  const posX = (e.clientX - tabuleiroRect.left) / zoomLevel;
  const posY = (e.clientY - tabuleiroRect.top) / zoomLevel;
  
  // Cria o objeto com dados do token (dimensão fixa de 1 célula)
  const tokenData = {
    x: posX,
    y: posY,
    size: cellSize, // Dimensão fixa, 1 célula (1:1)
    image: imageUrl,
    timestamp: Date.now()
  };

  // Adiciona o token ao Firestore
  db.collection('tokens').add(tokenData).catch(console.error);
});

//funcoes de background//

// Função para deletar o background
function deletarBackground(id) {
  // Remover o background do Firestore
  db.collection('backgrounds').doc(id).delete().catch(console.error);

  // Remover o background do DOM
  const bgElement = document.querySelector(`[data-bg-id="${id}"]`);
  if (bgElement) {
    bgElement.remove();
  }
}

// Evento de menu de contexto no tokenLayer
tokenLayer.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // Impede o menu de contexto padrão do navegador

  // Se o clique for sobre um token
  if (e.target.classList.contains('token')) {
    // Fechar menu de contexto anterior, se houver
    if (contextMenuOpen) {
      document.body.removeChild(contextMenuOpen);
      contextMenuOpen = null;
    }

    // Criar menu para deletar token
    const menu = document.createElement('div');
    menu.classList.add('context-menu');
    menu.innerHTML = `<ul><li id="delete-token">Deletar Token</li></ul>`;
    menu.style.position = 'absolute';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;

    document.body.appendChild(menu);
    contextMenuOpen = menu;

    // Ação para deletar token
    document.getElementById('delete-token').addEventListener('click', () => {
      const tokenId = e.target.getAttribute('data-id'); // ou use: e.target.dataset.id
      deletarToken(tokenId);
      document.body.removeChild(menu);
      contextMenuOpen = null;
    });

    // Fechar ao clicar fora e ao sair com o mouse
    document.addEventListener('click', () => {
      if (contextMenuOpen) {
        document.body.removeChild(contextMenuOpen);
        contextMenuOpen = null;
      }
    }, { once: true });

    menu.addEventListener('mouseleave', () => {
      if (contextMenuOpen) {
        document.body.removeChild(contextMenuOpen);
        contextMenuOpen = null;
      }
    });

  // Se o clique for sobre um background (classe "background-img")
  } else if (e.target.classList.contains('background-img')) {
    if (contextMenuOpen) {
      document.body.removeChild(contextMenuOpen);
      contextMenuOpen = null;
    }

    const menu = document.createElement('div');
    menu.classList.add('context-menu');
    // Usamos um ID diferente para o item de deletar background
    menu.innerHTML = `<ul><li id="delete-background">Deletar Background</li></ul>`;
    menu.style.position = 'absolute';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;

    document.body.appendChild(menu);
    contextMenuOpen = menu;

    // Ação para deletar background
    document.getElementById('delete-background').addEventListener('click', () => {
      const bgId = e.target.getAttribute('data-bg-id') || e.target.closest('[data-bg-id]').getAttribute('data-bg-id');
      deletarBackground(bgId);
      document.body.removeChild(menu);
      contextMenuOpen = null;
    });

    // Fechar o menu ao clicar fora
    document.addEventListener('click', () => {
      if (contextMenuOpen) {
        document.body.removeChild(contextMenuOpen);
        contextMenuOpen = null;
      }
    }, { once: true });

    // Fechar o menu ao tirar o mouse de cima
    menu.addEventListener('mouseleave', () => {
      if (contextMenuOpen) {
        document.body.removeChild(contextMenuOpen);
        contextMenuOpen = null;
      }
    });
  }
});
