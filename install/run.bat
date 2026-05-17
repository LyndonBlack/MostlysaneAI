@echo off
REM Mostlysane Local AI — Quick Start Runner (Windows)
REM Double-click this file to:
REM   1. Download the model (if missing)
REM   2. Start the server
REM
REM Usage:  run.bat <model-filename.gguf>
REM   The model name MUST be provided. Use the "Custom Script" download
REM   on the Mostlysane website (ai.mostlysane.co.nz/getstarted) to get
REM   a run script tailored to your selected model.

setlocal enabledelayedexpansion

set MODEL_NAME=%~1
if "%MODEL_NAME%"=="" (
    echo.
    echo --- Mostlysane Local AI -- Quick Start ---
    echo.
    echo ERROR: No model specified.
    echo   Usage: run.bat model-filename.gguf
    echo.
    echo   Go to https://ai.mostlysane.co.nz/getstarted
    echo   select your model, and download a custom run script.
    echo.
    pause
    exit /b 1
)

set MODEL_DIR=%USERPROFILE%\AI\models
set SERVER=%~dp0llama-server.exe

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
        echo Download it manually into %MODEL_DIR% and re-run.
        pause
        exit /b 1
    )
    echo %MODEL_NAME% not found in %MODEL_DIR%
    echo %MODEL_URL%
    echo.
    echo Download now?
    pause
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
