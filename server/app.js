const bodyParser = require("body-parser")
const userRoutes = require("./routes/user")
const errRoutes = require("./routes/error")
const homeRoutes = require('./routes/base')
const chatRoutes = require('./routes/chat')
const notificationsRoute = (Routes = require("./routes/Notifications"));
const browsingRoutes = require('./routes/browsing')
const cookieParser = require('cookie-parser')
const authRoutes = require("./routes/auth")
const pss = require('./util/passport.js')
const passport = require('passport')
const cors = require("cors")
const express = require('express')
const { client, redis } = require('./util/redisModule')
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// we have to fetch for connected user Email To create a room and join the user to it!

io.sockets.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.key);
    console.log(data.key, socket.id);
    if (data.key && socket.id) {
      client.hmset(`user${data.key}`, {
        id: data.key,
        socketId: socket.id,
        connected_at: new Date(),
      });
      // client.set(data.key+'-'+(new Date()).getTime() / 1000, socket.id);
      client.keys("*", (err, keys) => {
        if (err) return console.log(err);
        for (var i = 0, len = keys.length; i < len; i++) {
          // console.log('-', keys[i]);
          client.hgetall(keys[i], function (err, obj) {
            console.dir(obj);
          });
        }
      });
    }
  });
  socket.on("msg", (data) => {
    console.log("data", data);
    socket
      .to(data.to)
      .emit("new_msg", { msg: data.text, from: data.from, to: data.to });
  });
  socket.on("new_like", (data) => {
    console.log("******", data);
    socket
      .to(data.target)
      .emit("receive_like", { who: data.who, target: data.target });
  });

  socket.on("new_visit", (data) => {
    console.log("visit", data);
    socket
      .to(data.target)
      .emit("receive_visit", { who: data.who, target: data.target });
  });

  socket.on("new_dislike", (data) => {
    console.log("dislike", data);
    socket
      .to(data.target)
      .emit("receive_dislike", { who: data.who, target: data.target });

    socket.on("get_time", (data) => {
      console.log(".............");
      // var users = [];
      // client.keys('*', (err, keys) => {
      //     if (err)
      //         return console.log(err);
      //     for(var i = 0, len = keys.length; i < len; i++){
      //         client.hgetall(keys[i], function (err, obj) {
      //             console.dir(obj);
      //             users.push(obj);
      //          });
      //     }
      // });
      // socket.to(data.id).emit('connection_time', { users: users});
    });
  });

  socket.on("Firedisconnect", (data) => {
    if (data.id && socket.id) {
      client.hmset(`user${data.id}`, { disconnect_at: new Date() });

      client.keys("*", (err, keys) => {
        if (err) return console.log(err);
        // for(var i = 0, len = keys.length; i < len; i++){
        //     client.hmset(`user${data.id}`, {id : data.id, status : "disconnected", socketId: socket.id, time: ta.ago(new Date() - seconds)});
        // }
      });

      client.keys("*", (err, keys) => {
        if (err) return console.log(err);
        for (var i = 0, len = keys.length; i < len; i++) {
          client.hgetall(keys[i], function (err, obj) {
            console.dir(obj);
          });
        }
      });
    }

    console.log("disconnect", data);
  });
});

app.use(express.json());
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions));
app.use(cookieParser());

//bodyParser
//extended: false
app.use(bodyParser.urlencoded({extended: true}));

client.on('error', (error) => {
  console.log('error', error)
})

// Images ***************************************************
// need help of package path
const path = require('path');
// static folder to thing like image ...
app.use(express.static(path.join(__dirname, 'public/upload')));
//**********************************************************

// parse application/json
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(authRoutes)
app.use(homeRoutes)
app.use(browsingRoutes)
app.use(userRoutes)
app.use(errRoutes)
app.use('/chat', chatRoutes);
app.use('/notifications', notificationsRoute);

http.listen(3001)