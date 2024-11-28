import React, { useEffect, useRef, useState } from 'react';

interface CanvasEditorProps {
    fileUrl: string;
    filter: string;
    frame: string;
    stickers: { src: string; x: number; y: number }[];
    setStickers: React.Dispatch<
        React.SetStateAction<{ src: string; x: number; y: number }[]>
    >;
    texts: { text: string; x: number; y: number }[];
    setTexts: React.Dispatch<
        React.SetStateAction<{ text: string; x: number; y: number }[]>
    >;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
                                                       fileUrl,
                                                       filter,
                                                       frame,
                                                       stickers,
                                                       setStickers,
                                                       texts,
                                                       setTexts,
                                                   }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null); // 캔버스 컨텍스트를 useRef로 관리
    const [draggingItem, setDraggingItem] = useState<{
        type: 'sticker' | 'text' | null;
        index: number | null;
    }>({ type: null, index: null });

    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctxRef.current = ctx; // 컨텍스트를 useRef에 저장

        const image = new Image();
        image.src = fileUrl;

        image.onload = () => {
            // 캔버스 크기 설정
            canvas.width = image.width;
            canvas.height = image.height;

            // 필터 적용
            ctx.filter = filter;
            ctx.drawImage(image, 0, 0);

            // 프레임 추가
            if (frame) {
                ctx.strokeStyle = frame; // 프레임 색상
                ctx.lineWidth = 10;
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
            }

            // 스티커 추가
            stickers.forEach((sticker) => {
                const stickerImg = new Image();
                stickerImg.src = sticker.src;
                stickerImg.onload = () => {
                    ctx.drawImage(stickerImg, sticker.x, sticker.y, 50, 50); // 스티커 크기 50x50
                };
            });

            // 텍스트 추가
            texts.forEach((textItem) => {
                ctx.font = '24px Arial';
                ctx.fillStyle = 'black';
                ctx.fillText(textItem.text, textItem.x, textItem.y);
            });
        };
    }, [fileUrl, filter, frame, stickers, texts]);

    // 마우스 다운 이벤트 핸들러
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current; // useRef로부터 컨텍스트 가져오기
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 스티커 확인
        const stickerIndex = stickers.findIndex(
            (sticker) =>
                x >= sticker.x &&
                x <= sticker.x + 50 && // 스티커 크기
                y >= sticker.y &&
                y <= sticker.y + 50,
        );

        if (stickerIndex !== -1) {
            setDraggingItem({ type: 'sticker', index: stickerIndex });
            setOffset({ x: x - stickers[stickerIndex].x, y: y - stickers[stickerIndex].y });
            return;
        }

        // 텍스트 확인
        const textIndex = texts.findIndex(
            (text) =>
                x >= text.x &&
                x <= text.x + ctx.measureText(text.text).width &&
                y >= text.y - 24 &&
                y <= text.y, // 텍스트 높이
        );

        if (textIndex !== -1) {
            setDraggingItem({ type: 'text', index: textIndex });
            setOffset({ x: x - texts[textIndex].x, y: y - texts[textIndex].y });
        }
    };

    // 마우스 이동 이벤트 핸들러
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!draggingItem.type) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (draggingItem.type === 'sticker' && draggingItem.index !== null) {
            const newStickers = [...stickers];
            newStickers[draggingItem.index] = {
                ...newStickers[draggingItem.index],
                x: x - offset.x,
                y: y - offset.y,
            };
            setStickers(newStickers);
        } else if (draggingItem.type === 'text' && draggingItem.index !== null) {
            const newTexts = [...texts];
            newTexts[draggingItem.index] = {
                ...newTexts[draggingItem.index],
                x: x - offset.x,
                y: y - offset.y,
            };
            setTexts(newTexts);
        }
    };

    // 마우스 업 이벤트 핸들러
    const handleMouseUp = () => {
        setDraggingItem({ type: null, index: null });
    };

    return (
        <div className="w-full flex flex-col items-center">
            <canvas
                ref={canvasRef}
                className="border-2 border-dashed border-gray-500 rounded-lg shadow-lg bg-white"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            ></canvas>
        </div>
    );
};

export default CanvasEditor;
