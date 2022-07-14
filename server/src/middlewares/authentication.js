
const jwt = require("jsonwebtoken");

const fs = require("fs");

// const path = require("../../")
const authentication = async (req, res, next) => {
    try {
        // console.log('req.body.token:', req.body.token)
        const cookieToken = req.body.token.split("=")[1];
        // console.log('cookieToken:', cookieToken)
        if(!cookieToken) {
            return res.status(500).json({

                message : "Please Login Your Self Thank You"

            })
        }

        const verifyUser = jwt.verify(cookieToken, "neosassignment")

        // console.log('verifyUser:', verifyUser)

        fs.readFile(__dirname + "/" + "../../todo.json", "utf-8", (err, data) => {
            // console.log(data);
            const parseData = JSON.parse(data);
            const userData = parseData.user
            // console.log('userData:', userData);



            function findUser(data) {
                let i = 0;
                let j = data.length-1;
                while(i <= j) {
                    let mid = Math.floor((i+j)/2);
                    if(data[mid].id === Number(verifyUser.id)) {
                        return data[mid];
                    }
                    else if(data[mid].id > Number(verifyUser.id)) {
                        j = mid - 1;
                    }
                    else {
                        i = mid + 1;
                    }
                }
                return false;
            }
            const result = findUser(userData);
            // console.log('result:', result)

            if(!result) {
                return res.status(500).json({
                    message : "User not found Please try again"
                })
            }

            req.body.verifiedToken = cookieToken
            req.body.verifiedUser = result
            next();
        })
        // return "Hello";
    }
    catch(error) {
        return res.status(500).json({
            message : error.message
        })
    }
}

module.exports = authentication;