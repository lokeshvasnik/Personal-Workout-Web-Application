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
} from "@mui/material";
import { useState, useEffect } from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import { useNavigate } from "react-router-dom";

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
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [exercises, setExercises] = useState([]);

    const availableExerciseOptions = exerciseOptionsByDay[day] || [];
    const isCustomExercise = exerciseName === CUSTOM_EXERCISE_OPTION;
    const finalExerciseName = isCustomExercise
        ? customExerciseName.trim()
        : exerciseName;

    // LOAD SAVED DATA
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("workouts")) || {};
        setExercises(saved[day] || []);
    }, [day]);

    // SAVE DATA
    const handleAddExercise = () => {
        const newExercise = {
            name: finalExerciseName,
            reps,
            weight,
        };

        const updatedExercises = [...exercises, newExercise];
        setExercises(updatedExercises);

        const saved = JSON.parse(localStorage.getItem("workouts")) || {};
        saved[day] = updatedExercises;

        localStorage.setItem("workouts", JSON.stringify(saved));

        setExerciseName("");
        setCustomExerciseName("");
        setReps("");
        setWeight("");
        setOpen(false);
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

            {exercises.map((ex, index) => (
                <Card
                    className="workout-day-card"
                    sx={{ mt: 2, animationDelay: `${140 + index * 70}ms` }}
                    key={index}
                >
                    <CardContent>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {ex.name}
                            </Typography>
                            <Chip
                                label={`${ex.reps} reps`}
                                size="small"
                                color="secondary"
                            />
                        </Stack>
                        <Typography color="text.secondary" sx={{ mt: 0.7 }}>
                            Weight: {ex.weight} kg
                        </Typography>
                    </CardContent>
                </Card>
            ))}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 0.6 } }}
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
                        label="Reps"
                        fullWidth
                        margin="normal"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                    >
                        <MenuItem value="15">15</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                    </TextField>

                    <TextField
                        select
                        label="Weight"
                        fullWidth
                        margin="normal"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    >
                        <MenuItem value="5">5kg</MenuItem>
                        <MenuItem value="10">10kg</MenuItem>
                        <MenuItem value="15">15kg</MenuItem>
                        <MenuItem value="20">20kg</MenuItem>
                    </TextField>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleAddExercise}
                        variant="contained"
                        disabled={!finalExerciseName || !reps || !weight}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default WorkoutDay;
