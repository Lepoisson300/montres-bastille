import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 60;

export default function FramePage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const frameStateRef = useRef({ frame: 0 }); // keep current frame value

    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            const frameNumber = String(i).padStart(3, "0"); // 0001, 0002...
            img.src = `/frames/ezgif-frame-${frameNumber}.jpg`;
            loadedImages.push(img);
        }

        setImages(loadedImages);
    }, []);

    useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      context.scale(dpr, dpr);
    };
    setCanvasSize();

    const render = () => {
      const frameIndex = frameStateRef.current.frame;
      const image = images[frameIndex];
      if (!image || !image.complete) return;

      const { innerWidth, innerHeight } = window;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, innerWidth, innerHeight);
    };

    // draw first frame
    render();

    // GSAP: tie scroll to frame
    const tween = gsap.to(frameStateRef.current, {
      frame: TOTAL_FRAMES - 1,
      snap: "frame",        // round to whole numbers so we index the array correctly [file:0]
      ease: "none",         // no easing between frames [file:0]
      scrollTrigger: {
        trigger: canvas,    // section element you want to control
        start: "top top",   // when top of trigger hits top of viewport [file:0]
        end: "bottom+=5000 top", // scroll distance; adjust as desired [file:0]
        scrub: true,        // bind animation progress to scroll position [file:0]
      },
      onUpdate: render,     // draw new frame every time `frame` changes [file:0]
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [images]);

    return (
        <section style={{ height: "5000px" }}>
        {/* Your text layout here */}
        <canvas ref={canvasRef} />
        </section>
    );
}