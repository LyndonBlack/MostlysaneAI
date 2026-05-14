// ─────────────────────────────────────────────────
//  OS & Distro configs
// ─────────────────────────────────────────────────
const OS_CONFIG = {
  'linux-ubuntu': {
    label: 'Linux (Ubuntu / Debian)', icon: '🐧',
    installPkg: 'sudo apt update && sudo apt install -y build-essential cmake',
    installCuda: 'sudo apt install -y nvidia-cuda-toolkit',
    binary: './build/bin/llama-server',
    buildCmd: `git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git\ncd llama.cpp-Ternary-1.58Bit-and-TurboQuant\nmkdir build && cd build\ncmake .. -DGGML_CUDA=ON\nmake -j$(nproc)`,
    modelDir: '~/AI/models/',
    backend: 'CUDA (NVIDIA)',
    detect: /linux.*ubuntu|debian/i
  },
  'linux-fedora': {
    label: 'Linux (Fedora / RHEL)', icon: '🐧',
    installPkg: 'sudo dnf install -y cmake gcc-c++',
    installCuda: 'sudo dnf install -y cuda-toolkit',
    binary: './build/bin/llama-server',
    buildCmd: `git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git\ncd llama.cpp-Ternary-1.58Bit-and-TurboQuant\nmkdir build && cd build\ncmake .. -DGGML_CUDA=ON\nmake -j$(nproc)`,
    modelDir: '~/AI/models/',
    backend: 'CUDA (NVIDIA)',
    detect: /fedora|rhel|centos/i
  },
  'linux-arch': {
    label: 'Linux (Arch)', icon: '🐧',
    installPkg: 'sudo pacman -S --needed base-devel cmake',
    installCuda: 'sudo pacman -S cuda',
    binary: './build/bin/llama-server',
    buildCmd: `git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git\ncd llama.cpp-Ternary-1.58Bit-and-TurboQuant\nmkdir build && cd build\ncmake .. -DGGML_CUDA=ON\nmake -j$(nproc)`,
    modelDir: '~/AI/models/',
    backend: 'CUDA (NVIDIA)',
    detect: /arch/i
  },
  macos: {
    label: 'macOS', icon: '🍎',
    installPkg: 'brew install cmake',
    installCuda: null,
    binary: './build/bin/llama-server',
    buildCmd: `git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git\ncd llama.cpp-Ternary-1.58Bit-and-TurboQuant\nmkdir build && cd build\ncmake .. -DGGML_METAL=ON\nmake -j$(sysctl -n hw.logicalcpu)`,
    modelDir: '~/AI/models/',
    backend: 'Metal (Apple GPU)',
    detect: /mac|darwin/i
  },
  windows: {
    label: 'Windows 10 / 11', icon: '🪟',
    installPkg: null, installCuda: null,
    binary: 'build\\bin\\Release\\llama-server.exe',
    buildCmd: `# Open "x64 Native Tools Command Prompt for VS 2022"\ngit clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git\ncd llama.cpp-Ternary-1.58Bit-and-TurboQuant\nmkdir build && cd build\ncmake .. -DGGML_CUDA=ON\nmsbuild ALL_BUILD.vcxproj /p:Configuration=Release`,
    modelDir: '%USERPROFILE%\\AI\\models\\',
    backend: 'CUDA (NVIDIA)',
    steps: [
      'Download & install <a href="https://cmake.org/download/">CMake</a> (enable "Add to PATH")',
      'Download & install <a href="https://developer.nvidia.com/cuda-downloads">CUDA Toolkit</a>',
      'Install <a href="https://visualstudio.microsoft.com/vs/community/">Visual Studio 2022 Community</a> with "Desktop development with C++" workload',
      'Open "x64 Native Tools Command Prompt for VS 2022" from the Start menu'
    ],
    detect: /win/i
  }
};

// ─────────────────────────────────────────────────
//  Platform configs (GPU vendor → device options)
// ─────────────────────────────────────────────────
const PLATFORM_CONFIG = {
  nvidia: {
    label: 'NVIDIA (CUDA)',
    backend: 'CUDA (NVIDIA)',
    gpus: [
      { v: 2, label: 'Test / Legacy — 2 GB' },
      { v: 4, label: 'GTX 1650 / Tesla — 4 GB' },
      { v: 8, label: 'RTX 3070 Ti / 4060 — 8 GB' },
      { v: 12, label: 'RTX 3080 / 4070 — 12 GB' },
      { v: 16, label: 'RTX 4080 / 5070 Ti — 16 GB' },
      { v: 24, label: 'RTX 3090 / 4090 / 5090 — 24 GB' },
      { v: 48, label: 'RTX 6000 / A6000 — 48 GB' }
    ]
  },
  apple: {
    label: 'Apple (Metal)',
    backend: 'Metal (Apple GPU)',
    gpus: [
      { v: 8, label: 'Apple Silicon — 8 GB unified' },
      { v: 16, label: 'Apple Silicon — 16 GB unified' },
      { v: 24, label: 'Apple Silicon — 24 GB unified' },
      { v: 32, label: 'Apple Silicon — 32 GB unified' },
      { v: 48, label: 'Apple Silicon — 48 GB unified' },
      { v: 64, label: 'Apple Silicon — 64 GB unified' },
      { v: 96, label: 'Apple Silicon — 96 GB unified' },
      { v: 128, label: 'Apple Silicon — 128 GB unified' }
    ]
  },
  amd: {
    label: 'AMD (ROCm)',
    backend: 'ROCm (AMD)',
    gpus: [
      { v: 8, label: 'RX 6600 / 7600 — 8 GB' },
      { v: 12, label: 'RX 6700 XT / 7700 XT — 12 GB' },
      { v: 16, label: 'RX 6800 / 7800 XT — 16 GB' },
      { v: 24, label: 'RX 6900 XT / 7900 XTX — 24 GB' }
    ]
  },
  intel: {
    label: 'Intel Arc (IPEX-LLM)',
    backend: 'IPEX-LLM (Intel Arc)',
    gpus: [
      { v: 8, label: 'Arc A580 / A750 — 8 GB' },
      { v: 12, label: 'Arc B580 — 12 GB' },
      { v: 16, label: 'Arc A770 — 16 GB' }
    ]
  },
  apu: {
    label: 'Integrated / CPU only',
    backend: 'CPU (no GPU acceleration)',
    gpus: [
      { v: 0, label: 'No dedicated GPU — CPU inference only' }
    ]
  }
};

