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
  
  const handleDownloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

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
    doc.text("Informe de Salud - Famysalud", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);
    
    doc.setFontSize(14);
    doc.text("Información del Usuario", 14, 45);
    autoTable(doc, {
      startY: 50,
      head: [['Nombre Completo', 'Puesto de Trabajo']],
      body: [[data.name, data.jobTitle]],
      theme: 'grid'
    });
    
    let lastY = (doc as any).lastAutoTable.finalY || 70;

    if (data.contacts && data.contacts.length > 0) {
        doc.text("Contactos", 14, lastY + 15);
        autoTable(doc, {
            startY: lastY + 20,
            head: [['Número', 'Tipo', 'Tiene WhatsApp']],
            body: data.contacts.map(c => [c.number, c.type === 'personal' ? 'Personal' : 'Empresa', c.hasWhatsapp ? 'Sí' : 'No']),
            theme: 'grid'
        });
        lastY = (doc as any).lastAutoTable.finalY;
    }

    if (data.equipments && data.equipments.length > 0) {
        doc.text("Equipamiento", 14, lastY + 15);
        autoTable(doc, {
            startY: lastY + 20,
            head: [['Nombre', 'N/S', 'Tiene Licencia']],
            body: data.equipments.map(e => [e.name, e.serial, e.hasLicense ? 'Sí' : 'No']),
            theme: 'grid'
        });
        lastY = (doc as any).lastAutoTable.finalY;
    }
    
    if (data.software && data.software.length > 0) {
        doc.text("Software", 14, lastY + 15);
        autoTable(doc, {
            startY: lastY + 20,
            head: [['Nombre', 'Tiene Licencia']],
            body: data.software.map(s => [s.name, s.hasLicense ? 'Sí' : 'No']),
            theme: 'grid'
        });
        lastY = (doc as any).lastAutoTable.finalY;
    }

    if (data.websites && data.websites.length > 0) {
        doc.text("Credenciales Web (Contraseñas no incluidas)", 14, lastY + 15);
        autoTable(doc, {
            startY: lastY + 20,
            head: [['URL', 'Email/Usuario', '2FA', 'Email Recuperación']],
            body: data.websites.map(w => [w.url, w.email, w.has2fa ? 'Sí' : 'No', w.recoveryEmail || 'N/A']),
            theme: 'grid'
        });
    }

    doc.save(`Famysalud_Reporte_${data.name.replace(/\s/g, '_')}.pdf`);
  };

  const handleDownloadWord = async () => {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } = await import("docx");
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

    const sections = [
        new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun("Informe de Salud - Famysalud")],
        }),
        new Paragraph({
            children: [new TextRun(`Generado el: ${new Date().toLocaleDateString()}`)],
        }),
        new Paragraph({ text: "" }),
    ];

    sections.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Información del Usuario")] }));
    sections.push(new Paragraph({ children: [new TextRun({ text: "Nombre: ", bold: true }), new TextRun(data.name || '')] }));
    sections.push(new Paragraph({ children: [new TextRun({ text: "Puesto: ", bold: true }), new TextRun(data.jobTitle || '')] }));
    sections.push(new Paragraph({ text: "" }));

    const tableBorders = {
        top: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
    };
    
    const createHeaderCell = (text: string) => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
    });
    
    const createCell = (text: string) => new TableCell({
        children: [new Paragraph(text)],
    });

    if (data.contacts && data.contacts.length > 0) {
        sections.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Contactos")] }));
        const contactRows = [
            new TableRow({ children: [createHeaderCell("Número"), createHeaderCell("Tipo"), createHeaderCell("Tiene WhatsApp")] })
        ].concat(data.contacts.map(c => new TableRow({ children: [createCell(c.number), createCell(c.type === 'personal' ? 'Personal' : 'Empresa'), createCell(c.hasWhatsapp ? 'Sí' : 'No')] })));
        sections.push(new Table({ rows: contactRows, width: { size: 100, type: WidthType.PERCENTAGE }, borders: tableBorders }));
        sections.push(new Paragraph({ text: "" }));
    }

    if (data.equipments && data.equipments.length > 0) {
        sections.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Equipamiento")] }));
        const equipmentRows = [
            new TableRow({ children: [createHeaderCell("Nombre"), createHeaderCell("N/S"), createHeaderCell("Tiene Licencia")] })
        ].concat(data.equipments.map(e => new TableRow({ children: [createCell(e.name), createCell(e.serial), createCell(e.hasLicense ? 'Sí' : 'No')] })));
        sections.push(new Table({ rows: equipmentRows, width: { size: 100, type: WidthType.PERCENTAGE }, borders: tableBorders }));
        sections.push(new Paragraph({ text: "" }));
    }

    if (data.software && data.software.length > 0) {
        sections.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Software")] }));
        const softwareRows = [
            new TableRow({ children: [createHeaderCell("Nombre"), createHeaderCell("Tiene Licencia")] })
        ].concat(data.software.map(s => new TableRow({ children: [createCell(s.name), createCell(s.hasLicense ? 'Sí' : 'No')] })));
        sections.push(new Table({ rows: softwareRows, width: { size: 100, type: WidthType.PERCENTAGE }, borders: tableBorders }));
        sections.push(new Paragraph({ text: "" }));
    }

    if (data.websites && data.websites.length > 0) {
        sections.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Credenciales Web (Contraseñas no incluidas)")] }));
        const websiteRows = [
            new TableRow({ children: [createHeaderCell("URL"), createHeaderCell("Email/Usuario"), createHeaderCell("2FA"), createHeaderCell("Email Recuperación")] })
        ].concat(data.websites.map(w => new TableRow({ children: [
            createCell(w.url), 
            createCell(w.email), 
            createCell(w.has2fa ? 'Sí' : 'No'),
            createCell(w.recoveryEmail || 'N/A')
        ] })));
        sections.push(new Table({ rows: websiteRows, width: { size: 100, type: WidthType.PERCENTAGE }, borders: tableBorders }));
    }

    const doc = new Document({ sections: [{ children: sections }] });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `Famysalud_Reporte_${data.name.replace(/\s/g, '_')}.docx`);
    });
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
                  </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendSoftware({ name: '', hasLicense: false })}>
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


          <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="outline" onClick={handleDownloadPdf} disabled={isSubmitting}>
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
            <Button type="button" variant="outline" onClick={handleDownloadWord} disabled={isSubmitting}>
              <Download className="mr-2 h-4 w-4" />
              Descargar Word
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
