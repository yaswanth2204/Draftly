const axios = require('axios');

class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.apiUrl = process.env.DEEPSEEK_API_URL;
    
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not found in environment variables');
    }
  }

  async generateReply(emailData, tone = 'professional') {
    try {
      console.log(`Generating ${tone} reply for email: ${emailData.subject}`);

      const prompt = this.buildPrompt(emailData, tone);
      
      const response = await axios.post(this.apiUrl, {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(tone)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      const generatedReply = response.data.choices[0].message.content.trim();
      
      console.log('AI reply generated successfully');
      
      return {
        reply: generatedReply,
        tone: tone,
        timestamp: new Date().toISOString(),
        originalEmailId: emailData.id
      };

    } catch (error) {
      console.error('Error generating AI reply:', error.message);
      
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(`DeepSeek API Error: ${error.response.data.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('Network error: Unable to reach DeepSeek API');
      } else {
        throw new Error(`AI reply generation failed: ${error.message}`);
      }
    }
  }

  getSystemPrompt(tone) {
    const prompts = {
      professional: "You are a professional email assistant. Write formal, courteous, and business-appropriate email replies. Use proper email etiquette and maintain a respectful tone.",
      
      friendly: "You are a friendly email assistant. Write warm, approachable, and personable email replies. Use a conversational tone while remaining polite and helpful.",
      
      casual: "You are a casual email assistant. Write relaxed, informal email replies. Use a conversational tone as if talking to a friend, but still be respectful.",
      
      concise: "You are a concise email assistant. Write brief, to-the-point email replies. Get straight to the point while being polite and covering all necessary information."
    };

    return prompts[tone] || prompts.professional;
  }

  buildPrompt(emailData, tone) {
    return `Please write a ${tone} email reply to the following email:

FROM: ${emailData.from}
SUBJECT: ${emailData.subject}
DATE: ${emailData.date}

EMAIL CONTENT:
${emailData.body}

Instructions:
1. Draft the reply in a ${tone} style
2. Directly respond to the key points in the original message
3. Ensure the response is supportive and solution-oriented
4. Keep it clear, concise, and complete
5. Exclude subject lines or header details
6. Only provide the reply body text

Reply:`;
  }

  validateEmailData(emailData) {
    if (!emailData || !emailData.id) {
      throw new Error('Invalid email data provided');
    }
    
    if (!emailData.body && !emailData.snippet) {
      throw new Error('Email has no content to reply to');
    }
    
    return true;
  }
}

module.exports = new DeepSeekService();