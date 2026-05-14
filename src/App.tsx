import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// 公共页面
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PhotoList from './pages/PhotoList';
import PhotoDetail from './pages/PhotoDetail';

// 用户页面
import UploadPhoto from './pages/UploadPhoto';
import SubmitAttempt from './pages/SubmitAttempt';
import MyAttempts from './pages/MyAttempts';
import MyPrizes from './pages/MyPrizes';
import Profile from './pages/Profile';

// 管理员页面
import PhotoReview from './pages/admin/PhotoReview';
import AttemptReview from './pages/admin/AttemptReview';
import PrizeClaim from './pages/admin/PrizeClaim';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 公共页面 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/photos" element={<PhotoList />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />

        {/* 用户页面（需登录） */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPhoto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/photos/:id/submit"
          element={
            <ProtectedRoute>
              <SubmitAttempt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/photos/:id/my-attempts"
          element={
            <ProtectedRoute>
              <MyAttempts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prizes"
          element={
            <ProtectedRoute>
              <MyPrizes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 管理员页面 */}
        <Route
          path="/admin/photos"
          element={
            <AdminRoute>
              <PhotoReview />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/attempts"
          element={
            <AdminRoute>
              <AttemptReview />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/prizes"
          element={
            <AdminRoute>
              <PrizeClaim />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}

