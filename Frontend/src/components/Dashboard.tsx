import { useState, useEffect } from 'react';
import { Mail, RefreshCw, LogOut, Sparkles, Inbox, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { authService, emailService } from '@/services/api';
import { User as UserType, Email } from '@/types/email';
import EmailList from './EmailList';
import ReplyModal from './ReplyModal';

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.checkAuth();
      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      window.location.href = '/login';
    }
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await emailService.getUnreadEmails();
      setEmails(response.data.emails);
      toast({
        title: "Emails fetched successfully",
        description: `Found ${response.data.emails.length} unread emails`,
      });
    } catch (error: any) {
      toast({
        title: "Error fetching emails",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDraftReply = (email: Email) => {
    setSelectedEmail(email);
    setShowModal(true);
  };

  const handleEmailSent = (emailId: string) => {
    setEmails(emails.filter(email => email.id !== emailId));
    setShowModal(false);
    toast({
      title: "Reply sent successfully",
      description: "Your AI-generated reply has been sent!",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Draftly</h1>
                <p className="text-xs text-muted-foreground">AI Email Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={fetchEmails}
                disabled={loading}
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:shadow-soft"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Fetching...' : 'Refresh'}
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-sm">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Inbox className="w-4 h-4 mr-2" />
                  Unread Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{emails.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready for AI replies
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-2">Active</Badge>
                <p className="text-xs text-muted-foreground">
                  Smart reply generation enabled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Email List */}
          <div className="lg:col-span-3">
            <EmailList 
              emails={emails}
              onDraftReply={handleDraftReply}
            />
          </div>
        </div>
      </main>

      {/* Reply Modal */}
      {showModal && selectedEmail && (
        <ReplyModal
          email={selectedEmail}
          onClose={() => setShowModal(false)}
          onEmailSent={handleEmailSent}
        />
      )}
    </div>
  );
};

export default Dashboard;