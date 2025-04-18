import React from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

type Props = {
    loading?: boolean
}

function Loading({loading}: Props) {
  return !loading ?"":(
    <div className='fixed w-screen bg-white z-100 h-screen flex justify-center items-center p-2 ' > 
    <PulseLoader color="#36d7b7" size={20} aria-label="Loading Spinner" data-testid="loader" />
    </div>
  )
}

export default Loading