const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.APP_PORT || 8086;

httpServer.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});

io.on("connection", (socket) => {
  //console.log(`client ${socket.id} has connected`);

  socket.on('login', (user) => {
    // Stores user information on the socket as "user" property
    socket.data.user = user
    if (user && user.id) {
    socket.join('user_' + user.id)
    }
  })

  socket.on('logout', (user) => {
    if (user && user.id) {
    socket.leave('user_' + user.id)
    }
    socket.data.user = undefined
  })

  socket.on('chatMessage', (message) => {
    const payload = {
    user: socket.data.user,
    message: message,
    }
    io.sockets.emit('chatMessage', payload)
    })

  socket.on("echo", (message) => {
    socket.emit("echo", message);
  });

  socket.on('privateMessage', (clientMessageObj, callback) => {
    const destinationRoomName = 'user_' + clientMessageObj?.destinationUser?.id
    // Check if the destination user is online
    if (io.sockets.adapter.rooms.get(destinationRoomName)) {
    const payload = {
    user: socket.data.user,
    message: clientMessageObj.message,
    }
    // send the "privateMessage" to the destination user (using "his" room)
    io.to(destinationRoomName).emit('privateMessage', payload)
    if (callback) {
      callback({success: true})
    }
    } else {
      if (callback) {
        callback({
          errorCode: 1,
          errorMessage:
            `User "${clientMessageObj?.destinationUser?.name}" is not online!`
        })
      }
      }
    })  
});
