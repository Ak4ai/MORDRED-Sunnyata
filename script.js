let personagem; // Declaracao global do objeto personagem
let habilidadesData;
let habilidade;
let atualizarStatusCheck = false;
let atualizarHabilidadeCheck = false;

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
        this.token = data.token;
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

function atualizarBarra(id, valor, max) {
    const barra = document.getElementById(id);
    const barraContainer = barra.parentElement;
    const percentual = (valor / max) * 100;
  
    if (barraContainer.classList.contains('vertical')) {
      barra.style.height = percentual + '%';
      barra.style.width = '100%';
    } else {
      barra.style.width = percentual + '%';
      barra.style.height = '100%';
    }
}

function atualizarInfoPersonagem(Personagem) {
    if (!personagem) {
        console.error('O objeto "personagem" está indefinido ou nulo.');
        return;
    }

    // Atualiza a imagem do personagem
    const imgElement = document.getElementById('status-img');
    if (imgElement) {
        imgElement.src = personagem.img || ''; // Define a URL da imagem ou uma string vazia
        window.imgpersonagem = personagem.img || ''; // Armazena a URL da imagem na variável global
        atualizarIconeIndicador();
    } else {
        console.error('Elemento com ID "status-img" não encontrado no DOM.');
    }
    // Atualiza o token do personagem
    const tokenElement = document.getElementById('status-token');
    if (tokenElement) {
        tokenElement.src = personagem.token || ''; // Define a URL da imagem ou uma string vazia
    } else {
        console.error('Elemento com ID "status-token" não encontrado no DOM.');
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
    atualizarBarra('status-bar-vida1', personagem.vida, personagem.vidaMax);
    atualizarBarra('status-bar-vida', personagem.vida, personagem.vidaMax);
    
    atualizarBarra('status-bar-alma1', personagem.alma, personagem.almaMax);
    atualizarBarra('status-bar-alma', personagem.alma, personagem.almaMax);
    
    atualizarBarra('status-bar-escudo1', personagem.escudo, personagem.escudoMax);
    atualizarBarra('status-bar-escudo', personagem.escudo, personagem.escudoMax);    

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

    // Se a aba for "Google", chama a verificação
    if (subtab === 'Google') {
        console.log('Acessando aba Google...');
        verificarValidadeToken();
    }
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
    // Remover espaços e converter para minúsculas
    expressao = expressao.replace(/\s/g, '').toLowerCase();

    // Separar os termos por vírgula
    const termosOriginais = expressao.split(',');

    let globalModificador = ''; // modificador global (se houver)
    let termos = [];

    // Separa o modificador global (se presente) de algum termo
    termosOriginais.forEach(termo => {
        if (termo.indexOf(')') !== -1) {
            // Separa o termo em duas partes: antes e depois do ')'
            const partes = termo.split(')');
            termos.push(partes[0]);
            // Se já houver um global definido, concatenamos
            globalModificador += partes[1];
        } else {
            termos.push(termo);
        }
    });

    let totalDano = 0;
    let rolagensTotais = [];
    let valoresIndividuais = [];

    // Regex para identificar a notação: opcional "max", quantidade (opcional), d, faces, opcional "k", e modificadores
    const regex = /^(max)?(\d*)d(\d+)(k?)([+-].+)?$/;

    termos.forEach(termo => {
        let localMax = false; // indica se para este termo os dados serão maximizados

        const match = termo.match(regex);
        if (!match) {
            // Se não bate com o padrão de dados, tenta interpretar como número fixo
            let valorFixo = parseFloat(termo);
            if (isNaN(valorFixo)) {
                throw new Error(`Expressão inválida: ${termo}`);
            }
            totalDano += valorFixo;
            rolagensTotais.push({
                expressao: termo,
                rolagens: `${valorFixo}`,
                totalTermo: valorFixo.toFixed(2)
            });
            valoresIndividuais.push(valorFixo);
            return;
        }

        // Grupos do regex:
        // match[1]: "max" (opcional)
        // match[2]: quantidade (opcional, padrão 1 se vazio)
        // match[3]: faces
        // match[4]: "k" (opcional)
        // match[5]: modificadores (opcional)
        if (match[1] && match[1] === 'max') {
            localMax = true;
        }

        let quantidade = match[2] ? parseInt(match[2]) : 1;
        let faces = parseInt(match[3]);
        let keepHighest = (match[4] === 'k');
        let mods = match[5] || '';

        // Processar modificadores deste termo
        let modificadoresFixos = 0;
        let modificadoresPercentuais = 0;
        let modText = '';
        const modMatches = mods.match(/([+-]\d+%?)/g) || [];
        modMatches.forEach(mod => {
            modText += mod;
            if (mod.endsWith('%')) {
                modificadoresPercentuais += parseFloat(mod.slice(0, -1)) || 0;
            } else {
                modificadoresFixos += parseFloat(mod) || 0;
            }
        });

        if (faces <= 0 || quantidade <= 0) {
            throw new Error(`Expressão inválida: ${termo}`);
        }

        let rolagens = [];
        let totalTermo = 0;

        // Rolar os dados para este termo
        for (let i = 0; i < quantidade; i++) {
            let valor;
            // Se "max" foi especificado para este termo, usa o valor máximo para cada dado
            if (localMax) {
                valor = faces;
            } else {
                valor = Math.floor(Math.random() * faces) + 1;
            }
            rolagens.push(valor);
            valoresIndividuais.push(valor);
            // Se não for "keep highest", soma cada valor individualmente
            if (!keepHighest) {
                totalTermo += valor;
            }
        }

        // Se "k" foi utilizado, utiliza apenas o maior valor dentre os lançamentos
        if (keepHighest) {
            totalTermo = Math.max(...rolagens);
        }

        // Aplicar modificadores fixos e percentuais para o termo
        totalTermo += modificadoresFixos;
        if (modificadoresPercentuais !== 0) {
            // O bônus percentual é calculado e somado ao total deste termo
            const bonusPercentual = totalTermo * (modificadoresPercentuais / 100);
            totalTermo += bonusPercentual;
        }
        // Arredonda o total do termo para 2 casas decimais
        totalTermo = parseFloat(totalTermo.toFixed(2));

        totalDano += totalTermo;
        rolagensTotais.push({
            expressao: `${(match[2] ? match[2] : '1')}d${faces}${(keepHighest ? 'k' : '')}${modText}`,
            rolagens: rolagens.join(', '),
            totalTermo: totalTermo.toFixed(2)
        });
    });

    // Variáveis para armazenar os modificadores globais
    let globalFixos = 0;
    let globalPercentuais = 0;

    // Aplicar modificador global, se houver
    if (globalModificador) {
        const globalMods = globalModificador.match(/([+-]?\d+%?)/g) || [];
        globalMods.forEach(mod => {
            if (mod.includes('%')) {
                globalPercentuais += parseFloat(mod.replace('%', '')) || 0;
            } else {
                globalFixos += parseFloat(mod) || 0;
            }
        });
        totalDano += globalFixos;
        if (globalPercentuais !== 0) {
            const bonusGlobal = totalDano * (globalPercentuais / 100);
            totalDano += bonusGlobal;
        }
    }

    // Arredonda o dano total para baixo (soma final)
    const danoFinal = Math.floor(totalDano);

    // Montar a mensagem final
    let mensagem = '';
    rolagensTotais.forEach(termo => {
        mensagem += `Dado rolado (${termo.expressao}): ${termo.totalTermo} [(${termo.rolagens})]\n`;
    });
    if (globalModificador) {
        mensagem += `Modificadores globais aplicados: fixos = ${globalFixos}, percentuais = ${globalPercentuais}%\n`;
    }
    mensagem += "Dano total: " + danoFinal;

    if (typeof mostrarMensagem === 'function') {
        mostrarMensagem(mensagem);
    }
    enviarFeedback(topico, danoFinal, valoresIndividuais, expressao);
    return mensagem;
}

function rolarDadosSimples(expressao) {
    // Remover espaços em branco e converter para minúsculas
    expressao = expressao.replace(/\s/g, '').toLowerCase();
  
    // Se a expressão for somente um número, retorne-o diretamente.
    if (/^-?\d+$/.test(expressao)) {
        const totalDano = parseInt(expressao, 10);
        if (typeof mostrarMensagem === 'function') {
            mostrarMensagem(`Dano: ${totalDano}`);
        }
        return totalDano;
    }
  
    // Verificar se há um termo 'max' no início
    let maximo = false;
    if (expressao.startsWith('max')) {
        maximo = true;
        expressao = expressao.slice(3);
    }

    // Verificar se a expressão contém um valor percentual seguido de vidaMax, almaMax ou escudoMax
    let percentual = 0;
    let negativo = false;
    let atributo = null;
    const matchPercentual = expressao.match(/^(-)?(\d+)%\s*(vidamax|almamax|escudomax)$/);

    if (matchPercentual) {
        negativo = !!matchPercentual[1];
        percentual = parseFloat(matchPercentual[2]);
        atributo = matchPercentual[3];

        // Determinar o valor máximo com base no atributo
        let valorMaximo = 0;
        switch (atributo) {
            case 'vidamax':
                valorMaximo = personagem.vidaMax;
                break;
            case 'almamax':
                valorMaximo = personagem.almaMax;
                break;
            case 'escudomax':
                valorMaximo = personagem.escudoMax;
                break;
        }

        // Calcular o ajuste percentual
        let ajuste = (percentual / 100) * valorMaximo;
        if (negativo) ajuste = -ajuste;

        // Aplicar o ajuste ao personagem
        switch (atributo) {
            case 'vidamax':
                personagem.adicionarVida(ajuste);
                break;
            case 'almamax':
                personagem.adicionarAlma(ajuste);
                break;
            case 'escudomax':
                personagem.adicionarEscudo(ajuste);
                break;
        }

        const acao = negativo ? 'reduzida' : 'aumentada';
        mostrarMensagem(`${atributo.replace('max', '')} ${acao} em ${percentual}%: ${ajuste}`);
        mostrarPopup(ajuste);
        return ajuste;
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
        let negativeTerm = false;
        if (termo.startsWith('-')) {
            negativeTerm = true;
            termo = termo.slice(1);
        }

        const indexD = termo.indexOf('d');
        let quantidade = 1;
        let faces = 0;
        let modificador = 0;

        if (indexD !== -1) {
            quantidade = parseInt(termo.slice(0, indexD)) || 1;
            const restante = termo.slice(indexD + 1);

            const match = restante.match(/^(\d+)([+-]\d+)?$/);
            if (match) {
                faces = parseInt(match[1]) || 0;
                modificador = parseInt(match[2]) || 0;
            }
        } else {
            faces = parseInt(termo) || 0;
        }

        if (faces <= 0 || quantidade <= 0) {
            throw new Error(`Expressão inválida: ${origTermo}`);
        }

        let rolagens = [];
        let totalTermo = 0;

        for (let i = 0; i < quantidade; i++) {
            const rolagem = maximo ? faces : Math.floor(Math.random() * faces) + 1;
            rolagens.push(rolagem);
            totalTermo += rolagem;
            valoresIndividuais.push(rolagem);
        }

        totalTermo += modificador;
        if (negativeTerm) {
            totalTermo = -totalTermo;
        }

        totalDano += totalTermo;

        let expStr = `${quantidade}d${faces}`;
        if (modificador !== 0) {
            expStr += (modificador > 0 ? '+' : '') + modificador;
        }
        if (negativeTerm) {
            expStr = '-' + expStr;
        }

        rolagensTotais.push({
            expressao: expStr,
            rolagens: rolagens.join(', '),
            totalTermo: totalTermo
        });
    });

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
    // Se houver '%' e nenhum atributo definido, anexa "almamax"
    if (expressao.includes('%') && !/(vidamax|almamax|escudomax)/i.test(expressao)) {
        expressao += 'almamax';
    }
    
    let valorAjuste = rolarDadosSimples(expressao);
    if (isNaN(valorAjuste)) {
      mostrarMensagem("Digite um valor válido para o ajuste de alma");
      return;
    }
    
    if (multiplicador === 1) {
      personagem.adicionarAlma(valorAjuste);
    } else if (multiplicador === -1) {
      // Garante que a redução seja aplicada como valor positivo
      personagem.reduzirAlma(Math.abs(valorAjuste));
    } else {
      mostrarMensagem("Operação inválida para ajuste de alma");
      return;
    }
    
    atualizarInfoPersonagem(personagem);
}
  
