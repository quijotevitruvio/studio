
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Download,
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export function AssetAllyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePasswordIndex, setActivePasswordIndex] = useState<number | null>(
    null
  );
  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const form = useForm<AssetAllyFormValues>({
    resolver: zodResolver(assetAllySchema),
    defaultValues: {
      companyName: "",
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

  const togglePasswordVisibility = (key: string) => {
    setPasswordVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  
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
  
  const handleDownloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    // This plugin extends jsPDF, so we import it for its side effects.
    await import("jspdf-autotable");

    const data = form.getValues();
    if (!data.name) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Por favor, introduce al menos el nombre del usuario para generar el informe.",
        });
        return;
    }
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Informe de Datos - Capturadatos", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0); // Red color for warning
    doc.text("¡Atención! Este documento contiene información sensible, incluyendo contraseñas.", 14, 30);
    doc.setTextColor(0); // Reset color

    doc.setFontSize(12);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 38);
    
    doc.setFontSize(14);
    doc.text("Información General", 14, 50);
    (doc as any).autoTable({
      startY: 55,
      head: [['Empresa', 'Nombre Completo', 'Puesto de Trabajo']],
      body: [[data.companyName || 'N/A', data.name, data.jobTitle]],
      theme: 'grid'
    });
    
    let lastY = (doc as any).lastAutoTable.finalY || 70;

    if (data.contacts && data.contacts.length > 0) {
        doc.text("Contactos", 14, lastY + 15);
        (doc as any).autoTable({
            startY: lastY + 20,
            head: [['Número', 'Tipo', 'Tiene WhatsApp', 'Observaciones']],
            body: data.contacts.map(c => [c.number, c.type === 'personal' ? 'Personal' : 'Empresa', c.hasWhatsapp ? 'Sí' : 'No', c.observations || 'N/A']),
            theme: 'grid'
        });
        lastY = (doc as any).lastAutoTable.finalY;
    }

    if (data.equipments && data.equipments.length > 0) {
        doc.text("Equipamiento", 14, lastY + 15);
        (doc as any).autoTable({
            startY: lastY + 20,
            head: [['Nombre', 'Usuario', 'Contraseña', 'N/S', 'Tiene Licencia', 'Serial Licencia', 'Observaciones']],
            body: data.equipments.map(e => [e.name, e.username || 'N/A', e.password || 'N/A', e.serial, e.hasLicense ? 'Sí' : 'No', e.hasLicense ? (e.licenseSerial || 'N/A') : 'N/A', e.observations || 'N/A']),
            theme: 'grid'
        });
        lastY = (doc as any).lastAutoTable.finalY;
    }
    
    if (data.software && data.software.length > 0) {
        doc.text("Software", 14, lastY + 15);
        (doc as any).autoTable({
            startY: lastY + 20,
            head: [['Nombre', 'Tiene Licencia', 'Serial Licencia', 'Observaciones']],
            body: data.software.map(s => [s.name, s.hasLicense ? 'Sí' : 'No', s.hasLicense ? (s.licenseSerial || 'N/A') : 'N/A', s.observations || 'N/A']),
            theme: 'grid'
        });
        lastY = (doc as any).lastAutoTable.finalY;
    }

    if (data.websites && data.websites.length > 0) {
        doc.text("Credenciales Web", 14, lastY + 15);
        (doc as any).autoTable({
            startY: lastY + 20,
            head: [['URL', 'Email/Usuario', 'Contraseña', '2FA', 'Email Recuperación', 'Observaciones']],
            body: data.websites.map(w => [w.url, w.email, w.password, w.has2fa ? 'Sí' : 'No', w.recoveryEmail || 'N/A', w.observations || 'N/A']),
            theme: 'grid'
        });
    }

    doc.save(`Capturadatos_Reporte_${data.name.replace(/\s/g, '_')}.pdf`);
  };

  const handleDownloadTxt = async () => {
    const { saveAs } = await import("file-saver");
    const data = form.getValues();
    if (!data.name) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Por favor, introduce al menos el nombre del usuario para generar el informe.",
        });
        return;
    }

    let content = `Informe de Datos - Capturadatos\n`;
    content += `===================================\n\n`;
    content += `¡Atención! Este documento contiene información sensible, incluyendo contraseñas. Manéjelo con cuidado.\n\n`;
    content += `Generado el: ${new Date().toLocaleDateString()}\n\n`;

    content += `--- Información General ---\n`;
    content += `Empresa: ${data.companyName || 'N/A'}\n`;
    content += `Nombre Completo: ${data.name || 'N/A'}\n`;
    content += `Puesto de Trabajo: ${data.jobTitle || 'N/A'}\n\n`;

    if (data.contacts && data.contacts.length > 0) {
        content += `--- Contactos ---\n`;
        data.contacts.forEach((c, i) => {
            content += `Contacto #${i + 1}\n`;
            content += `  Número: ${c.number}\n`;
            content += `  Tipo: ${c.type === 'personal' ? 'Personal' : 'Empresa'}\n`;
            content += `  Tiene WhatsApp: ${c.hasWhatsapp ? 'Sí' : 'No'}\n`;
            content += `  Observaciones: ${c.observations || 'N/A'}\n\n`;
        });
    }

    if (data.equipments && data.equipments.length > 0) {
        content += `--- Equipamiento ---\n`;
        data.equipments.forEach((e, i) => {
            content += `Equipo #${i + 1}\n`;
            content += `  Nombre: ${e.name}\n`;
            content += `  Usuario: ${e.username || 'N/A'}\n`;
            content += `  Contraseña: ${e.password || 'N/A'}\n`;
            content += `  N/S: ${e.serial}\n`;
            content += `  Tiene Licencia: ${e.hasLicense ? 'Sí' : 'No'}\n`;
            if (e.hasLicense) {
              content += `  Serial Licencia: ${e.licenseSerial || 'N/A'}\n`;
            }
            content += `  Observaciones: ${e.observations || 'N/A'}\n\n`;
        });
    }

    if (data.software && data.software.length > 0) {
        content += `--- Software ---\n`;
        data.software.forEach((s, i) => {
            content += `Software #${i + 1}\n`;
            content += `  Nombre: ${s.name}\n`;
            content += `  Tiene Licencia: ${s.hasLicense ? 'Sí' : 'No'}\n`;
            if (s.hasLicense) {
              content += `  Serial Licencia: ${s.licenseSerial || 'N/A'}\n`;
            }
            content += `  Observaciones: ${s.observations || 'N/A'}\n\n`;
        });
    }

    if (data.websites && data.websites.length > 0) {
        content += `--- Credenciales Web ---\n`;
        data.websites.forEach((w, i) => {
            content += `Sitio Web #${i + 1}\n`;
            content += `  URL: ${w.url}\n`;
            content += `  Email/Usuario: ${w.email}\n`;
            content += `  Contraseña: ${w.password}\n`;
            content += `  2FA Habilitado: ${w.has2fa ? 'Sí' : 'No'}\n`;
            content += `  Email Recuperación: ${w.recoveryEmail || 'N/A'}\n`;
            content += `  Observaciones: ${w.observations || 'N/A'}\n\n`;
        });
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `Capturadatos_Reporte_${data.name.replace(/\s/g, '_')}.txt`);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="text-primary" /> Información de la Empresa
              </CardTitle>
              <CardDescription>
                Introduce el nombre de la empresa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="p.ej., ACME S.L." {...field} />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="empresa">Empresa</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.observations`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Añade tus observaciones aquí..." {...field} />
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
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendContact({
                    number: "",
                    type: "personal",
                    hasWhatsapp: false,
                    observations: "",
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Número de
                Teléfono
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
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`equipments.${index}.username`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Usuario del Equipo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="p.ej., jperez" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`equipments.${index}.password`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña del Equipo</FormLabel>
                                        <div className="relative">
                                          <FormControl>
                                              <Input 
                                                  type={passwordVisibility[`equipments-${index}`] ? 'text' : 'password'}
                                                  placeholder="••••••••" 
                                                  {...field} 
                                                  value={field.value ?? ''}
                                                  className="pr-10"
                                              />
                                          </FormControl>
                                          <button
                                              type="button"
                                              onClick={() => togglePasswordVisibility(`equipments-${index}`)}
                                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                              aria-label={passwordVisibility[`equipments-${index}`] ? "Ocultar contraseña" : "Mostrar contraseña"}
                                          >
                                              {passwordVisibility[`equipments-${index}`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                          </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                         <FormField
                            control={form.control}
                            name={`equipments.${index}.observations`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Observaciones</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Añade tus observaciones aquí..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        <div className="space-y-4">
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
                            {form.watch(`equipments.${index}.hasLicense`) && (
                                <FormField
                                    control={form.control}
                                    name={`equipments.${index}.licenseSerial`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serial de Licencia</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Introduce el serial de la licencia" {...field} value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => appendEquipment({ name: '', username: '', password: '', serial: '', hasLicense: false, licenseSerial: '', observations: '' })}>
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
                  <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-background">
                      <FormField
                          control={form.control}
                          name={`software.${index}.name`}
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Nombre del Software</FormLabel>
                                  <FormControl>
                                      <Input placeholder="p.ej., VS Code, Photoshop" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                        control={form.control}
                        name={`software.${index}.observations`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observaciones</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Añade tus observaciones aquí..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <FormField
                                control={form.control}
                                name={`software.${index}.hasLicense`}
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
                                onClick={() => removeSoftware(index)}
                                aria-label="Eliminar software"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        {form.watch(`software.${index}.hasLicense`) && (
                            <FormField
                                control={form.control}
                                name={`software.${index}.licenseSerial`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serial de Licencia</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Introduce el serial de la licencia" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                      </div>
                  </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendSoftware({ name: '', hasLicense: false, licenseSerial: '', observations: '' })}>
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
                                          <div className="relative flex-grow">
                                            <FormControl>
                                              <Input
                                                type={passwordVisibility[`websites-${index}`] ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                {...field}
                                                className="pr-10"
                                              />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility(`websites-${index}`)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                                aria-label={passwordVisibility[`websites-${index}`] ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            >
                                                {passwordVisibility[`websites-${index}`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                          </div>
                                          <Button type="button" variant="outline" size="icon" onClick={() => setActivePasswordIndex(index)} aria-label="Generar Contraseña">
                                              <Sparkles className="h-4 w-4 text-primary" />
                                          </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name={`websites.${index}.observations`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Observaciones</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Añade tus observaciones aquí..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                <Button type="button" variant="outline" onClick={() => appendWebsite({ url: '', email: '', password: '', has2fa: false, recoveryEmail: '', observations: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Sitio Web
                </Button>
            </CardContent>
          </Card>


          <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="outline" onClick={handleDownloadPdf} disabled={isSubmitting}>
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
            <Button type="button" variant="outline" onClick={handleDownloadTxt} disabled={isSubmitting}>
              <Download className="mr-2 h-4 w-4" />
              Descargar TXT
            </Button>
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
