import Message from "../models/MessagesModel.js";
import fs from 'fs';


export const getMessages = async (request, response) => {
    try {
        const user1 = request.userId;
        const user2 = request.body.id;

        if (!user1 || !user2) {
            return response.status(400).json('Both User IDs are required');
        }
        const messages = await Message.find({
            $or: [
                {sender: user1, recipient: user2},
                {sender: user2, recipient: user1},
            ],
        }).sort({timestamp: 1});

        return response.status(200).json({messages});
    } catch (error) {
        console.error('Error fetching messages:', error);
        return response.status(500).json('Internal server error');
    }
};


export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('File is required');
        }

        // Split the original file name into the base name and extension
        const originalNameParts = req.file.originalname.split('.');
        const fileNameWithoutExtension = originalNameParts.slice(0, -1).join('.');
        const fileExtension = originalNameParts.pop();

        // Create a unique file name by appending Date.now() to the original file name
        const uniqueFileName = `${fileNameWithoutExtension}-${Date.now()}.${fileExtension}`;

        // Define the paths
        const oldPath = req.file.path;  // The file's temporary path (created by multer)
        const newPath = `uploads/files/${uniqueFileName}`;  // Where you want to move the file

        // Move/rename the file to the new path with the unique name
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error('Error renaming file:', err);
                return res.status(500).json({message: 'Error saving file'});
            }

            // Return the unique file name and the new file path
            const fileInfo = {
                originalName: req.file.originalname,
                filePath: `/${newPath}`,  // Accessible file path with the unique name
            };

            console.log('File uploaded and saved:', fileInfo);

            // Return file information to the client
            return res.status(200).json(fileInfo);
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
};
