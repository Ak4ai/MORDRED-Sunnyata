let personagem; // Declaracao global do objeto personagem
let habilidadesData;
let habilidade;
let atualizarStatusCheck = false;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Procura por uma chave de personagem com check == 1 no localStorage
        let chavePersonagemSelecionado = null;

        for (let key in localStorage) {
            // Garante que a propriedade pertence ao localStorage
            if (localStorage.hasOwnProperty(key)) {
                // Verifica se a chave termina com '-personagem'
                if (key.endsWith('-personagem')) {
                    // Tenta fazer o parse do conteúdo JSON da chave
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        // Se o atributo check for 1, selecionamos este personagem
                        if (data.check === 1) {
                            chavePersonagemSelecionado = key;
                            break;
                        }
                    } catch (e) {
                        console.warn(`Não foi possível parsear o valor de ${key}:`, e);
                    }
                }
            }
        }

        if (!chavePersonagemSelecionado) {
            throw new Error("Nenhum personagem com 'check' igual a 1 foi encontrado no localStorage.");
        }

        // Armazena o nome do arquivo sem o sufixo '-personagem' na variável global
        window.nomepersonagem = chavePersonagemSelecionado.replace('-personagem', '');
        document.getElementById('status-nome').textContent = window.nomepersonagem || 'Nome do Personagem';
        console.log(`Personagem selecionado: ${chavePersonagemSelecionado}`);
        console.log(`Nome do personagem salvo em window.nomepersonagem: ${window.nomepersonagem}`);

        // Carrega os dados do personagem usando a chave encontrada
        const personagemData = await carregarDados(chavePersonagemSelecionado);
        console.log('Dados do personagem recebidos:', personagemData);

        // Inicializa a instância da classe Personagem e atualiza a interface
        personagem = new Personagem(personagemData);
        atualizarInfoPersonagem(personagem);

        // Supomos que a chave de habilidades segue o mesmo padrão, substituindo "personagem" por "habilidades"
        const chaveHabilidades = chavePersonagemSelecionado.replace('personagem', 'habilidades');

        // Carrega os dados das habilidades
        const habilidadesData = await carregarDados(chaveHabilidades);
        console.log('Dados das habilidades recebidos:', habilidadesData);

        // Exibe as habilidades na interface
        exibirHabilidades(habilidadesData);
    } catch (error) {
        console.error('Erro ao obter dados do personagem ou habilidades:', error);
    }
});

function carregarDados(key) {
    return new Promise((resolve, reject) => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                resolve(parsedData);
            } catch (e) {
                reject(e);
            }
        } else {
            reject(new Error('Dados não encontrados.'));
        }
    });
}
  
class Personagem {
    constructor(data) {
        this.img = data.img;
        this.vida = data.vida;
        this.vidaMax = data.vidaMax;
        this.alma = data.alma;
        this.almaMax = data.almaMax;
        this.escudo = data.escudo;
        this.escudoMax = data.escudoMax;
        this.fortitude = data.fortitude;
        this.conhecimento = data.conhecimento;
        this.espirito = data.espirito;
        this.forca = data.forca;
        this.agilidade = data.agilidade;
        this.periciaDestreza = data.periciaDestreza;
        this.periciaPontaria = data.periciaPontaria;
        this.periciaTecnica = data.periciaTecnica;
        this.periciaFurtividade = data.periciaFurtividade;
        this.periciaLuta = data.periciaLuta;
        this.periciaMente = data.periciaMente;
        this.periciaInteligencia = data.periciaInteligencia;
        this.periciaIniciativa = data.periciaIniciativa;
        this.periciaVigor = data.periciaVigor;
        this.periciaObservacao = data.periciaObservacao;
        this.periciaDiplomacia = data.periciaDiplomacia;
        this.periciaSorte = data.periciaSorte;
        this.periciaMedicina = data.periciaMedicina;
        this.periciaVontade = data.periciaVontade;
        this.tracoRaiz = data.tracoRaiz;
        this.tracoRaca = data.tracoRaca;
        this.tracoCultura = data.tracoCultura;
        this.tracoCorpo = data.tracoCorpo;
        this.tracoDefeitos = data.tracoDefeitos;
        this.tracoEfeitos = data.tracoEfeitos;
        this.tracoPeso = data.tracoPeso;
        this.tracoSubraiz = data.tracoSubraiz;
        this.tracoHistoria = data.tracoHistoria;
    }

    // Metodos para retornar detalhes específicos
    getVida() {
        return this.vida;
    }

    getAlma() {
        return this.alma;
    }

    getEscudo() {
        return this.escudo;
    }

    getPericias() {
        return {
            destreza: this.periciaDestreza,
            pontaria: this.periciaPontaria,
            tecnica: this.periciaTecnica,
            furtividade: this.periciaFurtividade,
            luta: this.periciaLuta,
            mente: this.periciaMente,
            inteligencia: this.periciaInteligencia,
            iniciativa: this.periciaIniciativa,
            vigor: this.periciaVigor,
            observacao: this.periciaObservacao,
            diplomacia: this.periciaDiplomacia,
            sorte: this.periciaSorte,
            medicina: this.periciaMedicina,
            vontade: this.periciaVontade
        };
    }

    getTracos() {
        return {
            raiz: this.tracoRaiz,
            raca: this.tracoRaca,
            cultura: this.tracoCultura,
            corpo: this.tracoCorpo,
            defeitos: this.tracoDefeitos,
            efeitos: this.tracoEfeitos,
            peso: this.tracoPeso,
            subraiz: this.tracoSubraiz,
            historia: this.tracoHistoria
        };
    }


    getAtributos() {
        return {
            fortitude: this.fortitude,
            conhecimento: this.conhecimento,
            espirito: this.espirito,
            forca: this.forca,
            agilidade: this.agilidade
        };
    }

    // Metodos para modificar atributos
    reduzirAlma(valor) {
        this.alma -= valor;
    }

    adicionarAlma(valor) {
        this.alma += valor;
    }

    reduzirVida(valor) {
        this.vida -= valor;
    }

    adicionarVida(valor) {
        this.vida += valor;
    }

    // Metodos para modificar atributos do objeto Personagem
    reduzirEscudo(valor) {
        this.escudo -= valor;
        // Adicione aqui qualquer lógica adicional, como validações ou atualizações de interface
    }

    adicionarEscudo(valor) {
        this.escudo += valor;
        // Adicione aqui qualquer lógica adicional, como validações ou atualizações de interface
    }

    // Metodo para retornar o status geral
    obterStatus() {
        return `Vida: ${this.vida} | Alma: ${this.alma} | Fortitude: ${this.fortitude} | conhecimento: ${this.conhecimento} | espirito: ${this.espirito} | Força: ${this.forca} | Agilidade: ${this.agilidade}`;
    }
}

function atualizarInfoPersonagem(Personagem) {
    // Atualiza a imagem do personagem
    const imgElement = document.getElementById('status-img');
    if (imgElement) {
        imgElement.src = personagem.img || ''; // Define a URL da imagem ou uma string vazia
    } else {
        console.error('Elemento com ID "status-img" não encontrado no DOM.');
    }
    document.getElementById('status-vida1').innerText = personagem.vida;
    document.getElementById('status-vida').innerText = personagem.vida;
    document.getElementById('status-alma1').innerText = personagem.alma;
    document.getElementById('status-alma').innerText = personagem.alma;
    document.getElementById('status-escudo1').innerText = personagem.escudo;
    document.getElementById('status-escudo').innerText = personagem.escudo;
    document.getElementById('status-fortitude').innerText = personagem.fortitude;
    document.getElementById('status-conhecimento').innerText = personagem.conhecimento;
    document.getElementById('status-espirito').innerText = personagem.espirito;
    document.getElementById('status-forca').innerText = personagem.forca;
    document.getElementById('status-agilidade').innerText = personagem.agilidade;

    // Dentro de atualizarInfoPersonagem(Personagem)
    document.getElementById('status-bar-vida1').style.width = (personagem.vida / personagem.vidaMax) * 100 + '%';
    document.getElementById('status-bar-vida').style.width = (personagem.vida / personagem.vidaMax) * 100 + '%';
    document.getElementById('status-bar-alma1').style.width = (personagem.alma / personagem.almaMax) * 100 + '%';
    document.getElementById('status-bar-alma').style.width = (personagem.alma / personagem.almaMax) * 100 + '%';
    document.getElementById('status-bar-escudo1').style.width = (personagem.escudo / personagem.escudoMax) * 100 + '%';
    document.getElementById('status-bar-escudo').style.width = (personagem.escudo / personagem.escudoMax) * 100 + '%';

    const pericias = personagem.getPericias();
    document.getElementById('status-pericia-destreza').innerText = pericias.destreza;
    document.getElementById('status-pericia-pontaria').innerText = pericias.pontaria;
    document.getElementById('status-pericia-tecnica').innerText = pericias.tecnica;
    document.getElementById('status-pericia-furtividade').innerText = pericias.furtividade;
    document.getElementById('status-pericia-mente').innerText = pericias.mente;
    document.getElementById('status-pericia-vigor').innerText = pericias.vigor;
    document.getElementById('status-pericia-observacao').innerText = pericias.observacao;
    document.getElementById('status-pericia-inteligencia').innerText = pericias.inteligencia;
    document.getElementById('status-pericia-luta').innerText = pericias.luta;
    document.getElementById('status-pericia-iniciativa').innerText = pericias.iniciativa;
    document.getElementById('status-pericia-diplomacia').innerText = pericias.diplomacia;
    document.getElementById('status-pericia-sorte').innerText = pericias.sorte;
    document.getElementById('status-pericia-medicina').innerText = pericias.medicina;
    document.getElementById('status-pericia-vontade').innerText = pericias.vontade;

    const tracos = personagem.getTracos();
    document.getElementById('status-traco-raiz').innerText = tracos.raiz;
    document.getElementById('status-traco-raca').innerText = tracos.raca;
    document.getElementById('status-traco-cultura').innerText = tracos.cultura;
    document.getElementById('status-traco-corpo').innerText = tracos.corpo;
    document.getElementById('status-traco-defeitos').innerText = tracos.defeitos;
    document.getElementById('status-traco-efeitos').innerText = tracos.efeitos;
    document.getElementById('status-traco-peso').innerText = tracos.peso;
    document.getElementById('status-traco-subraiz').innerText = tracos.subraiz;
    document.getElementById('status-traco-historia').innerText = tracos.historia;
}


