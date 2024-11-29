export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Sticker extends Position, Size {
    src: string;
}

export interface TextItem extends Position {
    text: string;
}

export interface CanvasEditorProps {
    fileUrl: string;
    filter: string;
    frame: string;
    stickers: Sticker[];
    setStickers: React.Dispatch<React.SetStateAction<Sticker[]>>;
    texts: TextItem[];
    setTexts: React.Dispatch<React.SetStateAction<TextItem[]>>;
}

export type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;
