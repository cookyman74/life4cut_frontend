import React, { useState } from 'react';

interface TextToolbarProps {
    texts: { text: string; x: number; y: number }[];
    setTexts: React.Dispatch<
        React.SetStateAction<{ text: string; x: number; y: number }[]>
    >;
}

const TextToolbar: React.FC<TextToolbarProps> = ({ texts, setTexts }) => {
    const [inputText, setInputText] = useState<string>('');

    const addText = () => {
        if (inputText.trim() === '') return;

        // 기본 위치로 텍스트 추가
        setTexts([...texts, { text: inputText, x: 100, y: 100 }]);
        setInputText(''); // 입력 필드 초기화
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 shadow-md rounded-lg">
            {/* 텍스트 입력 필드 */}
            <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text"
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-lg"
            />

            {/* 텍스트 추가 버튼 */}
            <button
                onClick={addText}
                className="w-full max-w-md px-6 py-3 bg-blue-500 text-white text-lg rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300"
            >
                Add Text
            </button>
        </div>
    );
};

export default TextToolbar;
