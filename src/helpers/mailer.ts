import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { 
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: new Date(Date.now() + 3600000) // 1 hour from now
                }
            });
        } else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId, { 
                $set: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: new Date(Date.now() + 3600000) // 1 hour from now
                }
            });
        }
        
        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        let url;
        if(emailType === "VERIFY") {
            url = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;
        } else if(emailType === "RESET") {
            url = `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;
        }


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${url}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser: ${url}</p>`,
        };

        const response = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully');

        return response;

    } catch (error) {
        console.error('Error sending email:', error);
    }
};