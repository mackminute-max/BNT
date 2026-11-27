#!/bin/sh
# Runs the probe for each race kind and tier in parallel.
# Usage: sh scripts/phase-2/sweep.sh <fields> '<variant json>' [tiers]
for t in ${3:-1 6}; do for k in Oval Circuit Rally; do TIER=$t KIND=$k FORMAT=${FORMAT:-Combat} node scripts/phase-2/probe.mjs "$1" "$2" & done; done; wait
