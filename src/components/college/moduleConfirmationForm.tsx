"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Textarea } from "src/components/ui/textarea";
import { Switch } from "src/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

import type { ModuleConfirmation } from "@/app/models/moduleConfirmation";
import type { CollegeRegistration } from "@/app/models/registration";
import type { User } from "@/app/models/user";

const formSchema = z.object({
  college: z.object({
    id: z.string(),
    collegeName: z.string(),
  }).nullable(),
  spoc: z.string().min(2, "SPOC name is required"),
  status: z.enum(["pending", "active", "completed"]),
  batchesCount: z.string().min(1, "Number of batches is required"),
  financials: z.number().min(0, "Financials must be a positive number"),
  startDate: z.date(),
  endDate: z.date(),
  isMouSigned: z.boolean(),
  notes: z.string().optional(),
  trainers: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
});

type ModuleFormProps = {
  initialData?: ModuleConfirmation;
  onSubmit?: (data: ModuleConfirmation) => Promise<void>;
  isEdit?: boolean;
};

export default function ModuleForm({ 
  initialData, 
  onSubmit: propOnSubmit,
  isEdit = false 
}: ModuleFormProps) {
  const [colleges, setColleges] = useState<CollegeRegistration[]>([]);
  const [trainers, setTrainers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      college: null,
      spoc: "",
      status: "pending",
      batchesCount: "",
      financials: 1000,
      startDate: new Date(),
      endDate: new Date(),
      isMouSigned: false,
      notes: "",
      trainers: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [collegesRes, trainersRes] = await Promise.all([
          axios.get("/api/colleges"),
          axios.get("/api/users/trainers")
        ]);

        if (collegesRes.data.success) {
          setColleges(collegesRes.data.registrations);
        }
        if (trainersRes.data.success) {
          setTrainers(trainersRes.data.users);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load required data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (propOnSubmit) {
        await propOnSubmit(data as ModuleConfirmation);
      } else {
        const response = await axios.post("/api/modules/module", data);
        if (response.data.success) {
          toast({
            title: "Success",
            description: `Module ${isEdit ? "updated" : "created"} successfully`,
          });
          router.push('/admin/modules');
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} module`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Module" : "Add Module"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="college"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (value === "add") {
                        router.push("/admin/colleges/add");
                        return;
                      }
                      const selectedCollege = colleges.find(c => c.id === value);
                      field.onChange(selectedCollege || null);
                    }}
                    value={field.value?.id || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="bg-white"
                    >
                      <SelectItem value="add">
                        <span className="text-muted-foreground">Add College</span>
                      </SelectItem>
                      {colleges.map((college) => (
                        <SelectItem key={college.id} value={college.id!}>
                          {college.collegeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="spoc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SPOC</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter spoc name" {...field} />
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
                      <SelectContent className="bg-white">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchesCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No of Batches/Students</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter number of batches" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                    <span className="text-sm text-right text-gray-500">
                      per student
                    </span>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isMouSigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">MOU Signed</FormLabel>
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
              name="trainers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainers</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const trainer = trainers.find(t => t.id === value);
                      if (trainer && !field.value.find(t => t.id === trainer.id)) {
                        field.onChange([...field.value, trainer]);
                      }
                    }}
                    value=""
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trainers" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="bg-white"
                    >
                      {trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id!}>
                          {trainer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    {field.value.map((trainer) => (
                      <div
                        key={trainer.id}
                        className="flex items-center justify-between p-2 bg-secondary rounded-md mt-1"
                      >
                        <span>{trainer.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            field.onChange(field.value.filter(t => t.id !== trainer.id));
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
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
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Update" : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