// ─────────────────────────────────────────────────
//  Usage tier definitions
// ─────────────────────────────────────────────────
const USAGE_TIERS = [
  { id: 1, label: 'Quick Text',
    desc: 'Best for fixing grammar, simple formatting, and rapid chat.',
    maxContext: 16384 },
  { id: 2, label: 'Basic Assistant',
    desc: 'Handles short emails, simple lists, and basic definitions.',
    maxContext: 32768 },
  { id: 3, label: 'Everyday Smart',
    desc: 'Good for creative writing, code review, and general advice.',
    maxContext: 65536 },
  { id: 4, label: 'Complex Logic',
    desc: 'Solves harder problems, multi-step tasks, web app creation, and detailed analysis.',
    maxContext: 999999999 },
  { id: 5, label: 'Deep Thinker',
    desc: 'Best for complex coding, deep reasoning, massive documents, and advanced research.',
    maxContext: 999999999 }
];

// ─────────────────────────────────────────────────
//  Usage tier helpers
// ─────────────────────────────────────────────────
function getUsageTier() {
  const el = document.getElementById('usage-tier');
  if (!el) return 3;
  return parseInt(el.value) || 3;
}

function setUsageTierDesc() {
  const el = document.getElementById('usage-tier-desc');
  if (!el) return;
  const tier = getUsageTier();
  const t = USAGE_TIERS.find(x => x.id === tier) || USAGE_TIERS[2];
  el.innerHTML = '<strong>' + t.label + ':</strong> ' + t.desc;
}

function onUsageTierChange() {
  SELECTED_MODEL_ID = null;
  setUsageTierDesc();
  updateConfig();
}

// ─────────────────────────────────────────────────
//  Effective VRAM (platform-aware)
// ─────────────────────────────────────────────────
function getEffectiveVram() {
  const vramGb = parseInt(document.getElementById('gpu').value);
  const platform = document.getElementById('platform').value;
  // Apple Silicon reserves ~6 GB for macOS Tahoe system
  if (platform === 'apple') return Math.max(1000, vramGb * 1000 - 6000);
  return vramGb * 1000;
}

// ─────────────────────────────────────────────────
//  State
// ─────────────────────────────────────────────────
let MODELS = [];
let SELECTED_MODEL_ID = null;
let SELECTED_VARIANTS = {};   // { modelId: quantString }
let modelPanelOpen = false;
let panelOutsideHandler = null;

// ─────────────────────────────────────────────────
//  Init
// ─────────────────────────────────────────────────
async function loadModels() {
  try {
    const url = 'models.json';
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('HTTP ' + res.status + ': ' + res.statusText);
    }
    const text = await res.text();
    MODELS = JSON.parse(text);
    MODELS.sort((a, b) => a.order - b.order);
    document.getElementById('loading').classList.add('hidden');
    detectOS();
    updateConfig();
  } catch (err) {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.classList.add('hidden');
    const errEl = document.getElementById('error');
    if (errEl) {
      errEl.classList.remove('hidden');
      errEl.innerHTML = '<p><strong>Failed to load model database.</strong></p>'
        + '<p style="font-size:0.85rem;color:var(--orange);margin-top:0.5rem">'
        + (err.message || err) + '</p>'
        + '<p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.5rem">URL: <code>'
        + window.location.protocol + '//' + window.location.host + window.location.pathname.replace(/[^/]*$/, '') + 'models.json</code></p>';
    } else {
      document.body.insertAdjacentHTML('afterbegin',
        '<div style="background:#f85149;color:#fff;padding:1rem;font-family:sans-serif">'
        + '<strong>Error:</strong> ' + (err.message || err) + '</div>');
    }
    console.error('🚨 Failed to load models:', err);
    console.error('   Stack:', err.stack);
  }
}

// ─────────────────────────────────────────────────
//  OS detection
// ─────────────────────────────────────────────────
function detectOS() {
  const ua = navigator.userAgent;
  const osSelect = document.getElementById('os');
  for (const option of osSelect.options) {
    const cfg = OS_CONFIG[option.value];
    if (cfg && cfg.detect && cfg.detect.test(ua)) {
      osSelect.value = option.value;
      break;
    }
  }
  document.getElementById('os-detected').textContent =
    `(auto-detected: ${OS_CONFIG[osSelect.value].label})`;

  // Auto-detect platform based on OS
  const platSelect = document.getElementById('platform');
  if (platSelect) {
    if (osSelect.value === 'macos') {
      platSelect.value = 'apple';
    } else {
      platSelect.value = 'nvidia';
    }
  }
  updateGpuOptions();
}

