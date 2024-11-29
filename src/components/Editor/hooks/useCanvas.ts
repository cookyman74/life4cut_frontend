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
        // Draw selection border
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);
        ctx.setLineDash([]);

        const handleSize = 10;

        // Draw delete button (top-left)
        ctx.fillStyle = 'red';
        ctx.fillRect(sticker.x - handleSize / 2, sticker.y - handleSize / 2, handleSize, handleSize);

        // Draw resize handle (bottom-right)
        ctx.fillStyle = 'blue';
        ctx.fillRect(
            sticker.x + sticker.width - handleSize / 2,
            sticker.y + sticker.height - handleSize / 2,
            handleSize,
            handleSize
        );
    };

    const renderTexts = (ctx: CanvasRenderingContext2D) => {
        ctx.font = '24px Arial';
        ctx.textBaseline = 'top'; // 텍스트 상단 정렬

        texts.forEach((textItem, index) => {
            const textWidth = ctx.measureText(textItem.text).width;
            const textHeight = 24;

            // 선택된 텍스트 렌더링
            if (index === selectedTextIndex) {
                // 점선 테두리
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.strokeRect(
                    textItem.x,
                    textItem.y - textHeight,
                    textWidth,
                    textHeight
                );
                ctx.setLineDash([]);

                // 삭제 버튼
                const handleSize = 10;
                ctx.fillStyle = 'red';
                ctx.fillRect(
                    textItem.x - handleSize + 5,
                    textItem.y - textHeight - handleSize + 5,
                    handleSize,
                    handleSize
                );
            }

            // 텍스트 렌더링
            ctx.fillStyle = 'black';
            ctx.fillText(textItem.text, textItem.x, textItem.y - textHeight);
        });
    };


    return { canvasRef, ctxRef };
};
