// ─────────────────────────────────────────────────
//  OS & Distro configs
// ─────────────────────────────────────────────────
const OS_CONFIG = {
  'linux-ubuntu': {
    label: 'Linux (Ubuntu / Debian)', icon: '🐧',
    installPkg: 'sudo apt update && sudo apt install -y build-essential cmake',
    installCuda: 'sudo apt install -y nvidia-cuda-toolkit',
    binary: './build/bin/llama-server',
    buildCmd: `mkdir -p ~/AI && git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git ~/AI/MostlysaneAI
cd ~/AI/MostlysaneAI\nmkdir build && cd build\ncmake .. -DGGML_CUDA=ON\nmake -j$(nproc)`,
    modelDir: '~/AI/models/',
    backend: 'CUDA (NVIDIA)',
    detect: /linux.*ubuntu|debian/i
  },
  'linux-fedora': {
    label: 'Linux (Fedora / RHEL)', icon: '🐧',
    installPkg: 'sudo dnf install -y cmake gcc-c++',
    installCuda: 'sudo dnf install -y cuda-toolkit',
    binary: './build/bin/llama-server',
    buildCmd: `mkdir -p ~/AI && git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git ~/AI/MostlysaneAI
cd ~/AI/MostlysaneAI\nmkdir build && cd build\ncmake .. -DGGML_CUDA=ON\nmake -j$(nproc)`,
    modelDir: '~/AI/models/',
    backend: 'CUDA (NVIDIA)',
    detect: /fedora|rhel|centos/i
  },
  'linux-arch': {
    label: 'Linux (Arch)', icon: '🐧',
    installPkg: 'sudo pacman -S --needed base-devel cmake',
    installCuda: 'sudo pacman -S cuda',
    binary: './build/bin/llama-server',
    buildCmd: `mkdir -p ~/AI && git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git ~/AI/MostlysaneAI
cd ~/AI/MostlysaneAI\nmkdir build && cd build\ncmake .. -DGGML_CUDA=ON\nmake -j$(nproc)`,
    modelDir: '~/AI/models/',
    backend: 'CUDA (NVIDIA)',
    detect: /arch/i
  },
  macos: {
    label: 'macOS', icon: '🍎',
    installPkg: 'brew install cmake',
    installCuda: null,
    binary: './build/bin/llama-server',
    buildCmd: `mkdir -p ~/AI && git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git ~/AI/MostlysaneAI
cd ~/AI/MostlysaneAI\nmkdir build && cd build\ncmake .. -DGGML_METAL=ON\nmake -j$(sysctl -n hw.logicalcpu)`,
    modelDir: '~/AI/models/',
    backend: 'Metal (Apple GPU)',
    detect: /mac|darwin/i
  },
  windows: {
    label: 'Windows 10 / 11', icon: '🪟',
    installPkg: null, installCuda: null,
    binary: 'build\\bin\\Release\\llama-server.exe',
    buildCmd: `# Open "x64 Native Tools Command Prompt for VS 2022"\nmkdir -p ~/AI && git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git ~/AI/MostlysaneAI
cd ~/AI/MostlysaneAI\nmkdir build && cd build\ncmake .. -DGGML_CUDA=ON\nmsbuild ALL_BUILD.vcxproj /p:Configuration=Release`,
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
      { compute: 1, label: 'M1' },
      { compute: 3, label: 'M1 Pro' },
      { compute: 4, label: 'M1 Max' },
      { compute: 5, label: 'M1 Ultra' },
      { compute: 2, label: 'M2' },
      { compute: 3, label: 'M2 Pro' },
      { compute: 4, label: 'M2 Max' },
      { compute: 5, label: 'M2 Ultra' },
      { compute: 2, label: 'M3' },
      { compute: 3, label: 'M3 Pro' },
      { compute: 4, label: 'M3 Max' },
      { compute: 5, label: 'M3 Ultra' },
      { compute: 3, label: 'M4' },
      { compute: 4, label: 'M4 Pro' },
      { compute: 5, label: 'M4 Max' },
      { compute: 3, label: 'M5' },
      { compute: 4, label: 'M5 Pro' },
      { compute: 5, label: 'M5 Max' },
      { compute: 1, label: 'Intel Mac (x86_64, CPU)' }
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

// Context sizes to probe for VRAM-aware fitting (grows by ~25-50% each step)
const CONTEXT_SIZES = [
  4096, 8192, 16384, 32768, 49152, 65536, 81920, 98304, 114688,
  131072, 163840, 196608, 229376, 262144, 294912, 327680,
  360448, 393216, 425984, 458752, 491520, 524288
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
//  Entropy toggle
// ─────────────────────────────────────────────────
function isEntropyEnabled() {
  const el = document.getElementById('entropy-toggle');
  return el ? el.checked : true;
}

function onEntropyToggle() {
  updateConfig();
}

function isMtpEnabled() {
  const el = document.getElementById('mtp-toggle');
  if (!el) return false;
  return el.checked;
}

function onMtpToggle() {
  updateConfig();
}

function getSelectedVariant(model) {
  if (!model) return null;
  return getVariant(model) || (model.variants ? model.variants[0] : null);
}

function isMtpAvailable() {
  const model = getActiveModel();
  const v = getSelectedVariant(model);
  return v && v.mtp === true;
}

function updateMtpToggle() {
  const row = document.getElementById('mtp-toggle-row');
  if (!row) return;
  const model = getActiveModel();
  const v = getSelectedVariant(model);
  if (v && v.mtp === true) {
    row.style.display = '';
  } else {
    row.style.display = 'none';
    const cb = document.getElementById('mtp-toggle');
    if (cb) cb.checked = false;
  }
}

// ─────────────────────────────────────────────────
//  Effective VRAM (platform-aware)
// ─────────────────────────────────────────────────
// GPU system overhead per platform (driver, display manager, kernel reservations)
// — these are consumed before any model runs and reduce usable VRAM
const GPU_SYSTEM_OVERHEAD = {
  nvidia: 700,   // NVIDIA driver + display buffers
  apple: 7000,   // macOS Tahoe system reservation (unified memory)
  amd: 700,      // AMD ROCm driver overhead
  intel: 700,    // Intel Arc (IPEX-LLM) driver overhead
  apu: 0         // CPU-only — no dedicated GPU VRAM
};

function getEffectiveVram() {
  const platform = document.getElementById('platform').value;
  // APU/integrated: no dedicated GPU VRAM — CPU-only models only
  if (platform === 'apu') return 100;
  // Apple Silicon: unified memory — VRAM = system RAM minus system overhead
  if (platform === 'apple') {
    const ramGb = parseInt(document.getElementById('ram').value);
    const overhead = GPU_SYSTEM_OVERHEAD.apple;
    return Math.max(500, ramGb * 1000 - overhead);
  }
  const vramGb = parseInt(document.getElementById('gpu').value);
  const overhead = GPU_SYSTEM_OVERHEAD[platform] || 700;
  return Math.max(500, vramGb * 1000 - overhead);
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
  applyOsPlatform();
}

// Called when user manually changes OS selector
function onOsChange() {
  applyOsPlatform();
  updateConfig();
}

// Set platform + GPU options based on current OS selection
function applyOsPlatform() {
  const osSelect = document.getElementById('os');
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
function getComputePower() {
  const platform = document.getElementById('platform').value;
  if (platform === 'apple') {
    const gpu = document.getElementById('gpu');
    const idx = gpu.selectedIndex;
    if (idx >= 0 && gpu.options[idx] && gpu.options[idx].dataset.compute) {
      return parseInt(gpu.options[idx].dataset.compute) || 3;
    }
  }
  return 5; // Non-Apple: assume full compute power
}

function updateGpuOptions() {
  const platform = document.getElementById('platform').value;
  const cfg = PLATFORM_CONFIG[platform];
  if (!cfg) return;
  const select = document.getElementById('gpu');
  select.innerHTML = '';
  cfg.gpus.forEach(function(g) {
    var opt = document.createElement('option');
    if (g.compute !== undefined) {
      opt.value = g.compute;
      opt.dataset.compute = g.compute;
    } else {
      opt.value = g.v;
    }
    opt.textContent = g.label;
    select.appendChild(opt);
  });
  // Set a sensible default GPU (not the smallest)
  const defaults = { nvidia: 2, apple: 12, amd: 0, intel: 0, apu: 0 };
  var idx = defaults[platform] || 0;
  // NOTE: We DO NOT auto-detect Intel Mac vs Apple Silicon here.
  // navigator.platform === 'MacIntel' is NOT reliable — Chrome/Firefox
  // on M1+ also report 'MacIntel' for web compat. Only Safari reports
  // 'MacARM' on Apple Silicon. Default to the mid-range unified entry
  // and let the user pick the correct chip.
  if (select.options[idx]) select.selectedIndex = idx;

  // Update contextual hints for Apple chip selection
  updateGpuHint();
}

function updateGpuHint() {
  const platform = document.getElementById('platform').value;
  const hint = document.getElementById('gpu-hint');
  const note = document.getElementById('gpu-compute-note');
  if (!hint || !note) return;
  if (platform === 'apple') {
    hint.textContent = '(chip model)';
    var cp = getComputePower();
    var descs = { 1:'Intel Mac — CPU only, light models (Ministral, Gemma-4)', 2:'mid-range models work (Ministral, Gemma-4)', 3:'handles most models well', 4:'strong — dense & MoE both run well', 5:'beast — any model flies' };
    note.textContent = '🔋 Compute power ' + cp + '/5 — ' + (descs[cp] || '');
    note.classList.remove('hidden');
  } else {
    hint.textContent = '';
    note.classList.add('hidden');
  }
}

function onGpuChange() {
  SELECTED_MODEL_ID = null;
  updateGpuHint();
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

// Check if any variant of a model uses Q2_0 (custom fork type, Metal-incompatible)
function variantUsesQ2(model) {
  if (!model.variants) return false;
  return model.variants.some(function(v) { return v.quant === 'Q2_0'; });
}

function getVariantFile(model) {
  const v = getVariant(model);
  if (v) return v.file;
  // Fall back to first variant's file (model.file no longer at top level)
  if (model.variants && model.variants.length > 0) return model.variants[0].file;
  return model.file || model.id + '.gguf';
}

function getVariantMemory(model, wantEntropy) {
  const hasEntropy = model.entropy_profile && (wantEntropy !== false);
  const entropyPct = hasEntropy ? 30 : 0;
  const v = getVariant(model);
  if (!v) {
    // No variant selected — use first variant if available
    if (model.variants && model.variants.length > 0) {
      const v0 = model.variants[0];
      return {
        file_gb: v0.file_gb, gpu_weights_mib: v0.gpu_weights_mib,
        ram_weights_mib: v0.ram_weights_mib, kv_per_100k_mib: v0.kv_per_100k_mib,
        entropy_savings_pct: entropyPct, vision_mmproj_mib: model.mmproj ? 887 : 0,
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
    entropy_savings_pct: entropyPct,
    vision_mmproj_mib: model.mmproj ? 887 : 0,
    overhead_mib: v.overhead_mib || 400
  };
}

function getVariantMinVram(model) {
  const v = getVariant(model);
  return v ? v.min_vram_mib : model.min_vram_mib;
}

// ─── Model filename → HF download URL (mirrors install.sh) ───
function resolveDownloadUrl(file) {
  if (file.startsWith('Ternary-Bonsai-8B-Q2_0')) {
    return 'https://huggingface.co/prism-ml/Ternary-Bonsai-8B-gguf/resolve/main/Ternary-Bonsai-8B-Q2_0.gguf';
  }
  if (file.startsWith('Ternary-Bonsai-4B-Q2_0')) {
    return 'https://huggingface.co/prism-ml/Ternary-Bonsai-4B-gguf/resolve/main/Ternary-Bonsai-4B-Q2_0.gguf';
  }
  // Qwen3.6 UD (baked-in MTP): different prefix on HF
  if (file.startsWith('Qwen3.6-35B-A3B-UD-')) {
    return 'https://huggingface.co/bartowski/Qwen_Qwen3.6-35B-A3B-UD-Q3_K_XL-GGUF/resolve/main/Qwen_Qwen3.6-35B-A3B-UD-Q3_K_XL.gguf';
  }
  // Qwen3.6: HF uses Qwen_ prefix on filename
  if (file.startsWith('Qwen3.6-35B-A3B-')) {
    const quant = file.replace('Qwen3.6-35B-A3B-', '');
    return 'https://huggingface.co/bartowski/Qwen_Qwen3.6-35B-A3B-GGUF/resolve/main/Qwen_Qwen3.6-35B-A3B-' + quant;
  }
  if (file.startsWith('Qwen_Qwen3-VL-')) {
    return 'https://huggingface.co/bartowski/Qwen_Qwen3-VL-30B-A3B-Instruct-GGUF/resolve/main/' + file;
  }
  if (file.startsWith('mistralai_Ministral-')) {
    return 'https://huggingface.co/bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF/resolve/main/' + file;
  }
  if (file.startsWith('google_gemma-4-')) {
    return 'https://huggingface.co/bartowski/google_gemma-4-E2B-it-GGUF/resolve/main/' + file;
  }
  if (file === 'llama-3.2-3b-instruct-Q4_K_M.gguf') {
    return 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf';
  }
  if (file === 'microsoft_Phi-3.5-mini-instruct-Q4_K_M.gguf') {
    return 'https://huggingface.co/bartowski/Phi-3.5-mini-instruct-GGUF/resolve/main/Phi-3.5-mini-instruct-Q4_K_M.gguf';
  }
  if (file === 'Qwen2.5-1.5B-Instruct-Q8_0.gguf') {
    return 'https://huggingface.co/bartowski/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/Qwen2.5-1.5B-Instruct-Q8_0.gguf';
  }
  return null;
}

// ─── Prebuilt download + setup method toggle ───

// Detect platform for the prebuilt download button.
// Priority: 1) OS dropdown (user override), 2) browser user agent.
// This lets someone on Linux select macOS to download for a friend.
function detectBrowserPlatform() {
  var osSelect = document.getElementById('os');
  if (osSelect && osSelect.value) {
    var os = osSelect.value;
    if (os === 'macos') {
      // ARM vs Intel still depends on GPU dropdown + browser caps
      if (/MacARM/.test(navigator.platform) || /arm|aarch64/.test(navigator.userAgent || '')) return 'mac-arm';
      var gpuSelect = document.getElementById('gpu');
      if (gpuSelect && gpuSelect.selectedIndex >= 0) {
        var opt = gpuSelect.options[gpuSelect.selectedIndex];
        if (opt && opt.text && opt.text.indexOf('Intel') >= 0) return 'mac-intel';
      }
      return 'mac-arm';
    }
    if (os === 'windows') return 'win';
    if (os === 'linux') return 'linux';
  }
  // Fallback: browser user-agent detection
  const ua = navigator.userAgent || navigator.platform || '';
  if (/mac/i.test(ua) || /Macintosh|MacIntel|MacPPC|Mac68K/.test(ua)) {
    if (/MacARM/.test(navigator.platform) || /arm|aarch64/.test(ua)) return 'mac-arm';
    var gpuSelect = document.getElementById('gpu');
    if (gpuSelect && gpuSelect.selectedIndex >= 0) {
      var opt = gpuSelect.options[gpuSelect.selectedIndex];
      if (opt && opt.text && opt.text.indexOf('Intel') >= 0) return 'mac-intel';
    }
    return 'mac-arm';
  }
  if (/win/i.test(ua) || /Win32|Win64|Windows/.test(ua)) return 'win';
  if (/linux/i.test(ua)) return 'linux';
  return 'linux';
}

// Prebuilt download URL for detected platform
function getPrebuiltUrl() {
  const plat = detectBrowserPlatform();
  switch (plat) {
    case 'mac-arm':   return 'https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-macos-metal.tar.gz';
    case 'mac-intel': return 'https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-macos-intel.tar.gz';
    case 'win':       return 'https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-windows-cpu.zip';
    default:          return 'https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-linux-cpu.tar.gz';
  }
}

function getPrebuiltFilename() {
  const plat = detectBrowserPlatform();
  switch (plat) {
    case 'mac-arm':   return 'llama-server-macos-metal.tar.gz';
    case 'mac-intel': return 'llama-server-macos-intel.tar.gz';
    case 'win':       return 'llama-server-windows-cpu.zip';
    default:          return 'llama-server-linux-cpu.tar.gz';
  }
}

function getPlatformLabel() {
  const plat = detectBrowserPlatform();
  switch (plat) {
    case 'mac-arm':   return 'macOS (Apple Silicon)';
    case 'mac-intel': return 'macOS (Intel)';
    case 'win':       return 'Windows';
    default:          return 'Linux';
  }
}

function getServerBinaryName() {
  const plat = detectBrowserPlatform();
  switch (plat) {
    case 'win':  return 'llama-server.exe';
    default:     return 'llama-server';
  }
}

// Toggle between prebuilt download and build-from-source
function toggleSetupMethod(method) {
  var prebuiltSection = document.getElementById('prebuilt-section');
  var sourceSection = document.getElementById('source-section');
  var togglePrebuilt = document.getElementById('toggle-prebuilt');
  var toggleSource = document.getElementById('toggle-source');

  if (method === 'prebuilt') {
    prebuiltSection.style.display = '';
    sourceSection.style.display = 'none';
    togglePrebuilt.style.background = 'var(--accent)';
    togglePrebuilt.style.color = '#fff';
    toggleSource.style.background = 'var(--bg-card)';
    toggleSource.style.color = 'var(--text-muted)';
  } else {
    prebuiltSection.style.display = 'none';
    sourceSection.style.display = '';
    toggleSource.style.background = 'var(--accent)';
    toggleSource.style.color = '#fff';
    togglePrebuilt.style.background = 'var(--bg-card)';
    togglePrebuilt.style.color = 'var(--text-muted)';
  }
}

// ─────────────────────────────────────────────────
//  Setup script generator
// ─────────────────────────────────────────────────
function generateSetupScript() {
  var osKey = document.getElementById('os').value;
  var platform = document.getElementById('platform').value;
  var model = getActiveModel();
  var isWin = osKey === 'windows';
  var isMac = osKey.startsWith('mac');
  var prebuiltUrl = '', prebuiltPkg = '';
  if (isMac) {
    // Binary URL determined at runtime via uname -m in the generated script below.
    prebuiltUrl = 'meta';
    prebuiltPkg = 'meta';
  } else if (platform === 'nvidia') {
    prebuiltUrl = isWin ? 'https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-windows-cuda.zip' : 'https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-linux-cuda.tar.gz';
    prebuiltPkg = isWin ? 'llama-server-windows-cuda.zip' : 'llama-server-linux-cuda.tar.gz';
  } else {
    prebuiltUrl = isWin ? 'https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-windows-cpu.zip' : 'https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-linux-cpu.tar.gz';
    prebuiltPkg = isWin ? 'llama-server-windows-cpu.zip' : 'llama-server-linux-cpu.tar.gz';
  }
  if (!model) return isWin ? '@echo off\r\nerror: no model selected\r\npause' : '#!/bin/sh\necho "Error: no model selected"\nexit 1';
  var v = getSelectedVariant(model), f = v ? v.file : model.variants[0].file;
  var dlUrl = resolveDownloadUrl(f) || '';
  var ctx = getContextForModel(model, getEffectiveVram());
  var vision = document.getElementById('vision').value === '1';
  var entEnabled = isEntropyEnabled() && model.entropy_profile;
  var mtpEnabled = isMtpEnabled() && v && v.mtp;
  var isApu = platform === 'apu';
  var fl = [];
  var esc = function(s) { return s.replace(/"/g, '\\"'); };
  var fl_join = function(arr) { return arr.join(' '); };
  fl.push('$SERVER', '-m', '"$MODEL/$MODEL_FILE"');
  if (vision && model.has_vision) fl.push('--mmproj', '"$MODEL/' + model.mmproj + '"', '--no-mmproj-offload');
  fl.push('--alias', model.alias);
  if (!isApu) {
    var cpuMoe = model.cpu_moe ? (ctx > model.cpu_moe_threshold ? model.cpu_moe_high : model.cpu_moe_low) : '';
    fl.push('-ngl', String(model.ngl));
    if (model.cpu_moe) fl.push('--n-cpu-moe', String(cpuMoe));
    fl.push('--flash-attn', 'on');
    if (platform === 'apple') {
      // Metal doesn't support TurboQuant cache kernels, use q8_0 K + f16 V
      fl.push('-ctk', 'q8_0', '-ctv', 'f16');
    } else {
      fl.push('-ctk', 'q8_0', '-ctv', 'turbo3_0');
    }
    if (entEnabled) fl.push('--entropy-profile', '"$MODEL/' + model.entropy_profile + '"', '--entropy-prune-ratio', '2.0');
    if (mtpEnabled) fl.push('--spec-type', 'draft-mtp', '--spec-draft-n-max', '2');
  }
  fl.push('--ctx-size', String(ctx), '--host', '127.0.0.1', '--port', '8080');
  var flagStr = fl.join(' ');
  var fEsc = esc(f), dlEsc = esc(dlUrl), flagEsc = esc(flagStr);
  var epUrl = entEnabled ? 'https://raw.githubusercontent.com/LyndonBlack/MostlysaneAI/main/web/' + model.entropy_profile : '';
  var epFile = entEnabled ? model.entropy_profile : '';

  if (!isWin) {
    var n = '\n', d = '$';
    var s = '#!/usr/bin/env bash' + n;
    s += '# Mostlysane Local AI \u2014 All-in-One Setup' + n;
    s += '# Generated from ai.mostlysane.co.nz/getstarted' + n;
    s += 'set -euo pipefail' + n + n;
    s += 'SERVER_DIR="$HOME/AI/MostlysaneAI"' + n;
    s += 'SERVER="$SERVER_DIR/llama-server"' + n;
    s += 'MODEL="$HOME/AI/models"' + n;
    s += 'MODEL_FILE="' + fEsc + '"' + n;
    s += 'MODEL_URL="' + dlEsc + '"' + n;
    s += 'mkdir -p "$SERVER_DIR" "$MODEL"' + n + n;
    if (isMac) {
      s += '# Detect Mac architecture for the right binary' + n;
      s += 'ARCH="$(uname -m)"' + n;
      s += 'if [ "$ARCH" = "arm64" ]; then' + n;
      s += '  PREBUILT_URL="https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-macos-metal.tar.gz"' + n;
      s += '  PREBUILT_PKG="llama-server-macos-metal.tar.gz"' + n;
      s += 'else' + n;
      s += '  PREBUILT_URL="https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download/llama-server-macos-intel.tar.gz"' + n;
      s += '  PREBUILT_PKG="llama-server-macos-intel.tar.gz"' + n;
      s += 'fi' + n + n;
    } else {
      s += 'PREBUILT_URL="' + prebuiltUrl + '"' + n;
      s += 'PREBUILT_PKG="' + prebuiltPkg + '"' + n + n;
    }
    s += '# [1/4] Download prebuilt binary' + n;
    s += 'if [ ! -f "$SERVER" ]; then' + n;
    s += '  echo "[1/4] Downloading Mostlysane AI binary..."' + n;
    s += '  if curl -sfL "$PREBUILT_URL" -o "/tmp/$PREBUILT_PKG" && [ -s "/tmp/$PREBUILT_PKG" ] && file --mime-type "/tmp/$PREBUILT_PKG" | grep -q gzip; then' + n;
    s += '    echo "Extracting..."' + n;
    s += '    tar xzf "/tmp/$PREBUILT_PKG" -C "$SERVER_DIR"' + n;
    s += '    rm "/tmp/$PREBUILT_PKG"' + n;
    s += '    chmod +x "$SERVER"' + n;
    s += '  else' + n;
    s += '    echo "Prebuilt binary not available for this architecture."' + n;
    s += '    echo "Building from source instead (this takes a few minutes)..."' + n;
    s += '    rm -f "/tmp/$PREBUILT_PKG"' + n;
    s += '    cd "$SERVER_DIR"' + n;
    s += '    git clone --depth 1 https://github.com/LyndonBlack/MostlysaneAI.git src 2>/dev/null || true' + n;
    s += '    if [ -f "src/llama.cpp/build/bin/llama-server" ]; then' + n;
    s += '      cp "src/llama.cpp/build/bin/llama-server" "$SERVER"' + n;
    s += '    else' + n;
    s += '      mkdir -p "$SERVER_DIR/src" && cd "$SERVER_DIR/src"' + n;
    s += '      curl -sL https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant/archive/refs/heads/master.tar.gz | tar xz --strip-components=1' + n;
    s += '      mkdir -p build && cd build' + n;
    s += '      cmake .. && make -j$(sysctl -n hw.logicalcpu)' + n;
    s += '    fi' + n;
    s += '    [ -f "$SERVER" ] || { echo "Build failed — see instructions at ai.mostlysane.co.nz"; exit 1; }' + n;
    s += '  fi' + n;
    s += 'fi' + n + n;
    s += '# [2/4] Download model' + n;
    s += 'if [ ! -f "$MODEL/$MODEL_FILE" ]; then' + n;
    s += '  echo "[2/4] Downloading model..."' + n;
    s += '  curl -L "$MODEL_URL" -o "$MODEL/$MODEL_FILE"' + n;
    s += 'fi' + n;
    if (epUrl) {
      s += n + '# [3/4] Download entropy profile' + n;
      s += 'EP="$MODEL/' + epFile + '"' + n;
      s += 'if [ ! -f "$EP" ]; then' + n;
      s += '  echo "[3/4] Downloading entropy profile..."' + n;
      s += '  curl -sL -o "$EP" "' + epUrl + '"' + n;
      s += 'fi' + n;
    }
    s += n + '# Create run.sh for future use' + n;
    s += "cat > \"$SERVER_DIR/run.sh\" << 'RUNEOF'" + n;
    s += '#!/usr/bin/env bash' + n;
    s += '# Mostlysane Local AI \u2014 Run Script' + n;
    s += 'set -euo pipefail' + n;
    s += 'SERVER_DIR="$HOME/AI/MostlysaneAI"' + n;
    s += 'SERVER="$SERVER_DIR/llama-server"' + n;
    s += 'MODEL="$HOME/AI/models"' + n;
    s += 'MODEL_FILE="' + fEsc + '"' + n;
    s += 'MODEL_URL="' + dlEsc + '"' + n;
    s += 'mkdir -p "$MODEL"' + n;
    s += 'if [ ! -f "$MODEL/$MODEL_FILE" ]; then' + n;
    s += '  echo "Downloading model..."' + n;
    s += '  curl -L "$MODEL_URL" -o "$MODEL/$MODEL_FILE"' + n;
    s += 'fi' + n;
    if (epUrl) {
      s += 'EP="$MODEL/' + epFile + '"' + n;
      s += 'if [ ! -f "$EP" ]; then' + n;
      s += '  echo "Downloading entropy profile..."' + n;
      s += '  curl -sL -o "$EP" "' + epUrl + '"' + n;
      s += 'fi' + n;
    }
    s += 'export DYLD_LIBRARY_PATH="$SERVER_DIR:${DYLD_LIBRARY_PATH:-}"' + n;
    s += 'echo "Starting server..."' + n;
    s += '(' + flagEsc + ')' + n;
    s += 'exit $?' + n;
    s += 'RUNEOF' + n;
    s += 'chmod +x "$SERVER_DIR/run.sh"' + n + n;
    s += '# Create desktop shortcut' + n;
    s += 'DESKTOP="$HOME/Desktop"' + n;
    s += 'if [ "$(uname)" = "Darwin" ]; then' + n;
    s += '  # macOS: .command file (double-click opens Terminal)' + n;
    s += '  SHORTCUT="$DESKTOP/MostlysaneLocalAI.command"' + n;
    s += "  cat > \"$SHORTCUT\" << EOF" + n;
    s += '#!/usr/bin/env bash' + n;
    s += 'export DYLD_LIBRARY_PATH="$HOME/AI/MostlysaneAI:${DYLD_LIBRARY_PATH:-}"' + n;
    s += 'cd "$HOME/AI/MostlysaneAI"' + n;
    s += './run.sh' + n;
    s += 'EOF' + n;
    s += '  chmod +x "$SHORTCUT"' + n;
    s += 'elif [ "$(uname)" = "Linux" ]; then' + n;
    s += '  # Linux: .desktop file' + n;
    s += '  SHORTCUT="$DESKTOP/MostlysaneLocalAI.desktop"' + n;
    s += "  cat > \"$SHORTCUT\" << EOF" + n;
    s += '[Desktop Entry]' + n;
    s += 'Type=Application' + n;
    s += 'Name=Mostlysane Local AI' + n;
    s += "Exec=$HOME/AI/MostlysaneAI/run.sh" + n;
    s += 'Terminal=true' + n;
    s += 'Categories=Utility;' + n;
    s += 'EOF' + n;
    s += '  chmod +x "$SHORTCUT"' + n;
    s += 'fi' + n + n;
    s += '# [4/4] Start server' + n;
    s += 'echo "[4/4] Starting server..."' + n;
    s += 'exec "$SERVER_DIR/run.sh"' + n;
    return s;
  }

  // Windows .bat
  var w = '\r\n';
  var bat = '@echo off' + w;
  bat += 'REM Mostlysane Local AI \u2014 All-in-One Setup' + w;
  bat += 'setlocal enabledelayedexpansion' + w + w;
  bat += 'set SERVER_DIR=%USERPROFILE%\\AI\\MostlysaneAI' + w;
  bat += 'set MODEL_DIR=%USERPROFILE%\\AI\\models' + w;
  bat += 'set MODEL_FILE=' + f + w;
  bat += 'set MODEL_URL=' + dlUrl + w;
  bat += 'set SERVER=%SERVER_DIR%\\llama-server.exe' + w;
  bat += 'set PREBUILT_URL=' + prebuiltUrl + w;
  bat += 'set PREBUILT_PKG=' + prebuiltPkg + w;
  bat += 'if not exist "%SERVER_DIR%" mkdir "%SERVER_DIR%"' + w;
  bat += 'if not exist "%MODEL_DIR%" mkdir "%MODEL_DIR%"' + w + w;
  bat += 'REM [1/4] Download prebuilt' + w;
  bat += 'if not exist "%SERVER%" (' + w;
  bat += '    echo [1/4] Downloading Mostlysane AI binary...' + w;
  bat += '    curl -L "%PREBUILT_URL%" -o "%TEMP%\\%PREBUILT_PKG%"' + w;
  bat += '    tar -xf "%TEMP%\\%PREBUILT_PKG%" -C "%SERVER_DIR%"' + w;
  bat += '    del "%TEMP%\\%PREBUILT_PKG%"' + w;
  bat += ')' + w + w;
  bat += 'REM [2/4] Download model' + w;
  bat += 'if not exist "%MODEL_DIR%\\%MODEL_FILE%" (' + w;
  bat += '    echo [2/4] Downloading model...' + w;
  bat += '    curl -L "%MODEL_URL%" -o "%MODEL_DIR%\\%MODEL_FILE%"' + w;
  bat += ')' + w;
  if (epUrl) {
    bat += w + 'REM [3/4] Download entropy profile' + w;
    bat += 'set EP=%MODEL_DIR%\\' + epFile + w;
    bat += 'if not exist "%EP%" (' + w;
    bat += '    echo [3/4] Downloading profile...' + w;
    bat += '    curl -sL -o "%EP%" "' + epUrl + '"' + w;
    bat += ')' + w;
  }
  bat += w + 'REM Create desktop shortcut' + w;
  bat += 'set SHORTCUT=%USERPROFILE%\\Desktop\\MostlysaneLocalAI.bat' + w;
  bat += 'if not exist "%SHORTCUT%" (' + w;
  bat += '    echo Creating desktop shortcut...' + w;
  bat += '    echo @echo off > "%SHORTCUT%"' + w;
  bat += '    echo cd /d "%SERVER_DIR%" >> "%SHORTCUT%"' + w;
  bat += '    echo start "" llama-server.exe -m "%MODEL_DIR%\\%MODEL_FILE%" --alias ' + model.alias + ' --ctx-size ' + ctx + ' --host 127.0.0.1 --port 8080 >> "%SHORTCUT%"' + w;
  bat += ')' + w + w;
  bat += 'REM [4/4] Start server' + w;
  bat += 'echo Starting server...' + w;
  bat += 'start "" "%SERVER%" -m "%MODEL_DIR%\\%MODEL_FILE%" --alias ' + model.alias + ' --ctx-size ' + ctx + ' --host 127.0.0.1 --port 8080' + w;
  bat += 'echo Server started. Open http://localhost:8080' + w;
  bat += 'pause' + w;
  return bat;
}

// Render the prebuilt download area
function renderPrebuiltDownload() {
  var area = document.getElementById('prebuilt-download-area');
  if (!area) return;
  var osKey = document.getElementById('os').value;
  var isWin = osKey === 'windows';
  var isLinux = osKey.startsWith('linux');
  var osLabel = isWin ? 'Windows' : isLinux ? 'Linux' : 'macOS';
  var scriptContent = generateSetupScript();
  var scriptName = isWin ? 'setup.bat' : 'setup.sh';
  var blob = new Blob([scriptContent], {type:'text/plain;charset=utf-8'});
  var blobUrl = URL.createObjectURL(blob);
  area.innerHTML = '' +
    '<a href="' + blobUrl + '" download="' + scriptName + '" style="display:inline-block;padding:0.65rem 1.5rem;border-radius:8px;background:var(--accent);color:#fff;font-weight:600;font-size:1rem;text-decoration:none;margin-bottom:0" onclick="setTimeout(function(){URL.revokeObjectURL(\'' + blobUrl + '\')},1000)">' +
    '\u2b07  Download setup.' + (isWin ? 'bat' : 'sh') + ' for ' + osLabel +
    '</a>';

  // Fill the instructions box
  var instrP = document.querySelector('#prebuilt-instructions p');
  var cmdBox = document.getElementById('prebuilt-run-cmd');
  if (instrP) {
    if (isWin) {
      instrP.textContent = 'Double-click setup.bat, or run from terminal:';
    } else if (isLinux) {
      instrP.textContent = 'Run in your terminal, or right-click \u2192 Properties \u2192 Permissions \u2192 Allow executing as program:';
    } else {
      instrP.textContent = 'Double-click setup.sh to run, or use the terminal:';
    }
  }
  if (cmdBox) {
    if (isWin) {
      cmdBox.innerHTML = '<span class="tok">setup.bat</span>';
    } else if (isLinux) {
      cmdBox.innerHTML = '<span class="tok">chmod</span> <span class="tok">+x</span> <span class="tok">setup.sh</span> <span class="tok">&&</span> <span class="tok">./setup.sh</span>';
    } else {
      cmdBox.innerHTML = '<span class="tok">chmod</span> <span class="tok">+x</span> <span class="tok">setup.sh</span> <span class="tok">&&</span> <span class="tok">./setup.sh</span>';
    }
    addCopyButton('prebuilt-run-cmd', cmdBox.textContent.trim());
  }
}
function downloadAsFile(btn, filename, content) {
  if (!btn) return;
  btn.onclick = function(e) {
    e.preventDefault();
    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
  };
}

// ─────────────────────────────────────────────────
//  Install guide
// ─────────────────────────────────────────────────
function updateInstallGuide() {
  const osKey = document.getElementById('os').value;
  const os = OS_CONFIG[osKey];
  if (!os) return;

  // Populate one-liner installer commands (model-aware)
  const activeModel = getActiveModel();
  const variantFile = activeModel ? getVariantFile(activeModel) : '';
  var nixCmd = variantFile
    ? 'curl -sSL https://lyndonblack.github.io/MostlysaneAI/install/install.sh | bash -s -- --model ' + variantFile
    : 'curl -sSL https://lyndonblack.github.io/MostlysaneAI/install/install.sh | bash';
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
  // Intel Macs: CPU-only (no Metal), Apple Silicon: Metal
  const isIntelMac = isMac && document.getElementById('gpu') &&
    document.getElementById('gpu').options[document.getElementById('gpu').selectedIndex] &&
    (document.getElementById('gpu').options[document.getElementById('gpu').selectedIndex].text || '').indexOf('Intel') >= 0;
  var backendFlag;
  if (isMac) {
    backendFlag = isIntelMac ? '' : 'GGML_METAL=ON';
  } else {
    backendFlag = platCfg && platCfg.backend.indexOf('CUDA') >= 0 ? 'GGML_CUDA=ON' : 'GGML_VULKAN=ON';
  }
  const buildCmd = os.shell === 'powershell'
    ? 'cmake .. -D' + backendFlag + '\nmsbuild ALL_BUILD.vcxproj /p:Configuration=Release'
    : 'cmake .. -D' + backendFlag + '\nmake -j$(nproc)';

  html += `<li class="step">
    <div class="step-title">Clone &amp; Build</div>
    <div class="step-desc">Clone the Mostlysane research fork and compile.</div>
    <div class="command-block small">${os.buildCmd}</div>
  </li>`;

  // Show backend note under build step if not CUDA/Metal
  if (isIntelMac) {
    html += '<p class="step-note" style="margin:-0.5rem 0 1rem 2.2rem">Using <strong>CPU (Apple Accelerate)</strong> backend.</p>';
  } else if (platCfg && platCfg.backend.indexOf('CUDA') < 0 && platCfg.backend.indexOf('Metal') < 0 && !isMac) {
    html += '<p class="step-note" style="margin:-0.5rem 0 1rem 2.2rem">Using <strong>' + platCfg.backend + '</strong> backend.</p>';
  }

  if (model) {
    const f = getVariantFile(model);
    const dlUrl = resolveDownloadUrl(f) || '';
    html += `<li class="step">
      <div class="step-title">Download the Model</div>
      <div class="step-desc">Download <strong>${f}</strong> into your models directory.</div>
      <div class="command-block small">mkdir -p ${os.modelDir}
curl -L -o ${os.modelDir}${f} ${dlUrl}</div>
    </li>`;
  }

  if (model) {
    const backendLabel = isIntelMac ? 'CPU (Apple Accelerate)' : (platCfg ? platCfg.backend : 'Unknown');
    const showNvidiaCheck = platCfg && platCfg.backend.indexOf('CUDA') >= 0 && !isMac;
    html += `<li class="step">
      <div class="step-title">Run It</div>
      <div class="step-desc">Start the server with your generated config.</div>
      <div class="step-note">Backend: <strong>${backendLabel}</strong>${showNvidiaCheck ? ' | Check nvidia-smi' : ''}</div>
    </li>`;
  }

  html += `</ol><hr><p style="font-size:0.9rem;color:var(--text-muted)">
    💡 Prefer handsfree? Use the <a href="#" onclick="document.getElementById('quickstart-card').scrollIntoView({behavior:'smooth'});return false" style="color:var(--accent)">one-liner installer</a> at the top of the page.
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
function findMaxContext(model, vramMib, wantVision, maxDesired) {
  const maxFit = model.max_ctx || 524288;
  const upperBound = Math.min(maxDesired || Infinity, maxFit);
  
  const platform = document.getElementById('platform').value;
  // CPU-only mode or APU: context isn't VRAM-bound
  const mem = getVariantMemory(model, isEntropyEnabled());
  if (mem && (mem.gpu_weights_mib === 0 || platform === 'apu')) return Math.min(maxFit, upperBound);
  
  // Probe context sizes to find the largest that fits
  let best = 4096;
  for (let i = 0; i < CONTEXT_SIZES.length; i++) {
    const ctx = CONTEXT_SIZES[i];
    if (ctx > upperBound) break;
    if (ctx > maxFit) break;
    const est = estimateVram(model, ctx, wantVision, isEntropyEnabled());
    if (est && est.total <= vramMib * 0.95) {
      best = ctx;
    } else {
      // Once one fails, no larger size will fit
      break;
    }
  }
  // If none of the preset sizes hit the upper bound exactly, try the bound itself
  if (best < upperBound && best < maxFit) {
    const maxEst = estimateVram(model, upperBound, wantVision, isEntropyEnabled());
    if (maxEst && maxEst.total <= vramMib * 0.95) {
      best = upperBound;
    }
  }
  return best;
}

function getContextForModel(model, vramMib) {
  const tier = getUsageTier();
  const tierInfo = USAGE_TIERS.find(x => x.id === tier);
  const tierCtx = tierInfo ? tierInfo.maxContext : 65536;
  const vision = document.getElementById('vision').value === '1';
  
  // For tiers 4-5: find the max context that fits in VRAM, bounded by model max
  if (tier >= 4) {
    return findMaxContext(model, vramMib, vision, model.max_ctx);
  }
  
  // For tiers 1-3: prefer tier context, but reduce if VRAM constrained
  const vramCtx = findMaxContext(model, vramMib, vision, tierCtx);
  return Math.min(tierCtx, Math.max(vramCtx, 4096));
}

function estimateVram(model, ctx, wantVision, wantEntropy) {
  const mem = getVariantMemory(model, wantEntropy);
  if (!mem) return null;

  const platform = document.getElementById('platform').value;
  const isApu = platform === 'apu';

  // On APU/integrated, GPU weights move to system RAM
  const gpuWeights = isApu ? 0 : mem.gpu_weights_mib;
  const ramWeights = isApu ? mem.gpu_weights_mib + mem.ram_weights_mib : mem.ram_weights_mib;

  const kvRaw = mem.kv_per_100k_mib * (ctx / 100000);
  const kvWithEntropy = kvRaw * (1 - mem.entropy_savings_pct / 100);
  const mmprojMib = (wantVision && model.has_vision) ? mem.vision_mmproj_mib : 0;

  const mtpOverhead = (isMtpEnabled() && getSelectedVariant(model) && getSelectedVariant(model).mtp)
    ? getSelectedVariant(model).mtp_overhead_mib || 900
    : 0;

  return {
    total: gpuWeights + kvWithEntropy + mmprojMib + mem.overhead_mib + mtpOverhead,
    weights: gpuWeights,
    kvCache: kvWithEntropy,
    mmproj: mmprojMib,
    overhead: mem.overhead_mib,
    mtpOverhead: mtpOverhead,
    ramWeights: ramWeights,
    entropyPct: mem.entropy_savings_pct
  };
}

function getViableModels(vramMib, ramGb, wantVision) {
  return MODELS
    .filter(m => ramGb >= m.min_ram_gb)
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
  const est = estimateVram(model, ctx, vision, isEntropyEnabled());
  const platform = document.getElementById('platform').value;
  const isApu = platform === 'apu';
  const isCpuOnly = est && (est.weights === 0 || isApu);
  let fitClass, fitLabel;
  if (isCpuOnly) {
    // CPU-only / APU: check fit against system RAM
    const totalRam = parseInt(document.getElementById('ram').value) * 1000;
    const fitsRam = est && est.ramWeights <= totalRam * 0.95;
    fitClass = fitsRam ? 'badge-green' : 'badge-red';
    fitLabel = fitsRam ? 'Fits' : 'Over';
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
    const quantName = currentQuant ? currentQuant.quant : model.variants[0].quant;
    quantHtml = `<span class="model-option-quant" id="quant-${model.id}" onclick="event.stopPropagation();toggleQuantMenu('${model.id}')">
      ${quantName} ▾
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
    const kvMult = (model.entropy_profile && isEntropyEnabled()) ? 0.7 : 1.0;
    const mem = {
      total: v.gpu_weights_mib + (v.kv_per_100k_mib * (ctx / 100000) * kvMult) + (vision && model.has_vision ? 887 : 0) + (v.overhead_mib || 400),
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
    // Auto-enable MTP toggle when selecting an MTP variant
    const model = MODELS.find(m => m.id === modelId);
    const v = model ? model.variants.find(x => x.quant === quant) : null;
    if (v && v.mtp === true) {
      const cb = document.getElementById('mtp-toggle');
      if (cb) cb.checked = true;
    }
    renderModelSelector();
    updateMtpToggle();
    renderMemoryBreakdown();
    updateCommand();
    updateInstallGuide();
    renderPrebuiltDownload();
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
  renderPrebuiltDownload();
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
    var platform = document.getElementById('platform').value;
    const computePower = getComputePower();
    viable.sort(function(a, b) {
      // Apple: chip power affects model type preference
      if (platform === 'apple') {
        // Push Q2_0 models to bottom (custom fork type, Metal can't handle)
        var aCompat = !variantUsesQ2(a);
        var bCompat = !variantUsesQ2(b);
        if (aCompat && !bCompat) return -1;
        if (!aCompat && bCompat) return 1;
        // Weak chips: dense models preferred (MoE expert layers bottleneck on slow CPU cores)
        if (computePower <= 2) {
          if (!a.cpu_moe && b.cpu_moe) return -1;
          if (a.cpu_moe && !b.cpu_moe) return 1;
        }
      }
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
  // Hide switch button if only one model to offer
  if (btn) btn.style.display = viable.length > 1 ? '' : 'none';
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

  const platform = document.getElementById('platform').value;
  let rawVram;
  if (platform === 'apu') {
    rawVram = 0;
  } else if (platform === 'apple') {
    // Apple Silicon uses unified memory — from RAM dropdown
    rawVram = parseInt(document.getElementById('ram').value) * 1000;
  } else {
    rawVram = parseInt(document.getElementById('gpu').value) * 1000;
  }
  const vramMib = getEffectiveVram();
  const systemOverhead = platform !== 'apu' ? rawVram - vramMib : 0;
  const ram = parseInt(document.getElementById('ram').value);
  const vision = document.getElementById('vision').value === '1';
  const ctx = getContextForModel(model, vramMib);
  const est = estimateVram(model, ctx, vision, isEntropyEnabled());
  if (!est) { document.getElementById('memory-card').classList.add('hidden'); return; }

  document.getElementById('memory-card').classList.remove('hidden');

  // CPU-only mode or APU/integrated: show RAM breakdown only
  const isApuMem = platform === 'apu';
  if (est.weights === 0 || isApuMem) {
    const ramUsed = est.ramWeights;
    const fullRam = ram * 1000;
    const osKey = document.getElementById('os').value;
    const sysReserve = osKey.startsWith('linux') ? 3000 : 4000;
    const ramFree = fullRam - sysReserve - Math.max(ramUsed, 2000);
    document.getElementById('memory-usage').innerHTML = '<p style="color:var(--text-muted);margin-bottom:0.75rem">' +
      '🧠 No dedicated GPU — model runs entirely on CPU.</p>' +
      '<table class="mem-table"><tr><td colspan="3" class="mem-table-title">System RAM &mdash; ' + ram + ' GB total (' + sysReserve.toLocaleString() + ' MiB reserved by OS)</td></tr>' +
      '<tr><td><span class="mem-dot" style="background:#7a3b8e"></span> OS / display reservation</td><td class="mem-num">' + sysReserve.toLocaleString() + ' MiB</td><td class="mem-pct">' + Math.round(sysReserve / fullRam * 100) + '%</td></tr>' +
      '<tr><td><span class="mem-dot" style="background:#58a6ff"></span> Model weights</td><td class="mem-num">' + Math.round(ramUsed).toLocaleString() + ' MiB</td><td class="mem-pct">' + Math.round(ramUsed / fullRam * 100) + '%</td></tr>' +
      '<tr><td><span class="mem-dot" style="background:#3fb950"></span> KV cache + buffers</td><td class="mem-num">' + Math.round(est.kvCache + est.overhead).toLocaleString() + ' MiB</td><td class="mem-pct">' + Math.round((est.kvCache + est.overhead) / fullRam * 100) + '%</td></tr>' +
      '<tr><td><span class="mem-dot" style="background:#30363d"></span> System &amp; free</td><td class="mem-num">' + Math.round(ramFree).toLocaleString() + ' MiB</td><td class="mem-pct">' + Math.round(ramFree / fullRam * 100) + '%</td></tr>' +
      '</table>' +
      '<p class="mem-note">⚡ CPU inference is slower than GPU. Use BLAS acceleration for best CPU performance.</p>' +
      '<p class="mem-note">💡 Integrated GPU shares this memory. The OS reservation keeps ~' + sysReserve.toLocaleString() + ' MiB for display and background tasks.</p>';
    return;
  }

  const freeVram = vramMib - est.total;
  const pct = (val) => rawVram > 0 ? Math.round((val / rawVram) * 100) : 0;

  const segments = [
    { label: 'Model weights (GPU)', mib: est.weights, color: '#58a6ff' },
    { label: 'KV cache', mib: est.kvCache, color: '#3fb950' },
    { label: 'Overhead / buffers', mib: est.overhead, color: '#d29922' }
  ];
  if (est.mtpOverhead && est.mtpOverhead > 0) segments.push({ label: 'MTP Fast Gen (spec context + head)', mib: est.mtpOverhead, color: '#bc8cff' });
  if (est.mmproj > 0) segments.push({ label: 'Vision encoder', mib: est.mmproj, color: '#f0883e' });
  if (systemOverhead > 10) segments.push({ label: 'GPU system reservation', mib: systemOverhead, color: '#7a3b8e' });
  if (freeVram > 10 && rawVram > 0) segments.push({ label: 'Free VRAM', mib: Math.max(0, freeVram), color: '#30363d' });

  const totalBar = segments.reduce((s, seg) => s + seg.mib, 0);
  const barHtml = `<div class="mem-bar">${segments.map(seg =>
    `<div class="mem-bar-seg" style="flex:${Math.max(1, Math.round(seg.mib / totalBar * 100))};background:${seg.color};min-width:4px" title="${seg.label}: ${Math.round(seg.mib)} MiB"></div>`
  ).join('')}</div>`;

  const tableHtml = `<table class="mem-table">
    <tr><td colspan="3" class="mem-table-title">GPU VRAM — ${rawVram.toLocaleString()} MiB total${systemOverhead > 10 ? ` (${systemOverhead.toLocaleString()} MiB reserved by OS)` : ""}</td></tr>
    ${segments.map(seg => `<tr>
      <td><span class="mem-dot" style="background:${seg.color}"></span> ${seg.label}</td>
      <td class="mem-num">${Math.round(seg.mib).toLocaleString()} MiB</td>
      <td class="mem-pct">${pct(seg.mib)}%</td>
    </tr>`).join('')}
    <tr class="mem-total"><td>Used</td><td class="mem-num">${Math.round(est.total + systemOverhead).toLocaleString()} MiB</td><td class="mem-pct">${pct(est.total + systemOverhead)}%</td></tr>
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
  const note = (model.entropy_profile && isEntropyEnabled())
    ? `<p class="mem-note">📉 Entropy Path B active: KV cache reduced by ~${est.entropyPct}%.</p>`
    : model.entropy_profile
      ? `<p class="mem-note">📉 Entropy Path B available but <strong>disabled</strong>. Enable it for ~30% less KV cache.</p>`
      : '';
  const mtpNote = (isMtpEnabled() && est.mtpOverhead > 0)
    ? `<p class="mem-note">🚀 MTP Fast Generation active — adds ~${Math.round(est.mtpOverhead).toLocaleString()} MiB VRAM overhead for spec context + head.</p>`
    : '';

  document.getElementById('memory-usage').innerHTML = barHtml + tableHtml + ramHtml + modelNote + note + mtpNote;
}

// ─────────────────────────────────────────────────
//  Command builder
// ─────────────────────────────────────────────────
function buildCmd(model, ctx, wantVision) {
  const osKey = document.getElementById('os').value;
  const osInfo = OS_CONFIG[osKey];
  const md = osInfo ? osInfo.modelDir : '~/AI/models/';
  const platform = document.getElementById('platform').value;
  const isApu = platform === 'apu';

  const BINARY = '~/AI/MostlysaneAI/build/bin/llama-server';
  const f = md + getVariantFile(model);

  const flags = [];
  flags.push(BINARY, '-m', f);
  if (wantVision && model.has_vision) {
    flags.push('--mmproj', md + model.mmproj, '--no-mmproj-offload');
  }
  flags.push('--alias', model.alias);
  if (!isApu) {
    // GPU-specific flags
    const cpuMoe = model.cpu_moe
      ? (ctx > model.cpu_moe_threshold ? model.cpu_moe_high : model.cpu_moe_low) : '';
    flags.push('-ngl', String(model.ngl));
    if (model.cpu_moe) flags.push('--n-cpu-moe', String(cpuMoe));
    flags.push('--flash-attn', 'on');
    // TurboQuant K/V and entropy: skip on Apple/Metal (Metal doesn't support TurboQuant types)
    if (platform === 'apple') {
      flags.push('--no-warmup', '-ctk', 'f16', '-ctv', 'f16');
    } else {
      flags.push('-ctk', 'q8_0', '-ctv', 'turbo3_0');
      if (model.entropy_profile && isEntropyEnabled()) {
        flags.push('--entropy-profile', model.entropy_profile, '--entropy-prune-ratio', '2.0');
      }
      if (isMtpEnabled() && getSelectedVariant(model) && getSelectedVariant(model).mtp) {
        flags.push('--spec-type', 'draft-mtp', '--spec-draft-n-max', '2');
      }
    }
  }
  flags.push('--ctx-size', String(ctx));
  flags.push('--host', '127.0.0.1', '--port', '8080');

  return flags.join(' ');
}


function buildCalibrateCmd(model) {
  if (!model.entropy_profile) return '';
  const file = getVariantFile(model);
  return '~/AI/MostlysaneAI/build/bin/llama-entropy-calibrate -m ~/AI/models/' + file + ' -ngl ' + model.ngl + ' -c 4096 -b 4096';
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

  // Update context size display
  const ctxDisplay = document.getElementById('ctx-display');
  if (ctxDisplay) ctxDisplay.textContent = (ctx / 1000).toFixed(0) + 'K';

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
    const activeV = getSelectedVariant(model);
    if (activeV && activeV.notes) {
      html += '<p style="margin-top:0.4rem;font-size:0.85rem;color:var(--accent)">✨ <strong>' + activeV.quant + ':</strong> ' + activeV.notes + '</p>';
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
  updateMtpToggle();
  renderMemoryBreakdown();
  updateCommand();
  updateInstallGuide();
  setUsageTierDesc();
  renderPrebuiltDownload();
}

// ─────────────────────────────────────────────────
//  Comparison modal
// ─────────────────────────────────────────────────
function openCompare() {
  var frame = document.getElementById('compare-frame');
  if (frame) frame.src = 'demos/comparison.html';
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