// ─────────────────────────────────────────────────
//  Platform detection & GPU options
// ─────────────────────────────────────────────────
function updateGpuOptions() {
  const platform = document.getElementById('platform').value;
  const cfg = PLATFORM_CONFIG[platform];
  if (!cfg) return;
  const select = document.getElementById('gpu');
  select.innerHTML = '';
  cfg.gpus.forEach(function(g) {
    var opt = document.createElement('option');
    opt.value = g.v;
    opt.textContent = g.label;
    select.appendChild(opt);
  });
  // Set a sensible default GPU (not the smallest)
  const defaults = { nvidia: 2, apple: 1, amd: 0, intel: 0, apu: 0 };
  var idx = defaults[platform] || 0;
  if (select.options[idx]) select.selectedIndex = idx;
}

function onGpuChange() {
  SELECTED_MODEL_ID = null;
  updateConfig();
}

function onPlatformChange() {
  updateGpuOptions();
  // Reset model selection so recommended model re-evaluates
  SELECTED_MODEL_ID = null;
  updateConfig();
}


// ─────────────────────────────────────────────────
//  Variant helpers
// ─────────────────────────────────────────────────
function defaultVariant(model) {
  return model.variants ? model.variants[0] : null;
}

function getVariant(model) {
  if (!model.variants || model.variants.length === 0) return null;
  const q = SELECTED_VARIANTS[model.id];
  return model.variants.find(v => v.quant === q) || model.variants[0];
}

function getVariantFile(model) {
  const v = getVariant(model);
  if (v) return v.file;
  // Fall back to first variant's file (model.file no longer at top level)
  if (model.variants && model.variants.length > 0) return model.variants[0].file;
  return model.file || model.id + '.gguf';
}

function getVariantMemory(model) {
  const v = getVariant(model);
  if (!v) {
    // No variant selected — use first variant if available
    if (model.variants && model.variants.length > 0) {
      const v0 = model.variants[0];
      return {
        file_gb: v0.file_gb, gpu_weights_mib: v0.gpu_weights_mib,
        ram_weights_mib: v0.ram_weights_mib, kv_per_100k_mib: v0.kv_per_100k_mib,
        entropy_savings_pct: 30, vision_mmproj_mib: model.mmproj ? 887 : 0,
        overhead_mib: v0.overhead_mib || 400
      };
    }
    return null;
  }
  return {
    file_gb: v.file_gb,
    gpu_weights_mib: v.gpu_weights_mib,
    ram_weights_mib: v.ram_weights_mib,
    kv_per_100k_mib: v.kv_per_100k_mib,
    entropy_savings_pct: 30,
    vision_mmproj_mib: model.mmproj ? 887 : 0,
    overhead_mib: v.overhead_mib || 400
  };
}

function getVariantMinVram(model) {
  const v = getVariant(model);
  return v ? v.min_vram_mib : model.min_vram_mib;
}

