# Mostlysane Local AI — One-liner installer (Windows)
#
# Hybrid: quick-start with prebuilt binary, or build from source.
#
# Usage:
#   irm https://lyndonblack.github.io/MostlysaneAI/install/install.ps1 | iex
#   irm ... | iex -- -model Qwen3.6-35B-A3B-Q5_K_M.gguf
#   irm ... | iex -- -model foo.gguf -start
#   irm ... | iex -- -build
#
# Model downloads from bartowski/prism-ml on HuggingFace.
# Prebuilt binaries from GitHub Releases.

param(
    [string]$model = "Qwen3.6-35B-A3B-Q5_K_M.gguf",
    [switch]$start = $false,
    [switch]$build = $false
)

$ErrorActionPreference = "Stop"

# ─── Config ───
$HAS_GPU = $false
$REPO_URL    = "https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git"
$REPO_BRANCH = "turboternary"
$RAW_BASE    = "https://raw.githubusercontent.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant/$REPO_BRANCH"
$RELEASE_BASE = "https://github.com/LyndonBlack/MostlysaneAI/releases/latest/download"

$BUILD_DIR   = "$env:USERPROFILE\AI\MostlysaneAI"
$MODEL_DIR   = "$env:USERPROFILE\AI\models"
$BIN_DIR     = "$BUILD_DIR\build\bin\Release"
$SERVER_EXE  = "$BIN_DIR\llama-server.exe"

# ─── Model → Download URL lookup ───
function Resolve-DownloadUrl {
    param([string]$name)
    switch -wildcard ($name) {
        "Ternary-Bonsai-8B-Q2_0.gguf" {
            return "https://huggingface.co/prism-ml/Ternary-Bonsai-8B-gguf/resolve/main/Ternary-Bonsai-8B-Q2_0.gguf"
        }
        "Ternary-Bonsai-4B-Q2_0.gguf" {
            return "https://huggingface.co/prism-ml/Ternary-Bonsai-4B-gguf/resolve/main/Ternary-Bonsai-4B-Q2_0.gguf"
        }
        "Qwen3.6-35B-A3B-*" {
            $quant = $name -replace "^Qwen3.6-35B-A3B-", ""
            return "https://huggingface.co/bartowski/Qwen_Qwen3.6-35B-A3B-GGUF/resolve/main/Qwen_Qwen3.6-35B-A3B-$quant"
        }
        "Qwen_Qwen3-VL-*" {
            return "https://huggingface.co/bartowski/Qwen_Qwen3-VL-30B-A3B-Instruct-GGUF/resolve/main/$name"
        }
        "mistralai_Ministral-*" {
            return "https://huggingface.co/bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF/resolve/main/$name"
        }
        "google_gemma-4-*" {
            return "https://huggingface.co/bartowski/google_gemma-4-E2B-it-GGUF/resolve/main/$name"
        }
        "llama-3.2-3b-instruct-Q4_K_M.gguf" {
            return "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf"
        }
        "microsoft_Phi-3.5-mini-instruct-Q4_K_M.gguf" {
            return "https://huggingface.co/bartowski/Phi-3.5-mini-instruct-GGUF/resolve/main/Phi-3.5-mini-instruct-Q4_K_M.gguf"
        }
        "Qwen2.5-1.5B-Instruct-Q8_0.gguf" {
            return "https://huggingface.co/bartowski/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/Qwen2.5-1.5B-Instruct-Q8_0.gguf"
        }
        default { return $null }
    }
}

# ─── Entropy profile filename for a given model ───
function Resolve-EntropyFile {
    param([string]$name)
    switch -wildcard ($name) {
        "Qwen3.6-35B-A3B*"             { return "entropy_profile_qwen_book.json" }
        "Qwen_Qwen3-VL*"               { return "entropy_profile_qwen3vl_book.json" }
        "mistralai_Ministral*"         { return "" }
        "google_gemma-4*"              { return "" }
        "Ternary-Bonsai-8B*"           { return "entropy_profile_bonsai.json" }
        "Ternary-Bonsai-4B*"           { return "" }
        default                        { return "" }
    }
}

