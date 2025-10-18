# 🔍 چگونه لاگ‌ها را ببینیم؟

## خطای "API Request Error: {}" را می‌بینید؟

این راهنما به شما کمک می‌کند تا خطای دقیق را پیدا کنید.

---

## 📱 مرحله 1: باز کردن Console مرورگر

### روش 1: استفاده از کلید F12
```
1. صفحه ورود را باز کنید:
   - کاربر: http://localhost:5173/auth
   - ادمین: http://localhost:5173/admin/login

2. کلید F12 را بزنید

3. تب "Console" را انتخاب کنید
```

### روش 2: استفاده از منو
```
1. راست‌کلیک روی صفحه
2. انتخاب "Inspect" یا "بازرسی"
3. تب "Console" را انتخاب کنید
```

---

## 🔵 مرحله 2: لاگ‌های جدید را ببینید

حالا لاگ‌های رنگی خواهید دید:

### لاگ‌های عادی (موفق):
```
🔵 API Request: http://localhost:8080/api/auth/admin/login {...}
🟢 API Response Status: 200 OK
📦 API Response Data: {success: true, ...}
```

### لاگ‌های خطا:
```
❌ API Request Error: {
  message: "Failed to fetch",
  name: "TypeError",
  url: "http://localhost:8080/api/auth/admin/login"
}
```

---

## 🎯 مرحله 3: تشخیص نوع خطا

### خطا 1: "Failed to fetch"
```
❌ API Request Error: {
  message: "Failed to fetch",
  name: "TypeError"
}
```

**معنی:** فرانت‌اند نمی‌تواند به بک‌اند متصل شود

**راه‌حل:**
```bash
# بررسی کنید بک‌اند در حال اجراست:
curl http://localhost:8080/health

# اگر خطا دادید، سرور را اجرا کنید:
cd C:\Users\rose\Desktop\site\server
npm start
```

---

### خطا 2: "CORS policy"
```
Access to fetch at 'http://localhost:8080/...' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**معنی:** مشکل CORS

**راه‌حل:**
```bash
# سرور را Restart کنید:
# Terminal سرور را ببندید (Ctrl+C)
# دوباره اجرا کنید:
cd C:\Users\rose\Desktop\site\server
npm start
```

---

### خطا 3: "401 Unauthorized"
```
🟢 API Response Status: 401 Unauthorized
📦 API Response Data: {success: false, message: "نام کاربری یا رمز عبور اشتباه است"}
```

**معنی:** اطلاعات ورود اشتباه است

**راه‌حل:**
```
اطلاعات درست:
Username: admin
Password: admin123
```

---

### خطا 4: "404 Not Found"
```
🟢 API Response Status: 404 Not Found
```

**معنی:** آدرس API اشتباه است یا route وجود ندارد

**راه‌حل:**
```bash
# بررسی کنید بک‌اند روی port 8080 است:
curl http://localhost:8080/health
```

---

## 📊 مرحله 4: بررسی Network Tab

اگر لاگ‌ها کافی نیستند:

```
1. در Console مرورگر (F12) به تب "Network" بروید
2. چک‌باکس "Preserve log" را فعال کنید
3. دوباره تلاش کنید ورود کنید
4. روی درخواست قرمز رنگ کلیک کنید
5. تب "Preview" یا "Response" را ببینید
```

---

## 🎬 مثال واقعی

### سناریو: ورود ادمین

1. **باز کردن صفحه:**
   ```
   http://localhost:5173/admin/login
   ```

2. **باز کردن Console (F12)**

3. **وارد کردن اطلاعات:**
   ```
   Username: admin
   Password: admin123
   ```

4. **کلیک روی "ورود به پنل مدیریت"**

5. **مشاهده لاگ‌ها در Console:**

**✅ موفق:**
```
🔵 API Request: http://localhost:8080/api/auth/admin/login {...}
🟢 API Response Status: 200 OK
📦 API Response Data: {
  success: true,
  message: "ورود ادمین موفقیت‌آمیز",
  data: {admin: {...}, token: "..."}
}
```

**❌ خطا (بک‌اند اجرا نشده):**
```
🔵 API Request: http://localhost:8080/api/auth/admin/login {...}
❌ API Request Error: {
  message: "Failed to fetch",
  name: "TypeError",
  url: "http://localhost:8080/api/auth/admin/login"
}
```

---

## 🛠️ دستورات سریع عیب‌یابی

### بررسی سرورها:
```bash
# Backend
curl http://localhost:8080/health

# Frontend
curl http://localhost:5173
```

### Restart سرورها:
```bash
# Kill تمام Node
Stop-Process -Name node -Force

# Start Backend
cd C:\Users\rose\Desktop\site\server
npm start

# Start Frontend (Terminal جدید)
cd C:\Users\rose\Desktop\site
npm run dev
```

### تست مستقیم API:
```bash
# تست ورود ادمین
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/admin/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"admin123"}' `
  | Select-Object -ExpandProperty Content
```

---

## 📸 اسکرین‌شات Console

باید چیزی شبیه این ببینید:

```
🔵 API Request: http://localhost:8080/api/auth/admin/login
   Object {
     method: "POST",
     headers: {Content-Type: "application/json"},
     body: "{\"username\":\"admin\",\"password\":\"admin123\"}"
   }

🟢 API Response Status: 200 OK

📦 API Response Data:
   Object {
     success: true,
     message: "ورود ادمین موفقیت‌آمیز",
     data: Object {
       admin: Object {id: 4, username: "admin", role: "admin"},
       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
```

---

## ✅ Checklist

قبل از تست:
- [ ] Backend در حال اجراست (port 8080)
- [ ] Frontend در حال اجراست (port 5173)
- [ ] Console مرورگر باز است (F12)
- [ ] صفحه ورود باز است

در حین تست:
- [ ] لاگ‌های 🔵 🟢 📦 را می‌بینید
- [ ] اگر خطا دیدید، نوع خطا را تشخیص دهید
- [ ] راه‌حل مربوطه را اجرا کنید

---

## 💡 نکات مهم

1. **همیشه Console را باز داشته باشید** (F12)
2. **لاگ‌های رنگی را دنبال کنید:**
   - 🔵 آبی = شروع درخواست
   - 🟢 سبز = پاسخ دریافت شد
   - 📦 جعبه = داده‌های پاسخ
   - ❌ قرمز = خطا

3. **خطای "Failed to fetch" = بک‌اند اجرا نشده**
4. **خطای CORS = Restart کنید سرور را**
5. **401 = اطلاعات ورود اشتباه**

---

## 📞 کمک بیشتر

اگر باز هم مشکل دارید:

1. Console را باز کنید (F12)
2. اسکرین‌شات از لاگ‌ها بگیرید
3. فایل `DEBUG_GUIDE.md` را بخوانید
4. صفحه Test API را امتحان کنید: http://localhost:5173/test-api

---

**✨ حالا دوباره تست کنید و لاگ‌ها را ببینید!**

صفحات برای تست:
- ورود ادمین: http://localhost:5173/admin/login
- ورود کاربر: http://localhost:5173/auth
- تست API: http://localhost:5173/test-api