// ─────────────────────────────────────────────────
//  Install guide
// ─────────────────────────────────────────────────
function updateInstallGuide() {
  const osKey = document.getElementById('os').value;
  const os = OS_CONFIG[osKey];
  if (!os) return;

  // Populate one-liner installer commands
  var nixCmd = 'curl -sSL https://lyndonblack.github.io/MostlysaneAI/install/install.sh | bash';
  var winCmd = 'powershell -c "irm https://lyndonblack.github.io/MostlysaneAI/install/install.ps1 | iex"';
  var oneLinerNix = document.getElementById('one-liner-cmd');
  var oneLinerWin = document.getElementById('one-liner-win');
  if (oneLinerNix) {
    oneLinerNix.textContent = nixCmd;
    addCopyButton('one-liner-cmd', nixCmd);
    if (osKey === 'windows') oneLinerNix.style.display = 'none';
    else oneLinerNix.style.display = '';
  }
  if (oneLinerWin) {
    oneLinerWin.textContent = winCmd;
    addCopyButton('one-liner-win', winCmd);
    if (osKey === 'windows') oneLinerWin.style.display = '';
    else oneLinerWin.style.display = 'none';
  }
  const model = getActiveModel();
  document.getElementById('os-detected').textContent =
    `(auto-detected: ${os.label})`;

  let html = `<ol class="steps">`;
  if (os.steps) {
    os.steps.forEach((s, i) => {
      html += `<li class="step">
        <div class="step-title">${['Install Build Tools','Install CUDA','Install Visual Studio','Open Developer Prompt'][i]}</div>
        <div class="step-desc">${s}</div>
      </li>`;
    });
  }
  html += `<li class="step">
    <div class="step-title">Install Dependencies</div>
    <div class="step-desc">${os.installPkg ? 'Install build tools needed to compile llama.cpp.' : 'Dependencies installed in the steps above.'}</div>`;
  if (os.installPkg) html += `<div class="command-block small">${os.installPkg}</div>`;
  html += `</li>`;

  // Build the right cmake flag based on platform + OS
  const platCfg = PLATFORM_CONFIG[document.getElementById('platform').value];
  const isMac = osKey === 'macos';
  const backendFlag = isMac ? 'GGML_METAL=ON' : (platCfg && platCfg.backend.indexOf('CUDA') >= 0 ? 'GGML_CUDA=ON' : 'GGML_VULKAN=ON');
  const buildCmd = os.shell === 'powershell'
    ? 'cmake .. -D' + backendFlag + '\nmsbuild ALL_BUILD.vcxproj /p:Configuration=Release'
    : 'cmake .. -D' + backendFlag + '\nmake -j$(nproc)';

  html += `<li class="step">
    <div class="step-title">Clone &amp; Build</div>
    <div class="step-desc">Clone the Mostlysane research fork and compile.</div>
    <div class="command-block small">${os.buildCmd}</div>
  </li>`;

  // Show backend note under build step if not CUDA
  if (platCfg && platCfg.backend.indexOf('CUDA') < 0 && platCfg.backend.indexOf('Metal') < 0 && !isMac) {
    html += '<p class="step-note" style="margin:-0.5rem 0 1rem 2.2rem">Using <strong>' + platCfg.backend + '</strong> backend.</p>';
  }

  if (model) {
    const f = getVariantFile(model);
    const hfUrl = `https://huggingface.co/LyndonBlack/${f.replace('.gguf', '')}`;
    html += `<li class="step">
      <div class="step-title">Download the Model</div>
      <div class="step-desc">Download <strong>${f}</strong> into your models directory.</div>
      <div class="command-block small">mkdir -p ${os.modelDir}
curl -L -o ${os.modelDir}${f} ${hfUrl}</div>
    </li>`;
  }

  if (model) {
    const backendLabel = platCfg ? platCfg.backend : 'Unknown';
    const showNvidiaCheck = platCfg && platCfg.backend.indexOf('CUDA') >= 0 && !isMac;
    html += `<li class="step">
      <div class="step-title">Run It</div>
      <div class="step-desc">Start the server with your generated config.</div>
      <div class="step-note">Backend: <strong>${backendLabel}</strong>${showNvidiaCheck ? ' | Check nvidia-smi' : ''}</div>
    </li>`;
  }

  html += `</ol><hr><p style="font-size:0.9rem;color:var(--text-muted)">
    📦 One-liner installer coming soon — <code>curl -sSL mostlysane.ai/install.sh | bash</code>
  </p>`;
  document.getElementById('setup-steps').innerHTML = html;

  // Add copy buttons to setup guide command blocks
  var setupCmds = document.querySelectorAll('#setup-steps .command-block.small');
  for (var i = 0; i < setupCmds.length; i++) {
    (function(block) {
      var txt = block.textContent.trim();
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerHTML = '<svg aria-hidden="true" fill="currentColor" height="18px" viewBox="0 -960 960 960" width="18px"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>';
      btn.onclick = function() {
        navigator.clipboard.writeText(txt).then(function() {
          btn.innerHTML = '<svg aria-hidden="true" fill="currentColor" height="18px" viewBox="0 -960 960 960" width="18px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>';
          setTimeout(function() { btn.innerHTML = '<svg aria-hidden="true" fill="currentColor" height="18px" viewBox="0 -960 960 960" width="18px"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>'; }, 2000);
        });
      };
      block.appendChild(btn);
    })(setupCmds[i]);
  }
}

// ─────────────────────────────────────────────────
//  Estimates
// ─────────────────────────────────────────────────
function getContextForModel(model, vramMib) {
  const tier = getUsageTier();
  // Tiers 4 and 5 don't cap by tier — use available VRAM logic only
  if (tier >= 4) {
    const rawGb = parseInt(document.getElementById('gpu').value);
    if (rawGb >= 24) return model.max_ctx;
    if (model.id === 'qwen36' || model.id === 'qwen3vl') return 200000;
    return Math.min(model.max_ctx, 131072);
  }
  // Tiers 1-3 cap by usage tier
  const tierCtx = USAGE_TIERS.find(x => x.id === tier).maxContext;
  return Math.min(model.max_ctx, tierCtx);
}

function estimateVram(model, ctx, wantVision) {
  const mem = getVariantMemory(model);
  if (!mem) return null;

  const kvRaw = mem.kv_per_100k_mib * (ctx / 100000);
  const kvWithEntropy = kvRaw * (1 - mem.entropy_savings_pct / 100);
  const mmprojMib = (wantVision && model.has_vision) ? mem.vision_mmproj_mib : 0;

  return {
    total: mem.gpu_weights_mib + kvWithEntropy + mmprojMib + mem.overhead_mib,
    weights: mem.gpu_weights_mib,
    kvCache: kvWithEntropy,
    mmproj: mmprojMib,
    overhead: mem.overhead_mib,
    ramWeights: mem.ram_weights_mib,
    entropyPct: mem.entropy_savings_pct
  };
}

function getViableModels(vramMib, ramGb, wantVision) {
  return MODELS
    .filter(m => {
      // Use variant's min VRAM if available, else model default
      const v = getVariant(m);
      const minVram = v ? v.min_vram_mib : m.min_vram_mib;
      return ramGb >= m.min_ram_gb && vramMib >= minVram;
    })
    .filter(m => !wantVision || m.has_vision);
}

function getActiveModel() {
  if (!SELECTED_MODEL_ID) return null;
  return MODELS.find(m => m.id === SELECTED_MODEL_ID) || null;
}

