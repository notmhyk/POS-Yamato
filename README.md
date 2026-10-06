# 🏮 Yamato Shokudō - POS System

**Yamato Shokudō** Point of Sale (POS) system designed for Android Tablets, iPads, and PC terminals with a clean **Magenta & Cyber Purple** theme.

---

## 📸 Features Overview

1. **Magenta & Cyber Purple Aesthetic**:
   - Clean, modern cyberpunk palette with Electric Magenta (`#E024C3`), Vivid Cyber Purple (`#8B5CF6`), and Obsidian surfaces (`#0D0B14`).
   - High-contrast, glare-resistant readability tailored for restaurant & cashier lighting.
   - Pre-loaded with authentic **Yamato Shokudō menu items** (Torikatsu Curry, Katsudon, Teriyaki Katsu, Gyudon, Melon Cream Soda, Matcha Ice Cream, and Add-ons).

2. **Touch & Tablet Ergonomics**:
   - Touch-friendly large targets (44px–52px height) for comfortable tapping on 7", 8", 10", and 12" tablets.
   - Fast numeric keypad and large cash denomination buttons (+50, +100, +200, +500, +1000, Exact ₱).
   - Responsive split layout on landscape and smooth drawer on portrait.

3. **Catalog & Menu Management**:
   - ➕ **Add New Items**: Custom name, price (₱), category, description, and image (preset, URL, or local file upload).
   - ✏️ **Edit Items & Prices**: Click **"Edit Menu"** in the top bar to edit prices and details of any item in-place.
   - 🗑️ **Remove Items**: Delete dishes with confirmation.
   - 🔄 **Backup & Reset**: Export entire menu/sales as JSON, or restore the default menu anytime.

4. **Cart & Order Processing**:
   - 🥢 Order Types: **Dine In** (with Table #), **Take Out**, **Delivery**.
   - 🔢 Quantity stepper (`+` / `−`) with instant in-place badge update (zero flicker).
   - 📝 Item Notes / Customizations (e.g. *Extra Spicy*, *Less Ice*, *No Onions*, *Extra Sauce*).
   - 🏷️ Discounts: Senior / PWD 20%, 10% Promo, 5% Loyalty, etc.
   - 💰 Auto-calculated Subtotal, Discount, and Grand Total in Philippine Pesos (₱).

5. **Payment & Receipt Generator**:
   - 💵 Payment Methods: **Cash**, **GCash**, **Card**, **QR PH**.
   - ⚡ Quick cash denomination buttons (+50, +100, +200, +500, +1000, Exact Amount).
   - 🪙 Real-time change calculation with cash validation.
   - 🖨️ **Printable Thermal Receipt** formatted for 58mm / 80mm POS receipt printers with barcode and restaurant contact details.

6. **Sales Analytics & CSV Export**:
   - 📊 Daily Revenue, Completed Orders Count, Average Ticket Size.
   - 📋 Sales history log with receipt reprint capability.
   - 📁 **Export Sales to CSV** ready for Microsoft Excel or Google Sheets.

7. **Cross-Platform & Offline Ready**:
   - 📶 Full PWA support with offline Service Worker (`sw.js`).
   - 📱 Installs directly as a standalone tablet app without browser address bars.

---

## 🚀 How to Run

### Option 1: Double-click Windows Launcher
Simply double-click `run_app.bat`.

### Option 2: Mac / Linux
Run `bash run_app.sh` or `python3 server.py`.

### Option 3: Run via Terminal
```bash
python server.py
```
Then open your browser at `http://localhost:8080`.

To open on a **Tablet** connected to the same Wi-Fi, open the Wi-Fi IP shown in the terminal (e.g., `http://192.168.1.XX:8080`).

---

## 📲 How to Install as an App or APK on Android / Tablet

### Method 1: Instant Install via Chrome (Recommended for Tablets)
1. Open the POS URL on your tablet's Chrome browser.
2. Tap the **three dots menu (⋮)** in Chrome.
3. Tap **"Install app"** or **"Add to Home Screen"**.
4. The Yamato Shokudo POS will install on your tablet's home screen as a standalone full-screen app!

### Method 2: Generate APK via PWABuilder (Standard Android .apk)
1. Upload this folder to any web host (e.g. Vercel, Netlify, GitHub Pages, or local server).
2. Go to [PWABuilder.com](https://www.pwabuilder.com/).
3. Paste your URL and click **Start**.
4. Click **"Package for Android"** to download a ready-to-install `.apk` for your tablet!
