let produtosData = [];
let paginaAtual = 1;
const produtosPorPagina = 25;

async function carregarProdutos() {
  const response = await fetch('produtos.json');
  const data = await response.json();
  produtosData = data;
  renderizarProdutos();
}

function renderizarProdutos() {
  const container = document.getElementById('produtos');
  container.innerHTML = '';

  const termo = document.getElementById('pesquisa').value.toLowerCase();
  const tipo = document.getElementById('filtroTipo').value;
  const categoria = document.getElementById('filtroCategoria').value;
  const fornecedor = document.getElementById('filtroFornecedor').value;

  const filtrados = produtosData.filter(p => {
    return (
      (!termo || p.nome.toLowerCase().includes(termo) || p.codigo.toLowerCase().includes(termo)) &&
      (!tipo || p.tipoEnvio === tipo) &&
      (!categoria || p.categoria === categoria) &&
      (!fornecedor || p.fornecedor === fornecedor)
    );
  });

  const inicio = (paginaAtual - 1) * produtosPorPagina;
  const fim = inicio + produtosPorPagina;
  const produtosParaMostrar = filtrados.slice(inicio, fim);

  for (const produto of produtosParaMostrar) {
    const card = document.createElement('div');
    card.className = 'card';

    let tipoEnvioClass = '';
    if (produto.tipoEnvio === 'Nacional') {
      tipoEnvioClass = 'tag-nacional';
    } else if (produto.tipoEnvio === 'Internacional') {
      tipoEnvioClass = 'tag-internacional';
    }

    card.innerHTML = `
      <span class="tag ${tipoEnvioClass}">${produto.tipoEnvio}</span>
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <div class="content">
        <h3>${produto.nome}</h3>
        <a href="${produto.link}" target="_blank"><button>Comprar agora</button></a>
        <div style="display:flex; align-items: flex-end; justify-content: space-between;">
          <p>${produto.fornecedor}</p>
          <p>${produto.codigo}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  }

  renderizarPaginacao(filtrados.length);
}

function renderizarPaginacao(totalProdutos) {
  const paginacaoTopo = document.getElementById('paginacao-topo');
  const paginacaoBaixo = document.getElementById('paginacao');
  paginacaoTopo.innerHTML = '';
  paginacaoBaixo.innerHTML = '';

  const totalPaginas = Math.ceil(totalProdutos / produtosPorPagina);

  if (totalPaginas <= 1) return; // Se só tiver uma página, nem mostra a paginação.

  function criarPaginador(container) {
    // Botão Anterior
    const botaoAnterior = document.createElement('button');
    botaoAnterior.textContent = '<<';
    botaoAnterior.disabled = paginaAtual === 1;
    botaoAnterior.onclick = () => {
      if (paginaAtual > 1) {
        paginaAtual--;
        renderizarProdutos();
      }
    };
    container.appendChild(botaoAnterior);

    // Cálculo das páginas para mostrar
    let inicio = Math.max(1, paginaAtual - 2);
    let fim = Math.min(totalPaginas, inicio + 4);

    if (fim - inicio < 4) {
      inicio = Math.max(1, fim - 4);
    }

    // Botões de páginas
    for (let i = inicio; i <= fim; i++) {
      const botao = document.createElement('button');
      botao.textContent = i;
      if (i === paginaAtual) botao.classList.add('ativo');
      botao.onclick = () => {
        paginaAtual = i;
        renderizarProdutos();
      };
      container.appendChild(botao);
    }

    // Reticências se tiver mais páginas
    if (fim < totalPaginas) {
      const pontos = document.createElement('span');
      pontos.textContent = '...';
      container.appendChild(pontos);

      const ultimoBotao = document.createElement('button');
      ultimoBotao.textContent = totalPaginas;
      if (paginaAtual === totalPaginas) ultimoBotao.classList.add('ativo');
      ultimoBotao.onclick = () => {
        paginaAtual = totalPaginas;
        renderizarProdutos();
      };
      container.appendChild(ultimoBotao);
    }

    // Botão Próximo
    const botaoProximo = document.createElement('button');
    botaoProximo.textContent = '>>';
    botaoProximo.disabled = paginaAtual === totalPaginas;
    botaoProximo.onclick = () => {
      if (paginaAtual < totalPaginas) {
        paginaAtual++;
        renderizarProdutos();
      }
    };
    container.appendChild(botaoProximo);
  }

  // Criar nos dois lugares
  criarPaginador(paginacaoTopo);
  criarPaginador(paginacaoBaixo);
}

// Eventos de pesquisa e filtros
document.getElementById('pesquisa').addEventListener('input', () => {
  paginaAtual = 1;
  renderizarProdutos();
});
document.getElementById('filtroTipo').addEventListener('change', () => {
  paginaAtual = 1;
  renderizarProdutos();
});
document.getElementById('filtroCategoria').addEventListener('change', () => {
  paginaAtual = 1;
  renderizarProdutos();
});
document.getElementById('filtroFornecedor').addEventListener('change', () => {
  paginaAtual = 1;
  renderizarProdutos();
});

carregarProdutos();
