import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcrypt";
import { object, string, number, date, array } from "yup";
import { createServer } from "http";
import { Server } from "socket.io";
import { WebSocketServer } from "ws";
import cors from "cors";
import { type } from "os";
import session from "express-session";
import sharedsession from "express-socket.io-session";
import multer from "multer";
import zip from "express-zip";
import path from "path";
import * as fs from "fs";
/*********************************************************************************************************************** */

var userSchemaUp = object({
  username: string().required(),
  password: string().required(),
  email: string().email().required(),
});

const userUpValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

var userSchemaIn = object({
  emailOrUser: string().required(),
  password: string().required(),
});

const userInValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

var answerSchema = object({
  num: number().integer().required(),
});

const answerValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

var purchaseSchema = object({
  items: array().of(number().integer()).min(6).max(6).required(),
});

const purchaseValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const deleteImageSchema = object({ // when should be number, string also passes, should check why
  name: string().required(),
});

const deleteImageValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

/*********************************************************************************************************************** */

const app = express();
const port = 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const httpServer = app.listen(port, ()=> {
  console.log(port);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");

const sessionMiddleware = session({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4000"
  }
});

app.use(sessionMiddleware);
io.use(sharedsession(sessionMiddleware));

/******************************************************************************************************************************* */

var userSockets = [];
var userSessions = [];
var userNames = [];
var rooms = ["Global Chat"];

io.on("connection", function(socket) {

  socket.handshake.session.rooms = [];

  socket.emit("connection", "");
  socket.emit("previous users", userNames);
  socket.broadcast.emit("new user", socket.handshake.session.user);

  userSockets.push(socket);
  userSessions.push(socket.handshake.session);
  userNames.push(socket.handshake.session.user);

  socket.join(socket.handshake.session.id);

  socket.on("create room", function(userdata) {
    const {roomName} = userdata;
    if (roomName) {
      if (typeof roomName === "string") {
        if (roomName.length <= 20) {
          for (var i = 0; i < rooms.length; i++) {
            if (rooms[i] === roomName) {

            }
          }
          rooms.push(roomName);
          io.emit("new room", roomName);
        } else {

        }
      }
    }
  });

  socket.on("join room", function(userdata) {
    if (typeof userdata === "object") {
      const {roomName} = userdata;
      if (roomName) {
        socket.join(roomName);
        socket.handshake.session.rooms.push(roomName);
        socket.to(roomName).emit("message room", {text: socket.handshake.session.user + " has joined the room!", notifyJoin: true});
      }
    }
  });

  socket.on("message room", function(userdata) {
    if (typeof userdata === "object") {
      const {roomName, message} = userdata;
      if (roomName && message) {
        socket.to(roomName).emit("message room", {text: socket.handshake.session.user + ": " + message});
      }
    }
  });

  socket.on("leave room", function(userdata) {
    if (typeof userdata === "object") {
      const {roomName} = userdata;
      if (roomName) {
        socket.to(roomName).emit("leave room", socket.handshake.session.user + " has left the room!");
        socket.leave(roomName);
      }
    }
  });

  socket.on("private initiate", function(userdata) {
    if (typeof userdata === "object") {
      const {receiver, message} = userdata;
      if (receiver && message) {
        for (var i = 0; i < userSessions.length; i++) {
          if (userSessions[i].user === receiver) {
            socket.to(userSessions[i].id).emit("private initiate", {from: socket.handshake.session.user, message: message, roomId: "" + socket.handshake.session.id + userSessions[i].id});
          }
        }
      }
    }
  });

  socket.on("join private", function(userdata) {
    if (typeof userdata === "object") {
      const {from} = userdata;
      if (from) {
        for (var i = 0; i < userSessions.length; i++) {
          if (userSessions[i].user === from) {
            userSockets[i].join("" + userSessions[i].id + socket.handshake.session.id);
            socket.join("" + userSessions[i].id + socket.handshake.session.id);
            socket.to(userSessions[i].id).emit("join private", {receiver: socket.handshake.session.user, from: from, roomId: "" + userSessions[i].id + socket.handshake.session.id});
          }
        }
      }
    }
  });

  socket.on("fail private", function(userdata) {
    if (typeof userdata === "object") {
      const {from} = userdata;
      if (from) {
        for (var i = 0; i < userSockets.length; i++) {
          if (userSessions[i].user === from) {
            socket.to(userSessions[i].id).emit("fail private", socket.handshake.session.user + " has rejected your private chat request!");
          }
        }
      }
    }
  });

  socket.on("disconnect", function(userdata) {
    for (var i = 0; i < userSessions.length; i++) {
      if (userSessions[i].id === socket.handshake.session.id) {
        socket.broadcast.emit("disconnect user", userNames[i]);
        userSessions.splice(i, 1);
        userNames.splice(i, 1);
        userSockets.splice(i, 1);
        break;
      }
    }
    for (var i = 0; i < socket.handshake.session.rooms.length; i++) {
      socket.to(socket.handshake.session.rooms[i]).emit("leave room", socket.handshake.session.user + " has left the room!");
      socket.leave(socket.handshake.session.rooms[i]);
    }
  });

});

/***************************************************************************************************************************************** */

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Fake Shop Quiz",
  password: "12345678",
  port: 5432,
});

