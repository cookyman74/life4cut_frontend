import React, { useState } from 'react';
import FilterToolbar from './Editor/FilterToolbar';
import FrameToolbar from './Editor/FrameToolbar';
import StickerToolbar from './Editor/StickerToolbar';
import TextToolbar from './Editor/TextToolbar';
import CanvasEditor from './Editor/CanvasEditor';

interface ImageEditorProps {
    fileUrl: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ fileUrl }) => {
    const [filter, setFilter] = useState<string>(''); // 필터 상태
    const [frame, setFrame] = useState<string>(''); // 프레임 상태
    const [stickers, setStickers] = useState<{ src: string; x: number; y: number }[]>([]); // 스티커 상태
    const [texts, setTexts] = useState<{ text: string; x: number; y: number }[]>([]); // 텍스트 상태
    const [activeTab, setActiveTab] = useState<'filter' | 'frame' | 'sticker' | 'text'>('filter'); // 활성 탭 상태

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            {/* Canvas 기반 편집기 */}
            <CanvasEditor
                fileUrl={fileUrl}
                filter={filter}
                frame={frame}
                stickers={stickers}
                setStickers={setStickers}
                texts={texts}
                setTexts={setTexts}
            />

            {/* 탭 카드 형태 */}
            <div className="w-full max-w-4xl">
                <div className="flex justify-around border-b-2 border-gray-300">
                    <button
                        onClick={() => setActiveTab('filter')}
                        className={`w-1/4 py-2 text-center ${
                            activeTab === 'filter'
                                ? 'border-b-4 border-blue-500 text-blue-600 font-semibold'
                                : 'text-gray-500'
                        }`}
                    >
                        Filter
                    </button>
                    <button
                        onClick={() => setActiveTab('frame')}
                        className={`w-1/4 py-2 text-center ${
                            activeTab === 'frame'
                                ? 'border-b-4 border-blue-500 text-blue-600 font-semibold'
                                : 'text-gray-500'
                        }`}
                    >
                        Frame
                    </button>
                    <button
                        onClick={() => setActiveTab('sticker')}
                        className={`w-1/4 py-2 text-center ${
                            activeTab === 'sticker'
                                ? 'border-b-4 border-blue-500 text-blue-600 font-semibold'
                                : 'text-gray-500'
                        }`}
                    >
                        Sticker
                    </button>
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`w-1/4 py-2 text-center ${
                            activeTab === 'text'
                                ? 'border-b-4 border-blue-500 text-blue-600 font-semibold'
                                : 'text-gray-500'
                        }`}
                    >
                        Text
                    </button>
                </div>

                {/* 탭 내용 */}
                <div className="p-4">
                    {activeTab === 'filter' && <FilterToolbar setFilter={setFilter} />}
                    {activeTab === 'frame' && <FrameToolbar setFrame={setFrame} />}
                    {activeTab === 'sticker' && (
                        <StickerToolbar stickers={stickers} setStickers={setStickers} />
                    )}
                    {activeTab === 'text' && <TextToolbar texts={texts} setTexts={setTexts} />}
                </div>
            </div>

            {/* 저장 및 취소 버튼 */}
            <div className="flex gap-4 mt-6">
                <button className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition">
                    Save Changes
                </button>
                <button className="px-8 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ImageEditor;
