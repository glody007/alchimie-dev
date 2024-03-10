import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { ChallengeCard } from "~/components/challenge/challenge-card";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();

  const session = await getServerAuthSession();

  const challenge = await api.challenge.todayChallenge.query();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex items-center justify-end px-4 py-2">
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
        {session && (
          <Link 
            href="/personal-space"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Personal space
          </Link>
        )}
      </div>
      <div className="w-full flex-1 flex justify-center items-center">
        {challenge ? (
          <ChallengeCard challenge={challenge} /> 
        ) : (
          <p>No challenge for today</p>
        )}
      </div>
    </main>
  );
}
