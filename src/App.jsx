import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";
import Home from "./Home";
import WorkoutDay from "./WorkoutDay";
import "./App.css";

const DAILY_RESET_MARKER_KEY = "daily-reset-marker";
const WORKOUTS_STORAGE_PREFIX = "workouts";
const SELECTED_USER_STORAGE_KEY = "selected-user";
const ALLOWED_USERS = ["Lokesh", "Anvir", "Mihir"];

const getWorkoutsStorageKey = (selectedUser) =>
    `${WORKOUTS_STORAGE_PREFIX}-${selectedUser}`;

const getResetMarkerKey = (selectedUser) =>
    `${DAILY_RESET_MARKER_KEY}-${selectedUser}`;

const markTodayAsReset = (selectedUser) => {
    localStorage.setItem(
        getResetMarkerKey(selectedUser),
        new Date().toDateString(),
    );
};

const clearStorageIfDayChanged = (selectedUser) => {
    const today = new Date().toDateString();
    const lastResetDay = localStorage.getItem(getResetMarkerKey(selectedUser));

    if (lastResetDay !== today) {
        localStorage.removeItem(getWorkoutsStorageKey(selectedUser));
        markTodayAsReset(selectedUser);
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
    const [selectedUser, setSelectedUser] = useState(() =>
        localStorage.getItem(SELECTED_USER_STORAGE_KEY),
    );

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
        if (!selectedUser) {
            return undefined;
        }

        clearStorageIfDayChanged(selectedUser);

        let midnightTimerId;

        const scheduleMidnightReset = () => {
            midnightTimerId = setTimeout(() => {
                localStorage.removeItem(getWorkoutsStorageKey(selectedUser));
                markTodayAsReset(selectedUser);
                scheduleMidnightReset();
            }, getMsUntilNextMidnight());
        };

        scheduleMidnightReset();

        return () => {
            clearTimeout(midnightTimerId);
        };
    }, [selectedUser]);

    const handleSelectUser = (name) => {
        localStorage.setItem(SELECTED_USER_STORAGE_KEY, name);
        setSelectedUser(name);
    };

    const handleChangeUser = () => {
        localStorage.removeItem(SELECTED_USER_STORAGE_KEY);
        setSelectedUser("");
    };

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
                    <Route
                        path="/"
                        element={
                            <Home
                                selectedUser={selectedUser}
                                onChangeUser={handleChangeUser}
                            />
                        }
                    />
                    <Route
                        path="/workout/:day"
                        element={<WorkoutDay selectedUser={selectedUser} />}
                    />
                </Routes>
            </div>

            <Dialog
                open={!showSplash && !selectedUser}
                aria-labelledby="who-are-you-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="who-are-you-title">Who are you?</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Select your name to save workout data in your section.
                    </Typography>
                    <Stack spacing={1.2}>
                        {ALLOWED_USERS.map((name) => (
                            <Button
                                key={name}
                                variant="outlined"
                                onClick={() => handleSelectUser(name)}
                                sx={{ justifyContent: "flex-start", py: 1.1 }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1.2}
                                    alignItems="center"
                                >
                                    <Avatar sx={{ width: 30, height: 30 }}>
                                        {name.charAt(0)}
                                    </Avatar>
                                    <Box>{name}</Box>
                                </Stack>
                            </Button>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ px: 2, pb: 1 }}
                    >
                        Your choice will be remembered on this device.
                    </Typography>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default App;
