#!/usr/bin/env bash
# Mostlysane Local AI — One-liner installer
# curl -sSL https://lyndonblack.github.io/MostlysaneAI/install/install.sh | bash
set -euo pipefail

REPO="https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git"
MODEL_REPO="https://huggingface.co/LyndonBlack"

echo "┌─────────────────────────────────────────┐"
echo "│  🦄 Mostlysane Local AI Installer       │"
echo "│  Don't go crazy. Stay Mostlysane.        │"
echo "└─────────────────────────────────────────┘"
echo ""

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Linux*)   PLATFORM="linux" ;;
  Darwin*)  PLATFORM="macos" ;;
  *)        echo "❌ Unsupported OS: $OS"; exit 1 ;;
esac
echo "📋 Detected: $PLATFORM ($ARCH)"
echo ""

# Check for existing build
BUILD_DIR="$HOME/AI/llama.cpp-Ternary-1.58Bit-and-TurboQuant"
MODEL_DIR="$HOME/AI/models"

if [ -d "$BUILD_DIR/build/bin" ]; then
  echo "✅ Build already exists at $BUILD_DIR"
  echo "   Run 'cd $BUILD_DIR && git pull' to update, then re-run this script."
else
  # Install dependencies
  echo "📦 Installing dependencies..."
  if [ "$PLATFORM" = "linux" ]; then
    if command -v apt &>/dev/null; then
      sudo apt update && sudo apt install -y build-essential cmake
    elif command -v dnf &>/dev/null; then
      sudo dnf install -y cmake gcc-c++
    elif command -v pacman &>/dev/null; then
      sudo pacman -S --needed base-devel cmake
    else
      echo "⚠️  Could not detect package manager. Install cmake + build tools manually."
    fi
  elif [ "$PLATFORM" = "macos" ]; then
    if command -v brew &>/dev/null; then
      brew install cmake
    else
      echo "⚠️  Homebrew not found. Install cmake manually: https://cmake.org/download/"
    fi
  fi

  # Clone
  echo "📥 Cloning Mostlysane fork..."
  mkdir -p "$HOME/AI"
  git clone --depth=1 "$REPO" "$BUILD_DIR" 2>/dev/null || (cd "$BUILD_DIR" && git pull)

  # Build
  echo "🔨 Building llama.cpp (this takes a few minutes)..."
  mkdir -p "$BUILD_DIR/build"
  cd "$BUILD_DIR/build"
  if [ "$PLATFORM" = "macos" ]; then
    cmake .. -DGGML_METAL=ON
  else
    cmake .. -DGGML_CUDA=ON 2>/dev/null || cmake ..
  fi
  cmake --build . --config Release -j"$(nproc 2>/dev/null || sysctl -n hw.logicalcpu 2>/dev/null || echo 4)"
  echo "✅ Build complete!"
fi

# Model download
mkdir -p "$MODEL_DIR"
echo ""
echo "┌─────────────────────────────────────────┐"
echo "│  📥 Model Download                      │"
echo "│  Recommended: Qwen3.6 35B A3B (20 GB)   │"
echo "└─────────────────────────────────────────┘"
echo ""
echo "Models are available at: https://huggingface.co/LyndonBlack"
echo ""
read -rp "Download the recommended model? (~20 GB, takes a while) [y/N] " REPLY
if [[ "$REPLY" =~ ^[Yy]$ ]]; then
  echo "Downloading Qwen3.6-35B-A3B-Q5_K_M.gguf..."
  curl -L -o "$MODEL_DIR/Qwen3.6-35B-A3B-Q5_K_M.gguf" \
    "https://huggingface.co/LyndonBlack/Qwen3.6-35B-A3B-Q5_K_M.gguf"
  echo "✅ Model downloaded!"
fi

echo ""
echo "┌─────────────────────────────────────────┐"
echo "│  ✅ All set!                             │"
echo "│                                          │"
echo "│  Run your server:                        │"
echo "│  cd $BUILD_DIR                           │"
echo "│  ./build/bin/llama-server \\              │"
echo "│    -m ~/AI/models/<your-model>.gguf \\    │"
echo "│    --host 127.0.0.1 --port 8080          │"
echo "│                                          │"
echo "│  Or use the web app for a ready config:  │"
echo "│  https://lyndonblack.github.io/MostlysaneAI/ │"
echo "└─────────────────────────────────────────┘"
