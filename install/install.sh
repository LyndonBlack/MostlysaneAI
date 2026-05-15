#!/usr/bin/env bash
# Mostlysane Local AI — One-liner installer
#
# Usage:
#   curl -sSL https://lyndonblack.github.io/MostlysaneAI/install/install.sh | bash
#   curl -sSL https://lyndonblack.github.io/MostlysaneAI/install/install.sh | bash -s -- --model Qwen3.6-35B-A3B-Q5_K_M.gguf
#   curl -sSL ... | bash -s -- --model Ministral-3-3B-Q5_K_L.gguf --start
#
# Downloads from bartowski/prism-ml on HuggingFace, not our own repos.
# Sets up the TurboQuant+entropy fork of llama.cpp.

set -euo pipefail

# ─────────────────────────────────────────────
#  Config
# ─────────────────────────────────────────────
REPO_URL="https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git"
REPO_BRANCH="turboternary"
RAW_BASE="https://raw.githubusercontent.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant/${REPO_BRANCH}"

BUILD_DIR="$HOME/AI/MostlysaneAI"
MODEL_DIR="$HOME/AI/models"

DEFAULT_MODEL="Qwen3.6-35B-A3B-Q5_K_M.gguf"
MODEL="$DEFAULT_MODEL"
START_SERVER=false

# ─────────────────────────────────────────────
#  Model → Download URL lookup
#  Maps our local GGUF filenames to real HF download URLs
# ─────────────────────────────────────────────
resolve_download_url() {
  local name="$1"
  case "$name" in
    # ── prism-ml / Ternary Bonsai ──
    Ternary-Bonsai-8B-Q2_0.gguf)
      echo "https://huggingface.co/prism-ml/Ternary-Bonsai-8B-gguf/resolve/main/Ternary-Bonsai-8B-Q2_0.gguf" ;;
    Ternary-Bonsai-4B-Q2_0.gguf)
      echo "https://huggingface.co/prism-ml/Ternary-Bonsai-4B-gguf/resolve/main/Ternary-Bonsai-4B-Q2_0.gguf" ;;

    # ── bartowski / Qwen3.6 (HF has Qwen_ prefix on filename) ──
    Qwen3.6-35B-A3B-*.gguf)
      local quant="${name#Qwen3.6-35B-A3B-}"
      echo "https://huggingface.co/bartowski/Qwen_Qwen3.6-35B-A3B-GGUF/resolve/main/Qwen_Qwen3.6-35B-A3B-${quant}" ;;

    # ── bartowski / Qwen3-VL (same filename on HF) ──
    Qwen_Qwen3-VL-*.gguf)
      echo "https://huggingface.co/bartowski/Qwen_Qwen3-VL-30B-A3B-Instruct-GGUF/resolve/main/${name}" ;;

    # ── bartowski / Ministral (same filename) ──
    mistralai_Ministral-*.gguf)
      echo "https://huggingface.co/bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF/resolve/main/${name}" ;;

    # ── bartowski / Gemma-4 (same filename) ──
    google_gemma-4-*.gguf)
      echo "https://huggingface.co/bartowski/google_gemma-4-E2B-it-GGUF/resolve/main/${name}" ;;

    # ── bartowski / Llama 3.2 (HF uses Title Case) ──
    llama-3.2-3b-instruct-Q4_K_M.gguf)
      echo "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf" ;;

    # ── bartowski / Phi-3.5 (HF drops microsoft_ prefix) ──
    microsoft_Phi-3.5-mini-instruct-Q4_K_M.gguf)
      echo "https://huggingface.co/bartowski/Phi-3.5-mini-instruct-GGUF/resolve/main/Phi-3.5-mini-instruct-Q4_K_M.gguf" ;;

    # ── bartowski / Qwen2.5 1.5B (same filename) ──
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
    mistralai_Ministral*.gguf)   echo "" ;;  # not yet available
    google_gemma-4*.gguf)        echo "" ;;  # not yet available
    Ternary-Bonsai-8B*.gguf)     echo "entropy_profile_bonsai.json" ;;
    Ternary-Bonsai-4B*.gguf)     echo "" ;;  # not yet calibrated
    llama-3.2-3b-instruct*.gguf) echo "" ;;
    microsoft_Phi-3.5*.gguf)     echo "" ;;
    Qwen2.5-1.5B*.gguf)          echo "" ;;
    *)                            echo "" ;;
  esac
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
    --help|-h)
      echo "Mostlysane Local AI Installer"
      echo ""
      echo "Usage:"
      echo "  $0                          Install with default model ($DEFAULT_MODEL)"
      echo "  $0 --model <filename.gguf>  Install with a specific model"
      echo "  $0 --model foo.gguf --start Install + start server"
      exit 0 ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
done

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
    echo "❌ Unsupported OS: $OS"
    echo "   Linux (x86_64) and macOS (ARM64) only."
    exit 1 ;;
