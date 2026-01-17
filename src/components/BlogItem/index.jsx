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

  const blogImage = blog.images?.[0]?.url;
  const blogTitle = blog.title;
  const blogDescription = blog.description;
  const blogDate = blog.createdAt;

  return (
    <div className="blogItem group h-full flex flex-col">
      <div className="imgWrapper w-full overflow-hidden rounded-md cursor-pointer relative">
        <img
          src={blogImage}
          className="w-full h-40 sm:h-44 md:h-48 object-cover transition-all duration-300 group-hover:scale-105 group-hover:rotate-1"
          alt={blogTitle}
          loading="lazy"
        />

        <span
          className="flex items-center justify-center text-white absolute bottom-2 sm:bottom-3 md:bottom-[15px]
                right-2 sm:right-3 md:right-[15px] z-50 bg-primary rounded-md p-1 sm:p-1.5 text-[10px] sm:text-[11px] font-medium gap-0.5 sm:gap-1 shadow-md"
        >
          <IoMdTime className="text-[14px] sm:text-[16px]" />{' '}
          {formatDate(blogDate)}
        </span>
      </div>

      <div className="info py-3 sm:py-3.5 md:py-4 flex-1 flex flex-col">
        <h2 className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-black line-clamp-2 mb-2">
          <Link
            to={`/blog/${blog._id}`}
            className="link hover:text-red-600 transition-colors"
          >
            {blogTitle}
          </Link>
        </h2>
        <p className="text-[12px] sm:text-[13px] font-normal text-[rgba(0,0,0,0.8)] mb-3 sm:mb-4 line-clamp-2 flex-1">
          {truncateText(blogDescription, 80)}
        </p>

        <Link
          to={`/blog/${blog._id}`}
          className="link font-bold text-[13px] sm:text-[14px] flex items-center gap-1 hover:text-red-600 hover:gap-2 transition-all active:opacity-70 w-fit"
        >
          Read More
          <IoIosArrowForward className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;
