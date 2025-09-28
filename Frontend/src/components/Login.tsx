import { Chrome, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/api";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md shadow-elevated border-0 bg-white/95 backdrop-blur-sm animate-bounce-in">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Draftly
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Gmail Auto Reply Assistant
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm">AI-powered email responses</span>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect your Google account to access Gmail and start generating intelligent, 
              contextual email replies with advanced AI assistance.
            </p>
          </div>
          
          <Button 
            onClick={authService.loginWithGoogle}
            size="lg"
            className="w-full h-12 bg-gradient-primary hover:shadow-soft transition-all duration-300 hover:scale-105"
          >
            <Chrome className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>
          
          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>By continuing, you agree to our terms and privacy policy</p>
            <p className="text-primary">🔒 Your data is secure and encrypted</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;