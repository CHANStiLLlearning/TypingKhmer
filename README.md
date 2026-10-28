# កម្មវិធីរៀនវាយអត្ថបទខ្មែរ យូនីកូដ (Khmer Unicode & English Typing Tutor)

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Web-blue?style=for-the-badge&logo=windows" alt="Platform" />
  <img src="https://img.shields.io/badge/Framework-React%2018%20%2B%20Vite%206%20%2B%20Electron%2033-61DAFB?style=for-the-badge&logo=react" alt="Tech Stack" />
  <img src="https://img.shields.io/badge/Language-Khmer%20%26%20English-success?style=for-the-badge" alt="Language" />
  <img src="https://img.shields.io/badge/Status-100%25%20Offline-brightgreen?style=for-the-badge" alt="Offline" />
</p>

កម្មវិធីរៀនវាយអត្ថបទខ្មែរ យូនីកូដ និងអង់គ្លេសទំនើប (Desktop App & Web) ដំណើរការ **100% Offline** គ្មានទាក់ គ្មានគាំង ផ្ដោតលើការហាត់វាយតាមស្ដង់ដារក្ដារចុចខ្មែរ **Khmer NiDA (KBDKNI.DLL)**។

---

## 🌟 លក្ខណៈពិសេសចម្បង (Key Features)

- 🇰🇭 **មេរៀនអក្សរខ្មែរគ្រប់ជ្រុងជ្រោយ (១៩ មេរៀន)**៖
  - គ្រប់មេរៀនទាំងអស់មានចំនួន **១២៥ ពាក្យ** យ៉ាងត្រឹមត្រូវ។
  - គាំទ្រការវាយព្យញ្ជនៈ ស្រៈនិស្ស័យ ស្រៈពេញតួ ជើងអក្សរ (Subscript / Coeng `្` តាមរយៈគ្រាប់ចុច `J`) និងសញ្ញាពិសេស។
- 🇬🇧 **មេរៀនភាសាអង់គ្លេស (១៤ មេរៀន)**៖
  - ១២៥ ពាក្យក្នុងមួយមេរៀន ចាប់ពី Home Row រហូតដល់ Paragraph Flow។
  - ប្តូររវាងភាសាខ្មែរ និងអង់គ្លេសបានភ្លាមៗ (Instant Toggle)។
- 🎨 **ការបង្ហាញអត្ថបទ ១ ជួររលូន (Single-Line Streaming View)**៖
  - អត្ថបទរត់មួយជួរស្អាតរលូន ជាមួយការប្តូរពណ៌បៃតងរស់រវើកពេលវាយត្រូវ (Monkeytype style)។
  - កម្ពស់តំបន់អត្ថបទ និងទំហំអក្សរធំច្បាស់ស្រឡះភ្នែក (`36px - 44px`) មិនកាត់ស្រៈលើ ឬជើងក្រោមឡើយ។
- ⌨️ **ក្តារចុចនិម្មិតកម្ពស់ខ្ពស់ស្រឡះ (Taller Virtual Keyboard)**៖
  - កម្ពស់គ្រាប់ចុច `94px - 102px` ធំទូលាយ ងាយស្រួលមើល។
  - បង្ហាញដៃ និងម្រាមដៃស្វ័យប្រវត្តិតាមគ្រាប់ចុចគោលដៅ (Hands Overlay with Opacity Control)។
- ⚡ **ដំណើរការលឿនរលូនលើ Windows**៖
  - លុបប្រព័ន្ធសំឡេងចោលទាំងស្រុង ជៀសវាង Memory Leak និង Audio Thread Blocking។
  - ការពារ Key-Repeat Storm ពេលសង្កត់គ្រាប់ចុចជាប់។
  - ភ្ជាប់ Global Key Listener តែមួយលើកគត់ គ្មាន Layout Thrashing។
- 📦 **100% Offline Capability**៖
  - ពុម្ពអក្សរ Kantumruy Pro, Noto Sans Khmer, និង JetBrains Mono ត្រូវបានទាញយក និងបង្កប់ក្នុងកម្មវិធីជាស្រេច មិនត្រូវការ Internet ឡើយ។

---

## 🚀 ការដំឡើង និងដំណើរការ (Getting Started)

### ១. ដំឡើង Dependencies
```bash
npm install
```

### ២. ដំណើរការលើ Web (Development Mode)
```bash
npm run dev
```
បើក Browser នៅអាសយដ្ឋាន `http://localhost:5173/`។

### ៣. ដំណើរការជា Desktop App (Electron)
```bash
npm run electron:dev
```

### ៤. បង្កើតកញ្ចប់ដំឡើង Windows (.exe & .zip)
```bash
npm run electron:build
```
ឯកសារដំឡើងនឹងត្រូវបានបង្កើតឡើងក្នុង folder `release/`៖
- `release/Khmer Typing Tutor Setup 1.0.0.exe` (Installer)
- `release/Khmer Typing Tutor-1.0.0-win.zip` (Portable ZIP)

---

## 🛠️ បច្ចេកវិទ្យាដែលប្រើប្រាស់ (Tech Stack)

- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Lucide React, Canvas Confetti
- **Desktop Runtime**: Electron 33, Electron Builder
- **Khmer Engine**: Custom Deconstruction & Subscript/Ligature Parser for Windows NiDA Layout

---

## 📄 អាជ្ញាប័ណ្ណ (License)

គម្រោងនេះបើកទូលាយសម្រាប់សហគមន៍អ្នកសិក្សា និងអ្នកអភិវឌ្ឍន៍ខ្មែរទូទៅ។

