const fs = require('fs');
const path = "c:\\Users\\Asus\\Desktop\\Mental Health\\Mental Health\\MentalHealth\\healthsupport\\src\\pages\\Forums.jsx";
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
content = content.replace(
    "import { supabase } from '../lib/supabase'",
    "import api from '../lib/api'"
);

// 2. Fetch logic replace
const logicTarget = `  const fetchPosts = async () => {
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
          filter: selectedCategory ? \`category=eq.\${selectedCategory}\` : undefined
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
  }`;

const logicReplacement = `  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/posts')
      const mapped = data.map(p => ({
        id: p.id,
        created_at: p.createdAt,
        content: p.content,
        title: '', 
        category: 'general-wellness',
        author_name: p.userName || 'Anonymous',
        is_anonymous: p.anonymous,
        likes_count: 0
      }))
      setPosts(mapped)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNewPosts = () => null
  const fetchUserLikes = async () => null

  const fetchReplies = async (postId) => {
    try {
      const { data } = await api.get(\`/comments/post/\${postId}\`)
      return data.map(c => ({
        id: c.id,
        post_id: c.postId || postId,
        created_at: c.createdAt,
        content: c.content,
        author_name: c.userName || (c.user ? c.user.name : 'Unknown'),
        is_anonymous: false
      }))
    } catch (error) {
      console.error('Error fetching replies:', error)
      return []
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.content.trim()) return

    try {
      const { data } = await api.post('/posts', {
        content: newPost.content.trim(),
        anonymous: newPost.isAnonymous
      })
      const newPostObj = {
        id: data.id,
        created_at: data.createdAt,
        content: data.content,
        title: '',
        category: 'general-wellness',
        author_name: data.userName || (newPost.isAnonymous ? 'Anonymous' : user?.name),
        is_anonymous: data.anonymous,
        likes_count: 0
      }
      setPosts((current) => [newPostObj, ...current])
      setNewPost({ title: '', content: '', category: 'exam-anxiety', isAnonymous: false })
      setShowCreatePost(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLikePost = async (postId) => {
    if (!user) return
    const isLiked = likedPosts.has(postId)
    
    if (isLiked) {
      setLikedPosts((current) => {
        const updated = new Set(current)
        updated.delete(postId)
        return updated
      })
      setPosts((current) => current.map((post) => post.id === postId ? { ...post, likes_count: Math.max(0, (post.likes_count || 0) - 1) } : post))
    } else {
      setLikedPosts((current) => new Set([...current, postId]))
      setPosts((current) => current.map((post) => post.id === postId ? { ...post, likes_count: (post.likes_count || 0) + 1 } : post))
    }
  }

  const handleReply = async (postId) => {
    if (!replyContent.trim()) return

    try {
      const { data } = await api.post('/comments/add', {
        postId: postId,
        content: replyContent.trim()
      })
      const newReply = {
        id: data.id,
        post_id: data.postId || postId,
        created_at: data.createdAt,
        content: data.content,
        author_name: data.userName || user?.name || 'Unknown',
        is_anonymous: false
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
  }`;

content = content.replace(logicTarget, logicReplacement);

const mockTarget = `  const getMockPosts = () => [
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
  ]`;
content = content.replace(mockTarget, '');

fs.writeFileSync(path, content, 'utf8');
console.log('SUCCESS');