let danoTotal = 0;

class HabilidadeBase {
    constructor(nome, personagem) {
        this.nome = nome;
        this.personagem = personagem;
        this.id = nome; // Define o ID da habilidade igual ao nome
    }

    rolarDado(lados, quantidade = 1) {
        let resultados = [];
        for (let i = 0; i < quantidade; i++) {
            resultados.push(Math.floor(Math.random() * lados) + 1);
        }
        return [resultados, resultados.reduce((a, b) => a + b, 0), lados * quantidade];
    }
}

// Variável para armazenar a fila de mensagens
const filaDeMensagens = [];

function mostrarMensagem(mensagem) {
    const dialog = document.getElementById('custom-dialog');
    const dialogMessage = document.getElementById('dialog-message');
    const dialogOkButton = document.getElementById('dialog-ok-button');

    // Adiciona a mensagem à fila de mensagens
    filaDeMensagens.push(mensagem);

    // Verifica se o diálogo já está sendo exibido
    if (dialog.style.display === 'none' || dialog.style.display === '') {
        exibirProximaMensagem();
        exibirBlurBackground(); // Exibe o blur-background ao mostrar o primeiro diálogo
    }
}

function exibirProximaMensagem() {
    const dialog = document.getElementById('custom-dialog');
    const dialogMessage = document.getElementById('dialog-message');
    const dialogOkButton = document.getElementById('dialog-ok-button');

    // Verifica se há mensagens na fila
    if (filaDeMensagens.length > 0) {
        // Obtem a próxima mensagem da fila
        const mensagem = filaDeMensagens.shift(); // Remove e retorna o primeiro elemento da fila

        // Define a mensagem no diálogo e exibe
        dialogMessage.innerText = mensagem;
        dialog.style.display = 'flex';

        // Limpa qualquer evento onclick anterior do botão
        dialogOkButton.onclick = null;

        // Define o evento onclick para fechar o diálogo e exibir a próxima mensagem
        dialogOkButton.onclick = function() {
            dialog.style.display = 'none';
            // Verifica se ainda há mensagens na fila após fechar o diálogo
            if (filaDeMensagens.length === 0) {
                esconderBlurBackground(); // Esconde o blur-background ao fechar o último diálogo
            }
            exibirProximaMensagem(); // Exibe a próxima mensagem da fila

        };
    }
}

function exibirBlurBackground() {
    const blurBackground = document.getElementById('blur-background');
    blurBackground.style.display = 'block';
}

function esconderBlurBackground() {
    const blurBackground = document.getElementById('blur-background');
    blurBackground.style.display = 'none';
}

function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.innerText.toLowerCase() === tabName) {
            tab.classList.add('active');
        }
    });

    contents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabName) {
            content.classList.add('active');
            if (tabName === 'info') {
                atualizarInfoPersonagem(Personagem); // Chama a atualizacao ao abrir a guia "Info"
                // Inicia o timer para atualizar a cada 5 segundos
                setInterval(atualizarInfoPersonagem, 5000); // 5000 milissegundos = 5 segundos
            }
        }
    });
}


function openSubtab(tabName, subtabName) {
    // Esconde todas as subcontent e remove a classe "active" das subtabs
    var subcontents = document.querySelectorAll('.subcontent');
    for (var i = 0; i < subcontents.length; i++) {
        subcontents[i].classList.remove('active');
    }

    var subtabs = document.querySelectorAll('.subtab');
    for (var i = 0; i < subtabs.length; i++) {
        subtabs[i].classList.remove('active');
    }

    // Exibe a subcontent selecionada e adiciona a classe "active" na subtab correspondente
    var subcontent = document.getElementById(subtabName);
    if (subcontent) {
        subcontent.classList.add('active');
        document.querySelector('.subtab[data-tab="' + subtabName + '"]').classList.add('active');
    }

    // Verifica se estamos na aba "Habilidades" e mostra o texto de nenhuma habilidade selecionada se necessário
    if (tabName === 'skills' && subtabName === 'habilidades') {
        if (nenhumaHabilidadeSelecionada()) {
            document.getElementById('texto-nenhuma-habilidade').style.display = 'block';
        } else {
            document.getElementById('texto-nenhuma-habilidade').style.display = 'none';
        }
    }
}

// Funcao para verificar e exibir mensagem quando nenhuma habilidade está selecionada
function verificarHabilidadeSelecionada() {
    var habilidadeNome = document.getElementById('habilidade-nome').innerText.trim();
    
    if (habilidadeNome === '') {
      document.getElementById('habilidade-descricao').innerText = 'Escolha uma habilidade na aba escolha.';
    }
  }
  


// Chamada inicial para verificar se há uma habilidade selecionada ao carregar a página
verificarHabilidadeSelecionada();

function escolherHabilidade(habilidadeId, habilidadesData) {
    console.log(`Habilidade selecionada: ${habilidadeId}`);
    console.log('habilidadesData:', habilidadesData);

    try {
        const habilidade = habilidadesData.habilidades.find(h => h.id.toString() === habilidadeId.toString());
        if (habilidade) {
            // Muda para a aba "Habilidades"
            openSubtab('skills', 'habilidades');
            console.log('Habilidade encontrada:', habilidade);
            document.getElementById('habilidade-nome').textContent = habilidade.nome;
            document.getElementById('dano-total').textContent = `Dano: ${habilidade.dano}`;
            if (habilidade.toggle){
                document.getElementById('teste-habilidade').textContent = `Teste: ${habilidade.pericia} + ${habilidade.atributo}` + (habilidade.vantagens ? ` + ${habilidade.vantagens}` : '' + (habilidade.modificador ? ` + ${habilidade.modificador}` : '')); // Atualiza o teste de habilidade
            }else{
                document.getElementById('teste-habilidade').textContent =  'Sem teste de Habilidade para essa habilidade'; // Atualiza o teste de habilidade
            }
            let tempdescrição = habilidade.descricao; // Armazena a descricao da habilidade
            document.getElementById('habilidade-descricao').textContent = tempdescrição; // Atualiza a descricao da habilidade
            habilidade.descricao = typeof tempdescrição === 'string' ? tempdescrição : ''; // Ensure descricao is a string
            atualizarDescricaoHabilidade(habilidade.descricao); // Chama a funcao para atualizar a descricao

            // Limpa os botões existentes
            const botoesHabilidade = document.getElementById('botoes-habilidade');
            botoesHabilidade.innerHTML = ''; 

            // Adiciona o botão de usar habilidade
            let botaoUsar = document.createElement('button');
            botaoUsar.innerText = "Usar Habilidade";
            botaoUsar.onclick = function () {
                aplicarHabilidade(habilidade);
                atualizarInfoPersonagem(Personagem);
            };
            botoesHabilidade.appendChild(botaoUsar);

            atualizarStatus(habilidade.status); // Chama a funcao para atualizar o status
        } else {
            console.error('Habilidade não encontrada:', habilidadeId);
        }
    } catch (error) {
        console.error('Erro ao processar dados de habilidades:', error);
    }
}

function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.innerText.toLowerCase() === tabName) {
            tab.classList.add('active');
        }
    });

    contents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabName) {
            content.classList.add('active');
            if (tabName === 'info') {
                atualizarInfoPersonagem(Personagem); // Chama a atualizacao ao abrir a guia "Info"
                // Inicia o timer para atualizar a cada 5 segundos
                setInterval(atualizarInfoPersonagem, 5000); // 5000 milissegundos = 5 segundos
            }
        }
    });
}

function openSubtab(tab, subtab) {
    console.log(`Abrindo subtab: ${subtab}`);
    const tabElement = document.getElementById(tab);
    const subcontents = tabElement.querySelectorAll('.subcontent');
    const subtabs = tabElement.querySelectorAll('.subtab');

    subcontents.forEach(content => {
        content.classList.remove('active');
    });
    subtabs.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(subtab).classList.add('active');
    tabElement.querySelector(`div[onclick="openSubtab('${tab}', '${subtab}')"]`).classList.add('active');
}

function limparHabilidades() {
    const escolhaHabilidadesDiv = document.getElementById('escolha-habilidades');
    const existingButtons = Array.from(escolhaHabilidadesDiv.getElementsByTagName('button'));

    // Imprime os IDs dos botões que serão removidos
    existingButtons.forEach(button => {
        const id = button.getAttribute('data-id');
        if (id === '1') {
            console.log(`Removendo botão com ID: ${id}`);
        }
    });

    // Remove apenas os botões com ID igual a 1
    existingButtons.forEach(button => {
        const id = button.getAttribute('data-id');
        if (id >= '1') {
            escolhaHabilidadesDiv.removeChild(button);
        }
    });
}

