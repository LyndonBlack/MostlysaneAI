#!/usr/bin/env bash
# Mostlysane Local AI — One-liner installer
#
# Hybrid: quick-start with prebuilt binary, or build from source.
#
# Usage:
#   curl -sSL https://lyndonblack.github.io/MostlysaneAI/install/install.sh | bash
#   curl -sSL ... | bash -s -- --model Qwen3.6-35B-A3B-Q5_K_M.gguf
#   curl -sSL ... | bash -s -- --build                           (force source build)
#   curl -sSL ... | bash -s -- --model foo.gguf --start
#
# Model downloads from bartowski/prism-ml on HuggingFace.
# Prebuilt binaries from GitHub Releases.

set -euo pipefail

# ─────────────────────────────────────────────
#  Config
# ─────────────────────────────────────────────
REPO_URL="https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git"
REPO_BRANCH="turboternary"
RAW_BASE="https://raw.githubusercontent.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant/${REPO_BRANCH}"
RELEASE_BASE="https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant/releases/latest/download"

BUILD_DIR="$HOME/AI/MostlysaneAI"
MODEL_DIR="$HOME/AI/models"
BIN_DIR="$BUILD_DIR/build/bin"

DEFAULT_MODEL="Qwen3.6-35B-A3B-Q5_K_M.gguf"
MODEL="$DEFAULT_MODEL"
START_SERVER=false
BUILD_MODE=false    # --build flag forces source compilation

# ─────────────────────────────────────────────
#  Model → Download URL lookup
#  Maps GGUF filenames to real HF download URLs
# ─────────────────────────────────────────────
resolve_download_url() {
  local name="$1"
  case "$name" in
    Ternary-Bonsai-8B-Q2_0.gguf)
      echo "https://huggingface.co/prism-ml/Ternary-Bonsai-8B-gguf/resolve/main/Ternary-Bonsai-8B-Q2_0.gguf" ;;
    Ternary-Bonsai-4B-Q2_0.gguf)
      echo "https://huggingface.co/prism-ml/Ternary-Bonsai-4B-gguf/resolve/main/Ternary-Bonsai-4B-Q2_0.gguf" ;;
    Qwen3.6-35B-A3B-*.gguf)
      local quant="${name#Qwen3.6-35B-A3B-}"
      echo "https://huggingface.co/bartowski/Qwen_Qwen3.6-35B-A3B-GGUF/resolve/main/Qwen_Qwen3.6-35B-A3B-${quant}" ;;
    Qwen_Qwen3-VL-*.gguf)
      echo "https://huggingface.co/bartowski/Qwen_Qwen3-VL-30B-A3B-Instruct-GGUF/resolve/main/${name}" ;;
    mistralai_Ministral-*.gguf)
      echo "https://huggingface.co/bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF/resolve/main/${name}" ;;
    google_gemma-4-*.gguf)
      echo "https://huggingface.co/bartowski/google_gemma-4-E2B-it-GGUF/resolve/main/${name}" ;;
    llama-3.2-3b-instruct-Q4_K_M.gguf)
      echo "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf" ;;
    microsoft_Phi-3.5-mini-instruct-Q4_K_M.gguf)
      echo "https://huggingface.co/bartowski/Phi-3.5-mini-instruct-GGUF/resolve/main/Phi-3.5-mini-instruct-Q4_K_M.gguf" ;;
    Qwen2.5-1.5B-Instruct-Q8_0.gguf)
      echo "https://huggingface.co/bartowski/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/Qwen2.5-1.5B-Instruct-Q8_0.gguf" ;;
    *)
      echo ""; return 1 ;;
  esac
}

# ─── Entropy profile filename for a given model ───
resolve_entropy_file() {
  local name="$1"
  case "$name" in
    Qwen3.6-35B-A3B*.gguf)       echo "entropy_profile_qwen_book.json" ;;
    Qwen_Qwen3-VL*.gguf)         echo "entropy_profile_qwen3vl_book.json" ;;
    mistralai_Ministral*.gguf)   echo "" ;;
    google_gemma-4*.gguf)        echo "" ;;
    Ternary-Bonsai-8B*.gguf)     echo "entropy_profile_bonsai.json" ;;
    Ternary-Bonsai-4B*.gguf)     echo "" ;;
    *)                            echo "" ;;
  esac
}

