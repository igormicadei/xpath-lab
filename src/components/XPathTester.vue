<template>
  <div class="xpath-tester">
    <!-- HTML Source + Preview Tabs -->
    <div class="xpath-tester__html-section">
      <div class="xpath-tester__tab-bar">
        <button
          :class="['xpath-tester__tab-btn', { active: tab === 'code' }]"
          @click="tab = 'code'"
        >
          &lt;/&gt; HTML
        </button>
        <button
          :class="['xpath-tester__tab-btn', { active: tab === 'preview' }]"
          @click="tab = 'preview'"
        >
          👁 Preview
        </button>
      </div>

      <div v-show="tab === 'code'" class="xpath-tester__code-pane">
        <pre><code>{{ html }}</code></pre>
      </div>

      <div v-show="tab === 'preview'" class="xpath-tester__preview-pane">
        <iframe
          ref="iframeRef"
          sandbox="allow-scripts allow-same-origin"
          title="HTML Preview — teste XPath aqui"
          @load="onIframeLoad"
        ></iframe>
        <div class="xpath-tester__inspect-tip">
          💡 Pressione <kbd>F12</kbd> ou clique com o botão direito no Preview →
          <strong>Inspecionar Elemento</strong> para explorar a estrutura do
          HTML.
        </div>
      </div>
    </div>

    <!-- Clickable example XPaths -->
    <div v-if="examples && examples.length > 0" class="xpath-tester__examples">
      <span class="xpath-tester__examples-label">Clique para testar:</span>
      <div class="xpath-tester__example-chips">
        <button
          v-for="ex in examples"
          :key="ex.xpath"
          class="example-chip"
          :title="ex.xpath"
          @click="applyExample(ex)"
        >
          <code>{{ ex.xpath }}</code>
          <span class="example-chip__label">{{ ex.label }}</span>
        </button>
      </div>
    </div>

    <!-- XPath Input -->
    <div class="xpath-tester__input-row">
      <div class="xpath-tester__input-group">
        <label class="xpath-tester__input-label">XPath</label>
        <input
          v-model="userXPath"
          type="text"
          :class="['xpath-tester__input', inputStateClass]"
          placeholder='//div[@class="exemplo"]'
          spellcheck="false"
          autocomplete="off"
          @keydown.enter="test"
        />
      </div>
      <button
        style="
          align-self: flex-end;
          height: 40px;
          padding: 0 16px;
          background: #0f62fe;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        "
        @click="test"
      >
        Testar ▶
      </button>
      <button
        v-if="challengeMode"
        style="
          align-self: flex-end;
          height: 40px;
          padding: 0 16px;
          background: #24a148;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        "
        @click="validate"
      >
        Verificar ✓
      </button>
    </div>

    <!-- Results display -->
    <div v-if="result !== null" class="xpath-tester__results">
      <template v-if="result.type === 'empty'">
        <span style="color: #525252">Nenhum resultado</span>
      </template>
      <template v-else-if="result.type === 'error'">
        <div class="result-count result-count--error">⚠ Erro de XPath</div>
        <div
          class="result-node-item"
          style="color: #ff8389; border-left-color: #da1e28"
        >
          {{ result.message }}
        </div>
      </template>
      <template v-else-if="result.type === 'nodeset'">
        <div
          :class="[
            'result-count',
            result.count === 0 ? 'result-count--zero' : '',
          ]"
        >
          {{
            result.count === 0
              ? "⚠ 0 elementos encontrados"
              : `✓ ${result.count} elemento${result.count !== 1 ? "s" : ""} encontrado${result.count !== 1 ? "s" : ""}`
          }}
        </div>
        <div
          v-if="result.nodes && result.nodes.length > 0"
          class="result-nodes-list"
        >
          <div
            v-for="(node, i) in result.nodes.slice(0, 5)"
            :key="i"
            class="result-node-item"
          >
            {{ node }}
          </div>
          <div v-if="result.nodes.length > 5" class="result-more">
            + {{ result.nodes.length - 5 }} mais...
          </div>
        </div>
      </template>
      <template v-else-if="result.type === 'number'">
        <div class="result-count" style="color: #78a9ff">
          Resultado numérico: {{ result.value }}
        </div>
      </template>
      <template v-else-if="result.type === 'string'">
        <div class="result-count" style="color: #78a9ff">
          Resultado: "{{ result.value }}"
        </div>
      </template>
      <template v-else-if="result.type === 'boolean'">
        <div class="result-count" style="color: #78a9ff">
          Resultado: {{ result.value }}
        </div>
      </template>
    </div>

    <!-- Challenge feedback -->
    <div
      v-if="challengeMode && validation !== null"
      class="challenge-feedback"
      :class="
        validation.valid
          ? 'challenge-feedback--success'
          : 'challenge-feedback--failure'
      "
    >
      <span class="challenge-feedback__icon">{{
        validation.valid ? "🎉" : "🎯"
      }}</span>
      <div class="challenge-feedback__body">
        <div class="challenge-feedback__title">
          {{ validation.valid ? "Correto!" : "Não é bem isso..." }}
        </div>
        <div class="challenge-feedback__message">
          <template v-if="validation.valid">{{ successMessage }}</template>
          <template v-else>
            Seu XPath retornou
            {{
              validation.userCount !== null
                ? `${validation.userCount} elemento(s)`
                : `"${validation.userValue}"`
            }}. Revise a lógica e tente novamente.
          </template>
        </div>
        <template v-if="!validation.valid">
          <button
            v-if="!hintVisible"
            class="hint-toggle"
            @click="hintVisible = true"
          >
            Ver dica →
          </button>
          <div v-if="hintVisible" class="hint-box" v-html="hint"></div>
        </template>
      </div>
      <div v-if="validation.valid" class="challenge-feedback__xp-earned">
        +{{ xpReward }} XP
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import {
  buildIframeSrcdoc,
  validateXPath,
} from "../composables/useXPathTester.js";

