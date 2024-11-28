import React from 'react';

type Sticker = {
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

interface StickerToolbarProps {
    stickers: Sticker[];
    setStickers: React.Dispatch<React.SetStateAction<Sticker[]>>;
}

const StickerToolbar: React.FC<StickerToolbarProps> = ({ stickers, setStickers }) => {
    const addSticker = (stickerSrc: string) => {
        const randomX = Math.random() * 200; // 임의의 위치
        const randomY = Math.random() * 200; // 임의의 위치
        const defaultSize = 50; // 기본 크기
        setStickers([
            ...stickers,
            { src: stickerSrc, x: randomX, y: randomY, width: defaultSize, height: defaultSize },
        ]);
    };

    return (
        <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-lg shadow">
            {/* 스티커 1 */}
            <button
                onClick={() => addSticker('/assets/stickers/mickey.png')}
                className="flex flex-col items-center px-4 py-2 hover:bg-gray-200 rounded-lg"
                aria-label="Add Mickey Sticker"
            >
                <img
                    src="/assets/stickers/mickey.png"
                    alt="Mickey"
                    className="w-10 h-10"
                />
                <span className="text-xs mt-2">Mickey</span>
            </button>

            {/* 스티커 2 */}
            <button
                onClick={() => addSticker('/assets/stickers/hi.png')}
                className="flex flex-col items-center px-4 py-2 hover:bg-gray-200 rounded-lg"
                aria-label="Add Hi Sticker"
            >
                <img
                    src="/assets/stickers/hi.png"
                    alt="Hi"
                    className="w-10 h-10"
                />
                <span className="text-xs mt-2">Hi</span>
            </button>

            {/* 스티커 3 */}
            <button
                onClick={() => addSticker('/assets/stickers/friends.png')}
                className="flex flex-col items-center px-4 py-2 hover:bg-gray-200 rounded-lg"
                aria-label="Add friends Sticker"
            >
                <img
                    src="/assets/stickers/friends.png"
                    alt="friends"
                    className="w-10 h-10"
                />
                <span className="text-xs mt-2">friends</span>
            </button>

            <button
                onClick={() => addSticker('/assets/stickers/heart.png')}
                className="flex flex-col items-center px-4 py-2 hover:bg-gray-200 rounded-lg"
                aria-label="Add Heart Sticker"
            >
                <img
                    src="/assets/stickers/heart.png"
                    alt="Heart"
                    className="w-10 h-10"
                />
                <span className="text-xs mt-2">Heart</span>
            </button>

            <button
                onClick={() => addSticker('/assets/stickers/circls.png')}
                className="flex flex-col items-center px-4 py-2 hover:bg-gray-200 rounded-lg"
                aria-label="Add circle Sticker"
            >
                <img
                    src="/assets/stickers/circls.png"
                    alt="circle"
                    className="w-10 h-30"
                />
                <span className="text-xs mt-2">Circle</span>
            </button>

            <button
                onClick={() => addSticker('/assets/stickers/flower.png')}
                className="flex flex-col items-center px-4 py-2 hover:bg-gray-200 rounded-lg"
                aria-label="Add flower Sticker"
            >
                <img
                    src="/assets/stickers/flower.png"
                    alt="circle"
                    className="w-10 h-30"
                />
                <span className="text-xs mt-2">flower</span>
            </button>
        </div>
    );
};

export default StickerToolbar;
