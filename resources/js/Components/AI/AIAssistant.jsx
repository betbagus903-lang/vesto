import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { useTheme } from '../../Context/ThemeContext';
import { useLanguage } from '../../Context/LanguageContext';
import SlimeIcon from './SlimeIcon';
import {
  X,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Tag,
  TrendingUp,
  Settings,
  Search,
  Trash2,
  Copy,
  Play,
  XCircle,
  Plus,
  MoreVertical,
  Edit2,
} from 'lucide-react';

export default function AIAssistant() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showSessionList, setShowSessionList] = useState(false);
  const [activeSessionMenu, setActiveSessionMenu] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [editSessionTitle, setEditSessionTitle] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionListRef = useRef(null);

  // Close session list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sessionListRef.current && !sessionListRef.current.contains(event.target)) {
        setShowSessionList(false);
      }
    };

    if (showSessionList) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSessionList]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      loadSuggestions();
      loadSessions();
      loadActiveSession();
    }
  }, [isOpen]);

  // Load sessions from database
  const loadSessions = async () => {
    try {
      const response = await fetch('/admin/ai/sessions');
      const data = await response.json();
      console.log('Loaded sessions:', data);
      // Only show sessions that have chat history
      const filteredSessions = data.filter(session => session.messages && session.messages.length > 0);
      console.log('Filtered sessions:', filteredSessions);
      setSessions(filteredSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  // Load active session
  const loadActiveSession = async () => {
    try {
      const activeSession = sessions.find(s => s.is_active);
      if (activeSession) {
        await loadSession(activeSession.id);
      }
    } catch (error) {
      console.error('Failed to load active session:', error);
    }
  };

  // Load a specific session
  const loadSession = async (sessionId) => {
    try {
      const response = await fetch('/admin/ai/sessions/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await response.json();
      setSessionId(data.session_id);
      setMessages(data.messages || []);
      setShowSessionList(false);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  // Create new session
  const createNewSession = async () => {
    try {
      // If there are messages in current session, save it first
      if (messages.length > 0 && sessionId) {
        // Current session will be saved automatically via chat API
      }

      const response = await fetch('/admin/ai/sessions/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        },
      });
      const data = await response.json();
      setSessionId(data.session_id);
      setMessages([]);
      setShowSessionList(false);
      await loadSessions();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  // Delete session
  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await fetch('/admin/ai/sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      await loadSessions();
      // If deleted session was current session, clear UI
      if (sessionId === sessionId) {
        setMessages([]);
        setSessionId(null);
      }
      setActiveSessionMenu(null);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  // Update session title
  const updateSessionTitle = async (sessionId, newTitle) => {
    try {
      await fetch('/admin/ai/sessions/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({ session_id: sessionId, title: newTitle }),
      });
      await loadSessions();
      setEditingSession(null);
      setEditSessionTitle('');
      setActiveSessionMenu(null);
    } catch (error) {
      console.error('Failed to update session title:', error);
    }
  };

  // Start editing session
  const startEditingSession = (session, e) => {
    e.stopPropagation();
    setEditingSession(session.id);
    setEditSessionTitle(session.title);
    setActiveSessionMenu(null);
  };

  // Cancel editing
  const cancelEditingSession = () => {
    setEditingSession(null);
    setEditSessionTitle('');
  };

  // Save session title
  const saveSessionTitle = (sessionId) => {
    if (editSessionTitle.trim()) {
      updateSessionTitle(sessionId, editSessionTitle.trim());
    }
  };

  // Load contextual suggestions
  const loadSuggestions = async () => {
    try {
      const response = await fetch('/admin/ai/suggestions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  // Send message to AI
  const sendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add system message to tell AI it's a slime named Fuwa
    const systemMessage = {
      role: 'system',
      content: 'You are Fuwa, a friendly AI assistant represented by a cute blue hydro slime mascot. You are helpful, friendly, and have a playful personality. You help users manage campaigns, create coupons, generate SEO content, and more. Keep your responses friendly and conversational. Your name is Fuwa.'
    };

    try {
      const response = await fetch('/admin/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: {
            current_page: window.location.pathname,
            language: language,
          },
          conversation_history: [
            systemMessage,
            ...messages.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            }))
          ],
          session_id: sessionId,
        }),
      });

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned HTML instead of JSON. Check authentication and route configuration.');
      }

      const data = await response.json();

      if (data.type === 'action') {
        setSessionId(data.session_id);
        setPendingAction(data);
        const aiMessage = {
          role: 'assistant',
          content: data.action.explanation || 'I can help you with that action.',
          type: 'action',
          action: data.action,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        loadSessions(); // Refresh session list after chat
      } else if (data.type === 'answer') {
        setSessionId(data.session_id);
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        loadSessions(); // Refresh session list after chat
      } else if (data.type === 'error') {
        const errorMessage = {
          role: 'assistant',
          content: `Error: ${data.error}`,
          isError: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to connect to AI service. Please try again.'}`,
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute pending action
  const executeAction = async () => {
    if (!pendingAction) return;

    setIsLoading(true);
    try {
      const response = await fetch('/admin/ai/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({
          action: pendingAction.action,
        }),
      });

      const data = await response.json();

      const resultMessage = {
        role: 'assistant',
        content: data.success
          ? `✓ ${data.result.message}`
          : `✗ Failed: ${data.result.error}`,
        type: 'result',
        success: data.success,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, resultMessage]);
      setPendingAction(null);

      // Refresh the page if action was successful
      if (data.success) {
        setTimeout(() => {
          router.reload();
        }, 1500);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error executing action: ${error.message}`,
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setPendingAction(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel pending action
  const cancelAction = () => {
    setPendingAction(null);
    const cancelMessage = {
      role: 'assistant',
      content: 'Action cancelled.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, cancelMessage]);
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setSessionId(null);
    setShowSessionList(false);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          title="Fuwa"
        >
          <SlimeIcon size={64} />
        </div>
      )}

      {/* Side Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className={`relative w-full sm:w-[480px] h-[80vh] sm:h-[700px] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
              theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <SlimeIcon size={28} trackCursor={true} />
                <div>
                  <h2
                    className={`font-semibold ${
                      theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                    }`}
                  >
                    Fuwa
                  </h2>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                    }`}
                  >
                    Powered by Mistral
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSessionList(!showSessionList)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-[#1E293B] text-[#94A3B8]'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  title="Sessions"
                >
                  <Clock className="w-4 h-4" />
                </button>
                <button
                  onClick={clearConversation}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-[#1E293B] text-[#94A3B8]'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  title="New chat"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-[#1E293B] text-[#94A3B8]'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Session List Sidebar */}
            {showSessionList && (
              <div
                ref={sessionListRef}
                className={`absolute inset-y-0 left-0 w-64 border-r ${
                  theme === 'dark' ? 'bg-[#0C1524] border-[#1E293B]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="p-4 border-b">
                  <h3
                    className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                    }`}
                  >
                    Chat History
                  </h3>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => loadSession(session.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors relative ${
                        session.is_active
                          ? theme === 'dark'
                            ? 'bg-[#4F6BFF]/20 text-[#4F6BFF]'
                            : 'bg-blue-50 text-blue-600'
                          : theme === 'dark'
                          ? 'hover:bg-[#1E293B] text-[#94A3B8]'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {editingSession === session.id ? (
                          <input
                            type="text"
                            value={editSessionTitle}
                            onChange={(e) => setEditSessionTitle(e.target.value)}
                            onBlur={() => saveSessionTitle(session.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveSessionTitle(session.id);
                              if (e.key === 'Escape') cancelEditingSession();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className={`flex-1 text-xs font-medium bg-transparent border-b ${
                              theme === 'dark' 
                                ? 'border-[#4F6BFF] text-[#4F6BFF]' 
                                : 'border-blue-300 text-blue-600'
                            } focus:outline-none`}
                            autoFocus
                          />
                        ) : (
                          <span className="text-xs font-medium truncate flex-1">
                            {session.title}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSessionMenu(activeSessionMenu === session.id ? null : session.id);
                          }}
                          className={`ml-2 p-1 rounded hover:bg-opacity-20 ${
                            theme === 'dark' 
                              ? 'hover:bg-[#4F6BFF] text-[#94A3B8]' 
                              : 'hover:bg-blue-100 text-gray-500'
                          }`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Dropdown Menu */}
                      {activeSessionMenu === session.id && (
                        <div
                          className={`absolute right-0 top-full mt-1 w-32 rounded-lg shadow-lg z-10 ${
                            theme === 'dark' 
                              ? 'bg-[#1E293B] border border-[#374151]' 
                              : 'bg-white border border-gray-200'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => startEditingSession(session, e)}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 ${
                              theme === 'dark' 
                                ? 'hover:bg-[#374151] text-[#94A3B8]' 
                                : 'hover:bg-gray-100 text-gray-600'
                            }`}
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit Name
                          </button>
                          <button
                            onClick={(e) => deleteSession(session.id, e)}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 ${
                              theme === 'dark' 
                                ? 'hover:bg-[#374151] text-red-400' 
                                : 'hover:bg-gray-100 text-red-500'
                            }`}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      )}
                      
                      <div className="text-xs opacity-60 mt-1">
                        {new Date(session.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div
                      className={`text-center py-8 text-xs ${
                        theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                      }`}
                    >
                      No chat history yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div
                  className={`text-center py-8 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                  }`}
                >
                  <SlimeIcon size={64} />
                  <h3
                    className={`font-semibold mb-2 ${
                      theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                    }`}
                  >
                    How can I help you today?
                  </h3>
                  <p className="text-sm mb-6">
                    I can help you manage campaigns, create coupons, generate SEO,
                    and more.
                  </p>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium mb-3">Suggested:</p>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all hover:scale-[1.02] ${
                            theme === 'dark'
                              ? 'bg-[#0C1524] hover:bg-[#1E293B] text-[#94A3B8]'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Messages */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? theme === 'dark'
                          ? 'bg-[#4F6BFF] text-white'
                          : 'bg-[#4F6BFF] text-white'
                        : message.isError
                        ? theme === 'dark'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-red-50 text-red-600 border border-red-200'
                        : theme === 'dark'
                        ? 'bg-[#0C1524] text-[#F8FAFC] border border-[#1E293B]'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.type === 'action' && (
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs font-medium">Action Proposed</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.type === 'action' && (
                      <div
                        className={`mt-3 p-3 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-[#101827] border border-[#1E293B]'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-xs font-medium mb-1">Action Details:</p>
                        <pre
                          className={`text-xs overflow-x-auto ${
                            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                          }`}
                        >
                          {JSON.stringify(message.action, null, 2)}
                        </pre>
                      </div>
                    )}
                    {message.type === 'result' && (
                      <div
                        className={`flex items-center gap-2 mt-2 ${
                          message.success ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {message.success ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className="text-xs">{message.success ? 'Success' : 'Failed'}</span>
                      </div>
                    )}
                    <p
                      className={`text-xs mt-2 ${
                        theme === 'dark' ? 'text-[#64748B]' : 'text-gray-400'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Pending Action Confirmation */}
              {pendingAction && (
                <div
                  className={`p-4 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-[#0C1524] border-[#4F6BFF]/30'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle
                      className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-[#4F6BFF]' : 'text-[#4F6BFF]'
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                      }`}
                    >
                      Confirm Action
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-4 ${
                      theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                    }`}
                  >
                    {pendingAction.action.explanation}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={executeAction}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        theme === 'dark'
                          ? 'bg-[#4F6BFF] hover:bg-[#4F6BFF]/80 text-white'
                          : 'bg-[#4F6BFF] hover:bg-[#4F6BFF]/80 text-white'
                      } disabled:opacity-50`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        'Execute'
                      )}
                    </button>
                    <button
                      onClick={cancelAction}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        theme === 'dark'
                          ? 'bg-[#1E293B] hover:bg-[#1E293B]/80 text-[#94A3B8]'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && !pendingAction && (
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-[#4F6BFF]" />
                  <span className={theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'}>
                    Thinking...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className={`p-4 border-t ${
                theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-200'
              }`}
            >
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading || pendingAction}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all ${
                    theme === 'dark'
                      ? 'bg-[#0C1524] border border-[#1E293B] text-[#F8FAFC]'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                  } disabled:opacity-50`}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || pendingAction}
                  className={`px-4 py-3 rounded-xl transition-all ${
                    theme === 'dark'
                      ? 'bg-[#4F6BFF] hover:bg-[#4F6BFF]/80 text-white'
                      : 'bg-[#4F6BFF] hover:bg-[#4F6BFF]/80 text-white'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
