import React from 'react'

type Props = {
    own: boolean,
    message: string,
    name:string
}

function Msg({own,message,name}: Props) {
  return (
    <div className={`w-full flex ${own ? "justify-end":""} `} >
        <div className={` flex w-max max-w-[250px] rounded-md  ${own ? "bg-blue-500 text-white flex-row-reverse":"bg-gray-200"}`}>
            <h1 className={`h-full flex p-1 ${own && "items-end text-gray-300  "} text-gray-600 text-sm  `}>{own ? "You":name }  </h1>
            <p className='p-4  ' >{message}</p>
        </div>
    </div>
  )
}

export default Msg