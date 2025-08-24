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
            text: "It is a measure imposed by the [New York Housing Department](https://www1.nyc.gov/site/hpd/index.page) policy that prevents residential properties, like Cohabs, from installing bedroom door locks for fire safety purposes. However, as explained in our golden rules, we provide safe and secure common spaces through trust and mutual respect of our community. For more information, please visit our [FAQ page](https://cohabs.com/faq).",
            isUser: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage, botMessage]);
        setInputText('');
    };

    return (
        <div className='flex flex-col bg-cohabs-muted-sand rounded-4xl w-full max-w-full h-screen sm:max-h-[80%] sm:h-full sm:max-w-2xl'>
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
