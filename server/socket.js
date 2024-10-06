import {Server as SocketIOServer} from 'socket.io';
import Message from './models/MessagesModel.js';

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true
        },
    });

    // A map to track which user is connected to which socket
    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                console.log(`Removing socket ID: ${socket.id} for user: ${userId}`);
                userSocketMap.delete(userId);
                break;  // Exit loop after deleting the user
            }
        }
    };

    const sendMessage = async (message) => {
        try {
            // Create the message in the database
            const createMessage = await Message.create({
                sender: message.sender,
                recipient: message.recipient,
                messageType: message.messageType,
                content: message.messageType === 'text' ? message.content : undefined,
                fileUrl: message.messageType === 'file' ? message.fileUrl : undefined,
            });

            // Fetch the message data with populated sender and recipient details
            const messageData = await Message.findById(createMessage._id)
                .populate('sender', 'id email firstName lastName image color')
                .populate('recipient', 'id email firstName lastName image color');

            console.log('Message saved:', messageData);

            // Emit the message to the recipient if they are connected
            const recipientSocketId = userSocketMap.get(message.recipient);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receiveMessage', messageData);
                console.log(`Message sent to recipient ${message.recipient}`);
            }

            // Emit the message to the sender to confirm delivery
            const senderSocketId = userSocketMap.get(message.sender);
            if (senderSocketId) {
                io.to(senderSocketId).emit('receiveMessage', messageData);
                console.log(`Message sent to sender ${message.sender}`);
            }
        } catch (error) {
            console.log('Error sending message:', error);
        }
    };

    // Handle a new socket connection
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket id: ${socket.id}`);
        } else {
            console.log('User ID not provided during connection.');
        }

        // Listen for sendMessage events from the client
        socket.on('sendMessage', (message) => {
            console.log(`Message received from user ${message.sender}`);
            sendMessage(message);
        });

        // Handle user disconnect
        socket.on('disconnect', () => {
            disconnect(socket);
        });
    });
};

export default setupSocket;
