import { useParams, Link, useNavigate } from 'react-router-dom';
import { IoMdTime } from 'react-icons/io';
import { IoChevronBack } from 'react-icons/io5';
import { useBlogById } from '../../hooks/useBlog';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sử dụng hook useBlogById
  const { blog, loading, error, refresh } = useBlogById(id, {
    autoFetch: true,
    enableCache: true,
    cacheTime: 5 * 60 * 1000, // 5 phút
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Blog not found
  if (!blog) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Blog Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The blog you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const blogImage = blog.images?.[0]?.url;
  const blogTitle = blog.title;
  const blogDescription = blog.description;
  const blogDate = blog.createdAt;

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-red-600 mb-6 font-medium transition-colors"
        >
          <IoChevronBack className="text-xl" />
          Back to Home
        </Link>

        {/* Blog Content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Blog Header */}
          <div className="p-8 pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blogTitle}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <IoMdTime className="text-lg text-primary" />
              <span>Published on {formatDate(blogDate)}</span>
            </div>
          </div>

          {/* Featured Image */}
          {blogImage && (
            <div className="w-full">
              <img
                src={blogImage}
                alt={blogTitle}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="p-8 pt-6">
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-line"
                style={{ fontSize: '16px', lineHeight: '1.8' }}
              >
                {blogDescription}
              </div>
            </div>
          </div>

          {/* Additional Images */}
          {blog.images && blog.images.length > 1 && (
            <div className="p-8 pt-0">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.images.slice(1).map((image, index) => (
                  <img
                    key={image._id || index}
                    src={image.url}
                    alt={`${blogTitle} - Image ${index + 2}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-8 pt-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Last updated: {formatDate(blog.updatedAt || blogDate)}
              </div>
              <Link
                to="/"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
