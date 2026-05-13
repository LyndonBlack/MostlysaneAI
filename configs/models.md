# Mostlysane — Verified Model Configs

All configs tested on RTX 3070 Ti (8 GB VRAM, 7840 MiB usable). 
See [hardware.json](hardware.json) for GPU profiles and memory formulas.

## Curated Models

### Qwen3.6 35B A3B (PRIMARY)

The gold standard. 35B MoE (~8B active), 512K native context, vision capable, excellent quality.

| Quant | File Size | Context | VRAM Used | Free | Speed |
|-------|-----------|---------|-----------|------|-------|
| Q5_K_M | 20 GB | 256K | ~6.1 GB | ~1.5 GB | ~40 t/s |
| Q5_K_M | 20 GB | 512K | ~7.5 GB | ~339 MB | ~25 t/s |

```bash
llama-server -m Qwen3.6-35B-A3B-Q5_K_M.gguf \
  --mmproj mmproj-Qwen3.6-35B-A3B-F16.gguf --no-mmproj-offload \
  --alias qwen3.6-35b-a3b \
  -ngl 99 --n-cpu-moe 39 --ctx-size 256000 --flash-attn on \
  -ctk q8_0 -ctv turbo3_0 \
  --entropy-profile entropy_profile_qwen_book.json --entropy-prune-ratio 2.0 \
  --host 127.0.0.1 --port 8080
```

### Ministral-3-3B Q5_K_L (Best Small Model)

3.4B dense, 256K context, no SWA, vision capable. Fits entirely on GPU.

| Quant | File Size | Context | VRAM Used | Free | Speed |
|-------|-----------|---------|-----------|------|-------|
| Q5_K_L | 2.4 GB | 128K | ~6.3 GB | ~600 MB | ~120 t/s |
| Q6_K_L | 2.8 GB | 128K | ~6.7 GB | ~245 MB | ~110 t/s |

```bash
llama-server -m mistralai_Ministral-3-3B-Instruct-2512-Q5_K_L.gguf \
  --mmproj mmproj-mistralai_Ministral-3-3B-Instruct-2512-f16.gguf --no-mmproj-offload \
  --alias Ministral-3-3B -ngl 30 --ctx-size 131072 \
  --flash-attn on -ctk q8_0 -ctv turbo3_0 \
  --entropy-profile entropy_profile_ministral3_book.json --entropy-prune-ratio 2.0 \
  --host 127.0.0.1 --port 8080
```

### Gemma-4-E2B 4.6B Q8_0 (Cleanest Output)

4.6B dense, 128K context, vision capable. Only 4 hallucinated lines in CodeNeedle testing — the cleanest model tested.

```bash
llama-server -m google_gemma-4-E2B-it-Q8_0.gguf \
  --mmproj mmproj-google_gemma-4-E2B-it-f16.gguf --no-mmproj-offload \
  --alias Gemma-4-E2B --ctx-size 131072 --flash-attn on \
  -ctk q8_0 -ctv turbo3_0 \
  --entropy-profile entropy_profile_gemma4_book.json --entropy-prune-ratio 2.0 \
  --host 127.0.0.1 --port 8080
```

### Qwen3-VL 30B A3B (Vision MoE)

30B MoE, vision-capable, good for image analysis.

```bash
llama-server -m Qwen_Qwen3-VL-30B-A3B-Instruct-Q5_K_L.gguf \
  --mmproj mmproj-Qwen_Qwen3-VL-30B-A3B-Instruct-f16.gguf --no-mmproj-offload \
  --alias qwen3-vl-30b \
  -ngl 99 --n-cpu-moe 48 --ctx-size 131072 --flash-attn on \
  -ctk q8_0 -ctv turbo3_0 \
  --entropy-profile entropy_profile_qwen3vl.json --entropy-prune-ratio 2.0 \
  --host 127.0.0.1 --port 8080
```

### Bonsai 8B Q2_0 (Research / Smoke Test)

Ternary quant model. Fast, good for quick testing, not reliable for production apps.

```bash
llama-server -m Ternary-Bonsai-8B-Q2_0.gguf \
  --alias ternary-bonsai-q2 -ngl 99 --ctx-size 65535 \
  --flash-attn on -ctk q8_0 -ctv turbo3_0 \
  --entropy-profile entropy_profile_bonsai.json --entropy-prune-ratio 2.0 \
  --host 127.0.0.1 --port 8080
```

## Memory Estimation Formulas

See the full derivation in the research fork docs.

**Model GPU memory** (full offload):
```
gpu_model_mib = model_file_gb × 1000 × 0.97
```

**KV cache at `-ctk q8_0 -ctv turbo3_0`:**
```
kv_mib = n_layers × n_kv_heads × d_head × ctx_tokens × 1.39 / 1024²
```

**With entropy (ratio 2.0):** subtract ~30% from KV cache.

**`--no-mmproj-offload`:** saves ~887 MiB GPU for vision models.

## Nvidia GPU VRAM Reference

| GPU | VRAM | Usable | Fits | 
|-----|:----:|:------:|------|
| RTX 4060 | 8 GB | 7.6 GB | Ministral 128K, Qwen3.6 200K* |
| RTX 3070 Ti | 8 GB | 7.6 GB | Same (our reference) |
| RTX 3090 | 24 GB | 23.5 GB | Full Qwen3.6 512K + spare |
| RTX 4090 | 24 GB | 23.5 GB | Same |

*\*Qwen3.6 35B requires MoE CPU offloading (32 GB+ system RAM)*
