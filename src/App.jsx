import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import WorkoutDay from "./WorkoutDay";
import "./App.css";

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
