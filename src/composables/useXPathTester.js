/**
 * XPath evaluation utilities for the lab.
 * Validation happens in the parent frame using DOMParser — no iframe needed.
 * The iframe is only used for the visual highlighted preview.
 */

/**
 * Evaluates an XPath expression against an HTML string.
 * Returns a normalized result object for comparison/display.
 */
export function evaluateXPathInDoc(xpath, doc) {
  const result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);

  if (result.resultType === XPathResult.NUMBER_TYPE) {
    return { type: "number", value: result.numberValue };
  }
  if (result.resultType === XPathResult.STRING_TYPE) {
    return { type: "string", value: result.stringValue };
  }
  if (result.resultType === XPathResult.BOOLEAN_TYPE) {
    return { type: "boolean", value: result.booleanValue };
  }

  const nodes = [];
  let node;
  while ((node = result.iterateNext())) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      nodes.push({ kind: "element", key: node.outerHTML });
    } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
      nodes.push({ kind: "attr", key: `${node.nodeName}="${node.nodeValue}"` });
    } else {
      nodes.push({ kind: "text", key: node.textContent });
    }
  }
  return { type: "nodeset", nodes };
}

/**
 * Checks if two XPath result objects represent the same outcome.
 */
function xpathResultsEqual(a, b) {
  if (a.type !== b.type) return false;
  if (a.type === "number") return Math.abs(a.value - b.value) < 0.0001;
  if (a.type === "string") return a.value === b.value;
  if (a.type === "boolean") return a.value === b.value;
  if (a.nodes.length !== b.nodes.length) return false;
  const aKeys = [...a.nodes].map((n) => n.key).sort();
  const bKeys = [...b.nodes].map((n) => n.key).sort();
  return aKeys.every((k, i) => k === bKeys[i]);
}

/**
 * Validates a user's XPath against an array of accepted solution XPaths.
 */
export function validateXPath(userXPath, solutions, htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  let userResult;
  try {
    userResult = evaluateXPathInDoc(userXPath, doc);
  } catch (e) {
    return { valid: false, error: e.message };
  }

  for (const solution of solutions) {
    let solResult;
    try {
      solResult = evaluateXPathInDoc(solution, doc);
    } catch {
      continue;
    }
    if (xpathResultsEqual(userResult, solResult)) {
      return { valid: true };
    }
  }

  return {
    valid: false,
    userCount: userResult.type === "nodeset" ? userResult.nodes.length : null,
    userValue: userResult.type !== "nodeset" ? String(userResult.value) : null,
  };
}

/**
 * Builds the srcdoc HTML string for the preview iframe.
 * The iframe receives postMessages to evaluate XPath and highlight results.
 */
