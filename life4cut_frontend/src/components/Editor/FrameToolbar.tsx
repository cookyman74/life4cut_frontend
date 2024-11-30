import React from 'react';

interface FrameToolbarProps {
    setFrame: (frame: string) => void;
}

const FrameToolbar: React.FC<FrameToolbarProps> = ({ setFrame }) => {
    return (
        <div className="flex gap-4 justify-center p-4">
            <button
                onClick={() => setFrame('red')}
                className="px-4 py-2 bg-red-200 text-red-700 rounded-lg shadow-md hover:bg-red-300 hover:text-red-900 transition-all duration-300"
            >
                Red Frame
            </button>
            <button
                onClick={() => setFrame('blue')}
                className="px-4 py-2 bg-blue-200 text-blue-700 rounded-lg shadow-md hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
            >
                Blue Frame
            </button>
            <button
                onClick={() => setFrame('green')}
                className="px-4 py-2 bg-green-200 text-green-700 rounded-lg shadow-md hover:bg-green-300 hover:text-green-900 transition-all duration-300"
            >
                Green Frame
            </button>
        </div>
    );
};

export default FrameToolbar;
