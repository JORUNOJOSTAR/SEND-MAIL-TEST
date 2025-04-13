const nodeMailer = require('nodemailer');
const { google } = require('googleapis');

const now = new Date();
const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour:'numeric',
    minute: 'numeric',
    second: 'numeric',
};
const formattedDateTime = now.toLocaleDateString('ja-JP',options);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL = process.env.EMAIL

const mailOptions = {
    from: EMAIL,
    to: EMAIL,
    subject: `Test Email ${formattedDateTime}`,
    text: `This is a test email sent on ${formattedDateTime}`,
    html: `
    <h2>This mail is sent on ${formattedDateTime}</h2>
    <p>どんだけーーーーーーーーーーーー</p>
    <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/12/Gintama-Meme-Feature.jpg">
    `
}


async function sendEmail(){
    //setting up oauth client
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID ,CLIENT_SECRET ,REDIRECT_URL);
    oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN
    });

    try{
        const accessToken = await new Promise((resolve,reject)=>{
            oauth2Client.getAccessToken((err,token)=>{
                if(err){
                    console.error('Fail to get access token:', err);
                    reject(err);
                }
                resolve(token);
            })
        });

        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        console.log('Message ID:', info.messageId);
    }catch(error){
        console.error('Error sendding email:', error);
        process.exit(1);
    }
} 

sendEmail();