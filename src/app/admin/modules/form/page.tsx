"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CollegeRegistration } from "@/app/models/registration";
import axiosInstance from "@/lib/axiosInstance";

const formSchema = z.object({
  collegeName: z.string().min(1, "College name is required"),
  representative: z.string().min(1, "Representative name is required"),
  status: z.enum(["Pending", "In Progress", "Completed"]),
  batchesStudents: z.string().min(1, "Number of batches/students is required"),
  financials: z.string().min(1, "Financials information is required"),
  dates: z.string().min(1, "Dates are required"),
  isMouSigned: z.boolean(),
  notes: z.string().optional(),
  trainers: z.array(z.string()).min(1, "At least one trainer is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface Trainer {
  id: string;
  name: string;
}

interface ModuleConfirmationFormProps {
  initialData?: FormValues;
  onSubmit: (data: FormValues) => Promise<void>;
}

export default function ModuleConfirmationForm({
  initialData,
  onSubmit,
}: ModuleConfirmationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCollege, setOpenCollege] = useState(false);
  const [openTrainers, setOpenTrainers] = useState(false);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [colleges, setColleges] = useState<CollegeRegistration[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      collegeName: "",
      representative: "",
      status: "Pending",
      batchesStudents: "",
      financials: "",
      dates: "",
      isMouSigned: false,
      notes: "",
      trainers: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        form.setValue(key as keyof FormValues, value);
      });
    }
  }, [initialData, form]);

  const fetchTrainers = async () => {
    try {
      const response = await axiosInstance.get("/api/trainers");
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      setTrainers(response.data.trainers || []);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trainers. Please try again.",
        variant: "destructive",
      });
      setTrainers([]);
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await axiosInstance.get("/api/colleges");
      if (response.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to fetch colleges. Please try again.",
          variant: "destructive",
        });
        throw new Error(response.statusText);
      }
      setColleges(response.data.registrations || []);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast({
        title: "Error",
        description: "Failed to fetch colleges. Please try again.",
        variant: "destructive",
      });
      setColleges([]);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [openCollege]);

  useEffect(() => {
    fetchTrainers();
  }, [openTrainers]);

  async function handleSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: "Module Confirmation Submitted",
        description:
          "Your module confirmation has been successfully submitted.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your module confirmation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Module Confirmation</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Controller
            name="collegeName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>College Name</FormLabel>
                <Popover open={openCollege} onOpenChange={setOpenCollege}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCollege}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value || "Select college"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search colleges..." />
                      <CommandEmpty>No college found.</CommandEmpty>
                      <CommandGroup>
                        {colleges.map((college) => (
                          <CommandItem
                            value={college.collegeName}
                            key={college.id}
                            onSelect={() => {
                              field.onChange(college.collegeName);
                              setOpenCollege(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === college.collegeName
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {college.collegeName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="representative"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Representative</FormLabel>
                <FormControl>
                  <Input placeholder="Enter representative name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batchesStudents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No of Batches/Students</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter number of batches/students"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="financials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financials</FormLabel>
                <FormControl>
                  <Input placeholder="Enter financial details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dates</FormLabel>
                <FormControl>
                  <Input placeholder="Enter relevant dates" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isMouSigned"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Is MOU Signed</FormLabel>
                  <FormDescription>
                    Indicate whether the Memorandum of Understanding has been
                    signed.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            name="trainers"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trainers</FormLabel>
                <Popover open={openTrainers} onOpenChange={setOpenTrainers}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTrainers}
                        className={cn(
                          "w-full justify-between",
                          !field.value.length && "text-muted-foreground"
                        )}
                      >
                        {field.value.length
                          ? trainers
                              .filter((trainer) =>
                                field.value.includes(trainer.id)
                              )
                              .map((trainer) => trainer.name)
                              .join(", ")
                          : "Select trainers"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search trainers..." />
                      <CommandEmpty>No trainer found.</CommandEmpty>
                      <CommandGroup>
                        {trainers.map((trainer) => (
                          <CommandItem
                            value={trainer.name}
                            key={trainer.id}
                            onSelect={() => {
                              const updatedValue = field.value.includes(
                                trainer.id
                              )
                                ? field.value.filter(
                                    (value) => value !== trainer.id
                                  )
                                : [...field.value, trainer.id];
                              field.onChange(updatedValue);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value.includes(trainer.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {trainer.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Module Confirmation"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