function ajustarEscudo(multiplicador) {
    let expressao = document.getElementById('ajuste-escudo').value.trim();
    if (multiplicador === -1 && !expressao.startsWith('-')) {
      expressao = '-' + expressao;
    }
    // Se houver '%' e nenhum atributo definido, anexa "escudomax"
    if (expressao.includes('%') && !/(vidamax|almamax|escudomax)/i.test(expressao)) {
        expressao += 'escudomax';
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
    
    atualizarInfoPersonagem(personagem);
}
  
function ajustarVida(multiplicador) {
    let expressao = document.getElementById('ajuste-vida').value.trim();
    if (multiplicador === -1 && !expressao.startsWith('-')) {
      expressao = '-' + expressao;
    }
    // Se houver '%' e nenhum atributo definido, anexa "vidamax"
    if (expressao.includes('%') && !/(vidamax|almamax|escudomax)/i.test(expressao)) {
        expressao += 'vidamax';
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
    
    atualizarInfoPersonagem(personagem);
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

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagensInput1').value) || 0;
    let modificador = parseInt(document.getElementById('modificadorInput1').value) || 0;

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

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-ataque').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-ataque').value) || 0;
    
    // Rola o teste de ataque
    let resultadoAtaque = acao('força', 'luta', numeroVantagens, modificador);
    
    // Monta a mensagem do teste de ataque
    let mensagem = `Resultado do Ataque: ${resultadoAtaque}`;

    await delay(1000);
    
    // Verifica se há um item selecionado para ataque
    if (window.selectedAttackItem) {
      let danoItem = window.selectedAttackItem.damage;
      let nomeItem = window.selectedAttackItem.name;
      window.topico = 'Dano - ' + nomeItem;
      
      let resultadoDano = rolarDano(danoItem);
      mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
      mensagem += `\nNenhum item selecionado para ataque.`;
    }
    
    mostrarMensagem(mensagem);
}


