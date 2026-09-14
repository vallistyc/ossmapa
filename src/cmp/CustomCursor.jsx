import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let animationFrame;
    let pointerPosition = { x: 0, y: 0 };
    let ringPosition = { x: 0, y: 0 };

    const renderCursor = () => {
      ringPosition = {
        x: ringPosition.x + (pointerPosition.x - ringPosition.x) * 0.14,
        y: ringPosition.y + (pointerPosition.y - ringPosition.y) * 0.14,
      };

      cursor.style.transform = `translate3d(${pointerPosition.x}px, ${pointerPosition.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPosition.x}px, ${ringPosition.y}px, 0)`;
      animationFrame = requestAnimationFrame(renderCursor);
    };

    const handlePointerMove = (event) => {
      pointerPosition = { x: event.clientX, y: event.clientY };
      document.body.classList.add("custom-cursor-visible");
    };

    const handlePointerOver = (event) => {
      const interactiveElement = event.target.closest("a, button, input, textarea, select");
      const darkSurface = event.target.closest("[data-cursor-theme='dark']");
      ring.classList.toggle("is-hovering", Boolean(interactiveElement));
      ring.classList.toggle("is-dark", Boolean(darkSurface));
      cursor.classList.toggle("is-dark", Boolean(darkSurface));
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerover", handlePointerOver);
    animationFrame = requestAnimationFrame(renderCursor);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      document.body.classList.remove("custom-cursor-visible");
    };
  }, []);

  return (
    <>
      <span ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      <span ref={cursorRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
