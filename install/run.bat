@echo off
REM Mostlysane Local AI — Quick Start Runner (Windows)
REM Double-click this file to:
REM   1. Download the default model if not present
REM   2. Start the server
REM   3. Open the browser
REM
REM Usage:  run.bat [model-filename.gguf]
REM Default: Qwen3.6-35B-A3B-Q5_K_M.gguf

setlocal enabledelayedexpansion

set MODEL_DIR=%USERPROFILE%\AI\models
set SERVER=%~dp0llama-server.exe

REM Auto-detect model if not specified
set MODEL_NAME=%~1
if "%MODEL_NAME%"=="" (
    if exist "%MODEL_DIR%\Qwen3.6-35B-A3B-Q5_K_M.gguf" (
        set MODEL_NAME=Qwen3.6-35B-A3B-Q5_K_M.gguf
    ) else (
        REM Scan for any .gguf file, pick the first one found
        set FOUND=
        for %%f in ("%MODEL_DIR%\*.gguf") do (
            if not defined FOUND set FOUND=%%~nxf
        )
        if defined FOUND (
            set MODEL_NAME=!FOUND!
            echo   Using model: !FOUND!
        ) else (
            set MODEL_NAME=Qwen3.6-35B-A3B-Q5_K_M.gguf
            echo   No models found in %MODEL_DIR%
            echo   Will download Qwen3.6-35B-A3B-Q5_K_M.gguf
        )
    )
)

echo.
echo --- Mostlysane Local AI -- Quick Start ---
echo.

REM Create model directory
if not exist "%MODEL_DIR%" mkdir "%MODEL_DIR%"

REM Check for model, download if missing
if exist "%MODEL_DIR%\%MODEL_NAME%" (
    echo Model found: %MODEL_NAME%
) else (
    call :resolve_url "%MODEL_NAME%"
    if errorlevel 1 (
        echo Unknown model: %MODEL_NAME%
        echo Usage: run.bat model-filename.gguf
        echo Common models: Qwen3.6-35B-A3B-Q5_K_M.gguf
        pause
        exit /b 1
    )
    echo Downloading %MODEL_NAME% ...
    echo %MODEL_URL%
    curl -L --progress-bar -o "%MODEL_DIR%\%MODEL_NAME%" "%MODEL_URL%"
    if errorlevel 1 (
        echo Download failed.
        pause
        exit /b 1
    )
    echo Downloaded: %MODEL_DIR%\%MODEL_NAME%
)

echo.
echo Starting server...
"%SERVER%" -m "%MODEL_DIR%\%MODEL_NAME%" -ngl 99 --host 127.0.0.1 --port 8080
if errorlevel 1 (
    echo Server exited with error code %errorlevel%
    pause
)
goto :eof

REM Helper: resolve download URL for known models
:resolve_url
set MODEL_URL=
if "%1"=="Qwen3.6-35B-A3B-Q5_K_M.gguf" set MODEL_URL=https://huggingface.co/bartowski/Qwen_Qwen3.6-35B-A3B-GGUF/resolve/main/Qwen_Qwen3.6-35B-A3B-Q5_K_M.gguf
if "%1"=="mistralai_Ministral-3-3B-Instruct-2512-Q5_K_L.gguf" set MODEL_URL=https://huggingface.co/bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF/resolve/main/mistralai_Ministral-3-3B-Instruct-2512-Q5_K_L.gguf
if "%1"=="google_gemma-4-E2B-it-Q8_0.gguf" set MODEL_URL=https://huggingface.co/bartowski/google_gemma-4-E2B-it-GGUF/resolve/main/google_gemma-4-E2B-it-Q8_0.gguf
if "%1"=="Ternary-Bonsai-8B-Q2_0.gguf" set MODEL_URL=https://huggingface.co/prism-ml/Ternary-Bonsai-8B-gguf/resolve/main/Ternary-Bonsai-8B-Q2_0.gguf
if "%MODEL_URL%"=="" exit /b 1
exit /b 0