// ─────────────────────────────────────────────────
//  Model card builder
// ─────────────────────────────────────────────────
function buildModelCard(model, vramMib, vision, selected) {
  const ctx = getContextForModel(model, vramMib);
  const est = estimateVram(model, ctx, vision);
  const isCpuOnly = est && est.weights === 0;
  let fitClass, fitLabel;
  if (isCpuOnly) {
    // CPU-only models don't use GPU — always fit on VRAM
    fitClass = 'badge-green';
    fitLabel = 'Fits';
  } else {
    const freeMib = est ? vramMib - est.total : 0;
    const fitTight = freeMib >= 0 && est && est.total > vramMib * 0.95;
    const fitOver = freeMib < 0;
    fitClass = fitOver ? 'badge-red' : fitTight ? 'badge-orange' : 'badge-green';
    fitLabel = fitOver ? 'Over' : fitTight ? 'Tight' : 'Fits';
  }
  // File name comes from variants array now (file moved inside variants)
  const fileName = (model.variants && model.variants.length > 0)
    ? getVariantFile(model)
    : (model.file ? (model.file.length > 48 ? model.file.slice(0, 45) + '…' : model.file) : model.id);

  // Build quant selector if multiple variants
  const currentQuant = getVariant(model);
  let quantHtml = '';
  if (model.variants && model.variants.length > 1) {
    quantHtml = `<span class="model-option-quant" id="quant-${model.id}" onclick="event.stopPropagation();toggleQuantMenu('${model.id}')">
      Specific Variant ▾
    </span>`;
  } else if (model.variants && model.variants.length === 1) {
    quantHtml = `<span class="model-option-quant-static">Variant: ${model.variants[0].quant}</span>`;
  } else {
    quantHtml = `<span class="model-option-quant-static">Variant: ${model.variants && model.variants.length > 0 ? model.variants[0].quant : (model.quant || 'default')}</span>`;
  }

  return `<div class="model-option ${selected ? 'selected' : ''}" onclick="selectModel('${model.id}')">
    <div class="model-option-header">
      <span class="model-option-name">${model.name}</span>
      ${quantHtml}
      <span class="model-option-arch">${model.arch}</span>
    </div>
    <div class="model-option-details">
      <span class="model-option-stat model-option-file" title="${fileName}">${fileName}</span>
      <span class="model-option-stat model-option-ctx">${(ctx / 1000).toFixed(0)}k Context</span>
    </div>
    <div class="model-option-footer">
      <span class="badge ${fitClass}">${fitLabel}</span>
      <span class="model-option-vram">${isCpuOnly && est ? '~' + Math.round(est.ramWeights).toLocaleString() + ' / ' + (parseInt(document.getElementById('ram').value) * 1000).toLocaleString() + ' MiB RAM' : est ? '~' + Math.round(est.total).toLocaleString() + ' / ' + vramMib.toLocaleString() + ' MiB' : '?'}</span>
      <span class="model-option-speed">${isCpuOnly ? 'Full CPU' : model.cpu_moe ? 'MoE CPU' : 'Full GPU'}</span>
    </div>
  </div>`;
}

// ─────────────────────────────────────────────────
//  Quant variant menu (mini dropdown inline)
// ─────────────────────────────────────────────────
let quantMenuOpen = null; // modelId when open

function toggleQuantMenu(modelId) {
  if (quantMenuOpen === modelId) {
    closeQuantMenu();
    return;
  }
  closeQuantMenu(); // close any other
  quantMenuOpen = modelId;

  const model = MODELS.find(m => m.id === modelId);
  if (!model || !model.variants || model.variants.length < 2) return;

  // Remove any existing menu
  const existing = document.querySelector('.quant-menu');
  if (existing) existing.remove();

  const menu = document.createElement('div');
  menu.className = 'quant-menu';
  const vramGb = parseInt(document.getElementById('gpu').value);
  const vramMib = getEffectiveVram();
  const vision = document.getElementById('vision').value === '1';
  const ctx = getContextForModel(model, vramMib);

  model.variants.forEach(v => {
    const isCurrent = (getVariant(model) || model.variants[0]).quant === v.quant;
    // Quick memory check for this variant
    const mem = {
      total: v.gpu_weights_mib + (v.kv_per_100k_mib * (ctx / 100000) * 0.7) + (vision && model.has_vision ? 887 : 0) + (v.overhead_mib || 400),
      file_gb: v.file_gb
    };
    const fits = mem.total <= vramMib;

    const fitLabel = fits ? 'Fits' : 'Over';
    const fitClass = fits ? 'badge-green' : 'badge-red';

    menu.innerHTML += `<div class="quant-menu-item ${isCurrent ? 'current' : ''} ${!fits ? 'no-fit' : ''}"
      onclick="event.stopPropagation();selectVariant('${model.id}','${v.quant}')">
      <span class="quant-menu-quant">${v.quant}</span>
      <span class="quant-menu-file">${v.file_gb} GB</span>
      <span class="badge ${fitClass}">${fitLabel}</span>
    </div>`;
  });

  // Position menu anchored to quant badge
  const badge = document.getElementById(`quant-${modelId}`);
  if (!badge) { quantMenuOpen = null; return; }
  const rect = badge.getBoundingClientRect();
  menu.style.position = 'fixed';
  menu.style.top = (rect.bottom + 4) + 'px';
  menu.style.right = (window.innerWidth - rect.right) + 'px';
  document.body.appendChild(menu);

  // Close on outside click
  setTimeout(() => {
    const handler = (e) => {
      if (!menu.contains(e.target) && !e.target.closest('.model-option-quant')) {
        closeQuantMenu();
        document.removeEventListener('click', handler);
      }
    };
    document.addEventListener('click', handler);
  }, 10);
}

function closeQuantMenu() {
  quantMenuOpen = null;
  const menu = document.querySelector('.quant-menu');
  if (menu) menu.remove();
}

