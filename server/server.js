
const express = require("express");

const app = express();
const cors = require("cors");
const fs = require("fs");
const cookieParser = require("cookie-parser");
app.use(express.json());
require("dotenv").config();
app.use(cors({
    // To connect frontend and backend with more secure
    origin : ["http://localhost:3000"],
    methods : ["GET","POST","PUT","DELETE"],

    credentials : true,
}));
app.use(cookieParser());
const GenerateToken = require("./src/middlewares/generateToken");
const authentication = require("./src/middlewares/authentication");
const crypto = require("crypto");
const sendEmail = require("./src/utils/sendEmail");
const PORT = process.env.PORT || 8080;

const jwt = require("jsonwebtoken");

app.get("/getTodo", async (req,res) => {

    try {
        fs.readFile(__dirname + "/" + "todo.json", "utf-8", (err, data) => {
            console.log(data)
            const parseData = JSON.parse(data);
            console.log('parseData:', parseData)
            // res.end(data);
            return res.send(parseData.todo);
        })
    }
    catch(error) {
        console.log("error : ", error.message);
    }

})

app.get("/getUser", async (req,res) => {

    try {
        fs.readFile(__dirname + "/" + "todo.json", "utf-8", async (err, data) => {

            console.log(data)
            const parseData = JSON.parse(data);
            // res.end(data);

            const token = await GenerateToken();
            console.log('token:', token)

            return res.send(parseData.user);
        })
    }
    catch(error) {
        console.log("error : ", error.message);
    }

})

app.post("/getLoginUser", authentication, async (req,res) => {

    try {
        console.log("req.body :", req.body);
        // fs.readFile(__dirname + "/" + "todo.json", "utf-8", async (err, data) => {

        //     console.log(data)
        //     const parseData = JSON.parse(data);
        //     // res.end(data);

        //     const token = await GenerateToken();
        //     console.log('token:', token)

        //     return res.send(parseData.user);
        // })
        // return "Hello";
        return res.status(200).json({
            user : req.body.verifiedUser
        })
    }
    catch(error) {
        console.log("error : ", error.message);
    }

})

app.post("/postTodo", authentication, async (req,res,next) => {
    try {
        const { verifiedUser, verifiedToken } = req.body;
        // console.log('req.body:', req.body)
        // console.log('verifiedToken:', verifiedToken)
        // console.log('verifiedUser:', verifiedUser)

        let parseData;
        fs.readFile(__dirname + "/" + "todo.json", "utf-8", async (err, data) => {
            // console.log(data)

            parseData = JSON.parse(data);

            // console.log('parseData:', parseData)
            const todoData = parseData.todo;

            parseData.todo.push({id : todoData.length+1,task : req.body.task, date : req.body.date, verified : false});
            // console.log('parseData:', parseData)
            fs.writeFile(__dirname + "/" + "todo.json", JSON.stringify(parseData, null, 2), (err, data) => {
                console.log(data);
            })
        
            const result = await sendEmail();
            console.log("length :", todoData.length);
            return res.send(parseData.todo);
        })
        return "Hello";
    }
    catch(error) {
        return res.status(500).json({
            error : error.message
        })
    }
})

app.get("/user/:id/verify/:token", async (req,res) => {

    try {
        const { id, token } = req.body.params;
        const verifyUser = jwt.verify(cookieToken, "neosassignment");

        let parseData;
        fs.readFile(__dirname, + "/" + "todo.json", "utf-8", (err, data) => {
            
            parseData = JSON.parse(data);
            const todoData = parseData.todo;

            let index;
            function findUser(data) {
                let i = 0;
                let j = data.length-1;
                while(i <= j) {
                    let mid = Math.floor((i+j)/2);
                    if(data[mid].id === Number(id)) {
                        index = mid;
                        return data[mid];
                    }
                    else if(data[mid].id > Number(id)) {
                        j = mid - 1;
                    }
                    else {
                        i = mid + 1;
                    }
                }
                return false;
            }
            const result = findUser(todoData);

            if(!result) {
                return res.status(500).json({
                    message : "Task not found Please try again"
                })
            }

            parseData.todo[index].verified = true;
            fs.writeFile(__dirname + "/" + "todo.json", JSON.stringify(parseData, null, 2), (err, data) => {
                console.log(data);
            })
            return res.send(parseData.todo);
        })

    }
    catch(error) {

        return res.status(500).json({
            message : error.message
        })

    }

})

app.post("/postUser", async (req,res) => {
    try {
        console.log(req.body);
        let parseData;
        fs.readFile(__dirname + "/" + "todo.json", "utf-8", async (err, data) => {
            console.log(data)
            parseData = JSON.parse(data);

            const userData = parseData.user;
            // console.log('userData:', userData)

            if(userData.length !== 0) {
                for(var i = 0; i<userData.length; i++) {
                    if(userData[i].mobile === req.body.mobile) {
                        return res.status(500).json({
                            message : "mobile number has already registered Please choose another one"
                        })
                    }
                    else if(userData[i].email === req.body.email) {
                        return res.status(500).json({
                            message : "email has already registered Please choose another one"
                        })
                    }
                }
            } 
            
            const token = await GenerateToken(req.body, res, "register");
            console.log('token:', token);

            req.body.registerToken.push(token);
            
            parseData.user.push(req.body);
            console.log('parseData:', parseData)


            fs.writeFile(__dirname + "/" + "todo.json", JSON.stringify(parseData, null, 2), (err, data) => {
                console.log(data);
            })
            return res.send(parseData.user);
        })
    }
    catch(error) {
        return res.status(500).json({
            error : error.message
        })
    }
})

app.post("/loginUser", async (req,res) => {
    try {
        // console.log(req.body);
        let parseData;
        fs.readFile(__dirname + "/" + "todo.json", "utf-8", async (err, data) => {
            // console.log(data)
            parseData = JSON.parse(data);

            const userData = parseData.user;
            // console.log('userData:', userData)

            let userFind;
            let flag = false;
            for(var i = 0; i<userData.length; i++) {
                if(userData[i].email === req.body.email && userData[i].password === req.body.password && userData[i].loginToken.length === 0) {
                    userFind = userData[i];
                    flag = true;

                    break;
                }
            }
            if(!flag) {
                return res.status(500).json({
                    
                    message : "Email and Password wrong Please try again Thank Yoy"

                })
            }

            // console.log("userFind :", userFind);
            
            const token = await GenerateToken(userFind, res, "login");
            console.log('token:', token);

            // res.cookie("jwtLogin", token, {
            //     httpOnly : true,
            // })

            console.log("i :", i);
            
            
            parseData.user[i].loginToken.push(token);
            console.log('parseData:', parseData)


            fs.writeFile(__dirname + "/" + "todo.json", JSON.stringify(parseData, null, 2), (err, data) => {
                console.log(data);
            })
            return res.send(userFind);
        })
    }
    catch(error) {
        return res.status(500).json({
            error : error.message
        })
    }
})

const server = app.listen(PORT, () => {
    try {

        console.log(`listening on port ${PORT}`);

    }
    catch(error) {
        console.log("error : ", error.message);
    }
})