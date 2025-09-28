import { Mail, Clock, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Email } from '@/types/email';

interface EmailListProps {
  emails: Email[];
  onDraftReply: (email: Email) => void;
}

const EmailList = ({ emails, onDraftReply }: EmailListProps) => {
  if (emails.length === 0) {
    return (
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Unread Emails
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            Your inbox is all caught up! Click "Refresh" to check for new emails 
            that need AI-powered replies.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Unread Emails</h2>
          <p className="text-sm text-muted-foreground">
            {emails.length} {emails.length === 1 ? 'email' : 'emails'} ready for AI replies
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Ready
        </Badge>
      </div>
      
      <div className="space-y-3">
        {emails.map((email, index) => (
          <Card 
            key={email.id} 
            className="bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-all duration-300 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-gradient-primary text-white text-sm font-medium">
                      {getInitials(email.from.split(' <')[0] || email.from)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {email.from.includes('<') 
                          ? email.from.split(' <')[0] 
                          : email.from.split('@')[0]
                        }
                      </p>
                      <Badge variant="outline" className="text-xs">
                        New
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                      {email.subject || 'No Subject'}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(email.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="bg-muted/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {email.snippet || email.body || 'No preview available'}
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => onDraftReply(email)}
                  className="bg-gradient-primary hover:shadow-soft transition-all duration-200 hover:scale-105"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Draft AI Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmailList;