
export const chatController = (io, socket) => {
    console.log('a user is connected');
    let userName;
    let userRoom;
    let isNotified = false;

    socket.on('join', ({user, room }) => {
        userName = user;
        // Emit welcome message to the user who has just joined
        socket.emit('message', 
            { 
                user: 'admin', 
                message: `${user}, welcome to the interview room.` 
            }
        );
        
        socket.join(room);
        userRoom = room;

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
        isNotified = true;
    })

    socket.on('disconnect', () => {
        if (userName && userRoom && !isNotified) {
            io.to(userRoom).emit('message', {
                user: 'admin', message: `${userName} has left`
            })
        }
    })
}