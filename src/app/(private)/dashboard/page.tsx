import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const dashboardCards = [
  {
    title: "Portfolio",
    subtitle: "Your public gallery",
    href: "/",
  },
  {
    title: "Beauty Tracker",
    subtitle: "Products and routines",
    href: "/beauty",
  },
  {
    title: "Photo Journal",
    subtitle: "Daily memories",
    href: "/journal",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.display_name as string) || "User";

  return (
    <div className="py-8 md:py-12">
      <h1 className="font-display text-2xl font-bold text-text-primary mb-6 md:mb-8">
        Welcome back, {displayName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {dashboardCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="rounded-[16px] shadow-sm bg-surface motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5">
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-accent rounded-[16px] h-32 flex items-center justify-center mb-4">
                  <span className="text-text-secondary text-sm">
                    Nothing here yet
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-normal text-text-primary">
                      {card.title}
                    </p>
                    <p className="text-sm font-normal text-text-secondary">
                      {card.subtitle}
                    </p>
                  </div>
                  <ChevronRight className="text-accent" size={20} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
