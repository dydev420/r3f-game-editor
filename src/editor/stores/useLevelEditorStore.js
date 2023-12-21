import { createRef } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GRID_SIZE, TRANSFORM_MODES } from '../utils/constants';

export const nullActor = {
  name: null,
  ref: createRef(null)
};

export const emptyGrid = {
  gridCell: [0, 0],
  terrainType: 'ground',
  terrainRef: createRef(null),
  objects: [],

}

export default create(subscribeWithSelector((set, get) => {
  return {
    /**
     * Level Grid
     */
    gridSeed: 0,
    gridSize: GRID_SIZE,
    grid: [ ], // 2D Array - Change it to 1D later

    initGrid: (size) => {
      set((state) => {
        let grid = [];
        let gridSize = state.gridSize;

        if(size !== undefined) {
          gridSize = size;
        }

        for (let i = 0; i < gridSize; i++) {
          const column = [];

          for (let j = 0; j < gridSize; j++) {
            const plot = {
              ...emptyGrid,
              gridCell: [i, j]
            };

            column.push(plot);
          }
          grid.push(column)
        }

        return {
          grid
        }
      });
    },

    /**
     * Actors in Level
     */
    actors: [],

    pushActor: (actorName) => {
      const actors = get().actors;
      const pushIndex = actors.length;

      actors.push({
        worldIndex: pushIndex,
        name: actorName,
        ref: createRef(null)
      });
    },

    /**
     * Editor Target transform mode and target
     */
    editorTarget: {
      name: null,
      mode: 0,
    },

    cycleMode: () => {
      set((state) => {
        console.log('Cycle Mode');

        return {
          editorTarget: {
            ...state.editorTarget,
            mode: (state.editorTarget.mode + 1) % TRANSFORM_MODES.length
          }
        };
      })
    },
    
    resetTarget: () => {
      set((state) => {
        console.log('Resetting target: ');

        return {
          editorTarget: {
            ...state.editorTarget,
            name: null,
          }
        };
      })
    },

    updateTarget: (targetName, type) => {
      set((state) => {
        console.log('Updating to target: ', targetName);

        return {
          editorTarget: {
            ...state.editorTarget,
            name: targetName,
            type: type
          }
        };
      })
    },
  }
}));
