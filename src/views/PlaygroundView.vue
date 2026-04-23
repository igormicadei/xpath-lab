<template>
  <main class="playground">
    <div class="playground__header">
      <h1>🛝 Playground XPath</h1>
      <p>Cole qualquer HTML no painel esquerdo e teste XPaths à vontade. Sem missões, sem validação — apenas exploração livre.</p>
    </div>

    <!-- Inspector tip -->
    <div class="inspector-tip" style="margin-bottom: 24px;">
      <div class="inspector-tip__title">🔬 Dica: Use as ferramentas do navegador</div>
      <div class="inspector-tip__content">
        <ol>
          <li>Cole seu HTML no painel esquerdo e clique em <strong>Atualizar Preview</strong>.</li>
          <li>No Preview, pressione <kbd>F12</kbd> ou clique com o <strong>botão direito → Inspecionar Elemento</strong>.</li>
          <li>Na aba <strong>Elements</strong> do DevTools, clique com o botão direito em qualquer nó → <strong>Copy → Copy XPath</strong>.</li>
          <li>Cole o XPath copiado no campo abaixo e clique <strong>Testar ▶</strong> para ver os elementos destacados.</li>
          <li>Modifique o XPath para torná-lo mais estável — substitua índices por atributos, use <code>contains()</code>, etc.</li>
        </ol>
      </div>
    </div>

    <div class="playground__layout">
      <!-- Left: HTML editor -->
      <div class="playground__panel">
        <div class="playground__panel-header">HTML de entrada</div>
        <div class="playground__panel-body">
          <textarea
            v-model="htmlInput"
            class="playground__html-input"
            placeholder="Cole seu HTML aqui..."
            spellcheck="false"
          ></textarea>
          <div class="playground__presets">
            <span style="font-size: 12px; color: #525252; margin-right: 4px;">Presets:</span>
            <button
              v-for="preset in presets"
              :key="preset.label"
              class="playground__preset-btn"
              @click="htmlInput = preset.html"
            >
              {{ preset.label }}
            </button>
          </div>
          <button
            style="margin-top: 12px; width: 100%; padding: 10px; background: #0f62fe; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;"
            @click="applyHtml"
          >
            Atualizar Preview ↻
          </button>
        </div>
      </div>

      <!-- Right: XPath tester -->
      <div class="playground__panel">
        <div class="playground__panel-header">Testador XPath</div>
        <div class="playground__panel-body">
          <XPathTester
            :html="activeHtml"
            :examples="[]"
            :default-x-path="''"
            :challenge-mode="false"
          />
        </div>
      </div>
    </div>

    <!-- Reference quick-card -->
    <div style="margin-top: 32px; background: #1c1c1c; border: 1px solid #393939; border-radius: 4px; padding: 24px;">
      <h2 style="font-size: 16px; font-weight: 700; color: #f4f4f4; margin: 0 0 16px;">📋 Referência Rápida</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px;">
        <div v-for="ref in quickRef" :key="ref.xpath" style="background: #262626; border-radius: 4px; padding: 12px;">
          <code style="display: block; margin-bottom: 4px; font-size: 13px; color: #78a9ff;">{{ ref.xpath }}</code>
          <span style="font-size: 12px; color: #6f6f6f;">{{ ref.desc }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import XPathTester from '../components/XPathTester.vue'

const DEFAULT_HTML = `<div id="sistema">
  <header>
    <nav>
      <a href="/home">Início</a>
      <a href="/relatorios" class="ativo">Relatórios</a>
    </nav>
  </header>
  <main>
    <form id="form-busca">
      <label for="busca">Buscar</label>
      <input id="busca" type="search" placeholder="Digite...">
      <button type="submit">Buscar</button>
    </form>
    <table>
      <thead>
        <tr><th>ID</th><th>Nome</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr><td>001</td><td>Produto A</td><td class="ativo">Ativo</td></tr>
        <tr><td>002</td><td>Produto B</td><td class="inativo">Inativo</td></tr>
        <tr><td>003</td><td>Produto C</td><td class="ativo">Ativo</td></tr>
      </tbody>
    </table>
  </main>
</div>`

const htmlInput = ref(DEFAULT_HTML)
const activeHtml = ref(DEFAULT_HTML)

function applyHtml() {
  activeHtml.value = htmlInput.value
}

const presets = [
  {
    label: 'Formulário',
    html: `<form id="cadastro">
  <div class="campo">
    <label>CPF</label>
    <input id="cpf" type="text" name="cpf" placeholder="000.000.000-00">
  </div>
  <div class="campo">
    <label>E-mail</label>
    <input id="email" type="email" name="email" placeholder="email@exemplo.com">
  </div>
  <div class="campo">
    <label>Cidade</label>
    <input id="cidade" type="text" name="cidade" disabled placeholder="Desabilitado">
  </div>
  <button type="submit" data-testid="btn-salvar">Salvar</button>
  <button type="button" data-testid="btn-cancelar">Cancelar</button>
</form>`
  },
  {
    label: 'Tabela',
    html: `<table>
  <thead>
    <tr><th>Nome</th><th>CPF</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Ana Lima</td><td>123.456.789-00</td><td class="ativo">Ativo</td></tr>
    <tr><td>Bruno Melo</td><td>987.654.321-00</td><td class="inativo">Inativo</td></tr>
    <tr><td>Carlos Rio</td><td>111.222.333-44</td><td class="ativo">Ativo</td></tr>
  </tbody>
</table>`
  },
  {
    label: 'Modal',
    html: `<div class="overlay">
  <div role="dialog" aria-label="Confirmar ação" class="modal">
    <div class="modal-header">
      <h2>Confirmar exclusão</h2>
      <button aria-label="Fechar">×</button>
    </div>
    <div class="modal-body">
      <p>Tem certeza que deseja excluir este registro?</p>
      <div role="alert" class="aviso">Esta ação não pode ser desfeita.</div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn-secondary">Cancelar</button>
      <button type="button" class="btn-danger" data-testid="btn-confirmar">Confirmar</button>
    </div>
  </div>
</div>`
  },
  {
    label: 'Painéis',
    html: `<div class="dashboard">
  <div class="painel">
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
  </div>
</div>`
  },
  {
    label: 'Alertas',
    html: `<div id="telaPrincipal">
  <div class="header"><h2>Seleção de débitos</h2></div>
  <div class="mensagens">
    <div role="alert" class="erro">CPF inválido</div>
    <div role="alert" class="aviso">Campo obrigatório</div>
  </div>
  <div class="acoes">
    <button data-testid="btn-confirmar">Confirmar</button>
    <button data-testid="btn-voltar" disabled>Voltar</button>
  </div>
</div>`
  }
]

const quickRef = [
  { xpath: '//tag', desc: 'Todos os elementos da tag' },
  { xpath: '//*[@id="valor"]', desc: 'Qualquer tag com id específico' },
  { xpath: '//input[@type="text"]', desc: 'Input por tipo' },
  { xpath: '//button[text()="Salvar"]', desc: 'Botão por texto exato' },
  { xpath: '//button[normalize-space()="Salvar"]', desc: 'Texto com espaços extras' },
  { xpath: '//div[contains(@class,"erro")]', desc: 'Class parcial' },
  { xpath: '//input[not(@disabled)]', desc: 'Excluir desabilitados' },
  { xpath: '//label/following-sibling::input', desc: 'Input após label' },
  { xpath: '//td[text()="CPF"]/following-sibling::td', desc: 'Valor após rótulo em tabela' },
  { xpath: '//div[.//h3[text()="Título"]]//button', desc: 'Contexto por descendente' },
  { xpath: 'count(//tr)', desc: 'Conta linhas da tabela' },
  { xpath: '//input/ancestor::form', desc: 'Form ancestral do input' }
]
</script>
