"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetAllySchema, type AssetAllyFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PasswordGeneratorDialog } from "./PasswordGeneratorDialog";
import {
  PlusCircle,
  Trash2,
  User,
  Phone,
  Laptop,
  Globe,
  Code,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AssetAllyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePasswordIndex, setActivePasswordIndex] = useState<number | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<AssetAllyFormValues>({
    resolver: zodResolver(assetAllySchema),
    defaultValues: {
      name: "",
      jobTitle: "",
      contacts: [],
      equipments: [],
      software: [],
      websites: [],
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({ control: form.control, name: "contacts" });
  const {
    fields: equipmentFields,
    append: appendEquipment,
    remove: removeEquipment,
  } = useFieldArray({ control: form.control, name: "equipments" });
  const {
    fields: softwareFields,
    append: appendSoftware,
    remove: removeSoftware,
  } = useFieldArray({ control: form.control, name: "software" });
  const {
    fields: websiteFields,
    append: appendWebsite,
    remove: removeWebsite,
  } = useFieldArray({ control: form.control, name: "websites" });

  const onSubmit = (data: AssetAllyFormValues) => {
    setIsSubmitting(true);
    console.log(data);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "¡Éxito!",
        description: "La información de los activos ha sido guardada.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handlePasswordGenerated = (password: string) => {
    if (activePasswordIndex !== null) {
      form.setValue(`websites.${activePasswordIndex}.password`, password);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-primary" /> Información del Usuario
              </CardTitle>
              <CardDescription>
                Introduce los detalles básicos del usuario.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="p.ej., Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puesto de Trabajo</FormLabel>
                    <FormControl>
                      <Input placeholder="p.ej., Ingeniero de Software" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="text-primary" /> Información de Contacto
              </CardTitle>
              <CardDescription>
                Añade uno o más números de contacto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-4 bg-background"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.number`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="+34 600 123 456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between gap-4">
                       <FormField
                          control={form.control}
                          name={`contacts.${index}.hasWhatsapp`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                              <FormLabel>¿Tiene WhatsApp?</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                       <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeContact(index)}
                          aria-label="Eliminar número de teléfono"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendContact({ number: "", hasWhatsapp: false })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Número de Teléfono
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Laptop className="text-primary" /> Equipamiento
                </CardTitle>
                <CardDescription>Enumera todo el equipamiento asignado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {equipmentFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-background">
                         <FormField
                            control={form.control}
                            name={`equipments.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Equipo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="p.ej., Dell Latitude 7420" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                         />
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                            <FormField
                                control={form.control}
                                name={`equipments.${index}.serial`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de Serie</FormLabel>
                                        <FormControl>
                                            <Input placeholder="p.ej., ABC123XYZ" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-between gap-4">
                                <FormField
                                    control={form.control}
                                    name={`equipments.${index}.hasLicense`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                                            <FormLabel>¿Tiene Licencia?</FormLabel>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeEquipment(index)}
                                    aria-label="Eliminar equipamiento"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                         </div>
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => appendEquipment({ name: '', serial: '', hasLicense: false })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Equipamiento
                 </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Code className="text-primary" /> Aplicaciones de Software
                </CardTitle>
                <CardDescription>Enumera el software de uso frecuente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {softwareFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4 p-2 border rounded-lg bg-background">
                        <FormField
                            control={form.control}
                            name={`software.${index}.name`}
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input placeholder="p.ej., VS Code, Photoshop" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeSoftware(index)}
                            aria-label="Eliminar software"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendSoftware({ name: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Software
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="text-primary" /> Credenciales de Sitios Web
                </CardTitle>
                <CardDescription>Guarda de forma segura los datos de inicio de sesión de sitios web.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {websiteFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-background">
                        <FormField
                            control={form.control}
                            name={`websites.${index}.url`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL del Sitio Web</FormLabel>
                                    <FormControl><Input placeholder="https://ejemplo.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`websites.${index}.email`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email / Nombre de Usuario</FormLabel>
                                        <FormControl><Input placeholder="usuario@ejemplo.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`websites.${index}.password`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                            <Button type="button" variant="outline" size="icon" onClick={() => setActivePasswordIndex(index)} aria-label="Generar Contraseña">
                                                <Sparkles className="h-4 w-4 text-primary" />
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                            <FormField
                                control={form.control}
                                name={`websites.${index}.recoveryEmail`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email de Recuperación (opcional)</FormLabel>
                                        <FormControl><Input placeholder="recuperacion@ejemplo.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-between gap-4">
                                <FormField
                                    control={form.control}
                                    name={`websites.${index}.has2fa`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                                            <FormLabel>¿2FA Habilitado?</FormLabel>
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeWebsite(index)} aria-label="Eliminar sitio web">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendWebsite({ url: '', email: '', password: '', has2fa: false, recoveryEmail: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Sitio Web
                </Button>
            </CardContent>
          </Card>


          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Toda la Información
            </Button>
          </div>
        </form>
      </Form>
      <PasswordGeneratorDialog
        open={activePasswordIndex !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActivePasswordIndex(null);
        }}
        onPasswordGenerated={handlePasswordGenerated}
      />
    </>
  );
}
