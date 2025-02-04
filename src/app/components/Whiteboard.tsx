import React from 'react'
import { ShimmerButton } from "./ui/shimmer-button"
import Link from 'next/link'

export default function Whiteboard() {
  return (
    <div className='text-white mt-3'>
        <Link href={"https://whiteboard.palozz.com"} target='_blank'>
            <ShimmerButton className='px-3 py-2 hover:scale-110 transition-all duration-500 ease-in-out' borderRadius='10px'>
                <span>Whiteboard</span>
            </ShimmerButton>
        </Link>
        
    </div>
  )
}
