import LanguageSwitcher from '../language-switcher';
import { UserNav } from './user-nav';
import { ThemeToggle } from '../theme-toggle';
import MobileSidebar from './mobile-sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 shadow-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MobileSidebar />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search..."
          className="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  );
}