function exibirHabilidades(habilidadesData) {
    try {
        console.log("Dados de habilidades carregados:", habilidadesData);

        // Limpa as habilidades carregadas anteriormente
        limparHabilidades();

        const escolhaHabilidadesDiv = document.getElementById('escolha-habilidades');

        habilidadesData.habilidades.forEach(habilidade => {
            const button = document.createElement('button');
            button.textContent = habilidade.nome;
            button.setAttribute('data-id', habilidade.id);
            button.onclick = function() {
                const id = this.getAttribute('data-id');
                console.log(`Botão clicado: ${id}`);
                escolherHabilidade(id, habilidadesData); // Passa habilidadesData como parâmetro
            };
            escolhaHabilidadesDiv.appendChild(button);
        });
    } catch (error) {
        console.error('Erro ao processar dados de habilidades:', error);
    }
}


function atualizarStatus(status) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = `Status: ${status}`;
    } else {
        console.error('Elemento de status não encontrado.');
    }
    atualizarInfoPersonagem(Personagem)
}


function rolarDano(expressao) {
    let topico = window.topico;
    // Remover espaços em branco e converter para minúsculas
    expressao = expressao.replace(/\s/g, '').toLowerCase();

    // Verificar se há um termo 'max' no início
    let maximo = false;
    if (expressao.startsWith('max')) {
        maximo = true;
        expressao = expressao.slice(3);
    }

    // Separar os termos de dano por vírgula
    const termos = expressao.split(',');

    // Preparar para armazenar o resultado total do dano
    let totalDano = 0;
    let rolagensTotais = [];
    let valoresIndividuais = [];

    // Iterar sobre cada termo de dano
    termos.forEach(termo => {
        // Encontrar a posição do primeiro 'd'
        const indexD = termo.indexOf('d');
        
        let quantidade = 1; // Valor padrão
        let faces = 0;
        let modificador = 0;
        
        // Variáveis novas para modificador percentual
        let isPercentage = false;         // indica se há modificador percentual
        let percentageValue = 0;          // armazena o valor percentual (ex.: 50 para 50%)
        let modText = '';                 // texto original para exibição

        // Extrair quantidade e faces do dado
        if (indexD !== -1) {
            quantidade = parseInt(termo.slice(0, indexD)) || 1;
            const restante = termo.slice(indexD + 1);

            // Nova lógica: verificar se há um modificador percentual (ex.: +50%)
            if (restante.includes('%')) {
                isPercentage = true;
                const matchPercentage = restante.match(/^(\d+)([+-]\d+)%$/);
                if (matchPercentage) {
                    faces = parseInt(matchPercentage[1]) || 0;
                    percentageValue = parseInt(matchPercentage[2]) || 0;
                    modText = (percentageValue >= 0 ? '+' : '') + percentageValue + '%';
                } else {
                    throw new Error(`Expressão inválida: ${termo}`);
                }
            } else {
                // Código original para modificador fixo (ex.: +3)
                const match = restante.match(/^(\d+)([+-]\d+)?$/);
                if (match) {
                    faces = parseInt(match[1]) || 0;
                    modificador = parseInt(match[2]) || 0;
                    modText = modificador !== 0 ? (modificador > 0 ? '+' : '') + modificador : '';
                }
            }
        } else {
            // Se não houver 'd', considerar o termo como apenas um número fixo
            faces = parseInt(termo) || 0;
        }

        // Validar os dados extraídos
        if (faces <= 0 || quantidade <= 0) {
            throw new Error(`Expressão inválida: ${termo}`);
        }

        // Gerar as rolagens para este termo de dano
        let rolagens = [];
        let totalTermo = 0;

        for (let i = 0; i < quantidade; i++) {
            const rolagem = maximo ? faces : Math.floor(Math.random() * faces) + 1;
            rolagens.push(rolagem);
            totalTermo += rolagem;
            valoresIndividuais.push(rolagem);
        }

        // Se for modificador percentual, calcular bônus para cada rolagem
        if (isPercentage) {
            let bonusTotal = 0;
            rolagens.forEach(rolagem => { // aqui, "rolagem" é o parâmetro da função callback
                bonusTotal += Math.floor(rolagem * (percentageValue / 100));
            });
            // Atribuir o bônus à variável modificador para usar o código original
            modificador = bonusTotal;
        }
        
        // Adicionar o modificador, se houver
        totalTermo += modificador;

        // Adicionar ao total de dano
        totalDano += totalTermo;

        // Armazenar as rolagens deste termo para exibição, utilizando o modText adequado
        rolagensTotais.push({
            expressao: `${quantidade}d${faces}${modText}`,
            rolagens: rolagens.join(', '),
            totalTermo: totalTermo
        });
    });

    // Montar a mensagem final com todas as rolagens
    let mensagem = '';
    rolagensTotais.forEach(termo => {
        mensagem += `Dano rolado (${termo.expressao}): ${termo.totalTermo} (${termo.rolagens})\n`;
    });

    // Exibir mensagem com os resultados (se função mostrarMensagem existir)
    if (typeof mostrarMensagem === 'function') {
        mostrarMensagem(mensagem);
    }

    // Enviar feedback
    enviarFeedback(topico, totalDano, valoresIndividuais, expressao);

    // Retornar o total de dano calculado
    return mensagem + "Dano total: " + totalDano;
}


function rolarDadosSimples(expressao) {
    // Remover espaços em branco e converter para minúsculas
    expressao = expressao.replace(/\s/g, '').toLowerCase();
  
    // Se a expressão for somente um número, retorne-o diretamente.
    if (/^-?\d+$/.test(expressao)) {
      const totalDano = parseInt(expressao, 10);
      if (typeof mostrarMensagem === 'function') {
      }
      return totalDano;
    }
  
    // Verificar se há um termo 'max' no início
    let maximo = false;
    if (expressao.startsWith('max')) {
      maximo = true;
      expressao = expressao.slice(3);
    }
  
    // Separar os termos de dano por vírgula
    const termos = expressao.split(',');
  
    // Preparar para armazenar o resultado total do dano
    let totalDano = 0;
    let rolagensTotais = [];
    let valoresIndividuais = [];
  
    // Iterar sobre cada termo de dano
    termos.forEach(origTermo => {
      let termo = origTermo;
      // Verificar se o termo começa com '-' para indicar que o resultado será negativo
      let negativeTerm = false;
      if (termo.startsWith('-')) {
        negativeTerm = true;
        termo = termo.slice(1);
      }
  
      // Encontrar a posição do primeiro 'd'
      const indexD = termo.indexOf('d');
      
      let quantidade = 1; // Valor padrão
      let faces = 0;
      let modificador = 0;
  
      // Extrair quantidade e faces do dado
      if (indexD !== -1) {
        quantidade = parseInt(termo.slice(0, indexD)) || 1;
        const restante = termo.slice(indexD + 1);
  
        // Procurar por modificadores após as faces
        const match = restante.match(/^(\d+)([+-]\d+)?$/);
        if (match) {
          faces = parseInt(match[1]) || 0;
          modificador = parseInt(match[2]) || 0;
        }
      } else {
        // Se não houver 'd', considerar o termo como apenas um número fixo
        faces = parseInt(termo) || 0;
      }
  
      // Validar os dados extraídos
      if (faces <= 0 || quantidade <= 0) {
        throw new Error(`Expressão inválida: ${origTermo}`);
      }
  
      // Gerar as rolagens para este termo de dano
      let rolagens = [];
      let totalTermo = 0;
  
      for (let i = 0; i < quantidade; i++) {
        const rolagem = maximo ? faces : Math.floor(Math.random() * faces) + 1;
        rolagens.push(rolagem);
        totalTermo += rolagem;
        valoresIndividuais.push(rolagem);
      }
  
      // Adicionar o modificador, se houver
      totalTermo += modificador;
  
      // Se o termo for negativo, inverte o valor total
      if (negativeTerm) {
        totalTermo = -totalTermo;
      }
  
      // Acumular no total de dano
      totalDano += totalTermo;
  
      // Construir a expressão para exibição
      let expStr = `${quantidade}d${faces}`;
      if (modificador !== 0) {
        expStr += (modificador > 0 ? '+' : '') + modificador;
      }
      if (negativeTerm) {
        expStr = '-' + expStr;
      }
      
      // Armazenar as rolagens deste termo para exibição
      rolagensTotais.push({
        expressao: expStr,
        rolagens: rolagens.join(', '),
        totalTermo: totalTermo
      });
    });
  
    // Retornar o total de dano calculado
    
    mostrarPopup(totalDano);
    return totalDano;
  }  

function atualizarAlma(custo, cooldown) {
    personagem.alma -= custo;
    document.getElementById('status-alma').textContent = `Alma: ${personagem.alma}`;
    
    // Envia um evento para o processo principal para exibir um diálogo
    mostrarMensagem(`Alma restante após gastar ${custo} de alma. Numero de circulos: ${cooldown}`);
    atualizarInfoPersonagem(Personagem);
}


