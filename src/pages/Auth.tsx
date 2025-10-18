import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Phone, User, ArrowLeft } from 'lucide-react';

interface AuthState {
  phone: string;
  otp: string;
  name: string;
  step: 'phone' | 'otp';
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sendOTP, isAuthenticated, isLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  const [state, setState] = useState<AuthState>({
    phone: '',
    otp: '',
    name: '',
    step: 'phone'
  });

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = location.state?.from?.pathname || '/';
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleInputChange = (field: keyof AuthState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('09')) return '+98' + cleaned.substring(1);
    if (cleaned.startsWith('9')) return '+98' + cleaned;
    return phone;
  };

  const handleSendOTP = async () => {
    if (!state.phone.trim()) {
      toast.error('شماره موبایل الزامی است');
      return;
    }

    const formattedPhone = formatPhoneNumber(state.phone);
    
    setLoading(true);
    try {
      const result = await sendOTP(formattedPhone, state.name);
      if (result.success) {
        setOtpSent(true);
        setState(prev => ({ ...prev, step: 'otp', phone: formattedPhone }));
        setOtpTimer(300);
        toast.success('کد تایید ارسال شد');
      } else {
        toast.error(result.message || 'خطا در ارسال کد تایید');
      }
    } catch (error) {
      toast.error('خطا در ارسال کد تایید');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!state.otp.trim() || state.otp.length !== 6) {
      toast.error('کد تایید باید 6 رقم باشد');
      return;
    }

    setLoading(true);
    try {
      const result = await login(state.phone, state.otp, state.name);
      if (result.success) {
        toast.success('ورود موفقیت‌آمیز');
        const redirect = location.state?.from?.pathname || '/';
        navigate(redirect);
      } else {
        toast.error(result.message || 'خطا در ورود');
      }
    } catch (error) {
      toast.error('خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (otpTimer > 0) {
      toast.error(`لطفاً ${otpTimer} ثانیه صبر کنید`);
      return;
    }
    handleSendOTP();
  };

  const handleBackToPhone = () => {
    setState(prev => ({ ...prev, step: 'phone', otp: '' }));
    setOtpSent(false);
    setOtpTimer(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              ورود
            </CardTitle>
            <CardDescription>
              گاراژ سنگین - بازارگاه ماشین آلات سنگین
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.step === 'phone' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره موبایل</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="09123456789"
                        value={state.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">نام (اختیاری)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="نام شما"
                        value={state.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSendOTP}
                    disabled={loading || !state.phone.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Phone className="mr-2 h-4 w-4" />
                    )}
                    ارسال کد تایید
                  </Button>

                  {/* Register Link */}
                  <div className="text-center text-sm text-gray-600 pt-4 border-t">
                    هنوز ثبت نام نکرده‌اید؟{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                      ثبت نام کنید
                    </Link>
                  </div>
                </>
              )}

              {state.step === 'otp' && (
                <>
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">کد تایید</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        value={state.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                      <p className="text-sm text-gray-500">
                        کد تایید به شماره {state.phone} ارسال شد
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleBackToPhone}
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        تغییر شماره
                      </Button>
                      <Button
                        onClick={handleVerifyOTP}
                        disabled={loading || state.otp.length !== 6}
                        className="flex-1"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          'تایید'
                        )}
                      </Button>
                    </div>

                    {otpTimer > 0 ? (
                      <p className="text-sm text-gray-500">
                        ارسال مجدد در {otpTimer} ثانیه
                      </p>
                    ) : (
                      <Button
                        variant="link"
                        onClick={handleResendOTP}
                        className="text-sm"
                      >
                        ارسال مجدد کد
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
