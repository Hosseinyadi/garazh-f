# 🧪 راهنمای تست سیستم - Bil Flow

## ✅ وضعیت سرورها

### Frontend (Vite + React)
- **آدرس:** http://localhost:5173
- **وضعیت:** ✅ در حال اجرا
- **پورت:** 5173

### Backend (Express + SQLite)
- **آدرس API:** http://localhost:8080/api
- **آدرس Health Check:** http://localhost:8080/health
- **وضعیت:** ✅ در حال اجرا
- **پورت:** 8080
- **دیتابیس:** SQLite (محلی)

---

## 🔐 تست ورود و ثبت نام

### 1️⃣ ورود/ثبت نام کاربر عادی (با OTP)

**مراحل:**

1. برو به صفحه: http://localhost:5173/auth
2. در تب **"کاربر"** بمان
3. شماره موبایل ایرانی وارد کن (مثل: `09123456789`)
4. (اختیاری) نام خود را وارد کن
5. روی **"ارسال کد تایید"** کلیک کن

**⚠️ مهم - کد OTP در کنسول سرور:**
```bash
# در terminal سرور (port 8080) کد OTP نمایش داده می‌شود:
[DEV] OTP for +989123456789: 123456
```

6. کد 6 رقمی را در کنسول سرور پیدا کن
7. کد را در فرانت‌اند وارد کن
8. روی **"تایید"** کلیک کن

**✅ نتیجه:** 
- کاربر ثبت نام/ورود می‌شود
- به صفحه اصلی هدایت می‌شوید
- توکن JWT در localStorage ذخیره می‌شود

---

### 2️⃣ ورود ادمین (بدون OTP)

**اطلاعات ورود:**

```
👤 Username: admin
🔑 Password: admin123
```

**یا استفاده از ادمین پیش‌فرض:**
```
👤 Username: hossein  
🔑 Password: password
```

**مراحل:**

1. برو به صفحه: http://localhost:5173/auth
2. روی تب **"ادمین"** کلیک کن
3. نام کاربری: `admin` یا `hossein`
4. رمز عبور: `admin123` یا `password`
5. روی **"ورود ادمین"** کلیک کن

**✅ نتیجه:**
- ادمین وارد می‌شود
- به پنل مدیریت `/admin` هدایت می‌شوید

---

## 📝 تست ثبت آگهی

### پیش‌نیاز:
- باید به عنوان کاربر عادی وارد شده باشید

**مراحل:**

1. برو به: http://localhost:5173/post-ad
2. فرم را پر کن:
   - عنوان آگهی
   - توضیحات
   - قیمت
   - نوع (اجاره/فروش)
   - دسته‌بندی
   - موقعیت مکانی
3. روی **"ثبت آگهی"** کلیک کن

**✅ نتیجه:**
- آگهی در دیتابیس ذخیره می‌شود
- در لیست آگهی‌ها نمایش داده می‌شود

---

## 🛠️ دستورات مفید

### شروع/توقف سرورها

```bash
# Frontend (اجرا شده است)
npm run dev

# Backend
cd server
npm start

# ایجاد ادمین جدید
cd server
node create-test-admin.js
```

### بررسی سلامت سرورها

```bash
# Frontend
curl http://localhost:5173

# Backend Health Check
curl http://localhost:8080/health
```

---

## 🔍 دیباگ و عیب‌یابی

### 1. کد OTP را نمی‌بینم

**راه‌حل:**
- کنسول سرور (terminal که `npm start` را در پوشه server اجرا کردید) را چک کنید
- باید خطی شبیه این ببینید:
  ```
  [DEV] OTP for +989123456789: 654321
  ```

### 2. خطای "API Request Error"

**راه‌حل:**
- مطمئن شوید بک‌اند روی پورت 8080 در حال اجراست
- آدرس http://localhost:8080/health را باز کنید، باید پاسخ JSON دریافت کنید

