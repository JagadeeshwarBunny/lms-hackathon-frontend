import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { User, BookOpen, Users, FileText, Award, LogIn, UserPlus } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser(res.data.user);
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎓 LMS Hackathon
              </Link>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <User className="w-5 h-5" />
                      <span>{user.name} ({user.role})</span>
                    </span>
                    <Link 
                      to="/courses" 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={logout}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      <LogIn className="w-4 h-4 inline mr-1" /> Login
                    </Link>
                    <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      <UserPlus className="w-4 h-4 inline mr-1" /> Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/courses" />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/courses" />} />
          <Route path="/courses" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Landing Page
function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Welcome to LMS Hackathon
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Complete Learning Management System with Student/Teacher dashboards, courses, assignments, and grading.
      </p>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Feature icon={<BookOpen className="w-12 h-12 text-blue-600 mx-auto" />} title="Courses" desc="Browse and enroll in courses" />
        <Feature icon={<FileText className="w-12 h-12 text-green-600 mx-auto" />} title="Assignments" desc="Submit and review assignments" />
        <Feature icon={<Award className="w-12 h-12 text-purple-600 mx-auto" />} title="Grading" desc="Track your performance" />
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

// Register Form
function Register({ setUser }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, formData);
      setMessage(`✅ ${res.data.message}`);
      setTimeout(() => window.location.href = '/login', 1500);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Registration failed'}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Register
        </button>
        {message && (
          <div className={`p-3 rounded-xl mt-4 ${message.includes('✅') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

// Login Form (similar to Register)
function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      window.location.href = '/courses';
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Login failed'}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Login
        </button>
        {message && (
          <div className={`p-3 rounded-xl mt-4 ${message.includes('✅') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

// Dashboard (Student vs Teacher)
function Dashboard({ user }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome back, {user.name}!
        </h1>
        <p className="text-xl text-gray-600">Role: <span className="font-semibold capitalize">{user.role}</span></p>
      </div>

      {user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
    </div>
  );
}

function TeacherDashboard() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card icon={<BookOpen className="w-12 h-12 text-blue-600" />} title="My Courses" count="0" link="/teacher/courses" />
      <Card icon={<Users className="w-12 h-12 text-green-600" />} title="Total Students" count="12" link="#" />
      <Card icon={<FileText className="w-12 h-12 text-purple-600" />} title="Assignments" count="5" link="/teacher/assignments" />
    </div>
  );
}

function StudentDashboard() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card icon={<BookOpen className="w-12 h-12 text-blue-600" />} title="Enrolled Courses" count="3" link="/student/courses" />
      <Card icon={<FileText className="w-12 h-12 text-orange-600" />} title="Pending Assignments" count="2" link="/student/assignments" />
      <Card icon={<Award className="w-12 h-12 text-yellow-600" />} title="Average Grade" count="92%" link="/student/grades" />
    </div>
  );
}

function Card({ icon, title, count, link }) {
  return (
    <Link to={link} className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">{icon}</div>
        <div className="text-2xl font-bold text-gray-900">{count}</div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{title}</h3>
    </Link>
  );
}

export default App;
