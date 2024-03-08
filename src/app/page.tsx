import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { ChallengeCard } from "~/components/challenge/challenge-card";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();

  const session = await getServerAuthSession();

  const challenge = await api.challenge.todayChallenge.query();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex justify-end">
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
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
