import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Bot } from 'lucide-react';

export default function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Hi! Welcome to Vesto. How can I help you today?',
            time: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            text: inputText,
            time: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                type: 'bot',
                text: getBotResponse(inputText),
                time: new Date(),
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const getBotResponse = (userInput) => {
        const input = userInput.toLowerCase();
        
        if (input.includes('order') || input.includes('shipping')) {
            return 'You can track your order in the "My Orders" section of your account. For shipping inquiries, please contact our support team.';
        }
        if (input.includes('return') || input.includes('refund')) {
            return 'You can request a return or refund from your order history. Items can be returned within 30 days of delivery.';
        }
        if (input.includes('payment') || input.includes('pay')) {
            return 'We accept bank transfer, credit/debit cards, and cash on delivery. For payment issues, please contact our support team.';
        }
        if (input.includes('size') || input.includes('fit')) {
            return 'Check our Size Guide for detailed measurements. If you need help choosing the right size, feel free to ask!';
        }
        if (input.includes('stock') || input.includes('available')) {
            return 'Stock availability is shown on each product page. If an item is out of stock, you can sign up for restock notifications.';
        }
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return 'Hello! How can I assist you today? Feel free to ask about orders, products, returns, or any other questions.';
        }
        
        return 'Thanks for your message! Our support team will get back to you shortly. For immediate assistance, please contact us at support@vesto.com';
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors group"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="absolute right-14 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Chat with us
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-900 text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Vesto Support</p>
                        <p className="text-xs text-gray-400">Online • Typically replies instantly</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 hover:bg-gray-800 rounded transition-colors"
                    >
                        {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-gray-800 rounded transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
                <div className="flex flex-col h-[calc(500px-56px)]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    message.type === 'user' ? 'bg-gray-200' : 'bg-gray-900'
                                }`}>
                                    {message.type === 'user' ? (
                                        <User size={16} className="text-gray-600" />
                                    ) : (
                                        <Bot size={16} className="text-white" />
                                    )}
                                </div>
                                <div className={`max-w-[70%] ${
                                    message.type === 'user'
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                } rounded-2xl px-4 py-3`}>
                                    <p className="text-sm">{message.text}</p>
                                    <p className={`text-xs mt-1 ${
                                        message.type === 'user' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-gray-400 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
