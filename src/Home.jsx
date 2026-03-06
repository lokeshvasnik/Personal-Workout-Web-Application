import {
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Stack,
    Typography,
    IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const days = [
    { day: "Monday", workout: "Chest Shoulder Triceps" },
    { day: "Tuesday", workout: "Back Biceps" },
    { day: "Wednesday", workout: "Legs Abs" },
    { day: "Thursday", workout: "Chest Shoulder Triceps" },
    { day: "Friday", workout: "Back Biceps" },
    { day: "Saturday", workout: "Legs Abs" },
    { day: "Sunday", workout: "Only Abs" },
];

const workoutPhotos = [
    {
        src: "/workout-photos/photo-1.jpeg",
        alt: "Workout training moment 1",
    },
    {
        src: "/workout-photos/photo-2.jpeg",
        alt: "Workout training moment 2",
    },
];

function Home() {
    const navigate = useNavigate();
    const [currentPhoto, setCurrentPhoto] = useState(0);

    useEffect(() => {
        if (workoutPhotos.length <= 1) {
            return undefined;
        }

        const intervalId = setInterval(() => {
            setCurrentPhoto((previous) =>
                previous === workoutPhotos.length - 1 ? 0 : previous + 1,
            );
        }, 3500);

        return () => clearInterval(intervalId);
    }, []);

    const handleNextPhoto = () => {
        setCurrentPhoto((previous) =>
            previous === workoutPhotos.length - 1 ? 0 : previous + 1,
        );
    };

    const handlePreviousPhoto = () => {
        setCurrentPhoto((previous) =>
            previous === 0 ? workoutPhotos.length - 1 : previous - 1,
        );
    };

    return (
        <Container maxWidth="md" className="page-shell">
            <Box className="hero-card fade-in-up">
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <FitnessCenterRoundedIcon color="primary" />
                    <Chip
                        label="Weekly Program"
                        color="primary"
                        variant="outlined"
                        size="small"
                    />
                </Stack>

                <Typography
                    variant="h3"
                    sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
                >
                    Gym Tracker
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mt: 1.2, maxWidth: 560 }}
                >
                    Pick a day, log your lifts, and keep steady progress with a
                    clean workout journal.
                </Typography>
            </Box>

            <Box
                className="fade-in-up"
                sx={{
                    mt: 2.5,
                    mb: 2.8,
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "rgba(15, 23, 42, 0.08)",
                    height: { xs: 220, md: 280 },
                    background:
                        "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(13,148,136,0.2))",
                }}
            >
                <Box
                    component="img"
                    src={workoutPhotos[currentPhoto]?.src}
                    alt={workoutPhotos[currentPhoto]?.alt}
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                    }}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "linear-gradient(180deg, rgba(15,23,42,0) 20%, rgba(15,23,42,0.5) 100%)",
                        pointerEvents: "none",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#f8fafc",
                            fontWeight: 800,
                            letterSpacing: "0.02em",
                            textShadow: "0 4px 16px rgba(2, 6, 23, 0.45)",
                            textAlign: "center",
                            px: 2,
                        }}
                    >
                        Progress With Friends
                    </Typography>
                </Box>

                <IconButton
                    aria-label="Previous photo"
                    onClick={handlePreviousPhoto}
                    sx={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(255,255,255,0.72)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
                    }}
                >
                    <ChevronLeftRoundedIcon />
                </IconButton>

                <IconButton
                    aria-label="Next photo"
                    onClick={handleNextPhoto}
                    sx={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(255,255,255,0.72)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
                    }}
                >
                    <ChevronRightRoundedIcon />
                </IconButton>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        position: "absolute",
                        bottom: 10,
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    {workoutPhotos.map((_, index) => (
                        <Box
                            key={index}
                            onClick={() => setCurrentPhoto(index)}
                            sx={{
                                width: 9,
                                height: 9,
                                borderRadius: "50%",
                                cursor: "pointer",
                                bgcolor:
                                    index === currentPhoto
                                        ? "#f8fafc"
                                        : "rgba(248,250,252,0.55)",
                                border:
                                    index === currentPhoto
                                        ? "1px solid rgba(2,6,23,0.35)"
                                        : "1px solid transparent",
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            <Grid
                container
                spacing={2.2}
                className="fade-in-up"
                sx={{ animationDelay: "120ms" }}
            >
                {days.map((d, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Card
                            onClick={() => navigate(`/workout/${d.day}`)}
                            className="workout-day-card"
                            sx={{
                                cursor: "pointer",
                                animationDelay: `${120 + index * 55}ms`,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 700 }}
                                >
                                    {d.day}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{ mt: 0.6 }}
                                >
                                    {d.workout}
                                </Typography>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ mt: 2 }}
                                >
                                    <Chip
                                        label="Open Day"
                                        size="small"
                                        color="secondary"
                                    />
                                    <ArrowForwardRoundedIcon color="primary" />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "22px",
                }}
            >
                Made By LOKYA 💘
            </Box>
        </Container>
    );
}

export default Home;
