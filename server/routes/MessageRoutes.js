
import {Router} from "express";
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import {getMessages, uploadFile} from "../controllers/MessageController.js";
import multer from "multer";

// Configure multer to store files with their original names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/files');  // Destination folder for file uploads
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // Save file with its original name
    }
});

// Initialize multer with the custom storage configuration
const upload = multer({storage: storage});

const messageRoutes = Router();

// Define the routes
messageRoutes.post('/get-messages', verifyToken, getMessages);
messageRoutes.post('/uploads-files', verifyToken, upload.single('file'), uploadFile);

export default messageRoutes;
