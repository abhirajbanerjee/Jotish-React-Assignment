// hooks/useCamera.js — Facade pattern: simplifies MediaDevices API into 3 function calls.
import { useRef, useCallback } from 'react';

export function useCamera() {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            return true;
        } catch (err) {
            console.error('Camera access denied:', err);
            return false;
        }
    }, []);

    const capture = useCallback(() => {
        if (!videoRef.current) return null;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        return canvas.toDataURL('image/png');
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, []);

    return { videoRef, startCamera, capture, stopCamera };
}
