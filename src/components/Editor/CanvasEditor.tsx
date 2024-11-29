// components/CanvasEditor.tsx
import React, {useEffect, useState} from 'react';
import { useCanvas } from './hooks/useCanvas';
import { useStickerInteraction } from './hooks/useStickerInteraction';
import { useTextInteraction } from './hooks/useTextInteraction';
import { CanvasEditorProps, InteractionMode } from './types';

// CanvasEditor.tsx
export const CanvasEditor: React.FC<CanvasEditorProps> = ({
                                                              fileUrl,
                                                              filter,
                                                              frame,
                                                              stickers,
                                                              setStickers,
                                                              texts,
                                                              setTexts
                                                          }) => {
    // mode를 props로 받도록 수정
    const [mode, setMode] = useState<InteractionMode>('text'); // 디버깅을 위해 기본값을 'text'로 설정

    const {
        selectedStickerIndex,
        handleStickerInteraction,
        updateStickerPosition,
        resetInteraction: resetStickerInteraction
    } = useStickerInteraction({
        stickers,
        setStickers,
        mode
    });

    const {
        selectedTextIndex,
        handleTextInteraction,
        updateTextPosition,
        resetInteraction: resetTextInteraction
    } = useTextInteraction({
        texts,
        setTexts,
        mode
    });

    const { canvasRef } = useCanvas({
        fileUrl,
        filter,
        frame,
        stickers,
        texts,
        selectedStickerIndex,
        selectedTextIndex
    });

    // 스티커나 텍스트가 선택될 때 자동으로 모드 전환
    useEffect(() => {
        if (selectedStickerIndex !== null) {
            setMode('sticker');
        } else if (selectedTextIndex !== null) {
            setMode('text');
        }
    }, [selectedStickerIndex, selectedTextIndex]);

    const handlePointerEvent = (
        e: React.MouseEvent | React.TouchEvent,
        handler: (x: number, y: number) => void
    ) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const isTouchEvent = 'touches' in e;
        const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

        // 캔버스 상의 상대 좌표 계산
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);

        handler(x, y);
    };

    const handleInteraction = (x: number, y: number) => {
        // 텍스트 영역 클릭 체크를 먼저 수행
        const clickedTextIndex = texts.findIndex(text => {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return false;
            ctx.font = '24px Arial';
            const metrics = ctx.measureText(text.text);
            const textWidth = metrics.width;
            const textHeight = 24;

            return x >= text.x &&
                x <= text.x + textWidth &&
                y >= text.y - textHeight &&
                y <= text.y;
        });

        // 텍스트가 클릭되었다면 텍스트 모드로 전환
        if (clickedTextIndex !== -1) {
            setMode('text');
            handleTextInteraction(x, y);
            return;
        }

        // 스티커 모드로 전환하고 스티커 인터랙션 처리
        setMode('sticker');
        handleStickerInteraction(x, y);
    };

    // const handleMove = (x: number, y: number) => {
    //     if (mode === 'text' && selectedTextIndex !== null) {
    //         updateTextPosition(x, y);
    //     } else if (mode === 'sticker' && selectedStickerIndex !== null) {
    //         updateStickerPosition(x, y);
    //     }
    // };
    //
    // const handleReset = () => {
    //     if (mode === 'text') {
    //         resetTextInteraction();
    //     } else if (mode === 'sticker') {
    //         resetStickerInteraction();
    //     }
    // };

    // 모드 전환을 위한 버튼 추가 (디버깅용)
    return (
        <div className="relative w-full max-w-[800px] mx-auto">
            <canvas
                ref={canvasRef}
                className="border border-gray-300 rounded-md shadow-md w-full h-auto"
                onMouseDown={(e) => handlePointerEvent(e, handleInteraction)}
                onMouseMove={(e) => handlePointerEvent(e, mode === 'sticker' ? updateStickerPosition : updateTextPosition)}
                onMouseUp={mode === 'sticker' ? resetStickerInteraction : resetTextInteraction}
                onTouchStart={(e) => handlePointerEvent(e, handleInteraction)}
                onTouchMove={(e) => handlePointerEvent(e, mode === 'sticker' ? updateStickerPosition : updateTextPosition)}
                onTouchEnd={mode === 'sticker' ? resetStickerInteraction : resetTextInteraction}
            />
        </div>
    );
};

export default CanvasEditor;
