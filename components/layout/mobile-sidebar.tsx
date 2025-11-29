'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="h-full px-0 py-0">
          {/* Reuse Sidebar content or create a specific mobile nav */}
          {/* Since Sidebar component has 'hidden md:flex', we might need to adjust it 
                or create a shared Nav component. 
                For now, I'll just render a simplified nav here or try to reuse Sidebar if I modify it to accept className.
            */}
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Duplicating logic for now to avoid modifying Sidebar too much to handle "hidden" class.
// Ideally, we extract the Nav items to a config or shared component.
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const sidebarItems = [
  {
    title: 'title',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'users',
    href: '/dashboard/users',
    icon: Users,
  },
];

function SidebarContent() {
  const t = useTranslations('Dashboard');
  const tUsers = useTranslations('UserManagement');
  const pathname = usePathname();

  return (
    <div className="bg-card text-card-foreground flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="">Admin Dashboard</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                  isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title === 'users' ? tUsers('users') : t(item.title)}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
