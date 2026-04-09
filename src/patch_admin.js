const fs = require('fs');
const path = require('path');
const adminPath = "c:\\Users\\Asus\\Desktop\\Mental Health\\Mental Health\\MentalHealth\\healthsupport\\src\\pages\\AdminDashboard.jsx";

let content = fs.readFileSync(adminPath, 'utf8');

// Replace Supabase
content = content.replace("import { supabase } from '../lib/supabase'", "import api from '../lib/api'");

// 1. Replace Stats to TherapyRequests state
content = content.replace(
  /  \/\/ --- STATS STATE ---[\s\S]*?  const \[therapyRequests, setTherapyRequests\] = useState\(defaultTherapyRequests\)/,
  `  // --- STATS STATE ---
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeDoctors: 0,
    pendingRequests: 0,
    completedSessions: 0
  })

  // --- CONTENT MANAGER STATE (Stress Busters & Yoga) ---
  const [stressBusters, setStressBusters] = useState([])
  const [yogaTechniques, setYogaTechniques] = useState([])
  const [showContentModal, setShowContentModal] = useState(false)
  const [contentType, setContentType] = useState('stress') // 'stress' or 'yoga'
  const [editingContent, setEditingContent] = useState(null)
  const [contentForm, setContentForm] = useState({ title: '', description: '', imageUrl: '' })

  // --- DOCTOR MANAGEMENT STATE ---
  const [doctors, setDoctors] = useState([])
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', specialization: '' })
  const [doctorOptions, setDoctorOptions] = useState([])

  // --- THERAPY REQUESTS STATE ---
  const [therapyRequests, setTherapyRequests] = useState([])`
);

// 2. Replace useEffects for loading
content = content.replace(
  /  \/\/ Load therapy requests from Supabase \(real-time\) and localStorage[\s\S]*?  \}, \[yogaTechniques\]\)/,
  `  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [requestsRes, doctorsRes, postsRes] = await Promise.all([
        api.get('/admin/requests'),
        api.get('/admin/doctors'),
        api.get('/posts')
      ])

      const requests = requestsRes.data
      const docs = doctorsRes.data
      const posts = postsRes.data

      setTherapyRequests(requests.map(r => ({
        id: r.id,
        studentName: r.student?.name || 'Student',
        doctorName: r.doctor?.name || '',
        doctorId: r.doctor?.id,
        contactNumber: r.student?.phone || '',
        numberOfPeople: 1,
        issue: r.issue,
        severity: r.severity || 'Medium',
        requestedDate: r.appointmentDate,
        status: formatStatusLabel(r.status)
      })))

      setDoctors(docs)
      setDoctorOptions(docs)

      const stress = []
      const yoga = []
      posts.forEach(p => {
        try {
          const parsed = JSON.parse(p.content)
          if (parsed.type === 'stress') stress.push({...parsed, id: p.id})
          else if (parsed.type === 'yoga') yoga.push({...parsed, id: p.id})
        } catch (e) {
          // ignore normal posts
        }
      })
      setStressBusters(stress)
      setYogaTechniques(yoga)

      let pending = requests.filter(r => r.status === 'PENDING').length
      let scheduled = requests.filter(r => r.status === 'APPROVED').length

      setStats({
        totalRequests: requests.length,
        activeDoctors: docs.length,
        pendingRequests: pending,
        completedSessions: scheduled
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }`
);

