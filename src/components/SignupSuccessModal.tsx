import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, AlertCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SignupSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  userName: string;
}

const SignupSuccessModal = ({ isOpen, onClose, email, userName }: SignupSuccessModalProps) => {
  const [step, setStep] = useState<'success' | 'verification'>('success');

  const handleContinue = () => {
    setStep('verification');
  };

  const handleComplete = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'success' ? (
          <>
            <DialogHeader className="text-center space-y-4">
              <div className="mx-auto bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Welcome to Gurukul Pustakalaya!
              </DialogTitle>
              <DialogDescription className="text-base">
                Hi <span className="font-medium text-foreground">{userName}</span>! Your account has been created successfully.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Account Verification</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                      We've sent a verification link to <span className="font-medium">{email}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                  Pending Verification
                </Badge>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleContinue} className="w-full">
                Continue to Dashboard
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                I'll verify later
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="text-center space-y-4">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-fit">
                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Check Your Email
              </DialogTitle>
              <DialogDescription className="text-base">
                We've sent a verification link to your email address
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900 dark:text-amber-100">Important</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                      Please verify your email to access all features including book uploads and messaging.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email?
                </p>
                <Button variant="link" className="h-auto p-0 text-sm">
                  Resend verification email
                </Button>
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Got it, thanks!
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignupSuccessModal;