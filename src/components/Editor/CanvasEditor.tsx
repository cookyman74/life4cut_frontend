import React, { useEffect, useRef, useState } from 'react';

interface CanvasEditorProps {
    fileUrl: string;
    filter: string;
    frame: string;
    stickers: { src: string; x: number; y: number; width: number; height: number }[];
    setStickers: React.Dispatch<
        React.SetStateAction<{ src: string; x: number; y: number; width: number; height: number }[]>
    >;
    texts: { text: string; x: number; y: number }[];
    setTexts: React.Dispatch<
        React.SetStateAction<{ text: string; x: number; y: number }[]>
    >;
}

type Sticker = {
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

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
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [selectedStickerIndex, setSelectedStickerIndex] = useState<number | null>(null);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctxRef.current = ctx;

        const image = new Image();
        image.src = fileUrl;

        image.onload = () => {
            const aspectRatio = image.width / image.height;

            // 반응형 크기 설정
            canvas.width = canvas.parentElement!.clientWidth;
            canvas.height = canvas.width / aspectRatio;

            // 캔버스 렌더링
            renderCanvas(ctx, canvas, image);
        };
    }, [fileUrl, filter, frame, stickers, texts, selectedStickerIndex]);

    // 화면 스크롤 제어
    useEffect(() => {
        if (selectedStickerIndex !== null) {
            // 편집 모드 활성화 시 스크롤 비활성화
            document.body.style.overflow = 'hidden';
        } else {
            // 편집 모드 비활성화 시 스크롤 복원
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = ''; // 컴포넌트 언마운트 시 복원
        };
    }, [selectedStickerIndex]);

    const renderCanvas = (
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        image: HTMLImageElement
    ) => {
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
                ctx.drawImage(stickerImg, sticker.x, sticker.y, sticker.width, sticker.height);
                if (selectedStickerIndex === index) {
                    // 스티커 선택 시 점선과 크기 조절 핸들 표시
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([4, 4]); // 점선
                    ctx.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);
                    ctx.setLineDash([]);

                    // 크기 조절 핸들
                    const handleSize = 10;
                    const handles = [
                        { x: sticker.x, y: sticker.y }, // top-left
                        { x: sticker.x + sticker.width, y: sticker.y }, // top-right
                        { x: sticker.x, y: sticker.y + sticker.height }, // bottom-left
                        { x: sticker.x + sticker.width, y: sticker.y + sticker.height }, // bottom-right
                    ];

                    ctx.fillStyle = 'blue';
                    handles.forEach((handle) => {
                        ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
                    });
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
        if (selectedStickerIndex === null) return;

        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = isTouchEvent(e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = isTouchEvent(e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        const sticker = stickers[selectedStickerIndex];

        // 핸들 확인
        const handleSize = 10;
        const handles = [
            { x: sticker.x, y: sticker.y, name: 'top-left' },
            { x: sticker.x + sticker.width, y: sticker.y, name: 'top-right' },
            { x: sticker.x, y: sticker.y + sticker.height, name: 'bottom-left' },
            { x: sticker.x + sticker.width, y: sticker.y + sticker.height, name: 'bottom-right' },
        ] as const;

        for (const handle of handles) {
            if (
                x >= handle.x - handleSize / 2 &&
                x <= handle.x + handleSize / 2 &&
                y >= handle.y - handleSize / 2 &&
                y <= handle.y + handleSize / 2
            ) {
                setResizing(true);
                setResizeHandle(handle.name);
                return;
            }
        }

        // 드래그 가능 여부 확인
        if (
            x >= sticker.x &&
            x <= sticker.x + sticker.width &&
            y >= sticker.y &&
            y <= sticker.y + sticker.height
        ) {
            setDragging(true);
            setOffset({ x: x - sticker.x, y: y - sticker.y });
        }
    };

    const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!dragging && !resizing) return;

        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = isTouchEvent(e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = isTouchEvent(e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        if (dragging && selectedStickerIndex !== null) {
            const updatedStickers = [...stickers];
            updatedStickers[selectedStickerIndex] = {
                ...updatedStickers[selectedStickerIndex],
                x: x - offset.x,
                y: y - offset.y,
            };
            setStickers(updatedStickers);
        }

        if (resizing && selectedStickerIndex !== null) {
            const updatedStickers = [...stickers];
            const sticker = updatedStickers[selectedStickerIndex];

            switch (resizeHandle) {
                case 'top-left':
                    sticker.width += sticker.x - x;
                    sticker.height += sticker.y - y;
                    sticker.x = x;
                    sticker.y = y;
                    break;
                case 'top-right':
                    sticker.width = x - sticker.x;
                    sticker.height += sticker.y - y;
                    sticker.y = y;
                    break;
                case 'bottom-left':
                    sticker.width += sticker.x - x;
                    sticker.height = y - sticker.y;
                    sticker.x = x;
                    break;
                case 'bottom-right':
                    sticker.width = x - sticker.x;
                    sticker.height = y - sticker.y;
                    break;
            }

            setStickers(updatedStickers);
        }
    };

    const handlePointerUp = () => {
        setDragging(false);
        setResizing(false);
        setResizeHandle(null);
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
                x <= sticker.x + sticker.width &&
                y >= sticker.y &&
                y <= sticker.y + sticker.height
        );

        if (clickedStickerIndex !== -1) {
            if (selectedStickerIndex === clickedStickerIndex) {
                setSelectedStickerIndex(null); // 선택 해제
            } else {
                setSelectedStickerIndex(clickedStickerIndex); // 스티커 선택
            }
        } else {
            setSelectedStickerIndex(null); // 다른 영역 클릭 시 선택 해제
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