db.connect();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({storage: storage});

/******************************************************************************************************************************** */

/*app.get("/", async (req, res) => {
  try {
    res.sendFile(__dirname + "/public/html/welcome.html");
  }
  catch (error) {

  }
});

app.get("/login", async (req, res) => {
  try {
    res.sendFile(__dirname + "/public/html/login.html");
  }
  catch (error) {

  }
});

app.get("/register", async (req, res) => {
  try {
    res.sendFile(__dirname + "/public/html/register.html");
  }
  catch (error) {

  }
});*/

app.get("/", async (req, res) => {
  try {
    res.sendFile(__dirname + "/public/html/signin.html");
  }
  catch (error) {

  }
});

app.get("/register", async (req, res) => {
  try {
    res.sendFile(__dirname + "/public/html/signup.html");
  }
  catch (error) {

  }
});

app.post("/in", userInValidation(userSchemaIn), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM customers");
    const hashedPass = await bcrypt.hash(req.body.password , 10); 
    var flag = false;
    for (var i = 0 ; i < result.rows.length & flag === false ; i++) {
      if ((result.rows[i].username === req.body.emailOrUser || result.rows[i].email === req.body.emailOrUser) && await bcrypt.compare(req.body.password, result.rows[i].password)) {
        flag = true;
        req.session.balance = result.rows[i].account_money;
        req.session.user = result.rows[i].username;
        req.session.password = req.body.password;
        req.session.authorized = true;
        res.render(__dirname + "/views/shop.ejs" , {username: req.body.username, amount: result.rows[i].account_money, message: ""});
      }
    }
    if (flag === false) {
      res.render(__dirname + "/views/fail.ejs" , {message: "Invalid user name or password"});
    }
  } catch (error) {

  }
});

app.post("/up", userUpValidation(userSchemaUp), async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM customers");
    const result2 = await db.query("select * from purchases");
    var flag = false;
    for (var i = 0 ; i < result.rows.length & flag === false ; i++) {
      if (result.rows[i].email === req.body.email) {
        res.render(__dirname + "/views/fail.ejs" , {message: "Registration failed: This email address is already registered"});
        flag = true;
      } else if (result.rows[i].username === req.body.username) {
        res.render(__dirname + "/views/fail.ejs" , {message: "Registration failed: This user name is already registered"});
        flag = true;
      }
    }
    if (flag === false) {

      let containsProf = null;

      let options = {
        method: 'GET',
        headers: { 'x-api-key': "dfZP5uxUQ7SRa0BjbWrd3g==gLC8UtkfYvxos4VI" }
      }

      let url = "https://api.api-ninjas.com/v1/profanityfilter?text=" + req.body.username;

      var a = await fetch(url,options)
        /*.then(res => res.json()) // parse response as JSON
        .then(data => {
          


          containsProf = data.has_profanity
        })
        .catch(err => {
            console.log(`error ${err}`)
        }); */

      console.log(a)
      if (containsProf === false) {
        req.session.balance = 0;
        req.session.user = req.body.username;
        req.session.password = req.body.password;
        req.session.authorized = true;
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        await db.query("INSERT INTO customers (username, password, email) VALUES ($1, $2, $3)", [
          req.body.username, hashedPass, req.body.email
        ]);
        await db.query("INSERT INTO purchases (username) VALUES ($1)", [
          req.body.username
        ]);
        res.render(__dirname + "/views/shop.ejs" , {username: req.body.username, amount: 0, message: ""});
      } else {
        res.render(__dirname + "/views/fail.ejs" , {message: "Registration failed: Chosen user name contains profanities"});
      }
    }
  } catch (error) {

  }
});

