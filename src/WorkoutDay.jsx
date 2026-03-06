import { useParams } from "react-router-dom";
import {
    Box,
    Chip,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import { useNavigate } from "react-router-dom";
import { syncWorkoutToGoogleSheets } from "./services/googleSheets";

const CUSTOM_EXERCISE_OPTION = "__custom__";

const exerciseOptionsByDay = {
    Monday: ["Bench Press", "Shoulder Press", "Dips", "Tricep Pushdown"],
    Tuesday: ["Pull Up", "Barbell Row", "Lat Pulldown", "Bicep Curl"],
    Wednesday: ["Squat", "Leg Press", "Lunge", "Plank"],
    Thursday: ["Incline Press", "Lateral Raise", "Skull Crusher", "Push Up"],
    Friday: ["Deadlift", "Seated Row", "Hammer Curl", "Face Pull"],
    Saturday: ["Romanian Deadlift", "Leg Extension", "Calf Raise", "Crunches"],
    Sunday: ["Sit Up", "Leg Raise", "Russian Twist", "Mountain Climber"],
};

function WorkoutDay() {
    const { day } = useParams();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [exerciseName, setExerciseName] = useState("");
    const [customExerciseName, setCustomExerciseName] = useState("");
    const [setCount, setSetCount] = useState("3");
    const [setEntries, setSetEntries] = useState([
        { reps: "", weight: "" },
        { reps: "", weight: "" },
        { reps: "", weight: "" },
    ]);
    const [exercises, setExercises] = useState([]);
    const [syncStatus, setSyncStatus] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const availableExerciseOptions = exerciseOptionsByDay[day] || [];
    const isCustomExercise = exerciseName === CUSTOM_EXERCISE_OPTION;
    const finalExerciseName = isCustomExercise
        ? customExerciseName.trim()
        : exerciseName;

    const getExerciseSets = (exercise) => {
        if (exercise.sets && exercise.sets.length > 0) {
            return exercise.sets;
        }

        return [{ setNumber: 1, reps: exercise.reps, weight: exercise.weight }];
    };

    const isAllSetDataFilled = setEntries.every(
        (entry) => entry.reps && entry.weight,
    );

    const handleSetCountChange = (value) => {
        const count = Number(value);
        setSetCount(value);
        setSetEntries((previousEntries) =>
            Array.from(
                { length: count },
                (_, index) =>
                    previousEntries[index] || { reps: "", weight: "" },
            ),
        );
    };

    const handleSetEntryChange = (index, field, value) => {
        setSetEntries((previousEntries) =>
            previousEntries.map((entry, entryIndex) =>
                entryIndex === index ? { ...entry, [field]: value } : entry,
            ),
        );
    };

    // LOAD SAVED DATA
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("workouts")) || {};
        setExercises(saved[day] || []);
    }, [day]);

    // SAVE DATA
    const handleAddExercise = async () => {
        setIsSaving(true);

        const sets = setEntries.map((entry, index) => ({
            setNumber: index + 1,
            reps: entry.reps,
            weight: entry.weight,
        }));

        const normalizedName = finalExerciseName.toLowerCase();
        const existingExerciseIndex = exercises.findIndex(
            (exercise) => exercise.name?.toLowerCase() === normalizedName,
        );

        let updatedExercises;

        if (existingExerciseIndex >= 0) {
            updatedExercises = [...exercises];
            const existingExercise = updatedExercises[existingExerciseIndex];
            const normalizedSets = sets.map((setItem, index) => ({
                ...setItem,
                setNumber: index + 1,
            }));

            updatedExercises[existingExerciseIndex] = {
                ...existingExercise,
                name: existingExercise.name,
                sets: normalizedSets,
            };
        } else {
            const newExercise = {
                name: finalExerciseName,
                sets,
            };

            updatedExercises = [...exercises, newExercise];
        }

        setExercises(updatedExercises);

        const saved = JSON.parse(localStorage.getItem("workouts")) || {};
        saved[day] = updatedExercises;

        localStorage.setItem("workouts", JSON.stringify(saved));

        try {
            const syncResult = await syncWorkoutToGoogleSheets({
                day,
                exerciseName: finalExerciseName,
                sets,
            });

            if (syncResult.skipped) {
                setSyncStatus(
                    "Saved locally. Add Google Sheets URL to enable cloud sync.",
                );
            } else {
                setSyncStatus("Saved locally and synced to Google Sheets.");
            }
        } catch (error) {
            console.error(error);
            setSyncStatus("Saved locally. Google Sheets sync failed.");
        }

        setExerciseName("");
        setCustomExerciseName("");
        setSetCount("3");
        setSetEntries([
            { reps: "", weight: "" },
            { reps: "", weight: "" },
            { reps: "", weight: "" },
        ]);
        setOpen(false);

        setIsSaving(false);
    };

    return (
        <Container maxWidth="md" className="page-shell">
            <Box className="hero-card fade-in-up">
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                            color="primary"
                            onClick={() => navigate("/")}
                            aria-label="Back to home"
                        >
                            <ArrowBackRoundedIcon />
                        </IconButton>
                        <Typography variant="h4">{day} Workout</Typography>
                    </Stack>
                    <Chip
                        icon={<FitnessCenterRoundedIcon />}
                        label={`${exercises.length} Exercises`}
                    />
                </Stack>

                <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    startIcon={<AddCircleRoundedIcon />}
                    sx={{ mt: 2.2 }}
                >
                    Add Exercise
                </Button>

                {syncStatus && (
                    <Typography
                        color="text.secondary"
                        sx={{ mt: 1.3, fontSize: "0.92rem" }}
                    >
                        {syncStatus}
                    </Typography>
                )}
            </Box>

            {exercises.length === 0 && (
                <Card
                    className="fade-in-up"
                    sx={{ mt: 2, p: 1, animationDelay: "100ms" }}
                >
                    <CardContent>
                        <Typography variant="h6">No exercises yet</Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.6 }}>
                            Start by adding your first exercise for {day}.
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {exercises.map((ex, index) => {
                const exerciseSets = getExerciseSets(ex);

                return (
                    <Card
                        className="workout-day-card"
                        sx={{ mt: 2, animationDelay: `${140 + index * 70}ms` }}
                        key={index}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {ex.name}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mt: 0.5, fontSize: "0.9rem" }}
                            >
                                {exerciseSets.length} sets
                            </Typography>

                            <Stack spacing={0.4} sx={{ mt: 0.9 }}>
                                {exerciseSets.map((setItem, setIndex) => (
                                    <Typography
                                        key={setIndex}
                                        color="text.secondary"
                                        sx={{ fontSize: "0.95rem" }}
                                    >
                                        Set {setItem.setNumber || setIndex + 1}:{" "}
                                        {setItem.reps} reps x {setItem.weight}{" "}
                                        kg
                                    </Typography>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                );
            })}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{ sx: { borderRadius: 1, p: 0.1 } }}
                fullWidth
            >
                <DialogTitle>Add Exercise</DialogTitle>

                <DialogContent>
                    <TextField
                        select
                        label="Exercise Name"
                        fullWidth
                        margin="normal"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                    >
                        {availableExerciseOptions.map((option) => (
                            <MenuItem value={option} key={option}>
                                {option}
                            </MenuItem>
                        ))}
                        <MenuItem value={CUSTOM_EXERCISE_OPTION}>
                            Other (Add Custom)
                        </MenuItem>
                    </TextField>

                    {isCustomExercise && (
                        <TextField
                            label="Custom Exercise Name"
                            fullWidth
                            margin="normal"
                            value={customExerciseName}
                            onChange={(e) =>
                                setCustomExerciseName(e.target.value)
                            }
                        />
                    )}

                    <TextField
                        select
                        label="Sets"
                        fullWidth
                        margin="normal"
                        value={setCount}
                        onChange={(e) => handleSetCountChange(e.target.value)}
                    >
                        <MenuItem value="1">1 Set</MenuItem>
                        <MenuItem value="2">2 Sets</MenuItem>
                        <MenuItem value="3">3 Sets</MenuItem>
                    </TextField>

                    {setEntries.map((entry, index) => (
                        <Stack
                            direction="row"
                            spacing={1.2}
                            key={index}
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                select
                                label={`Set ${index + 1} Reps`}
                                fullWidth
                                value={entry.reps}
                                onChange={(e) =>
                                    handleSetEntryChange(
                                        index,
                                        "reps",
                                        e.target.value,
                                    )
                                }
                            >
                                <MenuItem value="8">8</MenuItem>
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="12">12</MenuItem>
                                <MenuItem value="15">15</MenuItem>
                            </TextField>

                            <TextField
                                select
                                label={`Set ${index + 1} Weight`}
                                fullWidth
                                value={entry.weight}
                                onChange={(e) =>
                                    handleSetEntryChange(
                                        index,
                                        "weight",
                                        e.target.value,
                                    )
                                }
                            >
                                <MenuItem value="5">5kg</MenuItem>
                                <MenuItem value="7">7kg</MenuItem>
                                <MenuItem value="10">10kg</MenuItem>
                                <MenuItem value="15">15kg</MenuItem>
                                <MenuItem value="20">20kg</MenuItem>
                                <MenuItem value="25">25kg</MenuItem>
                            </TextField>
                        </Stack>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleAddExercise}
                        variant="contained"
                        disabled={
                            isSaving ||
                            !finalExerciseName ||
                            !setCount ||
                            !isAllSetDataFilled
                        }
                        startIcon={
                            isSaving ? (
                                <CircularProgress color="inherit" size={16} />
                            ) : null
                        }
                    >
                        {isSaving ? "Saving..." : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default WorkoutDay;
