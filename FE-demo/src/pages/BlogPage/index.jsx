import React from "react";
import BlogApp from "../../components/blog/BlogApp";
import { Navbar } from "../../components/home/homePage";
function BlogPage() {
  return (
    <div>
      <Navbar />
      <BlogApp />;
    </div>
  );
}

export default BlogPage;
