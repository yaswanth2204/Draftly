import { useState, useEffect } from 'react';
import { X, Send, RefreshCw, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { aiService, emailService } from '@/services/api';
import { Email, REPLY_TONES } from '@/types/email';

interface ReplyModalProps {
  email: Email;
  onClose: () => void;
  onEmailSent: (emailId: string) => void;
}

const ReplyModal = ({ email, onClose, onEmailSent }: ReplyModalProps) => {
  const [tone, setTone] = useState('professional');
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateReply();
  }, [tone]);

  const generateReply = async () => {
    setLoading(true);
    try {
      const response = await aiService.generateReply(email.id, tone);
      setReplyContent(response.data.generatedReply);
    } catch (error: any) {
      toast({
        title: "Error generating reply",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please generate or write a reply before sending.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      await emailService.sendReply(email.id, replyContent);
      toast({
        title: "Reply sent successfully",
        description: "Your AI-generated reply has been sent!",
      });
      setTimeout(() => {
        onEmailSent(email.id);
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error sending reply",
        description: error.message,
        variant: "destructive",
      });
      setSending(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(replyContent);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Reply content has been copied.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const selectedTone = REPLY_TONES.find(t => t.value === tone);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-elevated border-0 animate-bounce-in">
        <CardHeader className="bg-gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Reply Generator</CardTitle>
                <p className="text-sm text-white/80">
                  Replying to: {email.from.split('<')[0].trim()}
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/10"
              disabled={sending}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto">
          {/* Email Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Original Email</h4>
              <Badge variant="secondary">Subject: {email.subject || 'No Subject'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {email.snippet || email.body}
            </p>
          </div>

          {/* Tone Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Reply Tone</label>
            <Select value={tone} onValueChange={setTone} disabled={loading || sending}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPLY_TONES.map((toneOption) => (
                  <SelectItem key={toneOption.value} value={toneOption.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{toneOption.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {toneOption.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTone && (
              <p className="text-xs text-muted-foreground">
                {selectedTone.description}
              </p>
            )}
          </div>

          {/* Generated Reply */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Generated Reply</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={loading || !replyContent}
                  className="text-xs"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateReply}
                  disabled={loading || sending}
                  className="text-xs"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={loading ? "Generating AI reply..." : "Your reply will appear here..."}
                className="min-h-32 resize-none"
                disabled={loading || sending}
              />
              
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Generating reply with {selectedTone?.label.toLowerCase()} tone...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSend}
              disabled={loading || sending || !replyContent.trim()}
              className="bg-gradient-primary hover:shadow-soft transition-all duration-200"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReplyModal;