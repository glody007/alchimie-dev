import { unstable_noStore as noStore } from "next/cache";
import { Challenge } from "~/components/challenge/challenge";
import { Header } from "~/components/challenge/header";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();

  const challenge = await api.challenge.getTodayChallenge.query();

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="w-full flex-1 flex justify-center items-center">
        {challenge ? (
          <Challenge challenge={challenge} showDetailButton={true} /> 
        ) : (
          <p>No challenge for today</p>
        )}
      </div>
    </main>
  );
}
