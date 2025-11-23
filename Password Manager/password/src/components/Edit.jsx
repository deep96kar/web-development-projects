import React from 'react'
import { motion, useAnimation } from 'motion/react'

const defaultTransition = { type: 'spring', stiffness: 200, damping: 18 }

const Edit = ({ width = 22, height = 22, stroke = '#065f46', onClick }) => {
  const controls = useAnimation()
  return (
    <div
      onMouseEnter={() => controls.start({ rotate: -6, scale: 1.03 })}
      onMouseLeave={() => controls.start({ rotate: 0, scale: 1 })}
      onClick={onClick}
      style={{ cursor: 'pointer', display: 'inline-flex', padding: 4, alignItems: 'center', justifyContent: 'center' }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={controls}
        transition={defaultTransition}
      >
        <path d="M3 21v-3a2 2 0 0 1 .59-1.41L17.34 2.83a2 2 0 0 1 2.83 0l.99.99a2 2 0 0 1 0 2.83L7.41 21.41A2 2 0 0 1 6 22H3z" />
        <path d="M14 7l3 3" />
      </motion.svg>
    </div>
  )
}

export default Edit
