const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

let io;

// Set up socket connection
const initSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token not provided'));
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error: ' + error.message));
        }
    });

    // Connection event
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);

        // Store socket in user's room for private messages
        socket.join(socket.userId);
        socket.join(`user:${socket.userId}`); // For backward compatibility

        // Handle test notifications
        socket.on('test_notification', async (data) => {
            try {
                const { message, type } = data;

                // Create a test notification
                const testNotification = {
                    _id: new mongoose.Types.ObjectId().toString(),
                    user: socket.userId,
                    type: type || 'test',
                    message: message || 'Test notification',
                    read: false,
                    createdAt: new Date(),
                };

                // Send notification to the user
                io.to(socket.userId).emit('notification', testNotification);

                console.log(`Test notification sent to user ${socket.userId}`);
            } catch (error) {
                console.error('Error sending test notification:', error);
            }
        });

        // Disconnect event
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
};

// Send notification to a specific user
const sendNotificationToUser = (userId, notification) => {
    if (io) {
        // Emit to the user's specific room
        io.to(`user:${userId}`).emit('notification', notification);
        // Also emit to the user's ID room (new format)
        io.to(userId).emit('notification', notification);
    }
};

// Send notification to multiple users
const sendNotificationToUsers = (userIds, notification) => {
    if (io && userIds && userIds.length > 0) {
        userIds.forEach(userId => {
            sendNotificationToUser(userId, notification);
        });
    }
};

// Broadcast notification to all connected clients
const broadcastNotification = (notification) => {
    if (io) {
        io.emit('notification', notification);
    }
};

module.exports = {
    initSocket,
    sendNotificationToUser,
    sendNotificationToUsers,
    broadcastNotification,
    getIO: () => io
}; 