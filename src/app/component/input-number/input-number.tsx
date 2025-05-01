import React from 'react'

type NumberInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export default function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
}: NumberInputProps) {
  return (
    <div className={`${className}`}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className=" text-black border-2 w-full rounded-md px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  )
}
