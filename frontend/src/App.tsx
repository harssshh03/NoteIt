import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/context/auth";
import { GuestOnly, RequireAuth } from "@/routes/guards";
import AppLayout from "@/components/AppLayout";

import Blogs from "@/pages/Blogs";
import BlogPage from "@/pages/Blog";
import MyBlogs from "@/pages/MyBlogs";
import Publish from "@/pages/Publish";
import EditBlog from "@/pages/EditBlog";
import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";
import { Landing } from "./pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
       <Routes>
  {/* hero (full-screen, no sidebar) */}
  <Route path="/" element={<Landing/>} />

  {/* pages that share the sidebar layout */}
  <Route element={<AppLayout />}>
    <Route path="/blogs" element={<Blogs />} />
    <Route path="/blog/:id" element={<BlogPage />} />

    <Route element={<RequireAuth />}>
      <Route path="/my-blogs" element={<MyBlogs />} />
      <Route path="/publish" element={<Publish />} />
      <Route path="/blog/:id/edit" element={<EditBlog />} />
    </Route>
  </Route>

  <Route element={<GuestOnly />}>
    <Route path="/signin" element={<Signin />} />
    <Route path="/signup" element={<Signup />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}