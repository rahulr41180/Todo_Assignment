
const nodemailer = require("nodemailer");

const { google } = require("googleapis");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const USER_EMAIL = process.env.USER_EMAIL


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token : REFRESH_TOKEN })

const sendEmail = async () => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service : "gmail",
            auth : {
                type : "OAuth2",
                user : USER_EMAIL,
                clientId : CLIENT_ID,
                clientSecret : CLIENT_SECRET,
                refreshToken : REFRESH_TOKEN,
                accessToken : accessToken
            }
        })

        const mailOptions = {
            from : `NEOS HEALTHCARE 📧 <www.rahulr41180@gmail.com>`,
            to : "rahulrathorwebstack@gmail.com",
            subject : "Hello Notification from Neos Healthcare",
            text : "Hello from gmail email using APIs",
            html : "<h1>Hello from gmail email using APIs</h1>"
        }

        const result = await transport.sendMail(mailOptions);

        return result;
    }
    catch(error) {
        console.log("Error : ", error);
    }
}

module.exports = sendEmail;