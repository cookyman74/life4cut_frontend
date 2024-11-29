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
        console.log('Handling text interaction at:', x, y);

        const clickedTextIndex = texts.findIndex(text => {
            // 텍스트의 바운딩 박스 계산
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return false;
            ctx.font = '24px Arial';
            const metrics = ctx.measureText(text.text);
            const textWidth = metrics.width;
            const textHeight = 24; // 폰트 사이즈

            const hitBox = {
                x: text.x - 5,
                y: text.y - textHeight - 5,
                width: textWidth + 10,
                height: textHeight + 10
            };

            const isHit = x >= hitBox.x &&
                x <= hitBox.x + hitBox.width &&
                y >= hitBox.y &&
                y <= hitBox.y + hitBox.height;

            console.log('Text hit test:', text.text, isHit);
            return isHit;
        });

        console.log('Clicked text index:', clickedTextIndex);

        // 클릭된 텍스트가 있을 때
        if (clickedTextIndex !== -1) {
            // 이미 선택된 텍스트를 다시 클릭한 경우
            if (selectedTextIndex === clickedTextIndex) {
                setDragging(true);
                setOffset({
                    x: x - texts[clickedTextIndex].x,
                    y: y - texts[clickedTextIndex].y
                });
            } else {
                // 새로운 텍스트 선택
                setSelectedTextIndex(clickedTextIndex);
                setDragging(false);
            }
        } else {
            // 텍스트가 없는 영역 클릭 시 선택 해제
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
