
export const chatController = (io, socket) => {
    console.log('a user is connected');

    socket.on('join', ({user, room }) => {
        // Emit welcome message to the user who has just joined
        socket.emit('message', 
            { 
                user: 'admin', 
                message: `${user}, welcome to room ${room}.` 
            }
        );
        
        socket.join(room);

        // Emit to the others in the room that user has joined
        socket.broadcast.to(room).emit('message', 
            { 
                user: "admin",
                message: `${user} has joined` 
            }
        );
    })
 
    socket.on('message', ({user, room, message}) => {
        if (message) {
            io.to(room).emit('message',
            { user:user, message: message });
        }

    })
 
    socket.on('quit', ({user, room}) => {
        socket.leave(room)
        io.to(room).emit('message',
            { user: 'admin', message: `${user} has left` });
    })
}