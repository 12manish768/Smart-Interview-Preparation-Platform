import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Send, Clock, BrainCircuit, User, Loader2, Award } from 'lucide-react';

const InterviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const topic = queryParams.get('topic');
    const difficulty = queryParams.get('difficulty');
    
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes for a full session
    const [isCompleted, setIsCompleted] = useState(false);
    
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!topic || !difficulty) {
            navigate('/dashboard');
            return;
        }

        const initializeSession = async () => {
            setLoading(true);
            try {
                // Initialize session via backend API
                const startResponse = await api.post('/interviews/start', { topic, difficulty });
                setSessionId(startResponse.data.id);
                
                // Get first question
                const questionResponse = await api.post(`/interviews/${startResponse.data.id}/next`);
                setMessages([{ type: 'ai', text: questionResponse.data.question }]);
            } catch (err) {
                console.error('Failed to start session', err);
            } finally {
                setLoading(false);
            }
        };

        initializeSession();
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && !isCompleted) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isCompleted) {
            handleEndInterview();
        }
    }, [timeLeft, isCompleted]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading || isCompleted) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setLoading(true);

        try {
            await api.post(`/interviews/${sessionId}/answer`, { answer: userMsg });
            
            if (messages.length < 50) { // Limit to maximum 50 questions as requested
                const response = await api.post(`/interviews/${sessionId}/next`);
                setMessages(prev => [...prev, { type: 'ai', text: response.data.question }]);
            } else {
                handleEndInterview();
            }
        } catch (err) {
            console.error('Failed to process message', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEndInterview = async () => {
        setIsCompleted(true);
        setLoading(true);
        try {
            await api.post(`/interviews/${sessionId}/end`);
            // Redirect to evaluation report after a short delay for animation
            setTimeout(() => {
                navigate(`/evaluation/${sessionId}`);
            }, 1500);
        } catch (err) {
            console.error('Failed to end interview', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Navbar />
            
            <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-4 shadow-sm z-10 transition-colors">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                            <BrainCircuit className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white transition-colors">{topic}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">{difficulty} LEVEL</p>
                        </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${timeLeft < 60 ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700'}`}>
                        <Clock className={`h-4 w-4 ${timeLeft < 60 ? 'animate-pulse' : ''}`} />
                        <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`flex items-start space-x-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                msg.type === 'user' ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                                {msg.type === 'user' ? <User className="h-4 w-4 text-white" /> : <BrainCircuit className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                            </div>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed transition-colors ${
                                msg.type === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="flex items-start space-x-2">
                           <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors">
                             <BrainCircuit className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                           </div>
                           <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2 transition-colors">
                             <div className="flex space-x-1">
                               <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                               <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                               <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                             </div>
                             <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Analysing...</span>
                           </div>
                        </div>
                    </div>
                )}
                
                {isCompleted && (
                    <div className="flex justify-center p-8">
                       <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400 px-6 py-4 rounded-xl flex items-center space-x-3 shadow-sm animate-bounce-in transition-colors">
                         <Award className="h-6 w-6" />
                         <span className="font-bold">Session Completed! Generating evaluation...</span>
                       </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4 sticky bottom-0 z-10 shadow-lg transition-colors">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center space-x-4">
                    <input
                        type="text"
                        disabled={loading || isCompleted}
                        className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all disabled:opacity-50"
                        placeholder={isCompleted ? "Session Ended" : "Type your answer here..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || isCompleted || !input.trim()}
                        className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-90 disabled:opacity-50 disabled:scale-100"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default InterviewPage;
