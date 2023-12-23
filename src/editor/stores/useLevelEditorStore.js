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
  terrainType: 'grass',
  terrainRef: createRef(null),
  object: {
    name: null,
    type: null,
    position: null,
  },
};

export default create(subscribeWithSelector((set, get) => {
  return {
    /**
     * Level Grid
     */
    gridSeed: 0,
    gridSize: GRID_SIZE,
    grid: [ ], // 2D Array - Change it to 1D later
    activeGridCell: null,

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
     * Updates grid array when new object is added to any cell
     */
    setBlockObject: (cell, object) => {
      const grid = get().grid;

      grid[cell[0]][cell[1]].object = object;
    },

    /**
     * Mutates the item inside grids array
     */
    setBlockTerrain: (cell, terrainType) => {
      const grid = get().grid;
      const gridInfo = grid[cell[0]][cell[1]];

      gridInfo.terrainType = terrainType;
      grid[cell[0]][cell[1]] = gridInfo;
    },

    /**
     * Set active cell of the grid
     */
    setActiveBlock: (cell) => {
      set(() => {
        return {
          activeGridCell: cell
        };
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
      type: null
    },

    cycleMode: () => {
      set((state) => {
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
        return {
          editorTarget: {
            ...state.editorTarget,
            name: null,
            type: null,
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
