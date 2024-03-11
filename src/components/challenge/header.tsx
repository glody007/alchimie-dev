import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";

export async function Header() {
    const session = await getServerAuthSession();

    return (
        <div className="flex items-center justify-end px-4 py-2">
            <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
            {session ? "Déconnexion" : "Connexion"}
            </Link>
            {session && (
                <Link 
                    href="/personal-space"
                    className={cn(buttonVariants({ variant: "outline" }))}
                >
                    Espace personel
                </Link>
            )}
        </div>
    )
}