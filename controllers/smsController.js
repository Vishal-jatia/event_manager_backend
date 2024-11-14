const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

dotenv.config();

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject();
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.NODE_MAILER_USER,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter;
};

async function sendSMS(Email, otp) {
    console.log("Send OTP notification service started");

    const user = process.env.NODE_MAILER_USER
    const pass = process.env.NODE_MAILER_PASS
    console.log(user)
    console.log(pass)
    let transporter = await createTransporter()

    let mailOptions = {
        from: user,
        to: Email,
        subject: "One Time Password - BookNow",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 24px;
            color: #2a3d66;
        }

        .content {
            font-size: 16px;
            color: #333333;
            line-height: 1.5;
        }

        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
            display: inline-block;
            padding: 10px;
            background-color: #f1f8ff;
            border-radius: 4px;
        }

        .footer {
            text-align: center;
            font-size: 14px;
            color: #777777;
            margin-top: 20px;
        }

        .footer a {
            color: #3498db;
            text-decoration: none;
        }

        .footer p {
            margin: 10px 0;
        }

        .cta {
            margin-top: 20px;
            text-align: center;
        }

        .cta a {
            padding: 12px 25px;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
        }

        @media (max-width: 600px) {
            .container {
                padding: 15px;
            }

            .otp {
                font-size: 20px;
                padding: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>OTP Verification</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p>Dear User,</p>
            <p>Thank you for choosing Invite! Please use the One-Time Password (OTP) below to verify your identity:</p>

            <p><strong>OTP: <span class="otp">${otp}</span></strong></p>

            <p>This OTP is valid for <strong>5 minutes</strong> only. Please do not share it with anyone.</p>

            <div class="cta">
                <a href="https://example.com" target="_blank">Verify Now</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>If you have any questions, please contact us at:</p>
            <p><strong>Vishal Jatia:</strong> <a href="mailto:vjatia449@gmail.com">vjatia449@gmail.com</a></p>
            <p>&copy; 2024 Invite. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
    };

    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
        console.log("Send OTP notification service ended");
            console.log(err);
        } else {
        console.log("Send OTP notification service ended");
            console.log("Email sent successfully");
        }
    });
}

async function sendTicket(Details) {
    console.log("Send ticket notification service started");

    let transporter = await createTransporter()

    let mailOptions = {
        from: process.env.NODE_MAILER_USER,
        to: Details.email,
        subject: `Your Online Event Pass for ${Details.event_name} - Invite✨`,
        html: `Dear <i>${Details.name}</i>,<br><br>Thank you for registering for ${Details.event_name}! We are excited to have you join us and want to make sure that you have all the information you need to have a great time.<br><br>Your online pass has been generated and is ready for you to use. Please remember to keep this pass with you at all times during the event and do not share it with anyone else.<br><br><strong>Pass Number: ${Details.pass}</strong><br><br>Here are the details of your registration:<br>Name: ${Details.name}<br>Amount Paid: ${Details.price}<br>Address: ${Details.address1} <br> City: ${Details.city} <br> PinCode: ${Details.zip}<br><br>If you have any questions or concerns, please don't hesitate to reach out to us. We're here to help please contact us at:<br>Vishal Jatia: vjatia449@gmail.com<br><br>Best regards,<br>The Invite Team`,
    };

    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
        console.log("Send ticket notification service ended");
            console.log(err);
        } else {
        console.log("Send ticket notification service ended");
            console.log("Email sent successfully");
        }
    });
}

module.exports = {
    sendSMS,
    sendTicket,
};
