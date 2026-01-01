# 📄 CV Builder & PDF Exporter

A modern CV (Resume) builder built with **Next.js** that allows users to create professional resumes and export them as **high-quality PDFs** using **Puppeteer**.
The project is optimized to work both **locally** and in **production on Vercel** using `puppeteer-core` and `@sparticuz/chromium-min`.

---

## 🚀 Features

* 🧑‍💼 Build professional CVs with structured sections
* 🎨 Clean and customizable templates
* 📱 Responsive UI for editing
* 🖨️ Export CVs as **A4 PDF**
* ⚡ Fast rendering using server-side PDF generation
* ☁️ Production-ready for **Vercel**
* ♻️ Reusable PDF service with browser pooling

---

## 🧱 Tech Stack

* **Next.js** (App Router)
* **TypeScript**
* **Tailwind CSS**
* **Puppeteer**
* **puppeteer-core**
* **@sparticuz/chromium-min** (for Vercel compatibility)

---

## 📂 Project Structure

```bash
src/
├── app/
│   ├── api/
│   │   └── export-pdf/        # API route for PDF generation
│   ├── pdf-render/            # Hidden page used for PDF rendering
│   └── page.tsx               # Main UI
│
├── components/
│   ├── templates/             # CV templates
│   └── sections/              # CV sections (skills, experience, etc.)
│
├── lib/
│   ├── puppeteer.ts           # Browser launcher (dev / prod)
│   └── pdf-service.ts         # PDF generation service
│
├── types/
│   └── types.ts               # CV & payload types
│
└── styles/
```

---

## 🧠 How PDF Generation Works

1. User builds the CV in the UI
2. CV data is sent to an API route
3. Puppeteer opens a hidden `/pdf-render` page
4. The page is rendered with the selected template
5. Puppeteer exports the page as a **PDF**
6. The PDF is returned to the user for download

---

## 🧪 Development Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run development server

```bash
npm run dev
```

App will be available at:

```
http://localhost:3000
```

---

## 🌍 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

In **production (Vercel)**, set:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

---

## ☁️ Production & Vercel Notes

This project uses:

* `puppeteer` → **local development**
* `puppeteer-core + @sparticuz/chromium-min` → **production**

Why?

* Vercel has a **250MB function size limit**
* Full Puppeteer + Chrome exceeds this limit
* `chromium-min` provides a lightweight compatible binary

---

## ⚠️ Common Issues

### ❌ `Could not find Chrome`

✔ Make sure:

* `puppeteer-core` is used in production
* `@sparticuz/chromium-min` is installed
* `NODE_ENV=production` on Vercel

---

## 📈 Future Improvements

* ✨ Multiple CV templates
* 🎨 Template customization (colors, fonts)
* 📊 Export analytics
* 🔐 Auth & saved CVs

---

## 🤝 Contribution

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## 🧑‍💻 Author

**Ahmed Atia**
Frontend Developer
Specialized in **React, Next.js & Modern Web UI**

---

## 📜 License

This project is licensed under the **MIT License**.

---

لو حابب:

* نسخة **أقصر**
* أو README موجه للـ **HR / Client**
* أو إضافة **screenshots / diagrams**

قولي وأنا أظبطهولك 👌
