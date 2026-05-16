#!/usr/bin/env bash
# Mostlysane Local AI — Quick Start Runner (macOS double-click)
# Double-click this file to open Terminal, download a model, and start the server.
#
# This is the macOS-friendly version of run.sh.
# On macOS, .command files open in Terminal when double-clicked.
#
# Usage:  Double-click, or run from terminal:  ./run.command [model-filename.gguf]
# Default: Qwen3.6-35B-A3B-Q5_K_M.gguf

set -euo pipefail

MODEL_NAME="${1:-Qwen3.6-35B-A3B-Q5_K_M.gguf}"
MODEL_DIR="$HOME/AI/models"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER="$SCRIPT_DIR/llama-server"

echo "┌─────────────────────────────────────────────────────┐"
echo "│  🦄 Mostlysane Local AI — Quick Start               │"
echo "└─────────────────────────────────────────────────────┘"
echo ""

# ─── Resolve model download URL ───
resolve_url() {
  case "$1" in
    Qwen3.6-35B-A3B-Q5_K_M.gguf)
      echo "https://huggingface.co/bartowski/Qwen_Qwen3.6-35B-A3B-GGUF/resolve/main/Qwen_Qwen3.6-35B-A3B-Q5_K_M.gguf" ;;
    Qwen3.6-35B-A3B-Q4_K_M.gguf)
      echo "https://huggingface.co/bartowski/Qwen_Qwen3.6-35B-A3B-GGUF/resolve/main/Qwen_Qwen3.6-35B-A3B-Q4_K_M.gguf" ;;
    Qwen3.6-35B-A3B-Q6_K.gguf)
      echo "https://huggingface.co/bartowski/Qwen_Qwen3.6-35B-A3B-GGUF/resolve/main/Qwen_Qwen3.6-35B-A3B-Q6_K.gguf" ;;
    mistralai_Ministral-3-3B-Instruct-2512-Q5_K_L.gguf)
      echo "https://huggingface.co/bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF/resolve/main/mistralai_Ministral-3-3B-Instruct-2512-Q5_K_L.gguf" ;;
    google_gemma-4-E2B-it-Q8_0.gguf)
      echo "https://huggingface.co/bartowski/google_gemma-4-E2B-it-GGUF/resolve/main/google_gemma-4-E2B-it-Q8_0.gguf" ;;
    Ternary-Bonsai-8B-Q2_0.gguf)
      echo "https://huggingface.co/prism-ml/Ternary-Bonsai-8B-gguf/resolve/main/Ternary-Bonsai-8B-Q2_0.gguf" ;;
    *)
      echo ""; return 1 ;;
  esac
}

# ─── Step 1: Ensure model directory ───
mkdir -p "$MODEL_DIR"
echo "📁  Model directory: $MODEL_DIR"

# ─── Step 2: Download model if missing ───
if [ -f "$MODEL_DIR/$MODEL_NAME" ]; then
  echo "✅  Model found: $MODEL_NAME ($(du -h "$MODEL_DIR/$MODEL_NAME" | cut -f1))"
else
  MODEL_URL="$(resolve_url "$MODEL_NAME")"
  if [ -z "$MODEL_URL" ]; then
    echo "❌  Unknown model: $MODEL_NAME"
    echo "    Run:  ./run.command <model-filename.gguf>"
    echo "    Common: Qwen3.6-35B-A3B-Q5_K_M.gguf"
    exit 1
  fi
  echo "📥  Downloading $MODEL_NAME..."
  echo "    $MODEL_URL"
  curl -L --progress-bar -o "$MODEL_DIR/$MODEL_NAME" "$MODEL_URL"
  echo "✅  Model downloaded: $MODEL_DIR/$MODEL_NAME"
fi

echo ""

# ─── Step 3: Start server ───
echo "🚀  Starting server..."
echo ""

# Detect architecture for platform flags
if [ "$(uname -m)" = "x86_64" ]; then
  echo "📟  Intel Mac detected — CPU-only mode"
  META_FLAGS="--no-warmup -ngl 0"
else
  echo "📟  Apple Silicon detected — Metal acceleration"
  META_FLAGS="--no-warmup -ctk f16 -ctv f16"
fi

"$SERVER" -m "$MODEL_DIR/$MODEL_NAME" $META_FLAGS --host 127.0.0.1 --port 8080 &
SERVER_PID=$!

# ─── Step 4: Wait for health, open browser ───
echo "   Waiting for server to be ready..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null "http://localhost:8080/health" 2>/dev/null; then
    echo "✅  Server ready at http://localhost:8080"
    open "http://localhost:8080" 2>/dev/null || true
    break
  fi
  sleep 1
done

echo ""
echo "🦄  Stay Mostlysane."

# Keep terminal open so user can see the server output
echo ""
echo "───────────────────────────────────────────────────────"
echo "  Server is running. Press Ctrl+C to stop."
echo "───────────────────────────────────────────────────────"
wait $SERVER_PID
