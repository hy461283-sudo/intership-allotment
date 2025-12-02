import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext";
import StudentLogin from "./compontents/Student/StudentLogin/StudentLogin";
import StudentPage from "./compontents/Student/StudentPage/StudentPage";
import StudentProfileUpdate from "./compontents/Student/Profile/Profile"
import Home from "./compontents/Home/Home";
import OrgLogin from "./compontents/Organization/OrgLogin/OrgLogin";
import OrgPage from "./compontents/Organization/OrgPage/OrgPage";
import AdminLogin from "./compontents/Admin/AdminLogin/AdminLogin";
import AdminPage from "./compontents/Admin/AdminPage/AdminPage";
import StudentRegistration from "./compontents/Student/Registration/Registration";
import Forget from "./Common/ForgetPassword";
import AdminRegistration from "./compontents/Admin/Registration/Registration";
import OrganizationRegistration from "./compontents/Organization/Registration/Registration";
import ResetPasswordPage from "./Common/ResetPassword";
import ForgotPasswordPage from "./Common/ForgetPassword"; // ✅ fixed path

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SLogin" element={<StudentLogin />} />
          <Route path="/StudentRegistration" element={<StudentRegistration />} />
          <Route path="/Profile" element={<StudentProfileUpdate />} />
          <Route path="/Forget" element={<Forget />} />
          <Route path="/AdminRegistration" element={<AdminRegistration />} />
          <Route path="/OrganizationRegistration" element={<OrganizationRegistration />} />
          <Route path="/SP" element={<StudentPage />} />
          <Route path="/Org" element={<OrgLogin />} />
          <Route path="/OrgPortal" element={<OrgPage />} />
          <Route path="/Admin" element={<AdminLogin />} />
          <Route path="/AdminPortal" element={<AdminPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;