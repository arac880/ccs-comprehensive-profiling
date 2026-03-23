import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import FacultyDashboard from "./pages/facultyPages/facultyDashboard";
import StudentDashboard from "./pages/studentPages/studentDashboard";
import StudentSchedule from "./pages/studentPages/studentSchedule";
import StudentEvents from "./pages/studentPages/studentEvents";
import StudentClearance from "./pages/studentPages/studentClearance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/schedule" element={<StudentSchedule />} />
        <Route path="/student/events" element={<StudentEvents />} />
        <Route path="/student/clearance" element={<StudentClearance />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
