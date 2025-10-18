import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Lock, User, Shield, ArrowLeft } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin, isAdmin } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast.error('نام کاربری و رمز عبور الزامی است');
      return;
    }

    setLoading(true);
    try {
      const result = await adminLogin(credentials.username, credentials.password);
      if (result.success) {
        toast.success('ورود موفقیت‌آمیز');
        navigate('/admin');
      } else {
        toast.error(result.message || 'نام کاربری یا رمز عبور اشتباه است');
      }
    } catch (error) {
      toast.error('خطا در ورود. لطفاً دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-white hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          بازگشت به صفحه اصلی
        </Button>

        <Card className="shadow-2xl border-purple-500/20">
          <CardHeader className="text-center space-y-4">
            {/* Admin Icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                ورود مدیریت
              </CardTitle>
              <CardDescription className="mt-2">
                پنل مدیریت گاراژ سنگین
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="admin-username" className="text-sm font-medium">
                  نام کاربری
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-username"
                    type="text"
                    placeholder="نام کاربری ادمین"
                    value={credentials.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10"
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-medium">
                  رمز عبور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="رمز عبور"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading || !credentials.username.trim() || !credentials.password.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال ورود...
                  </>
                ) : (
                  <>
                    <Shield className="ml-2 h-4 w-4" />
                    ورود به پنل مدیریت
                  </>
                )}
              </Button>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800 text-center">
                  🔒 این صفحه فقط برای مدیران سیستم است
                </p>
              </div>

              {/* Dev Mode Info */}
              {process.env.NODE_ENV !== 'production' && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs text-orange-800 font-semibold mb-1">
                    🛠️ حالت توسعه
                  </p>
                  <div className="text-xs text-orange-700 space-y-1">
                    <p>• Username: <code className="bg-orange-100 px-1 rounded">admin</code></p>
                    <p>• Password: <code className="bg-orange-100 px-1 rounded">admin123</code></p>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            برای ورود به عنوان کاربر عادی{' '}
            <button
              onClick={() => navigate('/auth')}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              اینجا کلیک کنید
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
