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

        const handleSize = 10;

        // Check if the delete button is clicked
        if (selectedStickerIndex !== null) {
            const sticker = stickers[selectedStickerIndex];
            if (
                x >= sticker.x - handleSize / 2 &&
                x <= sticker.x + handleSize / 2 &&
                y >= sticker.y - handleSize / 2 &&
                y <= sticker.y + handleSize / 2
            ) {
                // Remove the sticker
                const updatedStickers = stickers.filter((_, index) => index !== selectedStickerIndex);
                setStickers(updatedStickers);
                setSelectedStickerIndex(null);
                return;
            }

            // Check if the resize handle is clicked
            if (
                x >= sticker.x + sticker.width - handleSize / 2 &&
                x <= sticker.x + sticker.width + handleSize / 2 &&
                y >= sticker.y + sticker.height - handleSize / 2 &&
                y <= sticker.y + sticker.height + handleSize / 2
            ) {
                setResizing(true);
                setResizeHandle('bottom-right');
                return;
            }
        }

        // Check if a sticker is clicked
        const clickedStickerIndex = stickers.findIndex(
            (sticker) =>
                x >= sticker.x &&
                x <= sticker.x + sticker.width &&
                y >= sticker.y &&
                y <= sticker.y + sticker.height
        );

        if (clickedStickerIndex !== -1) {
            setSelectedStickerIndex(clickedStickerIndex);
            setDragging(true);
            const sticker = stickers[clickedStickerIndex];
            setOffset({ x: x - sticker.x, y: y - sticker.y });
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

        if (resizing && resizeHandle === 'bottom-right') {
            updatedStickers[selectedStickerIndex] = {
                ...sticker,
                width: x - sticker.x,
                height: y - sticker.y,
            };
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
        resetInteraction,
    };
};