# ─── Prebuilt binary URL for this platform ───
function Resolve-BinaryUrl {
    $variant = "windows-cpu"
    # Check for NVIDIA driver via nvidia-smi
    try {
        $null = nvidia-smi 2>$null
        $variant = "windows-cuda"
    } catch {}
    return "$RELEASE_BASE/llama-server-$variant.zip"
}

# ─── Pretty box printer ───
function Write-Box {
    param([string]$text)
    $line = "─" * 66
    Write-Host "┌$line┐" -ForegroundColor Cyan
    Write-Host "│  $text" -ForegroundColor Cyan
    Write-Host "└$line┘" -ForegroundColor Cyan
}

# ─────────────────────────────────────────────
#  Welcome
# ─────────────────────────────────────────────
Clear-Host
Write-Box "🦄 Mostlysane Local AI"
Write-Host "│  Don't go crazy. Stay Mostlysane."
Write-Host "└$("─" * 66)┘" -ForegroundColor Cyan
Write-Host ""

# Validate model URL
$MODEL_URL = Resolve-DownloadUrl -name $model
if (-not $MODEL_URL) {
    Write-Host "❌ Unknown model: $model" -ForegroundColor Red
    Write-Host "   Common: Qwen3.6-35B-A3B-Q5_K_M.gguf, Ministral-3-3B-Q5_K_L.gguf"
    exit 1
}

Write-Host "📋  Model:    $model" -ForegroundColor Gray
Write-Host "📋  Install:  $BUILD_DIR" -ForegroundColor Gray
Write-Host "📋  Models:   $MODEL_DIR" -ForegroundColor Gray
Write-Host ""

# ─────────────────────────────────────────────
#  Step 1: Get the binary (quick or build)
# ─────────────────────────────────────────────
New-Item -ItemType Directory -Force -Path $BIN_DIR | Out-Null

if ((Test-Path $SERVER_EXE) -and (-not $build)) {
    Write-Host "✅  Binary already exists at $SERVER_EXE" -ForegroundColor Green
    Write-Host ""
} elseif (-not $build) {
    # ── Quick start: download prebuilt ──
    $BINARY_URL = Resolve-BinaryUrl

    Write-Host "┌$("─" * 66)┐" -ForegroundColor Cyan
    Write-Host "│  🚀  Quick Start (recommended)" -ForegroundColor Cyan
    Write-Host "│" -ForegroundColor Cyan
    Write-Host "│  No compilers needed. Downloads a prebuilt binary with" -ForegroundColor Cyan
    Write-Host "│  full CUDA/entropy/turboquant support." -ForegroundColor Cyan
    Write-Host "│" -ForegroundColor Cyan
    Write-Host "│  Want to build from source? Use: -build flag" -ForegroundColor Cyan
    Write-Host "└$("─" * 66)┘" -ForegroundColor Cyan
    Write-Host ""

    $reply = Read-Host "Download prebuilt binary? [Y/n]"
    if ($reply -notmatch "^[Nn]") {
        Write-Host "   Downloading from GitHub Releases..." -ForegroundColor Gray
        Write-Host "   $BINARY_URL" -ForegroundColor Gray
        Write-Host ""

        $zipPath = "$env:TEMP\mostlysane-binary.zip"
        try {
            $wc = New-Object System.Net.WebClient
            $wc.DownloadFile($BINARY_URL, $zipPath)

            Write-Host "   Extracting..."
            Expand-Archive -Path $zipPath -DestinationPath $BIN_DIR -Force
            Remove-Item $zipPath -Force
            Write-Host "✅  Binary ready: $SERVER_EXE" -ForegroundColor Green
            if ($BINARY_URL -match "cuda") { $HAS_GPU = $true }
        } catch {
            Write-Host ""
            Write-Host "⚠️  Prebuilt download failed: $_" -ForegroundColor Yellow
            Write-Host "   Falling back to build from source." -ForegroundColor Yellow
            Write-Host ""
            $build = $true
            Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
        }
    } else {
        Write-Host "   Skipping prebuilt. Will build from source."
        $build = $true
    }
}

