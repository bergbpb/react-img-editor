import React, {
    Dispatch,
    FC,
    SetStateAction,
    useContext,
    useState,
} from 'react'
import { hot } from 'react-hot-loader/index'
import {
    cloneDeep,
    forEach,
    filter,
    first,
    includes,
    isEmpty,
    isNil,
    map,
    shuffle,
    size,
    compact,
    random,
} from 'lodash'

import {
    Action,
    AppContext,
    CollectionImageData,
    defaultFilterState,
} from '../../../store'

import CheckBox from '../../page_elements/CheckBox'
import ThumbNailImage from '../../page_elements/ThumbNailImage'

import { ActionTypes } from '../../../store'

export const convertBase64 = (file: Blob) => {
    return new Promise<{ base64: string | ArrayBuffer | null }>(
        (res, reject) => {
            const fileReader = new FileReader()

            fileReader.onerror = error => {
                reject(error)
            }

            fileReader.onload = () => {
                res({ base64: fileReader.result })
            }

            file && fileReader.readAsDataURL(file)
        }
    )
}

export const convertJSON = (
    file: File | undefined
): Promise<{ JSON: string | ArrayBuffer | null }> => {
    return new Promise((res, reject) => {
        const fileReader = new FileReader()

        fileReader.onerror = error => {
            reject(error)
        }

        fileReader.onload = () => {
            res({ JSON: fileReader.result })
        }

        file && fileReader.readAsText(file)
    })
}

export const uploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    dispatch: React.Dispatch<Action>
) => {
    if (event.target.files && event.target.files.length > 0) {
        if (first(event.target.files)?.type === 'application/json') {
            const jsonData = event.target.files
                ? await convertJSON(first(event.target.files))
                : null

            const imageData =
                jsonData?.JSON && JSON.parse(jsonData.JSON as string).imageData

            const mappedArray = map(imageData, (image, index) => {
                const isVideo = !isNil(image.image.videoSrc)

                return {
                    className: 'image',
                    imgSrc: isVideo
                        ? 'video/video-default.jpg'
                        : image.image.imgSrc,
                    imgFilters: defaultFilterState,
                    navIndex: null,
                    videoSrc: image.image.videoSrc,
                    orientation: isVideo
                        ? 'landscape'
                        : image.image.orientation,
                    imgId: `imageId_${index}`,
                }
            })

            dispatch({
                type: ActionTypes.SET_IMAGE_DATA,
                payload: {
                    imageData: mappedArray,
                    activeIndex: 0,
                },
            })
        } else {
            const newImagesPromises: Promise<{
                base64: string | ArrayBuffer | null
            }>[] = []

            forEach(event.target.files, file =>
                newImagesPromises.push(convertBase64(file))
            )

            const newImages = await Promise.all(newImagesPromises)
            const mappedArray = map(newImages, (image, index) => {
                const isVideo = includes(
                    image.base64 as string,
                    'data:video/mp4'
                )

                return {
                    className: 'image',
                    imgSrc: isVideo ? 'video/video-default.jpg' : image.base64,
                    imgFilters: defaultFilterState,
                    videoSrc: isVideo ? image.base64 : null,
                    orientation: isVideo ? 'landscape' : 'portrait',
                    imgId: `imageId_${random(100_000)}`,
                    navIndex: null,
                }
            })

            dispatch({
                type: ActionTypes.SET_IMAGE_DATA,
                payload: {
                    imageData: mappedArray,
                    activeIndex: 0,
                },
            })
        }
    }
}
interface ContentManagerProps {
    createImg: () => void
    hideCheckboxes: boolean
    setIsCreateCollageCheckboxChecked: Dispatch<SetStateAction<boolean>>
    setUseDefaultImageData: Dispatch<SetStateAction<boolean>>
    useDefaultImageData: boolean
    isCreateCollageCheckboxChecked: boolean
}

