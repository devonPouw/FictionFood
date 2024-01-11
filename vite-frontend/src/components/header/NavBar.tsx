import { ModeToggle } from '@/components/mode-toggle'
import { Link } from 'react-router-dom'
import Login from '../auth/Login'

export default function NavBar() {

  return (
    <div className='sticky flex w-full justify-between border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:w-screen lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30'>
        <div className='container'></div>
        <div className='container flex h-14 items-center text-xl'>
        <Link to={"/"}>
          <span className='font-bold hover:text-muted-foreground'><span className='font-serif font-semibold'>F</span>iction<span className='font-serif font-semibold'>f</span>ood</span>
          </Link>
        </div>
        <div className='container flex h-14 items-center font-bold'>
        <Link to={"/recipes/new"}>
        <div className='container inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground py-2 px-0 font-bold'>
            <span className='px-3'>New Recipe</span>
          </div>
          </Link>
          </div>
          <div className='container flex h-14 items-center font-bold'>
          <Link to={"/recipes"}>
          <div className='container inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground py-2 px-0 font-bold'>
            <span className='px-3'>All Recipes</span>
          </div>
          </Link>
          </div>
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
            <div className='w-full flex-1 md:w-auto md:flex-none'>
            <button className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"><span className="hidden lg:inline-flex">Search recipes...</span><span className="inline-flex lg:hidden">Search...</span><kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"><span className="text-xs">⌘</span>K</kbd></button>
            </div>
            <div className="p-2">
          <ModeToggle />
                </div>
        </div>
        <div className='container flex h-14 items-center font-bold'>
          <Login />
      </div>
      <div className='container'></div>
    </div>
  )
}

