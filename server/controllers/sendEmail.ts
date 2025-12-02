import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

// Base email template with modern UI
const getEmailTemplate = (
  content: string,
  title: string,
  accentColor: string = "#3b82f6"
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, ${accentColor}, ${accentColor}dd);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .subtitle {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 300;
        }
        .content {
          padding: 40px 30px;
        }
        .main-content {
          margin-bottom: 30px;
        }
        .highlight {
          background-color: #f1f5f9;
          border-left: 4px solid ${accentColor};
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .otp-container {
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          display: inline-block;
          background: linear-gradient(135deg, ${accentColor}, ${accentColor}dd);
          color: white;
          font-size: 32px;
          font-weight: bold;
          padding: 20px 30px;
          border-radius: 12px;
          letter-spacing: 4px;
          font-family: 'Courier New', monospace;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 15px;
        }
        .social-links {
          margin-top: 20px;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, ${accentColor}, ${accentColor}dd);
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          margin: 10px 0;
          transition: transform 0.2s;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
          margin: 30px 0;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 8px;
          }
          .header, .content, .footer {
            padding: 20px;
          }
          .otp-code {
            font-size: 24px;
            padding: 15px 20px;
            letter-spacing: 2px;
          }
        }
      </style>
    </head>
    <body>
      <div style="padding: 20px;">
        <div class="container">
          <div class="header">
            <div class="logo">🏥 Medi QR</div>
            <div class="subtitle">Your Digital Healthcare Companion</div>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <div class="footer-text">
              Thank you for choosing Medi QR for your healthcare needs.
            </div>
            <div class="footer-text">
              If you have any questions, feel free to contact our support team.
            </div>
            <div style="margin-top: 20px; color: #94a3b8; font-size: 12px;">
              © 2025 Medi QR. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendVerificationCode = async (email: string, otp: number) => {
  try {
    const content = `
      <div class="main-content">
        <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 24px;">Email Verification Required</h2>
        <p style="color: #475569; font-size: 16px; margin-bottom: 20px;">
          To complete your account setup, please verify your email address using the verification code below.
        </p>
        
        <div class="otp-container">
          <div style="color: #64748b; font-size: 14px; margin-bottom: 10px;">Your Verification Code</div>
          <div class="otp-code">${otp}</div>
          <div style="color: #64748b; font-size: 12px; margin-top: 10px;">This code expires in 10 minutes</div>
        </div>

        <div class="highlight">
          <strong style="color: #3b82f6;">Security Note:</strong> 
          Never share this code with anyone. Medi QR will never ask for your verification code via phone or email.
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Medi QR <onboarding@resend.dev>",
      to: [email],
      subject: "🔐 Email Verification - Medi QR",
      html: getEmailTemplate(content, "Email Verification", "#3b82f6"),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }
    console.log("Verification email sent:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err };
  }
};

export const successMessage = async (
  email: string
): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    // Simplified content to avoid spam filters
    const content = `
      <div class="main-content">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #10b981; margin-bottom: 15px; font-size: 28px;">Welcome to Medi QR!</h2>
          <p style="color: #475569; font-size: 18px;">
            Your account has been successfully verified and is now active.
          </p>
        </div>

        <div class="highlight">
          <h3 style="color: #10b981; margin-bottom: 15px; font-size: 18px;">Getting Started</h3>
          <p style="color: #475569; line-height: 1.8;">
            You can now access all features of Medi QR including profile management, 
            QR code generation, and healthcare provider connections.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #475569; font-size: 16px;">
            Thank you for joining Medi QR - Your Digital Healthcare Companion
          </p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Medi QR <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Medi QR - Account Verified",
      html: getEmailTemplate(content, "Welcome to Medi QR", "#10b981"),
      // Add these headers to improve deliverability
      headers: {
        "X-Priority": "3",
        "X-Mailer": "Medi QR System",
      },
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }
    console.log("Success email sent:", data);
    console.log("Email ID:", data?.id); // Log the email ID for tracking
    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err };
  }
};

export const receivedApplicationOfDoctor = async (
  email: string,
  doctorName?: string
): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    const content = `
      <div class="main-content">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">👨‍⚕️</div>
          <h2 style="color: #8b5cf6; margin-bottom: 15px; font-size: 24px;">
            Application Received Successfully!
          </h2>
          ${doctorName ? `<p style="color: #475569; font-size: 16px;">Hello Dr. ${doctorName},</p>` : ""}
        </div>

        <p style="color: #475569; font-size: 16px; margin-bottom: 25px; text-align: center;">
          Thank you for your interest in joining the Medi QR healthcare network. We have successfully received your application.
        </p>

        <div class="highlight">
          <h3 style="color: #8b5cf6; margin-bottom: 15px; font-size: 18px;">📋 What Happens Next?</h3>
          <div style="color: #475569; line-height: 1.8;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #8b5cf6; font-weight: bold; margin-right: 10px;">1.</span>
              Our verification team will review your credentials and documentation
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #8b5cf6; font-weight: bold; margin-right: 10px;">2.</span>
              We'll verify your medical license and professional certifications
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #8b5cf6; font-weight: bold; margin-right: 10px;">3.</span>
              You'll receive an approval notification within 2-3 business days
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #8b5cf6; font-weight: bold; margin-right: 10px;">4.</span>
              Once approved, you can access your doctor dashboard and start helping patients
            </div>
          </div>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <div style="display: flex; align-items: center;">
            <span style="font-size: 20px; margin-right: 10px;">⏰</span>
            <div>
              <strong style="color: #92400e;">Expected Review Time:</strong><br>
              <span style="color: #92400e;">2-3 business days</span>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">
            Need to update your application or have questions?
          </p>
          <a href="#" class="btn" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
            Contact Support →
          </a>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Medi QR <onboarding@resend.dev>",
      to: [email],
      subject: "📋 Doctor Application Received - Medi QR",
      html: getEmailTemplate(content, "Application Received", "#8b5cf6"),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }
    console.log("Doctor application email sent:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err };
  }
};

// Bonus: Doctor approval email function
export const doctorApprovalMessage = async (
  email: string,
  doctorName: string
): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    const content = `
      <div class="main-content">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
          <h2 style="color: #10b981; margin-bottom: 15px; font-size: 28px;">
            Congratulations, Dr. ${doctorName}!
          </h2>
          <p style="color: #475569; font-size: 18px;">
            Your doctor application has been approved!
          </p>
        </div>

        <div class="highlight">
          <h3 style="color: #10b981; margin-bottom: 15px; font-size: 18px;">🎯 Your Doctor Dashboard</h3>
          <p style="color: #475569; margin-bottom: 15px;">
            You now have access to all professional features including:
          </p>
          <ul style="color: #475569; padding-left: 20px; line-height: 1.8;">
            <li>Patient management system</li>
            <li>Medical record access and QR code scanning</li>
            <li>Appointment scheduling integration</li>
            <li>Prescription management tools</li>
            <li>Professional network access</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="#" class="btn" style="background: linear-gradient(135deg, #10b981, #059669);">
            Access Doctor Dashboard →
          </a>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Medi QR <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 Doctor Application Approved - Welcome to Medi QR!",
      html: getEmailTemplate(content, "Application Approved", "#10b981"),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }
    console.log("Doctor approval email sent:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err };
  }
};
