// Variável para armazenar o item selecionado para ataque (global)
let selectedAttackItem = null;

(function() {
  // Função para simular a leitura de um "arquivo.txt" do localStorage
  function carregarDados(chave) {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(chave);
        if (data) {
          resolve(JSON.parse(data));
        } else {
          resolve(null);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  // Variáveis globais para manter o inventário atual e a chave usada
  let currentInventory = [];
  let currentInventoryKey = '';

  // Função que monta a chave do inventário a partir do nome do personagem
  function getInventoryKey() {
    return window.nomepersonagem + '-inventário';
  }

  // A função loadInventory utiliza a chave composta por window.nomepersonagem + '-inventário.txt'
  async function loadInventory() {
    const inventoryKey = getInventoryKey();
    let inventory = [];
    try {
      const data = await carregarDados(inventoryKey);
      if (data) {
        inventory = data;
      } else {
        inventory = [];
        saveInventory(inventory, inventoryKey);
      }
    } catch (error) {
      console.error("Erro ao carregar o inventário:", error);
      inventory = [];
      saveInventory(inventory, inventoryKey);
    }
    // Atualiza as variáveis globais para que os itens já carregados sejam mantidos
    currentInventory = inventory;
    currentInventoryKey = inventoryKey;
    updateInventoryDisplay(inventory, inventoryKey);
    updateInventoryPreview(inventory, inventoryKey);
    updateInventoryPreviewTeste(inventory, inventoryKey);
    updateTotalWeight(inventory);  // Atualiza o peso total
  }

  // Função para salvar o inventário no localStorage com a chave definida
  function saveInventory(inventory, inventoryKey) {
    localStorage.setItem(inventoryKey, JSON.stringify(inventory));
  }

  // Atualiza a exibição do inventário na tela (para a página de inventário principal)
  function updateInventoryDisplay(inventory, inventoryKey) {
    const container = document.getElementById('inventory-items');
    container.innerHTML = ''; // Limpa o container

    inventory.forEach((item, index) => {
      // Cria o container do item
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('inventory-item');

      // Ícone do item
      const icon = document.createElement('img');
      icon.src = item.icon;
      icon.alt = item.name;
      icon.classList.add('item-icon');
      itemDiv.appendChild(icon);

      // Nome do item
      const name = document.createElement('h3');
      name.textContent = item.name;
      itemDiv.appendChild(name);

      // Exibe a quantidade
      const quantity = document.createElement('p');
      quantity.textContent = 'Quantidade: ' + item.quantity;
      quantity.classList.add('item-quantity');
      itemDiv.appendChild(quantity);

      // Container para os botões de incrementar e decrementar
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('item-buttons');

      // Botão para adicionar uma unidade
      const addButton = document.createElement('button');
      addButton.textContent = '+';
      addButton.onclick = function(e) {
        e.stopPropagation(); // Evita que o clique no botão dispare o clique no item
        item.quantity++;
        saveInventory(inventory, inventoryKey);
        updateInventoryDisplay(inventory, inventoryKey);
        updateInventoryPreview(inventory, inventoryKey);
        updateInventoryPreviewTeste(inventory, inventoryKey);
      };

      // Botão para remover uma unidade
      const removeButton = document.createElement('button');
      removeButton.textContent = '-';
      removeButton.onclick = function(e) {
        e.stopPropagation();
        if (item.quantity > 0) {
          item.quantity--;
          if (item.quantity === 0) {
            inventory.splice(index, 1);
          }
          saveInventory(inventory, inventoryKey);
          updateInventoryDisplay(inventory, inventoryKey);
          updateInventoryPreview(inventory, inventoryKey);
          updateInventoryPreviewTeste(inventory, inventoryKey);
        }
      };

      buttonContainer.appendChild(addButton);
      buttonContainer.appendChild(removeButton);
      itemDiv.appendChild(buttonContainer);

      // Clique no item para abrir o modal de detalhes
      itemDiv.onclick = function() {
        showItemDetails(item, index, inventory, inventoryKey);
      };

      container.appendChild(itemDiv);
    });

    updateTotalWeight(inventory);
  }

  // Função para atualizar a pré-visualização do inventário (slider na subtab "Ações")
  function updateInventoryPreview(inventory, inventoryKey) {
    const container = document.querySelector('#inventory-preview .slider-container');
    if (!container) {
      console.warn("Container da pré-visualização não encontrado");
      return;
    }
    container.innerHTML = ''; // Limpa o container antes de adicionar os itens
    
    inventory.forEach((item, index) => {
      // Cria o container do item
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('inventory-item');
      
      // Cria e adiciona o ícone do item
      const icon = document.createElement('img');
      icon.src = item.icon;
      icon.alt = item.name;
      itemDiv.appendChild(icon);
      
      // Cria e adiciona o nome do item
      const name = document.createElement('p');
      name.textContent = item.name;
      itemDiv.appendChild(name);
      
      // Evento de clique: seleciona o item para atacar
      itemDiv.addEventListener('click', function() {
        if (itemDiv.classList.contains('selected')) {
          // Se já está selecionado, deseleciona
          itemDiv.classList.remove('selected');
          selectedAttackItem = null;
          window.selectedAttackItem = null;
        } else {
          // Remove seleção dos irmãos e seleciona este item
          const siblings = container.querySelectorAll('.inventory-item');
          siblings.forEach(sib => sib.classList.remove('selected'));
          itemDiv.classList.add('selected');
          selectedAttackItem = item;
          window.selectedAttackItem = item;
        }
      });
        
      
      container.appendChild(itemDiv);
    });
  }

  function updateInventoryPreviewTeste(inventory, inventoryKey) {
    const container = document.querySelector('#inventory-preview-testes .slider-container');
    if (!container) {
      console.warn("Container da pré-visualização não encontrado");
      return;
    }
    container.innerHTML = ''; // Limpa o container antes de adicionar os itens
    
    inventory.forEach((item, index) => {
      // Cria o container do item
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('inventory-item');
      
      // Cria e adiciona o ícone do item
      const icon = document.createElement('img');
      icon.src = item.icon;
      icon.alt = item.name;
      itemDiv.appendChild(icon);
      
      // Cria e adiciona o nome do item
      const name = document.createElement('p');
      name.textContent = item.name;
      itemDiv.appendChild(name);
      
      // Evento de clique: seleciona o item para atacar
      itemDiv.addEventListener('click', function() {
        if (itemDiv.classList.contains('selected')) {
          // Se já está selecionado, deseleciona
          itemDiv.classList.remove('selected');
          selectedAttackItem = null;
          window.selectedAttackItemteste = null;
        } else {
          // Remove seleção dos irmãos e seleciona este item
          const siblings = container.querySelectorAll('.inventory-item');
          siblings.forEach(sib => sib.classList.remove('selected'));
          itemDiv.classList.add('selected');
          selectedAttackItem = item;
          window.selectedAttackItemteste = item;
        }
      });
        
      
      container.appendChild(itemDiv);
    });
  }

  // Elementos dos modais e inputs
  const addItemModal = document.getElementById('add-item-modal');
  const openAddItemBtn = document.getElementById('open-add-item');
  const submitItemBtn = document.getElementById('submit-item');
  const cancelItemBtn = document.getElementById('cancel-item');

  const itemDetailsModal = document.getElementById('item-details-modal');
  const closeDetailsBtn = document.getElementById('close-details-button');
  const useItemBtn = document.getElementById('use-item-button');

  const inputName = document.getElementById('item-name');
  const inputIcon = document.getElementById('item-icon');
  const inputDamage = document.getElementById('item-damage');
  const inputDescription = document.getElementById('item-description');
  const inputpeso = document.getElementById('item-peso');
  const inputQuantity = document.getElementById('item-quantity');
  const inputSingleUse = document.getElementById('item-single-use'); // Checkbox para item de uso único

  const detailItemName = document.getElementById('detail-item-name');
  const detailItemIcon = document.getElementById('detail-item-icon');
  const detailItemDamage = document.getElementById('detail-item-damage');
  const detailItemDescription = document.getElementById('detail-item-description');
  const detailItempeso = document.getElementById('detail-item-peso');
  const detailItemQuantity = document.getElementById('detail-item-quantity');

  let selectedItemIndex = null;

  // Exibe o modal de adicionar item e reseta os campos
  function showAddItemModal() {
    addItemModal.style.display = 'block';
    inputName.value = '';
    inputIcon.value = '';
    inputDamage.value = '';
    inputDescription.value = '';
    inputpeso.value = '';
    inputQuantity.value = '';
    inputSingleUse.checked = false;
  }

  // Oculta o modal de adicionar item
  function hideAddItemModal() {
    addItemModal.style.display = 'none';
  }

  // Exibe o modal de detalhes do item
  function showItemDetails(item, index, inventory, inventoryKey) {
    selectedItemIndex = index;
    detailItemName.textContent = item.name;
    detailItemIcon.src = item.icon;
    detailItemDamage.textContent = item.damage;
    detailItemDescription.textContent = item.description;
    detailItempeso.textContent = item.peso;
    detailItemQuantity.textContent = item.quantity;
    itemDetailsModal.style.display = 'block';
    // Atualiza as variáveis globais para uso posterior
    currentInventory = inventory;
    currentInventoryKey = inventoryKey;
  }

  // Oculta o modal de detalhes do item
  function hideItemDetailsModal() {
    itemDetailsModal.style.display = 'none';
  }

  // Função para verificar se o personagem atual mudou e, se sim, carregar/criar o inventário referente
  async function checkForCharacterChange() {
    if (typeof window.nomepersonagem === 'undefined' || window.nomepersonagem === "") {
      alert("Crie o status antes de acessar o inventário");
      return;
    }
    const newKey = getInventoryKey();
    if (currentInventoryKey !== newKey) {
      await loadInventory();
    }
  }  

  // Eventos dos botões dos modais
  openAddItemBtn.addEventListener('click', async function() {
    // Antes de abrir o modal para adicionar item, verifica se o personagem mudou
    await checkForCharacterChange();
    showAddItemModal();
  });

  cancelItemBtn.addEventListener('click', hideAddItemModal);

  // Evento para submeter os dados e adicionar o novo item
  submitItemBtn.addEventListener('click', function() {
    if (typeof window.nomepersonagem === 'undefined' || window.nomepersonagem === "") {
      alert("Crie o status antes de acessar o inventário");
      return;
    }
    const inventoryKey = getInventoryKey();
    // Usa o inventário já carregado na variável global currentInventory
    let inventory = currentInventory.length ? currentInventory : [];
    const name = inputName.value.trim();
    const icon = inputIcon.value.trim();
    const damage = inputDamage.value.trim(); // Agora, damage é uma string como "1d20"
    const description = inputDescription.value.trim();
    const peso = parseFloat(inputpeso.value);
    const quantity = parseInt(inputQuantity.value, 10);
    const singleUse = inputSingleUse.checked; // Verifica se o item é de uso único

    if (name && icon && !isNaN(peso) && !isNaN(quantity)) {
      const newItem = {
        name,
        icon,
        damage,
        description,
        peso,
        quantity,
        singleUse
      };
      inventory.push(newItem);
      saveInventory(inventory, inventoryKey);
      updateInventoryDisplay(inventory, inventoryKey);
      updateInventoryPreview(inventory, inventoryKey);
      updateInventoryPreviewTeste(inventory, inventoryKey);
      hideAddItemModal();
      // Atualiza as variáveis globais para preservar os itens já carregados
      currentInventory = inventory;
      currentInventoryKey = inventoryKey;
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  });

  closeDetailsBtn.addEventListener('click', hideItemDetailsModal);

  // Evento para "usar" o item (consome uma unidade se for de uso único)
  useItemBtn.addEventListener('click', function() {
    if (selectedItemIndex !== null) {
      let inventory = currentInventory;
      const item = inventory[selectedItemIndex];
  
      // Chama a função rolarDano com o padrão de dano do item
      window.topico = "Rolagem de Item: " + item.name;
      const resultadoRolagem = rolarDano(item.damage);
      // Exibe o resultado da rolagem (pode ser um alert ou atualizar algum elemento na tela)
      alert("Resultado da rolagem:\n" + resultadoRolagem);
  
      // Se o item for de uso único, consome uma unidade
      if (item.singleUse && item.quantity > 0) {
        item.quantity--;
        if (item.quantity === 0) {
          inventory.splice(selectedItemIndex, 1);
          hideItemDetailsModal();
        } else {
          detailItemQuantity.textContent = item.quantity;
        }
        saveInventory(inventory, currentInventoryKey);
        updateInventoryDisplay(inventory, currentInventoryKey);
        updateInventoryPreview(inventory, currentInventoryKey);
        updateInventoryPreviewTeste(inventory, inventoryKey);
      } else if (!item.singleUse) {
        // Se não for de uso único, talvez apenas use o item sem removê-lo
        alert('Item usado (não consumido).');
      }
    }
  });  

  // Observer para detectar quando a aba do inventário entra na viewport
  const inventoryTab = document.getElementById('inventory');
  const observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        await checkForCharacterChange();
      }
    }
  }, {
    threshold: 0.1 // dispara quando pelo menos 10% do elemento estiver visível
  });
  observer.observe(inventoryTab);
  
  // Ao carregar o DOM, verifica se window.nomepersonagem está definido e carrega o inventário
  document.addEventListener('DOMContentLoaded', async () => {
    if (typeof window.nomepersonagem === 'undefined' || window.nomepersonagem === "") {
      alert("Crie o status antes de acessar o inventário, ou certifique-se de carregar um nome personagem em config>status. Para já iniciar com uma ficha certifique-se de marcar checkbox personagem de inicialização.");
      return;
    }
    await loadInventory();
  });

  function updateTotalWeight(inventory) {
    // Calcula o peso total multiplicando o peso de cada item pela sua quantidade
    const totalWeight = inventory.reduce((acc, item) => acc + (item.peso * item.quantity), 0);
    // Seleciona o elemento de exibição do peso total
    const totalWeightDisplay = document.getElementById('total-weight');
    if (totalWeightDisplay) {
      totalWeightDisplay.textContent = "Peso total do inventário: " + totalWeight;
    }
  }
  
})();