function usarHabilidade() {
    // Obtem o nome da habilidade ativa na aba "Habilidades"
    const habilidadeNome = document.getElementById('habilidade-nome').textContent.trim();

    if (!habilidadeNome) {
        mostrarMensagem('Nome da habilidade não encontrado.');
        return;
    }

    try {
        // Verifica se habilidadesData está disponível globalmente
        if (!habilidadesData || !habilidadesData.habilidades) {
            throw new Error('Dados de habilidades não estão disponíveis.');
        }

        // Procura a habilidade pelo nome
        const habilidade = habilidadesData.habilidades.find(h => h.nome === habilidadeNome);

        if (habilidade) {
            console.log('Habilidade encontrada:', habilidade);
            document.getElementById('habilidade-nome').textContent = habilidade.nome;
            atualizarDescricaoHabilidade(habilidade.nome); // Chamando funcao para buscar e atualizar descricao
            document.getElementById('dano-total').textContent = `Dano: ${habilidade.dano}`;
            if (habilidade.toggle){
                document.getElementById('teste-habilidade').textContent = `Teste: ${habilidade.pericia} + ${habilidade.atributo}` + (habilidade.vantagens ? ` + ${habilidade.vantagens}` : '' + (habilidade.modificador ? ` + ${habilidade.modificador}` : '')); // Atualiza o teste de habilidade
            }else{
                document.getElementById('teste-habilidade').textContent =  'Sem teste de Habilidade para essa habilidade'; // Atualiza o teste de habilidade
            }
            document.getElementById('status').textContent = `Status: ${habilidade.status}`;
            aplicarHabilidade(habilidade);
            atualizarStatus(habilidade.status); // Chama a funcao para atualizar o status
        } else {
            mostrarMensagem('Habilidade não encontrada:', habilidadeNome);
        }
    } catch (error) {
        mostrarMensagem('Erro ao processar dados de habilidades: ' + error.message);
    }
}


function atualizarDescricaoHabilidade(nomeHabilidade) {
    try {
        // Procura a habilidade pelo nome na variável global window.habilidadesData
        const habilidade = window.habilidadesData.habilidades.find(h => h.nome === nomeHabilidade);
        if (habilidade) {
            console.log('Descricao da habilidade:', habilidade.descricao);
            document.getElementById('habilidade-descricao').textContent = habilidade.descricao; // Atualiza a descricao da habilidade
        } else {
            console.error('Habilidade não encontrada:', nomeHabilidade);
        }
    } catch (error) {
        console.error('Erro ao processar dados de habilidades:', error);
    }
}

