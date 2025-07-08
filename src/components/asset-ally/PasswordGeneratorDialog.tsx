"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordGeneratorSchema, type PasswordGeneratorValues } from "@/lib/schemas";
import { generatePasswordAction } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2, Sparkles, Check } from "lucide-react";

interface PasswordGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPasswordGenerated: (password: string) => void;
}

export function PasswordGeneratorDialog({
  open,
  onOpenChange,
  onPasswordGenerated,
}: PasswordGeneratorDialogProps) {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<PasswordGeneratorValues>({
    resolver: zodResolver(passwordGeneratorSchema),
    defaultValues: {
      length: 16,
      includeNumbers: true,
      includeSymbols: true,
    },
  });

  const onSubmit = async (data: PasswordGeneratorValues) => {
    setIsLoading(true);
    setGeneratedPassword("");
    const result = await generatePasswordAction(data);
    setIsLoading(false);

    if (result.success && result.password) {
      setGeneratedPassword(result.password);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  const copyToClipboard = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard.",
    });
  };
  
  const applyPassword = () => {
    onPasswordGenerated(generatedPassword);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" /> AI Password Generator
          </DialogTitle>
          <DialogDescription>
            Create a strong, secure password based on your criteria.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password Length</FormLabel>
                    <span className="text-sm font-medium text-primary">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={8}
                      max={128}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-4">
                <FormField
                control={form.control}
                name="includeNumbers"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                        <FormLabel>Include Numbers</FormLabel>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="includeSymbols"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                        <FormLabel>Include Symbols</FormLabel>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                )}
                />
            </div>
             <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Password
            </Button>
          </form>
        </Form>
        {generatedPassword && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Generated Password</label>
            <div className="flex gap-2">
              <Input value={generatedPassword} readOnly className="font-mono" />
              <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy password">
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
             <DialogFooter className="pt-4">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={applyPassword}>Apply Password</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
