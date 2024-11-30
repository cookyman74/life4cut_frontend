import React from 'react';

interface FilterToolbarProps {
    setFilter: (filter: string) => void;
}

const FilterToolbar: React.FC<FilterToolbarProps> = ({ setFilter }) => {
    return (
        <div className="flex gap-4 justify-center p-4">
            <button
                onClick={() => setFilter('none')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 hover:text-gray-900 transition-all duration-300"
            >
                No Filter
            </button>
            <button
                onClick={() => setFilter('grayscale(100%)')}
                className="px-4 py-2 bg-blue-200 text-blue-700 rounded-lg shadow-md hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
            >
                Grayscale
            </button>
            <button
                onClick={() => setFilter('brightness(150%)')}
                className="px-4 py-2 bg-yellow-200 text-yellow-700 rounded-lg shadow-md hover:bg-yellow-300 hover:text-yellow-900 transition-all duration-300"
            >
                Brightness
            </button>
            <button
                onClick={() => setFilter('contrast(200%)')}
                className="px-4 py-2 bg-green-200 text-green-700 rounded-lg shadow-md hover:bg-green-300 hover:text-green-900 transition-all duration-300"
            >
                Contrast
            </button>
        </div>
    );
};

export default FilterToolbar;
