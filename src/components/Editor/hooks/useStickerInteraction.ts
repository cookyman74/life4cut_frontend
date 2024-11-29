import { useState } from 'react';
import { Position, ResizeHandle, Sticker, InteractionMode } from '../types';

interface UseStickerInteractionProps {
    stickers: Sticker[];
    setStickers: React.Dispatch<React.SetStateAction<Sticker[]>>;
    mode: InteractionMode;
}

export const useStickerInteraction = ({ stickers, setStickers, mode }: UseStickerInteractionProps) => {
    const [selectedStickerIndex, setSelectedStickerIndex] = useState<number | null>(null);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);

    const handleStickerInteraction = (x: number, y: number) => {
        if (mode !== 'sticker') return;

        // 현재 선택된 스티커가 있는 경우, 먼저 리사이즈 핸들 체크
        if (selectedStickerIndex !== null) {
            const sticker = stickers[selectedStickerIndex];
            const handleSize = 10;

            const handles = [
                { x: sticker.x, y: sticker.y, name: 'top-left' as const },
                { x: sticker.x + sticker.width, y: sticker.y, name: 'top-right' as const },
                { x: sticker.x, y: sticker.y + sticker.height, name: 'bottom-left' as const },
                { x: sticker.x + sticker.width, y: sticker.y + sticker.height, name: 'bottom-right' as const }
            ];

            // 리사이즈 핸들 체크
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
        }

        // 스티커 클릭 체크
        const clickedStickerIndex = stickers.findIndex(
            sticker =>
                x >= sticker.x &&
                x <= sticker.x + sticker.width &&
                y >= sticker.y &&
                y <= sticker.y + sticker.height
        );

        if (clickedStickerIndex !== -1) {
            if (selectedStickerIndex === clickedStickerIndex) {
                // 이미 선택된 스티커를 다시 클릭한 경우 드래그 시작
                setDragging(true);
                setOffset({ x: x - stickers[clickedStickerIndex].x, y: y - stickers[clickedStickerIndex].y });
            } else {
                // 새로운 스티커 선택
                setSelectedStickerIndex(clickedStickerIndex);
            }
        } else {
            // 빈 영역 클릭
            setSelectedStickerIndex(null);
        }
    };

    const updateStickerPosition = (x: number, y: number) => {
        if (!dragging && !resizing) return;
        if (selectedStickerIndex === null) return;

        const updatedStickers = [...stickers];
        const sticker = updatedStickers[selectedStickerIndex];

        if (dragging) {
            updatedStickers[selectedStickerIndex] = {
                ...sticker,
                x: x - offset.x,
                y: y - offset.y,
            };
        }

        if (resizing && resizeHandle) {
            switch (resizeHandle) {
                case 'top-left':
                    updatedStickers[selectedStickerIndex] = {
                        ...sticker,
                        width: sticker.width + (sticker.x - x),
                        height: sticker.height + (sticker.y - y),
                        x,
                        y
                    };
                    break;
                case 'top-right':
                    updatedStickers[selectedStickerIndex] = {
                        ...sticker,
                        width: x - sticker.x,
                        height: sticker.height + (sticker.y - y),
                        y
                    };
                    break;
                case 'bottom-left':
                    updatedStickers[selectedStickerIndex] = {
                        ...sticker,
                        width: sticker.width + (sticker.x - x),
                        height: y - sticker.y,
                        x
                    };
                    break;
                case 'bottom-right':
                    updatedStickers[selectedStickerIndex] = {
                        ...sticker,
                        width: x - sticker.x,
                        height: y - sticker.y
                    };
                    break;
            }
        }

        setStickers(updatedStickers);
    };

    const resetInteraction = () => {
        setDragging(false);
        setResizing(false);
        setResizeHandle(null);
    };

    return {
        selectedStickerIndex,
        setSelectedStickerIndex,
        handleStickerInteraction,
        updateStickerPosition,
        resetInteraction
    };
};
