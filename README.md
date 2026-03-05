# Gym Tracker

Workout logging web app built with React + Vite + MUI.

## Run locally

```bash
npm install
npm run dev
```

## Google Sheets Sync

The app can sync every saved workout entry to Google Sheets through a Google Apps Script Web App URL.

### 1. Create `.env`

Copy `.env.example` to `.env` and set your Apps Script URL:

```env
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/your-deployment-id/exec
```

Restart dev server after editing `.env`.

### 2. Create a Google Sheet

Create columns in row 1:

```text
submittedAt | day | exerciseName | setNumber | reps | weight | source
```

### 3. Create Apps Script Web App

In the Google Sheet:
`Extensions` -> `Apps Script`, then paste this code:

```javascript
function doPost(e) {
    try {
        var body = JSON.parse(e.postData.contents || "{}");
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var sets = body.sets || [];

        sets.forEach(function (setItem) {
            sheet.appendRow([
                body.submittedAt || new Date().toISOString(),
                body.day || "",
                body.exerciseName || "",
                setItem.setNumber || "",
                setItem.reps || "",
                setItem.weight || "",
                body.source || "gym-tracker-web",
            ]);
        });

        return ContentService.createTextOutput(
            JSON.stringify({ ok: true }),
        ).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService.createTextOutput(
            JSON.stringify({ ok: false, error: String(error) }),
        ).setMimeType(ContentService.MimeType.JSON);
    }
}
```

Deploy:
`Deploy` -> `New deployment` -> `Web app`

Recommended settings:

- Execute as: `Me`
- Who has access: `Anyone`

Copy deployment URL and use it in `.env`.

### 4. Verify

1. Open app.
2. Add an exercise with sets.
3. Confirm new rows appear in sheet.

If URL is missing or API fails, app still saves locally in browser storage.
