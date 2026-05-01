const ProductParser = (() => {
 
  function parse(selectValue) {
    const parts = selectValue.split(" - R$");
    if (parts.length !== 2) return null;

    const name = parts[0].trim();
    const price = parseFloat(parts[1].trim());

    if (!name || isNaN(price)) return null;

    return { name, price };
  }

  return { parse };
})();

/*
Responsabilidade: pegar o texto selecionado no <select> e separar em nome e preço.
Como funciona:
    Espera um formato específico: "Nome do Produto - R$999".
    Usa split(" - R$") para dividir em duas partes: antes do preço e o valor.
    Se não tiver exatamente duas partes, retorna null (inválido).
    Converte o preço para número (parseFloat).
    Se deu certo, retorna um objeto { name, price }.
    👉 É como um tradutor: transforma uma string em dados organizados.
*/

const CartStore = (() => {
  let items = []; 

  function add(product, quantity) {
    const existing = items.find((i) => i.name === product.name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ ...product, quantity });
    }
  }

  function clear() {
    items = [];
  }

  function getItems() {
    return [...items];
  }

  function getTotal() {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  return { add, clear, getItems, getTotal };
})();

/*
Responsabilidade: guardar e manipular os itens do carrinho.
Como funciona:
  Mantém uma lista interna items (cada item tem nome, preço e quantidade).
  add(product, quantity): adiciona produto. Se já existe, soma a quantidade.
  clear(): limpa o carrinho.
  getItems(): devolve uma cópia da lista de itens.
  getTotal(): soma o valor total de todos os itens.
👉 É como o “banco de dados” do carrinho, onde ficam guardados os produtos.
*/

const CartRenderer = (() => {
  const productListEl = document.getElementById("product-list");
  const totalValueEl = document.getElementById("total-value");

  function renderItem(item) {
    const section = document.createElement("section");
    section.classList.add("products__cart__product");
    section.innerHTML =
      `<span class="blue-text">${item.quantity}x</span> ` +
      `${item.name} ` +
      `<span class="blue-text">R$${(item.price * item.quantity).toFixed(2)}</span>`;
    return section;
  }

  function render(items, total) {
    productListEl.innerHTML = "";

    items.forEach((item) => {
      productListEl.appendChild(renderItem(item));
    });

    totalValueEl.textContent = `R$${total.toFixed(2)}`;
  }

  return { render };
})();

/*
Responsabilidade: mostrar o carrinho na tela (DOM).
Como funciona:
  Pega os elementos do HTML (product-list e total-value).
  renderItem(item): cria um bloco <section> com nome, quantidade e preço.
  render(items, total): limpa a lista e adiciona cada item, depois atualiza o total.
👉 É o “pintor”: pega os dados e desenha na tela.
*/

const FormReader = (() => {
  const productSelectEl = document.getElementById("product");
  const amountInputEl = document.getElementById("amount");

  function read() {
    const selectValue = productSelectEl.value;
    const quantity = parseInt(amountInputEl.value, 10);

    return { selectValue, quantity };
  }

  function validate({ selectValue, quantity }) {
    if (!selectValue) return "Selecione um produto.";
    if (!quantity || quantity < 1)
      return "Informe uma quantidade válida (mínimo 1).";
    return null; // sem erros
  }

  function reset() {
    amountInputEl.value = "";
    amountInputEl.focus();
  }

  productSelectEl.addEventListener("change", () => {
    amountInputEl.value = "";
    amountInputEl.focus();
  });

  return { read, validate, reset };
})();

/*
Responsabilidade: ler os dados do formulário e validar.
Como funciona:
  read(): pega o valor selecionado e a quantidade digitada.
  validate(): verifica se o produto foi escolhido e se a quantidade é válida (mínimo 1).
  reset(): limpa o campo quantidade e coloca o foco nele.
  Também adiciona um evento: quando troca o produto, limpa o campo quantidade.
👉 É o “leitor”: pega o que o usuário digitou e garante que está certo.
*/

const Notifier = (() => {
  function warn(message) {
    alert(message);
  }

  return { warn };
})();

/*
Responsabilidade: avisar o usuário sobre erros.
Como funciona:
  warn(message): mostra um alert com a mensagem.
👉 É o “mensageiro”: dá feedback quando algo está errado.
*/

function toadd() {
  const formData = FormReader.read();

  const error = FormReader.validate(formData);
  if (error) {
    Notifier.warn(error);
    return;
  }

  const product = ProductParser.parse(formData.selectValue);
  if (!product) {
    Notifier.warn("Produto inválido. Verifique as opções disponíveis.");
    return;
  }

  CartStore.add(product, formData.quantity);
  CartRenderer.render(CartStore.getItems(), CartStore.getTotal());
  FormReader.reset();
}

function toclean() {
  CartStore.clear();
  CartRenderer.render(CartStore.getItems(), CartStore.getTotal());
  FormReader.reset();
}

/*
Responsabilidade: juntar todos os módulos e fazer o fluxo funcionar.
Funções principais:
  toadd(): quando o usuário adiciona um produto.
  Lê o formulário.
  Valida os dados.
  Converte para { name, price }.
  Adiciona no carrinho.
  Atualiza a tela.
  Reseta o formulário.
  toclean(): quando o usuário limpa o carrinho.
  Apaga os itens.
  Atualiza a tela.
  Reseta o formulário.
👉 É o “maestro”: coordena todos os outros módulos para que o sistema funcione.
*/