async function executarTiro() {
    window.topico = 'Atirar';

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-tiro').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-tiro').value) || 0;
    
    // Rola o teste de tiro
    let resultadoTiro = acao('agilidade', 'pontaria', numeroVantagens, modificador);
    
    // Monta a mensagem do teste de tiro
    let mensagem = `Resultado do Tiro: ${resultadoTiro}`;

    await delay(1000);
    
    // Verifica se há um item selecionado para tiro
    if (window.selectedAttackItem) {
      let danoItem = window.selectedAttackItem.damage;
      let nomeItem = window.selectedAttackItem.name;
      window.topico = 'Dano - ' + nomeItem;
      
      let resultadoDano = rolarDano(danoItem);
      mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
      mensagem += `\nNenhum item selecionado para tiro.`;
    }
    
    mostrarMensagem(mensagem);
}
 

function executarDefesa() {
    window.topico = 'Defesa';

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-defesa').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-defesa').value) || 0;
    
    let resultadoAcao = acao('fortitude', 'vigor', numeroVantagens, modificador); // Exemplo de retorno:

    // Extrair o valor numérico do resultado
    let match = resultadoAcao.match(/Resultado Final:\s*(\d+)/);
    let resultado = match ? Number(match[1]) : NaN;
    if (isNaN(resultado)) {
        mostrarMensagem("Erro: Não foi possível extrair o resultado final.");
        resultado = 0;
    }

    // Se o checkbox de escudo estiver marcado, soma o valor do escudo
    let checkboxEscudo = document.getElementById('checkDefesa');
    if (checkboxEscudo && checkboxEscudo.checked) {
        let escudo = Number(personagem.escudo); // Converte o valor de escudo para número
        mostrarMensagem(`Escudo: ${escudo}`);
        mostrarMensagem(`Resultado antes do escudo: ${resultado}`);
        resultado += escudo; // Soma o valor do escudo
    }

    let mensagem = (`Resultado da Defesa: ${resultado}`);

    if (window.selectedAttackItem) {
        let danoItem = window.selectedAttackItem.damage;
        let nomeItem = window.selectedAttackItem.name;
        window.topico = 'Dano - ' + nomeItem;
        
        let resultadoDano = rolarDano(danoItem);
        mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
        mensagem += `\nNenhum item selecionado para defesa.`;
    }

    mostrarMensagem(mensagem);
}


