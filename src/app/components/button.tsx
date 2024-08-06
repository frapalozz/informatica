"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Button( { text, link, first, last, center}: any) {
    const pathname = usePathname();

    return(
        <Link href={link} className={`flex justify-center items-center border dark:border-zinc-700 border-zinc-400 ${first? "rounded-r-none":""} ${last? "rounded-l-none":""} ${center? "rounded-none":""} ${(pathname == link)? "dark:bg-zinc-100 bg-zinc-950 dark:text-zinc-950 text-zinc-100": "dark:text-white text-black" } text-sm text-center md:text-base font-medium px-2 py-px rounded-md transition-all duration-300 min-h-6`}>
            {text}
        </Link>
    )
    
}