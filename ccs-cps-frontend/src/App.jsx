import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import FacultyLayout from "./components/facultyComponents/FacultyLayout";

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

        {/* Faculty Routes  */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={["faculty", "dean"]}>
              <FacultyLayout />
            </ProtectedRoute>
          }
        >
          {/* Default faculty page */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Child Routes - injected into the FacultyLayout's <Outlet /> */}
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="student-list" element={<FacultyStudentList />} />
          <Route path="schedule" element={<FacultySchedule />} />
          <Route path="events" element={<FacultyEvents />} />
          <Route path="student/:id" element={<FacultyStudentProfile />} />
        </Route>

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