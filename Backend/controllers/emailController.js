const GmailService = require('../services/gmailService');

const getUnreadEmails = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        error: 'User not authenticated' 
      });
    }

    // Check if user has valid tokens
    if (!req.user.accessToken) {
      return res.status(401).json({ 
        error: 'No access token found. Please re-authenticate.' 
      });
    }

    console.log(`User ${req.user.email} requesting unread emails`);

    // Create Gmail service instance
    const gmailService = new GmailService(
      req.user.accessToken, 
      req.user.refreshToken
    );

    // Fetch unread emails
    const emails = await gmailService.getUnreadEmails(5);

    res.json({
      success: true,
      count: emails.length,
      emails: emails
    });

  } catch (error) {
    console.error('❌ Error in getUnreadEmails:', error.message);
    
    // Handle specific Gmail API errors
    if (error.message.includes('invalid_grant') || error.message.includes('unauthorized')) {
      return res.status(401).json({
        error: 'Gmail access expired. Please re-authenticate.',
        needsReauth: true
      });
    }

    res.status(500).json({
      error: 'Failed to fetch emails',
      details: error.message
    });
  }
};

const sendReply = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { emailId, replyContent } = req.body;

    if (!emailId || !replyContent) {
      return res.status(400).json({ 
        error: 'Email ID and reply content are required' 
      });
    }

    if (replyContent.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Reply content cannot be empty' 
      });
    }

    console.log(`👤 User ${req.user.email} sending reply to email ${emailId}`);

    // Create Gmail service instance
    const gmailService = new GmailService(
      req.user.accessToken, 
      req.user.refreshToken
    );

    // Send the reply
    const result = await gmailService.sendReply(emailId, replyContent);

    console.log('✅ Reply sent successfully');

    res.json({
      success: true,
      messageId: result.messageId,
      threadId: result.threadId,
      message: 'Reply sent successfully!'
    });

  } catch (error) {
    console.error('❌ Error in sendReply:', error.message);
    
    // Handle specific Gmail API errors
    if (error.message.includes('invalid_grant') || error.message.includes('unauthorized')) {
      return res.status(401).json({
        error: 'Gmail access expired. Please re-authenticate.',
        needsReauth: true
      });
    }

    if (error.message.includes('quotaExceeded')) {
      return res.status(429).json({
        error: 'Gmail API quota exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      error: 'Failed to send reply',
      details: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ 
        error: 'Email ID is required' 
      });
    }

    console.log(`👤 User ${req.user.email} marking email ${emailId} as read`);

    // Create Gmail service instance
    const gmailService = new GmailService(
      req.user.accessToken, 
      req.user.refreshToken
    );

    // Mark the email as read
    const result = await gmailService.markAsRead(emailId);

    console.log('✅ Email marked as read successfully');

    res.json({
      success: true,
      messageId: result.messageId,
      message: 'Email marked as read successfully!'
    });

  } catch (error) {
    console.error('❌ Error in markAsRead:', error.message);
    
    // Handle specific Gmail API errors
    if (error.message.includes('invalid_grant') || error.message.includes('unauthorized')) {
      return res.status(401).json({
        error: 'Gmail access expired. Please re-authenticate.',
        needsReauth: true
      });
    }

    res.status(500).json({
      error: 'Failed to mark email as read',
      details: error.message
    });
  }
};

module.exports = {
  getUnreadEmails,
  sendReply,
  markAsRead
};