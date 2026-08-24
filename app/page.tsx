// /app/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background p-8">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Package className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des Commandes
          </h1>
          <p className="text-muted-foreground">
            Vous accédez au tableau de bord de test pour la gestion des
            commandes.
          </p>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link href="/orders">Accéder au tableau de bord</Link>
        </Button>
      </div>
    </main>
  )
}
