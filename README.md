# 🛒 Carrinho de Compras

Aplicação web simples de carrinho de compras, desenvolvida com HTML, CSS e JavaScript puro, sem dependências externas.

---

## 📋 Funcionalidades

- Seleção de produto via dropdown
- Inserção de quantidade
- Adição de produtos ao carrinho com acumulação de quantidades
- Exibição do total atualizado em tempo real
- Limpeza completa do carrinho
- Foco automático no campo de quantidade ao selecionar um produto ou adicionar um item

---

## 📁 Estrutura do Projeto

```
/
├── index.html
├── style.css
├── js/
│   └── app.js
└── assets/
    ├── favicon.ico
    ├── carrinho-cinza.svg
    └── icone-carrinho.svg
```

---

## 🧠 Arquitetura JavaScript

O arquivo `js/app.js` segue o **Single Responsibility Principle (SRP)**, onde cada módulo tem uma única razão para existir e mudar.

### Módulos

| Módulo | Responsabilidade |
|---|---|
| `ProductParser` | Converte a string do `<select>` em `{ name, price }` |
| `CartStore` | Gerencia o estado interno dos itens do carrinho |
| `CartRenderer` | Atualiza o DOM com os dados atuais do carrinho |
| `FormReader` | Lê, valida os campos do formulário e gerencia o foco |
| `Notifier` | Exibe mensagens de feedback/erro ao usuário |
| `App` | Orquestra os módulos (funções `toadd` e `toclean`) |

### Fluxo de adição de produto

```
toadd()
  │
  ├── FormReader.read()          → lê produto e quantidade do formulário
  ├── FormReader.validate()      → valida os dados lidos
  ├── ProductParser.parse()      → extrai name e price da string do select
  ├── CartStore.add()            → adiciona ou acumula o item no estado
  ├── CartRenderer.render()      → atualiza a lista e o total no DOM
  └── FormReader.reset()         → zera o input e devolve o foco
```

### Fluxo de limpeza

```
toclean()
  │
  ├── CartStore.clear()          → esvazia o estado do carrinho
  ├── CartRenderer.render()      → limpa a lista e zera o total no DOM
  └── FormReader.reset()         → zera o input e devolve o foco
```

---

## ⚙️ Comportamentos

- **Produto duplicado**: ao adicionar um produto já existente no carrinho, a quantidade é acumulada em vez de criar uma nova linha.
- **Foco automático**: ao trocar o produto no `<select>` ou ao clicar em **Adicionar**, o campo de quantidade recebe foco e exibe `0`.
- **Validação**: quantidade menor que 1 ou produto inválido exibe um alerta antes de qualquer alteração no carrinho.

---

## 🚀 Como executar

Não há dependências ou etapas de build. Basta abrir o `index.html` diretamente no navegador:

```bash
# Via extensão Live Server (VS Code)
# Clique com botão direito em index.html → "Open with Live Server"

# Ou simplesmente abra o arquivo no navegador
open index.html
```

---

## 🛍️ Produtos disponíveis

| Produto | Preço |
|---|---|
| Fone de ouvido | R$ 100,00 |
| Celular | R$ 1.400,00 |
| Oculus VR | R$ 5.000,00 |

---

## 🧩 Adicionando novos produtos

Para adicionar um novo produto, basta incluir um `<option>` no `<select>` do `index.html` seguindo o formato `"Nome do Produto - R$VALOR"`:

```html
<option value="Teclado Mecânico - R$350">Teclado Mecânico - R$350</option>
```

Nenhuma alteração no JavaScript é necessária.