app.get("/trivia", async (req, res) => {
  try {
    if (req.session.authorized === true) {
      req.session.timer = {start: 0, end: 100};
      req.session.triv = {question: null, answers: []};
      var rand = shuffle([0, 1, 2, 3]);
      const response = await fetch("https://the-trivia-api.com/v2/questions?limit=1");
      const json = await response.json();
      req.session.triv.question = json[0].question.text;
      var next = 0;
      for (var i = 0; i <= 3; i++) {
        if (rand[i] === 3) {
          req.session.triv.answers.push(json[0].correctAnswer);
        } else {
          req.session.triv.answers.push(json[0].incorrectAnswers[next]);
          next++;
        }
      }
      req.session.timer.start = new Date().getTime() / 1000;
      res.json(JSON.stringify(req.session.triv));
      req.session.triv.answers = [];
      req.session.triv.question = null;
    } else {

    }
  }
  catch (error) {

  }
});


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  }

  return array;
}

app.post("/answer", answerValidation(answerSchema), async (req, res) => {
  try {
    if (req.session.authorized === true) {
      var rand = shuffle([0, 1, 2, 3]);
      var ret = {amount: null, message: null}
      req.session.timer.end = new Date().getTime() / 1000;
      if (req.session.timer.end - req.session.timer.start > 31) {
        ret.amount = req.session.balance;
        ret.message = "Your time is up!";
        res.json(JSON.stringify(ret));
      } 
      if (req.body.num != 1 && req.body.num != 2 && req.body.num != 3 && req.body.num != 4) {
        ret.amount = req.session.balance;
        ret.message = "Wrong input, use 1,2,3 or 4 as your answer!";
        res.json(JSON.stringify(ret));
      } else {
        if (req.body.num - 1 === rand.indexOf(3)) {
          req.session.balance = req.session.balance + 50;
          const query = `UPDATE "customers" 
                    SET "account_money" = $1
                    WHERE "username" = $2`;
          await db.query(query, [req.session.balance, req.session.user]);
          ret.amount = req.session.balance;
          ret.message = "Correct!";
          res.json(JSON.stringify(ret));
        } else {
          ret.amount = req.session.balance;
          ret.message = "Wrong answer!";
          res.json(JSON.stringify(ret));
        }
      } 
    }
  } catch (error) {

  }
});

app.get("/shop-items", async (req, res) => {
  try {
    if (req.session.authorized === true) {
      const result = await db.query("SELECT * FROM products");
      var items = {item1: result};
      res.render(__dirname + "/views/shop-items.ejs" , {username: req.session.user, amount: req.session.balance, result: result});
    } else {

    }
  }
  catch (error) {

  }
});

app.get("/chat", async (req, res) => {
  try {
    if (req.session.authorized === true) {
      res.render(__dirname + "/views/chat.ejs" , {username: req.session.user})
    } else {

    }
  }
  catch (error) {

  }
});

app.post("/purchase", purchaseValidation(purchaseSchema), async (req, res) => {
  try {
    if (req.session.authorized === true) {
      var ret = {balance: null, message: null, amounts: []};
      var totalPrice = 0;
      const result = await db.query("SELECT * FROM products");
      for (var i = 0; i < 6; i++) {
        if (req.body.items[i] > result.rows[i].product_amount) {
          ret.balance = req.session.balance;
          ret.message = "Error! not enough items are available for your purchase";
          for (var i = 0; i < 6; i++) {
            ret.amounts.push(req.body.items[i]);
          }
          res.status(400).json(JSON.stringify(ret));
          return;
        }
      }
      for (var i = 0; i < 6; i++) {
        totalPrice += result.rows[i].product_price * req.body.items[i];
      }
      if (totalPrice > req.session.balance) {
        ret.balance = req.session.balance;
        ret.message = "Error! not enough money in your account to complete the purchase";
        for (var i = 0; i < 6; i++) {
          ret.amounts.push(req.body.items[i]);
        }
        res.status(400).json(JSON.stringify(ret));
        return;
      }
      req.session.balance = req.session.balance - totalPrice;
      const query = `UPDATE "customers" 
                   SET "account_money" = $1
                   WHERE "username" = $2`;
      await db.query(query, [req.session.balance, req.session.user]);
      for (var i = 0; i < 6; i++) {
        const query2 = `UPDATE "products" 
                   SET "product_amount" = $1
                   WHERE "product_name" = $2`;
        await db.query(query2, [result.rows[i].product_amount - req.body.items[i], result.rows[i].product_name]);
      }
      const query3 = `UPDATE "purchases" 
                   SET "purchased_carrot" = $1
                   WHERE "username" = $2`;
      await db.query(query3, [req.body.items[0], req.session.user]);
      const query4 = `UPDATE "purchases" 
                   SET "purchased_meat" = $1
                   WHERE "username" = $2`;
      await db.query(query4, [req.body.items[1], req.session.user]);
      const query5 = `UPDATE "purchases" 
                   SET "purchased_milk" = $1
                   WHERE "username" = $2`;
      await db.query(query5, [req.body.items[2], req.session.user]);
      const query6 = `UPDATE "purchases" 
                   SET "purchased_fish" = $1
                   WHERE "username" = $2`;
      await db.query(query6, [req.body.items[3], req.session.user]);
      const query7 = `UPDATE "purchases" 
                   SET "purchased_apple" = $1
                   WHERE "username" = $2`;
      await db.query(query7, [req.body.items[4], req.session.user]);
      const query8 = `UPDATE "purchases" 
                   SET "purchased_bread" = $1
                   WHERE "username" = $2`;
      await db.query(query8, [req.body.items[5], req.session.user]);
      ret.balance = req.session.balance;
      ret.message = "Purchase complete!";
      const result2 = await db.query("SELECT * FROM products");
      for (var i = 0; i < 6; i++) {
        ret.amounts.push(result2.rows[i].product_amount);
      }
      res.status(200).json(JSON.stringify(ret));
    } else {

    }
  } catch (error) {

  }
});

