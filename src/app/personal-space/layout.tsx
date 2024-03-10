import Link from "next/link";

export default function PersonalSpaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex flex-col divide-y">
            <header className="p-4">
                <Link href="/" className="font-bold">
                    Accueil
                </Link>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}