import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

/**
 * Grid Dimensions
 */
const DIM = 8;

const getRotatedSockets = (rotNum, sockets) => {
  const len = sockets.length;
  let newSockets = [];

  for (let i = 0; i < len; i++) {
    newSockets[i] = sockets[(i - rotNum + len) % len]
  }

  return newSockets;
}

const tiles = [
  {
    type: 'connectBlank',
    rotation: 0,
    sockets: ['AAA', 'AAA', 'AAA', 'AAA'],
    up: [],
    right: [],
    down: [],
    left: [], 
  },
  {
    type: 'connectRoad',
    rotation: 0,
    sockets: ['ABA', 'ABA', 'AAA', 'ABA'],
    up: [],
    right: [],
    down: [],
    left: [], 
  },
  {
    type: 'connectRoad',
    rotation: 1,
    sockets: getRotatedSockets(1, ['ABA', 'ABA', 'AAA', 'ABA']),
    up: [],
    right: [],
    down: [],
    left: [],
  },
  {
    type: 'connectRoad',
    rotation: 2,
    sockets: getRotatedSockets(2, ['ABA', 'ABA', 'AAA', 'ABA']),
    up: [],
    right: [],
    down: [],
    left: [], 
  },
  {
    type: 'connectRoad',
    rotation: 3,
    sockets: getRotatedSockets(3, ['ABA', 'ABA', 'AAA', 'ABA']),
    up: [],
    right: [],
    down: [],
    left: [], 
  }
];

const useWaveCircuit = () => {
  /**
   * State Refs
   */
  const waveGrid = useRef([]);
  const tileDomains = useRef(tiles.map(() => {
    return {
      up: [],
      right: [],
      down: [],
      left: []
    };
  }));

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
   * Reverse given string
   */
  const reverseString = (s) => {
    return s?.split().reverse().join('');
  }

  /**
   * Setup Grid on mount
   */
  const setupGrid = () => {
    for (let i = 0; i < DIM * DIM; i++) {
      waveGrid.current[i] = {
        collapsed: false,
        options: [0, 1, 2, 3, 4],
        // cell: [Math.floor(i / DIM), i % DIM ],
        cell: [i % DIM, Math.floor(i / DIM)],
        type: null,
      }
    }
  };

  const compareEdge = (edge1, edge2) => {
      return edge1 === reverseString(edge2);
  }

  const analyzeTile = (tileIndex) => {
    const allTileDomains = tileDomains.current;
    const testTile = tiles[tileIndex];
    const testSockets = testTile.sockets;
    const testTileDomains = allTileDomains[tileIndex];
    
    tiles.forEach((tile, index) => {
      const tileSockets = tile.sockets;
      
      // UP
      if(compareEdge(tileSockets[2], testSockets[0])) {
        testTileDomains.up.push(index);
      }

      // RIGHT
      if(compareEdge(tileSockets[3], testSockets[1])) {
        testTileDomains.right.push(index);
      }

      // DOWN
      if(compareEdge(tileSockets[0], testSockets[2])) {
        testTileDomains.down.push(index);
      }

      // LEFT
      if(compareEdge(tileSockets[1], testSockets[3])) {
        testTileDomains.left.push(index);
      }
    });
  };

  const analyzeAllTiles = () => {
    tiles.forEach((tile, index) => {
      analyzeTile(index);
    });
  }

  const checkForValidOptions = (arr, validOptions) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      const element = arr[i];

      if(!validOptions.includes(element)) {
        arr.splice(i, 1);
      }
    }
  };

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

    if(pick === undefined) {
      console.log('Error NO Options left:: Backtracking required ahead');
      
      setDone(true);
      return;
    }

    const pickedTile = tiles[pick];
    cell.type = pickedTile.type;
    cell.rotation = pickedTile.rotation;
    cell.options = [pick];


    const nextGrid = [];
    for (let i = 0; i < DIM; i++) {
      for (let j = 0; j < DIM; j++) {
        const index = i + DIM * j;
        const currentGrid = waveGrid.current;

        if(currentGrid[index].collapsed) {
          nextGrid[index] = currentGrid[index];
        } else {
          let options = [0, 1, 2, 3, 4];

          // Look Up
          if(j < DIM - 1) {
            let up = currentGrid[i + (j + 1) * DIM];
            let validOptions = [];

            up.options.forEach((option) => {
              let valid = tileDomains.current[option].down;
              validOptions = validOptions.concat(valid);
            });

            checkForValidOptions(options, validOptions);
          }

          // Look Right
          if(i > 0) {
            let right = currentGrid[(i - 1) + j * DIM];
            let validOptions = [];

            right.options.forEach((option) => {
              let valid = tileDomains.current[option].left;
              validOptions = validOptions.concat(valid);
            });

            checkForValidOptions(options, validOptions);
          }
          
          // Look Down
          if(j > 0) {
            let down = currentGrid[i + (j - 1) * DIM];
            let validOptions = [];

            down.options.forEach((option) => {
              let valid = tileDomains.current[option].up;
              validOptions = validOptions.concat(valid);
            });

            checkForValidOptions(options, validOptions);
          }

          // Look Left
          if(i < DIM - 1) {
            let left = currentGrid[i + 1 + j * DIM];
            let validOptions = [];

            left.options.forEach((option) => {
              let valid = tileDomains.current[option].right;
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
  };

  useEffect(() => {
    setupGrid();

    analyzeAllTiles();
    
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

export default useWaveCircuit;