function atualizarVida(custo) {
    personagem.vida -= custo;
    document.getElementById('status-vida').textContent = `Vida: ${personagem.vida}`;
    
    // Envia um evento para o processo principal para exibir um diálogo
    mostrarMensagem(`Vida restante após gastar ${custo} de vida.`);
    atualizarInfoPersonagem(Personagem);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function aplicarHabilidade(habilidade) {
    let testerolado;
    if (habilidade.toggle) {
        window.topico = 'Teste da Habilidade **' + habilidade.nome + "** - " + habilidade.atributo + ' - ' + habilidade.pericia;
        testerolado = acao(habilidade.atributo, habilidade.pericia, habilidade.vantagens, habilidade.modificador, habilidade); // Chama a funcao para acao
        console.log(`Teste de Habilidade: ${testerolado}`);
    }
    await delay(1000);
    window.topico = 'Habilidade - ' + habilidade.nome;
    const danoRolado = rolarDano(habilidade.dano);
    const newAlma = rolarDadosSimples(habilidade.custo);
    const newLife = rolarDadosSimples(habilidade.custoVida);
    atualizarAlma(newAlma, habilidade.cooldown);
    atualizarVida(newLife); // Subtrai o custo de vida usando a função ajustarVida
    atualizarStatus(newLife); // Chama a funcao para atualizar o status

    console.log(`Dano rolado: ${danoRolado}`);
    document.getElementById('dano-total').textContent = `Dano: ${danoRolado}`;
    if (habilidade.toggle){
        document.getElementById('teste-habilidade').textContent = `Teste: ${testerolado}`; // Atualiza o teste de habilidade
    }else{
        document.getElementById('teste-habilidade').textContent =  'Sem teste de Habilidade para essa habilidade'; // Atualiza o teste de habilidade
    }
    atualizarInfoPersonagem(Personagem);
}

function sair() {
    console.log("Sair clicado");
    // Implementar a lógica para a acao de sair
}  

function mostrarPopup(mensagem, duracao = 2000) {
    const popup = document.getElementById('popup-alert');
    const text = document.getElementById('popup-alert-text');
    
    text.textContent = "🎲 " + mensagem + " 🎲";
    
    // Remove classes antigas e adiciona a classe 'show' para disparar o fade in e o slide
    popup.classList.remove('hide');
    popup.classList.add('show');
    
    // Após 'duracao' milissegundos, inicia o fade out
    setTimeout(() => {
      popup.classList.remove('show');
      popup.classList.add('hide');
    }, duracao);
}
  

function ajustarAlma(multiplicador) {
    let expressao = document.getElementById('ajuste-alma').value.trim();
    // Se for para reduzir e o valor não começar com '-', antepõe o sinal negativo.
    if (multiplicador === -1 && !expressao.startsWith('-')) {
      expressao = '-' + expressao;
    }
    
    let valorAjuste = rolarDadosSimples(expressao);
    if (isNaN(valorAjuste)) {
      mostrarMensagem("Digite um valor válido para o ajuste de alma");
      return;
    }
    
    if (multiplicador === 1) {
      personagem.adicionarAlma(valorAjuste);
    } else if (multiplicador === -1) {
      // Usamos Math.abs para garantir que a redução seja aplicada como um valor positivo.
      personagem.reduzirAlma(Math.abs(valorAjuste));
    } else {
      mostrarMensagem("Operação inválida para ajuste de alma");
      return;
    }
    
    // Atualiza informações na aba "Info"
    atualizarInfoPersonagem(Personagem);
  }
  
  function ajustarEscudo(multiplicador) {
    let expressao = document.getElementById('ajuste-escudo').value.trim();
    if (multiplicador === -1 && !expressao.startsWith('-')) {
      expressao = '-' + expressao;
    }
    
    let valorAjuste = rolarDadosSimples(expressao);
    if (isNaN(valorAjuste)) {
      mostrarMensagem("Digite um valor válido para o ajuste de escudo");
      return;
    }
    
    if (multiplicador === 1) {
      personagem.adicionarEscudo(valorAjuste);
    } else if (multiplicador === -1) {
      personagem.reduzirEscudo(Math.abs(valorAjuste));
    } else {
      mostrarMensagem("Operação inválida para ajuste de escudo");
      return;
    }
    
    atualizarInfoPersonagem(Personagem);
  }
  
  function ajustarVida(multiplicador) {
    let expressao = document.getElementById('ajuste-vida').value.trim();
    if (multiplicador === -1 && !expressao.startsWith('-')) {
      expressao = '-' + expressao;
    }
    
    let valorAjuste = rolarDadosSimples(expressao);
    if (isNaN(valorAjuste)) {
      mostrarMensagem("Digite um valor válido para o ajuste de vida");
      return;
    }
    
    if (multiplicador === 1) {
      personagem.adicionarVida(valorAjuste);
    } else if (multiplicador === -1) {
      personagem.reduzirVida(Math.abs(valorAjuste));
    } else {
      mostrarMensagem("Operação inválida para ajuste de vida");
      return;
    }
    
    atualizarInfoPersonagem(Personagem);
  }
  

function rolarDadosCalculo(atributo, pericia, vantagem, modificador) {
    modificador = Number(modificador);
    // Garante que atributo e perícia não sejam negativos
    atributo = Math.max(0, atributo);
    pericia = Math.max(0, pericia);
    
    // Garante que vantagem não seja negativa
    vantagem = Math.max(0, vantagem);
    // Total de rolagens de d20 = 1 (normal) + vantagem (adicionais)
    const totalRolls = 1 + vantagem;

    // Rola o d20 totalRolls vezes e escolhe o maior resultado
    let d20Rolls = [];
    for (let i = 0; i < totalRolls; i++) {
        const roll = Math.floor(Math.random() * 20) + 1;
        d20Rolls.push(roll);
    }
    const d20 = Math.max(...d20Rolls);

    // Rola os dados de perícia, se houver pontos
    let periciaDiceType, periciaRolls = [], periciaTotal = 0;
    if (pericia > 0) {
        // Se perícia for 3 ou mais, utiliza d12; caso contrário, d10
        periciaDiceType = pericia >= 3 ? 12 : 10;
        for (let i = 0; i < pericia; i++) {
            const roll = Math.floor(Math.random() * periciaDiceType) + 1;
            periciaRolls.push(roll);
            periciaTotal += roll;
        }
    }

    // Rola os dados de atributo, se houver pontos
    let atributoRolls = [], atributoTotal = 0;
    if (atributo > 0) {
        for (let i = 0; i < atributo; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            atributoRolls.push(roll);
            atributoTotal += roll;
        }
    }

    // Calcula o resultado final somando:
    // d20 (com vantagem) + total dos dados de perícia + total dos dados de atributo + modificador fixo
    const resultadoFinal = d20 + periciaTotal + atributoTotal + modificador;

    // Monta um array para a string de rolagem com os dados detalhados:
    // Se houver vantagem (totalRolls > 1), indica quantos d20 foram rolados e exibe todos os valores
    let rolagemArr = [];
    if (totalRolls > 1) {
        rolagemArr.push(`${totalRolls}d20 (max): ${d20Rolls.join(",")}`);
    } else {
        rolagemArr.push(`1d20: ${d20}`);
    }
    if (pericia > 0) {
        rolagemArr.push(`${pericia}d${periciaDiceType}: ${periciaRolls.join(",")}`);
    }
    if (atributo > 0) {
        rolagemArr.push(`${atributo}d6: ${atributoRolls.join(",")}`);
    }

    // Monta a fórmula utilizada para o cálculo
    let formulaStr = `d20`;
    if (pericia > 0) {
        formulaStr += `+${pericia}d${periciaDiceType}`;
    }
    if (atributo > 0) {
        formulaStr += `+${atributo}d6`;
    }
    if (modificador !== 0) {
        formulaStr += (modificador > 0 ? `+${modificador}` : modificador);
    }

    // Monta a mensagem final com o resultado detalhado
    let mensagemFinal = `Resultado rolado: ${rolagemArr.join(" | ")} \n Resultado Final: ${resultadoFinal}`;

    // Exibe as mensagens (se necessário)
    mostrarMensagem(`D20 rolado com vantagem (${totalRolls} roladas): ${d20Rolls.join(",")} -> escolhendo ${d20}`);
    if (pericia > 0) {
        mostrarMensagem(`Dados de perícia (${pericia} x d${periciaDiceType}): ${periciaRolls.join(",")}`);
    }
    if (atributo > 0) {
        mostrarMensagem(`Dados de atributo (${atributo} x d6): ${atributoRolls.join(",")}`);
    }
    mostrarMensagem(mensagemFinal);

    // Armazena globalmente as informações, se necessário
    window.rolagem = rolagemArr;
    window.formula = formulaStr;

    // Chama enviarFeedback com os parâmetros:
    // enviarFeedback(topico, resultadoFinal, rolagem, formula)
    enviarFeedback(window.topico, resultadoFinal, rolagemArr, formulaStr);

    return mensagemFinal;
}

function acao(atributo, pericia, numeroVantagens, modificador, habilidade) {
    let valorAtributo = 0;
    let valorPericia = 0;

    // Verifica o atributo selecionado e atribui o valor correspondente
    switch (atributo) {
        case 'força':
            valorAtributo = personagem.forca;
            break;
        case 'fortitude':
            valorAtributo = personagem.fortitude;
            break;
        case 'agilidade':
            valorAtributo = personagem.agilidade;
            break;
        case 'conhecimento':
            valorAtributo = personagem.conhecimento;
            break;
        case 'espirito':
            valorAtributo = personagem.espirito;
            break;
        default:
            valorAtributo = 0; // Atributo padrão caso não haja correspondencia
    }

    // Verifica a perícia selecionada e atribui o valor correspondente
    switch (pericia) {
        case 'destreza':
            valorPericia = personagem.periciaDestreza;
            break;
        case 'pontaria':
            valorPericia = personagem.periciaPontaria;
            break;
        case 'tecnica':
            valorPericia = personagem.periciaTecnica;
            break;
        case 'furtividade':
            valorPericia = personagem.periciaFurtividade;
            break;
        case 'luta':
            valorPericia = personagem.periciaLuta;
            break;
        case 'mente':
            valorPericia = personagem.periciaMente;
            break;
        case 'inteligencia':
            valorPericia = personagem.periciaInteligencia;
            break;
        case 'iniciativa':
            valorPericia = personagem.periciaIniciativa;
            break;
        case 'vigor':
            valorPericia = personagem.periciaVigor;
            break;
        case 'observacao':
            valorPericia = personagem.periciaObservacao;
            break;
        case 'diplomacia':
            valorPericia = personagem.periciaDiplomacia;
            break;
        case 'sorte':
            valorPericia = personagem.periciaSorte;
            break;
        case 'medicina':
            valorPericia = personagem.periciaMedicina;
            break;
        case 'vontade':
            valorPericia = personagem.periciaVontade;
            break;
        default:
            valorPericia = 0; // Perícia padrão caso não haja correspondencia
    }

    // Chama a funcao rolarDadosCalculo com os parâmetros ajustados
    return rolarDadosCalculo(valorAtributo, valorPericia, numeroVantagens, modificador);
}

function rolarDados() {
    window.topico = 'Dados a parte';
    // Obtém os valores dos campos do formulário, usando 0 como padrão se a conversão falhar
    const formatoVantagem = document.getElementById('formatoVantagem').value;
    const numTotal = parseInt(document.getElementById('numTotal').value, 10) || 0;
    const somatorio = parseInt(document.getElementById('somatorio').value, 10) || 0;

    const tipoDado1 = parseInt(document.getElementById('tipoDado1').value, 10) || 0;
    const numTipoDado1 = parseInt(document.getElementById('numTipoDado1').value, 10) || 0;

    // Se o campo estiver vazio ou inválido, assume null para o tipo ou 0 para o número de dados
    const tipoDado2 = document.getElementById('tipoDado2').value ? parseInt(document.getElementById('tipoDado2').value, 10) : null;
    const numTipoDado2 = parseInt(document.getElementById('numTipoDado2').value, 10) || 0;

    const tipoDado3 = document.getElementById('tipoDado3').value ? parseInt(document.getElementById('tipoDado3').value, 10) : null;
    const numTipoDado3 = parseInt(document.getElementById('numTipoDado3').value, 10) || 0;

    // Função para rolar um dado de um tipo específico
    function rolarDado(tamanho) {
        return Math.floor(Math.random() * tamanho) + 1;
    }

    // Função para rolar múltiplos dados
    function rolarDadosTipo(tipoDado, numDados) {
        return Array.from({ length: numDados }, () => rolarDado(tipoDado));
    }

    // Função para interpretar o formato personalizado dos dados de vantagem (ex: "2d6")
    function interpretarFormato(formato) {
        const partes = formato.split('d');
        const numDados = parseInt(partes[0], 10) || 0;
        const tipoDado = parseInt(partes[1], 10) || 0;
        return rolarDadosTipo(tipoDado, numDados);
    }

    // Array para armazenar os resultados dos dados de vantagem
    const resultadosVantagem = formatoVantagem ? interpretarFormato(formatoVantagem) : [];

    // Se houver dados de vantagem, pega o maior valor; caso contrário, 0
    const maiorVantagem = resultadosVantagem.length > 0 ? Math.max(...resultadosVantagem) : 0;

    // Array para armazenar os resultados dos dados totais
    const resultadosTotal = [];

    // Rolar os dados do tipo 1
    if (numTipoDado1 > 0) {
        resultadosTotal.push(...rolarDadosTipo(tipoDado1, numTipoDado1));
    }

    // Rolar os dados do tipo 2 (se selecionado)
    if (numTipoDado2 > 0 && tipoDado2) {
        resultadosTotal.push(...rolarDadosTipo(tipoDado2, numTipoDado2));
    }

    // Rolar os dados do tipo 3 (se selecionado)
    if (numTipoDado3 > 0 && tipoDado3) {
        resultadosTotal.push(...rolarDadosTipo(tipoDado3, numTipoDado3));
    }

    // Adiciona o maior valor dos dados de vantagem ao total
    resultadosTotal.push(maiorVantagem);
    
    // Calcula o somatório total (soma dos resultados dos dados + somatório adicional)
    const somaTotal = resultadosTotal.reduce((a, b) => a + b, 0) + somatorio;
    
    // Monta a string para exibir os resultados na interface
    const resultadoHtml = `
        <p><strong>Dados de Vantagem Rolados:</strong> ${resultadosVantagem.length > 0 ? resultadosVantagem.join(', ') : 'Nenhum dado de vantagem rolado'}</p>
        <p><strong>Maior Dado de Vantagem:</strong> ${maiorVantagem || 'Nenhum dado de vantagem rolado'}</p>
        <p><strong>Dados Totais Rolados:</strong> ${resultadosTotal.join(', ')}</p>
        <p><strong>Somatório:</strong> ${somaTotal}</p>
    `;
    
    // Define as variáveis a serem enviadas no feedback:
    const resultadofinal = somaTotal;
    const valoresretirados = resultadosTotal; // array com os valores rolados
    const formuladecalculo = resultadosTotal.join(' + ') + (somatorio ? ` + ${somatorio}` : '');
    
    // Chama a função de feedback
    enviarFeedback(window.topico, resultadofinal, valoresretirados, formuladecalculo);
    
    // Exibe o resultado na div 'resultadoRolagem'
    document.getElementById('resultadoRolagem').innerHTML = resultadoHtml;
}

function executarAcao() {
    let atributo = document.getElementById('atributoSelect1').value;
    let pericia = document.getElementById('periciaSelect1').value;
    window.topico = 'Acao - ' + atributo + ' + ' + pericia;
    let numeroVantagens = parseInt(document.getElementById('vantagensInput1').value);
    let modificador = parseInt(document.getElementById('modificadorInput1').value);

    let resultado = acao(atributo, pericia, numeroVantagens, modificador);
    
    // Exibir o resultado em um mostrarMensagem
    let mensagem = (`Resultado da Acao: ${resultado}`);

    // Verifica se há um item selecionado para tiro
    if (window.selectedAttackItemteste) {
        // Obtém o padrão de dano do item (por exemplo, "1d20+3")
        let danoItem = window.selectedAttackItemteste.damage;
        let nomeItem = window.selectedAttackItemteste.name;
        window.topico = 'Dano - ' + nomeItem;
        
        // Rola o dano utilizando a função rolarDano (definida em script.js)
        let resultadoDano = rolarDano(danoItem);
        
        // Acrescenta o resultado da rolagem do dano à mensagem
        mensagem += `\nDano com ${window.selectedAttackItemteste.name}: ${resultadoDano}`;
        } else {
        mensagem += `\nNenhum item selecionado para tiro.`;
        }

    mostrarMensagem(mensagem);
}

// Em script.js
async function executarAtaque() {
    window.topico = 'Ataque';
    let numeroVantagens = parseInt(document.getElementById('vantagens-ataque').value);
    let modificador = parseInt(document.getElementById('modificador-ataque').value);
    
    // Rola o teste de ataque (ex: usando acao para comparar pericia e modificadores)
    let resultadoAtaque = acao('força', 'luta', numeroVantagens, modificador);
    
    // Monta a mensagem do teste de ataque
    let mensagem = `Resultado do Ataque: ${resultadoAtaque}`;

    await delay(1000);
    
    // Verifica se há um item selecionado para ataque
    if (window.selectedAttackItem) {
      // Obtém o padrão de dano do item (por exemplo, "1d20+3")
      let danoItem = window.selectedAttackItem.damage;
      let nomeItem = window.selectedAttackItem.name;
      window.topico = 'Dano - ' + nomeItem;
      
      // Rola o dano utilizando a função rolarDano (definida em script.js)
      let resultadoDano = rolarDano(danoItem);
      
      // Acrescenta o resultado da rolagem do dano à mensagem
      mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
      mensagem += `\nNenhum item selecionado para ataque.`;
    }
    
    // Exibe a mensagem com os resultados
    mostrarMensagem(mensagem);
}  

async function executarTiro() {
    window.topico = 'Atirar';
    let numeroVantagens = parseInt(document.getElementById('vantagens-tiro').value);
    let modificador = parseInt(document.getElementById('modificador-tiro').value);
    
    // Rola o teste de tiro (ex: usando acao para comparar pericia e modificadores)
    let resultadoTiro = acao('agilidade', 'pontaria', numeroVantagens, modificador);
    
    // Monta a mensagem do teste de tiro
    let mensagem = `Resultado do Tiro: ${resultadoTiro}`;

    await delay(1000);
    
    // Verifica se há um item selecionado para tiro
    if (window.selectedAttackItem) {
      // Obtém o padrão de dano do item (por exemplo, "1d20+3")
      let danoItem = window.selectedAttackItem.damage;
      let nomeItem = window.selectedAttackItem.name;
      window.topico = 'Dano - ' + nomeItem;
      
      // Rola o dano utilizando a função rolarDano (definida em script.js)
      let resultadoDano = rolarDano(danoItem);
      
      // Acrescenta o resultado da rolagem do dano à mensagem
      mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
      mensagem += `\nNenhum item selecionado para tiro.`;
    }
    
    // Exibe a mensagem com os resultados
    mostrarMensagem(mensagem);
}  

function executarDefesa() {
    window.topico = 'Defesa';
    let numeroVantagens = parseInt(document.getElementById('vantagens-defesa').value);
    let modificador = parseInt(document.getElementById('modificador-defesa').value);
    
    // Chama a função acao e captura a string retornada
    let resultadoAcao = acao('fortitude', 'vigor', numeroVantagens, modificador); // Exemplo de retorno:
    // "Resultado do Ataque: Resultado rolado: 1d20: 20 | 1d6: 6Resultado Final: 26"

    // Extrair apenas o valor numérico após "Resultado Final:" usando regex
    let match = resultadoAcao.match(/Resultado Final:\s*(\d+)/);
    let resultado = match ? Number(match[1]) : NaN;
    if (isNaN(resultado)) {
         mostrarMensagem("Erro: Não foi possível extrair o resultado final.");
         resultado = 0;
    }
    
    // Se o checkbox estiver marcado, soma o valor do escudo ao resultado
    let checkboxEscudo = document.getElementById('checkDefesa');
    if (checkboxEscudo && checkboxEscudo.checked) {
        let escudo = Number(personagem.escudo); // Converte o valor de escudo para número
        mostrarMensagem(`Escudo: ${escudo}`);
        mostrarMensagem(`Resultado antes do escudo: ${resultado}`);
        resultado += escudo; // Soma o valor do escudo
    }

    // Exibir o resultado em um mostrarMensagem
    let mensagem = (`Resultado do Ataque: ${resultado}`);

    // Verifica se há um item selecionado para tiro
    if (window.selectedAttackItem) {
        // Obtém o padrão de dano do item (por exemplo, "1d20+3")
        let danoItem = window.selectedAttackItem.damage;
        let nomeItem = window.selectedAttackItem.name;
        window.topico = 'Dano - ' + nomeItem;
        
        // Rola o dano utilizando a função rolarDano (definida em script.js)
        let resultadoDano = rolarDano(danoItem);
        
        // Acrescenta o resultado da rolagem do dano à mensagem
        mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
        mensagem += `\nNenhum item selecionado para tiro.`;
    }

    mostrarMensagem(mensagem);
}

function executarEsquiva() {
    window.topico = 'Esquiva';
    let numeroVantagens = parseInt(document.getElementById('vantagens-esquiva').value);
    let modificador = parseInt(document.getElementById('modificador-esquiva').value);
    let resultado = acao('agilidade', 'acrobacia', numeroVantagens, modificador); // Passa personagem.periciaLuta como valor numerico
    
    // Exibir o resultado em um mostrarMensagem
    let mensagem = (`Resultado do Ataque: ${resultado}`);

        // Verifica se há um item selecionado para tiro
        if (window.selectedAttackItem) {
            // Obtém o padrão de dano do item (por exemplo, "1d20+3")
            let danoItem = window.selectedAttackItem.damage;
            let nomeItem = window.selectedAttackItem.name;
            window.topico = 'Dano - ' + nomeItem;
            
            // Rola o dano utilizando a função rolarDano (definida em script.js)
            let resultadoDano = rolarDano(danoItem);
            
            // Acrescenta o resultado da rolagem do dano à mensagem
            mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
          } else {
            mensagem += `\nNenhum item selecionado para tiro.`;
          }

    mostrarMensagem(mensagem);
}

function executarContraAtaque() {
    window.topico = 'Contra-ataque';
    let numeroVantagens = parseInt(document.getElementById('vantagens-contraataque').value);
    let modificador = parseInt(document.getElementById('modificador-contraataque').value);
    let resultado = acao('força', 'luta', numeroVantagens, modificador); // Passa personagem.periciaLuta como valor numerico
    
    // Exibir o resultado em um mostrarMensagem
    let mensagem = (`Resultado do Ataque: ${resultado}`);

        // Verifica se há um item selecionado para tiro
        if (window.selectedAttackItem) {
            // Obtém o padrão de dano do item (por exemplo, "1d20+3")
            let danoItem = window.selectedAttackItem.damage;
            let nomeItem = window.selectedAttackItem.name;
            window.topico = 'Dano - ' + nomeItem;
            
            // Rola o dano utilizando a função rolarDano (definida em script.js)
            let resultadoDano = rolarDano(danoItem);
            
            // Acrescenta o resultado da rolagem do dano à mensagem
            mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
          } else {
            mensagem += `\nNenhum item selecionado para tiro.`;
          }

    mostrarMensagem(mensagem);
}

function atualizarStatus() {
    document.getElementById('status').innerText = personagem.obterStatus();
}

function sair() {
    openSubtab('skills', 'escolha');
}

function sairAjustes() {
    openSubtab('actions', 'ajustes');
    openTab('skills');
}

function togglePericias() {
    var content = document.getElementById('pericias-content');
    if (content.classList.contains('content-collapsed')) {
        content.classList.remove('content-collapsed');
        content.classList.add('content-expanded');
    } else {
        content.classList.remove('content-expanded');
        content.classList.add('content-collapsed');
    }
}

function toggleTracos() {
    var content = document.getElementById('tracos-content');
    if (content.classList.contains('content-collapsed')) {
        content.classList.remove('content-collapsed');
        content.classList.add('content-expanded');
    } else {
        content.classList.remove('content-expanded');
        content.classList.add('content-collapsed');
    }
}

async function salvarStatus() {
    alert('atualizar status: ' + atualizarStatusCheck);
    try {
      const nome = document.getElementById('nome').value.trim();
      window.nomepersonagem = nome;
      document.getElementById('status-nome').textContent = window.nomepersonagem || 'Nome do Personagem';
      if (!nome) {
        alert('Por favor, insira o nome do personagem.');
        return;
      }
  
      // Se atualizarStatusCheck for falso, sobrescreve todo o arquivo com os novos valores
      if (!atualizarStatusCheck) {
        const updatedData = {
          check: document.getElementById('personagemInicial').checked ? 1 : 0,
          img: document.getElementById('img').value.trim(),
          vida: parseInt(document.getElementById('vida').value),
          vidaMax: parseInt(document.getElementById('vidaMax').value),
          alma: parseInt(document.getElementById('alma').value),
          almaMax: parseInt(document.getElementById('almaMax').value),
          escudo: parseInt(document.getElementById('escudo').value),
          escudoMax: parseInt(document.getElementById('escudoMax').value),
          fortitude: parseInt(document.getElementById('fortitude').value),
          conhecimento: parseInt(document.getElementById('conhecimento').value),
          espirito: parseInt(document.getElementById('espirito').value),
          forca: parseInt(document.getElementById('forca').value),
          agilidade: parseInt(document.getElementById('agilidade').value),
          periciaDestreza: parseInt(document.getElementById('periciaDestreza').value),
          periciaPontaria: parseInt(document.getElementById('periciaPontaria').value),
          periciaTecnica: parseInt(document.getElementById('periciaTecnica').value),
          periciaFurtividade: parseInt(document.getElementById('periciaFurtividade').value),
          periciaLuta: parseInt(document.getElementById('periciaLuta').value),
          periciaMente: parseInt(document.getElementById('periciaMente').value),
          periciaInteligencia: parseInt(document.getElementById('periciaInteligencia').value),
          periciaIniciativa: parseInt(document.getElementById('periciaIniciativa').value),
          periciaVigor: parseInt(document.getElementById('periciaVigor').value),
          periciaObservacao: parseInt(document.getElementById('periciaObservacao').value),
          periciaDiplomacia: parseInt(document.getElementById('periciaDiplomacia').value),
          periciaSorte: parseInt(document.getElementById('periciaSorte').value),
          periciaMedicina: parseInt(document.getElementById('periciaMedicina').value),
          periciaVontade: parseInt(document.getElementById('periciaVontade').value),
          tracoCorpo: document.getElementById('tracoCorpo').value.trim(),
          tracoDefeitos: document.getElementById('tracoDefeitos').value.trim(),
          tracoEfeitos: document.getElementById('tracoEfeitos').value.trim(),
          tracoPeso: document.getElementById('tracoPeso').value.trim(),
          tracoRaiz: document.getElementById('tracoRaiz').value.trim(),
          tracoRaca: document.getElementById('tracoRaca').value.trim(),
          tracoCultura: document.getElementById('tracoCultura').value.trim(),
          tracoSubraiz: document.getElementById('tracoSubraiz').value.trim(),
          tracoHistoria: document.getElementById('tracoHistoria').value.trim(),
        };
  
        localStorage.setItem(`${nome}-personagem`, JSON.stringify(updatedData, null, 2));
        mostrarMensagem('Status do personagem salvo com sucesso!');
        await carregarStatus();
      } else {
        // Se atualizarStatusCheck for verdadeiro, atualiza somente os campos não nulos no arquivo existente
        const storedDataStr = localStorage.getItem(`${nome}-personagem`);
        if (!storedDataStr) {
          mostrarMensagem('Arquivo não existe.');
          return;
        }
        let currentData = JSON.parse(storedDataStr);
  
        // Funções auxiliares para obter os valores ou null se o campo estiver vazio
        const getNumberValue = (id) => {
          const value = document.getElementById(id).value.trim();
          return value === "" ? null : parseInt(value);
        };
  
        const getStringValue = (id) => {
          const value = document.getElementById(id).value.trim();
          return value === "" ? null : value;
        };
  
        const updatedData = {
          check: document.getElementById('personagemInicial').checked ? 1 : 0,
          img: getStringValue('img'),
          vida: getNumberValue('vida'),
          vidaMax: getNumberValue('vidaMax'),
          alma: getNumberValue('alma'),
          almaMax: getNumberValue('almaMax'),
          escudo: getNumberValue('escudo'),
          escudoMax: getNumberValue('escudoMax'),
          fortitude: getNumberValue('fortitude'),
          conhecimento: getNumberValue('conhecimento'),
          espirito: getNumberValue('espirito'),
          forca: getNumberValue('forca'),
          agilidade: getNumberValue('agilidade'),
          periciaDestreza: getNumberValue('periciaDestreza'),
          periciaPontaria: getNumberValue('periciaPontaria'),
          periciaTecnica: getNumberValue('periciaTecnica'),
          periciaFurtividade: getNumberValue('periciaFurtividade'),
          periciaLuta: getNumberValue('periciaLuta'),
          periciaMente: getNumberValue('periciaMente'),
          periciaInteligencia: getNumberValue('periciaInteligencia'),
          periciaIniciativa: getNumberValue('periciaIniciativa'),
          periciaVigor: getNumberValue('periciaVigor'),
          periciaObservacao: getNumberValue('periciaObservacao'),
          periciaDiplomacia: getNumberValue('periciaDiplomacia'),
          periciaSorte: getNumberValue('periciaSorte'),
          periciaMedicina: getNumberValue('periciaMedicina'),
          periciaVontade: getNumberValue('periciaVontade'),
          tracoCorpo: getStringValue('tracoCorpo'),
          tracoDefeitos: getStringValue('tracoDefeitos'),
          tracoEfeitos: getStringValue('tracoEfeitos'),
          tracoPeso: getStringValue('tracoPeso'),
          tracoRaiz: getStringValue('tracoRaiz'),
          tracoRaca: getStringValue('tracoRaca'),
          tracoCultura: getStringValue('tracoCultura'),
          tracoSubraiz: getStringValue('tracoSubraiz'),
          tracoHistoria: getStringValue('tracoHistoria'),
        };
  
        // Atualiza somente os campos cujo valor não é null
        for (const key in updatedData) {
          if (updatedData[key] !== null) {
            currentData[key] = updatedData[key];
          }
        }
  
        localStorage.setItem(`${nome}-personagem`, JSON.stringify(currentData, null, 2));
        mostrarMensagem('Status do personagem atualizado com sucesso!');
        await carregarStatus();
      }
    } catch (error) {
      console.error('MyAppLog: Erro ao salvar status do personagem:', JSON.stringify(error));
      mostrarMensagem('Erro ao salvar status do personagem.');
    }
}  


async function writeFile(namePath, filePath, data) {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
            dirEntry.getFile(namePath, { create: true, exclusive: false }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function () {
                        mostrarMensagem('MyAppLog: Arquivo escrito com sucesso:');
                        resolve();
                    };
                    fileWriter.onerror = function (e) {
                        mostrarMensagem('MyAppLog: Erro ao escrever arquivo:', JSON.stringify(e));
                        reject(e);
                    };
                    fileWriter.write(data);
                });
            }, function (err) {
                mostrarMensagem('MyAppLog: Erro ao obter o arquivo:', JSON.stringify(err));
                reject(err);
            });
        }, function (err) {
            mostrarMensagem('MyAppLog: Erro ao resolver o caminho do diretório:', JSON.stringify(err));
            reject(err);
        });
    });
}

