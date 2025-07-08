import { AssetAllyForm } from "@/components/asset-ally/AssetAllyForm";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <main className="w-full max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Icons.logo className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-headline text-foreground">
                Capturadatos
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                Tu asistente para la captura de datos.
              </p>
            </div>
          </div>
        </header>
        
        <AssetAllyForm />
      </main>
      <footer className="w-full max-w-4xl mx-auto mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Capturadatos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
