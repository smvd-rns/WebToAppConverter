#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();
      // URL_PLACEHOLDER - The GitHub Action will replace this string
      let url = "https://google.com";
      
      // Inject the URL navigation script
      let script = format!("window.location.replace('{}');", url);
      window.eval(&script).expect("Failed to navigate");
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
