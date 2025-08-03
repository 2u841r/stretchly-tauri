use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager, tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState}};

#[derive(Debug, Serialize, Deserialize)]
pub struct BreakSettings {
    pub microbreak_duration: u32,
    pub break_duration: u32,
    pub microbreak_interval: u32,
    pub break_interval: u32,
    pub enable_notifications: bool,
    pub enable_sounds: bool,
    pub start_on_boot: bool,
    pub pause_on_suspend: bool,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn save_settings(_window: tauri::Window, settings: BreakSettings) -> Result<(), String> {
    // Here you could save settings to a file or database
    println!("Saving settings: {:?}", settings);
    Ok(())
}

#[tauri::command]
async fn load_settings(_window: tauri::Window) -> Result<BreakSettings, String> {
    // Here you could load settings from a file or database
    let default_settings = BreakSettings {
        microbreak_duration: 20,
        break_duration: 5,
        microbreak_interval: 20,
        break_interval: 34,
        enable_notifications: true,
        enable_sounds: true,
        start_on_boot: false,
        pause_on_suspend: true,
    };
    Ok(default_settings)
}

#[tauri::command]
async fn show_break_notification(window: tauri::Window, break_type: String) -> Result<(), String> {
    window.emit("break-notification", break_type).map_err(|e| e.to_string())
}

#[tauri::command]
async fn play_sound(_window: tauri::Window, sound_name: String) -> Result<(), String> {
    // Here you could implement sound playing functionality
    println!("Playing sound: {}", sound_name);
    Ok(())
}

#[tauri::command]
fn get_system_info() -> Result<String, String> {
    let os = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    Ok(format!("OS: {}, Architecture: {}", os, arch))
}

#[tauri::command]
fn get_app_version() -> Result<String, String> {
    Ok("0.1.0".to_string())
}

#[tauri::command]
fn show_window(window: tauri::Window) -> Result<(), String> {
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())
}

#[tauri::command]
fn hide_window(window: tauri::Window) -> Result<(), String> {
    window.hide().map_err(|e| e.to_string())
}

#[tauri::command]
fn minimize_window(window: tauri::Window) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
fn maximize_window(window: tauri::Window) -> Result<(), String> {
    if window.is_maximized().unwrap_or(false) {
        window.unmaximize().map_err(|e| e.to_string())
    } else {
        window.maximize().map_err(|e| e.to_string())
    }
}

#[tauri::command]
fn close_window(window: tauri::Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Create system tray
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } => {
                        println!("Tray icon clicked - toggling window");
                        let app_handle = tray.app_handle();
                        if let Some(window) = app_handle.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                    _ => {
                        println!("Unhandled tray event: {:?}", event);
                    }
                })
                .build(app)?;
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            save_settings,
            load_settings,
            show_break_notification,
            play_sound,
            get_system_info,
            get_app_version,
            show_window,
            hide_window,
            minimize_window,
            maximize_window,
            close_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
