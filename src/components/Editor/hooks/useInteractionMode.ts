import { useState } from 'react';

export type InteractionMode = 'sticker' | 'text' | null;

export const useInteractionMode = () => {
    const [mode, setMode] = useState<InteractionMode>(null);
    return { mode, setMode };
};
