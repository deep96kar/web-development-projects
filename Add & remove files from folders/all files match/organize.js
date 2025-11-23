//you have to write a node.js program to clear clutter inside of a directory and organize the contentes of that directory into different folders.

//for example, these files becomes:

// 1. name.jpg
// 2. name.png
// 3. this.pdf
// 4. deep.zip
// 5. this.zip
// 6. cat.jpg
// 7. deep.pdf

//this:
// jpg/travel1.jpg, jpg/travel2.jpg
// png/name.png
// pdf/this.pdf, pdf/deep.pdf
// zip/deep.zip, zip/this.zip

//**ei code ta te sob folder ei dukbe bas js extension ta badh diye

// Import the 'fs' module for file system operations (read, write, move, etc.)
const fs = require("fs");

// Import the 'path' module to handle file and directory paths
const path = require("path");

// Set the target directory to the current folder where this script is located
const targetDirectory = __dirname;

// Define the main function that will organize the files
function organizeFiles(directoryPath) {
    // Read all contents (files and folders) of the directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            // If there's an error reading the directory, print it and stop
            console.error("Error reading directory:", err.message);
            return;
        }

        // Loop through each file/folder found in the directory
        files.forEach(file => {
            // Get the full path of the current item
            const fullPath = path.join(directoryPath, file);

            // Get information about the file (is it a file or folder, size, etc.)
            fs.stat(fullPath, (err, stats) => {
                if (err) {
                    // If there's an error reading file stats, print it and skip this item
                    console.error(`Error reading file stats for ${file}:`, err.message);
                    return;
                }

                // Only proceed if the item is a regular file (not a folder)
                if (stats.isFile()) {
                    // Extract the file extension (e.g., 'jpg' from 'photo.jpg'), and make it lowercase
                    const ext = path.extname(file).slice(1).toLowerCase(); // remove the dot

                    // Skip files that have .js extension (like this script)
                    if (ext === "js") return;

                    // Skip files with no extension
                    if (!ext) return;

                    // Define the path for the destination folder (e.g., 'jpg/', 'pdf/')
                    const folderPath = path.join(directoryPath, ext);

                    // If the folder doesn't already exist, create it
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath);
                    }

                    // Set the destination path for the file inside the extension folder
                    const destPath = path.join(folderPath, file);

                    // Move the file to the destination folder
                    fs.rename(fullPath, destPath, (err) => {
                        if (err) {
                            // If moving fails, print the error
                            console.error(`Error moving ${file}:`, err.message);
                        } else {
                            // Print success message if move is successful
                            console.log(`Moved ${file} → ${ext}/`);
                        }
                    });
                }
            });
        });
    });
}

// Call the function to start organizing files in the target directory
organizeFiles(targetDirectory);
