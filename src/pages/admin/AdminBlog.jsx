import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Plus, Edit, Trash, Eye } from 'lucide-react';

export default function AdminBlog() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', category: '', tags: '', featured_image: '', status: 'draft'
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      setPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    const postData = {
      ...formData,
      tags,
      author_id: user.id,
      published_at: formData.status === 'published' ? new Date().toISOString() : null
    };

    try {
      if (editingPost) {
        await supabase.from('blog_posts').update(postData).eq('id', editingPost.id);
      } else {
        await supabase.from('blog_posts').insert([postData]);
      }
      setIsModalOpen(false);
      setEditingPost(null);
      setFormData({ title: '', slug: '', excerpt: '', content: '', category: '', tags: '', featured_image: '', status: 'draft' });
      fetchPosts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags?.join(', ') || '',
      featured_image: post.featured_image || '',
      status: post.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this post?')) {
      await supabase.from('blog_posts').delete().eq('id', id);
      fetchPosts();
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create and manage blog posts</p>
        </div>
        <Button onClick={() => { setEditingPost(null); setFormData({ title: '', slug: '', excerpt: '', content: '', category: '', tags: '', featured_image: '', status: 'draft' }); setIsModalOpen(true); }}>
          <Plus size={20} className="mr-2" />New Post
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Views</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.views}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}><Eye size={16} /></Button>
                      <Button size="sm" onClick={() => handleEdit(post)}><Edit size={16} /></Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}><Trash size={16} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && <div className="p-8 text-center text-gray-500">No blog posts yet</div>}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPost ? 'Edit Post' : 'New Post'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={formData.title} onChange={(e) => { setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)}); }} required />
          <Input label="Slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required />
          <Textarea label="Excerpt" value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} rows={3} required />
          <Textarea label="Content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={10} required />
          <Input label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Sustainability, Innovation, etc." required />
          <Input label="Tags (comma-separated)" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="green, eco-friendly, innovation" />
          <Input label="Featured Image URL" value={formData.featured_image} onChange={(e) => setFormData({...formData, featured_image: e.target.value})} placeholder="https://..." />
          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <div className="flex gap-4 pt-4">
            <Button type="button" fullWidth variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" fullWidth>{editingPost ? 'Update' : 'Create'} Post</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
