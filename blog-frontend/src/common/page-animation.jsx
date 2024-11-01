import React from 'react'
import { AnimatePresence , motion } from 'framer-motion'

const AnimationWrapper = ({children,initial = {opacity : 0},animate = {opacity:1} , keyvalue , transition={duration:1}, className}) => {
  return (
    <div>
        <AnimatePresence>
        <motion.div 
         key={keyvalue}
         initial={initial}
         animate={animate}
         transition={transition}
         className={className}
        >
          {children}
        </motion.div>
        </AnimatePresence>
    </div>
  )
}

export default AnimationWrapper