async function carregarStatus() {
    const nomeCarregar = document.getElementById('nomeCarregar').value.trim();
    let nome = nomeCarregar;

    if (!nomeCarregar) {
        const nomeInput = document.getElementById('nome');
        nome = nomeInput.value.trim();

        if (!nome) {
            alert('Por favor, insira o nome do personagem.');
            return;
        }
    }

    window.nomepersonagem = nome;
    document.getElementById('status-nome').textContent = window.nomepersonagem || 'Nome do Personagem';
    mostrarMensagem(nome);

    carregarHabilidades(nome);
    try {
        const data = localStorage.getItem(`${nome}-personagem`);
        if (data) {
            const personagemData = JSON.parse(data);
            personagem = new Personagem(personagemData);
            atualizarInfoPersonagem(personagem); // Atualiza a interface com os dados do personagem
            mostrarMensagem('Status do personagem carregado com sucesso.');
        } else {
            throw new Error('Dados não encontrados.');
        }
    } catch (error) {
        console.error('MyAppLog: Erro ao carregar status do personagem:', JSON.stringify(error));
        mostrarMensagem('Erro ao carregar status do personagem.');
    }
}


async function carregarHabilidades2() {
    // Obter os dados de entrada do usuário
    const nomePersonagem = document.getElementById('nomeCarregarHab').value;
    const nomeHabilidade = document.getElementById('nomeHabilidade').value;
    const dano = document.getElementById('danoHabilidade').value;
    const cooldown = document.getElementById('cooldownHabilidade').value;
    const custo = document.getElementById('custoHabilidade').value;
    const descricao = document.getElementById('descricaoHabilidade').value;
    const custoVida = document.getElementById('custoVidaHabilidade').value; // Novo campo para custo de vida
    const toggle = document.getElementById('toggleHabilidade').checked;
    const pericia = document.getElementById('periciaSelect').value;
    const atributo = document.getElementById('atributoSelect').value;
    const vantagens = document.getElementById('vantagensInput').value;
    const modificador = document.getElementById('modificadorInput').value;

    // Verificar se todos os campos foram preenchidos
    if (!nomePersonagem || !nomeHabilidade || !dano || !cooldown || !custo || !descricao || !custoVida) {
        mostrarMensagem('Por favor, preencha todos os campos.');
        return;
    }

    // Chamar a funcao adicionarHabilidade com os dados capturados
    try {
        await adicionarHabilidade(nomePersonagem, nomeHabilidade, dano, cooldown, custo, descricao, custoVida, toggle, pericia, atributo, vantagens, modificador);
    } catch (error) {
        console.error('Erro ao adicionar habilidade:', error);
        alert('Erro ao adicionar habilidade.');
    }
}


