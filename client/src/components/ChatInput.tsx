import { ArrowRight } from "lucide-react";

type ChatInputProps = {
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
};

const ChatInput = ({ value, onChange, onSubmit }: ChatInputProps) => {
  return (
    <div className='border-t border-cohabs-muted-gray p-4'>
        <div className='flex space-x-2'>
            <input 
                type='text'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        onSubmit()
                    }

                }}
                placeholder='Type your message...'
                className='flex-1 px-3 py-2 border border-cohabs-gray rounded-md focus:outline-none focus:ring-2 focus:ring-cohabs-brown focus:border-transparent'
            />
            <button
                onClick={onSubmit}
                className='bg-cohabs-brown hover:bg-cohabs-dark-brown p-2 rounded-3xl cursor-pointer'
            >
                <ArrowRight />
            </button>
        </div>
    </div>
  )
}

export default ChatInput
