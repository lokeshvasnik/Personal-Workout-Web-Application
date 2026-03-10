const GOOGLE_SHEETS_WEB_APP_URL = import.meta.env
    .VITE_GOOGLE_SHEETS_WEB_APP_URL;

const formatDateTimeForSheet = (date) => {
    const pad = (value) => String(value).padStart(2, "0");

    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = date.getFullYear();
    const rawHours = date.getHours();
    const period = rawHours >= 12 ? "PM" : "AM";
    const hours12 = rawHours % 12 || 12;
    const hours = pad(hours12);
    const minutes = pad(date.getMinutes());

    return `${month}-${day}-${year} ${hours}:${minutes} ${period}`;
};

export async function syncWorkoutToGoogleSheets({
    selectedUser,
    day,
    exerciseName,
    sets,
}) {
    if (!GOOGLE_SHEETS_WEB_APP_URL) {
        return { ok: false, skipped: true, reason: "missing-webhook-url" };
    }

    const resolvedUser = (selectedUser || "").trim();
    const now = new Date();

    const payload = {
        source: "gym-tracker-web",
        submittedAt: formatDateTimeForSheet(now),
        selectedUser: resolvedUser,
        userName: resolvedUser,
        username: resolvedUser,
        user: resolvedUser,
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
