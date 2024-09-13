import React, {
    useContext,
    useCallback,
    useState,
    FC,
    SetStateAction,
    Dispatch,
    useEffect,
} from 'react'
import { hot } from 'react-hot-loader/index'
import { isNull } from 'lodash'

import { ActionTypes, AppContext } from '../../store'

import { useInterval } from '../hooks'

interface SlideshowPops {
    handleSetHideViewer: Dispatch<SetStateAction<boolean>>
    handleSetIsFlyoutVisible: Dispatch<SetStateAction<boolean>>
    handleSetLightboxMode: Dispatch<SetStateAction<boolean>>
}

export const Slideshow: FC<SlideshowPops> = ({
    handleSetHideViewer,
    handleSetIsFlyoutVisible,
    handleSetLightboxMode,
}) => {
    const globalState = useContext(AppContext)
    const { dispatch, state } = globalState
    const [isSlideshowTimerStarted, setIsSlideshowTimerStarted] =
        useState(false)
    const [useCustomInterval, setUseCustomInterval] = useState(false)
    const [delayInputValue, setDelayInputValue] = useState<number | null>(null)
    const [delay, setDelay] = useState<number>(delayInputValue ?? 2000)

    const startTimer = useInterval(() => {
        dispatch({
            type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
            payload: {
                activeIndex: isNull(state.activeIndex)
                    ? 0
                    : state.activeIndex ===
                      (state.imageData && state.imageData.length - 1)
                    ? 0
                    : state.activeIndex + 1,
            },
        })
    }, delay)

    const handleTimer = useCallback(
        (value: boolean) => {
            // isSlideshowTimerStarted sets shouldStart boolean in useInterval hook
            startTimer(value)
            setIsSlideshowTimerStarted(value)
        },
        [isSlideshowTimerStarted]
    )

    useEffect(() => {
        if (isSlideshowTimerStarted) {
            handleSetHideViewer(true)
            handleSetIsFlyoutVisible(false)
            handleSetLightboxMode(false)

            return
        }

        handleSetHideViewer(false)
    }, [isSlideshowTimerStarted])

    return (
        <>
            <span className='sildeshow-container'>
                <span
                    className='slideshow-control'
                    onClick={() => handleTimer(true)}
                    style={{
                        display: isSlideshowTimerStarted ? 'none' : 'block',
                    }}
                >
                    <i className='fa-solid fa-circle-play' />
                </span>

                <span
                    className='slideshow-control'
                    onClick={() => handleTimer(false)}
                    style={{
                        display: isSlideshowTimerStarted ? 'block' : 'none',
                    }}
                >
                    <i className='fa-solid fa-circle-pause' />
                </span>

                <div
                    onClick={() => setUseCustomInterval(!useCustomInterval)}
                    className='input-container'
                >
                    <i className='fa-solid fa-edit' />
                </div>

                {useCustomInterval && (
                    <div className='custom-interval-wrapper'>
                        <input
                            type='number'
                            onChange={e => {
                                startTimer(false)
                                setIsSlideshowTimerStarted(false)
                                setDelayInputValue(parseInt(e.target.value, 10))
                            }}
                            value={delayInputValue ?? delay ?? ''}
                        />

                        <button
                            onClick={() =>
                                setDelay(delayInputValue ?? delay ?? '')
                            }
                        >
                            set
                        </button>
                    </div>
                )}
            </span>
        </>
    )
}

export default hot(module)(Slideshow)
