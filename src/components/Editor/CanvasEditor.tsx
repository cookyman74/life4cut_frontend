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
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null); // 캔버스 컨텍스트 관리
    const [selectedStickerIndex, setSelectedStickerIndex] = useState<number | null>(null); // 선택된 스티커
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // 스크롤 잠금/해제 관리
    useEffect(() => {
        if (selectedStickerIndex !== null) {
            document.body.style.overflow = 'hidden'; // 스크롤 잠금
        } else {
            document.body.style.overflow = ''; // 스크롤 해제
        }

        return () => {
            document.body.style.overflow = ''; // 컴포넌트 언마운트 시 스크롤 해제
        };
    }, [selectedStickerIndex]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctxRef.current = ctx; // 컨텍스트 저장

        const image = new Image();
        image.src = fileUrl;

        image.onload = () => {
            const aspectRatio = image.width / image.height;

            // 반응형 크기 설정
            canvas.width = canvas.parentElement!.clientWidth;
            canvas.height = canvas.width / aspectRatio;

            // 캔버스 초기화 및 렌더링
            renderCanvas(ctx, canvas, image);
        };
    }, [fileUrl, filter, frame, stickers, texts, selectedStickerIndex]);

    const renderCanvas = (
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        image: HTMLImageElement
    ) => {
        // 캔버스 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 필터 적용
        ctx.filter = filter;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // 프레임 추가
        if (frame) {
            ctx.strokeStyle = frame;
            ctx.lineWidth = 10;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        }

        // 스티커 렌더링
        stickers.forEach((sticker, index) => {
            const stickerImg = new Image();
            stickerImg.src = sticker.src;
            stickerImg.onload = () => {
                ctx.drawImage(stickerImg, sticker.x, sticker.y, 50, 50);

                // 선택된 스티커 강조
                if (selectedStickerIndex === index) {
                    ctx.strokeStyle = 'red'; // 강조 색상
                    ctx.lineWidth = 2;
                    ctx.setLineDash([4, 4]); // 점선
                    ctx.strokeRect(sticker.x, sticker.y, 50, 50);
                    ctx.setLineDash([]); // 점선 초기화
                }
            };
        });

        // 텍스트 렌더링
        texts.forEach((textItem) => {
            ctx.font = '24px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText(textItem.text, textItem.x, textItem.y);
        });
    };

    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (selectedStickerIndex === null) return; // 선택된 스티커가 없으면 이동 불가

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = isTouchEvent(e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = isTouchEvent(e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        const sticker = stickers[selectedStickerIndex];

        // 드래그 가능한지 확인
        if (
            x >= sticker.x &&
            x <= sticker.x + 50 &&
            y >= sticker.y &&
            y <= sticker.y + 50
        ) {
            setDragging(true);
            setOffset({ x: x - sticker.x, y: y - sticker.y });
        }
    };

    const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!dragging || selectedStickerIndex === null) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = isTouchEvent(e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = isTouchEvent(e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        const updatedStickers = [...stickers];
        updatedStickers[selectedStickerIndex] = {
            ...updatedStickers[selectedStickerIndex],
            x: x - offset.x,
            y: y - offset.y,
        };

        setStickers(updatedStickers);
    };

    const handlePointerUp = () => {
        setDragging(false);
    };

    const handleDoubleClick = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = isTouchEvent(e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = isTouchEvent(e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        const clickedStickerIndex = stickers.findIndex(
            (sticker) =>
                x >= sticker.x &&
                x <= sticker.x + 50 &&
                y >= sticker.y &&
                y <= sticker.y + 50
        );

        if (clickedStickerIndex !== -1) {
            if (selectedStickerIndex === clickedStickerIndex) {
                // 이미 선택된 상태라면 선택 해제
                setSelectedStickerIndex(null);
            } else {
                // 새로운 스티커 선택
                setSelectedStickerIndex(clickedStickerIndex);
            }
        } else {
            // 스티커가 아닌 영역을 더블 클릭하면 선택 해제
            setSelectedStickerIndex(null);
        }
    };

    const isTouchEvent = (e: any): e is React.TouchEvent => {
        return 'touches' in e;
    };

    return (
        <div className="relative w-full max-w-[800px] mx-auto">
            <canvas
                ref={canvasRef}
                className="border border-gray-300 rounded-md shadow-md w-full h-auto"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                onDoubleClick={handleDoubleClick}
            ></canvas>
        </div>
    );
};

export default CanvasEditor;
