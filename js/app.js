// 1. ProductParser
//    Responsabilidade: extrair nome e preço
//    de uma string do <select>

const ProductParser = (() => {
  /**
   * Espera o formato "Nome do Produto - R$999"
   * Retorna { name: string, price: number } ou null se inválido.
   */
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

// 2. CartStore
//    Responsabilidade: manter e manipular
//    o estado interno do carrinho (items[])

const CartStore = (() => {
  let items = []; // { name, price, quantity }

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

// 3. CartRenderer
//    Responsabilidade: atualizar o DOM com
//    o estado atual do carrinho

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

// 4. FormReader
//    Responsabilidade: ler e validar os valores
//    do formulário (produto e quantidade)

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

// 5. Notifier
//    Responsabilidade: exibir mensagens de erro
//    ou feedback ao usuário

const Notifier = (() => {
  function warn(message) {
    alert(message);
  }

  return { warn };
})();

// 6. App (Orquestrador)
//    Responsabilidade: conectar os módulos,
//    expor as funções chamadas pelo HTML

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
