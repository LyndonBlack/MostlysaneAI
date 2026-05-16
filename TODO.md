
## ✅ Complete (2026-05-16)

### 🔴 Prebuilt Binary System (New)
- GitHub Actions workflow: `.github/workflows/build-binaries.yml` — matrix build for 5 combos
- Hybrid installer: Quick start (prebuilt) or Build from source
  - `install.sh` (Linux/macOS) — updated with hybrid flow
  - `install.ps1` (Windows) — rewritten with hybrid flow
- Release URL convention: `llama-server-{platform}-{backend}.{tar.gz|zip}`
- GPU detection: `nvidia-smi` on Linux/Windows | Metal on macOS
- `--build` flag to force source compilation

### 🔴 Windows install.ps1 fixes (2026-05-16)
- `msbuild` → `cmake --build . --config Release`
- Model download URL resolution (bartowski/prism-ml)
- Entropy profile download
- `turboternary` branch clone
- `--model` parameter + URL validation
- GPU state tracking (`$HAS_GPU`, skip `-ngl` on CPU)

### 🔴 Linux install.sh fixes (2026-05-16)
- GPU state tracking — no `-ngl 99` on CPU-only builds
- CUDA fallback shows error output
- `--start` flag now actually works

### 🔴 Web app app.js fix (2026-05-16)
- Manual setup: fixed download URLs to bartowski/prism-ml (was `LyndonBlack`)

### Previous — Apple chip, installer rewrite, macOS fixes (2026-05-15)
All deployed live at ai.mostlysane.co.nz — see handover

## 🔜 Next Session

### 🔴 HIGH — CI Pipeline
1. Push `turboternary` to trigger the first GitHub Actions build
2. Verify release artifacts appear on GitHub Releases
3. Test quick-start path with real prebuilt binary
4. Test `--build` fallback still works

### 🔵 Medium
1. **Report issue system** — "Something went wrong" link in installer output
2. Standardise `install.ps1` `-build` flag usage for consistency
3. K/V type priority slider (Max Quality / Balanced / Max VRAM)
4. README update — YARN notes, models list, vision setup, OpenClaw
5. Config detail pages — `web/config/` dir empty
6. Chat interface — `web/chat/` dir empty
7. Front page messaging — more "Why Local AI?" content

### 🟢 Future
8. **Docker-based install** — Containerised deployment for easy removal
9. **Removal script** — Prompt asking whether to delete models
10. **Open-WebUI integration** — https://github.com/open-webui/open-webui
11. **One-click browser install button** — No terminal needed
12. **Research page shoutouts** — Credit Prism, TheTom, Codacus, AZisk, Protorikis
13. **Metal TurboQuant shaders** — Port from turboquant_plus for Apple Silicon
14. **Multi-agent architecture** — Set up sub-agents via gateway for CI/coding/research/QA
15. **Bonsai 4B** — Add to models list + calibrate entropy
16. **Missing entropy profiles** — Ministral, Gemma
