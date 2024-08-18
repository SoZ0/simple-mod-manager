use std::fs;
use csv::ReaderBuilder;
use regex::Regex;
use serde::Deserialize;
use serde_json::Value;
use tracing_subscriber::fmt::format;
use std::io::Write;
use tracing::{debug, error, info, Level};
use tracing_subscriber;

use reqwest;
use tokio;

use std::fs::File;
use std::io::copy;
use std::path::Path;
use reqwest::blocking::get;

        async fn parse_mod_list(input: &str, output: &str) -> Result<(), Box<dyn std::error::Error>> {

            // Step 1: Read the file content
            let content = fs::read_to_string(input)?;
                
            // Step 2: Define the regex pattern for capturing text inside [] and ()
            let pattern = Regex::new(r"\[(.*?)\]\((.*?)\)").unwrap();

            // Step 3: Open the output file for writing CSV content
            let mut output_file = fs::File::create(output)?;

            // Step 4: Write CSV header
            writeln!(output_file, "name,slug,site,id,file_id,file_name")?;

            // Step 5: Find all matches and process them
            for cap in pattern.captures_iter(&content) {
                let name = &cap[1]; // Text inside []
                let url = &cap[2];  // URL inside ()
                let site;
                // Extract the slug from the URL
                let slug = if url.contains("curseforge.com") {
                    // Extract slug from curseforge URL
                    site = "curseforge";
                    url.split('/').nth(5).unwrap_or("")
                } else if url.contains("modrinth.com") {
                    // Extract slug from modrinth URL
                    site = "modrinth";
                    url.split('/').nth(4).unwrap_or("")
                } else {
                    // Fallback if URL doesn't match expected pattern
                    site = "unknown";
                    ""
                };

                let id = if site == "curseforge" {

                    let class_id = if url.contains("mc-mods"){
                        6
                    } else if url.contains("texture-packs") {
                        12
                    } else {
                        error!("Unknown class id for {}", url);
                        continue;
                    };

                    &get_mod_id(slug, &class_id).await?
                }else{
                    "NULL"
                };

                let (file_id, file_name) = if site == "curseforge" {
                &get_file_id(id, "1.20.1", &4, url.contains("texture-packs")).await?
                }else{
                &("NULL".to_string(), "NULL".to_string())
                };
            
                // Step 6: Write the processed data to the output file in CSV format
                writeln!(output_file, "{},{},{},{},{},{}", name, slug, site,id,file_id,file_name)?;
            }

            println!("Filtered content saved to '{}'", output);
            
            Ok(())
        }

async fn get_mod_id(input: &str, class_id: &i32) -> Result<String, Box<dyn std::error::Error>> {
    
    info!("Getting mod id for {}", input);

    let url = "https://api.curseforge.com/v1/mods/search";
    let client = reqwest::Client::new();

    let request = client.get(url)
    .header("x-api-key", "$2a$10$WHjkuMFFFuVkf/NYOIKo.eAcG19EObsTTQvcAt.wk0f4o.LgXPuW2")
    .query(&[("gameId","432"),("slug",input),("classId",&class_id.to_string())]).send();


    let response = request.await?;

    if !response.status().is_success()  {
        error!("Failed to get project id for {}, returned {}", input, response.status());
        return Err("Failed to get project id for this project".into());
    }   

    let body = response.text().await?;
    let data: Value = serde_json::from_str(&body)?;

    if let Some(project_id) = data["data"][0]["id"].as_i64() {
        info!("Got project id for {}({})", input, project_id);
        Ok(project_id.to_string())
    } else {
        error!("id not found");
        Err("id not found".into())
    }
}

async fn get_file_id(mod_id: &str, game_version: &str, mod_loader: &i32, texture_pack: bool) -> Result<(String, String), Box<dyn std::error::Error>> {
    
    info!("Getting file id for {}", mod_id);

    let url = format!("https://api.curseforge.com/v1/mods/{}/files", mod_id);
    let client = reqwest::Client::new();

    let mut query = vec![("gameVersion", game_version.to_string())];

    if !texture_pack {
        let loader_type = mod_loader.to_string();
        query.push(("modLoaderType", loader_type));
    }

    let request = client.get(url)
    .header("x-api-key", "$2a$10$WHjkuMFFFuVkf/NYOIKo.eAcG19EObsTTQvcAt.wk0f4o.LgXPuW2")
    .query(&query).send();


    let response = request.await?;

    if !response.status().is_success()  {
        error!("Failed to get project id for {}, returned {}", mod_id, response.status());
        return Err("Failed to get project id for this project".into());
    }   

    let body = response.text().await?;
    let data: Value = serde_json::from_str(&body)?;

    if let Some(file_id) = data["data"][0]["id"].as_i64() {
        info!("Got file id for {}({})", mod_id, file_id);

        let file_name = data["data"][0]["fileName"].to_string();

        Ok((file_id.to_string(), file_name))
    } else {
        error!("id not found");
        debug!("{:?}", data);
        Err("id not found".into())
    }
}

async fn download_mod_file(download_path: &str, mod_id: &str, download_id: &str) -> Result<(), Box<dyn std::error::Error>> {
    // Construct the URL using the mod_id and download_id
    let url = format!("https://www.curseforge.com/api/v1/mods/{}/files/{}/download", mod_id, download_id);

    // Send the GET request to the URL
    let response = reqwest::get(&url).await?;

    // Print the status code
    println!("Status: {}", response.status());

    if !response.status().is_success() {
        return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "File failed to download")));
    }

    let filename = response.url().path().split('/').last().unwrap();

    let file_path = format!("{}/{}", download_path, filename);

    let path = Path::new(&file_path);
    // Open a file in write mode
    let mut file = File::create(path)?;

    // Copy the response body into the file
    let content = response.bytes().await?;
    file.write_all(&content)?;

    println!("File downloaded successfully");

    Ok(())
}

#[derive(Debug, Deserialize)]
struct Record {
    name: Option<String>,
    slug: Option<String>,
    site: Option<String>,
    id: Option<String>,
    file_id: Option<String>,
    file_name: Option<String>,
}


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    tracing_subscriber::fmt().with_max_level(Level::DEBUG).init();

    parse_mod_list("mods.md","mods_parsed.csv").await?;


    let mut rdr = ReaderBuilder::new()
        .has_headers(true) // Specify that the CSV has headers
        .from_path("mods_parsed.csv")?;

    for result in rdr.deserialize() {
        let record: Record = result?;

        let project_id = record.id.unwrap_or("".into());
        let file_id = record.file_id.unwrap_or("".into());
        let file_name = record.file_name.unwrap_or("".into());

        info!("Id: {}, FileId: {}", project_id, file_id);

        if project_id == "NULL" || file_id == "NULL" {
            continue;
        };

        let file_path = format!("{}/{}", "download", file_name);

        if fs::metadata(file_path).is_ok() {
            info!("File already exists, skipping download.");
            continue;
        }

        download_mod_file("downloads", project_id.as_str(), file_id.as_str()).await?;

        println!("Id: {}, FileId: {}", project_id, file_id);
    }

    Ok(())
}