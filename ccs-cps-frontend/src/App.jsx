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
<<<<<<< HEAD
import StudentEvents from "./pages/studentPages/studentEvents";
=======
import StudentClearance from "./pages/studentPages/studentClearance";
>>>>>>> 06f471cf085f030754db2f1141c1f8e7a69dc3f0

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/schedule" element={<StudentSchedule />} />
<<<<<<< HEAD
                <Route path="/student/events" element={<StudentEvents />} />
=======
        <Route path="/student/clearance" element={<StudentClearance />} />
>>>>>>> 06f471cf085f030754db2f1141c1f8e7a69dc3f0
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
