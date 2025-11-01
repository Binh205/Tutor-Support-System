import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import QuanLyBuoiHoc from "../components/tutor/quanlyBuoiHoc";
import TaoLichHoc from "../components/tutor/taoLichHoc";
import TheoDoiTienDo from "../components/tutor/theodoiTienDo";
import "../styles/App.css";
import "../styles/Dashboard.css";

export default function TutorDashboard() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route
            index
            element={
              <Navigate to="/tutor-dashboard/quan-ly-buoi-hoc" replace />
            }
          />
          <Route path="quan-ly-buoi-hoc" element={<QuanLyBuoiHoc />} />
          <Route path="tao-lich-hoc" element={<TaoLichHoc />} />
          <Route path="theo-doi-tien-do" element={<TheoDoiTienDo />} />
          <Route
            path="*"
            element={
              <Navigate to="/tutor-dashboard/quan-ly-buoi-hoc" replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
