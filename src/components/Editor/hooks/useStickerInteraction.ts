import { useState } from 'react';
import { Position, ResizeHandle, Sticker } from '../types';

interface UseStickerInteractionProps {
    stickers: Sticker[];
    setStickers: React.Dispatch<React.SetStateAction<Sticker[]>>;
}

export const useStickerInteraction = ({ stickers, setStickers }: UseStickerInteractionProps) => {
    const [selectedStickerIndex, setSelectedStickerIndex] = useState<number | null>(null);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);

    const handleStickerInteraction = (x: number, y: number) => {
        // 클릭된 위치에 스티커가 있는지 확인
        const clickedStickerIndex = stickers.findIndex(
            sticker =>
                x >= sticker.x &&
                x <= sticker.x + sticker.width &&
                y >= sticker.y &&
                y <= sticker.y + sticker.height
        );

        // 클릭된 스티커가 있고, 이미 선택된 스티커가 있는 경우
        if (selectedStickerIndex !== null) {
            const sticker = stickers[selectedStickerIndex];
            const handleSize = 10;

            // 핸들 검사
            const handles: Array<{ x: number; y: number; name: ResizeHandle }> = [
                { x: sticker.x, y: sticker.y, name: 'top-left' },
                { x: sticker.x + sticker.width, y: sticker.y, name: 'top-right' },
                { x: sticker.x, y: sticker.y + sticker.height, name: 'bottom-left' },
                { x: sticker.x + sticker.width, y: sticker.y + sticker.height, name: 'bottom-right' }
            ];

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

            // 드래그 검사
            if (
                x >= sticker.x &&
                x <= sticker.x + sticker.width &&
                y >= sticker.y &&
                y <= sticker.y + sticker.height
            ) {
                setDragging(true);
                setOffset({ x: x - sticker.x, y: y - sticker.y });
                return;
            }
        }

        // 새로운 스티커 선택 또는 선택 해제
        if (clickedStickerIndex !== -1) {
            setSelectedStickerIndex(clickedStickerIndex);
        } else {
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
