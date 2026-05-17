#!/usr/bin/env bash
# Mostlysane Local AI — Quick Start Runner (macOS double-click)
# Double-click this file to open Terminal, download a model, and start the server.
#
# Usage:  ./run.command <model-filename.gguf>
#   The model name MUST be provided. Use the "Custom Script" download
#   on the Mostlysane website (ai.mostlysane.co.nz/getstarted) to get
#   a run script tailored to your selected model.

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "┌─────────────────────────────────────────────────────┐"
  echo "│  🦄 Mostlysane Local AI — Quick Start               │"
  echo "└─────────────────────────────────────────────────────┘"
  echo ""
  echo "❌  No model specified."
  echo "    Usage:  ./run.command <model-filename.gguf>"
  echo ""
  echo "    Go to https://ai.mostlysane.co.nz/getstarted"
  echo "    select your model, and download a custom run script."
  echo ""
  echo "    Press Enter to close this window."
  read -r
  exit 1
fi

MODEL_NAME="$1"
MODEL_DIR="$HOME/AI/models"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER="$SCRIPT_DIR/llama-server"

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

echo "┌─────────────────────────────────────────────────────┐"
echo "│  🦄 Mostlysane Local AI — Quick Start               │"
echo "└─────────────────────────────────────────────────────┘"
echo ""

# ─── Step 1: Ensure model directory ───
mkdir -p "$MODEL_DIR"
echo "📁  Model directory: $MODEL_DIR"

# ─── Step 2: Check / download model ───
if [ -f "$MODEL_DIR/$MODEL_NAME" ]; then
  echo "✅  Model found: $MODEL_NAME ($(du -h "$MODEL_DIR/$MODEL_NAME" | cut -f1))"
else
  MODEL_URL="$(resolve_url "$MODEL_NAME")"
  if [ -z "$MODEL_URL" ]; then
    echo "❌  Unknown model: $MODEL_NAME"
    echo "    Download it manually into $MODEL_DIR and re-run."
    echo ""
    echo "    Press Enter to close this window."
    read -r
    exit 1
  fi
  echo "📥  $MODEL_NAME not found in $MODEL_DIR"
  echo "    URL: $MODEL_URL"
  echo ""
  read -r -p "   Download now? [Y/n] " REPLY
  case "$REPLY" in
    n|N|no|NO) echo "   Skipping download. Exiting."; read -r; exit 0 ;;
  esac
  echo ""
  curl -L --progress-bar -o "$MODEL_DIR/$MODEL_NAME" "$MODEL_URL"
  echo "✅  Model downloaded: $MODEL_DIR/$MODEL_NAME"
fi

echo ""

# ─── Step 3: Start server ───
echo "🚀  Starting server..."
echo ""

# Detect architecture for platform flags
META=""
if [ "$(uname -m)" = "x86_64" ]; then
  echo "📟  Intel Mac detected — CPU-only mode"
  META="--no-warmup -ngl 0"
elif [ "$(uname)" = "Darwin" ]; then
  echo "📟  Apple Silicon detected — Metal acceleration"
  META="--no-warmup -ctk f16 -ctv f16"
fi

# ─── Step 4: Launch browser opener in background ───
(
  for i in $(seq 1 60); do
    if curl -s -o /dev/null "http://localhost:8080/health" 2>/dev/null; then
      echo "✅  Server ready at http://localhost:8080"
      open "http://localhost:8080" 2>/dev/null || true
      break
    fi
    sleep 1
  done
) &

echo ""
echo "🦄  Stay Mostlysane."
echo ""
echo "───────────────────────────────────────────────────────"
echo "  Server is running. Press Ctrl+C to stop."
echo "───────────────────────────────────────────────────────"
echo ""

# Run server in foreground — Ctrl+C kills it directly
"$SERVER" -m "$MODEL_DIR/$MODEL_NAME" $META --host 127.0.0.1 --port 8080
exit $?