# ─── Prebuilt binary URL for this platform ───
resolve_binary_url() {
  local plat="$1" arch="$2"
  local variant=""
  case "$plat" in
    linux)
      if command -v nvidia-smi &>/dev/null; then
        variant="linux-cuda"
      else
        variant="linux-cpu"
      fi ;;
    macos)  variant="macos-metal" ;;
    *)      echo ""; return 1 ;;
  esac
  echo "${RELEASE_BASE}/llama-server-${variant}.tar.gz"
}

# ─── Pretty box printer ───
print_box() {
  local title="$1"
  local width=66
  local pad=""
  for ((i=0; i<(width-${#title}-4)/2; i++)); do pad+=" "; done
  echo "┌$(printf '─%.0s' $(seq 1 $width))┐"
  echo "│${pad} ${title} ${pad}│"
  echo "└$(printf '─%.0s' $(seq 1 $width))┘"
}

print_info() {
  local label="$1" val="$2"
  printf "  %-16s %s\n" "$label" "$val"
}

# ─────────────────────────────────────────────
#  Parse CLI arguments
# ─────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --model)   MODEL="$2";   shift 2 ;;
    --start)   START_SERVER=true; shift ;;
    --build)   BUILD_MODE=true; shift ;;
    --help|-h)
      echo "Mostlysane Local AI Installer"
      echo ""
      echo "Usage:"
      echo "  $0                          Quick start (default)"
      echo "  $0 --model <filename.gguf>  Install with a specific model"
      echo "  $0 --build                  Build from source instead"
      echo "  $0 --model foo.gguf --start Install + start server"
      exit 0 ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
done

# ─────────────────────────────────────────────
#  Set up binary path (printable helper)
# ─────────────────────────────────────────────
LLAMA_BIN="$BIN_DIR/llama-server"

# ─────────────────────────────────────────────
#  Welcome
# ─────────────────────────────────────────────
clear 2>/dev/null || true
print_box "🦄 Mostlysane Local AI"
echo "│  Don't go crazy. Stay Mostlysane."
echo "└─────────────────────────────────────────────────────────────────────┘"
echo ""

# ─── Detect OS ───
OS="$(uname -s)"
ARCH="$(uname -m)"
case "$OS" in
  Linux*)  PLATFORM="linux"  ;;
  Darwin*) PLATFORM="macos"  ;;
  *)
    echo "❌ Unsupported OS: $OS — Linux (x86_64) and macOS (ARM64) only."
    exit 1 ;;
esac

# Validate model download URL
MODEL_URL="$(resolve_download_url "$MODEL")"
if [ -z "$MODEL_URL" ]; then
  echo "❌ Unknown model: $MODEL"
  echo "   Common models: Qwen3.6-35B-A3B-Q5_K_M.gguf, Ministral-3-3B-Q5_K_L.gguf"
  exit 1
fi

echo "📋  System:   $PLATFORM ($ARCH)"
echo "📋  Model:    $MODEL"
echo "📋  Install:  $BUILD_DIR"  # binary + config location
echo "📋  Models:   $MODEL_DIR"
echo ""

# ─────────────────────────────────────────────
#  Step 1: Get the binary (quick or build)
# ─────────────────────────────────────────────
mkdir -p "$BIN_DIR"

if [ -f "$LLAMA_BIN" ] && [ "$BUILD_MODE" = false ]; then
  echo "✅  Binary already exists at $LLAMA_BIN"
  echo ""

