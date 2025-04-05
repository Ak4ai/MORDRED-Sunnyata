window.onload = function() {
    if (typeof gapi !== 'undefined' && gapi.load) {
        gapiLoaded();
    } else {
        console.error("gapi não carregado corretamente.");
    }

    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
        if (typeof gisLoaded === 'function') {
            gisLoaded();
        } else {
            console.error("Função gisLoaded não está definida ainda.");
        }
    } else {
        console.error("Google Identity Services (GIS) não carregado corretamente.");
    }

    // Esconde o loader automaticamente após 5 segundos
    setTimeout(hideLoader, 5000);
};


function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) { // Checar se o loader existe
        loader.style.display = 'none';
    }
}

// Função para verificar se tudo foi carregado
function checkIfEverythingLoaded() {
    const userIcon = document.querySelector('.user-icon');
    const userName = document.querySelector('.user-name');
    const userInfoDiv = document.querySelector('.user-info');

    // Verifica continuamente se tudo foi carregado
    const interval = setInterval(() => {
        if (gapiInited && gisInited && userInfoDiv.style.display === 'flex' && userIcon.src && userName.textContent) {
            hideLoader();
            clearInterval(interval); // Para de verificar após sucesso
        }
    }, 100); // Verifica a cada 100ms
}


var CLIENT_ID = '607317652690-jukucl3pro5ts8agt3cpndm9teosg1c7.apps.googleusercontent.com';
var API_KEY = 'AIzaSyC3-6BvwRHqP7cEtyv9A9Oqhu-67UcKJbI';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid';

var signinButton = document.getElementsByClassName('signin')[0];
var signoutButton = document.getElementsByClassName('signout')[0];
var syncButton = document.getElementsByClassName('sync')[0];

let tokenClient;
let gapiInited = false;
let gisInited = false;
 
// Chave para armazenar o token no localStorage
const ACCESS_TOKEN_KEY = 'drive_access_token';

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeEnableButtons();
}

window.gisLoaded = function () {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '' // Será definido em handleAuthClick
    });
    gisInited = true;
    maybeEnableButtons();
};

var restoreButton = document.getElementsByClassName('restore')[0];

function maybeEnableButtons() {
    const userInfoDiv = document.querySelector('.user-info');
    
    if (gapiInited && gisInited) {
        const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (savedToken) {
            gapi.client.setToken({ access_token: savedToken });
            signinButton.style.display = 'none';
            signoutButton.style.display = 'block';
            syncButton.style.display = 'flex';
            restoreButton.style.display = 'block';
            
            getUserInfo(savedToken);
            updateLastSyncMessage();
            console.log('Sessão restaurada com token salvo.');
        } else {
            signinButton.style.display = 'block';
            signoutButton.style.display = 'none';
            syncButton.style.display = 'none';
            restoreButton.style.display = 'none';
            userInfoDiv.style.display = 'none';
            hideLoader(); // Ocultar loader caso o usuário não esteja autenticado
        }
    }
}

// Autenticação
signinButton.onclick = () => {
    if (!gisInited) {
        console.error('Token Client ainda não foi inicializado!');
        return;
    }
    handleAuthClick();
};

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw resp;
        }

        // Salva o token no localStorage para futuras sessões
        localStorage.setItem(ACCESS_TOKEN_KEY, resp.access_token);
        gapi.client.setToken({ access_token: resp.access_token });

        // Verifica se o escopo do Google Drive foi concedido
        const grantedScopes = resp.scope ? resp.scope.split(' ') : [];
        if (!grantedScopes.includes('https://www.googleapis.com/auth/drive')) {
            alert('Você deve conceder permissão ao Google Drive para usar a sincronização.');
            handleSignoutClick(); // Faz logout se a permissão não foi concedida
            return;
        }

        signinButton.style.display = 'none';
        signoutButton.style.display = 'block';
        syncButton.style.display = 'flex';
        restoreButton.style.display = 'block'; // Esconde o botão de restore


        console.log('Sign-in Successful');
        getUserInfo(resp.access_token);
    };

    // Sempre solicita consentimento, garantindo que o usuário conceda as permissões necessárias
    tokenClient.requestAccessToken({ prompt: 'consent', scope: SCOPES });
}


// Logout
signoutButton.onclick = () => handleSignoutClick();
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        localStorage.removeItem(ACCESS_TOKEN_KEY);

        signinButton.style.display = 'block';
        signoutButton.style.display = 'none';
        syncButton.style.display = 'none';
        restoreButton.style.display = 'none'; // Esconde o botão de restore

        // Limpa as informações do usuário
        const userInfoDiv = document.querySelector('.user-info');
        const userIcon = document.querySelector('.user-icon');
        const userName = document.querySelector('.user-name');
        userInfoDiv.style.display = 'none';
        userIcon.src = '';
        userName.textContent = '';
        
        console.log('Sign-out Successful');
    }
}



