import React, { useEffect } from 'react';
import { OrbitControls, TransformControls } from '@react-three/drei';
import useLevelEditorStore from '../stores/useLevelEditorStore';
import { useFrame, useThree } from '@react-three/fiber';
import { TRANSFORM_MODES } from '../utils/constants';


function EditorGizmo({
}) {
  const editorTarget = useLevelEditorStore(state => state.editorTarget);

  const scene = useThree((state) => state.scene);

  return <>
    {
      editorTarget.name && (
        <TransformControls
          object={scene.getObjectByName(editorTarget.name)}
          mode={TRANSFORM_MODES[editorTarget.mode]}
        />
      )    
    }
    <OrbitControls makeDefault />
  </>
}

export default EditorGizmo;