elif [ "$BUILD_MODE" = false ]; then
  # ── Quick start: download prebuilt ──
  BINARY_URL="$(resolve_binary_url "$PLATFORM" "$ARCH")"

  echo "┌─────────────────────────────────────────────────────────────────────┐"
  echo "│  🚀  Quick Start (recommended)                                      │"
  echo "│                                                                     │"
  echo "│  No compilers needed. Downloads a prebuilt binary with              │"
  echo "│  full CUDA/entropy/turboquant support.                              │"
  echo "│                                                                     │"
  echo "│  Want to build from source instead? Use:  curl ... | bash -s --build"
  echo "└─────────────────────────────────────────────────────────────────────┘"
  echo ""

  read -rp "Download prebuilt binary? [Y/n] " REPLY </dev/tty
  if [[ ! "$REPLY" =~ ^[Nn]$ ]]; then
    echo "   Downloading from GitHub Releases..."
    echo "   $BINARY_URL"
    echo ""
    if curl -L --progress-bar -o /tmp/mostlysane-binary.tar.gz "$BINARY_URL"; then
      echo ""
      echo "   Extracting..."
      tar xzf /tmp/mostlysane-binary.tar.gz -C "$BIN_DIR/"
      chmod +x "$LLAMA_BIN" 2>/dev/null || true
      rm -f /tmp/mostlysane-binary.tar.gz
      echo "✅  Binary ready: $LLAMA_BIN"
      echo "   ($(du -h "$LLAMA_BIN" | cut -f1))"
      # Set HAS_GPU based on whether we got a CUDA variant
      case "$BINARY_URL" in
        *cuda*) HAS_GPU=true ;;
        *metal*) HAS_GPU=true ;;
        *) HAS_GPU=false ;;
      esac
    else
      echo ""
      echo "⚠️  Prebuilt download failed. Falling back to build from source."
      echo ""
      BUILD_MODE=true
      rm -f /tmp/mostlysane-binary.tar.gz
    fi
  else
    echo "   Skipping prebuilt. Will build from source."
    BUILD_MODE=true
  fi
fi

# ── Build from source (if skipped prebuilt or --build flag) ──
if [ "$BUILD_MODE" = true ] && [ ! -f "$LLAMA_BIN" ]; then
  echo "┌─────────────────────────────────────────────────────────────────────┐"
  echo "│  🔨  Build from Source                                              │"
  echo "│  ~20-30 min. Needs cmake + build tools.                             │"
  echo "└─────────────────────────────────────────────────────────────────────┘"
  echo ""

  # ── Install dependencies ──
  echo "📦  Installing build dependencies..."
  case "$PLATFORM" in
    linux)
      if command -v apt &>/dev/null; then
        sudo apt update -qq && sudo apt install -y -qq build-essential cmake
      elif command -v dnf &>/dev/null; then
        sudo dnf install -y cmake gcc-c++
      elif command -v pacman &>/dev/null; then
        sudo pacman -S --needed --noconfirm base-devel cmake
      else
        echo "⚠️  Could not detect package manager."
        echo "    Please install cmake + build-essential manually."
        exit 1
      fi ;;
    macos)
      if ! command -v brew &>/dev/null; then
        echo "   Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv 2>/dev/null || true)"
      fi
      brew install cmake ;;
  esac
  echo "✅  Dependencies ready."
  echo ""

  # ── Clone ──
  echo "📥  Cloning Mostlysane fork (branch: $REPO_BRANCH)..."
  mkdir -p "$HOME/AI"
  if [ -d "$BUILD_DIR" ]; then
    echo "   Repo exists, pulling latest..."
    cd "$BUILD_DIR"
    git checkout "$REPO_BRANCH" 2>/dev/null || true
    git pull
  else
    git clone --depth=1 --branch "$REPO_BRANCH" "$REPO_URL" "$BUILD_DIR"
  fi
  echo "✅  Repo ready."
  echo ""

  # ── Build ──
  echo "🔨  Building (this takes a few minutes)..."
  mkdir -p "$BUILD_DIR/build"
  cd "$BUILD_DIR/build"
  if [ "$PLATFORM" = "macos" ]; then
    cmake .. -DGGML_METAL=ON
    HAS_GPU=true
  else
    echo "   Trying CUDA backend..."
    if cmake .. -DGGML_CUDA=ON; then
      HAS_GPU=true
    else
      echo "⚠️  CUDA not available. Building CPU-only."
      cmake ..
    fi
  fi
  NPROC="$(nproc 2>/dev/null || sysctl -n hw.logicalcpu 2>/dev/null || echo 4)"
  cmake --build . --config Release -j"$NPROC"
  echo "✅  Build complete!"
  echo ""
fi

# ─────────────────────────────────────────────
#  Step 2: Download model
# ─────────────────────────────────────────────
mkdir -p "$MODEL_DIR"

MODEL_SIZE_HINT=""
case "$MODEL" in
  Qwen3.6-35B*)   MODEL_SIZE_HINT=" (~20 GB, takes a while)" ;;
  Qwen_Qwen3-VL*) MODEL_SIZE_HINT=" (~18 GB)" ;;
  *)              ;;
esac

echo "┌─────────────────────────────────────────────────────────────────────┐"
echo "│  📥  Model Download                                                 │"
echo "└─────────────────────────────────────────────────────────────────────┘"
echo ""