function selectVariant(modelId, quant) {
  SELECTED_VARIANTS[modelId] = quant;
  closeQuantMenu();
  if (modelId === SELECTED_MODEL_ID) {
    renderModelSelector();
    renderMemoryBreakdown();
    updateCommand();
    updateInstallGuide();
  } else {
    // Re-render panel options too
    if (modelPanelOpen) {
      renderModelPanel();
    }
  }
}

// ─────────────────────────────────────────────────
//  Model dropdown panel
// ─────────────────────────────────────────────────
function toggleModelPanel() {
  modelPanelOpen ? closeModelPanel() : openModelPanel();
}

function openModelPanel() {
  const panel = document.getElementById('model-panel');
  const chevron = document.getElementById('model-chevron');
  const vramGb = parseInt(document.getElementById('gpu').value);
  const vramMib = getEffectiveVram();
  const ram = parseInt(document.getElementById('ram').value);
  const vision = document.getElementById('vision').value === '1';
  const viable = getViableModels(vramMib, ram, vision);
  const alternatives = viable.filter(m => m.id !== SELECTED_MODEL_ID);

  if (alternatives.length === 0) return;

  let html = '';
  alternatives.forEach(m => {
    html += buildModelCard(m, vramMib, vision, false);
  });
  panel.innerHTML = html;

  panel.classList.remove('hidden');
  chevron.classList.add('open');
  modelPanelOpen = true;

  panelOutsideHandler = (e) => {
    const card = document.getElementById('model-card');
    const quantMenu = document.querySelector('.quant-menu');
    const clickedQuant = quantMenu && quantMenu.contains(e.target);
    if (!card.contains(e.target) && !clickedQuant) closeModelPanel();
  };
  setTimeout(() => document.addEventListener('click', panelOutsideHandler), 10);
}

function closeModelPanel() {
  const panel = document.getElementById('model-panel');
  const chevron = document.getElementById('model-chevron');
  panel.classList.add('hidden');
  chevron.classList.remove('open');
  modelPanelOpen = false;
  if (panelOutsideHandler) {
    document.removeEventListener('click', panelOutsideHandler);
    panelOutsideHandler = null;
  }
}

function selectModel(modelId) {
  SELECTED_MODEL_ID = modelId;
  // Auto-pick default variant if none selected for this model
  const m = MODELS.find(x => x.id === modelId);
  if (m && !SELECTED_VARIANTS[modelId] && m.variants) {
    SELECTED_VARIANTS[modelId] = m.variants[0].quant;
  }
  closeModelPanel();
  closeQuantMenu();
  renderModelSelector();
  renderMemoryBreakdown();
  updateCommand();
  updateInstallGuide();
}

// ─────────────────────────────────────────────────
//  Render: model selector (preview + panel)
// ─────────────────────────────────────────────────
function renderModelSelector() {
  const vramGb = parseInt(document.getElementById('gpu').value);
  const vramMib = getEffectiveVram();
  const ram = parseInt(document.getElementById('ram').value);
  const vision = document.getElementById('vision').value === '1';
  const tier = getUsageTier();
  const viable = getViableModels(vramMib, ram, vision);
  const container = document.getElementById('model-selector');

  if (viable.length === 0) {
    container.innerHTML = `<p style="color:var(--red)">❌ No models fit your hardware.</p>`;
    return;
  }

  if (!SELECTED_MODEL_ID || !viable.find(m => m.id === SELECTED_MODEL_ID)) {
    // Sort by best match to usage tier: closest complexity wins
    viable.sort(function(a, b) {
      var da = Math.abs((a.complexity || 3) - tier);
      var db = Math.abs((b.complexity || 3) - tier);
      if (da !== db) return da - db;
      return b.order - a.order; // among equal distance, prefer higher order
    });
    SELECTED_MODEL_ID = viable[0].id;
    const m = MODELS.find(x => x.id === SELECTED_MODEL_ID);
    if (m && m.variants && !SELECTED_VARIANTS[SELECTED_MODEL_ID]) {
      SELECTED_VARIANTS[SELECTED_MODEL_ID] = m.variants[0].quant;
    }
  }

  const active = MODELS.find(m => m.id === SELECTED_MODEL_ID);
  container.innerHTML = buildModelCard(active, vramMib, vision, true);

  const btn = document.getElementById('model-dropdown-btn');
  if (btn) btn.style.display = viable.length > 1 ? 'flex' : 'none';
}

