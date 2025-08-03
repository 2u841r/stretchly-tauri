# Stretchly - Break Reminder App

A modern, cross-platform break reminder application built with Tauri. Stretchly helps you maintain healthy work habits by reminding you to take regular breaks and microbreaks.

## Features

- **Microbreaks**: Short 20-second breaks every 20 minutes
- **Regular Breaks**: Longer 5-minute breaks every 34 minutes
- **Customizable Settings**: Adjust break durations and intervals
- **Notifications**: Desktop notifications when breaks are due
- **System Tray**: Run in background with system tray integration
- **Minimize to Tray**: Hide window and continue running in background
- **Modern UI**: Beautiful, responsive interface with gradient backgrounds
- **Cross-platform**: Works on Windows, macOS, and Linux

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Rust](https://rust-lang.org/) (latest stable)
- [Tauri CLI](https://tauri.app/v2/guides/getting-started/setup/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

Or use the development script:
```bash
./dev.sh
```

### Building

Build for production:
```bash
npm run build
```

Or use the distribution script:
```bash
./distribute.sh
```

## App Structure

- `src/` - Frontend files
  - `index.html` - Main HTML structure
  - `app.js` - Main application logic
  - `css/app.css` - Styling
  - `images/stretchly.svg` - App logo
- `src-tauri/` - Rust backend
  - `src/lib.rs` - Tauri commands and backend logic
  - `tauri.conf.json` - Tauri configuration

## Settings

The app allows you to customize:

- **Microbreak Duration**: How long microbreaks last (10-300 seconds)
- **Break Duration**: How long regular breaks last (1-60 minutes)
- **Microbreak Interval**: Time between microbreaks (1-120 minutes)
- **Break Interval**: Time between regular breaks (5-240 minutes)
- **Notifications**: Enable/disable desktop notifications
- **Sounds**: Enable/disable sound effects
- **Start on Boot**: Automatically start the app when the system boots
- **Pause on Suspend**: Pause breaks when the system is suspended

## System Tray Features

- **Minimize to Tray**: Click the minimize button (−) to hide the window
- **System Tray Menu**: Right-click the tray icon for options
  - Show/Hide Stretchly
  - Quit application
- **Background Operation**: App continues running and showing breaks even when minimized

## Break Ideas

The app provides random suggestions for activities during breaks:

### Microbreak Ideas
- Quick stretches
- Eye rest exercises
- Neck stretches
- Shoulder rolls

### Regular Break Ideas
- Walking breaks
- Deep breathing exercises
- Stretching routines
- Mindful moments

## Building for Distribution

### Windows
```bash
npm run tauri build -- --target x86_64-pc-windows-msvc
```

### macOS
```bash
npm run tauri build -- --target x86_64-apple-darwin
```

### Linux
```bash
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

## Troubleshooting

### Common Issues

1. **Build fails**: Make sure you have Rust and Tauri CLI installed
2. **System tray not working**: Check if your OS supports system tray icons
3. **Notifications not showing**: Grant notification permissions in your OS settings

### Development Tips

- Use `npm run dev` for development with hot reload
- Check the console for any error messages
- The app runs in the background even when minimized

## License

This project is open source and available under the MIT License.