// Função para sincronizar o localStorage com o Google Drive
syncButton.onclick = () => synchronizeWithDrive();
// Função para encontrar ou criar a pasta "MORDREDDADOS" no Google Drive
function findOrCreateFolder(callback) {
  // Query para buscar pela pasta com o nome e mimeType de pasta
  const query = "name='MORDREDDADOS' and mimeType='application/vnd.google-apps.folder' and trashed=false";
  gapi.client.drive.files.list({
      'q': query,
      'fields': "files(id, name)"
  }).then(function(response) {
      const files = response.result.files;
      if (files && files.length > 0) {
          console.log('Pasta MORDREDDADOS encontrada.');
          callback(files[0].id);
      } else {
          console.log('Pasta MORDREDDADOS não encontrada. Criando nova pasta...');
          const folderMetadata = {
              'name': 'MORDREDDADOS',
              'mimeType': 'application/vnd.google-apps.folder'
          };
          gapi.client.drive.files.create({
              resource: folderMetadata,
              fields: 'id'
          }).then(function(response) {
              console.log('Pasta MORDREDDADOS criada.');
              callback(response.result.id);
          });
      }
  });
}

// Função para encontrar um arquivo específico na pasta "MORDREDDADOS"
function findFileInFolder(fileName, folderId, callback) {
  const query = "name='" + fileName + ".json' and '" + folderId + "' in parents and trashed=false";
  gapi.client.drive.files.list({
      'q': query,
      'fields': "files(id, name)"
  }).then(function(response) {
      const files = response.result.files;
      if (files && files.length > 0) {
          callback(files[0].id);
      } else {
          callback(null);
      }
  });
}

// Função para criar um novo arquivo no Google Drive
function createFileOnDrive(fileName, content, folderId, callback) {
  const fileMetadata = {
      'name': fileName + '.json',
      'mimeType': 'application/json',
      'parents': [folderId]
  };

  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const closeDelim = "\r\n--" + boundary + "--";

  const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(fileMetadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      content +
      closeDelim;

  const request = gapi.client.request({
      'path': '/upload/drive/v3/files',
      'method': 'POST',
      'params': { 'uploadType': 'multipart' },
      'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody
  });

  request.execute((file) => {
      if (file && file.id) {
          console.log('Arquivo "' + fileName + '" criado com sucesso:', file);
      } else {
          console.error('Erro ao criar o arquivo "' + fileName + '":', file);
      }
      if (callback) callback();
  });
}

// Função para atualizar um arquivo existente no Google Drive
function updateFileOnDrive(fileId, fileName, content, callback) {
  const fileMetadata = {
      'name': fileName + '.json',
      'mimeType': 'application/json'
  };

  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const closeDelim = "\r\n--" + boundary + "--";

  const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(fileMetadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      content +
      closeDelim;

  const request = gapi.client.request({
      'path': '/upload/drive/v3/files/' + fileId,
      'method': 'PATCH',
      'params': { 'uploadType': 'multipart' },
      'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody
  });

  request.execute((file) => {
      if (file && file.id) {
          console.log('Arquivo "' + fileName + '" atualizado com sucesso:', file);
      } else {
          console.error('Erro ao atualizar o arquivo "' + fileName + '":', file);
      }
      if (callback) callback();
  });
}

// Função que decide se atualiza ou cria um arquivo no Google Drive
function uploadOrUpdateFileToDrive(fileName, content, folderId, callback) {
  findFileInFolder(fileName, folderId, function(existingFileId) {
      if (existingFileId) {
          // Se o arquivo já existe, atualiza-o
          updateFileOnDrive(existingFileId, fileName, content, callback);
      } else {
          // Se não existe, cria um novo arquivo
          createFileOnDrive(fileName, content, folderId, callback);
      }
  });
}

function synchronizeWithDrive() {
    if (localStorage.length === 0) {
        alert('Não há arquivos no localStorage para sincronizar.');
        return;
    }

    // Chaves que **não** devem ser sincronizadas
    const EXCLUDED_KEYS = [ACCESS_TOKEN_KEY, 'user_icon', 'user_name', 'last_sync'];

    // Garante que a pasta MORDREDDADOS exista
    findOrCreateFolder(function(folderId) {
        let totalArquivos = 0;
        let arquivosProcessados = 0;

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);

            // Pula chaves que não devem ser salvas
            if (EXCLUDED_KEYS.includes(key)) continue;

            totalArquivos++;
            let fileContent = localStorage.getItem(key);

            // Para cada arquivo, procura se ele já existe na pasta e atualiza ou cria conforme necessário
            uploadOrUpdateFileToDrive(key, fileContent, folderId, () => {
                arquivosProcessados++;
                if (arquivosProcessados === totalArquivos) {
                    // Armazena a data/hora da sincronização
                    const now = new Date();
                    localStorage.setItem('last_sync', now.toISOString());
                    updateLastSyncMessage();
                    alert('Backup concluído para ' + totalArquivos + ' arquivo(s).');
                }
            });
        }

        // Se nenhum arquivo relevante foi encontrado, ainda precisamos atualizar a última sincronização
        if (totalArquivos === 0) {
            const now = new Date();
            localStorage.setItem('last_sync', now.toISOString());
            updateLastSyncMessage();
            alert('Nada para sincronizar. Nenhum dado relevante encontrado.');
        }
    }, function(error) {
        mostrarMensagem('Erro ao sincronizar. Por favor, faça sign out, sign in novamente e, se o problema persistir, use o botão "Apagar dados e recarregar".');
    });
}


