import type { Message } from "../types/message"

type MessageListProps = {
    messages: Message[];
}

const Messages = ({ messages }: MessageListProps) => {
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
                        <p className='text-sm'>{message.text}</p>
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
    </div>
  )
}

export default Messages