# ── Build from source ──
if ($build -and (-not (Test-Path $SERVER_EXE))) {
    Write-Host "┌$("─" * 66)┐" -ForegroundColor Cyan
    Write-Host "│  🔨  Build from Source" -ForegroundColor Cyan
    Write-Host "│  ~20-30 min. Needs Visual Studio + CMake + CUDA Toolkit." -ForegroundColor Cyan
    Write-Host "└$("─" * 66)┘" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "📦  Prerequisites (install if missing):" -ForegroundColor Yellow
    Write-Host "   • CMake from https://cmake.org/download/"
    Write-Host "   • Visual Studio 2022 with 'Desktop development with C++'"
    Write-Host "   • CUDA Toolkit from https://developer.nvidia.com/cuda-downloads"
    Write-Host ""

    # ── Clone ──
    Write-Host "📥  Cloning Mostlysane fork (branch: $REPO_BRANCH)..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\AI" | Out-Null
    if (Test-Path $BUILD_DIR) {
        Write-Host "   Repo exists, pulling latest..."
        Set-Location $BUILD_DIR
        git checkout $REPO_BRANCH 2>$null
        git pull
    } else {
        git clone --depth=1 --branch $REPO_BRANCH $REPO_URL $BUILD_DIR
    }
    Write-Host "✅  Repo ready."
    Write-Host ""

    # ── Build ──
    Write-Host "🔨  Building (this takes a few minutes)..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "$BUILD_DIR\build" | Out-Null
    Set-Location "$BUILD_DIR\build"

    Write-Host "   Trying CUDA backend..."
    cmake .. -DGGML_CUDA=ON
    if ($LASTEXITCODE -eq 0) {
        $HAS_GPU = $true
    } else {
        Write-Host "⚠️  CUDA not available. Building CPU-only." -ForegroundColor Yellow
        cmake ..
        if ($LASTEXITCODE -ne 0) { throw "CMake configuration failed." }
    }

    Write-Host "   Building..."
    cmake --build . --config Release
    if ($LASTEXITCODE -ne 0) { throw "Build failed." }
    Write-Host "✅  Build complete!" -ForegroundColor Green
    Write-Host ""
}

# ─────────────────────────────────────────────
#  Step 2: Download model
# ─────────────────────────────────────────────
New-Item -ItemType Directory -Force -Path $MODEL_DIR | Out-Null

$SIZE_HINT = ""
if ($model -like "Qwen3.6-35B*") { $SIZE_HINT = " (~20 GB, takes a while)" }

Write-Host "┌$("─" * 66)┐" -ForegroundColor Cyan
Write-Host "│  📥  Model Download" -ForegroundColor Cyan
Write-Host "└$("─" * 66)┘" -ForegroundColor Cyan
Write-Host ""

