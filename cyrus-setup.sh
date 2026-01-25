#!/bin/bash
set -e

echo "Setting up environment for $LINEAR_ISSUE_IDENTIFIER..."

# Node.js projects
if [ -f "package.json" ]; then
    echo "Installing Node.js dependencies..."
    npm ci --prefer-offline 2>/dev/null || npm install
fi

# Python projects
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
fi

echo "Setup complete for $LINEAR_ISSUE_IDENTIFIER"