// Função para atualizar a mensagem de última sincronização
function updateLastSyncMessage() {
    const lastSyncElem = document.querySelector('.last-sync');
    const lastSync = localStorage.getItem('last_sync');
    if (lastSync) {
        const date = new Date(lastSync);
        // Formata a data/hora conforme sua preferência
        const formatted = date.toLocaleString();
        lastSyncElem.textContent = 'Última sincronização: ' + formatted;
        lastSyncElem.style.display = 'block';
    } else {
        lastSyncElem.style.display = 'none';
    }
}

function getUserInfo(accessToken) {
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(response => response.json())
    .then(data => {
        if (data.picture && data.name) {
            const userIcon = document.querySelector('.user-icon');
            const userName = document.querySelector('.user-name');
            const userInfoDiv = document.querySelector('.user-info');

            userIcon.src = data.picture; // URL da imagem do usuário
            userName.textContent = data.name; // Nome do usuário
            userInfoDiv.style.display = 'flex'; // Mostra as informações do usuário
            
            checkIfEverythingLoaded(); // Checar se o carregamento está completo
        }
    })
    .catch(error => {
        console.error('Erro ao obter informações do usuário: ', error);
    });
}


function restoreUserInfo() {
    const savedIcon = localStorage.getItem('user_icon');
    const savedName = localStorage.getItem('user_name');
    const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (savedToken && savedIcon && savedName) {
        const userIcon = document.querySelector('.user-icon');
        const userName = document.querySelector('.user-name');
        const userInfoDiv = document.querySelector('.user-info');
        
        userIcon.src = savedIcon;
        userName.textContent = savedName;
        userInfoDiv.style.display = 'flex';
    }
}

restoreButton.onclick = () => downloadFilesFromDrive();

function downloadFilesFromDrive() {
    // Localiza ou cria a pasta "MORDREDDADOS"
    findOrCreateFolder(function(folderId) {
        // Lista arquivos JSON presentes na pasta
        gapi.client.drive.files.list({
            q: "'" + folderId + "' in parents and trashed=false and mimeType='application/json'",
            fields: "files(id, name)"
        }).then(function(response) {
            const files = response.result.files;
            if (!files || files.length === 0) {
                alert("Nenhum arquivo encontrado no Drive.");
                return;
            }
            
            let totalFiles = files.length;
            let processedFiles = 0;
            
            files.forEach(file => {
                // Baixa o conteúdo do arquivo
                gapi.client.drive.files.get({
                    fileId: file.id,
                    alt: 'media'
                }).then(function(resp) {
                    // O conteúdo baixado está em resp.body
                    const content = resp.body;
                    // Remove a extensão .json para usar como chave
                    const key = file.name.replace(/\.json$/, '');
                    localStorage.setItem(key, content);
                    
                    processedFiles++;
                    // Quando todos os arquivos forem processados, exibe uma mensagem
                    if (processedFiles === totalFiles) {
                        alert('Arquivos restaurados do Drive para o localStorage.');
                        location.reload(true);
                    }
                }).catch(error => {
                    console.error("Erro ao baixar o arquivo " + file.name, error);
                    processedFiles++;
                    if (processedFiles === totalFiles) {
                        mostrarMensagem('Erro ao restaurar backup. Por favor, faça sign out, sign in novamente e, se o problema persistir, use o botão "Apagar dados e recarregar".');
                    }
                });
            });
        }).catch(error => {
            console.error("Erro ao listar arquivos na pasta MORDREDDADOS:", error);
            mostrarMensagem('Erro ao listar arquivos do Drive. Por favor, faça sign out, sign in novamente e, se o problema persistir, use o botão "Apagar dados e recarregar".');
        });
    });
}

function verificarValidadeToken() {
    console.log('Verificando validade do token...');
    const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!savedToken) {
        console.log('Nenhum token salvo encontrado. Usuário não está logado.');
        return;
    }

    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': 'Bearer ' + savedToken }
    })
    .then(response => {
        if (!response.ok) {
            // Token inválido (ex: expirado ou revogado)
            mostrarMensagem('Sua sessão do Google expirou. Por favor, clique em "Sign Out" e entre novamente.');
        } else {
            console.log('Token válido. Tudo está funcionando corretamente.');
        }
    })
    .catch(err => {
        console.error('Erro ao validar token do Google:', err);
    });
}




