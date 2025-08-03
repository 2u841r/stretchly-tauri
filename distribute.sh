#!/bin/bash

echo "🚀 Building Stretchly for Distribution..."

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

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build for current platform
echo "🔨 Building for current platform..."
npm run build

echo "✅ Build complete!"
echo "📁 Check the src-tauri/target/release directory for the executable."
echo "📦 For distribution packages, check the src-tauri/target/release/bundle directory."

# Show available targets
echo ""
echo "🎯 Available build targets:"
echo "  - Windows: .exe installer"
echo "  - macOS: .dmg and .app"
echo "  - Linux: .deb, .rpm, .AppImage"
echo ""
echo "To build for specific platforms, run:"
echo "  npm run tauri build -- --target x86_64-pc-windows-msvc"
echo "  npm run tauri build -- --target x86_64-apple-darwin"
echo "  npm run tauri build -- --target x86_64-unknown-linux-gnu" 