async function adicionarHabilidade(nomePersonagem, nomeHabilidade, dano, cooldown, custo, descricao, custoVida, toggle, pericia, atributo, vantagens, modificador) {
    try {
        const key = `${nomePersonagem}-habilidades`;
        let habilidadesData = { habilidades: [] };

        // Verificar se já existem habilidades salvas
        const data = localStorage.getItem(key);
        if (data) {
            habilidadesData = JSON.parse(data);
        }

        // Determinar o próximo ID
        const nextId = (habilidadesData.habilidades.reduce((maxId, habilidade) => Math.max(maxId, parseInt(habilidade.id) || 0), 0) + 1).toString();

        // Adicionar a nova habilidade com ID
        const novaHabilidade = {
            nome: nomeHabilidade,
            id: nextId,
            dano: dano,
            cooldown: cooldown,
            custo: custo,
            descricao: descricao,
            custoVida: custoVida,
            toggle: toggle,
            pericia: pericia,
            atributo: atributo,
            vantagens: vantagens,
            modificador: modificador
        };

        habilidadesData.habilidades.push(novaHabilidade);

        // Salvar no localStorage
        console.log('MyAppLog: Salvando habilidades no localStorage.');
        localStorage.setItem(key, JSON.stringify(habilidadesData, null, 2));
        console.log('MyAppLog: Habilidade adicionada com sucesso!');
        mostrarMensagem('Habilidade adicionada com sucesso!');

        // Atualizar a lista de habilidades
        listarArquivos();
        carregarHabilidades(nomePersonagem);
    } catch (error) {
        console.error('MyAppLog: Erro ao adicionar habilidade:', JSON.stringify(error));
        mostrarMensagem('Erro ao adicionar habilidade.');
    }
}