function executarEsquiva() {
    window.topico = 'Esquiva';

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-esquiva').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-esquiva').value) || 0;
    
    let resultado = acao('agilidade', 'destreza', numeroVantagens, modificador);

    let mensagem = (`Resultado da Esquiva: ${resultado}`);

    if (window.selectedAttackItem) {
        let danoItem = window.selectedAttackItem.damage;
        let nomeItem = window.selectedAttackItem.name;
        window.topico = 'Dano - ' + nomeItem;
        
        let resultadoDano = rolarDano(danoItem);
        mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
        mensagem += `\nNenhum item selecionado para esquiva.`;
    }

    mostrarMensagem(mensagem);
}


function executarContraAtaque() {
    window.topico = 'Contra-ataque';

    // Obtém os valores de vantagens e modificador, considerando 0 se forem inválidos
    let numeroVantagens = parseInt(document.getElementById('vantagens-contraataque').value) || 0;
    let modificador = parseInt(document.getElementById('modificador-contraataque').value) || 0;
    
    let resultado = acao('força', 'luta', numeroVantagens, modificador);

    let mensagem = (`Resultado do Contra-ataque: ${resultado}`);

    if (window.selectedAttackItem) {
        let danoItem = window.selectedAttackItem.damage;
        let nomeItem = window.selectedAttackItem.name;
        window.topico = 'Dano - ' + nomeItem;
        
        let resultadoDano = rolarDano(danoItem);
        mensagem += `\nDano com ${window.selectedAttackItem.name}: ${resultadoDano}`;
    } else {
        mensagem += `\nNenhum item selecionado para contra-ataque.`;
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
          token: document.getElementById('token').value.trim(),
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
          token: getStringValue('token'),
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

    window.imgpersonagem = document.getElementById('img').value.trim();
    atualizarIconeIndicador();
    mostrarMensagem(window.imgpersonagem || 'Imagem do Personagem');
    console.log('MyAppLog: Imagem do personagem:', window.imgpersonagem);

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

    carregarFichasNaBarra();
}

async function carregarStatusPorNome(nome) {
    if (!nome) {
        alert('Nome inválido do personagem.');
        return;
    }

    window.nomepersonagem = nome;
    document.getElementById('status-nome').textContent = window.nomepersonagem || 'Nome do Personagem';

    try {
        const data = localStorage.getItem(`${nome}-personagem`);
        if (data) {
            const personagemData = JSON.parse(data);
            personagem = new Personagem(personagemData);

            window.imgpersonagem = personagemData.img || '';
            document.getElementById('img').value = window.imgpersonagem;

            atualizarIconeIndicador();
            console.log('MyAppLog: Imagem do personagem:', window.imgpersonagem);

            atualizarInfoPersonagem(personagem); // Atualiza a interface com os dados do personagem
            carregarHabilidades(nome); // Carrega habilidades
        } else {
            throw new Error('Dados não encontrados.');
        }
    } catch (error) {
        console.error('MyAppLog: Erro ao carregar status do personagem:', JSON.stringify(error));
        mostrarMensagem('Erro ao carregar status do personagem.');
    }

    carregarFichasNaBarra(); // Atualiza a barra após carregar
    toggleButton.click();
}


async function carregarHabilidades2() {
    // Obter os dados de entrada do usuário
    const nomePersonagem = document.getElementById('nomeCarregarHab').value.trim();
    const nomeHabilidade = document.getElementById('nomeHabilidade').value.trim();
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
    
    // Verificar se os campos obrigatórios foram preenchidos:
    // Se atualizarHabilidadeCheck for true, exigir apenas nomePersonagem e nomeHabilidade.
    // Caso contrário, exigir todos os campos.
    if (!nomePersonagem || !nomeHabilidade || 
        (!atualizarHabilidadeCheck && (!dano || !cooldown || !custo || !descricao || !custoVida))) {
        mostrarMensagem('Por favor, preencha os campos obrigatórios.');
        return;
    }

    // Chamar a função adicionarHabilidade com os dados capturados
    try {
        await adicionarHabilidade(nomePersonagem, nomeHabilidade, dano, cooldown, custo, descricao, custoVida, toggle, pericia, atributo, vantagens, modificador, atualizarHabilidadeCheck);
    } catch (error) {
        console.error('Erro ao adicionar habilidade:', error);
        alert('Erro ao adicionar habilidade.');
    }
}


async function adicionarHabilidade(nomePersonagem, nomeHabilidade, dano, cooldown, custo, descricao, custoVida, toggle, pericia, atributo, vantagens, modificador, atualizarHabilidadeCheck) {
    try {
        const key = `${nomePersonagem}-habilidades`;
        let habilidadesData = { habilidades: [] };

        // Verificar se os campos obrigatórios foram preenchidos
        if (!nomePersonagem || !nomeHabilidade) {
            mostrarMensagem('Por favor, insira o nome do personagem e o nome da habilidade.');
            return;
        }

        // Verificar se já existem habilidades salvas
        const data = localStorage.getItem(key);
        if (data) {
            habilidadesData = JSON.parse(data);
        }

        if (atualizarHabilidadeCheck) {
            // Caso seja atualização, encontrar a habilidade correspondente e atualizar apenas os campos alterados
            const habilidadeExistente = habilidadesData.habilidades.find(h => h.nome === nomeHabilidade);

            if (habilidadeExistente) {
                const camposAtualizaveis = {
                    dano,
                    cooldown,
                    custo,
                    descricao,
                    custoVida,
                    toggle,
                    pericia,
                    atributo,
                    vantagens,
                    modificador
                };

                for (const campo in camposAtualizaveis) {
                    if (camposAtualizaveis[campo] !== "" && camposAtualizaveis[campo] !== null && camposAtualizaveis[campo] !== undefined) {
                        habilidadeExistente[campo] = camposAtualizaveis[campo];
                    }
                }

                mostrarMensagem('Habilidade atualizada com sucesso!');
            } else {
                mostrarMensagem('Habilidade não encontrada para atualização.');
                return;
            }
        } else {
            // Exigir preenchimento de todos os campos ao adicionar uma nova habilidade
            if (!dano || !cooldown || !custo || !descricao || !custoVida) {
                mostrarMensagem('Por favor, preencha todos os campos.');
                return;
            }

            // Determinar o próximo ID
            const nextId = (habilidadesData.habilidades.reduce((maxId, habilidade) => Math.max(maxId, parseInt(habilidade.id) || 0), 0) + 1).toString();

            // Adicionar a nova habilidade com ID
            const novaHabilidade = {
                nome: nomeHabilidade,
                id: nextId,
                dano,
                cooldown,
                custo,
                descricao,
                custoVida,
                toggle,
                pericia,
                atributo,
                vantagens,
                modificador
            };

            habilidadesData.habilidades.push(novaHabilidade);
            mostrarMensagem('Habilidade adicionada com sucesso!');
        }

        // Salvar no localStorage
        localStorage.setItem(key, JSON.stringify(habilidadesData, null, 2));
        listarArquivos();
        carregarHabilidades(nomePersonagem);
    } catch (error) {
        console.error('MyAppLog: Erro ao adicionar ou atualizar habilidade:', JSON.stringify(error));
        mostrarMensagem('Erro ao adicionar ou atualizar habilidade.');
    }
}

async function removerHabilidade() {
    // Obter os dados de entrada dos novos campos para remoção
    const nomePersonagem = document.getElementById('nomeRemoverHab').value.trim();
    const nomeHabilidade = document.getElementById('nomeRemoverHabilidade').value.trim();

    // Verificar se os campos obrigatórios foram preenchidos
    if (!nomePersonagem || !nomeHabilidade) {
        mostrarMensagem('Por favor, insira o nome do personagem e o nome da habilidade.');
        return;
    }

    try {
        const key = `${nomePersonagem}-habilidades`;
        const data = localStorage.getItem(key);
        
        if (!data) {
            mostrarMensagem('Nenhuma habilidade encontrada para esse personagem.');
            return;
        }

        let habilidadesData = JSON.parse(data);

        // Encontrar o índice da habilidade que será removida
        const index = habilidadesData.habilidades.findIndex(h => h.nome === nomeHabilidade);

        if (index === -1) {
            mostrarMensagem('Habilidade não encontrada.');
            return;
        }

        // Remover a habilidade do array
        habilidadesData.habilidades.splice(index, 1);

        // Atualizar o localStorage com o novo conjunto de habilidades
        localStorage.setItem(key, JSON.stringify(habilidadesData, null, 2));

        mostrarMensagem('Habilidade removida com sucesso!');
        listarArquivos();
        carregarHabilidades(nomePersonagem);
    } catch (error) {
        console.error('MyAppLog: Erro ao remover habilidade:', JSON.stringify(error));
        mostrarMensagem('Erro ao remover habilidade.');
    }
}


async function carregarHabilidades(nomePersonagem) {
    try {
        const key = `${nomePersonagem}-habilidades`;
        const data = localStorage.getItem(key);
        if (data) {
            habilidadesData = await carregarDados(key);
            exibirHabilidades(habilidadesData);
            //mostrarMensagem('Dados das habilidades recebidos.');
            console.log('Dados das habilidades recebidos:', habilidadesData);
            //mostrarMensagem(JSON.stringify(habilidadesData, null, 2));
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
    // Verifica se o modo administrador está ativado
    if (window.admincheck) {
        console.log("Modo administrador ativado. Feedback não será enviado.");
        return;
    }

    const payload = {
        topico,
        resultado,
        valores,
        formula,
        nomepersonagem: window.nomepersonagem, // Certifique-se de que essa variável está definida
        imagemURL: window.imgpersonagem // Envia a URL da imagem como parte do payload
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

document.getElementById("atualizarhabilidade-checkbox").addEventListener("change", function() {
    atualizarHabilidadeCheck = this.checked;
    console.log("Valor de Atualizar Habilidade:", atualizarHabilidadeCheck);
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

document.addEventListener('DOMContentLoaded', function() {
    const anotacoesTextarea = document.getElementById('anotacoes');

    // Carregar as anotações salvas ao carregar a página
    const savedAnotacoes = localStorage.getItem('anotacoes');
    if (savedAnotacoes) {
        anotacoesTextarea.value = savedAnotacoes;
        anotacoesTextarea.style.height = 'auto';
        anotacoesTextarea.style.height = (anotacoesTextarea.scrollHeight) + 'px';
    }

    // Ajustar altura dinâmica do textarea
    anotacoesTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        salvarAnotacoes(); // Salvar no localStorage automaticamente
    });
});

function salvarAnotacoes() {
    const anotacoes = document.getElementById('anotacoes').value;
    localStorage.setItem('anotacoes', anotacoes);
}


document.querySelectorAll('button').forEach(button => {
  button.addEventListener('mousemove', function(e) {
    const rect = button.getBoundingClientRect();
    // Define as variáveis CSS --mouse-x e --mouse-y com a posição do mouse relativa ao botão
    button.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
    button.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
  });
});

document.getElementById('clear-data-btn').addEventListener('click', function() {
    // Apagar todos os cookies
    document.cookie.split(";").forEach((cookie) => {
        const nome = cookie.split("=")[0].trim();
        document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });

    // Limpar o LocalStorage e o SessionStorage
    sessionStorage.clear();
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    gapi.client.setToken('');


    // Limpar o Cache da Página
    if ('caches' in window) {
        caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
        });
    }

    // Forçar Hard Refresh (recarregar sem cache)
    location.reload(true);
});


document.addEventListener('DOMContentLoaded', () => {
    let startY = 0;
    let isAtBottom = false;
    const indicator = document.getElementById('pull-up-indicator');
  
    if (!indicator) return; // Evita erro se ainda assim não encontrar
  
    window.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      const windowHeight = window.innerHeight;
      // Define a área da parte de baixo. Neste exemplo, os últimos 20% da tela.
      const bottomThreshold = windowHeight * 0.8; 
      // Se o toque não for na parte de baixo, ignoramos o pull-up
      if (startY < bottomThreshold) {
        isAtBottom = false;
        indicator.style.opacity = '0';
        return;
      }
      
      // Se o toque for na região inferior, verifica se a página está no final
      const scrollY = window.scrollY;
      const bodyHeight = document.body.offsetHeight;
      isAtBottom = (windowHeight + scrollY + 80) >= bodyHeight;
  
      if (isAtBottom) {
        indicator.style.opacity = '1';
      }
    });
  
    window.addEventListener('touchmove', (e) => {
      if (!isAtBottom) return;
      const currentY = e.touches[0].clientY;
      const distance = startY - currentY;
      if (distance > 0 && distance < 100) {
        indicator.style.transform = `translateX(-50%) translateY(${-distance / 2}px) scale(${1 + distance / 200})`;
        indicator.style.opacity = `${Math.min(1, distance / 50)}`;
      }
    });
  
    window.addEventListener('touchend', (e) => {
      const endY = e.changedTouches[0].clientY;
      const swipeDistance = startY - endY;
  
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateX(-50%) scale(0.8)';
  
      if (isAtBottom && swipeDistance > 280) {
        document.body.classList.add('abas-mostradas');
      }
    });
  });
  
  
  // Fechar abas ao clicar fora
  document.addEventListener('click', function (event) {
    const aba1 = document.getElementById('essential-info');
    const aba2 = document.getElementById('essential-info2');
  
    const clicouFora =
      !aba1.contains(event.target) &&
      !aba2.contains(event.target) &&
      document.body.classList.contains('abas-mostradas');
  
    if (clicouFora) {
      document.body.classList.remove('abas-mostradas');
    }
  });
  
  const indicador = document.getElementById('pull-up-indicator');
  
  // Define a imagem do personagem ou usa a imagem padrão
  const imagemPersonagem = window.imgpersonagem || 'https://i.pinimg.com/736x/cb/b1/ef/cbb1ef1ee0bf43d633393d7203a4d497.jpg';
  indicador.style.backgroundImage = `url('${imagemPersonagem}')`;
  
  function atualizarIconeIndicador() {
      const indicador = document.getElementById('pull-up-indicator');
      const imagemPersonagem = window.imgpersonagem || 'https://i.pinimg.com/736x/cb/b1/ef/cbb1ef1ee0bf43d633393d7203a4d497.jpg';
      indicador.style.backgroundImage = `url('${imagemPersonagem}')`;
  }
  




  
function carregarFichasNaBarra() {
    const barra = document.getElementById('barra-fichas');
    barra.innerHTML = ''; // Limpa
  
    let fichaCheckada = null;
    const outrasFichas = [];
  
    // Busca fichas válidas
    for (let i = 0; i < localStorage.length; i++) {
      const chave = localStorage.key(i);
      if (chave.includes('-personagem')) {
        const dados = JSON.parse(localStorage.getItem(chave));
        if (dados.check === 1 && !fichaCheckada) {
          fichaCheckada = { chave, dados };
        } else {
          outrasFichas.push({ chave, dados });
        }
      }
    }
  
    window.totalFichas = (fichaCheckada ? 1 : 0) + outrasFichas.length;
  
    if (totalFichas < 2) {
      barra.style.display = 'none';
      return;
    }
  
    barra.style.display = 'none';
  
    let iconesAdicionados = 0;
  
// Adiciona ficha marcada com check: 1
if (fichaCheckada) {
    const nome = fichaCheckada.chave.replace('-personagem', '');
    const img = document.createElement('img');
    img.src = fichaCheckada.dados.img;
    img.alt = nome;
    img.className = 'ficha-icone';
    
    // Torna o ícone arrastável
    img.setAttribute('draggable', true);
    
    img.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', nome);
        e.dataTransfer.setData('image', fichaCheckada.dados.token);
        document.getElementById('tabuleiro').style.pointerEvents = 'auto';
    });
    
    img.addEventListener('dragend', () => {
        document.getElementById('tabuleiro').style.pointerEvents = 'none';
    });
    
    img.addEventListener('click', () => {
      carregarStatusPorNome(nome);
    });
    barra.appendChild(img);
  }
  
  // Adiciona as outras fichas da mesma forma
  for (let i = 0; i < outrasFichas.length; i++) {
    const { chave, dados } = outrasFichas[i];
    const nome = chave.replace('-personagem', '');
    const img = document.createElement('img');
    img.src = dados.img || 'https://media.discordapp.net/attachments/1164311440224702526/1361559378695688232/dfy9prk-fd124c1f-81f6-4ecb-935e-e994799c6b5f.png?ex=67ff327c&is=67fde0fc&hm=316bace3c2ec013775631ccb7ae51781072936e089449bfbc696bac56fa28fc0&=&format=webp&quality=lossless&width=433&height=648';
    img.alt = nome;
    img.className = 'ficha-icone';
    
    // Torna o ícone arrastável
    img.setAttribute('draggable', true);
    
    img.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', nome);
      e.dataTransfer.setData('image', dados.token || 'https://media.discordapp.net/attachments/1164311440224702526/1361559378695688232/dfy9prk-fd124c1f-81f6-4ecb-935e-e994799c6b5f.png?ex=67ff327c&is=67fde0fc&hm=316bace3c2ec013775631ccb7ae51781072936e089449bfbc696bac56fa28fc0&=&format=webp&quality=lossless&width=433&height=648');
      document.getElementById('tabuleiro').style.pointerEvents = 'auto';
    });

    img.addEventListener('dragend', () => {
        document.getElementById('tabuleiro').style.pointerEvents = 'none';
    });
    
    img.addEventListener('click', () => {
      carregarStatusPorNome(nome);
    });
    barra.appendChild(img);
  }
}
  
window.addEventListener('DOMContentLoaded', carregarFichasNaBarra);
  
const senhaCorreta = "mordred123"; // Altere a senha como desejar

function ativarAdmin() {
    const senha = document.getElementById("senhaAdmin").value;
    if (senha === senhaCorreta) {
        window.admincheck = true;
        localStorage.setItem("admincheck", "true");
        atualizarStatusAdmin();
    } else {
        document.getElementById("adminStatus").textContent = "Senha incorreta.";
        document.getElementById("adminStatus").style.color = "red";
    }
}

function desativarAdmin() {
    window.admincheck = false;
    localStorage.setItem("admincheck", "false");
    atualizarStatusAdmin();
}

function atualizarStatusAdmin() {
    const status = window.admincheck;
    const statusText = document.getElementById("adminStatus");

    if (status) {
        statusText.textContent = "Modo administrador ativado!";
        statusText.style.color = "green";
    } else {
        statusText.textContent = "Modo administrador desativado.";
        statusText.style.color = "black";
    }
}

// Carregar status do admin ao iniciar a página
window.addEventListener("DOMContentLoaded", () => {
    const savedStatus = localStorage.getItem("admincheck");
    window.admincheck = savedStatus === "true";
    atualizarStatusAdmin();
});
