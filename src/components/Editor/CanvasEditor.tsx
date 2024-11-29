// components/CanvasEditor.tsx
import React from 'react';
import { useCanvas } from './hooks/useCanvas';
import { useStickerInteraction } from './hooks/useStickerInteraction';
import { CanvasEditorProps } from './types';

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
                                                              fileUrl,
                                                              filter,
                                                              frame,
                                                              stickers,
                                                              setStickers,
                                                              texts,
                                                              setTexts,
                                                          }) => {
    const { selectedStickerIndex, setSelectedStickerIndex, handleStickerInteraction, updateStickerPosition, resetInteraction } =
        useStickerInteraction({ stickers, setStickers });

    const { canvasRef } = useCanvas({
        fileUrl,
        filter,
        frame,
        stickers,
        texts,
        selectedStickerIndex,
    });

    const handlePointerEvent = (
        e: React.MouseEvent | React.TouchEvent,
        handler: (x: number, y: number) => void
    ) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const isTouchEvent = 'touches' in e;
        const x = isTouchEvent ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = isTouchEvent ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        handler(x, y);
    };

    const handleDoubleClick = (e: React.MouseEvent | React.TouchEvent) => {
        handlePointerEvent(e, (x, y) => {
            const clickedStickerIndex = stickers.findIndex(
                (sticker) =>
                    x >= sticker.x &&
                    x <= sticker.x + sticker.width &&
                    y >= sticker.y &&
                    y <= sticker.y + sticker.height
            );

            setSelectedStickerIndex(
                clickedStickerIndex !== -1 && clickedStickerIndex === selectedStickerIndex
                    ? null
                    : clickedStickerIndex
            );
        });
    };

    return (
        <div className="relative w-full max-w-[800px] mx-auto">
            <canvas
                ref={canvasRef}
                className="border border-gray-300 rounded-md shadow-md w-full h-auto"
                onMouseDown={(e) => handlePointerEvent(e, handleStickerInteraction)}
                onMouseMove={(e) => handlePointerEvent(e, updateStickerPosition)}
                onMouseUp={resetInteraction}
                onTouchStart={(e) => handlePointerEvent(e, handleStickerInteraction)}
                onTouchMove={(e) => handlePointerEvent(e, updateStickerPosition)}
                onTouchEnd={resetInteraction}
                onDoubleClick={handleDoubleClick}
            />
        </div>
    );
};

export default CanvasEditor;