// ─────────────────────────────────────────────────
//  Render: memory breakdown
// ─────────────────────────────────────────────────
function renderMemoryBreakdown() {
  const model = getActiveModel();
  const mem = getVariantMemory(model);
  if (!model || !mem) {
    document.getElementById('memory-card').classList.add('hidden');
    return;
  }

  const vramGb = parseInt(document.getElementById('gpu').value);
  const vramMib = getEffectiveVram();
  const ram = parseInt(document.getElementById('ram').value);
  const vision = document.getElementById('vision').value === '1';
  const ctx = getContextForModel(model, vramMib);
  const est = estimateVram(model, ctx, vision);
  if (!est) { document.getElementById('memory-card').classList.add('hidden'); return; }

  document.getElementById('memory-card').classList.remove('hidden');

  // CPU-only mode: show RAM breakdown only
  if (est.weights === 0) {
    const ramUsed = est.ramWeights;
    const ramFree = ram * 1000 - Math.max(ramUsed, 2000);
    document.getElementById('memory-usage').innerHTML = '<p style="color:var(--text-muted);margin-bottom:0.75rem">' +
      '🧠 No dedicated GPU — model runs entirely on CPU.</p>' +
      '<table class="mem-table"><tr><td colspan="3" class="mem-table-title">System RAM &mdash; ' + ram + ' GB total</td></tr>' +
      '<tr><td><span class="mem-dot" style="background:#58a6ff"></span> Model weights</td><td class="mem-num">' + Math.round(ramUsed).toLocaleString() + ' MiB</td><td class="mem-pct">' + Math.round(ramUsed / (ram * 1000) * 100) + '%</td></tr>' +
      '<tr><td><span class="mem-dot" style="background:#3fb950"></span> KV cache + buffers</td><td class="mem-num">' + Math.round(est.kvCache + est.overhead).toLocaleString() + ' MiB</td><td class="mem-pct">' + Math.round((est.kvCache + est.overhead) / (ram * 1000) * 100) + '%</td></tr>' +
      '<tr><td><span class="mem-dot" style="background:#30363d"></span> System &amp; free</td><td class="mem-num">' + Math.round(ramFree).toLocaleString() + ' MiB</td><td class="mem-pct">' + Math.round(ramFree / (ram * 1000) * 100) + '%</td></tr>' +
      '</table>' +
      '<p class="mem-note">⚡ CPU inference is slower than GPU. Use BLAS acceleration for best CPU performance.</p>';
    return;
  }

  const freeVram = vramMib - est.total;
  const pct = (val) => vramMib > 0 ? Math.round((val / vramMib) * 100) : 0;

  const segments = [
    { label: 'Model weights (GPU)', mib: est.weights, color: '#58a6ff' },
    { label: 'KV cache', mib: est.kvCache, color: '#3fb950' },
    { label: 'Overhead / buffers', mib: est.overhead, color: '#d29922' }
  ];
  if (est.mmproj > 0) segments.push({ label: 'Vision encoder', mib: est.mmproj, color: '#f0883e' });
  if (freeVram > 10 && vramMib > 0) segments.push({ label: 'Free VRAM', mib: Math.max(0, freeVram), color: '#30363d' });

  const totalBar = segments.reduce((s, seg) => s + seg.mib, 0);
  const barHtml = `<div class="mem-bar">${segments.map(seg =>
    `<div class="mem-bar-seg" style="flex:${Math.max(1, Math.round(seg.mib / totalBar * 100))};background:${seg.color};min-width:4px" title="${seg.label}: ${Math.round(seg.mib)} MiB"></div>`
  ).join('')}</div>`;

  const tableHtml = `<table class="mem-table">
    <tr><td colspan="3" class="mem-table-title">GPU VRAM — ${vramMib.toLocaleString()} MiB total</td></tr>
    ${segments.map(seg => `<tr>
      <td><span class="mem-dot" style="background:${seg.color}"></span> ${seg.label}</td>
      <td class="mem-num">${Math.round(seg.mib).toLocaleString()} MiB</td>
      <td class="mem-pct">${pct(seg.mib)}%</td>
    </tr>`).join('')}
    <tr class="mem-total"><td>Used</td><td class="mem-num">${Math.round(est.total).toLocaleString()} MiB</td><td class="mem-pct">${pct(est.total)}%</td></tr>
  </table>`;

  const ramUsed = est.ramWeights;
  const ramHtml = `<table class="mem-table">
    <tr><td colspan="3" class="mem-table-title">System RAM — ${ram} GB total</td></tr>
    ${est.ramWeights > 0 ? `<tr><td><span class="mem-dot" style="background:#58a6ff"></span> MoE CPU weights</td><td class="mem-num">${est.ramWeights.toLocaleString()} MiB</td><td class="mem-pct">${Math.round(est.ramWeights / (ram * 1000) * 100)}%</td></tr>` : ''}
    <tr><td><span class="mem-dot" style="background:#30363d"></span> System & other</td><td class="mem-num">${(ram * 1000 - Math.max(est.ramWeights, 4000)).toLocaleString()} MiB</td><td class="mem-pct">${Math.round((ram * 1000 - Math.max(est.ramWeights, 4000)) / (ram * 1000) * 100)}%</td></tr>
  </table>`;

  const modelNote = model.cpu_moe
    ? `<p class="mem-note">🧠 MoE mode: dense layers (${Math.round(est.weights).toLocaleString()} MiB) on GPU. Expert weights (${Math.round(est.ramWeights).toLocaleString()} MiB) in system RAM via <code>--n-cpu-moe</code>.</p>`
    : '';
  const note = model.entropy_profile
    ? `<p class="mem-note">📉 Entropy Path B active: KV cache reduced by ~${est.entropyPct}%.</p>`
    : '';

  document.getElementById('memory-usage').innerHTML = barHtml + tableHtml + ramHtml + modelNote + note;
}

// ─────────────────────────────────────────────────
//  Command builder
// ─────────────────────────────────────────────────
function buildCmd(model, ctx, wantVision) {
  const osKey = document.getElementById('os').value;
  const osInfo = OS_CONFIG[osKey];
  const md = osInfo ? osInfo.modelDir : '~/AI/models/';

  const f = md + getVariantFile(model);
  const cpuMoe = model.cpu_moe
    ? (ctx > model.cpu_moe_threshold ? model.cpu_moe_high : model.cpu_moe_low) : '';

  const flags = [];
  flags.push('llama-server', '-m', f);
  if (wantVision && model.has_vision) {
    flags.push('--mmproj', md + model.mmproj, '--no-mmproj-offload');
  }
  flags.push('--alias', model.alias);
  flags.push('-ngl', String(model.ngl));
  if (model.cpu_moe) flags.push('--n-cpu-moe', String(cpuMoe));
  flags.push('--ctx-size', String(ctx));
  flags.push('--flash-attn', 'on');
  flags.push('-ctk', 'q8_0', '-ctv', 'turbo3_0');
  if (model.entropy_profile) {
    flags.push('--entropy-profile', model.entropy_profile, '--entropy-prune-ratio', '2.0');
  }
  flags.push('--host', '127.0.0.1', '--port', '8080');

  return flags.join(' ');
}