esac

# Validate model download URL
MODEL_URL="$(resolve_download_url "$MODEL")"
if [ -z "$MODEL_URL" ]; then
  echo "❌ Unknown model: $MODEL"
  echo "   Check the filename and try again."
  echo "   Common models: Qwen3.6-35B-A3B-Q5_K_M.gguf, Ministral-3-3B-Q5_K_L.gguf, ..."
  exit 1
fi

echo "📋  System:   $PLATFORM ($ARCH)"
echo "📋  Model:    $MODEL"
echo "📋  Build:    $BUILD_DIR"
echo "📋  Models:   $MODEL_DIR"
echo ""

# ─────────────────────────────────────────────
#  Step 1: Clone & Build llama.cpp
# ─────────────────────────────────────────────
if [ -f "$BUILD_DIR/build/bin/llama-server" ]; then
  echo "✅  Build already exists at $BUILD_DIR/build/bin/"
  echo "   To update: cd $BUILD_DIR && git pull && cmake --build build -j"
  echo ""
else
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
        echo "⚠️   Could not detect package manager."
        echo "    Please install cmake + build-essential manually, then re-run."
        exit 1
      fi ;;
    macos)
      if ! command -v brew &>/dev/null; then
        echo "   Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        # Add to PATH for the current session
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
  echo "🔨  Building llama.cpp (this takes a few minutes)..."
  mkdir -p "$BUILD_DIR/build"
  cd "$BUILD_DIR/build"
  if [ "$PLATFORM" = "macos" ]; then
    cmake .. -DGGML_METAL=ON
  else
    # Try CUDA first, fall back to CPU-only
    cmake .. -DGGML_CUDA=ON 2>/dev/null || cmake ..
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

# Size hint for large models
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
echo "  Your server:  $BUILD_DIR/build/bin/llama-server"
echo ""

# Build the run command
LLAMA_BIN="$BUILD_DIR/build/bin/llama-server"
if [ "$PLATFORM" = "macos" ]; then
  BACKEND_FLAGS=""
else
  BACKEND_FLAGS="-ngl 99"
fi

# macOS/Metal: skip TurboQuant flags + warmup (Metal has no TurboQuant shaders)
# Also warn about Q2_0 models (our fork's custom type at position 42, Metal-incompatible)
if [ "$PLATFORM" = "macos" ] && echo "$MODEL" | grep -qi "q2_0\|bonsai"; then
  echo "⚠️   Note: This model uses a custom quant format (Q2_0) that may not work on macOS/Metal."
  echo "    If the server crashes, try a standard model like Ministral-3-3B or Qwen3.6-35B instead."
  echo "    See https://ai.mostlysane.co.nz/getstarted.html for compatible models."
  echo ""
fi

META_FLAGS=""
if [ "$PLATFORM" = "macos" ]; then
  META_FLAGS="--no-warmup -ctk f16 -ctv f16"
else
  # Linux/non-Metal: entropy profile is safe
  ENTROPY_FILE="$(resolve_entropy_file "$MODEL")"
  if [ -n "$ENTROPY_FILE" ] && [ -f "$MODEL_DIR/$ENTROPY_FILE" ]; then
    META_FLAGS="--entropy-profile $MODEL_DIR/$ENTROPY_FILE"
  fi
fi

RUN_CMD="$LLAMA_BIN -m $MODEL_DIR/$MODEL $BACKEND_FLAGS $META_FLAGS --host 127.0.0.1 --port 8080"
# Squeeze multiple spaces
RUN_CMD="$(echo "$RUN_CMD" | tr -s ' ')"

echo "  Run this command to start your AI server:"
echo ""
echo "    $RUN_CMD"
echo ""
echo "  Then open http://localhost:8080 in your browser."
echo ""
echo "  For a full config tailored to your hardware:"
echo "    https://ai.mostlysane.co.nz/getstarted.html"
echo ""

# ─────────────────────────────────────────────
#  Step 4: Optionally start the server now
# ─────────────────────────────────────────────
if [ -f "$MODEL_DIR/$MODEL" ]; then
  read -rp "Start the server now and open http://localhost:8080? [y/N] " REPLY </dev/tty
  if [[ "$REPLY" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀  Starting llama-server..."
    echo "    $RUN_CMD"
    echo ""

    # Start server in background, poll until healthy, then open browser
    # (Server takes foreground after browser opens)
    echo "   Starting server..."
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

    # Open browser
    case "$PLATFORM" in
      linux)  xdg-open "http://localhost:8080" 2>/dev/null || true ;;
      macos)  open "http://localhost:8080" 2>/dev/null || true ;;
    esac

    # Bring server back to foreground
    wait $SERVER_PID
  fi
fi

echo ""
echo "🦄  Stay Mostlysane."
echo ""
