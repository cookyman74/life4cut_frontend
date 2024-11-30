import {useEffect, useState} from 'react';
import { TextItem, Position, InteractionMode } from '../types';

interface UseTextInteractionProps {
    texts: TextItem[];
    setTexts: React.Dispatch<React.SetStateAction<TextItem[]>>;
    mode: InteractionMode;
}

export const useTextInteraction = ({ texts, setTexts, mode }: UseTextInteractionProps) => {
    const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });

    const handleTextInteraction = (x: number, y: number) => {
        const handleSize = 10;

        // 삭제 버튼 클릭 확인
        if (selectedTextIndex !== null) {
            const selectedText = texts[selectedTextIndex];
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return;

            ctx.font = '24px Arial';
            const textHeight = 24;

            const deleteButtonX = selectedText.x;
            const deleteButtonY = selectedText.y - textHeight;

            if (
                x >= deleteButtonX &&
                x <= deleteButtonX + handleSize &&
                y >= deleteButtonY &&
                y <= deleteButtonY + handleSize
            ) {
                // 텍스트 삭제
                const updatedTexts = texts.filter((_, index) => index !== selectedTextIndex);
                setTexts(updatedTexts);
                setSelectedTextIndex(null);
                return;
            }
        }

        // 텍스트 클릭 확인
        const clickedTextIndex = texts.findIndex((text) => {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return false;

            ctx.font = '24px Arial';
            const textWidth = ctx.measureText(text.text).width;
            const textHeight = 24;

            return (
                x >= text.x &&
                x <= text.x + textWidth &&
                y >= text.y - textHeight &&
                y <= text.y
            );
        });

        if (clickedTextIndex !== -1) {
            setSelectedTextIndex(clickedTextIndex);
            setDragging(true);
            setOffset({
                x: x - texts[clickedTextIndex].x,
                y: y - texts[clickedTextIndex].y,
            });
        } else {
            setSelectedTextIndex(null);
            setDragging(false);
        }
    };

    const updateTextPosition = (x: number, y: number) => {
        if (!dragging || selectedTextIndex === null) return;

        const updatedTexts = [...texts];
        updatedTexts[selectedTextIndex] = {
            ...updatedTexts[selectedTextIndex],
            x: x - offset.x,
            y: y - offset.y
        };

        setTexts(updatedTexts);
    };

    const resetInteraction = () => {
        setDragging(false);
    };

    // 디버깅을 위한 useEffect 추가
    useEffect(() => {
        console.log('Selected text index changed:', selectedTextIndex);
    }, [selectedTextIndex]);

    return {
        selectedTextIndex,
        setSelectedTextIndex,
        handleTextInteraction,
        updateTextPosition,
        resetInteraction
    };
};
