import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import useAuth from '../../hooks/useAuth';
import PageShell from '../../components/layout/PageShell';
import Card from '../../components/Card';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Calendar, User, Eye, ArrowLeft, MessageCircle } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const { user, profile } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data: postData } = await supabase
        .from('blog_posts')
        .select('*, profiles(full_name)')
        .eq('slug', slug)
        .single();
      
      if (postData) {
        setPost(postData);
        await supabase.rpc('increment_blog_views', { post_id: postData.id });
        
        const { data: commentsData } = await supabase
          .from('blog_comments')
          .select('*, profiles(full_name)')
          .eq('post_id', postData.id)
          .order('created_at', { ascending: false });
        setComments(commentsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to comment');
      return;
    }
    try {
      await supabase.from('blog_comments').insert([{ post_id: post.id, user_id: user.id, comment: newComment }]);
      setNewComment('');
      fetchPost();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  if (!post) return <div className="text-center py-12">Post not found</div>;

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center text-green-800 hover:text-green-900 mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </Link>

        <article>
          <div className="mb-8">
            <span className="text-green-800 font-semibold text-sm">{post.category}</span>
            <h1 className="text-5xl font-bold text-gray-900 mt-2 mb-4">{post.title}</h1>
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center"><User size={18} className="mr-2" />{post.profiles?.full_name}</div>
              <div className="flex items-center"><Calendar size={18} className="mr-2" />{new Date(post.published_at).toLocaleDateString()}</div>
              <div className="flex items-center"><Eye size={18} className="mr-2" />{post.views} views</div>
            </div>
          </div>

          {post.featured_image && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img src={post.featured_image} alt={post.title} className="w-full h-96 object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">#{tag}</span>
              ))}
            </div>
          )}
        </article>

        <Card className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="mr-3" size={28} />
            Comments ({comments.length})
          </h3>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                required
              />
              <Button type="submit" className="mt-4">Post Comment</Button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                <Link to="/signin" className="text-green-800 font-semibold hover:underline">Sign in</Link> to leave a comment
              </p>
            </div>
          )}

          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="border-l-4 border-green-800 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-white font-bold">
                    {comment.profiles?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{comment.profiles?.full_name}</p>
                    <p className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
