import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/auth";
import { ProtectedRoute, PublicOnlyRoute } from "@/routes/ProtectedRoute";

import Landing from "@/pages/Landing";
import Blogs from "@/pages/Blogs";
import BlogPage from "@/pages/Blog";
import Dashboard from "@/pages/Dashboard";
import Publish from "@/pages/Publish";
import EditBlog from "@/pages/EditBlog";
import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* public */}
          <Route path="/" element={<Landing />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogPage />} />

          {/* only when logged out */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* only when logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/blog/:id/edit" element={<EditBlog />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}