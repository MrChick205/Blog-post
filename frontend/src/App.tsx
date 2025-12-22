import { Layout } from 'antd';
import { Route, Routes, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PostListPage from './pages/posts/PostListPage';
import PostDetailPage from './pages/posts/PostDetailPage';
import PostEditorPage from './pages/posts/PostEditorPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
<<<<<<< HEAD
import ProfilePage from './pages/profile/ProfilePage';
=======
>>>>>>> 5edf9f51939ca46f4fe88b656963df3d5ecd885d
const { Content } = Layout;

const AppRoutes = () => {
  const { loading } = useAuth();
  if (loading) return null; // hoặc spinner

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<PostListPage />} />
<<<<<<< HEAD
             <Route path="/profile" element={<ProfilePage />} />
            {/* <Route path="/posts/:id" element={<PostDetailPage />} /> */}
=======
            <Route path="/posts/:id" element={<PostDetailPage />} />
>>>>>>> 5edf9f51939ca46f4fe88b656963df3d5ecd885d
            <Route path="/posts/new" element={<PostEditorPage mode="create" />} />
            <Route path="/posts/:id/edit" element={<PostEditorPage mode="edit" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>
    </Layout>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
