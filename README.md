# Bil Flow - بازارگاه ماشین آلات سنگین

پلتفرم جامع خرید و فروش و اجاره ماشین آلات سنگین با قابلیت‌های پیشرفته

## ویژگی‌ها

### 🔐 احراز هویت امن
- ورود و ثبت‌نام با OTP پیامکی
- پروفایل کاربری کامل
- سیستم ادمین با دسترسی‌های مختلف

### 🚜 مدیریت آگهی‌ها
- آگهی‌های اجاره و فروش
- جستجوی پیشرفته با فیلترها
- صفحات جزئیات کامل
- سیستم علاقه‌مندی‌ها

### 📊 پنل مدیریت
- داشبورد آماری کامل
- مدیریت آگهی‌ها و کاربران
- ردیابی بازدیدها
- کنترل وضعیت آگهی‌ها

### 📱 رابط کاربری مدرن
- طراحی ریسپانسیو
- تجربه کاربری بهینه
- پشتیبانی از RTL

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 16+
- npm یا yarn

### نصب فرانت‌اند
```bash
# نصب وابستگی‌ها
npm install

# اجرای پروژه در حالت توسعه
npm run dev

# ساخت پروژه برای تولید
npm run build
```

### نصب بک‌اند
```bash
# رفتن به پوشه سرور
cd server

# نصب وابستگی‌ها
npm install

# اجرای سرور
npm start
```

## ساختار پروژه

```
├── src/                    # کد فرانت‌اند
│   ├── components/         # کامپوننت‌های UI
│   ├── pages/             # صفحات اصلی
│   ├── hooks/             # هوک‌های React
│   ├── services/          # سرویس‌های API
│   └── utils/             # ابزارهای کمکی
├── server/                # سرور Node.js
│   ├── routes/            # مسیرهای API
│   ├── middleware/        # میدل‌ویرها
│   ├── services/          # سرویس‌های بک‌اند
│   └── database/          # دیتابیس SQLite
└── public/                # فایل‌های استاتیک
```

## API Endpoints

### احراز هویت
- `POST /api/auth/send-otp` - ارسال کد تایید
- `POST /api/auth/verify-otp` - تایید کد و ورود
- `POST /api/auth/admin/login` - ورود ادمین

### آگهی‌ها
- `GET /api/listings` - لیست آگهی‌ها
- `GET /api/listings/:id` - جزئیات آگهی
- `POST /api/listings` - ایجاد آگهی جدید

### علاقه‌مندی‌ها
- `GET /api/favorites` - لیست علاقه‌مندی‌ها
- `POST /api/favorites` - افزودن به علاقه‌مندی‌ها

## تنظیمات

### متغیرهای محیطی
فایل `.env` را در ریشه پروژه ایجاد کنید:

```env
VITE_API_URL=http://localhost:3001/api
```

### تنظیمات سرور
فایل `.env` را در پوشه `server` ایجاد کنید:

```env
PORT=3001
NODE_ENV=production
JWT_SECRET=your-secret-key
SMS_USERNAME=your_sms_username
SMS_PASSWORD=your_sms_password
```

## دیتابیس

پروژه از SQLite استفاده می‌کند که به صورت خودکار ایجاد می‌شود. دیتابیس شامل جداول زیر است:

- `users` - کاربران
- `listings` - آگهی‌ها
- `categories` - دسته‌بندی‌ها
- `user_favorites` - علاقه‌مندی‌ها
- `listing_views` - بازدیدها
- `admin_users` - ادمین‌ها

## استقرار

### استقرار فرانت‌اند
```bash
npm run build
# فایل‌های dist را روی سرور وب آپلود کنید
```

### استقرار بک‌اند
```bash
cd server
npm install --production
npm start
```

## امنیت

- احراز هویت JWT
- Rate Limiting
- اعتبارسنجی ورودی‌ها
- CORS تنظیم شده
- Helmet برای امنیت HTTP

## پشتیبانی

برای پشتیبانی و گزارش باگ با تیم توسعه تماس بگیرید.

## لایسنس

MIT License