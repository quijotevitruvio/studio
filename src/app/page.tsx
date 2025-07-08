import { AssetAllyForm } from "@/components/asset-ally/AssetAllyForm";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gavel } from "lucide-react";


export default function Home() {
  const legalText = "Este documento contiene información protegida por las leyes colombianas de habeas data, específicamente la Ley 1266 de 2008 y la Ley 1581 de 2012. Los datos aquí presentados serán verificados, y al aceptarlo, usted consiente a que cualquier dato proporcionado será sometido a verificación, generando responsabilidad laboral y legal en caso de incumplimiento, de acuerdo con la legislación vigente en Colombia.";

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

        <Alert className="mb-8">
          <Gavel className="h-4 w-4" />
          <AlertTitle className="font-bold">Aviso Legal Importante</AlertTitle>
          <AlertDescription>
            {legalText}
          </AlertDescription>
        </Alert>
        
        <AssetAllyForm />
      </main>
      <footer className="w-full max-w-4xl mx-auto mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Capturadatos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
