import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCircle, Users, Shield, Database } from 'lucide-react';
import { toast } from 'sonner';

const DevTools = () => {
  const navigate = useNavigate();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const testAccounts = [
    {
      type: 'admin',
      icon: Shield,
      title: 'ادمین تست',
      username: 'admin',
      password: 'admin123',
      description: 'دسترسی کامل به پنل مدیریت',
      color: 'bg-red-500'
    },
    {
      type: 'admin',
      icon: Shield,
      title: 'ادمین پیش‌فرض',
      username: 'hossein',
      password: 'password',
      description: 'حساب ادمین پیش‌فرض سیستم',
      color: 'bg-orange-500'
    }
  ];

  const otpInstructions = [
    'شماره موبایل ایرانی وارد کنید (مثل: 09123456789)',
    'روی "ارسال کد تایید" کلیک کنید',
    'کنسول سرور را بررسی کنید (Terminal با port 8080)',
    'خط شبیه این را پیدا کنید: [DEV] OTP for +989123456789: 123456',
    'کد 6 رقمی را کپی کنید و در فرانت‌اند وارد کنید'
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('کپی شد!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>دسترسی محدود</CardTitle>
          </CardHeader>
          <CardContent>
            <p>این صفحه فقط در حالت Development در دسترس است.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به صفحه اصلی
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">ابزارهای توسعه</h1>
          </div>
          <p className="text-gray-600">اطلاعات تست و دیباگ برای توسعه‌دهندگان</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                حساب‌های ادمین تست
              </CardTitle>
              <CardDescription>
                برای ورود به پنل مدیریت از این حساب‌ها استفاده کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${account.color} bg-opacity-10`}>
                        <account.icon className={`h-5 w-5 text-${account.color.replace('bg-', '')}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.title}</h3>
                        <p className="text-sm text-gray-600">{account.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{account.type}</Badge>
                  </div>
                  
                  <div className="space-y-2 bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">نام کاربری</p>
                        <p className="font-mono font-semibold text-gray-900">{account.username}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(account.username, index * 2)}
                      >
                        {copiedIndex === index * 2 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">رمز عبور</p>
                        <p className="font-mono font-semibold text-gray-900">{account.password}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(account.password, index * 2 + 1)}
                      >
                        {copiedIndex === index * 2 + 1 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-3"
                    onClick={() => navigate('/auth')}
                  >
                    رفتن به صفحه ورود
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* OTP Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                ثبت نام/ورود کاربر عادی (با OTP)
              </CardTitle>
              <CardDescription>
                راهنمای دریافت و استفاده از کد تایید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-semibold mb-2">
                  ⚠️ توجه: کد OTP در کنسول سرور نمایش داده می‌شود
                </p>
                <p className="text-sm text-yellow-700">
                  کنسول Terminal که سرور را با `npm start` در پوشه server اجرا کرده‌اید را چک کنید.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">مراحل:</h4>
                {otpInstructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <p className="mb-1"># مثال خروجی کنسول سرور:</p>
                <p>[DEV] OTP for +989123456789: <span className="text-yellow-300 font-bold">123456</span></p>
              </div>

              <Button 
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                رفتن به صفحه ورود
              </Button>
            </CardContent>
          </Card>

          {/* API Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                اطلاعات API و سرور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Frontend</p>
                  <p className="font-mono text-sm text-gray-900">http://localhost:5173</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-semibold mb-1">Backend API</p>
                  <p className="font-mono text-sm text-gray-900">http://localhost:8080/api</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-semibold mb-1">Health Check</p>
                  <p className="font-mono text-sm text-gray-900">http://localhost:8080/health</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DevTools;
