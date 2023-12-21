import React, { useEffect, useRef, useState } from 'react'
import { useCursor, useHelper } from '@react-three/drei';
import useLevelEditorStore from '../stores/useLevelEditorStore';
import { useFrame } from '@react-three/fiber';
import { BoxHelper } from 'three';
import { BLOCK_SIZE } from '../utils/constants';


/**
 * Static values
 */
const PRIM_TYPE = 'Group';

function EditorActor({
  index,
  name,
  position,
  children,
}) {
  /**
   * Store
   */
  const actors = useLevelEditorStore(state => state.actors);
  const pushActor = useLevelEditorStore(state => state.pushActor);
  const editorTarget = useLevelEditorStore(state => state.editorTarget);
  const updateTarget = useLevelEditorStore(state => state.updateTarget);
  const resetTarget = useLevelEditorStore(state => state.resetTarget);
  const cycleMode = useLevelEditorStore(state => state.cycleMode);
  
  /**
   * Ref
   */
  const groupRef = useRef(null);

  /**
   * Hover state and Pointer Cursor hook
    */
  const [ hover, setHover ] = useState(false);
  useCursor(hover);
  
  /**
    * Drei useHelper Hooks
    */
  const showHighlight = hover;
  useHelper(showHighlight && actors[index]?.ref, BoxHelper, 'blue');

  const handleClick = (e) => {
    e.stopPropagation();

    updateTarget(name);
  }

  const handlePointerMiss = () => {
    if(editorTarget.name === name) {
      resetTarget();
    }
  }

  const handleContextMenu = () => {
    cycleMode();
  }

  const handlePointerOver = () => {
    setHover(true);
  }

  const handlePointerOut = () => {
    setHover(false);
  }

  useEffect(() => {
    pushActor(name);
  }, []);

  return (  
    <group
      name={name}
      ref={actors[index]?.ref}
      position={position}
      onClick={handleClick}
      onPointerMissed={handlePointerMiss}
      onContextMenu={handleContextMenu}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children}
    </group>
  )
}

export default EditorActor;