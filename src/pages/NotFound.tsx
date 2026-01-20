import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <div className="text-8xl">🥋</div>
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">
          Oops! This page has been thrown out of bounds.
        </p>
        <Link to="/">
          <Button size="lg" className="mt-4">
            Return to Dojo
          </Button>
        </Link>
      </div>
    </div>
  );
}
