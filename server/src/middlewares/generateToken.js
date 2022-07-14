
const jwt = require("jsonwebtoken");

const GenerateToken = async (data, res, auth) => {
    try {
        console.log('data:', data)
        const token = jwt.sign({id : data.id.toString(), email : data.email.toString()}, "neosassignment")
        console.log('token:', token)
        return token;
        // return "Hello";
    }
    catch(error) {

        return error.message

    }
}

module.exports = GenerateToken;