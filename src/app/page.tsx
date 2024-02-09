import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";

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
        <div className="relative w-[400px] h-[400px] rounded bg-slate-300">
          <Image src={challenge.image} alt={challenge.description} fill />
        </div>
      </div>
    </main>
  );
}
