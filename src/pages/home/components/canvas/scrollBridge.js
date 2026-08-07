// Shared bridge between the DOM project links (Tab focus) and the WebGL scroller.
// Module-level so R3F's useFrame can read it without React re-renders.

let targetScrollIndex = null

export const PROJECT_COUNT = 4

/** @param {number | null} index — scroll slot 0..PROJECT_COUNT-1 matching the overlay nav order */
export const setScrollTarget = (index) => {
    targetScrollIndex = index
}

export const clearScrollTarget = () => {
    targetScrollIndex = null
}

export const getScrollTarget = () => targetScrollIndex

/** Shortest signed delta on a circular 0..count-1 range */
export const circularDelta = (from, to, count = PROJECT_COUNT) => {
    let diff = to - from
    const half = count / 2

    if (diff > half) diff -= count
    if (diff < -half) diff += count

    return diff
}
