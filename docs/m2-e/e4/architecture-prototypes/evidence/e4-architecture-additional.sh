#!/bin/bash
cd /workspace/BNT
node experiments/e4-architecture/cache-proof.mjs > /workspace/deliverables/e4-architecture-cache-proof.log 2>&1
echo $? > /workspace/deliverables/e4-architecture-cache-proof.exit
BNT_EXPERIMENT_FORMAT=Combat BNT_EXPERIMENT_CASE=late-long BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture-combat node experiments/e4-architecture/browser.mjs > /workspace/deliverables/e4-architecture-combat.log 2>&1
echo $? > /workspace/deliverables/e4-architecture-combat.exit
BNT_EXPERIMENT_CACHE=two BNT_EXPERIMENT_FORMAT=Combat BNT_EXPERIMENT_CASE=late-long BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture-cache-combat node experiments/e4-architecture/browser.mjs > /workspace/deliverables/e4-architecture-cache-combat.log 2>&1
echo $? > /workspace/deliverables/e4-architecture-cache-combat.exit
BNT_EXPERIMENT_CACHE=two BNT_EXPERIMENT_CASE=retained BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture-cache-retained node experiments/e4-architecture/browser.mjs > /workspace/deliverables/e4-architecture-cache-retained.log 2>&1
echo $? > /workspace/deliverables/e4-architecture-cache-retained.exit
BNT_EXPERIMENT_CACHE=two BNT_EXPERIMENT_CASE=late-long BNT_EXPERIMENT_FORMAT=Combat BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture-cache-memory node experiments/e4-architecture/memory.mjs > /workspace/deliverables/e4-architecture-cache-memory.log 2>&1
echo $? > /workspace/deliverables/e4-architecture-cache-memory.exit
BNT_EXPERIMENT_CACHE=two BNT_EXPERIMENT_OUT=/workspace/deliverables/e4-architecture-cache-combat node experiments/e4-architecture/faults.mjs > /workspace/deliverables/e4-architecture-cache-faults.log 2>&1
echo $? > /workspace/deliverables/e4-architecture-cache-faults.exit
node /workspace/deliverables/e4-architecture-final/reference-check.mjs > /workspace/deliverables/e4-architecture-final/references.log 2>&1
echo $? > /workspace/deliverables/e4-architecture-final/references.exit
npm run build > /workspace/deliverables/e4-architecture-final/build.log 2>&1
echo $? > /workspace/deliverables/e4-architecture-final/build.exit
