import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Calendar, PlayCircle, Clock, CheckCircle, Search, Filter, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    coreExpertise: 'None',
    hoursPracticed: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();

  const filteredInterviews = interviews.filter(session => {
    const sessionTopic = session.topic || "Unknown Topic";
    return sessionTopic.toLowerCase().includes(filterText.toLowerCase());
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          api.get('/interviews/history'),
          api.get('/interviews/stats')
        ]);
        setInterviews(historyRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!topic) return;
    
    try {
      // Initialize and navigate to the interview page with query params
      // For now, let's navigate to the interview page with params
      navigate(`/interview?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}`);
    } catch (err) {
      console.error('Failed to start interview', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">Your Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track your progress and practice with AI-powered mock interviews.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 flex items-center justify-center space-x-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            <PlayCircle className="h-5 w-5" />
            <span>Start New Interview</span>
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-indigo-900/20 transition-all duration-300 cursor-default relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent dark:from-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium relative z-10 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Total Interviews</span>
            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-2 relative z-10 transform group-hover:scale-105 transition-transform duration-300 origin-left">{stats.totalInterviews}</span>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-green-900/20 transition-all duration-300 cursor-default relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium relative z-10 transition-colors group-hover:text-green-600 dark:group-hover:text-green-400">Average Score</span>
            <span className="text-4xl font-black text-green-600 dark:text-green-400 mt-2 relative z-10 transform group-hover:scale-105 transition-transform duration-300 origin-left">{stats.averageScore}%</span>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-blue-900/20 transition-all duration-300 cursor-default relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium relative z-10 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">Core Expertise</span>
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-3 relative z-10 truncate transform group-hover:scale-105 transition-transform duration-300 origin-left" title={stats.coreExpertise}>
              {stats.coreExpertise}
            </span>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-purple-900/20 transition-all duration-300 cursor-default relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium relative z-10 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">Hours Practiced</span>
            <span className="text-4xl font-black text-purple-600 dark:text-purple-400 mt-2 relative z-10 transform group-hover:scale-105 transition-transform duration-300 origin-left">{stats.hoursPracticed}h</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Interview Sessions</h3>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Filter by topic..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:border-indigo-500 sm:text-sm transition-colors"
               />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {loading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Fetching your interview history...</p>
              </div>
            ) : interviews.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full inline-block transition-colors">
                  <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">No Interview History Yet</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 max-w-xs mx-auto">Start your first AI-powered interview to see your progress here.</p>
                <button
                   onClick={() => setShowModal(true)}
                   className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-colors"
                >
                  Start Practice →
                </button>
              </div>
            ) : filteredInterviews.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full inline-block transition-colors">
                  <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">No results found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 max-w-xs mx-auto">No past interviews match "{filterText}".</p>
                <button
                   onClick={() => setFilterText('')}
                   className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-colors"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              filteredInterviews.map((session) => {
                const getDate = (dateVal) => {
                  if (!dateVal) return new Date();
                  if (Array.isArray(dateVal)) {
                    return new Date(dateVal[0], dateVal[1] - 1, dateVal[2], dateVal[3] || 0, dateVal[4] || 0, dateVal[5] || 0);
                  }
                  return new Date(dateVal);
                };
                const sessionDate = getDate(session.startTime);

                return (
                <div 
                  key={session.id} 
                  onClick={() => navigate(`/evaluation/${session.id}`)}
                  className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="h-2 w-full bg-indigo-500"></div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider">
                      <span className="text-indigo-600 dark:text-indigo-400">{session.topic || "Unknown Topic"}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        session.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {session.topic || "System Design"} Practice
                    </h4>
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{sessionDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-bold mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 group-hover:translate-x-1 transition-transform">
                        <CheckCircle className="h-4 w-4" />
                        <span>View Report & Analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
              )})
            )}
          </div>
        </div>
      </main>

      {/* Start Interview Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in transition-colors">
            <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-indigo-50 dark:bg-gray-900/50">
              <div className="flex items-center space-x-3 text-indigo-700 dark:text-indigo-400">
                <BrainCircuit className="h-6 w-6" />
                <h3 className="text-xl font-bold dark:text-white">New Interview Session</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleStartInterview} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="transform transition-all duration-700 delay-100 opacity-0 animate-[bounceIn_0.8s_cubic-bezier(0.175,0.885,0.32,1.275)_0.1s_forwards]">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Topic</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium transition-all hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] cursor-pointer translate-y-0 hover:-translate-y-1 active:scale-[0.98]"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="">-- Choose a Topic --</option>
                    <option value="Java Full Stack Development">Java Full Stack</option>
                    <option value="Data Structures & Algorithms">DS & Algorithms</option>
                    <option value="System Design">System Design</option>
                    <option value="Behavioral / HR Round">Behavioral / HR</option>
                    <option value="Frontend Development (React)">React / Frontend</option>
                    <option value="Machine Learning">Machine Learning</option>
                  </select>
                </div>
                
                <div className="transform transition-all duration-500 delay-200 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['EASY', 'INTERMEDIATE', 'HARD'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className={`py-2 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 transform active:scale-95 border ${
                          difficulty === level 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] scale-105 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' 
                            : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-1 hover:shadow-md'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 transform transition-all duration-500 delay-300 opacity-0 animate-[fadeIn_0.5s_ease-out_0.3s_forwards]">
                <button
                  type="submit"
                  className="w-full relative group overflow-hidden bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Confirm & Start Session</span>
                    <PlayCircle className="h-5 w-5 transform group-hover:translate-x-2 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 group-hover:text-gray-400 transition-colors">
                  The session can take up to 20-60 minutes, with a maximum of 50 questions.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
