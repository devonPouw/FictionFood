import { FaLinkedin, FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="relative inset-x-0 bottom-0 w-full justify-between border-t border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30">
      <div className="flex">
        <div className="container flex h-14 items-center">
          <span className="font-serif text-xs">Made by devonPouw</span>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center p-2">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/devonPouw"
            >
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-12 py-2 w-12 px-0">
                <FaGithub className="h-8 w-8" />
                <span className="sr-only">GitHub</span>
              </div>
            </a>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/devon-pouw-400489121/"
            >
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-12 py-2 w-12 px-0">
                <FaLinkedin className="h-8 w-8" />
                <span className="sr-only">Linkedin</span>
              </div>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