const props = defineProps({
  html: { type: String, required: true },
  examples: { type: Array, default: () => [] },
  defaultXPath: { type: String, default: "" },
  challengeMode: { type: Boolean, default: false },
  solutions: { type: Array, default: () => [] },
  hint: { type: String, default: "" },
  successMessage: { type: String, default: "Muito bem! XPath correto." },
  xpReward: { type: Number, default: 0 },
  alreadyComplete: { type: Boolean, default: false },
});

const emit = defineEmits(["challenge-complete"]);

const tab = ref("preview");
const userXPath = ref(props.defaultXPath);
const result = ref(null);
const validation = ref(props.alreadyComplete ? { valid: true } : null);
const hintVisible = ref(false);
const iframeRef = ref(null);
const iframeReady = ref(false);

const inputStateClass = computed(() => {
  if (!validation.value) return "";
  return validation.value.valid ? "xpath-tester__input--success" : "";
});

// Listen for messages from the iframe
function onMessage(event) {
  if (!iframeRef.value) return;
  if (event.source !== iframeRef.value.contentWindow) return;

  const data = event.data;
  if (data.type === "ready") {
    iframeReady.value = true;
    // Apply defaultXPath on load
    if (props.defaultXPath) {
      sendToIframe(props.defaultXPath);
    }
  }
  if (data.type === "result") {
    result.value = { ...data, type: data.resultType };
  }
}

let currentBlobUrl = null;

function loadIframe() {
  if (!iframeRef.value) return;
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
  const blob = new Blob([buildIframeSrcdoc(props.html)], { type: "text/html" });
  currentBlobUrl = URL.createObjectURL(blob);
  iframeRef.value.src = currentBlobUrl;
}

onMounted(() => {
  window.addEventListener("message", onMessage);
  loadIframe();
});

onUnmounted(() => {
  window.removeEventListener("message", onMessage);
  if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
});

function onIframeLoad() {
  iframeReady.value = false;
  result.value = null;
}

function sendToIframe(xpath) {
  if (!iframeRef.value) return;
  iframeRef.value.contentWindow.postMessage({ type: "evaluate", xpath }, "*");
}

function test() {
  if (!userXPath.value.trim()) {
    result.value = { type: "empty" };
    sendToIframe("");
    return;
  }
  tab.value = "preview";
  sendToIframe(userXPath.value);
}

function applyExample(ex) {
  userXPath.value = ex.xpath;
  tab.value = "preview";
  sendToIframe(ex.xpath);
}

function validate() {
  if (!userXPath.value.trim()) return;

  // First show the result in the preview
  sendToIframe(userXPath.value);
  tab.value = "preview";

  // Then validate against solutions
  const vResult = validateXPath(userXPath.value, props.solutions, props.html);
  validation.value = vResult;

  if (vResult.valid) {
    emit("challenge-complete");
  }
}

// Watch for html prop changes — reload iframe directly via DOM property
watch(
  () => props.html,
  () => {
    result.value = null;
    iframeReady.value = false;
    loadIframe();
  },
);
</script>
