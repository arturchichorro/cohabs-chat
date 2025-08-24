import type { Message } from "../types/message"
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from 'react';

type MessageListProps = {
    messages: Message[];
}

const Messages = ({ messages }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return (
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.length === 0 && (
                <div className='text-center text-cohabs-gray mt-8'>
                    <p>Welcome! Send a message to start the conversation.</p>
                </div>
            )}

            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                    <div className='flex flex-col'>
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-3xl ${
                                message.isUser ? 'bg-cohabs-brown': 'bg-cohabs-muted-gray'
                            }`}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    a: ({ ...props }) => (
                                        <a
                                            {...props}
                                            className="text-cohabs-dark-blue hover:text-cohabs-gray underline decoration-1 underline-offset-2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    ),
                                }}
                            >
                                {message.text}
                            </ReactMarkdown>
                        </div>
                        <p className={`text-xs mt-1 text-cohabs-gray ${message.isUser ? 'text-end' : 'text-start'}`}>
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                        </p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default Messages
