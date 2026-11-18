const API = '';

let paginaAtual = 'inicio';

let filmes = [];
let herois = [];

function buscarElemento(id) {
    return document.getElementById(id);
}

function protegerTexto(texto = '') {
    return String(texto).replace(/[&<>"']/g, caractere => {
        const caracteres = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return caracteres[caractere];
    });
}


async function request(caminho, opcoes = {}) {
    const resposta = await fetch(`${API}${caminho}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        ...opcoes
    });

    const dados = await resposta.json().catch(() => ({
        message: 'Não foi possível ler a resposta do servidor.'
    }));

    if (!resposta.ok) {
        throw new Error(dados.message || 'Ocorreu um erro.');
    }

    return dados;
}

function mostrarMensagem(mensagem) {
    buscarElemento('toast').textContent = mensagem;

    buscarElemento('toast').classList.remove('hidden');

    setTimeout(() => {
        buscarElemento('toast').classList.add('hidden');
    }, 2600);
}

async function carregarDados() {
    try {
        const resultados = await Promise.all([
            request('/movies'),
            request('/heroes')
        ]);

        filmes = resultados[0];
        herois = resultados[1];

        mostrarCatalogo();

    } catch (erro) {
        buscarElemento('catalog').innerHTML = `
            <p class="text-rose-400">
                ${protegerTexto(erro.message)}
                Verifique se o backend está funcionando.
            </p>
        `;
    }
}

function mudarPagina(novaPagina) {
    paginaAtual = novaPagina;

    document.querySelectorAll('.nav-btn').forEach(botao => {
        botao.classList.toggle(
            'nav-active',
            botao.dataset.page === paginaAtual
        );
    });

    buscarElemento('heroBanner').classList.toggle(
        'hidden',
        paginaAtual !== 'inicio'
    );

    buscarElemento('sectionTitle').textContent =
        paginaAtual === 'herois'
            ? 'Todos os heróis'
            : 'Filmes em destaque';

    buscarElemento('addMovie').classList.toggle(
        'hidden',
        paginaAtual === 'herois'
    );

    buscarElemento('addHero').classList.toggle(
        'hidden',
        paginaAtual === 'filmes'
    );

    mostrarCatalogo();
}

function mostrarCatalogo() {
    const pesquisa = buscarElemento('search').value.trim().toLowerCase();

    let itens = paginaAtual === 'herois'
        ? herois
        : filmes;

    if (pesquisa) {
        itens = itens.filter(item =>
            JSON.stringify(item).toLowerCase().includes(pesquisa)
        );
    }

    if (itens.length === 0) {
        buscarElemento('catalog').innerHTML = `
            <div class="col-span-full rounded-2xl border border-dashed border-white/15 p-10 text-center text-zinc-400">
                Nenhum item encontrado. Que tal cadastrar o primeiro?
            </div>
        `;

        return;
    }

    buscarElemento('catalog').innerHTML = itens.map(item => {
        const ehHeroi = paginaAtual === 'herois';

        const nome = ehHeroi ? item.name : item.title;

        const informacao = ehHeroi
            ? item.universe
            : `Lançamento: ${item.year}`;

        const descricao = ehHeroi
            ? `Poder: ${item.power}`
            : item.description || 'Adicione uma descrição para este filme.';

        return `
            <article class="poster rounded-2xl border border-white/10 p-5 hover:border-pink-neon/50 transition">

              

                <div class="mt-4 flex items-start justify-between gap-2">
                    <div>
                        <span class="text-[10px] tracking-widest text-pink-soft font-bold">
                            ${ehHeroi ? 'HERÓI' : 'FILME'}
                        </span>

                        <h3 class="font-bold text-lg mt-1">
                            ${protegerTexto(nome)}
                        </h3>

                        <p class="text-sm text-zinc-400">
                            ${protegerTexto(informacao)}
                        </p>
                    </div>

                    <span class="text-pink-neon">✧</span>
                </div>

                <p class="text-sm text-zinc-400 mt-3 min-h-10">
                    ${protegerTexto(descricao)}
                </p>

                <div class="flex gap-2 mt-4">
                    <button
                        class="edit-btn btn btn-muted flex-1 text-sm"
                        data-id="${protegerTexto(item.id)}"
                        data-type="${ehHeroi ? 'hero' : 'movie'}">
                        Editar
                    </button>

                    <button
                        class="delete-btn btn border border-rose-500/30 text-rose-300 px-3 text-sm"
                        data-id="${protegerTexto(item.id)}"
                        data-type="${ehHeroi ? 'hero' : 'movie'}">
                        Excluir
                    </button>
                </div>

            </article>
        `;
    }).join('');
}


function abrirFormulario(tipo, item = null) {
    buscarElemento('itemForm').reset();
    buscarElemento('formError').textContent = '';

    buscarElemento('itemId').value = item?.id || '';
    buscarElemento('itemType').value = tipo;

    buscarElemento('modalTitle').textContent =
        `${item ? 'Editar' : 'Cadastrar'} ${tipo === 'hero' ? 'herói' : 'filme'}`;

    buscarElemento('labelName').textContent =
        tipo === 'hero' ? 'Nome do herói' : 'Título do filme';

    buscarElemento('name').value = item
        ? (tipo === 'hero' ? item.name : item.title)
        : '';

    if (tipo === 'hero') {
        buscarElemento('extraFields').innerHTML = `
            <div>
                <label class="block text-sm text-zinc-300 mb-2">Universo</label>
                <input id="universe" class="field" required
                    value="${protegerTexto(item?.universe || '')}">
            </div>

            <div>
                <label class="block text-sm text-zinc-300 mb-2">Poder</label>
                <input id="power" class="field" required
                    value="${protegerTexto(item?.power || '')}">
            </div>
        `;
    } else {
        buscarElemento('extraFields').innerHTML = `
            <div>
                <label class="block text-sm text-zinc-300 mb-2">Ano de lançamento</label>
                <input id="year" type="number" min="1888" max="2100"
                    class="field" required
                    value="${protegerTexto(item?.year || '')}">
            </div>

            <div>
                <label class="block text-sm text-zinc-300 mb-2">Descrição</label>
                <textarea id="description" class="field" rows="3">${protegerTexto(item?.description || '')}</textarea>
            </div>
        `;
    }

    buscarElemento('modal').classList.remove('hidden');
    buscarElemento('modal').classList.add('flex');
}


function fecharFormulario() {
    buscarElemento('modal').classList.add('hidden');
    buscarElemento('modal').classList.remove('flex');
}


buscarElemento('itemForm').addEventListener('submit', async evento => {
    evento.preventDefault();

    const tipo = buscarElemento('itemType').value;
    const id = buscarElemento('itemId').value;

    let dados;

    if (tipo === 'hero') {
        dados = {
            name: buscarElemento('name').value,
            universe: buscarElemento('universe').value,
            power: buscarElemento('power').value
        };
    } else {
        dados = {
            title: buscarElemento('name').value,
            year: Number(buscarElemento('year').value),
            description: buscarElemento('description').value
        };
    }

    const rota = tipo === 'hero' ? '/heroes' : '/movies';

    try {
        await request(`${rota}${id ? `/${id}` : ''}`, {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(dados)
        });

        fecharFormulario();

        await carregarDados();

        mostrarMensagem(
            id ? 'Cadastro atualizado!' : 'Cadastro realizado!'
        );

    } catch (erro) {
        buscarElemento('formError').textContent = erro.message;
    }
});


document.addEventListener('click', async evento => {

    
    const navegacao = evento.target.closest('[data-page]');

    if (navegacao) {
        mudarPagina(navegacao.dataset.page);
        return;
    }

    
    const botaoEditar = evento.target.closest('.edit-btn');

    if (botaoEditar) {
        const item = botaoEditar.dataset.type === 'hero'
            ? herois.find(x => x.id == botaoEditar.dataset.id)
            : filmes.find(x => x.id == botaoEditar.dataset.id);

        if (item) {
            abrirFormulario(botaoEditar.dataset.type, item);
        }

        return;
    }

   
    const botaoExcluir = evento.target.closest('.delete-btn');

    if (botaoExcluir && confirm('Tem certeza que deseja excluir este cadastro?')) {
        const rota = botaoExcluir.dataset.type === 'hero'
            ? '/heroes'
            : '/movies';

        try {
            await request(`${rota}/${botaoExcluir.dataset.id}`, {
                method: 'DELETE'
            });

            await carregarDados();

            mostrarMensagem('Cadastro excluído.');

        } catch (erro) {
            mostrarMensagem(erro.message);
        }
    }
});


buscarElemento('addMovie').onclick = () => abrirFormulario('movie');
buscarElemento('addHero').onclick = () => abrirFormulario('hero');


buscarElemento('closeModal').onclick = fecharFormulario;
buscarElemento('cancelModal').onclick = fecharFormulario;


buscarElemento('search').addEventListener('input', mostrarCatalogo);


carregarDados();