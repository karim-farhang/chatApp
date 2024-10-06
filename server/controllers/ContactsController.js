import User from "../models/UserModel.js";
import mongoose from "mongoose";
import Message from "../models/MessagesModel.js";

export const searchContact = async (request, response, next) => {
    try {
        const {searchTerm} = request.body;

        // If searchTerm is not provided, fetch all contacts except the current user
        const searchCriteria = {_id: {$ne: request.userId}};

        if (searchTerm) {
            const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(sanitizedSearchTerm, 'i');

            searchCriteria.$or = [
                {firstName: regex},
                {lastName: regex},  // Fix: lastName (previously "lastname")
                {email: regex}
            ];
        }

        const contacts = await User.find(searchCriteria);
        return response.status(200).json({contacts});
    } catch (error) {
        console.error('Internal error:', error);
        return response.status(500).json({message: 'Internal server error'});
    }
};


export const getContactsForDMlist = async (request, response, next) => {
    try {
        let {userId} = request;

        if (!userId) {
            return response.status(400).json({message: 'userId is required'});
        }

        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{sender: userId}, {recipient: userId}],
                },
            },
            {
                $sort: {timestamp: -1}, // Sort by latest timestamp first
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: {$eq: ['$sender', userId]},
                            then: '$recipient', // If user is sender, group by recipient
                            else: '$sender',    // Otherwise, group by sender
                        },
                    },
                    lastMessageTime: {$first: "$timestamp"}, // Get the first (latest) message timestamp
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',      // The id from grouping (recipient or sender)
                    foreignField: '_id',    // Lookup from users collection using _id
                    as: 'contactInfo',
                },
            },
            {
                $unwind: '$contactInfo', // Unwind to access contact info fields
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,     // Keep last message time
                    email: '$contactInfo.email',
                    firstName: '$contactInfo.firstName',
                    lastName: '$contactInfo.lastName',
                    image: '$contactInfo.image',
                    color: '$contactInfo.color',
                },
            },
            {
                $sort: {
                    lastMessageTime: -1,    // Sort by last message time, the newest first
                },
            },
        ]);

        if (!contacts || contacts.length === 0) {
            return response.status(404).json({message: 'No contacts found'});
        }

        return response.status(200).json({contacts});
    } catch (error) {
        console.error('Internal error:', error);
        return response.status(500).json({message: 'Internal server error'});
    }
};


export const getAllContacts = async (request, response, next) => {
    try {
        console.log('Request User ID:', request.userId); // Check if userId is set
        const users = await User.find({ _id: { $ne: request.userId } }, 'firstName lastName _id email');
        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id,
        }));

        return response.status(200).json({ contacts });
    } catch (error) {
        console.error('Internal error:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
};
