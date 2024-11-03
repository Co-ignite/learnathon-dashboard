"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";
import { CollegeRegistration } from "@/app/models/registration";
import { User } from "@/app/models/user";

const formSchema = z.object({
  collegeName: z.string().min(2, "College name must be at least 2 characters"),
  spoc: z.string().min(2, "spoc name is required"),
  status: z.string(),
  batchesCount: z.string(),
  financials: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  isMouSigned: z.boolean(),
  notes: z.string().optional(),
  trainers: z.array(z.string()),
});

type ModuleConfirmationFormProps = {
  initialData?: z.infer<typeof formSchema>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isEdit?: boolean;
};

export default function Component(
  { initialData, onSubmit, isEdit = false }: ModuleConfirmationFormProps = {
    onSubmit: (data) => console.log(data),
    isEdit: false,
  }
) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      collegeName: "",
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
  const [colleges, setColleges] = useState<CollegeRegistration[]>([]);
  const [trainers, setTrainers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) {
      setLoading(true);

      const fetchRegistrations = async () => {
        try {
          const response = await axios.get("/api/colleges");
          if (response.data.success) {
            setColleges(response.data.registrations);
          }
        } catch (error) {
          console.error("Failed to fetch college registrations:", error);
        } finally {
          setLoading(false);
        }
      };
      const fetchTrainers = async () => {
        try {
          const response = await axios.get("/api/users/trainers");
          if (response.data.success) {
            setTrainers(response.data.users);
          }
        } catch (error) {
          console.error("Failed to fetch trainers:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTrainers();
      fetchRegistrations();
    }
  }, [initialData]);

  return (
    <Card className="w-full max-w-4xl mx-auto my-10">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Module" : "Add Module"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="collegeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select college name" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem
                            key={college.id}
                            value={college.collegeName}
                          >
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
                    <Controller
                      name="trainers"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            const updatedValue = field.value.includes(value)
                              ? field.value.filter((v) => v !== value)
                              : [...field.value, value];
                            field.onChange(updatedValue);
                          }}
                          value={""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trainers" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {trainers.map((trainer) => (
                              <SelectItem key={trainer.id} value={trainer.name}>
                                {trainer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Update" : "Submit"}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
