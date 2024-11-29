import { useEffect, useRef } from 'react';
import { Sticker, TextItem } from '../types';

interface UseCanvasProps {
    fileUrl: string;
    filter: string;
    frame: string;
    stickers: Sticker[];
    texts: TextItem[];
    selectedStickerIndex: number | null;
    selectedTextIndex: number | null;
}

export const useCanvas = ({
                              fileUrl,
                              filter,
                              frame,
                              stickers,
                              texts,
                              selectedStickerIndex,
                              selectedTextIndex
                          }: UseCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

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
            canvas.width = canvas.parentElement!.clientWidth;
            canvas.height = canvas.width / aspectRatio;

            // 캔버스 렌더링
            renderCanvas(ctx, canvas, image);
        };
    }, [fileUrl, filter, frame, stickers, texts, selectedStickerIndex]);

    const renderCanvas = (
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        image: HTMLImageElement
    ) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderImage(ctx, canvas, image);
        renderFrame(ctx, canvas);
        renderStickers(ctx);
        renderTexts(ctx);
    };

    const renderImage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, image: HTMLImageElement) => {
        ctx.filter = filter;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    const renderFrame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        if (frame) {
            ctx.strokeStyle = frame;
            ctx.lineWidth = 10;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        }
    };

    const renderStickers = (ctx: CanvasRenderingContext2D) => {
        stickers.forEach((sticker, index) => {
            const stickerImg = new Image();
            stickerImg.src = sticker.src;
            stickerImg.onload = () => {
                ctx.drawImage(stickerImg, sticker.x, sticker.y, sticker.width, sticker.height);
                if (selectedStickerIndex === index) {
                    renderStickerSelection(ctx, sticker);
                }
            };
        });
    };

    const renderStickerSelection = (ctx: CanvasRenderingContext2D, sticker: Sticker) => {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);
        ctx.setLineDash([]);

        const handleSize = 10;
        const handles = [
            { x: sticker.x, y: sticker.y },
            { x: sticker.x + sticker.width, y: sticker.y },
            { x: sticker.x, y: sticker.y + sticker.height },
            { x: sticker.x + sticker.width, y: sticker.y + sticker.height },
        ];

        ctx.fillStyle = 'blue';
        handles.forEach((handle) => {
            ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
        });
    };

    const renderTexts = (ctx: CanvasRenderingContext2D) => {
        ctx.font = '24px Arial';

        texts.forEach((textItem, index) => {
            // 선택된 텍스트인 경우 하이라이트 표시
            if (index === selectedTextIndex) {
                const textWidth = ctx.measureText(textItem.text).width;
                ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
                ctx.fillRect(textItem.x, textItem.y - 24, textWidth, 24);
            }

            ctx.fillStyle = 'black';
            ctx.fillText(textItem.text, textItem.x, textItem.y);
        });
    };

    return { canvasRef, ctxRef };
};
