import React from 'react'
import { ShimmerButton } from "./ui/shimmer-button"
import Link from 'next/link'

export default function Whiteboard() {
  return (
    <div className='text-white mt-3'>
        <Link href={"https://whiteboard.palozz.com"} target='_blank'>
            <ShimmerButton className='px-3 py-2 border-neutral-700' borderRadius='8px'>
                <span className='text-white'>Whiteboard</span>
            </ShimmerButton>
        </Link>
        
    </div>
  )
}
