import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email service configuration error:", error);
  } else {
    console.log("Email service is ready to send messages");
  }
});

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"Krist E-Commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request - Krist",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; }
          .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
          .link { color: #667eea; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Krist E-Commerce</h1>
          </div>
          <div class="content">
            <h2>Hello ${name || "User"},</h2>
            <p>We received a request to reset your password for your Krist account.</p>
            <p>Click the button below to reset your password. This link will expire in <strong>1 hour</strong>.</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p class="link">${resetUrl}</p>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Krist E-Commerce. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"Krist E-Commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Krist - Your Shopping Journey Begins!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; }
          .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Krist!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for joining Krist! We're thrilled to have you on board.</p>
            <p>With your new account, you can:</p>
            <ul>
              <li>Shop from our exclusive collection of premium products</li>
              <li>Track your orders in real-time</li>
              <li>Save your favorite items for later</li>
              <li>Get exclusive deals and early access to sales</li>
            </ul>
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/shop" class="button">Start Shopping</a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Krist E-Commerce. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, order, name) => {
  const mailOptions = {
    from: `"Krist E-Commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation #${order._id} - Krist`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; }
          .order-item { display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
          .total { font-size: 18px; font-weight: 700; color: #111827; margin-top: 20px; text-align: right; }
          .details { background: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e5e7eb; }
          .details h3 { margin-top: 0; color: #374151; font-size: 14px; text-transform: uppercase; }
          .details p { margin: 5px 0; color: #4b5563; font-size: 14px; }
          .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You For Your Order!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We've received your order and we're getting it ready for shipment. You'll receive another email with a tracking number once it's on the way!</p>
            
            <div class="details">
              <h3>Order ID: #${order._id}</h3>
              <p>Requested on: ${new Date().toLocaleDateString()}</p>
              <p>Status: <strong>${order.status || "Processing"}</strong></p>
            </div>

            <div class="details">
              <h3>Shipping Address</h3>
              <p>${order.address}</p>
            </div>

            <div class="total">
              Order Total: $${order.total_amount}
            </div>

            <p style="margin-top: 30px;">If you have any questions, please reply to this email or visit our <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/contact">support page</a>.</p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Krist E-Commerce. All rights reserved.</p>
              <p>This is an automated email, please do not reply directly.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${email} for order ${order._id}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};

export default { sendPasswordResetEmail, sendWelcomeEmail, sendOrderConfirmationEmail };

