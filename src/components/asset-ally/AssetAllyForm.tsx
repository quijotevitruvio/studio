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
        title: "Success!",
        description: "Asset information has been saved.",
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
                <User className="text-primary" /> User Information
              </CardTitle>
              <CardDescription>
                Enter the basic details of the user.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
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
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Engineer" {...field} />
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
                <Phone className="text-primary" /> Contact Information
              </CardTitle>
              <CardDescription>
                Add one or more contact numbers.
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
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
                              <FormLabel>Has WhatsApp?</FormLabel>
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
                          aria-label="Remove phone number"
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
                <PlusCircle className="mr-2 h-4 w-4" /> Add Phone Number
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Laptop className="text-primary" /> Equipment
                </CardTitle>
                <CardDescription>List all assigned equipment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {equipmentFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-background">
                         <FormField
                            control={form.control}
                            name={`equipments.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Equipment Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Dell Latitude 7420" {...field} />
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
                                        <FormLabel>Serial Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., ABC123XYZ" {...field} />
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
                                            <FormLabel>Has License?</FormLabel>
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
                                    aria-label="Remove equipment"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                         </div>
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => appendEquipment({ name: '', serial: '', hasLicense: false })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Equipment
                 </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Code className="text-primary" /> Software Applications
                </CardTitle>
                <CardDescription>List frequently used software.</CardDescription>
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
                                        <Input placeholder="e.g., VS Code, Photoshop" {...field} />
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
                            aria-label="Remove software"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendSoftware({ name: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Software
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="text-primary" /> Website Credentials
                </CardTitle>
                <CardDescription>Securely store website login details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {websiteFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-background">
                        <FormField
                            control={form.control}
                            name={`websites.${index}.url`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website URL</FormLabel>
                                    <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
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
                                        <FormLabel>Email / Username</FormLabel>
                                        <FormControl><Input placeholder="user@example.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`websites.${index}.password`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                            <Button type="button" variant="outline" size="icon" onClick={() => setActivePasswordIndex(index)} aria-label="Generate Password">
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
                                        <FormLabel>Recovery Email (optional)</FormLabel>
                                        <FormControl><Input placeholder="recovery@example.com" {...field} /></FormControl>
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
                                            <FormLabel>2FA Enabled?</FormLabel>
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeWebsite(index)} aria-label="Remove website">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendWebsite({ url: '', email: '', password: '', has2fa: false, recoveryEmail: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Website
                </Button>
            </CardContent>
          </Card>


          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save All Information
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
