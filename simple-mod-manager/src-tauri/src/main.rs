// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

use regex::Regex;
use serde_json::{json, Value};
use tauri::{AppHandle, Manager};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've besen greeted from Rust!", name)
}

#[tauri::command]
fn load_file(app: AppHandle, file_path: &str) -> String {
    match parse_mod_list(file_path) {
        Ok(json) => {
            app.emit_all("mod-list-update", &json).unwrap();
            serde_json::to_string(&json).unwrap()
        },
        Err(e) => {
            let error_message = json!({ "error": e.to_string() });
            serde_json::to_string(&error_message).unwrap()
        }
    }
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![load_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


fn parse_mod_list(input: &str) -> Result<Value, Box<dyn std::error::Error>> {
    // Step 1: Read the file content
    let content = fs::read_to_string(input)?;
        
    // Step 2: Define the regex pattern for capturing text inside [] and ()
    let pattern = Regex::new(r"\[(.*?)\]\((.*?)\)").unwrap();

    // Step 3: Initialize a vector to hold the JSON objects
    let mut mods_list = Vec::new();

    // Step 4: Find all matches and process them
    for cap in pattern.captures_iter(&content) {
        let name = &cap[1]; // Text inside []
        let url = &cap[2];  // URL inside ()
        let site;
        let slug;

        // Extract the slug from the URL
        if url.contains("curseforge.com") {
            // Extract slug from curseforge URL
            site = "curseforge";
            slug = url.split('/').nth(5).unwrap_or("");
        } else if url.contains("modrinth.com") {
            // Extract slug from modrinth URL
            site = "modrinth";
            slug = url.split('/').nth(4).unwrap_or("");
        } else {
            // Fallback if URL doesn't match expected pattern
            site = "unknown";
            slug = "";
        }

        // Step 5: Create a JSON object for each mod and add it to the list
        let mod_json = json!({
            "name": name,
            "slug": slug,
            "site": site,
            "id": "",       // Placeholder for id
            "file_id": "",  // Placeholder for file_id
            "file_name": "" // Placeholder for file_name
        });

        mods_list.push(mod_json);
    }

    // Step 6: Return the list as a JSON array
    let json_output = json!(mods_list);

    Ok(json_output)
}