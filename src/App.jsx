import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import WorkoutDay from "./WorkoutDay";
import "./App.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workout/:day" element={<WorkoutDay />} />
        </Routes>
    );
}

export default App;
