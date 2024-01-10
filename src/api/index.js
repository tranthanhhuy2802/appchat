const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


const app = express();
const port = 8000;
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const jwt = require('jsonwebtoken');

mongoose.connect("mongodb+srv://thanhhuy2802:2822000Huy@cluster0.yayw18c.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connected to mongoDB")
}).catch((err) => {
    console.log("error connect to mongoDB", err)
})

app.listen(port, () => {
    console.log("server is running on port 8000")
})

const User = require('./models/user');
const Message = require('./models/message');

//endpoint register
app.post("/register", (req, res) => {
    const { email, name, password, image } = req.body;

    const newUser = new User({ email, name, password, image })

    newUser.save().then(() => {
        res.status(200).json({ message: "user register sucessfully" })
    }).catch((err) => {
        console.log("err register", err)
        res.status(500).json({ message: "error register" })
    })
})

const createToken = (userId) => {
    const payload = {
        userId: userId
    }
    const token = jwt.sign(payload, "BIMAT", { expiresIn: "1h" });
    return token;
}

//login
app.post("/login", (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(401).json({
            message: "khong duoc de trong"
        })
    }
    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({ message: 'khong tim thay user' })
        }
        if (user.password !== password) {
            return res.status(400).json({ message: 'sai pass' })
        }

        const token = createToken(user._id);
        res.status(200).json({ token })
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: 'Internal server Err'
        })

    })
})

//all user
app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;
    User.find({ _id: { $ne: loggedInUserId } }).then((users) => {
        res.status(200).json(users)
    }).catch((err) => {
        console.log(err)
        res.status(500).json({ message: 'error user' })
    })
})

//send a request to a user
app.post("/friend-req", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    // console.log("currentUserId:", currentUserId);
    // console.log("selectedUserId:", selectedUserId);

    try {
        await User.findByIdAndUpdate(selectedUserId, { $push: { freindRequest: currentUserId } });
        await User.findByIdAndUpdate(currentUserId, { $push: { sentFriendRequest: selectedUserId } });

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// show all friend
app.get("/friend-req/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("freindRequest", "name email image").lean();
        const freindRequest = user.freindRequest
        res.json(freindRequest)

    } catch (error) {
        console.log(error)
        res.sendStatus(500).json({ message: "Internal Sever Error" })
    }
})

// accept friend request
app.post("/friend-req/accept", async (req, res) => {
    try {

        const { senderId, recepientId } = req.body

        const sender = await User.findById(senderId);
        const recepient = await User.findById(recepientId);

        sender.friends.push(recepientId);
        recepient.friends.push(senderId);
        recepient.freindRequest = recepient.freindRequest.filter((request) =>
            request.toString() !== senderId.toString()

        )
        sender.sentFriendRequest = sender.sentFriendRequest.filter((request) => request.toString() !== recepientId.toString())

        await sender.save();
        await recepient.save();
        res.status(200).json({ message: "Friend Request accepted succesfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Sever err" })
    }
})

app.get("/accepted-friends/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).populate(
            "friends",
            "name email image"
        )
        const acceptedFriends = user.friends;
        res.json(acceptedFriends)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Sever Err" })
    }
})

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/');

    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname)
    },
})
const upload = multer({ storage: storage })
// post message and store backend

app.post("/message", upload.single('imageFile'), async (req, res) => {
    try {
        const { senderId, recepientId, messageType, messageText } = req.body
        const newMessage = new Message({
            senderId,
            recepientId,
            messageType,
            message: messageText,
            timestamp: new Date(),
            imageUrl: messageType === "image" ? req.file.path : null,

        });
        await newMessage.save();
        res.status(200).json({ message: 'Message sent Successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

//get the userDetails 
app.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const recepientId = await User.findById(userId);
        res.json(recepientId)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Sever Error" })
    }
})

//fetch the message between two users in the chat room

app.get("/message/:senderId/:recepientId", async (req, res) => {
    try {
        const { senderId, recepientId } = req.params
        const message = await Message.find({
            $or: [
                { senderId: senderId, recepientId: recepientId },
                { senderId: recepientId, recepientId: senderId }
            ],
        }).populate("senderId", "_id name")
        res.json(message)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Err" })
    }
})

// delete message
app.post("/deleteMessage", async (req, res) => {
    try {
        const { message } = req.body;
        if (!Array.isArray(message) || message.length === 0) {
            return res.status(400).json({ message: "invalid req body" })
        }
        await Message.deleteMany({ _id: { $in: message } })
        res.json({ message: "Message deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Err" })
    }
})