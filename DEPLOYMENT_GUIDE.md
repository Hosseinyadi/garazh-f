# راهنمای استقرار وب‌سایت - Deployment Guide

## 🚀 استقرار رایگان روی Netlify

### مرحله ۱: آماده‌سازی پروژه

✅ فایل‌های زیر باید در پروژه شما وجود داشته باشند:
- `netlify.toml` (ایجاد شد)
- `package.json`
- `vite.config.ts`
- فایل‌های `src/`
- فایل `.env` با متغیرهای محیطی

### مرحله ۲: آپلود کد روی GitHub

1. پروژه را روی GitHub آپلود کنید:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with security improvements"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### مرحله ۳: اتصال به Netlify

1. به وب‌سایت [netlify.com](https://netlify.com) بروید
2. با حساب GitHub وارد شوید
3. روی "Add new site" کلیک کنید
4. "Import an existing project" را انتخاب کنید
5. GitHub را انتخاب و repository خود را پیدا کنید

### مرحله ۴: تنظیمات Build

در Netlify، تنظیمات زیر را وارد کنید:

**Build settings:**
- **Branch to deploy:** `main`
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### مرحله ۵: تنظیم متغیرهای محیطی

در بخش "Environment variables" موارد زیر را اضافه کنید (بر اساس آدرس API سرور خود تنظیم کنید):

```
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_ENV=production
VITE_ENABLE_HTTPS=true
```

### مرحله ۶: استقرار

1. روی "Deploy site" کلیک کنید
2. صبر کنید تا build کامل شود (معمولاً ۲-۳ دقیقه)
3. سایت شما آماده استفاده خواهد بود!

## 🔧 تنظیمات پیشرفته

### دامنه اختصاصی (اختیاری)

اگر دامنه دارید، می‌توانید آن را به Netlify متصل کنید:
1. به بخش "Domain management" بروید
2. دامنه خود را اضافه کنید
3. DNS records را طبق دستورالعمل تنظیم کنید

### HTTPS رایگان

Netlify به طور خودکار SSL certificate رایگان صادر می‌کند.

## 🧪 تست نهایی

بعد از استقرار، تست‌های زیر را انجام دهید:

### ۱. تست عملکرد پایه
- [ ] صفحه اصلی بارگذاری شود
- [ ] منوها کار کنند
- [ ] فرم‌های ثبت نام و ورود کار کنند

### ۲. تست امنیتی
- [ ] HTTPS فعال باشد
- [ ] هدرهای امنیتی تنظیم شده باشند
- [ ] ارتباط فرانت با API بک‌اند برقرار باشد (VITE_API_URL)

### ۳. تست ریسپانسیو
- [ ] روی موبایل درست نمایش داده شود
- [ ] روی تبلت درست نمایش داده شود
- [ ] روی دسکتاپ درست نمایش داده شود

## 🔍 بررسی هدرهای امنیتی

برای بررسی هدرهای امنیتی، از ابزارهای آنلاین استفاده کنید:

1. [Security Headers](https://securityheaders.com/)
2. [SSL Labs](https://www.ssllabs.com/ssltest/)
3. [Mozilla Observatory](https://observatory.mozilla.org/)

## 📊 مانیتورینگ

برای مانیتورینگ سایت:
1. Google Analytics اضافه کنید
2. Google Search Console تنظیم کنید
3. Netlify Analytics را فعال کنید

## 🆘 مشکلات رایج

### مشکل: Build شکست خورد
**راه حل:**
- مطمئن شوید `NODE_VERSION = "18"` در `netlify.toml` تنظیم شده
- Dependencies را در `package.json` بررسی کنید

### مشکل: متغیرهای محیطی کار نمی‌کنند
**راه حل:**
- مطمئن شوید نام متغیرها با `VITE_` شروع شوند
- بعد از تغییر متغیرها، مجدداً deploy کنید

### مشکل: HTTPS کار نمی‌کند
**راه حل:**
- Netlify به طور خودکار HTTPS فعال می‌کند
- اگر فعال نشد، دامنه را بررسی کنید

## 📞 پشتیبانی

اگر مشکل داشتید:
1. Netlify documentation را مطالعه کنید
2. از Netlify forums استفاده کنید
3. با پشتیبانی Netlify تماس بگیرید

---

**✅ سایت شما آماده استقرار است!**

با دنبال کردن این راهنما، سایت شما به صورت رایگان روی Netlify مستقر خواهد شد و می‌توانید تست نهایی را انجام دهید.