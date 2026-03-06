import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import WorkoutDay from "./WorkoutDay";
import "./App.css";

const DAILY_RESET_MARKER_KEY = "daily-reset-marker";
const WORKOUTS_STORAGE_KEY = "workouts";

const markTodayAsReset = () => {
    localStorage.setItem(DAILY_RESET_MARKER_KEY, new Date().toDateString());
};

const clearStorageIfDayChanged = () => {
    const today = new Date().toDateString();
    const lastResetDay = localStorage.getItem(DAILY_RESET_MARKER_KEY);

    if (lastResetDay !== today) {
        localStorage.removeItem(WORKOUTS_STORAGE_KEY);
        markTodayAsReset();
    }
};

const getMsUntilNextMidnight = () => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    return nextMidnight.getTime() - now.getTime();
};

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [splashExiting, setSplashExiting] = useState(false);

    useEffect(() => {
        const beginExitTimer = setTimeout(() => {
            setSplashExiting(true);
        }, 1300);

        const hideSplashTimer = setTimeout(() => {
            setShowSplash(false);
        }, 1850);

        return () => {
            clearTimeout(beginExitTimer);
            clearTimeout(hideSplashTimer);
        };
    }, []);

    useEffect(() => {
        clearStorageIfDayChanged();

        let midnightTimerId;

        const scheduleMidnightReset = () => {
            midnightTimerId = setTimeout(() => {
                localStorage.removeItem(WORKOUTS_STORAGE_KEY);
                markTodayAsReset();
                scheduleMidnightReset();
            }, getMsUntilNextMidnight());
        };

        scheduleMidnightReset();

        return () => {
            clearTimeout(midnightTimerId);
        };
    }, []);

    return (
        <>
            {showSplash && (
                <div
                    className={`app-splash ${splashExiting ? "app-splash--exit" : ""}`}
                >
                    <div className="app-splash__badge">GT</div>
                    <h1 className="app-splash__title">Gym Tracker</h1>
                    <p className="app-splash__subtitle">
                        Train. Track. Transform.
                    </p>
                    <div className="app-splash__loader" aria-hidden="true" />
                </div>
            )}

            <div
                className={`app-routes ${showSplash ? "app-routes--hidden" : ""}`}
            >
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/workout/:day" element={<WorkoutDay />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
