---
"pendragon-coding": patch
---

Add GitHub Action for opencode integration on issue comments

- Add .github/workflows/opencode.yml to enable opencode AI assistance
- Triggers on issue comments containing '/oc' or '/opencode' commands
- Uses sst/opencode/github action with opencode/big-pickle model
- Includes proper permissions for repository access