#!/bin/bash
# ==============================================================================
# Project BioVolt: Local Environment & Variable Pre-Push Verification Engine
# ==============================================================================
set -e

# Define expected repository layout boundaries
REQUIRED_DIRECTORIES=("src" "docs")
REQUIRED_FILES=("package.json" "README.md" "cli_manager.py")
EXPECTED_METADATA_ID="UE-EMG-BIOVOLT-2026"

echo "================================================================"
echo "⚡ RUNNING LOCAL VERIFICATION SUITE FOR PROJECT BIOVOLT ⚡"
echo "================================================================"

# 1. Structural Layout Integrity Scan
echo " -> Step 1: Checking workspace folder tree structure..."
for dir in "${REQUIRED_DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "❌ [ERROR]: Required project directory '$dir' is missing!"
        exit 1
    fi
done
echo "   🟢 Directories validated successfully."

# 2. Critical Dependency & Code Execution Path Validation
echo " -> Step 2: Validating existence of executable resource paths..."
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ [ERROR]: Core deployment component '$file' is missing!"
        exit 1
    fi
done
echo "   🟢 Core code pathways validated successfully."

# 3. Custom Metadata Configuration Constraints Check
echo " -> Step 3: Verifying repository custom metadata layout..."
if [ -f "README.md" ]; then
    if grep -q "x-project-id: \"$EXPECTED_METADATA_ID\"" README.md; then
        echo "   🟢 Project configuration ID matched: $EXPECTED_METADATA_ID"
    else
        echo "❌ [ERROR]: Custom metadata mismatch inside README.md."
        echo "            Expected: x-project-id: \"$EXPECTED_METADATA_ID\""
        exit 1
    fi
else
    echo "❌ [ERROR]: Master entrypoint documentation 'README.md' missing!"
    exit 1
fi

# 4. Check for Untracked Runtime System Logs
echo " -> Step 4: Validating runtime log trails and access bounds..."
if [ -f "biovolt_operations.log" ]; then
    if [ ! -w "biovolt_operations.log" ]; then
        echo "❌ [ERROR]: Log trail 'biovolt_operations.log' lacks active write boundaries!"
        exit 1
    fi
    echo "   🟢 Local runtime log trail configuration verified."
else
    echo "   ⚠️  [NOTICE]: 'biovolt_operations.log' not generated yet. Skipping check."
fi

# 5. Local Code Syntax Verification
echo " -> Step 5: Testing software model code syntax boundaries..."
if command -v python3 >/dev/null 2>&1; then
    python3 -m py_compile cli_manager.py
    echo "   🟢 Python hardware operations manager compiled with zero errors."
else
    echo "   ⚠️  [NOTICE]: Python3 runtime not in PATH, skipping python compile test."
fi

echo "================================================================"
echo "🎉 [SUCCESS]: All local variables and parameters passed verification!"
echo "              Workspace is safe to push to GitHub branches."
echo "================================================================"
