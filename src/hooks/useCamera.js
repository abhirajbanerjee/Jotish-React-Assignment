// hooks/useCamera.js — Facade pattern: simplifies MediaDevices API into 3 function calls.
// Root cause of black screen: startCamera() runs BEFORE cameraActive=true, so the
// <video> element doesn't exist yet. We store the stream in a ref, then the callback
// ref attaches it the moment the <video> mounts, and explicitly calls play().
import { useRef, useCallback } from 'react';

export function useCamera() {
    const streamRef = useRef(null);
    const videoNodeRef = useRef(null); // holds the actual DOM node

    // React callback ref — called when the <video> node mounts or unmounts.
    const videoRef = useCallback((node) => {
        videoNodeRef.current = node;
        if (node && streamRef.current) {
            node.srcObject = streamRef.current;
            node.play().catch(() => { });
        }
    }, []);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            streamRef.current = stream;

            // If the video node is already mounted (rare but possible), attach immediately
            if (videoNodeRef.current) {
                videoNodeRef.current.srcObject = stream;
                await videoNodeRef.current.play().catch(() => { });
            }

            return true;
        } catch (err) {
            console.error('[useCamera] Access denied:', err);
            return false;
        }
    }, []);

    const capture = useCallback(() => {
        const video = videoNodeRef.current;
        if (!video) return null;
        const w = video.videoWidth || 640;
        const h = video.videoHeight || 480;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(video, 0, 0, w, h);
        return canvas.toDataURL('image/png');
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoNodeRef.current) {
            videoNodeRef.current.srcObject = null;
        }
    }, []);

    return { videoRef, startCamera, capture, stopCamera };
}
