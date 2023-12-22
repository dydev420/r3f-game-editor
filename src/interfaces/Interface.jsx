import React from 'react'
import GridOptionsUI from './components/GridOptionsUI';

/**
 * Wrapper Component to wrap all UI Components
 * and render it outside of R3f Canvas context
 */
function Interface() {
  return (
    <div className="interface">
      <GridOptionsUI />
    </ div>
  )
}

export default Interface;