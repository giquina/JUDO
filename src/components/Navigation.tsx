import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export default function Navigation() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Judo Club</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 flex-1">
          <Link to="/member">
            <Button variant={location.pathname === "/member" ? "default" : "ghost"} size="sm">
              Dashboard
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant={location.pathname === "/admin" ? "default" : "ghost"} size="sm">
              Admin
            </Button>
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? "S" : "M"}
          </Button>
          <Link to="/login">
            <Button variant="outline" size="sm">Logout</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
