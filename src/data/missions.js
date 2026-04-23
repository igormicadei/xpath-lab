/**
 * XPath Lab — Missions Data
 * Content based on: Guia Completo de XPath para Automação Web
 */

export const missions = [
  // ─── MISSÃO 1 ────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Primeiros Passos",
    subtitle: "O que é XPath e como pensar nessa linguagem",
    color: "#0f62fe",
    icon: "🗺️",
    xp: 100,
    difficulty: "iniciante",
    sections: [
      {
        type: "intro",
        content: `Você recebeu acesso ao <strong>XPath Lab</strong> — um ambiente de treinamento para dominar a arte de localizar elementos em páginas web. XPath é a linguagem que permite apontar exatamente onde está cada elemento numa árvore HTML. Usada em <strong>Selenium, Playwright, RPA e automação em geral</strong>.`,
      },
      {
        type: "concept-group",
        title: "📐 A Estrutura que você vai navegar",
        content: `Todo documento HTML é uma <strong>árvore</strong>. Cada tag é um nó. XPath é o idioma para caminhar por essa árvore.`,
        concepts: [
          {
            operator: "HTML",
            name: "Árvore de nós",
            color: "#0f62fe",
            text: "Cada elemento HTML (div, span, button...) é um nó na árvore. Você navega essa árvore usando XPath.",
          },
        ],
      },
      {
        type: "interactive",
        title: "🔬 Explore a árvore",
        description:
          "Este HTML tem uma estrutura com header, mensagens e um alerta. Teste os XPaths abaixo para ver o que cada um retorna.",
        html: `<div id="telaPrincipal">
  <div class="header">
    <h2>Seleção de débitos</h2>
  </div>
  <div class="mensagens">
    <div role="alert" class="erro">
      CPF inválido
    </div>
  </div>
</div>`,
        examples: [
          { xpath: "//div", label: "Todos os divs" },
          { xpath: "//h2", label: "O título h2" },
          { xpath: '//*[@role="alert"]', label: "O alerta (por role)" },
          { xpath: '//*[@id="telaPrincipal"]', label: "Elemento por id" },
          { xpath: '//div[@class="erro"]', label: "Div pelo class exato" },
        ],
        defaultXPath: "//h2",
      },
      {
        type: "tip",
        content:
          '<strong>XPath frágil evita dependência de posição.</strong> O XPath <code>//*[@id="telaPrincipal"]/div[1]/div[3]/h2</code> quebra se você mover um div. Já <code>//h2</code> permanece estável.',
      },
      {
        type: "interactive",
        title: "❌ XPath Ruim vs ✅ XPath Bom",
        description:
          "Compare os dois estilos de XPath. O frágil depende de posição exata; o bom usa atributos semânticos.",
        html: `<div id="telaPrincipal">
  <div class="header">
    <h2>Seleção de débitos</h2>
  </div>
  <div class="mensagens">
    <div role="alert" class="erro">
      CPF inválido
    </div>
  </div>
</div>`,
        examples: [
          {
            xpath: '//*[@id="telaPrincipal"]/div[1]/div[3]/h2',
            label: "❌ Frágil — por posição",
          },
          { xpath: "//h2", label: "✅ Simples — por tag" },
          { xpath: '//div[@role="alert"]', label: "✅ Semântico — por role" },
          {
            xpath: '//div[contains(@class,"erro")]',
            label: "✅ Parcial — por class",
          },
        ],
        defaultXPath: '//div[@role="alert"]',
      },
      {
        type: "challenge",
        title: "Desafio Final: Banner de confirmação de pagamento",
        description:
          "Após um pagamento bem-sucedido, a página exibe um banner de confirmação. Localize o <code>div</code> do banner de <strong>pagamento aprovado</strong> usando o atributo semântico correto — sem depender de classe CSS ou posição na árvore.",
        html: `<div class="checkout">
  <div class="resumo">
    <h3>Resumo do pedido</h3>
    <ul>
      <li>Produto A — R$ 89,90</li>
      <li>Produto B — R$ 60,10</li>
    </ul>
    <p class="total">Total: R$ 150,00</p>
  </div>
  <div class="retorno">
    <div class="banner sucesso" role="status">
      Pagamento aprovado!
    </div>
    <div class="instrucoes">
      <p>Você receberá um e-mail de confirmação em breve.</p>
    </div>
  </div>
</div>`,
        solutions: [
          '//div[@role="status"]',
          '//*[@role="status"]',
          '//div[@role="status" and contains(@class,"sucesso")]',
          '//div[contains(@class,"banner") and @role="status"]',
        ],
        hint: 'O banner tem um atributo <code>role</code> com valor semântico. Use <code>//div[@role="status"]</code>.',
        successMessage:
          'Ótimo! <code>role="status"</code> é o atributo semântico correto para banners de feedback — muito mais estável do que a classe CSS.',
      },
    ],
  },

  // ─── MISSÃO 2 ────────────────────────────────────────────────────────────
  {
    id: 2,
    title: "Operadores de Caminho",
    subtitle: "Domine /, //, ., .. e * para navegar a árvore",
    color: "#6929c4",
    icon: "⚡",
    xp: 150,
    difficulty: "iniciante",
    sections: [
      {
        type: "intro",
        content:
          "Agora que você entende a árvore, vamos aprender os <strong>operadores fundamentais</strong> do XPath. São os blocos básicos com os quais você vai construir qualquer expressão.",
      },
      {
        type: "concept-group",
        title: "🧰 Os 5 Operadores Fundamentais",
        content: "Cada operador define <em>como</em> você se move pela árvore:",
        concepts: [
          {
            operator: "/",
            name: "Caminho direto",
            color: "#6929c4",
            text: "Navega para um filho direto. Começa da raiz do documento quando usado no início.",
          },
          {
            operator: "//",
            name: "Qualquer nível",
            color: "#0f62fe",
            text: "Busca o elemento em qualquer profundidade abaixo do ponto atual. O mais usado.",
          },
          {
            operator: ".",
            name: "Elemento atual",
            color: "#005d5d",
            text: "Referencia o nó atual (contexto). Útil ao iniciar buscas a partir de um ponto específico.",
          },
          {
            operator: "..",
            name: "Elemento pai",
            color: "#9e1d4b",
            text: "Sobe um nível na árvore — vai para o pai do nó atual.",
          },
          {
            operator: "*",
            name: "Curinga de tag",
            color: "#0e6027",
            text: "Substitui qualquer nome de tag. //* seleciona todos os elementos do documento.",
          },
        ],
      },
      {
        type: "interactive",
        title: "/ vs // — Caminho absoluto vs relativo",
        description:
          "Use / para navegar passo a passo; use // para encontrar em qualquer profundidade.",
        html: `<html>
  <body>
    <div id="app">
      <form>
        <fieldset>
          <button type="submit">Enviar</button>
        </fieldset>
      </form>
      <div class="footer">
        <span>Versão 2.1</span>
      </div>
    </div>
  </body>
</html>`,
        examples: [
          { xpath: "/html/body/div", label: "/ caminho absoluto" },
          { xpath: "//button", label: "// busca em qualquer nível" },
          { xpath: "//div/span", label: "// + filho direto /" },
          { xpath: "//form//button", label: "// dentro de context" },
        ],
        defaultXPath: "//button",
      },
      {
        type: "interactive",
        title: ".. — Subindo para o pai",
        description:
          "Comece de um elemento e suba para o pai com .. Muito útil para acessar irmãos via ancestral comum.",
        html: `<div id="telaPrincipal">
  <div class="header">
    <h2>Seleção de débitos</h2>
    <span>Linhas de débito</span>
  </div>
  <div class="mensagens">
    <div role="alert" class="erro">CPF inválido</div>
  </div>
</div>`,
        examples: [
          { xpath: "//h2/..", label: ".. sobe ao pai de h2" },
          { xpath: "//h2/../span", label: ".. + pega irmão span" },
          { xpath: '//div[@role="alert"]/../..', label: ".. .. sobe 2 níveis" },
          { xpath: "//span/..", label: ".. pai do span" },
        ],
        defaultXPath: "//h2/../span",
      },
      {
        type: "interactive",
        title: "* — Curinga de qualquer tag",
        description:
          "Use * quando não importa a tag, só o atributo ou posição.",
        html: `<section id="login">
  <h2>Acesso ao sistema</h2>
  <p class="descricao">Informe seus dados</p>
</section>
<article id="destaques">
  <h3>Notícias</h3>
</article>
<div id="rodape">
  <span>© 2025</span>
</div>`,
        examples: [
          { xpath: '//*[@id="login"]', label: "* qualquer tag com id=login" },
          { xpath: "//*[@id]", label: "todos que têm id" },
          { xpath: '//*[@class="descricao"]', label: "* com class específica" },
          { xpath: "//section/*", label: "filhos diretos de section" },
        ],
        defaultXPath: '//*[@id="login"]',
      },
      {
        type: "challenge",
        title: "Desafio Final: Cargo do membro da equipe",
        description:
          'Na lista de membros da equipe, parta do nome <em>"Ana Beatriz"</em>, suba ao elemento pai com <code>..</code> e localize o <code>span</code> de <strong>cargo</strong> dela — sem usar índices de posição.',
        html: `<div class="equipe">
  <div class="card-membro">
    <span class="nome">Ana Beatriz</span>
    <span class="cargo">Desenvolvedora Sênior</span>
    <button class="btn-acao">Editar</button>
  </div>
  <div class="card-membro">
    <span class="nome">Carlos Mendez</span>
    <span class="cargo">Designer UX</span>
    <button class="btn-acao">Editar</button>
  </div>
</div>`,
        solutions: [
          '//span[@class="nome" and text()="Ana Beatriz"]/../span[@class="cargo"]',
          '//span[text()="Ana Beatriz"]/../span[@class="cargo"]',
          '//*[text()="Ana Beatriz"]/../span[@class="cargo"]',
        ],
        hint: 'Comece em <code>//span[text()="Ana Beatriz"]</code>, suba ao pai com <code>/..</code>, depois acesse <code>span[@class="cargo"]</code>.',
        successMessage:
          "Excelente! Navegar por parentesco é a técnica ideal quando o elemento-alvo não possui atributo único próprio.",
      },
    ],
  },

  // ─── MISSÃO 3 ────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "Predicados — O Poder do [ ]",
    subtitle: "Filtre elementos por atributo, posição e conteúdo descendente",
    color: "#005d5d",
    icon: "🎯",
    xp: 200,
    difficulty: "iniciante",
    sections: [
      {
        type: "intro",
        content:
          "Predicados são os <strong>filtros</strong> do XPath. Eles ficam entre colchetes <code>[ ]</code> e permitem refinar a busca para pegar exatamente o elemento certo — não todos da tag, só aquele que você quer.",
      },
      {
        type: "concept-group",
        title: "🔽 Tipos de predicado",
        content:
          "Você pode filtrar por atributo, por posição, ou por conteúdo descendente:",
        concepts: [
          {
            operator: "[@attr]",
            name: "Por atributo",
            color: "#005d5d",
            text: 'Filtra elementos que possuem um atributo com determinado valor: <code>//input[@type="text"]</code>',
          },
          {
            operator: "[n]",
            name: "Por posição",
            color: "#0f62fe",
            text: "Seleciona pelo índice (começa em 1): <code>//tr[3]</code> = terceira linha.",
          },
          {
            operator: "[last()]",
            name: "Último",
            color: "#6929c4",
            text: "<code>[last()]</code> seleciona o último elemento do conjunto.",
          },
          {
            operator: "[.//child]",
            name: "Por descendente",
            color: "#9e1d4b",
            text: 'Filtra um elemento verificando se ele contém certo descendente: <code>//div[.//span[text()="Total"]]</code>',
          },
        ],
      },
      {
        type: "interactive",
        title: "Filtrando por atributo e posição",
        description:
          "Um formulário com vários inputs e uma tabela. Use predicados para ser preciso.",
        html: `<form>
  <input type="text" name="usuario" placeholder="Usuário">
  <input type="password" name="senha" placeholder="Senha">
  <input type="email" name="email" placeholder="E-mail">
  <div class="grupo">Campo 1</div>
  <div class="grupo">Campo 2</div>
  <div class="grupo">Campo 3</div>
</form>
<table>
  <tr><td>Linha 1</td></tr>
  <tr><td>Linha 2</td></tr>
  <tr><td>Última linha</td></tr>
</table>`,
        examples: [
          { xpath: '//input[@type="text"]', label: "input do tipo texto" },
          { xpath: '//input[@type="password"]', label: "input do tipo senha" },
          { xpath: "//div[3]", label: "terceiro div.grupo" },
          { xpath: "//tr[last()]", label: "última linha da tabela" },
          { xpath: "//tr[1]", label: "primeira linha" },
        ],
        defaultXPath: '//input[@type="text"]',
      },
      {
        type: "interactive",
        title: "Predicado com descendente — contexto preciso",
        description:
          "Filtre um container inteiro pela presença de um descendente. Padrão avançado, muito usado na prática.",
        html: `<div class="painel">
  <span class="titulo">Contas a pagar</span>
  <table>
    <tr><td>Fornecedor A</td><td>R$ 500,00</td></tr>
    <tr><td>Fornecedor B</td><td>R$ 300,00</td></tr>
  </table>
</div>
<div class="painel">
  <span class="titulo">Contas a receber</span>
  <table>
    <tr><td>Cliente X</td><td>R$ 1.200,00</td></tr>
  </table>
</div>`,
        examples: [
          {
            xpath: '//div[.//span[text()="Contas a pagar"]]//tr/td',
            label: 'TDs do painel "Contas a pagar"',
          },
          {
            xpath: '//div[.//span[text()="Contas a receber"]]//tr/td',
            label: 'TDs do painel "Contas a receber"',
          },
          {
            xpath: '//div[.//span[contains(text(),"pagar")]]',
            label: 'O painel que contém "pagar"',
          },
          { xpath: "//div//tr", label: "Todas as linhas (sem filtro)" },
        ],
        defaultXPath: '//div[.//span[text()="Contas a pagar"]]//tr/td',
      },
      {
        type: "interactive",
        title: "Predicado em listas — outro exemplo prático",
        description:
          "Selecione itens de uma section específica usando o título como âncora.",
        html: `<section id="usuarios">
  <h3>Usuários ativos</h3>
  <ul>
    <li class="item">Ana</li>
    <li class="item">Bruno</li>
    <li class="item">Carlos</li>
  </ul>
</section>
<section id="grupos">
  <h3>Grupos de acesso</h3>
  <ul>
    <li class="item">Admin</li>
    <li class="item">Viewer</li>
  </ul>
</section>`,
        examples: [
          {
            xpath: '//section[.//h3[text()="Usuários ativos"]]//li',
            label: "li da section de usuários",
          },
          {
            xpath: '//section[.//h3[text()="Grupos de acesso"]]//li',
            label: "li da section de grupos",
          },
          {
            xpath:
              '//section[.//h3[contains(text(),"ativos")]]//li[@class="item"]',
            label: "com contains() + @class",
          },
          { xpath: "//li[last()]", label: "último li de cada ul" },
        ],
        defaultXPath: '//section[.//h3[text()="Usuários ativos"]]//li',
      },
      {
        type: "challenge",
        title: "Desafio Final: Respostas da seção certa",
        description:
          'Na central de ajuda abaixo há três seções de perguntas frequentes. Encontre apenas os parágrafos <code>p.resposta</code> da seção <em>"Dúvidas sobre pagamento"</em> — as outras seções não devem ser incluídas.',
        html: `<div class="faq">
  <div class="secao">
    <h4>Dúvidas sobre entrega</h4>
    <p class="resposta">O prazo de entrega é de 5 a 7 dias úteis.</p>
    <p class="resposta">Entregamos para todo o Brasil.</p>
  </div>
  <div class="secao">
    <h4>Dúvidas sobre pagamento</h4>
    <p class="resposta">Aceitamos cartão, boleto e Pix.</p>
    <p class="resposta">O parcelamento é em até 12x sem juros.</p>
  </div>
  <div class="secao">
    <h4>Dúvidas sobre devolução</h4>
    <p class="resposta">A devolução pode ser feita em até 30 dias.</p>
  </div>
</div>`,
        solutions: [
          '//div[.//h4[text()="Dúvidas sobre pagamento"]]//p[@class="resposta"]',
          '//div[.//h4[text()="Dúvidas sobre pagamento"]]//p',
          '//div[.//h4[contains(text(),"pagamento")]]//p[@class="resposta"]',
          '//div[.//h4[contains(text(),"pagamento")]]//p',
        ],
        hint: 'Use o predicado de descendente: <code>//div[.//h4[text()="Dúvidas sobre pagamento"]]//p</code>. O predicado <code>[.//h4[...]]</code> filtra pelo título da seção.',
        successMessage:
          "Perfeito! Filtrar pelo título descendente para isolar o container correto é fundamental em páginas com seções repetidas.",
      },
    ],
  },

  // ─── MISSÃO 4 ────────────────────────────────────────────────────────────
  {
    id: 4,
    title: "Atributos HTML",
    subtitle: "Identifique e use id, class, name, role, data-* e mais",
    color: "#0e6027",
    icon: "🔍",
    xp: 200,
    difficulty: "intermediario",
    sections: [
      {
        type: "intro",
        content:
          "Atributos são a <strong>impressão digital</strong> dos elementos HTML. Aprender a ler e usar os atributos certos é o segredo para XPaths estáveis. Alguns são únicos (como <code>id</code>), outros precisam de verificação parcial (como <code>class</code>).",
      },
      {
        type: "concept-group",
        title: "📋 Atributos mais usados em automação",
        content:
          "Prioridade recomendada: <strong>id > name > data-* > role > aria-label > class > text</strong>",
        concepts: [
          {
            operator: "@id",
            name: "Identificador único",
            color: "#0e6027",
            text: 'O mais estável. Se existe e é único, use-o: <code>//input[@id="cpf"]</code>',
          },
          {
            operator: "@name",
            name: "Nome do campo",
            color: "#0f62fe",
            text: 'Muito usado em formulários. Geralmente estável: <code>//input[@name="documento"]</code>',
          },
          {
            operator: "@type",
            name: "Tipo do elemento",
            color: "#6929c4",
            text: 'Diferencia inputs: <code>//input[@type="submit"]</code>',
          },
          {
            operator: "@class",
            name: "Classe CSS",
            color: "#9e1d4b",
            text: 'Cuidado: classes podem ser múltiplas ou dinâmicas. Prefira <code>contains(@class,"nome")</code>',
          },
          {
            operator: "@role",
            name: "Papel semântico",
            color: "#005d5d",
            text: 'Excelente para acessibilidade/automação: <code>//div[@role="alert"]</code>',
          },
          {
            operator: "@data-*",
            name: "Atributos customizados",
            color: "#0e6027",
            text: 'Estáveis por serem definidos para automação: <code>//button[@data-testid="btn-salvar"]</code>',
          },
          {
            operator: "@aria-label",
            name: "Label acessível",
            color: "#ff832b",
            text: 'Bom para elementos sem texto visível: <code>//button[@aria-label="Fechar"]</code>',
          },
        ],
      },
      {
        type: "interactive",
        title: "Formulário completo — todos os atributos",
        description:
          "Um formulário real com id, name, type, placeholder, disabled e aria-label. Explore cada atributo.",
        html: `<form id="cadastro-cliente">
  <div class="grupo">
    <label>CPF</label>
    <input id="cpf" type="text" name="documento" placeholder="000.000.000-00">
  </div>
  <div class="grupo">
    <label>E-mail</label>
    <input id="email" type="email" name="email" placeholder="seu@email.com">
  </div>
  <div class="grupo">
    <label>Estado</label>
    <input id="estado" type="text" name="estado" disabled placeholder="Desabilitado">
  </div>
  <div class="grupo">
    <input id="aceite" type="checkbox" name="aceite">
    <label for="aceite">Aceito os termos</label>
  </div>
  <button type="submit" data-testid="btn-salvar" aria-label="Salvar cadastro">Salvar</button>
  <button type="button" data-testid="btn-cancelar">Cancelar</button>
</form>`,
        examples: [
          { xpath: '//input[@id="cpf"]', label: "@id — mais estável" },
          { xpath: '//input[@name="documento"]', label: "@name do campo CPF" },
          { xpath: '//input[@type="email"]', label: "@type email" },
          {
            xpath: "//input[@disabled]",
            label: "@disabled — campo desabilitado",
          },
          {
            xpath: '//button[@data-testid="btn-salvar"]',
            label: "@data-testid",
          },
          {
            xpath: '//button[@aria-label="Salvar cadastro"]',
            label: "@aria-label",
          },
          { xpath: '//input[@type="checkbox"]', label: "checkbox por @type" },
        ],
        defaultXPath: '//input[@id="cpf"]',
      },
      {
        type: "interactive",
        title: "Imagens, links e ícones — @src, @href, @alt",
        description:
          "Elementos de mídia e navegação também têm seus atributos característicos.",
        html: `<nav class="menu">
  <a href="/home" class="nav-link ativo">Home</a>
  <a href="/relatorios" class="nav-link">Relatórios</a>
  <a href="/configuracoes" class="nav-link">Configurações</a>
</nav>
<div class="conteudo">
  <img src="logo.png" alt="Logo da empresa" class="logo">
  <img src="avatar.jpg" alt="Foto do usuário">
</div>`,
        examples: [
          { xpath: '//a[@href="/home"]', label: "link por @href exato" },
          {
            xpath: '//a[contains(@href,"relatorio")]',
            label: "link href parcial",
          },
          { xpath: '//img[@alt="Logo da empresa"]', label: "imagem por @alt" },
          { xpath: '//img[@src="logo.png"]', label: "imagem por @src" },
          {
            xpath: '//a[contains(@class,"ativo")]',
            label: "link ativo por @class parcial",
          },
        ],
        defaultXPath: '//a[@href="/home"]',
      },
      {
        type: "challenge",
        title: "Desafio Final: Link ativo na navegação lateral",
        description:
          "Na barra lateral abaixo, localize o <code>span.label</code> do link que está <strong>atualmente ativo</strong>. O link ativo usa um atributo de acessibilidade padrão — não uma classe dinâmica.",
        html: `<aside class="sidebar">
  <nav aria-label="Menu principal">
    <ul>
      <li>
        <a href="/inicio" class="nav-link">
          <span class="label">Início</span>
        </a>
      </li>
      <li>
        <a href="/pedidos" class="nav-link" aria-current="page">
          <span class="label">Pedidos</span>
        </a>
      </li>
      <li>
        <a href="/config" class="nav-link">
          <span class="label">Configurações</span>
        </a>
      </li>
    </ul>
  </nav>
</aside>`,
        solutions: [
          '//a[@aria-current="page"]/span[@class="label"]',
          '//a[@aria-current="page"]/span',
          '//*[@aria-current="page"]/span[@class="label"]',
          '//*[@aria-current="page"]/span',
        ],
        hint: 'Encontre o link com <code>//a[@aria-current="page"]</code> e depois desça ao filho <code>/span[@class="label"]</code>.',
        successMessage:
          'Ótimo! <code>aria-current="page"</code> é o atributo semântico padrão para o item ativo — muito mais estável do que classes como "ativo" ou "selected".',
      },
    ],
  },

  // ─── MISSÃO 5 ────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Operadores Lógicos",
    subtitle: "Combine condições com and, or e not()",
    color: "#b12424",
    icon: "⚙️",
    xp: 250,
    difficulty: "intermediario",
    sections: [
      {
        type: "intro",
        content:
          "Às vezes um atributo não é suficiente para identificar o elemento. Com <strong>operadores lógicos</strong>, você combina múltiplas condições para criar XPaths cirúrgicos.",
      },
      {
        type: "concept-group",
        title: "🔗 Os três operadores lógicos",
        concepts: [
          {
            operator: "and",
            name: "E (todas as condições)",
            color: "#b12424",
            text: 'Ambas as condições devem ser verdadeiras: <code>//input[@type="text" and @name="cpf"]</code>',
          },
          {
            operator: "or",
            name: "OU (alguma condição)",
            color: "#ff832b",
            text: 'Ao menos uma deve ser verdadeira: <code>//button[@id="ok" or @id="confirmar"]</code>',
          },
          {
            operator: "not()",
            name: "NÃO (negação)",
            color: "#6929c4",
            text: "Inverte a condição: <code>//input[not(@disabled)]</code> — apenas inputs habilitados.",
          },
        ],
      },
      {
        type: "interactive",
        title: "and — Ambas as condições",
        description:
          "Use and quando você precisa que o elemento satisfaça todas as condições.",
        html: `<form>
  <input type="text" name="cpf" placeholder="CPF">
  <input type="email" name="cpf" placeholder="E-mail (campo cpf errado)">
  <input type="text" name="nome" placeholder="Nome">
  <input type="text" name="cidade" placeholder="Cidade" disabled>
</form>`,
        examples: [
          {
            xpath: '//input[@type="text" and @name="cpf"]',
            label: "text E name=cpf",
          },
          {
            xpath: '//input[@type="text" and not(@disabled)]',
            label: "text E não desabilitado",
          },
          {
            xpath: '//input[@type="text" and @name="nome"]',
            label: "text E name=nome",
          },
        ],
        defaultXPath: '//input[@type="text" and @name="cpf"]',
      },
      {
        type: "interactive",
        title: "or — Pelo menos uma condição",
        description: "Use or quando o elemento pode ter um ou outro valor.",
        html: `<div class="barra-acoes">
  <button id="salvar">Salvar</button>
  <button id="cancelar">Cancelar</button>
  <button id="confirmar">Confirmar</button>
  <button id="voltar">Voltar</button>
</div>`,
        examples: [
          {
            xpath: '//button[@id="salvar" or @id="confirmar"]',
            label: "salvar OU confirmar",
          },
          {
            xpath: '//button[@id="cancelar" or @id="voltar"]',
            label: "cancelar OU voltar",
          },
          {
            xpath:
              '//button[@id="salvar" or @id="cancelar" or @id="confirmar"]',
            label: "três opções com or",
          },
        ],
        defaultXPath: '//button[@id="salvar" or @id="confirmar"]',
      },
      {
        type: "interactive",
        title: "not() — Exclusão por condição",
        description:
          "Exclua elementos que satisfazem uma condição. Muito útil para filtrar desabilitados, ocultos, etc.",
        html: `<form>
  <input type="text" name="nome" placeholder="Nome">
  <input type="text" name="cidade" placeholder="Cidade" disabled>
  <input type="text" name="estado" placeholder="Estado" disabled>
  <input type="text" name="cep" placeholder="CEP">
  <input type="hidden" name="token" value="abc123">
</form>`,
        examples: [
          {
            xpath: "//input[not(@disabled)]",
            label: "inputs não desabilitados",
          },
          {
            xpath: '//input[not(@type="hidden")]',
            label: "excluir tipo hidden",
          },
          {
            xpath: '//input[not(@disabled) and not(@type="hidden")]',
            label: "visíveis e habilitados",
          },
          {
            xpath: '//input[@type="text" and not(@disabled)]',
            label: "text não desabilitado",
          },
        ],
        defaultXPath: "//input[not(@disabled)]",
      },
      {
        type: "challenge",
        title: "Desafio Final: Produtos disponíveis no catálogo",
        description:
          "No catálogo abaixo, selecione todos os <code>div.produto</code> que <strong>não estão esgotados</strong> — ou seja, os que o cliente ainda pode comprar. Use <code>not()</code> para excluir pelo atributo de status.",
        html: `<div class="catalogo">
  <div class="produto" data-status="em-estoque">
    <h3>Notebook Pro</h3>
    <span class="preco">R$ 3.500,00</span>
  </div>
  <div class="produto" data-status="esgotado">
    <h3>Tablet X</h3>
    <span class="preco">R$ 1.200,00</span>
  </div>
  <div class="produto" data-status="sob-encomenda">
    <h3>Teclado Mecânico</h3>
    <span class="preco">R$ 450,00</span>
  </div>
  <div class="produto" data-status="em-estoque">
    <h3>Mouse Gamer</h3>
    <span class="preco">R$ 280,00</span>
  </div>
</div>`,
        solutions: [
          '//div[@class="produto" and not(@data-status="esgotado")]',
          '//div[not(@data-status="esgotado") and @class="produto"]',
          '//div[@data-status="em-estoque" or @data-status="sob-encomenda"]',
          '//div[@class="produto"][not(@data-status="esgotado")]',
        ],
        hint: 'Use <code>not(@data-status="esgotado")</code> combinado com <code>@class="produto"</code>. Ou use <code>or</code> para listar os status válidos.',
        successMessage:
          "Perfeito! Usar <code>not()</code> com data-attributes é uma técnica muito comum para filtrar estados de UI em automação.",
      },
    ],
  },

  // ─── MISSÃO 6 ────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "Arsenal de Funções",
    subtitle:
      "text(), contains(), starts-with(), normalize-space(), last(), count() e mais",
    color: "#ff832b",
    icon: "🔧",
    xp: 300,
    difficulty: "intermediario",
    sections: [
      {
        type: "intro",
        content:
          "As funções XPath são <strong>ferramentas de precisão</strong>. Elas permitem comparar textos, pegar posições, contar elementos e tratar espaços. Dominar essas funções eleva seu XPath a outro nível.",
      },
      {
        type: "concept-group",
        title: "⚙️ Funções essenciais",
        concepts: [
          {
            operator: "text()",
            name: "Texto direto",
            color: "#ff832b",
            text: 'Seleciona o texto direto do elemento: <code>//button[text()="Salvar"]</code>',
          },
          {
            operator: "contains()",
            name: "Contém trecho",
            color: "#0f62fe",
            text: 'Verifica se um string contém outro: <code>//div[contains(@class,"erro")]</code>',
          },
          {
            operator: "starts-with()",
            name: "Começa com",
            color: "#6929c4",
            text: 'Verifica o início: <code>//input[starts-with(@id,"user_")]</code>',
          },
          {
            operator: "normalize-space()",
            name: "Remove espaços extras",
            color: "#005d5d",
            text: 'Resolve textos com espaços/quebras de linha: <code>//button[normalize-space()="Salvar"]</code>',
          },
          {
            operator: "last()",
            name: "Último elemento",
            color: "#9e1d4b",
            text: "Retorna o último do conjunto: <code>//tr[last()]</code>",
          },
          {
            operator: "position()",
            name: "Posição atual",
            color: "#b12424",
            text: "Índice do elemento no conjunto: <code>//tr[position()=2]</code>",
          },
          {
            operator: "count()",
            name: "Conta nós",
            color: "#0e6027",
            text: "Retorna um número: <code>count(//tr)</code> → 3",
          },
          {
            operator: "string()",
            name: "Texto incluindo filhos",
            color: "#ff832b",
            text: "Concatena todo o texto do elemento e descendentes: <code>string(//p)</code>",
          },
        ],
      },
      {
        type: "interactive",
        title: "text() vs contains() — texto exato vs parcial",
        description:
          "text() exige o texto completo; contains() aceita um trecho. Saiba quando usar cada um.",
        html: `<div>
  <button>Salvar</button>
  <button>Cancelar</button>
  <button>Salvar e continuar</button>
</div>
<div class="alerta erro">CPF inválido</div>
<div class="alerta aviso">Campo obrigatório</div>
<span>Operação realizada com Sucesso</span>`,
        examples: [
          { xpath: '//button[text()="Salvar"]', label: "text() exato" },
          {
            xpath: '//button[contains(text(),"Salvar")]',
            label: 'contains() — todos com "Salvar"',
          },
          {
            xpath: '//div[contains(@class,"erro")]',
            label: "contains() em @class",
          },
          {
            xpath: '//span[contains(text(),"Sucesso")]',
            label: "contains() no texto",
          },
          {
            xpath: '//div[contains(@class,"alerta")]',
            label: "divs com class alerta",
          },
        ],
        defaultXPath: '//button[text()="Salvar"]',
      },
      {
        type: "interactive",
        title: "starts-with() e normalize-space()",
        description:
          "starts-with() é ótimo para IDs com prefixo. normalize-space() resolve o HTML mal formatado.",
        html: `<form>
  <input id="user_nome" type="text" placeholder="Nome">
  <input id="user_email" type="email" placeholder="E-mail">
  <input id="empresa_cnpj" type="text" placeholder="CNPJ">
  <button>
    Salvar
  </button>
  <button>Cancelar</button>
</form>`,
        examples: [
          {
            xpath: '//input[starts-with(@id,"user_")]',
            label: "IDs que começam com user_",
          },
          {
            xpath: '//input[starts-with(@id,"empresa_")]',
            label: "IDs que começam com empresa_",
          },
          {
            xpath: '//button[normalize-space()="Salvar"]',
            label: "normalize-space() ignora espaços",
          },
          {
            xpath: '//button[text()="Salvar"]',
            label: "text() exato (falha com espaços!)",
          },
        ],
        defaultXPath: '//input[starts-with(@id,"user_")]',
      },
      {
        type: "interactive",
        title: "last(), position() e count()",
        description:
          "Funções para trabalhar com posições e contagens em conjuntos de nós.",
        html: `<table>
  <thead>
    <tr><th>Nome</th><th>Valor</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Item A</td><td>R$ 100</td><td>Ativo</td></tr>
    <tr><td>Item B</td><td>R$ 200</td><td>Inativo</td></tr>
    <tr><td>Item C</td><td>R$ 300</td><td>Ativo</td></tr>
  </tbody>
</table>`,
        examples: [
          { xpath: "//tbody/tr[last()]", label: "última linha do tbody" },
          { xpath: "//tbody/tr[1]", label: "primeira linha do tbody" },
          {
            xpath: "//tbody/tr[position()=2]",
            label: "segunda linha (position)",
          },
          { xpath: "count(//tbody/tr)", label: "count() — retorna 3" },
          {
            xpath: "//tbody/tr[last()]/td[1]",
            label: "primeira célula da última linha",
          },
        ],
        defaultXPath: "//tbody/tr[last()]",
      },
      {
        type: "challenge",
        title: "Desafio Final: Todos os campos de notificação",
        description:
          "No formulário de configurações abaixo, localize todos os <code>input</code> do grupo de notificações. Eles seguem uma convenção de nomenclatura com prefixo <code>notif_</code> no atributo <code>id</code>. Use <code>starts-with()</code> para capturar o grupo inteiro de uma só vez.",
        html: `<form class="configuracoes">
  <fieldset>
    <legend>Notificações</legend>
    <input type="checkbox" id="notif_pedido" name="notif_pedido">
    <label for="notif_pedido">Novos pedidos</label>
    <input type="checkbox" id="notif_promo" name="notif_promo">
    <label for="notif_promo">Promoções</label>
    <input type="checkbox" id="notif_sistema" name="notif_sistema">
    <label for="notif_sistema">Atualizações do sistema</label>
  </fieldset>
  <fieldset>
    <legend>Privacidade</legend>
    <input type="checkbox" id="priv_dados" name="priv_dados">
    <label for="priv_dados">Compartilhar dados analíticos</label>
    <input type="checkbox" id="priv_marketing" name="priv_marketing">
    <label for="priv_marketing">Receber comunicações</label>
  </fieldset>
</form>`,
        solutions: [
          '//input[starts-with(@id,"notif_")]',
          '//input[starts-with(@name,"notif_")]',
          '//input[@type="checkbox" and starts-with(@id,"notif_")]',
        ],
        hint: 'Use <code>//input[starts-with(@id,"notif_")]</code> — captura todos os checkboxes cujo <code>id</code> começa com "notif_".',
        successMessage:
          "Ótimo! <code>starts-with()</code> é ideal para sistemas com convenções de nomenclatura — você captura todo o grupo com uma única expressão.",
      },
    ],
  },

  // ─── MISSÃO 7 ────────────────────────────────────────────────────────────
  {
    id: 7,
    title: "Navegação por Parentesco",
    subtitle:
      "parent, child, ancestor, descendant, following-sibling e axes avançados",
    color: "#9e1d4b",
    icon: "🧭",
    xp: 350,
    difficulty: "avancado",
    sections: [
      {
        type: "intro",
        content:
          "Os <strong>axes (eixos)</strong> do XPath permitem navegar em qualquer direção da árvore: para cima (ancestor), para baixo (descendant), para o lado (sibling). É a técnica mais poderosa para localizar elementos por contexto relativo.",
      },
      {
        type: "concept-group",
        title: "🧭 Os Axes mais usados",
        concepts: [
          {
            operator: "following-sibling::",
            name: "Irmão seguinte",
            color: "#9e1d4b",
            text: "<code>//label/following-sibling::input</code> — o input que vem depois do label no mesmo pai.",
          },
          {
            operator: "preceding-sibling::",
            name: "Irmão anterior",
            color: "#b12424",
            text: "<code>//input/preceding-sibling::label</code> — o label antes do input.",
          },
          {
            operator: "parent::",
            name: "Pai direto",
            color: "#6929c4",
            text: "<code>//span/parent::div</code> — o div pai do span. Similar a <code>..</code> mas mais explícito.",
          },
          {
            operator: "ancestor::",
            name: "Qualquer ancestral",
            color: "#0f62fe",
            text: "<code>//input/ancestor::form</code> — sobe quantos níveis forem necessários até o form.",
          },
          {
            operator: "descendant::",
            name: "Qualquer descendente",
            color: "#005d5d",
            text: "<code>//div/descendant::button</code> — todos os botões dentro do div, em qualquer nível.",
          },
          {
            operator: "following::",
            name: "Qualquer nó seguinte",
            color: "#0e6027",
            text: "Todos os nós que vêm depois no documento (diferente de sibling — não precisa ser irmão).",
          },
          {
            operator: "self::",
            name: "O próprio nó",
            color: "#ff832b",
            text: "<code>self::div</code> — referencia o nó atual se for um div.",
          },
        ],
      },
      {
        type: "interactive",
        title: "following-sibling e preceding-sibling",
        description:
          "O par mais usado em automação: encontrar o input pelo label, ou o label pelo input.",
        html: `<form>
  <div class="campo">
    <label for="cpf">CPF</label>
    <input id="cpf" type="text" name="cpf">
  </div>
  <div class="campo">
    <label for="nome">Nome completo</label>
    <input id="nome" type="text" name="nome">
  </div>
  <div class="campo">
    <label for="email">E-mail</label>
    <input id="email" type="email" name="email">
  </div>
</form>`,
        examples: [
          {
            xpath: '//label[text()="CPF"]/following-sibling::input',
            label: "input após o label CPF",
          },
          {
            xpath: '//input[@id="nome"]/preceding-sibling::label',
            label: "label antes do input nome",
          },
          {
            xpath: '//label[text()="E-mail"]/following-sibling::input',
            label: "input após label E-mail",
          },
          {
            xpath: "//label/following-sibling::input",
            label: "todos os inputs com label antes",
          },
        ],
        defaultXPath: '//label[text()="CPF"]/following-sibling::input',
      },
      {
        type: "interactive",
        title: "ancestor:: — Suba quantos níveis precisar",
        description:
          "ancestor:: sobe a árvore até encontrar um ancestral do tipo especificado, independentemente da profundidade.",
        html: `<form id="form-pedido">
  <fieldset>
    <legend>Dados do pedido</legend>
    <div class="linha">
      <div class="col">
        <input type="text" name="produto" placeholder="Produto">
      </div>
    </div>
  </fieldset>
</form>`,
        examples: [
          { xpath: "//input/ancestor::form", label: "ancestor::form do input" },
          {
            xpath: "//input/ancestor::fieldset",
            label: "ancestor::fieldset do input",
          },
          {
            xpath: '//input/ancestor::div[@class="col"]',
            label: "ancestor div.col",
          },
          { xpath: "//input/ancestor::div", label: "todos os divs ancestrais" },
        ],
        defaultXPath: "//input/ancestor::form",
      },
      {
        type: "interactive",
        title: "td[text()]/following-sibling::td — Padrão clássico de tabela",
        description:
          "Em tabelas, você frequentemente sabe o rótulo de uma célula e precisa do valor ao lado.",
        html: `<table>
  <tr>
    <td class="label">CPF</td>
    <td class="valor">123.456.789-00</td>
  </tr>
  <tr>
    <td class="label">Nome</td>
    <td class="valor">Maria Souza</td>
  </tr>
  <tr>
    <td class="label">E-mail</td>
    <td class="valor">maria@email.com</td>
  </tr>
</table>`,
        examples: [
          {
            xpath: '//td[text()="CPF"]/following-sibling::td',
            label: "valor do CPF",
          },
          {
            xpath: '//td[text()="Nome"]/following-sibling::td',
            label: "valor do Nome",
          },
          {
            xpath: '//td[text()="E-mail"]/following-sibling::td',
            label: "valor do E-mail",
          },
          {
            xpath: '//td[@class="label"]/following-sibling::td',
            label: "todos os valores",
          },
        ],
        defaultXPath: '//td[text()="CPF"]/following-sibling::td',
      },
      {
        type: "challenge",
        title: "Desafio Final: Horário da ação no log de auditoria",
        description:
          'No log de auditoria abaixo, encontre o <code>span.hora</code> da entrada onde a ação foi <em>"Usuário bloqueado"</em>. Parta da <code>span.acao</code> e navegue até o horário usando <code>preceding-sibling</code> ou o elemento pai.',
        html: `<ul class="log-auditoria">
  <li class="entrada">
    <span class="hora">09:12</span>
    <span class="usuario">admin@empresa.com</span>
    <span class="acao">Login realizado</span>
  </li>
  <li class="entrada">
    <span class="hora">09:45</span>
    <span class="usuario">carlos@empresa.com</span>
    <span class="acao">Arquivo exportado</span>
  </li>
  <li class="entrada">
    <span class="hora">10:02</span>
    <span class="usuario">admin@empresa.com</span>
    <span class="acao">Usuário bloqueado</span>
  </li>
</ul>`,
        solutions: [
          '//span[@class="acao" and text()="Usuário bloqueado"]/preceding-sibling::span[@class="hora"]',
          '//span[text()="Usuário bloqueado"]/preceding-sibling::span[@class="hora"]',
          '//li[.//span[text()="Usuário bloqueado"]]/span[@class="hora"]',
          '//span[text()="Usuário bloqueado"]/../span[@class="hora"]',
        ],
        hint: 'Comece na <code>span.acao</code> com texto "Usuário bloqueado" e use <code>preceding-sibling::span[@class="hora"]</code> para chegar ao horário na mesma entrada.',
        successMessage:
          "Excelente! <code>preceding-sibling</code> é perfeito para navegar de volta na mesma linha ou lista — padrão clássico em logs e tabelas de auditoria.",
      },
    ],
  },

  // ─── MISSÃO 8 ────────────────────────────────────────────────────────────
  {
    id: 8,
    title: "XPath Profissional",
    subtitle: "Estratégia, armadilhas reais e desafios combinados",
    color: "#f1c21b",
    icon: "🏆",
    xp: 500,
    difficulty: "elite",
    sections: [
      {
        type: "intro",
        content:
          "Você chegou à <strong>missão elite</strong>. Aqui você aprende a <em>pensar como um engenheiro de automação</em>: prioridade de seletores, o que evitar, diagnóstico de falhas, e como criar XPaths que resistem ao tempo.",
      },
      {
        type: "concept-group",
        title: "🎖️ A regra de ouro da prioridade",
        content:
          "Quando vários atributos estão disponíveis, escolha pela ordem de estabilidade:",
        concepts: [
          {
            operator: "1°",
            name: "@id único",
            color: "#f1c21b",
            text: 'O mais estável. Se existe e é único, use: <code>//input[@id="cpf"]</code>',
          },
          {
            operator: "2°",
            name: "@data-* e @name",
            color: "#f1c21b",
            text: "Atributos funcionais, raramente mudam. Ideais para automação.",
          },
          {
            operator: "3°",
            name: "@role e @aria-*",
            color: "#f1c21b",
            text: "Atributos semânticos/acessibilidade. Mudam apenas quando a função muda.",
          },
          {
            operator: "4°",
            name: "Texto visível",
            color: "#f1c21b",
            text: "Bom para botões. Muda com i18n, mas é legível. Use normalize-space().",
          },
          {
            operator: "5°",
            name: "Contexto próximo",
            color: "#f1c21b",
            text: "Localiza pelo vizinho/pai. Quando não há atributo, use o label ao lado.",
          },
          {
            operator: "❌",
            name: "Posição absoluta",
            color: "#ff8389",
            text: "Nunca use como primeira opção: <code>//div[7]/span[2]</code> quebra com qualquer mudança de layout.",
          },
        ],
      },
      {
        type: "concept-group",
        title: "⚠️ O que EVITAR",
        content:
          "Esses padrões existem em todo código legado. Aprenda a reconhecê-los:",
        concepts: [
          {
            operator: "❌",
            name: "Índices desnecessários",
            color: "#ff8389",
            text: "<code>//div[7]/span[2]</code> — quebra ao inserir qualquer elemento novo na página.",
          },
          {
            operator: "❌",
            name: "Classes dinâmicas completas",
            color: "#ff8389",
            text: '<code>//div[@class="xkf23-a9 temp-12"]</code> — classes geradas por build mudam a cada deploy. Use contains().',
          },
          {
            operator: "❌",
            name: "Caminho absoluto longo",
            color: "#ff8389",
            text: "<code>/html/body/div/div/div/div[2]/span</code> — frágil e ilegível.",
          },
        ],
      },
      {
        type: "interactive",
        title: "Exemplos do mundo real — cenários comuns",
        description:
          "XPaths completos para situações reais. Inspecione os elementos na aba Preview com F12 para comparar.",
        html: `<div id="sistema">
  <header>
    <nav>
      <a href="/home">Início</a>
      <a href="/relatorios" class="ativo">Relatórios</a>
    </nav>
    <div class="usuario-info">
      <span class="nome">João Silva</span>
      <button aria-label="Sair do sistema" data-testid="btn-logout">Sair</button>
    </div>
  </header>
  <main>
    <form id="form-busca" role="search">
      <label for="busca">Buscar</label>
      <input id="busca" type="search" placeholder="Digite para buscar..." aria-label="Campo de busca">
      <button type="submit">Buscar</button>
    </form>
    <section aria-label="Resultados">
      <table>
        <thead><tr><th>ID</th><th>Nome</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>001</td><td>Produto A</td><td class="status ativo">Ativo</td></tr>
          <tr><td>002</td><td>Produto B</td><td class="status inativo">Inativo</td></tr>
        </tbody>
      </table>
    </section>
  </main>
</div>`,
        examples: [
          {
            xpath: '//button[@aria-label="Sair do sistema"]',
            label: "Botão logout por aria-label",
          },
          {
            xpath: '//a[@href="/relatorios" and contains(@class,"ativo")]',
            label: "Link ativo na nav",
          },
          {
            xpath: '//form[@role="search"]//input',
            label: "Input dentro do form de busca",
          },
          {
            xpath: '//td[contains(@class,"ativo")]',
            label: "Células com status ativo",
          },
          {
            xpath: '//section[@aria-label="Resultados"]//tbody/tr[last()]',
            label: "Última linha de resultados",
          },
          {
            xpath: '//label[text()="Buscar"]/following-sibling::input',
            label: "Input pelo label adjacente",
          },
        ],
        defaultXPath: '//button[@data-testid="btn-logout"]',
      },
      {
        type: "interactive",
        title: "🔥 Diagnóstico — Quando o XPath falha",
        description:
          "Teste esses XPaths problemáticos e entenda por que cada um falha ou retorna resultados inesperados.",
        html: `<div class="container">
  <div class="alerta error-msg" role="alert">Erro de validação</div>
  <button class="btn-primary">  Salvar  </button>
  <input type="text" id="cpf-usuario" placeholder="CPF">
</div>`,
        examples: [
          {
            xpath: '//div[@class="error-msg"]',
            label: "❌ class incompleta (vai falhar)",
          },
          {
            xpath: '//div[contains(@class,"error-msg")]',
            label: "✅ class parcial (funciona)",
          },
          {
            xpath: '//button[text()="Salvar"]',
            label: "❌ text() com espaços (vai falhar)",
          },
          {
            xpath: '//button[normalize-space()="Salvar"]',
            label: "✅ normalize-space() (funciona)",
          },
          {
            xpath: '//input[@id="cpf"]',
            label: "❌ id incompleto (vai falhar)",
          },
          {
            xpath: '//input[@id="cpf-usuario"]',
            label: "✅ id completo (funciona)",
          },
        ],
        defaultXPath: '//div[@class="error-msg"]',
      },
      {
        type: "challenge",
        title: "Missão Elite: Aprovação cirúrgica na fila de transferências",
        description:
          'No portal de aprovações abaixo há duas transferências pendentes, cada uma com botões "Aprovar" e "Rejeitar". Localize o botão <strong>"Aprovar"</strong> especificamente da transferência <em>TRF-002 (Parceiro Beta)</em> — sem capturar o da TRF-001.',
        html: `<main class="portal">
  <section aria-label="Transferências pendentes">
    <table>
      <thead>
        <tr><th>ID</th><th>Beneficiário</th><th>Valor</th><th>Ações</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>TRF-001</td>
          <td>Fornecedor Alfa</td>
          <td>R$ 5.000,00</td>
          <td>
            <button type="button" data-action="aprovar" data-id="TRF-001">Aprovar</button>
            <button type="button" data-action="rejeitar" data-id="TRF-001">Rejeitar</button>
          </td>
        </tr>
        <tr>
          <td>TRF-002</td>
          <td>Parceiro Beta</td>
          <td>R$ 1.200,00</td>
          <td>
            <button type="button" data-action="aprovar" data-id="TRF-002">Aprovar</button>
            <button type="button" data-action="rejeitar" data-id="TRF-002">Rejeitar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</main>`,
        solutions: [
          '//button[@data-action="aprovar" and @data-id="TRF-002"]',
          '//tr[.//td[text()="TRF-002"]]//button[@data-action="aprovar"]',
          '//td[text()="TRF-002"]/following-sibling::td//button[@data-action="aprovar"]',
          '//tr[.//td[text()="Parceiro Beta"]]//button[@data-action="aprovar"]',
        ],
        hint: 'Você tem três caminhos: <code>@data-id="TRF-002"</code> direto no botão, predicado de descendente <code>//tr[.//td[text()="TRF-002"]]//button[...]</code>, ou <code>following-sibling::td//button[...]</code> partindo da célula ID.',
        successMessage:
          "🏆 MISSÃO ELITE CONCLUÍDA! Você demonstrou domínio total: data-attributes, predicados de contexto E navegação por sibling — três técnicas profissionais combinadas em um único desafio.",
      },
    ],
  },
];

export default missions;
