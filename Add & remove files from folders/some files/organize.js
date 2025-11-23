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


// **ei code ta te kichu kichu extenssion folder ei dukbe sob noy

// Import the 'fs' module for file system operations (read, write, move, etc.)
const fs = require("fs");

// Import the 'path' module to work with file/directory paths
const path = require("path");

// List of allowed file extensions to organize
// Only these extensions will be moved to folders
const allowedExtensions = ["jpg", "png", "pdf", "zip"]; // You can add or remove from this list

// Set the directory where files will be organized
// __dirname gives the current directory where this script is located
const targetDirectory = __dirname;

// Function to organize files
function organizeFiles(directoryPath) {
    // Read all files and folders in the target directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            // If there's an error reading the folder, log it and exit
            console.error("Error reading directory:", err.message);
            return;
        }

        // Loop through each item (file or folder) in the directory
        files.forEach(file => {
            // Get the full absolute path of the file
            const fullPath = path.join(directoryPath, file);

            // Get file statistics (check if it's a file or folder)
            fs.stat(fullPath, (err, stats) => {
                if (err) {
                    // If there's an error reading file stats, log it and continue
                    console.error(`Error reading file stats for ${file}:`, err.message);
                    return;
                }

                // Only process if the item is a file (ignore folders)
                if (stats.isFile()) {
                    // Get the file extension (e.g. 'jpg') without the dot
                    const ext = path.extname(file).slice(1).toLowerCase();

                    // Skip this file if its extension is not in the allowed list
                    if (!allowedExtensions.includes(ext)) return;

                    // Create the folder path using the extension (e.g. './jpg')
                    const folderPath = path.join(directoryPath, ext);

                    // Check if the folder exists; if not, create it
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath);
                    }

                    // Create the destination path (folder + filename)
                    const destPath = path.join(folderPath, file);

                    // Move the file from original location to new folder
                    fs.rename(fullPath, destPath, (err) => {
                        if (err) {
                            // If there's an error moving the file, log it
                            console.error(`Error moving ${file}:`, err.message);
                        } else {
                            // Log a success message
                            console.log(`Moved ${file} → ${ext}/`);
                        }
                    });
                }
            });
        });
    });
}

// Start organizing the files in the target directory
organizeFiles(targetDirectory);