async function carregarHabilidades(nomePersonagem) {
    try {
        const key = `${nomePersonagem}-habilidades`;
        const data = localStorage.getItem(key);
        if (data) {
            habilidadesData = await carregarDados(key);
            exibirHabilidades(habilidadesData);
            mostrarMensagem('Dados das habilidades recebidos.');
            console.log('Dados das habilidades recebidos:', habilidadesData);
            mostrarMensagem(JSON.stringify(habilidadesData, null, 2));
        } else {
            throw new Error('Dados não encontrados.');
        }
    } catch (error) {
        console.error('MyAppLog: Erro ao carregar habilidades do personagem:', JSON.stringify(error));
        mostrarMensagem('Erro ao carregar habilidades do personagem.');
    }
}

function exportarArquivo() {
    const nomeArquivo = document.getElementById('nomeArquivoExportar').value.trim();
    if (!nomeArquivo) {
        alert('Por favor, insira um nome para o arquivo.');
        return;
    }
    
    const dados = localStorage.getItem(nomeArquivo);
    if (dados === null) {
        alert('Arquivo não encontrado no localStorage.');
        return;
    }

    try {
        // Cria um Blob com os dados a serem exportados
        const blob = new Blob([dados], { type: 'text/plain;charset=utf-8' });

        // Cria um link temporário para fazer o download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nomeArquivo;

        // Adiciona o link ao DOM, clica nele e remove-o
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erro ao exportar arquivo:', error);
    }
}

function importarArquivo() {
    const inputElement = document.getElementById('inputArquivoImportar');
    const arquivo = inputElement.files[0];
    if (!arquivo) {
        alert('Por favor, selecione um arquivo para importar.');
        return;
    }

    const nomeArquivoSemExtensao = removerExtensao(arquivo.name);
    const reader = new FileReader();

    reader.onload = function(e) {
        const dados = e.target.result;
        try {
            // Armazena o conteúdo do arquivo no localStorage com o nome do arquivo sem extensão
            localStorage.setItem(nomeArquivoSemExtensao, dados);
            alert('Arquivo importado com sucesso.');
        } catch (error) {
            console.error('Erro ao importar arquivo:', error);
        }
    };

    reader.readAsText(arquivo);
}

function removerExtensao(nomeArquivo) {
    return nomeArquivo.replace(/\.[^/.]+$/, ""); // Remove a extensão do arquivo
}

function listarArquivos() {
    console.log('Arquivos no localStorage:');
    mostrarMensagem('Arquivos no localStorage:');
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Adiciona verificação para arquivos de inventário
        if (key.includes('-personagem') || key.includes('-habilidades') || key.includes('-inventário') || key.includes('-inventario')) {
            console.log('Nome do arquivo:', key);
            mostrarMensagem('Nome do arquivo: ' + key);
        }
    }
}

function removerArquivo() {
    const nomeArquivo = document.getElementById('nomeArquivoRemover').value.trim();
    if (!nomeArquivo) {
        alert('Por favor, insira o nome do arquivo a ser removido.');
        return;
    }
    
    if (localStorage.getItem(nomeArquivo) === null) {
        alert('Arquivo não encontrado no localStorage.');
        return;
    }
    
    try {
        // Remove o arquivo do localStorage
        localStorage.removeItem(nomeArquivo);
        alert('Arquivo removido com sucesso.');
    } catch (error) {
        console.error('Erro ao remover arquivo:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const essentialInfo = document.getElementById("essential-info");

    // Verifica a largura da janela
    function checkWindowSize() {
        if (window.innerWidth >= 1024) {
            essentialInfo.classList.remove("hidden");
        } else {
            essentialInfo.classList.add("hidden");
        }
    }

    // Executa a função no carregamento e no redimensionamento da janela
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);

    // Define a posição inicial no meio da tela
    function setInitialPosition() {
        essentialInfo.style.position = 'fixed';
        essentialInfo.style.top = '50%';
        essentialInfo.style.transform = 'translateY(-50%)';
        essentialInfo.style.transition = 'none'; // Sem transição inicial
    }

    setInitialPosition();

    let lastScrollTop = 0; // Armazena a posição do último scroll
    let isScrolling; // Variável para verificar se o scroll ainda está em andamento

    // Mantém o elemento centralizado com o scroll
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;
        const scrollDirection = scrollPosition > lastScrollTop ? 'down' : 'up'; // Verifica se o scroll é para baixo ou para cima

        // Atualiza a posição do último scroll
        lastScrollTop = scrollPosition;

        // Ajusta o comportamento dependendo da direção do scroll
        if (scrollDirection === 'down') {
            essentialInfo.style.transition = 'top 0.1s linear'; // Transição rápida
            const newTop = 50 - scrollPosition * 0.03; // Elasticidade ajustada
            essentialInfo.style.top = Math.max(newTop, 35) + '%'; // Limita o movimento para não sair do centro
        } else if (scrollDirection === 'up') {
            essentialInfo.style.transition = 'top 0.1s linear'; // Transição rápida
            const newTop = 50 + scrollPosition * 0.03; // Elasticidade mais controlada
            essentialInfo.style.top = Math.min(newTop, 65) + '%'; // Limita o movimento até um pouco abaixo do centro
        }

        // Caso o scroll pare, centraliza novamente
        if (isScrolling) {
            clearTimeout(isScrolling);
        }

        isScrolling = setTimeout(function () {
            essentialInfo.style.transition = 'top 0.3s ease-in-out'; // Retorno suave ao centro
            essentialInfo.style.top = '50%';
            essentialInfo.style.transform = 'translateY(-50%)';
        }, 100); // Reduz o tempo de inatividade para maior responsividade
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const essentialInfo2 = document.getElementById("essential-info2");

    // Verifica a largura da janela
    function checkWindowSize() {
        if (window.innerWidth >= 1024) {
            essentialInfo2.classList.remove("hidden");
        } else {
            essentialInfo2.classList.add("hidden");
        }
    }

    // Executa a função no carregamento e no redimensionamento da janela
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);

    // Define a posição inicial no meio da tela
    function setInitialPosition() {
        essentialInfo2.style.position = 'fixed';
        essentialInfo2.style.top = '50%';
        essentialInfo2.style.transform = 'translateY(-50%)';
        essentialInfo2.style.transition = 'none'; // Sem transição inicial
    }

    setInitialPosition();

    let lastScrollTop = 0; // Armazena a posição do último scroll
    let isScrolling; // Variável para verificar se o scroll ainda está em andamento

    // Mantém o elemento centralizado com o scroll
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;
        const scrollDirection = scrollPosition > lastScrollTop ? 'down' : 'up'; // Verifica se o scroll é para baixo ou para cima

        // Atualiza a posição do último scroll
        lastScrollTop = scrollPosition;

        // Ajusta o comportamento dependendo da direção do scroll
        if (scrollDirection === 'down') {
            essentialInfo2.style.transition = 'top 0.1s linear'; // Transição rápida
            const newTop = 50 - scrollPosition * 0.03; // Elasticidade ajustada
            essentialInfo2.style.top = Math.max(newTop, 35) + '%'; // Limita o movimento para não sair do centro
        } else if (scrollDirection === 'up') {
            essentialInfo2.style.transition = 'top 0.1s linear'; // Transição rápida
            const newTop = 50 + scrollPosition * 0.03; // Elasticidade mais controlada
            essentialInfo2.style.top = Math.min(newTop, 65) + '%'; // Limita o movimento até um pouco abaixo do centro
        }

        // Caso o scroll pare, centraliza novamente
        if (isScrolling) {
            clearTimeout(isScrolling);
        }

        isScrolling = setTimeout(function () {
            essentialInfo2.style.transition = 'top 0.3s ease-in-out'; // Retorno suave ao centro
            essentialInfo2.style.top = '50%';
            essentialInfo2.style.transform = 'translateY(-50%)';
        }, 100); // Reduz o tempo de inatividade para maior responsividade
    });
});

function enviarFeedback(topico, resultado, valores, formula) {
    const payload = {
      topico,
      resultado,
      valores,
      formula,
      nomepersonagem: window.nomepersonagem // Certifique-se que essa variável está definida
    };
  
    // Use o URL completo do endpoint do Vercel
    fetch("https://backmordred.vercel.app/api/enviarFeedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => console.log("Feedback enviado!", data))
      .catch(error => console.error("Erro ao enviar feedback:", error));
  }  

function atualizarDescricaoHabilidade(descricaoMarkdown) {
    const md = window.markdownit({
        breaks: true, // Converte \n em <br>
    });

    const descricaoHTML = md.render(descricaoMarkdown);
    document.getElementById('habilidade-descricao').innerHTML = descricaoHTML;
}

document.getElementById("atualizar-checkbox").addEventListener("change", function() {
  atualizarStatusCheck = this.checked;
  console.log("Valor de Atualizar:", atualizarStatusCheck);
  // Aqui você pode adicionar qualquer lógica adicional que dependa do estado do toggle
});

document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
      textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
    });
});

function salvarAnotacoes() {
    const anotacoes = document.getElementById('anotacoes').value;
    localStorage.setItem('anotacoes', anotacoes);
}

// Carregar as anotações salvas ao carregar a página
window.onload = function() {
    const savedAnotacoes = localStorage.getItem('anotacoes');
    const anotacoesTextarea = document.getElementById('anotacoes');
    if (savedAnotacoes) {
        anotacoesTextarea.value = savedAnotacoes;
        // Ajustar a altura da textarea com base no conteúdo
        anotacoesTextarea.style.height = 'auto';
        anotacoesTextarea.style.height = (anotacoesTextarea.scrollHeight) + 'px';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
      textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        // Salvar o conteúdo no localStorage sempre que houver uma entrada
        salvarAnotacoes();
      });
    });
});