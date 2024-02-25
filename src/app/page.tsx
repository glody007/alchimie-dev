import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

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
        <div className="flex flex-col gap-4">
          <div className="relative w-[400px] h-[400px] rounded bg-slate-300 border">
            <Image src={challenge.image} alt={challenge.description} fill />
          </div>
          <div className="flex flex-col justify-start gap-2">
            <p className="first-letter:uppercase text-sm font-light">{challenge.description}</p>
            <Button size="lg" className="mr-auto">Start</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
