#!/bin/bash

echo "🚀 Building Stretchly Tauri App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust first."
    exit 1
fi

# Check if Tauri CLI is installed
if ! command -v tauri &> /dev/null; then
    echo "❌ Tauri CLI is not installed. Installing..."
    npm install -g @tauri-apps/cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building the app..."
npm run build

echo "✅ Build complete! Check the src-tauri/target/release directory for the executable." 