read -rp "Download ${MODEL}${MODEL_SIZE_HINT}? [y/N] (You really need this) " REPLY </dev/tty
if [[ "$REPLY" =~ ^[Yy]$ ]]; then
  echo ""
  echo "   Downloading from HuggingFace..."
  echo "   ${MODEL_URL}"
  echo ""
  curl -L --progress-bar -o "$MODEL_DIR/$MODEL" "$MODEL_URL"
  echo ""
  echo "✅  Model downloaded: $MODEL_DIR/$MODEL"
  echo "   ($(du -h "$MODEL_DIR/$MODEL" | cut -f1))"

  # ─── Download entropy profile if available ───
  ENTROPY_FILE="$(resolve_entropy_file "$MODEL")"
  if [ -n "$ENTROPY_FILE" ]; then
    ENTROPY_URL="${RAW_BASE}/${ENTROPY_FILE}"
    echo ""
    echo "   Downloading entropy profile..."
    curl -L --progress-bar -o "$MODEL_DIR/$ENTROPY_FILE" "$ENTROPY_URL"
    echo "✅  Entropy profile saved: $MODEL_DIR/$ENTROPY_FILE"
  fi
else
  echo "   Skipping model download. You can download manually later."
fi

echo ""

# ─────────────────────────────────────────────
#  Step 3: Done — show instructions
# ─────────────────────────────────────────────
print_box "✅  All Set!"
echo ""
echo "  Your model:   $MODEL_DIR/$MODEL"
echo "  Your server:  $LLAMA_BIN"
echo ""

# Build the run command
if [ "$PLATFORM" = "macos" ]; then
  BACKEND_FLAGS=""
elif [ "${HAS_GPU:-false}" = true ]; then
  BACKEND_FLAGS="-ngl 99"
else
  BACKEND_FLAGS=""
  echo "⚠️  CPU-only: no -ngl flag. Expect slower inference."
fi

if [ "$PLATFORM" = "macos" ] && echo "$MODEL" | grep -qi "q2_0\|bonsai"; then
  echo "⚠️   Q2_0 models may crash on macOS/Metal. Try Ministral-3-3B or Qwen3.6."
fi

META_FLAGS=""
if [ "$PLATFORM" = "macos" ]; then
  META_FLAGS="--no-warmup -ctk f16 -ctv f16"
else
  ENTROPY_FILE="$(resolve_entropy_file "$MODEL")"
  if [ -n "$ENTROPY_FILE" ] && [ -f "$MODEL_DIR/$ENTROPY_FILE" ]; then
    META_FLAGS="--entropy-profile $MODEL_DIR/$ENTROPY_FILE"
  fi
fi

RUN_CMD="$LLAMA_BIN -m $MODEL_DIR/$MODEL $BACKEND_FLAGS $META_FLAGS --host 127.0.0.1 --port 8080"
RUN_CMD="$(echo "$RUN_CMD" | tr -s ' ')"

echo "  Run this command to start your AI server:"
echo ""
echo "    $RUN_CMD"
echo ""
echo "  Then open http://localhost:8080 in your browser."
echo "  For a full config: https://ai.mostlysane.co.nz/getstarted.html"
echo ""

# ─────────────────────────────────────────────
#  Step 4: Optionally start the server now
# ─────────────────────────────────────────────
if [ -f "$MODEL_DIR/$MODEL" ]; then
  SHOULD_START=false
  if [ "$START_SERVER" = true ]; then
    SHOULD_START=true
  else
    read -rp "Start the server now and open http://localhost:8080? [y/N] " REPLY </dev/tty
    if [[ "$REPLY" =~ ^[Yy]$ ]]; then
      SHOULD_START=true
    fi
  fi

  if [ "$SHOULD_START" = true ]; then
    echo ""
    echo "🚀  Starting llama-server..."
    $RUN_CMD &
    SERVER_PID=$!

    echo "   Waiting for server to be ready..."
    for i in $(seq 1 30); do
      if curl -s -o /dev/null "http://localhost:8080/health" 2>/dev/null; then
        echo "   Server is ready!"
        break
      fi
      sleep 1
    done

    case "$PLATFORM" in
      linux)  xdg-open "http://localhost:8080" 2>/dev/null || true ;;
      macos)  open "http://localhost:8080" 2>/dev/null || true ;;
    esac

    wait $SERVER_PID
  fi
fi

echo ""
echo "🦄  Stay Mostlysane."
