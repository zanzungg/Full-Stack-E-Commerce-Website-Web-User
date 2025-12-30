import React from 'react';
import { IoMdTime } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

const BlogItem = ({ blog }) => {
  if (!blog) return null;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Truncate description
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const blogImage =
    blog.images?.[0]?.url || 'https://via.placeholder.com/400x300';
  const blogTitle = blog.title || 'Untitled Blog';
  const blogDescription = blog.description || '';
  const blogDate = blog.createdAt || new Date().toISOString();

  return (
    <div className="blogItem group">
      <div className="imgWrapper w-full overflow-hidden rounded-md cursor-pointer relative">
        <img
          src={blogImage}
          className="w-full h-48 object-cover transition-all group-hover:scale-105 group-hover:rotate-1"
          alt={blogTitle}
        />

        <span
          className="flex items-center justify-center text-white absolute bottom-[15px]
                right-[15px] z-50 bg-primary rounded-md p-1 text-[11px] font-medium gap-1"
        >
          <IoMdTime className="text-[16px]" /> {formatDate(blogDate)}
        </span>
      </div>

      <div className="info py-4">
        <h2 className="text-[15px] font-semibold text-black line-clamp-2">
          <Link to={`/blog/${blog._id}`} className="link">
            {blogTitle}
          </Link>
        </h2>
        <p className="text-[13px] font-normal text-[rgba(0,0,0,0.8)] mb-4 line-clamp-3">
          {truncateText(blogDescription, 80)}
        </p>

        <Link
          to={`/blog/${blog._id}`}
          className="link font-bold text-[14px] flex items-center gap-1"
        >
          Read More
          <IoIosArrowForward />
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;
