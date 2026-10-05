#!/bin/bash
# ==============================================================================
# Project BioVolt: Automated Pre-Push Integrity Scan (automation/verify_env.sh)
# ==============================================================================
set -e

REQUIRED_DIRECTORIES=("src" "docs")
REQUIRED_FILES=("package.json" "README.md" "cli_manager.py")
EXPECTED_METADATA_ID="UE-EMG-BIOVOLT-2026"

echo "================================================================"
echo "⚡ EXECUTING BIOVOLT AUTOMATION INTEGRITY VERIFICATION SCAN ⚡"
echo "================================================================"

# 1. Structural Layout Scan
echo " -> Step 1: Checking directory trees..."
for dir in "${REQUIRED_DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "❌ [ERROR]: Missing required directory: '$dir'"
        exit 1
    fi
done
echo "   🟢 Core directories verified."

# 2. Critical Pathways
echo " -> Step 2: Validating operational pathways..."
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ [ERROR]: Missing core file: '$file'"
        exit 1
    fi
done
echo "   🟢 Execution paths validated."

# 3. Custom Metadata Configuration Scan
echo " -> Step 3: Verifying repository metadata constraints..."
if grep -q "x-project-id: \"$EXPECTED_METADATA_ID\"" README.md; then
    echo "   🟢 Verified x-project-id: $EXPECTED_METADATA_ID"
else
    echo "❌ [ERROR]: Custom metadata tag mismatch in README.md!"
    echo "            Expected: x-project-id: \"$EXPECTED_METADATA_ID\""
    exit 1
fi

echo "================================================================"
echo "✅ PRE-PUSH INTEGRITY SCAN COMPLETED WITHOUT ANOMALIES."
echo "================================================================"
