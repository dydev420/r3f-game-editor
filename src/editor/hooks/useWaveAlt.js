import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

const tiles = [
  'connectBlank',
  'connectUp',
  'connectRight',
  'connectDown',
  'connectLeft'
];

const DIM = 8;

const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

const rules = [
  // BLANK
  [
    [BLANK, UP],
    [BLANK, RIGHT],
    [BLANK, DOWN],
    [BLANK, LEFT],
  ],
  
  // UP
  [
    [RIGHT, DOWN, LEFT],
    [UP, DOWN, LEFT],
    [BLANK, DOWN],
    [UP, DOWN, RIGHT]
  ],
  
  // RIGHT
  [
    [RIGHT, DOWN, LEFT],
    [UP, DOWN, LEFT],
    [RIGHT, LEFT, UP],
    [BLANK, LEFT]
  ],
  
  // DOWN
  [
    [BLANK, UP],
    [LEFT, UP, DOWN],
    [RIGHT, LEFT, UP],
    [RIGHT, UP, DOWN]
  ],
  
  // LEFT
  [
    [RIGHT, LEFT, DOWN],
    [BLANK, RIGHT],
    [RIGHT, LEFT, UP],
    [UP, DOWN, RIGHT]
  ],
];

const useWaveAlt = () => {
  /**
   * State Refs
   */
  const waveGrid = useRef([]);

  /**
   * local time ref
   */
  const startTime = useRef(null);
  const endTime = useRef(null);

  /**
   * Re- render trigger state
   */
  const [forceRender, setForceRender] = useState(false);
  const [done, setDone] = useState(false);

  /**
   * Methods
   */

  /**
   * Returns a random element from given array
   */
  const pickRandom = (list) => {
    return list[Math.floor((Math.random() * list.length))];
  }

  /**
   * Setup Grid on mount
   */
  const setupGrid = () => {

    for (let i = 0; i < DIM * DIM; i++) {
      waveGrid.current[i] = {
        collapsed: false,
        options: [BLANK, UP, RIGHT, DOWN, LEFT],
        // cell: [Math.floor(i / DIM), i % DIM ],
        cell: [i % DIM, Math.floor(i / DIM)],
        type: null,
      }
    }
  }

  const checkForValidOptions = (arr, validOptions) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      const element = arr[i];

      if(!validOptions.includes(element)) {
        arr.splice(i, 1);
      }
    }
  }

  const iterateWaveCollapse = () => {
    let gridCopy = waveGrid.current.slice();

    gridCopy = gridCopy.filter(a => !a.collapsed);

    if(!gridCopy.length) {
      if(!waveGrid.current?.length) {
        return;
      }
      
      console.log('All Collapsed');
      
      setDone(true);
      return;
    }

    gridCopy.sort((a, b) => {
      return a.options.length - b.options.length;
    });
    

    const minLen = gridCopy[0].options.length;
    
    gridCopy = gridCopy.filter((item) => {
      return item.options.length <= minLen;
    });

    const cell = pickRandom(gridCopy);

    cell.collapsed = true;
    const pick = pickRandom(cell.options);
    cell.type = tiles[pick];
    cell.options = [pick];


    const nextGrid = [];
    for (let i = 0; i < DIM; i++) {
      for (let j = 0; j < DIM; j++) {
        const index = i + DIM * j;
        const currentGrid = waveGrid.current;

        if(currentGrid[index].collapsed) {
          nextGrid[index] = currentGrid[index];
        } else {
          let options = [BLANK, UP, RIGHT, DOWN, LEFT];

          // Look Up
          if(j < DIM - 1) {
            let up = currentGrid[i + (j + 1) * DIM];
            let validOptions = [];

            up.options.forEach((option) => {
              let valid = rules[option][2];
              validOptions = validOptions.concat(valid);
            });

            checkForValidOptions(options, validOptions);
          }

          // Look Right
          if(i > 0) {
            let right = currentGrid[(i - 1) + j * DIM];
            let validOptions = [];

            right.options.forEach((option) => {
              let valid = rules[option][3];
              validOptions = validOptions.concat(valid);
            });

            checkForValidOptions(options, validOptions);
          }
          
          // Look Down
          if(j > 0) {
            let down = currentGrid[i + (j - 1) * DIM];
            let validOptions = [];

            down.options.forEach((option) => {
              // let valid = rules[option][2];
              let valid = rules[option][0];
              validOptions = validOptions.concat(valid);
            });

            checkForValidOptions(options, validOptions);
          }

          // Look Left
          if(i < DIM - 1) {
            let left = currentGrid[i + 1 + j * DIM];
            let validOptions = [];

            left.options.forEach((option) => {
              let valid = rules[option][1];
              validOptions = validOptions.concat(valid);
            });

            checkForValidOptions(options, validOptions);
          }

          nextGrid[index] = {
            options,
            collapsed: false,
            // cell: currentGrid[index].cell,
            cell: [i, j],
            type: null
          }
        }
      }
    }

    waveGrid.current = nextGrid;
  }

  useEffect(() => {
    setupGrid();
    
  }, []);

  useFrame(() => {
    if(!done) {
      iterateWaveCollapse();
    }
    // setForceRender(true);
  })

  return {
   waveGrid
  };
}

export default useWaveAlt;