// 3. Replace Content and Doctor CRUD
content = content.replace(
  /  const saveContent = \(\) => \{[\s\S]*?  const toggleDoctorStatus = \(id\) => \{[\s\S]*?  \}/,
  `  const saveContent = async () => {
    if (!contentForm.title || !contentForm.description) return

    const payload = {
      type: contentType,
      title: contentForm.title,
      description: contentForm.description,
      imageUrl: contentForm.imageUrl
    }

    try {
      if (editingContent) {
        // Technically we need PUT to update, but backend PostController might only have POST and DELETE
        // Let's delete the old one and create a new one
        await api.delete(\`/admin/posts/\${editingContent.id}\`)
      }
      
      const { data } = await api.post('/posts', {
        content: JSON.stringify(payload),
        anonymous: false
      })
      
      const newItem = {
        id: data.id,
        ...payload
      }

      if (contentType === 'stress') {
        if (editingContent) {
          setStressBusters(stressBusters.map(item => item.id === editingContent.id ? newItem : item))
        } else {
          setStressBusters([...stressBusters, newItem])
        }
      } else {
        if (editingContent) {
          setYogaTechniques(yogaTechniques.map(item => item.id === editingContent.id ? newItem : item))
        } else {
          setYogaTechniques([...yogaTechniques, newItem])
        }
      }

      setShowContentModal(false)
      setContentForm({ title: '', description: '', imageUrl: '' })
      setEditingContent(null)
    } catch (err) {
      console.error('Save content error:', err)
    }
  }

  const deleteContent = async (type, id) => {
    try {
      await api.delete(\`/admin/posts/\${id}\`)
      if (type === 'stress') {
        setStressBusters(stressBusters.filter(item => item.id !== id))
      } else {
        setYogaTechniques(yogaTechniques.filter(item => item.id !== id))
      }
    } catch (err) {
      console.error('Delete content error:', err)
    }
  }

  // --- DOCTOR CRUD OPERATIONS ---
  const openDoctorModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor)
      setDoctorForm({ name: doctor.name, email: doctor.email, password: '', specialization: doctor.specialization })
    } else {
      setEditingDoctor(null)
      setDoctorForm({ name: '', email: '', password: '', specialization: '' })
    }
    setShowDoctorModal(true)
  }

  const saveDoctor = async () => {
    if (!doctorForm.name || !doctorForm.email || (!editingDoctor && !doctorForm.password)) return

    try {
      if (editingDoctor) {
        const { data } = await api.put(\`/admin/users/\${editingDoctor.id}\`, {
          name: doctorForm.name,
          email: doctorForm.email,
          specialization: doctorForm.specialization,
          password: doctorForm.password || null
        })
        setDoctors(doctors.map(doc => doc.id === editingDoctor.id ? data : doc))
      } else {
        const { data } = await api.post('/admin/users', {
          name: doctorForm.name,
          email: doctorForm.email,
          password: doctorForm.password,
          role: 'DOCTOR',
          specialization: doctorForm.specialization
        })
        setDoctors([...doctors, data])
      }

      setShowDoctorModal(false)
      setDoctorForm({ name: '', email: '', password: '', specialization: '' })
      setEditingDoctor(null)
    } catch (error) {
      console.error('Error saving doctor:', error)
      alert('Error saving doctor.')
    }
  }

  const deleteDoctor = async (id) => {
    try {
      await api.delete(\`/admin/users/\${id}\`)
      setDoctors(doctors.filter(doc => doc.id !== id))
    } catch (error) {
      console.error('Error deleting doctor:', error)
    }
  }

  const toggleDoctorStatus = async (id) => {
    try {
      // Backend does not have a generic status toggle, it has approve-doctor
      await api.put(\`/admin/approve-doctor/\${id}\`)
      setDoctors(doctors.map(doc => doc.id === id ? { ...doc, active: true } : doc))
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }`
);

// 4. Replace Therapy Request Operations
content = content.replace(
  /  const updateTherapyRequest = async \(id, updates\) => \{[\s\S]*?  const assignRequestToDoctor = async \(requestId, doctorName\) => \{[\s\S]*?  \}/,
  `  const acceptTherapyRequest = async (id) => {
    try {
      await api.put(\`/admin/approve/\${id}\`)
      setTherapyRequests(therapyRequests.map(req =>
        req.id === id ? { ...req, status: 'Approved' } : req
      ))
    } catch (e) { console.error('Accept error:', e) }
  }

  const rejectTherapyRequest = async (id) => {
    try {
      await api.put(\`/admin/reject/\${id}\`)
      setTherapyRequests(therapyRequests.map(req =>
        req.id === id ? { ...req, status: 'Rejected' } : req
      ))
    } catch (e) { console.error('Reject error:', e) }
  }

  const assignRequestToDoctor = async (requestId, doctorName) => {
    try {
      const doc = doctors.find(d => d.name === doctorName)
      if (!doc) return;
      await api.put(\`/admin/assign/\${requestId}/\${doc.id}\`)
      setTherapyRequests(therapyRequests.map(req =>
        req.id === requestId ? { ...req, doctorName, doctorId: doc.id, status: 'Pending' } : req
      ))
    } catch (e) { console.error('Assign error:', e) }
  }`
);

fs.writeFileSync(adminPath, content, 'utf8');
console.log('Admin Dashboard Patcher applied successfully.');
