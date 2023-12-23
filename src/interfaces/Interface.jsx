import React from 'react'
import GridOptionsUI from './components/GridOptionsUI';
import GridObjectsUI from './components/GridObjectsUI';

/**
 * Wrapper Component to wrap all UI Components
 * and render it outside of R3f Canvas context
 */
function Interface() {
  return (
    <div className="interface">
      {/* <GridOptionsUI /> */}
      <GridObjectsUI />
    </ div>
  )
}

export default Interface;