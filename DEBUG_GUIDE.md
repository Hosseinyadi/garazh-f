# 🔧 راهنمای رفع خطای "Failed to fetch"

## ❌ مشکل: Failed to fetch

این خطا زمانی رخ می‌دهد که فرانت‌اند نمی‌تواند به بک‌اند متصل شود.

---

## ✅ راه‌حل گام به گام

### گام 1: بررسی سرورها

#### بررسی Backend:
```bash
# روش 1: با مرورگر
باز کنید: http://localhost:8080/health

# باید این پاسخ را ببینید:
{
  "success": true,
  "message": "Bil Flow Server is running",
  "timestamp": "...",
  "version": "1.0.0"
}

# روش 2: با PowerShell
curl http://localhost:8080/health
```

✅ اگر پاسخ دریافت کردید، سرور کار می‌کند
❌ اگر خطا دریافت کردید، به گام 2 بروید

#### بررسی Frontend:
```bash
# باز کنید:
http://localhost:5173

# باید صفحه اصلی سایت را ببینید
```

---

### گام 2: اگر Backend کار نمی‌کند

```bash
# 1. Terminal جدید باز کنید
# 2. به پوشه server بروید
cd C:\Users\rose\Desktop\site\server

# 3. سرور را اجرا کنید
npm start

# 4. منتظر این پیام بمانید:
🚀 Bil Flow Server running on port 8080
```

---

### گام 3: اگر Frontend کار نمی‌کند

```bash
# 1. Terminal جدید باز کنید
# 2. به پوشه اصلی بروید
cd C:\Users\rose\Desktop\site

# 3. فرانت‌اند را اجرا کنید
npm run dev

# 4. منتظر این پیام بمانید:
VITE ready in ... ms
Local: http://localhost:5173
```

---

### گام 4: تست اتصال API

**باز کنید:** http://localhost:5173/test-api

این صفحه به صورت خودکار API را تست می‌کند:
- ✅ سبز: API کار می‌کند
- ❌ قرمز: مشکل در API

---

## 🔍 بررسی دقیق مشکل

### بررسی Console مرورگر

1. صفحه ورود را باز کنید:
   - ورود کاربر: http://localhost:5173/auth
   - ورود ادمین: http://localhost:5173/admin/login

2. کلید `F12` را بزنید (Console را باز کنید)

3. دکمه ورود را بزنید

4. در Console دنبال خطا باشید:

**خطاهای متداول:**

```javascript
// خطا 1: CORS
Access to fetch at 'http://localhost:8080/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy

// راه‌حل: سرور را Restart کنید

// خطا 2: Network Error
Failed to fetch
TypeError: Failed to fetch

// راه‌حل: بررسی کنید بک‌اند روی port 8080 در حال اجراست

// خطا 3: Connection Refused
net::ERR_CONNECTION_REFUSED

// راه‌حل: بک‌اند اجرا نشده است
```

---

## 🛠️ راه‌حل‌های سریع

### راه‌حل 1: Restart همه چیز

```bash
# 1. تمام Node را ببندید
# در PowerShell:
Stop-Process -Name node -Force

# 2. Backend را اجرا کنید
cd C:\Users\rose\Desktop\site\server
npm start

# 3. Terminal جدید باز کنید و Frontend را اجرا کنید
cd C:\Users\rose\Desktop\site
npm run dev
```

### راه‌حل 2: بررسی Port ها

```bash
# بررسی کنید پورت 8080 آزاد است:
netstat -ano | findstr :8080

# بررسی کنید پورت 5173 آزاد است:
netstat -ano | findstr :5173
```

### راه‌حل 3: تست مستقیم API

```bash
# تست ورود ادمین با PowerShell:
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/admin/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"admin123"}'

# اگر پاسخ دریافت کردید، API کار می‌کند
# مشکل در فرانت‌اند است
```

---

## 📋 Checklist عیب‌یابی

- [ ] Backend روی port 8080 در حال اجراست
- [ ] Frontend روی port 5173 در حال اجراست
- [ ] http://localhost:8080/health پاسخ می‌دهد
- [ ] http://localhost:5173 باز می‌شود
- [ ] Console مرورگر (F12) خطای خاصی نشان نمی‌دهد
- [ ] صفحه Test API (http://localhost:5173/test-api) همه چیز سبز است

---

## 🎯 صفحه تست API

**آدرس:** http://localhost:5173/test-api

این صفحه را باز کنید و روی "شروع تست" کلیک کنید.

**نتایج:**
- ✅ سبز = API کار می‌کند
- ❌ قرمز = مشکل وجود دارد

**خطاهای متداول در Test API:**

1. **TypeError: Failed to fetch**
   - بک‌اند اجرا نشده است
   - Port اشتباه است
   
2. **CORS Error**
   - سرور را Restart کنید
   
3. **401 Unauthorized**
   - نام کاربری یا رمز عبور اشتباه است

---

## 📞 دستورات مفید

### مشاهده Process های Node:
```bash
Get-Process -Name node
```

### Kill کردن تمام Node:
```bash
Stop-Process -Name node -Force
```

### تست Health Check:
```bash
curl http://localhost:8080/health
```

### تست Admin Login:
```bash
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/admin/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"admin123"}' `
  | Select-Object -ExpandProperty Content
```

---

## 💡 نکات مهم

1. **همیشه 2 Terminal داشته باشید:**
   - Terminal 1: Backend (در پوشه server)
   - Terminal 2: Frontend (در پوشه اصلی)

2. **پورت‌ها را چک کنید:**
   - Backend: 8080
   - Frontend: 5173

3. **از صفحه Test API استفاده کنید:**
   - http://localhost:5173/test-api

4. **Console مرورگر (F12) را چک کنید:**
   - خطاها را بخوانید
   - Network tab را بررسی کنید

---

## 🔥 اگر هیچ کدام کار نکرد

### آخرین راه‌حل:

```bash
# 1. تمام Node را ببند
Stop-Process -Name node -Force

# 2. Cache را پاک کن
cd C:\Users\rose\Desktop\site
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .vite

cd C:\Users\rose\Desktop\site\server
Remove-Item -Recurse -Force node_modules

# 3. دوباره نصب کن
cd C:\Users\rose\Desktop\site
npm install

cd C:\Users\rose\Desktop\site\server
npm install

# 4. شروع مجدد
# Terminal 1:
cd C:\Users\rose\Desktop\site\server
npm start

# Terminal 2:
cd C:\Users\rose\Desktop\site
npm run dev
```

---

## ✅ بعد از رفع مشکل

1. صفحه Test API را باز کنید: http://localhost:5173/test-api
2. تست کنید که همه چیز سبز شده
3. صفحه ورود را امتحان کنید:
   - کاربر: http://localhost:5173/auth
   - ادمین: http://localhost:5173/admin/login

---

**✨ موفق باشید!**

اگر باز هم مشکل دارید، به ترتیب این مراحل را انجام دهید:
1. صفحه Test API
2. Console مرورگر (F12)
3. لاگ‌های Terminal سرور
