// Import the 'fs' module to interact with the file system (read, write, move, delete)
const fs = require("fs");

// Import the 'path' module to work with file and folder paths
const path = require("path");

// Define the directory we want to work with (the folder where this script is located)
const targetDirectory = __dirname;

// Define the main function that restores files and deletes folders
function restoreFilesAndDeleteFolders(directoryPath) {

    // Read all items (files and folders) in the directory
    fs.readdir(directoryPath, (err, items) => {
        if (err) {
            // If reading the directory fails, show an error and exit
            console.error("❌ Error reading directory:", err.message);
            return;
        }

        // Loop through each item in the folder (might be a file or folder)
        items.forEach(item => {
            const folderPath = path.join(directoryPath, item); // Full path of the item

            // Get stats to check if it's a file or folder
            fs.stat(folderPath, (err, stats) => {
                if (err || !stats.isDirectory()) return; // Skip if error or it's not a folder

                // Optional: Skip system folders like node_modules or .git
                if (["node_modules", ".git"].includes(item)) return;

                // Read the contents of the subfolder (e.g., jpg/, pdf/)
                fs.readdir(folderPath, (err, files) => {
                    if (err) {
                        console.error(`❌ Error reading folder ${item}:`, err.message);
                        return;
                    }

                    // If the folder is empty, delete it right away
                    if (files.length === 0) {
                        fs.rmdir(folderPath, (err) => {
                            if (!err) {
                                console.log(`🗑️ Deleted empty folder: ${item}/`);
                            }
                        });
                        return;
                    }

                    // Counter to track how many files are moved
                    let movedCount = 0;

                    // Loop through each file in the extension folder
                    files.forEach(file => {
                        const from = path.join(folderPath, file); // Full path of the file
                        const to = path.join(directoryPath, file); // Destination (main folder)

                        // Move the file from folder (e.g., jpg/) to main directory
                        fs.rename(from, to, err => {
                            if (err) {
                                console.error(`❌ Error moving ${file}:`, err.message);
                            } else {
                                console.log(`✅ Restored ${file} from ${item}/ to root`);
                                movedCount++; // Increase count when a file is moved

                                // If all files are moved, delete the empty folder
                                if (movedCount === files.length) {
                                    fs.rmdir(folderPath, (err) => {
                                        if (!err) {
                                            console.log(`🗑️ Deleted folder: ${item}/`);
                                        } else {
                                            console.error(`❌ Error deleting folder ${item}:`, err.message);
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            });
        });
    });
}

// Call the function to run the restore and cleanup process
restoreFilesAndDeleteFolders(targetDirectory);