app.get("/log-out", async (req, res) => {
  try {
    if (req.session.authorized === true) {
      req.session.destroy();
      res.redirect("/");
    } else {

    }
  }
  catch (error) {

  }
});

app.get("/back", async (req, res) => {
  try {
    if (req.session.authorized === true) {
      res.render(__dirname + "/views/shop.ejs" , {username: req.session.user, amount: req.session.balance, message: ""});
    } else {

    }
  }
  catch (error) {

  }
});

app.get("/gallery", async (req, res) => {
  try {
    if (req.session.authorized === true) {
    var count = 0;
    const result = await db.query("SELECT * FROM gallery");
    for (var i = 0 ;i < result.rows.length; i++) {
      if (result.rows[i].username === req.session.user) {
        count++;
      }
    }
    res.render(__dirname + "/views/gallery.ejs" , {username: req.session.user, left: 10 - count});
    } else {
      
    }
  }
  catch (error) {
    
  }
});

app.get("/photos", async (req, res) => {
  try {
    var photos = [];
    const result = await db.query("SELECT * FROM gallery");
    //var sum = 0;
    for (var i = 0 ;i < result.rows.length; i++) {
      if (result.rows[i].username === req.session.user) {
        photos.push({path: __dirname + "/images/" + result.rows[i].filename, name: result.rows[i].filename});
        //console.log(1);
        //sum += getFilesizeInBytes(result.rows[i].filename);
        //console.log(sum);
      }
    }
    //res.set("Content-Length", sum);
    res.zip(photos);
  } catch (error) {

  }
});

/*function getFilesizeInBytes(filename) {
  const info = fs.statSync("./images/" + filename);
  return info.size;
}*/

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (req.session.authorized === true) {
      const result = await db.query("SELECT * FROM gallery");
      var counter = 0;
      for (var i = 0 ;i < result.rows.length; i++) {
        if (result.rows[i].username === req.session.user) {
          counter++;
        }
      }
      if (counter === 10) {
        res.send("Can't upload, limit has reached");
      } else {
        await db.query("INSERT INTO gallery (username, filename) VALUES ($1, $2)", [
          req.session.user, req.file.filename
        ]);
        res.redirect("gallery");
      }
    } else {

    }
  }
  catch (error) {

  }
});

app.delete("/delete-image", deleteImageValidation(deleteImageSchema), async (req, res) => {
  try {
    if (req.session.authorized === true) {
      const result = await db.query("SELECT * FROM gallery");
      for (var i = 0 ;i < result.rows.length; i++) {
        if (result.rows[i].username === req.session.user) {
          if (result.rows[i].filename === req.body.name) {
            var filename = result.rows[i].filename;
            await db.query("delete from gallery where username = $1 and filename = $2", [result.rows[i].username, result.rows[i].filename]); // deletes wrong  
            break;
          }
        }
      }
      res.redirect("gallery");
    } else {

    }
  }
  catch (error) {

  }
});