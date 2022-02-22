import React from 'react'

import './loading.css'

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '50px 0',
      }}
    >
      <div className='lds-heart'>
        <div></div>
      </div>
    </div>
  )
}
