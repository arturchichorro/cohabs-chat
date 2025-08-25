import { useState } from 'react'
import ChatHeader from './ChatHeader';
import type { Message } from '../types/message';
import Messages from './Messages';
import ChatInput from './ChatInput';

const ChatApp = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleSubmit = async () => {
        const prompt = inputText.trim();
        if (!prompt || isThinking) return;

        const userMessage: Message = {
        id: Date.now(),
        text: prompt,
        isUser: true,
        timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsThinking(true);

        try {

            console.log(messages)
            const res = await fetch("http://localhost:3035/query", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    query: prompt,
                    history: messages,
                }),
            });

            if (!res.ok) throw new Error(`Server responded ${res.status}`);

            const data = await res.json();
            const answer = typeof data === 'string' ? data : data.answer ?? data.message ?? "I can't answer that question.";
            
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: answer,
                isUser: false,
                timestamp: new Date(),
            }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Sorry, something went wrong contacting the assistant.",
                    isUser: false,
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className='flex flex-col bg-cohabs-muted-sand rounded-4xl w-full max-w-full h-screen sm:max-h-[80%] sm:h-full sm:max-w-2xl'>
            <ChatHeader />
            <Messages messages={messages} isThinking={isThinking} />
            <ChatInput 
                value={inputText}
                onChange={setInputText}
                onSubmit={handleSubmit}
            />
            
        </div>
    )
}

export default ChatApp
