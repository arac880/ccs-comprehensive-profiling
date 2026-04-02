import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Faculty pages
import FacultyDashboard from "./pages/facultyPages/facultyDashboard";
import FacultyStudentList from "./pages/facultyPages/FacultyStudentList";
import FacultySchedule from "./pages/facultyPages/facultySchedule";
import FacultyEvents from "./pages/facultyPages/facultyEvents";
import FacultyStudentProfile from "./pages/facultyPages/StudentProfile";

// Student pages
import StudentDashboard from "./pages/studentPages/studentDashboard";
import StudentSchedule from "./pages/studentPages/studentSchedule";
import StudentEvents from "./pages/studentPages/studentEvents";
import StudentClearance from "./pages/studentPages/studentClearance";
import CollegeResearch from "./pages/studentPages/collegeResearch";
import StudentProfile from "./pages/studentPages/studentProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Faculty Routes */}
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute allowedRoles={["faculty", "dean"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/student-list"
          element={
            <ProtectedRoute allowedRoles={["faculty", "dean"]}>
              <FacultyStudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/schedule"
          element={
            <ProtectedRoute allowedRoles={["faculty", "dean"]}>
              <FacultySchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/events"
          element={
            <ProtectedRoute allowedRoles={["faculty", "dean"]}>
              <FacultyEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/student/:id"
          element={
            <ProtectedRoute allowedRoles={["faculty", "dean"]}>
              <FacultyStudentProfile />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/schedule"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/clearance"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentClearance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/research"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CollegeResearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
