import { Vector3 } from 'three';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { DEFAULT_FORWARD, INPUT_TYPE_GAMEPAD, INPUT_TYPE_KEYBOARD, REST_HEIGHT } from '../utils/constants';
import { createRef } from 'react';

const inputStore = ((set, get) => {
  return {
    inputAxis: {
      x: 0,
      y: 0
    },
    cameraInputAxis: {
      x: 0,
      y: 0
    },
    inputType: INPUT_TYPE_KEYBOARD,

    setInputType: (type) => {
      set(() => {
        return {
          inputType: type
        };
      });
    },

    updateInputX: (input) => {
      const inputAxis = get().inputAxis;
      inputAxis.x = input;
    },
    
    updateInputY: (input) => {
      const inputAxis = get().inputAxis;
      inputAxis.y = input;
    },

    updateInputAxes: (x, y) => {
      const inputAxis = get().inputAxis;
      inputAxis.x = x;
      inputAxis.y = y;
    },

    updateCameraInputX: (input) => {
      const cameraInputAxis = get().cameraInputAxis;
      cameraInputAxis.x = input;
    },

    updateCameraInputY: (input) => {
      const cameraInputAxis = get().cameraInputAxis;
      cameraInputAxis.y = input;
    },

    updateCameraInputAxes: (x, y) => {
      const cameraInputAxis = get().cameraInputAxis;
      cameraInputAxis.x = x;
      cameraInputAxis.y = y;
    },


    /**
     * Primitive Values
     * 
     * Use subscribeWithSelector instead of useStore or
     * it will cause Re-render on every input
     */
    isJumpPressed: false,
    isBoostPressed: false,

    // Call Set state for primitive value
    // Will cause re render if not used with subscribeWithSelector
    setInputJump: (isJumpPressed) => {
      set(() => ({ isJumpPressed }));
    },
    setInputBoost: (isBoostPressed) => {
      set(() => ({ isBoostPressed }));
    }
  }
})

export default create(
  subscribeWithSelector(
    inputStore
  ),
  {
    name: 'inputStore'
  }
);