$reply = Read-Host "Download $model$SIZE_HINT? [y/N] (You really need this)"
if ($reply -match "^[Yy]") {
    Write-Host ""
    Write-Host "   Downloading from HuggingFace..." -ForegroundColor Gray
    Write-Host "   $MODEL_URL" -ForegroundColor Gray
    Write-Host ""

    $wc = New-Object System.Net.WebClient
    $MODEL_PATH = "$MODEL_DIR\$model"
    try {
        $wc.DownloadFile($MODEL_URL, $MODEL_PATH)
    } catch {
        Write-Host "❌ Download failed: $_" -ForegroundColor Red
        exit 1
    }
    $size = (Get-Item $MODEL_PATH).Length / 1GB
    Write-Host "✅  Model downloaded: $MODEL_PATH" -ForegroundColor Green
    Write-Host "    ($([math]::Round($size, 2)) GB)"
    Write-Host ""

    # ─── Download entropy profile if available ───
    $ENTROPY_FILE = Resolve-EntropyFile -name $model
    if ($ENTROPY_FILE) {
        $ENTROPY_URL = "$RAW_BASE/$ENTROPY_FILE"
        Write-Host "   Downloading entropy profile..."
        try {
            $wc.DownloadFile($ENTROPY_URL, "$MODEL_DIR\$ENTROPY_FILE")
            Write-Host "✅  Entropy profile saved: $MODEL_DIR\$ENTROPY_FILE" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Entropy profile download failed (non-fatal): $_" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   Skipping model download."
}

Write-Host ""

# ─────────────────────────────────────────────
#  Step 3: Done — show instructions
# ─────────────────────────────────────────────
Write-Box "✅  All Set!"
Write-Host ""
Write-Host "  Your model:   $MODEL_DIR\$model" -ForegroundColor Gray
Write-Host "  Your server:  $SERVER_EXE" -ForegroundColor Gray
Write-Host ""

$ENTROPY_FILE = Resolve-EntropyFile -name $model
$ENTROPY_FLAG = ""
if ($ENTROPY_FILE -and (Test-Path "$MODEL_DIR\$ENTROPY_FILE")) {
    $ENTROPY_FLAG = "--entropy-profile $MODEL_DIR\$ENTROPY_FILE"
}

$BACKEND_FLAGS = ""
if ($HAS_GPU) {
    $BACKEND_FLAGS = "-ngl 99"
} else {
    Write-Host "⚠️  CPU-only: no -ngl flag. Expect slower inference." -ForegroundColor Yellow
}

$RUN_CMD = "$SERVER_EXE -m $MODEL_DIR\$model $BACKEND_FLAGS $ENTROPY_FLAG --host 127.0.0.1 --port 8080"
while ($RUN_CMD -match "  ") { $RUN_CMD = $RUN_CMD -replace "  ", " " }

Write-Host "  Open 'x64 Native Tools Command Prompt for VS 2022' OR PowerShell and run:"
Write-Host ""
Write-Host "  $SERVER_EXE `"
Write-Host "    -m $MODEL_DIR\$model `"
if ($ENTROPY_FLAG) {
    $epName = ($ENTROPY_FILE -split '/')[-1]
    Write-Host "    --entropy-profile $MODEL_DIR\$epName `"
}
if ($BACKEND_FLAGS) {
    Write-Host "    $BACKEND_FLAGS `"
}
Write-Host "    --host 127.0.0.1 --port 8080"
Write-Host ""
Write-Host "  Then open http://localhost:8080 in your browser."
Write-Host "  For a full config: https://ai.mostlysane.co.nz/getstarted.html"
Write-Host ""

# ─────────────────────────────────────────────
#  Step 4: Optionally start the server now
# ─────────────────────────────────────────────
if (Test-Path "$MODEL_DIR\$model") {
    $reply = Read-Host "Start the server now and open http://localhost:8080? [y/N]"
    if ($reply -match "^[Yy]") {
        Write-Host ""
        Write-Host "🚀  Starting llama-server..." -ForegroundColor Green
        Write-Host "    $RUN_CMD" -ForegroundColor Gray
        Write-Host ""

        $argsList = @("-m", "$MODEL_DIR\$model")
        if ($HAS_GPU) { $argsList += @("-ngl", "99") }
        $argsList += @("--host", "127.0.0.1", "--port", "8080")
        $proc = Start-Process -FilePath $SERVER_EXE -ArgumentList $argsList -NoNewWindow -PassThru

        Write-Host "   Waiting for server to be ready..." -ForegroundColor Gray
        for ($i = 0; $i -lt 30; $i++) {
            try {
                $req = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing -TimeoutSec 1
                if ($req.StatusCode -eq 200) {
                    Write-Host "   Server is ready!" -ForegroundColor Green
                    Start-Process "http://localhost:8080"
                    break
                }
            } catch {}
            Start-Sleep -Seconds 1
        }

        Write-Host ""
        Write-Host "   Server running. Press Ctrl+C to stop." -ForegroundColor Gray
        $proc.WaitForExit()
    }
}

Write-Host ""
Write-Host "🦄  Stay Mostlysane." -ForegroundColor Cyan
