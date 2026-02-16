
import { useState, useEffect } from 'react';
import { fetchDailyContent, getFallbackContent } from '../services/dailyContentService';

interface DailyContent {
    verse: { text: string; source: string; reflection: string };
    challenge: { title: string; description: string; icon: string; points: number };
    tip: string;
}

export function useDailyContent() {
    const [content, setContent] = useState<DailyContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);

            // Try API first
            const apiContent = await fetchDailyContent();

            if (!cancelled) {
                if (apiContent) {
                    setContent(apiContent);
                } else {
                    // Use fallback
                    setContent(getFallbackContent());
                }
                setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    return { content, isLoading };
}