export function buildIframeSrcdoc(htmlContent) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'IBM Plex Sans', Arial, sans-serif;
    padding: 20px;
    background: #2d2d2d;
    color: #f4f4f4;
    margin: 0;
    line-height: 1.5;
    font-size: 14px;
  }

  /* ── Typography ─────────────────────────────────── */
  h1, h2, h3, h4, h5, h6 { margin: 0 0 8px; font-weight: 600; color: #f4f4f4; line-height: 1.3; }
  h1 { font-size: 20px; }
  h2 { font-size: 18px; }
  h3 { font-size: 15px; }
  h4 { font-size: 11px; color: #a8a8a8; text-transform: uppercase; letter-spacing: 0.06em; }
  p { margin: 0 0 8px; }
  p:last-child { margin-bottom: 0; }
  a { color: #78a9ff; text-decoration: none; }
  a:hover { text-decoration: underline; color: #a6c8ff; }
  ul, ol { padding-left: 20px; margin: 0 0 8px; }
  li { margin-bottom: 4px; }
  nav ul, nav ol { list-style: none; padding: 0; margin: 0; }

  /* ── Form elements ───────────────────────────────── */
  input:not([type="checkbox"]):not([type="radio"]), select, textarea {
    background: #393939; color: #f4f4f4;
    border: 1px solid #6f6f6f; padding: 6px 10px;
    border-radius: 4px; font-size: 13px; display: inline-block;
  }
  input[type="checkbox"], input[type="radio"] {
    width: 15px; height: 15px; margin-right: 6px;
    vertical-align: middle; accent-color: #0f62fe; padding: 0;
  }
  button {
    background: #393939; color: #f4f4f4;
    border: 1px solid #6f6f6f; padding: 6px 14px;
    border-radius: 4px; cursor: pointer; font-size: 13px;
  }
  button:hover { background: #4c4c4c; }
  label { display: inline-block; margin-bottom: 4px; color: #c6c6c6; font-size: 13px; }
  fieldset { border: 1px solid #525252; border-radius: 4px; padding: 14px 16px; margin-bottom: 12px; }
  legend { color: #78a9ff; font-size: 11px; font-weight: 700; padding: 0 6px; text-transform: uppercase; letter-spacing: 0.06em; }
  form > * + * { margin-top: 10px; }

  /* ── Table ───────────────────────────────────────── */
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #525252; padding: 8px 12px; text-align: left; font-size: 13px; }
  th { background: #3a3a3a; font-weight: 700; color: #c6c6c6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
  tr:nth-child(even) td { background: rgba(255,255,255,0.025); }

  /* ── Layout utilities ────────────────────────────── */
  .group, .grupo, .campo { margin-bottom: 10px; }
  .toolbar, .barra-acoes {
    display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
    padding: 12px; background: #3a3a3a; border-radius: 4px;
  }
  .modal-body { padding: 10px 0; }
  .modal-footer {
    display: flex; gap: 8px; justify-content: flex-end;
    margin-top: 14px; padding-top: 12px; border-top: 1px solid #525252;
  }
  .form-section { background: #3a3a3a; border-radius: 4px; padding: 16px; margin-bottom: 12px; }
  .mensagens { margin-top: 8px; }
  .conteudo { padding-top: 8px; }

  /* ── Cards / Panels ──────────────────────────────── */
  .card, .painel, .painel-pedidos, .painel-usuario {
    background: #3a3a3a; border-radius: 4px; padding: 14px; margin-bottom: 8px;
    border: 1px solid #525252;
  }
  .titulo { font-weight: 700; color: #a8a8a8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: block; }
  .cabecalho, .header {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    padding-bottom: 10px; border-bottom: 1px solid #525252; margin-bottom: 10px;
  }

  /* ── Alert / Status banners ──────────────────────── */
  .alert, .erro, .alerta {
    display: block; border: 1px solid #da1e28;
    background: rgba(218,30,40,0.12); padding: 10px 14px;
    border-radius: 4px; color: #ff8389;
  }
  .aviso {
    display: block; border: 1px solid #f1c21b;
    background: rgba(241,194,27,0.1); padding: 10px 14px;
    border-radius: 4px; color: #f1c21b;
  }
  .msg { display: block; padding: 10px 14px; border-radius: 4px; }
  .alerta-critico, .erro-validacao {
    background: rgba(218,30,40,0.12); border: 1px solid rgba(218,30,40,0.4); color: #ff8389;
  }
  .sucesso {
    display: block; background: rgba(36,161,72,0.15);
    border: 1px solid rgba(36,161,72,0.45); padding: 12px 16px;
    border-radius: 4px; color: #42be65; font-weight: 700; font-size: 14px;
  }
  .banner { display: block; padding: 12px 16px; border-radius: 4px; font-weight: 700; font-size: 14px; }

  /* ── Semantic role attributes ────────────────────── */
  [role="alert"] {
    display: block; border: 1px solid #da1e28;
    background: rgba(218,30,40,0.12); padding: 10px 14px;
    border-radius: 4px; color: #ff8389;
  }
  [role="status"] {
    display: block; background: rgba(36,161,72,0.15);
    border: 1px solid rgba(36,161,72,0.45);
    padding: 12px 16px; border-radius: 4px;
    color: #42be65; font-weight: 700; font-size: 14px;
  }
  [role="dialog"] {
    background: #3a3a3a; border: 1px solid #6f6f6f;
    border-radius: 6px; padding: 20px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }
  [role="search"] { display: flex; gap: 8px; align-items: center; }

  /* ── aria-current (active nav item) ─────────────── */
  [aria-current="page"] { color: #78a9ff !important; font-weight: 700 !important; }
  .nav-link[aria-current="page"] { background: rgba(15,98,254,0.15) !important; }

  /* ── data-status (product availability) ─────────── */
  [data-status] { border-left: 3px solid transparent; }
  [data-status="em-estoque"] { border-left-color: #24a148; }
  [data-status="esgotado"] { border-left-color: #da1e28; opacity: 0.5; }
  [data-status="sob-encomenda"] { border-left-color: #f1c21b; }

  /* ── data-action button colours ──────────────────── */
  button[data-action="aprovar"] { background: rgba(36,161,72,0.2); border-color: #24a148; color: #42be65; }
  button[data-action="rejeitar"] { background: rgba(218,30,40,0.15); border-color: #da1e28; color: #ff8389; }
  button[data-action="aprovar"]:hover { background: rgba(36,161,72,0.35); }
  button[data-action="rejeitar"]:hover { background: rgba(218,30,40,0.3); }

  /* ── Status text helpers ─────────────────────────── */
  .status-ativo { color: #42be65 !important; font-weight: 700; }
  .status-inativo { color: #6f6f6f !important; }
  td.status.ativo { color: #42be65; background: rgba(36,161,72,0.08); font-weight: 700; }
  td.status.inativo { color: #6f6f6f; background: rgba(111,111,111,0.08); }
  .ativo:not(button):not(a):not(td) { color: #42be65; }

  /* ── Team / member cards ─────────────────────────── */
  .equipe { display: flex; flex-direction: column; gap: 8px; }
  .card-membro {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    background: #3a3a3a; border-radius: 4px; padding: 12px 16px;
    border: 1px solid #525252;
  }
  .nome { font-weight: 700; color: #f4f4f4; font-size: 15px; }
  .cargo {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: #78a9ff;
    background: rgba(15,98,254,0.12); border: 1px solid rgba(15,98,254,0.3);
    padding: 2px 8px; border-radius: 10px;
  }
  .btn-acao { margin-left: auto; font-size: 12px; padding: 4px 10px; }

  /* ── Product catalog ─────────────────────────────── */
  .catalogo { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px,1fr)); gap: 10px; }
  .produto {
    background: #3a3a3a; border-radius: 4px; padding: 14px;
    border: 1px solid #525252; border-left-width: 3px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .produto h3 { font-size: 14px; margin: 0; }
  .preco { font-family: 'IBM Plex Mono', monospace; color: #f1c21b; font-weight: 700; font-size: 13px; }

  /* ── FAQ sections ────────────────────────────────── */
  .faq { display: flex; flex-direction: column; gap: 10px; }
  .secao {
    background: #3a3a3a; border-radius: 4px; padding: 14px 16px;
    border: 1px solid #525252;
  }
  .secao h4 { color: #78a9ff; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #525252; }
  p.resposta {
    font-size: 13px; color: #c6c6c6; margin: 0 0 6px;
    padding-left: 10px; border-left: 2px solid #525252;
  }
  p.resposta:last-child { margin-bottom: 0; }

  /* ── Sidebar / nav ───────────────────────────────── */
  .sidebar, aside.sidebar {
    background: #242424; border: 1px solid #393939;
    border-radius: 4px; padding: 12px; min-width: 180px;
  }
  nav[aria-label] ul { list-style: none; padding: 0; margin: 0; }
  nav[aria-label] li { margin-bottom: 4px; }
  .nav-link {
    display: flex; align-items: center; padding: 8px 12px;
    color: #c6c6c6; border-radius: 4px; text-decoration: none; font-size: 14px;
  }
  .nav-link:hover { background: #393939; color: #f4f4f4; text-decoration: none; }
  .nav-link span.label { font-size: 14px; }

  /* ── Audit log ───────────────────────────────────── */
  .log-auditoria { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; }
  .entrada {
    display: flex; align-items: center; gap: 14px;
    padding: 8px 12px; background: #3a3a3a; border-radius: 3px; border: 1px solid #525252;
  }
  .hora { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 700; color: #6f6f6f; min-width: 40px; flex-shrink: 0; }
  .usuario { font-size: 12px; color: #a8a8a8; flex: 1; font-style: italic; }
  .acao { font-size: 13px; font-weight: 700; color: #f4f4f4; background: rgba(255,255,255,0.07); padding: 2px 8px; border-radius: 3px; white-space: nowrap; }

  /* ── Checkout ────────────────────────────────────── */
  .checkout { display: flex; gap: 14px; flex-wrap: wrap; }
  .resumo {
    flex: 1; min-width: 160px; background: #3a3a3a;
    border-radius: 4px; padding: 14px; border: 1px solid #525252;
  }
  .resumo h3 { font-size: 13px; color: #a8a8a8; margin-bottom: 8px; }
  .resumo ul { font-size: 13px; color: #c6c6c6; }
  .total { font-weight: 700; color: #f4f4f4; font-size: 14px; margin-top: 8px; border-top: 1px solid #525252; padding-top: 8px; }
  .retorno { flex: 1; min-width: 160px; display: flex; flex-direction: column; gap: 10px; }
  .instrucoes { font-size: 13px; color: #8d8d8d; }

  /* ── Portal (transfers) ──────────────────────────── */
  .portal > section { background: #3a3a3a; border-radius: 4px; padding: 14px; }
  .usuario-info { display: flex; align-items: center; gap: 10px; }
  .usuario-info .nome { font-weight: 700; font-size: 14px; }

  /* ── Global header / nav ─────────────────────────── */
  header {
    background: #1c1c1c; padding: 10px 16px; border-bottom: 1px solid #393939;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    margin-bottom: 12px; border-radius: 4px;
  }
  main { padding: 12px 0; }
  nav:not([aria-label]) { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
  nav:not([aria-label]) > a { color: #c6c6c6; text-decoration: none; padding: 4px 10px; border-radius: 3px; font-size: 14px; }
  nav:not([aria-label]) > a.ativo, nav:not([aria-label]) > a[class*="ativo"] { color: #78a9ff; font-weight: 700; }
  nav:not([aria-label]) > a:hover { background: #393939; color: #f4f4f4; text-decoration: none; }

  /* ── Detail-table first column ───────────────────── */
  .detalhes td:first-child { color: #8d8d8d; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; width: 110px; }

  /* ── XPath highlight ─────────────────────────────── */
  .xpath-match {
    outline: 2px solid #0f62fe !important;
    background-color: rgba(15, 98, 254, 0.2) !important;
    border-radius: 2px;
  }
</style>
</head>
<body>
${htmlContent}
<script>
  var highlighted = [];
  window.addEventListener('message', function(e) {
    if (e.data.type === 'evaluate') evaluate(e.data.xpath);
    if (e.data.type === 'clear') clear();
  });
  function clear() {
    highlighted.forEach(function(el) { el.classList.remove('xpath-match'); });
    highlighted = [];
  }
  function evaluate(xpath) {
    clear();
    if (!xpath || !xpath.trim()) {
      window.parent.postMessage({ type: 'result', resultType: 'empty' }, '*');
      return;
    }
    try {
      var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      var rt = result.resultType;
      if (rt === XPathResult.NUMBER_TYPE) {
        window.parent.postMessage({ type: 'result', resultType: 'number', value: result.numberValue }, '*'); return;
      }
      if (rt === XPathResult.STRING_TYPE) {
        window.parent.postMessage({ type: 'result', resultType: 'string', value: result.stringValue }, '*'); return;
      }
      if (rt === XPathResult.BOOLEAN_TYPE) {
        window.parent.postMessage({ type: 'result', resultType: 'boolean', value: result.booleanValue }, '*'); return;
      }
      var collected = []; var node;
      while ((node = result.iterateNext())) {
        collected.push(node);
      }
      var nodes = [];
      collected.forEach(function(node) {
        if (node.nodeType === 1) {
          node.classList.add('xpath-match');
          highlighted.push(node);
          nodes.push(node.outerHTML.slice(0, 400));
        } else if (node.nodeType === 2) {
          nodes.push('@' + node.nodeName + '="' + node.nodeValue + '"');
        } else {
          nodes.push('"' + (node.textContent || '').trim() + '"');
        }
      });
      window.parent.postMessage({ type: 'result', resultType: 'nodeset', count: nodes.length, nodes: nodes.slice(0, 8) }, '*');
    } catch(e) {
      window.parent.postMessage({ type: 'result', resultType: 'error', message: e.message }, '*');
    }
  }
  window.parent.postMessage({ type: 'ready' }, '*');
<\/script>
</body>
</html>`;
}
