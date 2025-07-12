import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import prismadb from "@/lib/prismadb"
import { Resend } from 'resend';

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    // 1) create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // 2) write token + expiry back to the user record
    if (emailType === "VERIFY") {
      await prismadb.customer.update({
        where: { id: userId },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: expiry,
        },
      });
    } else {
      await prismadb.customer.update({
        where: { id: userId },
        data: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: expiry,
        },
      });
    }

    // 3) configure transporter
    const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    });

    // 4) build the email
    const path = emailType === "VERIFY" ? "verify-email" : "change-password";
    const subject =
      emailType === "VERIFY" ? "Verify your email" : "Reset your password";
    const url = `${process.env.FRONTEND_STORE_URL}/${path}?token=${hashedToken}`;

    const mailOptions = {
      from: "no-reply@householdhub.com",
      to: email,
      subject,
      html: `
        <p>
          Click <a href="${url}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      },
          or copy & paste the following link into your browser:
        </p>
        <p>${url}</p>
      `,
    };

    const resend = new Resend(process.env.RESEND_API_KEY);
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Hello World',
      html: `
        <p>
          Click <a href="${url}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      },
          or copy & paste the following link into your browser:
        </p>
        <p>${url}</p>
      `,
    });

    // 5) send it
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
