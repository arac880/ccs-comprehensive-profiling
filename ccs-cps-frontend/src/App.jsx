import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";

// Faculty pages
import FacultyDashboard from "./pages/facultyPages/facultyDashboard";
import FacultyStudentList from "./pages/facultyPages/FacultyStudentList";
import FacultySchedule from "./pages/facultyPages/facultySchedule";
import FacultyEvents from "./pages/facultyPages/facultyEvents";
import FacultyStudentProfile from "./pages/facultyPages/StudentProfile";

// Student pages
import StudentDashboard from "./pages/studentPages/StudentDashboard";
import StudentSchedule from "./pages/studentPages/StudentSchedule";
import StudentEvents from "./pages/studentPages/StudentEvents";
import StudentClearance from "./pages/studentPages/StudentClearance";
import CollegeResearch from "./pages/studentPages/CollegeResearch";
import StudentProfile from "./pages/studentPages/StudentProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Faculty */}
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/student-list" element={<FacultyStudentList />} />
        <Route path="/faculty/schedule" element={<FacultySchedule />} />
        <Route path="/faculty/events" element={<FacultyEvents />} />
        <Route
          path="/faculty/student/:id"
          element={<FacultyStudentProfile />}
        />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/schedule" element={<StudentSchedule />} />
        <Route path="/student/events" element={<StudentEvents />} />
        <Route path="/student/clearance" element={<StudentClearance />} />
        <Route path="/student/research" element={<CollegeResearch />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* Fallback → login */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
