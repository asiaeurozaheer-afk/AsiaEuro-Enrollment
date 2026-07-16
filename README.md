# AsiaEuro Student Enrollment Portal

This package contains:

- `index.html` — the mobile-friendly enrollment portal
- `Code.gs` — Google Apps Script backend that saves responses to Google Sheets and uploads files to Google Drive

## 1. Create the Google Sheet

1. Open Google Sheets.
2. Create a blank spreadsheet.
3. Rename it, for example: `AsiaEuro Enrollment Responses`.
4. Copy the spreadsheet ID from the URL:

   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

5. Paste the ID into `Code.gs`:

   `SPREADSHEET_ID: "..."`

## 2. Create the Drive Upload Folder

1. Create a folder in Google Drive called `AsiaEuro Enrollment Documents`.
2. Open the folder.
3. Copy its ID from the URL:

   `https://drive.google.com/drive/folders/FOLDER_ID`

4. Paste the ID into `Code.gs`:

   `UPLOAD_FOLDER_ID: "..."`

## 3. Deploy the Apps Script Backend

1. Open your Google Sheet.
2. Click **Extensions → Apps Script**.
3. Delete the sample code.
4. Paste the contents of `Code.gs`.
5. Click **Deploy → New deployment**.
6. Select **Web app**.
7. Execute as: **Me**.
8. Who has access: **Anyone**.
9. Click **Deploy** and approve permissions.
10. Copy the Web App URL.

## 4. Configure the Website

Open `index.html` and find:

```javascript
const CONFIG = {
  APPS_SCRIPT_WEB_APP_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
  AGREEMENT_PDF_URL: "PASTE_YOUR_GOOGLE_DRIVE_PDF_LINK_HERE",
  WHATSAPP_NUMBER: "97433472053"
};
```

Replace the first two values.

For the agreement PDF, set Google Drive sharing to:

**Anyone with the link → Viewer**

## 5. Host the Website

### Easiest: GitHub Pages
1. Create a GitHub account and new repository.
2. Upload `index.html`.
3. Open repository **Settings → Pages**.
4. Choose the main branch and root folder.
5. GitHub will provide a public link.

### Alternative
You can host it on Netlify, Vercel, or your existing company website.

## Important Notes

- WhatsApp opens with the student's name and course already typed.
- The student must still attach the payment receipt manually.
- File uploads are limited to 10 MB in the website code.
- Do not publish sensitive Sheet or Drive IDs in social posts. They are used only in the Apps Script backend.
- Review your privacy notice and enrollment agreement with a qualified local professional before official use.
