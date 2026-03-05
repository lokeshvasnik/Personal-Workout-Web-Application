const GOOGLE_SHEETS_WEB_APP_URL = import.meta.env
    .VITE_GOOGLE_SHEETS_WEB_APP_URL;

export async function syncWorkoutToGoogleSheets({ day, exerciseName, sets }) {
    if (!GOOGLE_SHEETS_WEB_APP_URL) {
        return { ok: false, skipped: true, reason: "missing-webhook-url" };
    }

    const payload = {
        source: "gym-tracker-web",
        submittedAt: new Date().toISOString(),
        day,
        exerciseName,
        sets: sets.map((setItem, index) => ({
            setNumber: setItem.setNumber || index + 1,
            reps: setItem.reps,
            weight: setItem.weight,
        })),
    };

    const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: "POST",
        // Keep this a simple request to avoid Apps Script preflight failures.
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Google Sheets sync failed with ${response.status}`);
    }

    return { ok: true };
}
