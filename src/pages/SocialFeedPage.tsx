import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import SocialFeed from "@/components/SocialFeed";

export default function SocialFeedPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Community</h1>
            <p className="text-muted-foreground">
              Stay connected with the dojo community, share achievements, and get the latest updates.
            </p>
          </div>

          <SocialFeed />
        </main>
      </div>
    </PageTransition>
  );
}