### 3. خطای CORS

**راه‌حل:**
- در `server/server.js` تنظیمات CORS روی `http://localhost:5173` است
- اگر از پورت دیگری استفاده می‌کنید، باید تغییر دهید

### 4. خطای دیتابیس

**راه‌حل:**
```bash
cd server
rm database/bilflow.db
npm start  # دیتابیس مجدد ایجاد می‌شود
node create-test-admin.js  # ادمین را دوباره بسازید
```

---

## 📊 مشاهده داده‌های دیتابیس

### استفاده از SQLite Browser

1. دانلود DB Browser for SQLite: https://sqlitebrowser.org/
2. فایل را باز کنید: `server/database/bilflow.db`
3. جداول موجود:
   - `users` - کاربران
   - `admin_users` - ادمین‌ها
   - `listings` - آگهی‌ها
   - `categories` - دسته‌بندی‌ها
   - `otp_verifications` - کدهای OTP
   - `orders` - سفارشات
   - `inquiries` - استعلام‌ها

---

## 🎯 سناریوهای تست

### سناریو 1: ثبت نام کاربر جدید
1. ✅ ثبت نام با OTP
2. ✅ ورود به پنل کاربری
3. ✅ ویرایش پروفایل
4. ✅ ثبت آگهی جدید

### سناریو 2: ورود ادمین
1. ✅ ورود با username/password
2. ✅ مشاهده داشبورد
3. ✅ مدیریت آگهی‌ها
4. ✅ مدیریت کاربران

### سناریو 3: جستجو و فیلتر
1. ✅ جستجوی آگهی
2. ✅ فیلتر براساس دسته‌بندی
3. ✅ فیلتر براساس قیمت
4. ✅ مشاهده جزئیات آگهی

---

## 🔑 اطلاعات مهم

### کدهای OTP تست (در حالت Development)

در حالت توسعه، هر کد OTP که تولید می‌شود در کنسول سرور نمایش داده می‌شود:

```bash
🚀 Bil Flow Server running on port 8080
...
[DEV] OTP for +989123456789: 123456
```

### حساب‌های ادمین

| Username | Password | نقش |
|----------|----------|-----|
| admin | admin123 | ادمین تست |
| hossein | password | ادمین پیش‌فرض |

---

## 📱 Endpoints مهم

### Authentication
- `POST /api/auth/send-otp` - ارسال OTP
- `POST /api/auth/verify-otp` - تایید OTP و ورود
- `POST /api/auth/admin/login` - ورود ادمین
- `GET /api/auth/profile` - پروفایل کاربر
- `PUT /api/auth/profile` - ویرایش پروفایل

### Listings
- `GET /api/listings` - لیست آگهی‌ها
- `GET /api/listings/:id` - جزئیات آگهی
- `POST /api/listings` - ایجاد آگهی
- `PUT /api/listings/:id` - ویرایش آگهی
- `DELETE /api/listings/:id` - حذف آگهی

### Admin
- `GET /api/admin/dashboard` - داشبورد ادمین
- `GET /api/admin/listings` - لیست آگهی‌ها (ادمین)
- `GET /api/admin/users` - لیست کاربران
- `PATCH /api/admin/listings/:id/status` - تغییر وضعیت آگهی

---

## 🎉 شروع تست

### گام 1: اطمینان از اجرای سرورها
```bash
# Terminal 1 - Frontend (already running)
# http://localhost:5173

# Terminal 2 - Backend (already running)
# http://localhost:8080
```

### گام 2: تست ورود
1. باز کردن: http://localhost:5173/auth
2. تست ورود کاربر با OTP
3. تست ورود ادمین

### گام 3: تست عملکرد
1. ثبت آگهی
2. جستجو در آگهی‌ها
3. مشاهده پنل ادمین

---

**✨ موفق باشید!**

اگر مشکلی بود، کنسول مرورگر (F12) و کنسول سرور را چک کنید.
