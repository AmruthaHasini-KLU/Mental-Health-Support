import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Heart,
  Send,
  Filter,
  Plus,
  X,
  UserCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Briefcase,
  Sparkles
} from 'lucide-react'
import Layout from '../layouts/Layout'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  {
    id: 'exam-anxiety',
    name: 'Exam Anxiety',
    description: 'Share tips and support for managing exam stress',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'backlog-support',
    name: 'Backlog Support',
    description: 'Strategies for catching up on coursework',
    icon: Briefcase,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'general-wellness',
    name: 'General Wellness',
    description: 'Discuss self-care and overall mental health',
    icon: Sparkles,
    color: 'bg-sage-100 text-sage-700'
  }
]

export default function Forums() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'exam-anxiety',
    isAnonymous: false
  })
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [replies, setReplies] = useState({})
  const [likedPosts, setLikedPosts] = useState(new Set())

  // Fetch posts on component mount and when category changes
  useEffect(() => {
    fetchPosts()
    const subscription = subscribeToNewPosts()

    return () => {
      subscription?.unsubscribe()
    }
  }, [selectedCategory])

  // Fetch user's liked posts
  useEffect(() => {
    if (user) {
      fetchUserLikes()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      
      // If Supabase is not configured, use mock data
      if (!supabase) {
        setPosts(getMockPosts())
        setLoading(false)
        return
      }
      
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching posts:', error)
        // Use mock data if Supabase is not configured
        setPosts(getMockPosts())
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setPosts(getMockPosts())
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNewPosts = () => {
    // Skip subscription if Supabase is not configured
    if (!supabase) return null
    
    try {
      const subscription = supabase
        .channel('posts')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: selectedCategory ? `category=eq.${selectedCategory}` : undefined
        }, (payload) => {
          setPosts((current) => [payload.new, ...current])
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts'
        }, (payload) => {
          setPosts((current) =>
            current.map((post) => post.id === payload.new.id ? payload.new : post)
          )
        })
        .subscribe()

      return subscription
    } catch (error) {
      console.error('Error subscribing to posts:', error)
      return null
    }
  }

  const fetchUserLikes = async () => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching likes:', error)
      } else {
        setLikedPosts(new Set(data.map((like) => like.post_id)))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchReplies = async (postId) => {
    if (!supabase) return []
    
    try {
      const { data, error } = await supabase
        .from('replies')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching replies:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.error('Error:', error)
      return []
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()

    if (!newPost.title.trim() || !newPost.content.trim()) {
      return
    }

    try {
      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category,
        is_anonymous: newPost.isAnonymous,
        author_id: user?.id || null,
        author_name: newPost.isAnonymous ? 'Anonymous' : (user?.email || 'Student'),
        likes_count: 0
      }

      if (supabase) {
        const { data, error } = await supabase
          .from('posts')
          .insert([postData])
          .select()

        if (error) {
          console.error('Error creating post:', error)
        }
      }
      
      // Add to local state (works with or without Supabase)
      const mockPost = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        ...postData
      }
      setPosts((current) => [mockPost, ...current])

      // Reset form
      setNewPost({
        title: '',
        content: '',
        category: 'exam-anxiety',
        isAnonymous: false
      })
      setShowCreatePost(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLikePost = async (postId) => {
    if (!user) return

    const isLiked = likedPosts.has(postId)

    try {
      if (supabase) {
        if (isLiked) {
          // Unlike
          await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id)
        } else {
          // Like
          await supabase.from('post_likes').insert([{
            post_id: postId,
            user_id: user.id
          }])
        }
      }
      
      // Update local state (works with or without Supabase)
      if (isLiked) {
        setLikedPosts((current) => {
          const updated = new Set(current)
          updated.delete(postId)
          return updated
        })

        setPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? { ...post, likes_count: Math.max(0, (post.likes_count || 0) - 1) }
              : post
          )
        )
      } else {
        setLikedPosts((current) => new Set([...current, postId]))

        setPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? { ...post, likes_count: (post.likes_count || 0) + 1 }
              : post
          )
        )
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleReply = async (postId) => {
    if (!replyContent.trim()) return

    try {
      const replyData = {
        post_id: postId,
        content: replyContent.trim(),
        author_id: user?.id || null,
        author_name: user?.email || 'Student',
        is_anonymous: false
      }

      let newReply
      if (supabase) {
        const { data, error } = await supabase
          .from('replies')
          .insert([replyData])
          .select()

        if (error) {
          console.error('Error creating reply:', error)
        } else {
          newReply = data[0]
        }
      }
      
      // Add to local state (works with or without Supabase)
      if (!newReply) {
        newReply = {
          id: Date.now(),
          created_at: new Date().toISOString(),
          ...replyData
        }
      }
      
      setReplies((current) => ({
        ...current,
        [postId]: [...(current[postId] || []), newReply]
      }))

      setReplyContent('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const toggleReplies = async (postId) => {
    if (replies[postId]) {
      // Hide replies
      setReplies((current) => {
        const updated = { ...current }
        delete updated[postId]
        return updated
      })
    } else {
      // Fetch and show replies
      const fetchedReplies = await fetchReplies(postId)
      setReplies((current) => ({
        ...current,
        [postId]: fetchedReplies
      }))
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const getMockPosts = () => [
    {
      id: 1,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      title: 'How do you manage last-minute exam prep?',
      content: 'I have my finals in 2 days and feeling overwhelmed. Any quick study techniques that worked for you?',
      category: 'exam-anxiety',
      author_name: 'Anonymous',
      is_anonymous: true,
      likes_count: 12
    },
    {
      id: 2,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      title: 'Fell behind in 3 subjects - advice needed',
      content: 'I missed a lot of classes due to health issues. Now I have backlogs in 3 subjects. How do I prioritize?',
      category: 'backlog-support',
      author_name: 'student@university.edu',
      is_anonymous: false,
      likes_count: 8
    },
    {
      id: 3,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      title: 'Daily meditation has changed my life',
      content: 'Just wanted to share that starting meditation 15 mins daily has really helped with my anxiety. Anyone else tried this?',
      category: 'general-wellness',
      author_name: 'Anonymous',
      is_anonymous: true,
      likes_count: 24
    }
  ]

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <MessageSquare className="text-primary-600" size={36} />
                  Peer Support Forum
                </h1>
                <p className="mt-2 text-slate-600">
                  Connect with fellow students, share experiences, and support each other
                </p>
              </div>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30"
              >
                <Plus size={20} />
                <span className="font-medium">New Post</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-soft border border-slate-200 p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={20} className="text-slate-600" />
                  <h2 className="font-semibold text-slate-900">Categories</h2>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === null
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} />
                      <span>All Topics</span>
                    </div>
                  </button>

                  {CATEGORIES.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          selectedCategory === category.id
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={18} />
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <p className="text-xs mt-1 text-slate-500 ml-6">
                          {category.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Main Content - Posts Feed */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600">Loading posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-white rounded-2xl shadow-soft border border-slate-200"
                >
                  <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No posts yet</h3>
                  <p className="text-slate-600 mb-6">
                    Be the first to start a conversation in this category!
                  </p>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    Create Post
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={itemVariants}
                      className="bg-white rounded-2xl shadow-soft border border-slate-200 p-6 hover:shadow-md transition-shadow"
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
                            <UserCircle size={24} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {post.is_anonymous ? 'Anonymous' : post.author_name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock size={14} />
                              <span>{formatTimeAgo(post.created_at)}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="capitalize">
                                {CATEGORIES.find((c) => c.id === post.category)?.name || post.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-700 mb-4 leading-relaxed">
                        {post.content}
                      </p>

                      {/* Post Actions */}
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            likedPosts.has(post.id)
                              ? 'bg-red-50 text-red-600'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Heart
                            size={18}
                            fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
                          />
                          <span className="text-sm font-medium">
                            {post.likes_count || 0} {post.likes_count === 1 ? 'Like' : 'Likes'}
                          </span>
                        </button>

                        <button
                          onClick={() => toggleReplies(post.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
                        >
                          <MessageSquare size={18} />
                          <span className="text-sm font-medium">
                            {replies[post.id]?.length || 0} Replies
                          </span>
                        </button>

                        <button
                          onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-all ml-auto"
                        >
                          <Send size={18} />
                          <span className="text-sm font-medium">Reply</span>
                        </button>
                      </div>

                      {/* Reply Form */}
                      <AnimatePresence>
                        {replyingTo === post.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-slate-100"
                          >
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white flex-shrink-0">
                                <UserCircle size={20} />
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Share your thoughts..."
                                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                  rows="3"
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleReply(post.id)}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                                  >
                                    Post Reply
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReplyingTo(null)
                                      setReplyContent('')
                                    }}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Replies List */}
                      <AnimatePresence>
                        {replies[post.id] && replies[post.id].length > 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 pt-4 border-t border-slate-100 space-y-3"
                          >
                            {replies[post.id].map((reply) => (
                              <div key={reply.id} className="flex gap-3 bg-slate-50 p-4 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-calm-400 to-calm-600 flex items-center justify-center text-white flex-shrink-0">
                                  <UserCircle size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-slate-900 text-sm">
                                      {reply.is_anonymous ? 'Anonymous' : reply.author_name}
                                    </p>
                                    <span className="text-xs text-slate-500">
                                      {formatTimeAgo(reply.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-slate-700 text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Create Post Modal */}
        <AnimatePresence>
          {showCreatePost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowCreatePost(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
                  <h2 className="text-2xl font-bold text-slate-900">Create New Post</h2>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-slate-600" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="p-6 space-y-5">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="What's on your mind?"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Share your thoughts, experiences, or questions..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows="6"
                      required
                    />
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <UserCircle size={24} className="text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">Post Anonymously</p>
                        <p className="text-sm text-slate-600">
                          Your identity will be hidden from other users
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewPost({ ...newPost, isAnonymous: !newPost.isAnonymous })}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        newPost.isAnonymous ? 'bg-primary-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          newPost.isAnonymous ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-primary-600/30"
                    >
                      Post to Forum
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreatePost(false)}
                      className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}
