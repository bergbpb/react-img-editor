import React from 'react'
import { hot } from 'react-hot-loader/index'
interface Props {
    disabled?: boolean
    id?: string
    value: boolean
    label: string
    handleChange: (e: React.SetStateAction<unknown>) => void
}

export const CheckBox: React.FC<Props> = props => {
    const { value, label, handleChange, id, disabled } = props

    return (
        <div className='checkbox-container'>
            <label htmlFor='checkbox'>
                {label}
                <input
                    className='custom-checkbox checkbox'
                    id={id}
                    name='checkbox'
                    type='checkbox'
                    disabled={disabled}
                    checked={value ?? false}
                    onChange={e => {
                        handleChange(e)
                    }}
                />
            </label>
        </div>
    )
}

export default hot(module)(CheckBox)
