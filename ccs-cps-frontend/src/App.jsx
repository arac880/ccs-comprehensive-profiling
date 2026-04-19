import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext"; // ←

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import FacultyLayout from "./components/facultyComponents/FacultyLayout";
import StudentLayout from "./components/studentComponents/StudentLayout";

// Faculty pages
import FacultyDashboard from "./pages/facultyPages/facultyDashboard";
import FacultyStudentList from "./pages/facultyPages/FacultyStudentList";
import FacultySchedule from "./pages/facultyPages/facultySchedule";
import FacultyEvents from "./pages/facultyPages/facultyEvents";
import FacultyStudentProfile from "./pages/facultyPages/FacultyStudentProfile";
import FacultyProfile from "./pages/facultyPages/facultyProfile";

// Student pages
import StudentDashboard from "./pages/studentPages/studentDashboard";
import StudentSchedule from "./pages/studentPages/studentSchedule";
import StudentEvents from "./pages/studentPages/studentEvents";
import StudentClearance from "./pages/studentPages/studentClearance";
import CollegeResearch from "./pages/studentPages/collegeResearch";
import StudentProfile from "./pages/studentPages/StudentProfile";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* ← WRAP EVERYTHING */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* FACULTY SECTION */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={["faculty", "dean"]}>
                <FacultyLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="student-list" element={<FacultyStudentList />} />
            <Route path="schedule" element={<FacultySchedule />} />
            <Route path="events" element={<FacultyEvents />} />
            <Route path="profile" element={<FacultyProfile />} />
            <Route path="student/:id" element={<FacultyStudentProfile />} />
          </Route>

          {/* STUDENT SECTION */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="schedule" element={<StudentSchedule />} />
            <Route path="events" element={<StudentEvents />} />
            <Route path="clearance" element={<StudentClearance />} />
            <Route path="research" element={<CollegeResearch />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
