import React, { useState, useRef, useEffect } from 'react';

export default function ChatHub() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alice",
      avatar: "A",
      avatarBg: "bg-pink-600",
      text: "Hey everyone! Exciting to start planning our team offsite. I created this board.",
      time: "10:15 AM",
      isSelf: false
    },
    {
      id: 2,
      sender: "Bob",
      avatar: "B",
      avatarBg: "bg-blue-600",
      text: "Awesome! I'd love to go somewhere with great food and mild weather. Tokyo gets my vote!",
      time: "10:18 AM",
      isSelf: false
    },
    {
      id: 3,
      sender: "Charlie",
      avatar: "C",
      avatarBg: "bg-amber-600",
      text: "Tokyo sounds amazing. But let's make sure we balance active days (sightseeing) with some relaxation.",
      time: "10:22 AM",
      isSelf: false
    },
    {
      id: 4,
      sender: "Alice",
      avatar: "A",
      avatarBg: "bg-pink-600",
      text: "Agreed. I prefer a slower pace so we don't get burnt out. What budgets are we looking at? I'm thinking low/moderate.",
      time: "10:25 AM",
      isSelf: false
    },
    {
      id: 5,
      sender: "Charlie",
      avatar: "C",
      avatarBg: "bg-amber-600",
      text: "I actually wanted to go all out on a luxury resort, but I can do moderate if we compromise on activities!",
      time: "10:29 AM",
      isSelf: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: messages.length + 1,
      sender: "You (AVINASH)",
      avatar: "Y",
      avatarBg: "bg-indigo-600",
      text: newMessage,
      time: timeString,
      isSelf: true
    };

    setMessages([...messages, userMsg]);
    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeUsers = [
    { name: "Alice", status: "online", role: "Organizer" },
    { name: "Bob", status: "online", role: "Tech Lead" },
    { name: "Charlie", status: "online", role: "Designer" },
    { name: "You (AVINASH)", status: "online", role: "Contributor" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800/80 py-4 px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Collaborative Hub
          </h3>
          <p className="text-xs text-slate-400">Syncing preferences live with the team</p>
        </div>
        <div className="flex -space-x-2">
          {activeUsers.map((user, idx) => (
            <div
              key={idx}
              className={`w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white ${
                user.name.startsWith("Alice") ? "bg-pink-600" :
                user.name.startsWith("Bob") ? "bg-blue-600" :
                user.name.startsWith("Charlie") ? "bg-amber-600" : "bg-indigo-600"
              }`}
              title={`${user.name} (${user.role})`}
            >
              {user.name[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.isSelf ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white ${msg.avatarBg}`}>
                {msg.avatar}
              </div>

              {/* Message content */}
              <div>
                <div className={`flex items-baseline gap-2 mb-1 ${msg.isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-xs font-semibold text-slate-300">{msg.sender}</span>
                  <span className="text-[10px] text-slate-500">{msg.time}</span>
                </div>
                <div
                  className={`rounded-2xl py-2.5 px-4 text-sm leading-relaxed ${
                    msg.isSelf
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Members Sidebar (visible on larger displays) */}
        <div className="hidden md:block w-48 border-l border-slate-800/80 bg-slate-900/50 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Members ({activeUsers.length})</h4>
          <div className="space-y-3">
            {activeUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <div>
                  <p className="text-xs font-medium text-slate-200">{user.name}</p>
                  <p className="text-[9px] text-slate-500">{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="bg-slate-900 border-t border-slate-800/80 p-4 flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Share your preference with the team..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Send</span>
          <span>⚡</span>
        </button>
      </form>
    </div>
  );
}
