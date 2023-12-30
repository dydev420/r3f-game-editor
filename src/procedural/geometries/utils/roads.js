/**
 * Line Segments Connecting local points
 */
export const roadLineIndices = [
  // 0
  [15, 0],
  // 1
  [1, 2],
  // 2
  [3, 4],
  // 3
  [5, 6],
  // 4
  [7, 8],
  // 5
  [9, 10],
  // 6
  [11, 12],
  // 7
  [13, 14],
];

/**
 * Local POints on road relative to curve oriented point 
 */
export const roadLocalPoints = [
  // 0
  {
    position: [3, 0],
    normal: [0, 1],
    u: 0.171
  },
  // 1
  {
    position: [3, 0],
    normal: [-0.707, 0.707],
    u: 0.171
  },
  // 2
  {
    position: [4, 1],
    normal: [-0.707, 0.707],
    u: 0.116
  },
  // 3
  {
    position: [4, 1],
    normal: [0, 1],
    u: 0.116
  },
  // 4
  {
    position: [5, 1],
    normal: [0, 1],
    u: 0.077
  },
  // 5
  {
    position: [5, 1],
    normal: [1, 0],
    u: 0.077
  },
  // 6
  {
    position: [5, -1],
    normal: [1, 0],
    u: 0
  },
  // 7
  {
    position: [5, -1],
    normal: [0, -1],
    u: 1
  },
  // 8
  {
    position: [-5, -1],
    normal: [0, -1],
    u: 0.613
  },
  // 9
  {
    position: [-5, -1],
    normal: [-1, 0],
    u: 0.574
  },
  // 10
  {
    position: [-5, 1],
    normal: [-1, 0],
    u: 0.497
  },
  // 11
  {
    position: [-5, 1],
    normal: [0, 1],
    u: 0.497
  },
  // 12
  {
    position: [-4, 1],
    normal: [0, 1],
    u: 0.458
  },
  // 13
  {
    position: [-4, 1],
    normal: [0.707, 0.707],
    u: 0.458
  },
  // 14
  {
    position: [-3, 0],
    normal: [0.707, 0.707],
    u: 0.403
  },
  // 15
  {
    position: [-3, 0],
    normal: [0, 1],
    u: 0.403
  }
];