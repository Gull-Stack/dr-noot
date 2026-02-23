const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key from environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, fax_number, _timestamp } = req.body;

  // Honeypot spam protection - if fax_number field is filled, it's a bot
  if (fax_number) {
    console.log('Honeypot triggered:', { fax_number });
    return res.status(200).json({ success: true }); // Don't reveal it was blocked
  }

  // Timestamp protection - form must be filled for at least 3 seconds
  const timestampDiff = Date.now() - parseInt(_timestamp);
  if (timestampDiff < 3000) {
    console.log('Form filled too quickly:', { timestampDiff });
    return res.status(200).json({ success: true }); // Don't reveal it was blocked
  }

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ 
      error: 'Please fill in all required fields (name, email, and message)' 
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  // Gibberish detection - check for reasonable text patterns
  const gibberishPatterns = [
    /(.)\1{4,}/, // Repeated characters (aaaaa)
    /^[a-z]{50,}$/i, // Too many consecutive letters
    /^\w+\d+\w+\d+/i, // Mixed letters/numbers pattern (common in spam)
  ];
  
  const isGibberish = gibberishPatterns.some(pattern => 
    pattern.test(name) || pattern.test(message)
  );
  
  if (isGibberish) {
    console.log('Gibberish detected:', { name, message });
    return res.status(200).json({ success: true }); // Don't reveal it was blocked
  }

  try {
    // Format the message content
    const formattedMessage = `
NEW PATIENT INQUIRY - Dr. Noot Biomimetic Dentistry

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}

---
Submitted from: drnoot.com contact form
Time: ${new Date().toLocaleString('en-US', { 
  timeZone: 'America/Denver',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
    `.trim();

    // Email to Dr. Noot's practice
    const practiceEmail = {
      to: 'DrNoot@drnoot.com',
      cc: 'bryce@gullstack.com',
      from: 'noreply@drnoot.com',
      subject: `New Patient Inquiry - ${name}`,
      text: formattedMessage,
    };

    // Auto-reply to the patient
    const patientReply = {
      to: email,
      from: 'DrNoot@drnoot.com',
      subject: 'Thank you for contacting Dr. Noot Biomimetic Dentistry',
      text: `
Dear ${name},

Thank you for your inquiry about biomimetic dentistry! We received your message and will respond within 24 hours.

Dr. Arnoud Noot specializes in preserving your natural teeth using advanced biomimetic techniques. Unlike traditional dentistry that relies on crowns and root canals, our approach focuses on conservative treatments that maintain your natural tooth structure for life.

What happens next:
• We'll review your message and call you within 24 hours
• Schedule a comprehensive consultation at your convenience  
• Discuss how biomimetic dentistry can help preserve your natural teeth

Our office is conveniently located in American Fork at:
686 E 110 S #201, American Fork, UT 84003

You can also reach us directly:
Phone: (801) 756-7740
Email: DrNoot@drnoot.com

We look forward to helping you achieve optimal oral health through biomimetic dentistry.

Best regards,
Dr. Arnoud Noot, DDS
Academy of Biomimetic Dentistry

---
This is an automated response from drnoot.com
      `.trim(),
    };

    // Send both emails
    await Promise.all([
      sgMail.send(practiceEmail),
      sgMail.send(patientReply)
    ]);

    console.log('Contact form emails sent successfully:', { name, email });

    return res.status(200).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('SendGrid error:', error);
    
    // Don't expose detailed error info to client
    return res.status(500).json({
      error: 'There was a problem sending your message. Please try calling us directly at (801) 756-7740.'
    });
  }
}