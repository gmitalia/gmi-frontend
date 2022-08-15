import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
   <header className='flex justify-between p-5 max-w-7xl mx-auto'>
       <div className='flex space-x-5'>
           <Link href={'/'}>
                <img 
                className='w-20 object-contain cursor-pointer'
                src='/images/gmi_logo.png' 
                alt=''
                 />
           </Link>
       
            <div className='text-lg hidden md:inline-flex items-center space-x-5'>
                <h3><Link href="/competizioni">Competizioni</Link></h3>
                <h3><Link href="https://gmitalia.altervista.org/forum">Forum</Link></h3>
                <h3><Link href="https://gmiscores.altervista.org">Classifiche</Link></h3>
                <h3><Link href="https://gmitalia.altervista.org/site/risorse-2/">Risorse</Link></h3>
            </div>
       </div>
       
       <div className='flex items-center space-x-5 text-purple-600'>
        {/* <h3>Sign In</h3>
        <h3 className='border px-4 py-1 rounded-full border-purple-600'>Get Started</h3> */}
        <h3 className='text-white bg-gray-800 px-4 py-1 rounded-full'><Link href="https://discord.gg/0wKBBPIbX2r3S32a">Entra su Discord</Link></h3>
            
       </div>
    
   </header>
  )
}

export default Header