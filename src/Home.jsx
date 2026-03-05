import {
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const days = [
    { day: "Monday", workout: "Chest Shoulder Triceps" },
    { day: "Tuesday", workout: "Back Biceps" },
    { day: "Wednesday", workout: "Legs Abs" },
    { day: "Thursday", workout: "Chest Shoulder Triceps" },
    { day: "Friday", workout: "Back Biceps" },
    { day: "Saturday", workout: "Legs Abs" },
    { day: "Sunday", workout: "Only Abs" },
];

function Home() {
    const navigate = useNavigate();

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
