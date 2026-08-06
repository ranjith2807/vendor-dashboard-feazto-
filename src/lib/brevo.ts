const BREVO_API_KEY = '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'
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

// Sender — verified in Brevo account
const FROM_EMAIL = 'mdhussain5255@gmail.com'
const FROM_NAME = 'FEAZTO Vendor'

// In-memory OTP store: email → { code, expiresAt }
const otpStore: Record<string, { code: string; expiresAt: number }> = {}

/** Generate a random 6-digit OTP */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/** Send OTP email via Brevo and store the code locally */
export async function sendEmailOtp(email: string): Promise<{ success: boolean; message: string }> {
  const code = generateOtp()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email }],
        subject: `${code} is your FEAZTO verification code`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <h2 style="font-size: 28px; letter-spacing: 2px; margin-bottom: 4px;">FEAZTO</h2>
            <p style="color: #888; margin-bottom: 28px;">Vendor Partner App</p>
            <div style="background: #FFF8E7; border-radius: 12px; padding: 24px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #555;">Your verification code is</p>
              <div style="font-size: 40px; font-weight: 700; letter-spacing: 8px; color: #000; background: #FFC50A; display: inline-block; padding: 12px 28px; border-radius: 10px; box-shadow: 4px 4px 0 #000;">
                ${code}
              </div>
              <p style="margin: 16px 0 0; font-size: 12px; color: #999;">Valid for 10 minutes. Do not share with anyone.</p>
            </div>
          </div>
        `,
      }),
    })

    if (res.status === 201 || res.status === 200) {
      // Store OTP only after confirmed sent
      otpStore[email.toLowerCase()] = { code, expiresAt }
      return { success: true, message: 'OTP sent successfully' }
    }

    const err = await res.json()
    return { success: false, message: err.message || 'Failed to send OTP' }
  } catch {
    return { success: false, message: 'Network error. Please try again.' }
  }
}

/** Verify the OTP entered by the user */
export function verifyEmailOtp(email: string, code: string): { success: boolean; message: string } {
  const record = otpStore[email.toLowerCase()]

  if (!record) return { success: false, message: 'No OTP sent to this email. Please request a new one.' }
  if (Date.now() > record.expiresAt) {
    delete otpStore[email.toLowerCase()]
    return { success: false, message: 'OTP has expired. Please request a new one.' }
  }
  if (record.code !== code.trim()) {
    return { success: false, message: 'Incorrect OTP. Please try again.' }
  }

  // Clear after successful verify
  delete otpStore[email.toLowerCase()]
  return { success: true, message: 'Verified successfully' }
}
