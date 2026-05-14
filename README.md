# Mostlysane Local AI

**Local AI that does real work — optimized and easy to set up.**

Don't go crazy setting up AI. Stay Mostlysane.

Mostlysane takes everything we learned from [llama.cpp-TurboQuant](https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant) research and wraps it in a tool that tells you exactly what to run on your hardware.

## What it does

1. **You enter your hardware** — GPU model, VRAM, system RAM
2. **It tells you what works** — which models, which quant, which flags
3. **You copy-paste the command** — and you're running local AI

No guessing. No "try this and see if it fits." Just hardware-matched configs proven on real GPUs.

## How it works

Mostlysane wraps the [llama-server API](https://github.com/ggml-org/llama.cpp) — the same inference engine that powers all llama.cpp-based tools. The web app is a static frontend that generates ready-to-run configs, and an optional chat interface connects to your running server.

**We don't reinvent the engine.** The research fork handles KV cache compression, entropy calibration, and turbo quant types. Mostlysane makes that knowledge accessible.

## Quick start

```bash
# 1. Build our fork (one-time)
mkdir -p ~/AI
git clone https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant.git ~/AI/MostlysaneAI
cd ~/AI/MostlysaneAI
mkdir build && cd build
cmake .. -DGGML_CUDA=ON
make -j$(nproc)

# 2. Use the web app to get your config
# → https://ai.mostlysane.co.nz/

# 3. Run the generated command (paths are absolute, use from anywhere)
~/AI/MostlysaneAI/build/bin/llama-server <your-full-config>
```

## Project structure

```
mostlysane/
├── web/              # Static frontend (GitHub Pages)
│   ├── index.html    # Config builder
│   ├── chat/         # Chat interface (connects to llama-server)
│   └── config/       # Detailed config pages
├── configs/          # Hardware/model database
│   ├── models.toml   # Verified model configs
│   └── hardware.json # GPU specs & known profiles
├── install/          # Setup scripts per OS
└── docs/             # Guides & reference
```

## Roadmap

- [x] **Config database** — all proven configs from our research
- [ ] **Config wizard** — hardware → command in 3 clicks
- [ ] **Chat interface** — test your config immediately
- [ ] **Calibration assistant** — guided entropy profile calibration
- [ ] **One-liner installers** — Linux, macOS, Windows, Docker

## Related

- [Research fork](https://github.com/LyndonBlack/llama.cpp-Ternary-1.58Bit-and-TurboQuant) — our llama.cpp fork with TurboQuant + entropy KV cache
- [Prompt-Vault](https://github.com/w512/Prompt-Vault) — build testing tasks used in validation
- [CodeNeedle](https://github.com/codeneedle) — positional recall benchmark
