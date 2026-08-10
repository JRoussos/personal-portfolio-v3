import { useState, useEffect } from "react";

export default function usePrefersReducedMotion() {
    const [reducedMotion, setReducedMotion] = useState(() => (
        typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ))

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        const onChange = (event) => setReducedMotion(event.matches)

        media.addEventListener('change', onChange)
        return () => media.removeEventListener('change', onChange)
    }, [])

    return reducedMotion
}
