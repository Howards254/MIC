import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import PageShell from '../../components/layout/PageShell';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Calendar, User, Eye, ArrowRight } from 'lucide-react';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await supabase
        .from('blog_posts')
        .select('*, profiles(full_name)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      setPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(posts.map(p => p.category))];
  const filteredPosts = selectedCategory === 'all' ? posts : posts.filter(p => p.category === selectedCategory);

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600">Insights on sustainability, innovation, and building a greener future</p>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-green-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {filteredPosts.length > 0 && (
          <Link to={`/blog/${filteredPosts[0].slug}`}>
            <Card className="mb-12 overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64 md:h-auto bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  {filteredPosts[0].featured_image ? (
                    <img src={filteredPosts[0].featured_image} alt={filteredPosts[0].title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-6xl font-bold">Featured</span>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-green-800 font-semibold text-sm mb-2">{filteredPosts[0].category}</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{filteredPosts[0].title}</h2>
                  <p className="text-gray-600 mb-6">{filteredPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center"><User size={16} className="mr-1" />{filteredPosts[0].profiles?.full_name}</div>
                    <div className="flex items-center"><Calendar size={16} className="mr-1" />{new Date(filteredPosts[0].published_at).toLocaleDateString()}</div>
                    <div className="flex items-center"><Eye size={16} className="mr-1" />{filteredPosts[0].views} views</div>
                  </div>
                  <div className="flex items-center text-green-800 font-semibold">
                    Read More <ArrowRight size={20} className="ml-2" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  {post.featured_image ? (
                    <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-4xl font-bold">{post.category}</span>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-green-800 font-semibold text-xs mb-2 block">{post.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center"><User size={14} className="mr-1" />{post.profiles?.full_name}</div>
                    <div className="flex items-center"><Calendar size={14} className="mr-1" />{new Date(post.published_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts found</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
