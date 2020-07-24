import React, { useState, useContext, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'

import { Context } from './Provider'

import { DropdownSection } from './Section'

const refDuration = .22

export function DropdownRoot() {
  const { options, targetId, cacheId, getOptionsById } = useContext(Context)

  const cachedOption = useMemo(() => getOptionsById(cacheId), [cacheId, getOptionsById])

  let [width, height, x] = [0, 0, 0]

  if (cachedOption) {
    const { optionCenterX, optionDimensions } = cachedOption

    width = optionDimensions?.width
    height = optionDimensions?.height
    x = optionCenterX - width / 2
  }

  const [hovering, setHovering] = useState(false)

  const isActive = targetId !== null || hovering

  const [hasInteracted, setHasInteracted] = useState(false)
  const isFirstInteraction = isActive && !hasInteracted

  if (isFirstInteraction) {
    setTimeout(() => {
      if (!hasInteracted) setHasInteracted(true)
    }, 15);
  }

  useEffect(() => {
    if (isActive) return
    let timeout = setTimeout(() => setHasInteracted(false), refDuration * 1000 * 0.9)
  }, [isActive])

  return (
    <div style={{ perspective: 2000 }}>

      <motion.div className="dropdown-root"
        animate={{
          opacity: isActive ? 1 : 0,
          rotateX: isActive ? 0 : -15
        }}
        transition={{
          opacity: { duration: refDuration, delay: .05 },
          rotateX: { duration: refDuration, delay: .05 }
        }}
      >

        <motion.div
          animate={{
            x,
            width,
            height,
            pointerEvents: isActive ? 'unset' : 'none',
          }}
          transition={{
            ease: 'easeOut',
            x: { duration: isFirstInteraction ? 0 : refDuration },
            width: { duration: isFirstInteraction ? 0 : refDuration * .93 },
            height: { duration: isFirstInteraction ? 0 : refDuration * .93 },
            //bug fix
            pointerEvents: { delay: 0.05 }
          }}
          className="dropdown-container"
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
        >
          <DropdownBackground />

          <motion.div
            animate={{
              x: -x
            }}
            transition={{
              x: isFirstInteraction ? { duration: 0 } : undefined
            }}
          >
            {
              options.map(item => (
                <DropdownSection key={item.id} option={item} />
              ))
            }
          </motion.div>

        </motion.div>

        <DropdownArrow isFirstInteraction={isFirstInteraction} />

      </motion.div>
    </div>
  )
}

function DropdownArrow({ isFirstInteraction }) {
  const { cacheId, getOptionsById } = useContext(Context)

  const cachedOption = useMemo(() => getOptionsById(cacheId), [
    cacheId,
    getOptionsById
  ])

  const x = cachedOption ? cachedOption.optionCenterX : 0

  return (
    <motion.div
      className="dropdown-arrow"
      initial={{
        opacity: 0
      }}
      animate={{
        x,
        pointerEvents: 'none',
        opacity: x > 0 ? 1 : 0
      }}
      transition={{
        ease: 'easeOut',
        x: { duration: isFirstInteraction ? 0 : refDuration },
        //bug fix
        pointerEvents: { delay: 0.05 }
      }}
    />
  )
}

function DropdownBackground() {
  const { cacheId, getOptionsById } = useContext(Context)

  const cachedOption = useMemo(() => getOptionsById(cacheId), [getOptionsById, cacheId])

  const backgroundHeight = cachedOption?.backgroundHeight || 0

  return (
    <motion.div
      className="dropdown-background"
      animate={{
        height: backgroundHeight
      }}
      transition={{
        ease: 'easeOut',
        duration: refDuration
      }}
    />
  )
}