import { useCallback, useEffect, useState, useRef, RefCallback } from 'react'
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// eslint-disable-next-line @typescript-eslint/ban-types
export function useInterval(callback: RefCallback<Function>, delay: number) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const savedCallback = useRef<Function | null>(null)

    const [start, setStart] = useState(false)

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if (start) {
            function tick() {
                savedCallback.current ? savedCallback.current() : null
            }

            if (delay !== null) {
                const id = setInterval(tick, delay)

                return () => clearInterval(id)
            }
        }
    }, [delay, start])

    const startTimer = useCallback((shouldStart: boolean) => {
        setStart(shouldStart)
    }, [])

    return startTimer
}

export const base64Mime = (encoded: string) => {
    let result = null

    if (typeof encoded !== 'string') {
        return result
    }

    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)

    if (mime && mime.length) {
        result = mime[1]
    }

    return result
}

export function useKeyPress(targetKey: string) {
    const [keyPressed, setKeyPressed] = useState(false)

    function downHandler({ key }: { key: string }) {
        if (key === targetKey) {
            setKeyPressed(true)
        }
    }

    const upHandler = ({ key }: { key: string }) => {
        if (key === targetKey) {
            setKeyPressed(false)
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', downHandler)

        window.addEventListener('keyup', upHandler)

        return () => {
            window.removeEventListener('keydown', downHandler)

            window.removeEventListener('keyup', upHandler)
        }
    }, [])

    return keyPressed
}
