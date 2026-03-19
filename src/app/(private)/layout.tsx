import { TopNav } from "@/components/layout/top-nav";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav isAuthenticated={true} userName="User" />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-14 md:pb-0">
        {children}
      </main>
      <BottomTabBar isAuthenticated={true} />
    </>
  );
}
