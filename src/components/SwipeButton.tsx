import { createSignal } from "solid-js";
import "./SwipeButton.css";
import clsx from "clsx";

export function SwipeButton() {
    const [startX, setStartX] = createSignal(0);
    const [currentX, setCurrentX] = createSignal(0);
    const [confirmed, setConfirmed] = createSignal(false);
    let buttonRef: HTMLDivElement | undefined;

    const handleTouchStart = (e: TouchEvent) => {
        if (!confirmed()) {
            setStartX(e.touches[0].clientX);
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!confirmed()) {
            setCurrentX(e.touches[0].clientX);
        }
    };

    const handleTouchEnd = () => {
        if (buttonRef && !confirmed()) {
            const buttonWidth = buttonRef.offsetWidth;
            if (currentX() - startX() > buttonWidth * 0.5) {
                setConfirmed(true); // Confirm action
            }
            setCurrentX(0); // Reset swipe position if not confirmed
        }
    };

    const progress = () => {
        if (confirmed()) {
            return buttonRef?.offsetWidth || 0; // Full width if confirmed
        }
        return Math.max(currentX() - startX(), 0); // Only positive progress
    };

    return (
        <div
            ref={buttonRef}
            class="swipe-button bg-base-200 rounded-full p-1 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={(e) => handleTouchStart(e as unknown as TouchEvent)}
            onMouseMove={(e) => handleTouchMove(e as unknown as TouchEvent)}
            onMouseUp={handleTouchEnd}
        >
            <div
                class={clsx("min-w-20 swipe-overlay h-full transition-all duration-300", confirmed() ? "bg-success" : "bg-primary")}
                style={{
                    width: `${progress()}px`, // The width is now dynamic based on swipe progress
                }}
            >
                {confirmed() ? "Zielort bestätigt" : ""}
            </div>
            <span class="text-base-content flex items-center justify-center">
                {confirmed() ? "" : "Zielort bestätigen"}
            </span>
        </div>
    );
}
