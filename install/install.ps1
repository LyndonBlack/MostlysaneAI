# Mostlysane Local AI — One-liner installer (Windows)
# Run: irm https://lyndonblack.github.io/MostlysaneAI/install/install.ps1 | iex

$REPO = "https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git"
$MODEL_DIR = "$env:USERPROFILE\AI\models"
$BUILD_DIR = "$env:USERPROFILE\AI\MostlysaneAI"

Write-Host "┌─────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "│  🦄 Mostlysane Local AI Installer       │" -ForegroundColor Cyan
Write-Host "│  Don't go crazy. Stay Mostlysane.        │" -ForegroundColor Cyan
Write-Host "└─────────────────────────────────────────┘" -ForegroundColor Cyan
Write-Host ""

# Check for existing build
if (Test-Path "$BUILD_DIR\build\bin\Release\llama-server.exe") {
    Write-Host "✅ Build already exists at $BUILD_DIR" -ForegroundColor Green
} else {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    Write-Host "   Make sure you have installed:"
    Write-Host "   • CMake from https://cmake.org/download/"
    Write-Host "   • CUDA Toolkit from https://developer.nvidia.com/cuda-downloads"
    Write-Host "   • Visual Studio 2022 with 'Desktop development with C++'"
    Write-Host ""

    # Clone
    Write-Host "📥 Cloning Mostlysane fork..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\AI" | Out-Null
    if (Test-Path $BUILD_DIR) {
        Set-Location $BUILD_DIR
        git pull
    } else {
        git clone --depth=1 $REPO $BUILD_DIR
    }

    # Build
    Write-Host "🔨 Building llama.cpp (this takes a while)..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "$BUILD_DIR\build" | Out-Null
    Set-Location "$BUILD_DIR\build"
    cmake .. -DGGML_CUDA=ON
    msbuild ALL_BUILD.vcxproj /p:Configuration=Release
    Write-Host "✅ Build complete!" -ForegroundColor Green
}

# Model directory
New-Item -ItemType Directory -Force -Path $MODEL_DIR | Out-Null

Write-Host ""
Write-Host "┌─────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "│  📥 Model Download                      │" -ForegroundColor Cyan
Write-Host "└─────────────────────────────────────────┘" -ForegroundColor Cyan
Write-Host ""
Write-Host "Download models from: https://huggingface.co/LyndonBlack"
Write-Host ""

Write-Host "┌─────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "│  ✅ All set!                             │" -ForegroundColor Cyan
Write-Host "│                                          │"
Write-Host "│  Run from 'x64 Native Tools Command      │"
Write-Host "│  Prompt for VS 2022':                    │"
Write-Host "│  cd $BUILD_DIR\build                      │"
Write-Host "│  bin\Release\llama-server.exe ^           │"
Write-Host "│    -m %USERPROFILE%\AI\models\model.gguf ^ │"
Write-Host "│    --host 127.0.0.1 --port 8080          │"
Write-Host "└─────────────────────────────────────────┘" -ForegroundColor Cyan