export const ContentManager: FC<ContentManagerProps> = ({
    createImg,
    isCreateCollageCheckboxChecked,
    hideCheckboxes,
    setIsCreateCollageCheckboxChecked,
}) => {
    const globalState = useContext(AppContext)

    const { dispatch, state } = globalState

    const [isUploadCheckboxChecked, setIsUploadCheckboxChecked] =
        useState<boolean>(false)

    const [collageState, setCollageState] = useState<
        CollectionImageData[] | null
    >(null)

    const [
        isShuffleImageDataCheckboxChecked,
        setIsShuffleImageDataCheckboxChecked,
    ] = useState(!isNil(state.shuffledImageData))

    const handleRemoveCollageImage = (index: number | null) => {
        dispatch({
            type: ActionTypes.REMOVE_IMAGE_FROM_COLLAGE,
            payload: {
                collageIndex: index,
            },
        })
    }

    const checkedHandler = (imgId: string) => {
        setCollageState(prev => {
            const existingCollageItem = filter(
                prev,
                item => item.imgId === imgId
            )[0]
            const _data = isNil(state.shuffledImageData)
                ? state.imageData ?? []
                : state.shuffledImageData ?? []
            const _image = first(filter(_data, image => image.imgId === imgId))

            const prevData =
                // remove the item from state if it already exists, otherwise add it
                compact(
                    size(existingCollageItem) > 0
                        ? prev?.filter(
                              value => value.imgId !== existingCollageItem.imgId
                          )
                        : [...(prev ?? []), _image]
                )

            const newCollageState = [...prevData]

            return newCollageState
        })
    }

    const renderCollageThumbnails = () => {
        const _data = isNil(state.shuffledImageData)
            ? state.imageData ?? []
            : state.shuffledImageData ?? []
        return _data.map((item, index) => {
            return includes(item.imgSrc as string, 'video-default') ? (
                <></>
            ) : (
                <div
                    className='collage-input-wrapper'
                    key={`collage-${item.imgId}-${index}`}
                >
                    <div className='input-container'>
                        <CheckBox
                            label=''
                            id={`collage-thumbnail-${index}`}
                            value={includes(collageState, item)}
                            handleChange={() =>
                                checkedHandler(item.imgId as string)
                            }
                        />
                    </div>

                    <ThumbNailImage
                        handleClick={() => checkedHandler(item.imgId as string)}
                        imgId={_data.length}
                        imgClass={item.imgClass}
                        imgSrc={item.imgSrc as string}
                        orientation={item.orientation as string}
                    />
                </div>
            )
        })
    }

    return (
        <div className='content-manager-header'>
            <form action=''>
                <div className='upload-wrapper'>
                    <div className='file-upload-wrapper'>
                        <div className='input-container'>
                            <CheckBox
                                label={'upload'}
                                value={isUploadCheckboxChecked}
                                handleChange={() =>
                                    setIsUploadCheckboxChecked(
                                        !isUploadCheckboxChecked
                                    )
                                }
                            />
                        </div>

                        {isUploadCheckboxChecked && (
                            <div className='file-upload-placeholder-container'>
                                <div className='file-upload-container'>
                                    <label
                                        htmlFor='fileUpload'
                                        className='file-upload-label'
                                    >
                                        <input
                                            className='file-upload'
                                            id='fileUpload'
                                            onChange={event =>
                                                uploadImage(
                                                    event,
                                                    dispatch
                                                ).then(() =>
                                                    setIsUploadCheckboxChecked(
                                                        false
                                                    )
                                                )
                                            }
                                            multiple
                                            name='fileUpload'
                                            type='file'
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {
                        <>
                            {hideCheckboxes ? (
                                <></>
                            ) : (
                                <>
                                    <div className='input-container'>
                                        <CheckBox
                                            handleChange={() => {
                                                const _data = cloneDeep(
                                                    state.imageData
                                                )
                                                setIsShuffleImageDataCheckboxChecked(
                                                    !isShuffleImageDataCheckboxChecked
                                                ),
                                                    dispatch({
                                                        type: ActionTypes.SHUFFLE_IMAGE_DATA,
                                                        payload: {
                                                            shuffledImageData:
                                                                state.shuffledImageData
                                                                    ? null
                                                                    : shuffle(
                                                                          _data
                                                                      ),
                                                        },
                                                    })
                                            }}
                                            value={
                                                isShuffleImageDataCheckboxChecked
                                            }
                                            label={'shuffle'}
                                        />
                                    </div>

                                    <div className='input-container'>
                                        <CheckBox
                                            value={
                                                isCreateCollageCheckboxChecked
                                            }
                                            label={'collage'}
                                            handleChange={() =>
                                                setIsCreateCollageCheckboxChecked(
                                                    !isCreateCollageCheckboxChecked
                                                )
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    }
                </div>
            </form>

            {isCreateCollageCheckboxChecked && (
                <div className='collage-selector-container'>
                    {renderCollageThumbnails()}
                    <button
                        onClick={() => {
                            dispatch({
                                type: ActionTypes.SET_COLLAGE_IMAGE_DATA,
                                payload: { collageImageData: collageState },
                            })
                            setIsCreateCollageCheckboxChecked(false)
                            setCollageState(null)
                        }}
                    >
                        submit
                    </button>
                </div>
            )}

            {size(state.collageImageData) > 0 && (
                <div className='collage-wrapper'>
                    <span className='collage-images-label'>collage images</span>

                    <div className='collage-dashboard'>
                        <span>
                            {map(state.collageImageData, (img, index) => {
                                return (
                                    <div
                                        key={index}
                                        id={`collage-image-${index}`}
                                        className={'collage-thumbnail-img'}
                                    >
                                        <span className='image-and-label'>
                                            <ThumbNailImage
                                                imgId={parseInt(`${img.imgId}`)}
                                                imgSrc={img.imgSrc as string}
                                                orientation={'landscape'}
                                            />
                                            {`\u00A0\u00A0${
                                                img.imgId as string
                                            }\u00A0\u00A0`}
                                        </span>
                                        <span
                                            onClick={() =>
                                                handleRemoveCollageImage(index)
                                            }
                                            className='remove-img-icon'
                                        >
                                            <i className='fa fa-xmark' />
                                        </span>
                                    </div>
                                )
                            })}
                        </span>

                        <button
                            onClick={() => {
                                dispatch({
                                    type: ActionTypes.CLEAR_COLLAGE_IMAGE_DATA,
                                    payload: { collageImageData: null },
                                })
                            }}
                        >
                            clear
                        </button>

                        <button onClick={() => createImg()}>screenshot</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default hot(module)(ContentManager)
