"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, LayoutDashboard, UserCircle, LogOut, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  
  // Use a mock logout if the hook isn't ready yet
  // const { mutate: logout } = useLogout();
  const handleLogout = () => {
    // logout();
    // For now:
    import("@/lib/auth").then(({ clearTokens }) => {
      clearTokens();
      window.location.href = "/auth/login";
    });
  };

  const getDashboardLink = () => {
    if (!user) return "/auth/login";
    if (user.role === UserRole.ADMIN) return "/dashboard/admin";
    if (user.role === UserRole.LANDLORD) return "/dashboard/landlord";
    return "/dashboard/tenant";
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/properties", label: "Properties", icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block text-primary">
              Basha Khuji
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href={getDashboardLink()}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hidden sm:flex rounded-full"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-9 w-9 rounded-full flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring hover:opacity-80 transition-opacity">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src={user?.profileImage || ""} alt={user?.userName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.userName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={getDashboardLink()} className="cursor-pointer flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {user?.role === UserRole.TENANT && (
                  <DropdownMenuItem>
                    <Link href="/dashboard/tenant/profile" className="cursor-pointer flex items-center w-full">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login" className={buttonVariants({ variant: "ghost" })}>
                Log in
              </Link>
              <Link href="/auth/register" className={buttonVariants({ variant: "default" })}>
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 mb-4">
                  <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="text-primary font-bold">Basha Khuji</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 text-sm font-medium p-2 rounded-md transition-colors ${
                      pathname === link.href ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <Link
                    href={getDashboardLink()}
                    className={`flex items-center gap-2 text-sm font-medium p-2 rounded-md transition-colors ${
                      pathname.startsWith("/dashboard") ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}

                <div className="flex items-center gap-2 text-sm font-medium p-2 mt-2 border-t pt-4">
                  <span>Theme</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-auto h-8 w-8 rounded-full"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </div>

                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 mt-4 border-t pt-4">
                    <Link href="/auth/login" className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}>
                      Log in
                    </Link>
                    <Link href="/auth/register" className={buttonVariants({ variant: "default", className: "w-full justify-start" })}>
                      Sign up
                    </Link>
                  </div>
                )}
                
                {isAuthenticated && (
                  <Button variant="destructive" className="w-full justify-start mt-4" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
