import { TopNav } from '@/components/layout/top-nav';
import { BottomTabBar } from '@/components/layout/bottom-tab-bar';
import { UserMenu } from '@/components/layout/user-menu';
import { createClient } from '@/lib/supabase/server';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = (user?.user_metadata?.display_name as string) || 'User';

  return (
    <>
      <TopNav
        isAuthenticated={true}
        userName={userName}
        userMenu={<UserMenu userName={userName} />}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-14 md:px-8 md:pb-0">
        {children}
      </main>
      <BottomTabBar isAuthenticated={true} />
    </>
  );
}