function buildCalibrateCmd(model) {
  if (!model.entropy_profile) return '';
  const file = getVariantFile(model);
  return './build/bin/llama-entropy-calibrate -m ~/AI/models/' + file + ' -ngl ' + model.ngl + ' -c 4096 -b 4096';
}


function renderCommandText(blockId, text) {
  const block = document.getElementById(blockId);
  if (!block) return;
  // Wrap each space-separated token in a no-break span
  // so lines only break at spaces, never mid-token at hyphens
  var html = text.split(' ').map(function(t) {
    return '<span class="tok">' + t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span>';
  }).join(' ');
  block.innerHTML = html;
  addCopyButton(blockId, text);
}

function addCopyButton(blockId, text) {
  const block = document.getElementById(blockId);
  if (!block) return;
  const old = block.querySelector('.copy-btn');
  if (old) old.remove();

  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.title = 'Copy to clipboard';
  btn.innerHTML = '<svg aria-hidden="true" fill="currentColor" height="18px" viewBox="0 -960 960 960" width="18px"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>';
  btn.onclick = function() {
    navigator.clipboard.writeText(text).then(function() {
      btn.innerHTML = '<svg aria-hidden="true" fill="currentColor" height="18px" viewBox="0 -960 960 960" width="18px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>';
      setTimeout(function() { btn.innerHTML = '<svg aria-hidden="true" fill="currentColor" height="18px" viewBox="0 -960 960 960" width="18px"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>'; }, 2000);
    });
  };
  block.appendChild(btn);
}

// ─────────────────────────────────────────────────
//  Config updates
// ─────────────────────────────────────────────────
function updateCommand() {
  const model = getActiveModel();
  if (!model) { document.getElementById('command').textContent = ''; return; }

  const vramGb = parseInt(document.getElementById('gpu').value);
  const vramMib = getEffectiveVram();
  const vision = document.getElementById('vision').value === '1';
  const ctx = getContextForModel(model, vramMib);

  const cmdText = buildCmd(model, ctx, vision);
  renderCommandText('command', cmdText);

  // Update model path note for current OS
  const osKey = document.getElementById('os').value;
  const osInfo = OS_CONFIG[osKey];
  const pathNote = document.getElementById('model-path-note');
  if (pathNote) pathNote.textContent = osInfo ? osInfo.modelDir : '~/AI/models/';

  if (model.entropy_profile) {
    document.getElementById('entropy-card').classList.remove('hidden');
    document.getElementById('entropy-note').innerHTML =
      `One-time calibration for <code>${model.entropy_profile}</code>. Already committed in our fork.`;
    const calText = buildCalibrateCmd(model);
    renderCommandText('entropy-command', calText);
  } else {
    document.getElementById('entropy-card').classList.add('hidden');
  }

  const notesEl = document.getElementById('notes');
  if (notesEl) {
    var html = '';
    if (model.notes) {
      html += '<p style="margin-top:0.5rem">⚠️ <strong>Note:</strong> ' + model.notes;
      // Always show comparison link for any model
      html += ' <a href="#" onclick="openCompare();return false" style="font-size:0.85rem">See model comparison →</a></p>';
    }
    // Add --no-mmap tip for MoE models on systems with enough RAM
    var ram = parseInt(document.getElementById('ram').value);
    if (model.cpu_moe && ram >= 32) {
      html += '<p style="margin-top:0.4rem;font-size:0.85rem;color:var(--text-muted)">' +
        '💡 Add <code>--no-mmap</code> to load the full model into system RAM for a slight performance bump.</p>';
    }
    notesEl.innerHTML = html;
  }
}

function updateConfig() {
  const ram = parseInt(document.getElementById('ram').value);
  const vision = document.getElementById('vision').value === '1';
  const viable = getViableModels(getEffectiveVram(), ram, vision);

  if (modelPanelOpen) closeModelPanel();
  if (quantMenuOpen) closeQuantMenu();

  if (viable.length === 0) {
    document.getElementById('recommendation').classList.add('hidden');
    document.getElementById('memory-card').classList.add('hidden');
    return;
  }

  document.getElementById('recommendation').classList.remove('hidden');
  renderModelSelector();
  renderMemoryBreakdown();
  updateCommand();
  updateInstallGuide();
  setUsageTierDesc();
}

// ─────────────────────────────────────────────────
//  Comparison modal
// ─────────────────────────────────────────────────
function openCompare() {
  var frame = document.getElementById('compare-frame');
  if (frame) frame.src = 'demos/';
  var modal = document.getElementById('compare-modal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCompare() {
  var modal = document.getElementById('compare-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  // Unload iframe to save memory
  var frame = document.getElementById('compare-frame');
  if (frame) setTimeout(function() { frame.src = ''; }, 500);
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeCompare();
});

// Kick off — script is at end of body, DOM is ready
loadModels();
