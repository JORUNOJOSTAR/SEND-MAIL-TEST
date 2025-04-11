const nodeMailer = require('nodemailer');

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

async function sendEmail(){

    const senderMailAddress = process.env.EMAIL_USERNAME;
    const sendAppPassword = process.env.EMAIL_APP_PASSWORD;
    const receiverMailAddress = process.env.EMAIL_TO;

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderMailAddress,
            pass: sendAppPassword
        }
    });

    const mailOptions = {
        from: senderMailAddress,
        to: receiverMailAddress,
        subject: `Test Email ${formattedDateTime}`,
        text: `This is a test email sent on ${formattedDateTime}`,
        html: `
        <h2>This mail is sent on ${formattedDateTime}</h2>
        <p>どんだけーーーーーーーーーーーー</p>
        <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/12/Gintama-Meme-Feature.jpg">
        `
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        console.log('Message ID:', info.messageId);
    }catch(error){
        console.error('Error sending email:', error);
    }
} 

sendEmail();