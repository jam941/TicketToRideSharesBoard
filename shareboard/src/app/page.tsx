import { CardCounterGrid } from "@/components/card-counter-grid";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Ticket To Ride Shares Board</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your remaining cards</p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <CardCounterGrid />
      </main>
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>Card game counter tracker built with Next.js and shadcn/ui</p>
      </footer>
    </div>
  );
}
