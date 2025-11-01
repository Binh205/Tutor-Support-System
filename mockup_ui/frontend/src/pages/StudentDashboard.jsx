import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import DangKyMonHoc from "../components/student/dangkyMonHoc";
import Feedback from "../components/student/feedback";
import QuanLyLichHoc from "../components/student/quanlyLichHoc";
import "../styles/App.css";
import "../styles/Dashboard.css";

export default function StudentDashboard() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route
            index
            element={
              <Navigate to="/student-dashboard/quan-ly-lich-hoc" replace />
            }
          />
          <Route path="dang-ky-mon-hoc" element={<DangKyMonHoc />} />
          <Route path="quan-ly-lich-hoc" element={<QuanLyLichHoc />} />
          <Route path="feedback" element={<Feedback />} />
          <Route
            path="*"
            element={
              <Navigate to="/student-dashboard/quan-ly-lich-hoc" replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
