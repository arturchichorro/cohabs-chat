import { useState } from 'react'
import ChatHeader from './ChatHeader';
import type { Message } from '../types/message';
import Messages from './Messages';
import ChatInput from './ChatInput';

const ChatApp = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');

    const handleSubmit = () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputText.trim(),
            isUser: true,
            timestamp: new Date()
        };

        const botMessage: Message = {
            id: Date.now() + 1,
            text: "Thank you for contacting our customer service.",
            isUser: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage, botMessage]);
        setInputText('');
    };

    return (
        <div className='flex flex-col h-screen'>
            <ChatHeader />
            <Messages messages={messages}/>
            <ChatInput 
                value={inputText}
                onChange={setInputText}
                onSubmit={handleSubmit}
            />
            
        </div>
    )
}

export default ChatApp
