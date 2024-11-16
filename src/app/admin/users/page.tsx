"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "@/app/models/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { db } from "@/lib/firebase";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useToast, toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role is required"),
  email: z.string().email("Invalid email address"),
  contact: z.string().min(10, "Contact number must be at least 10 characters"),
});

export default function Component() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  // const toast = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      contact: "",
    },
  });

  
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok || response.status === 200) {
          const data = await response.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch trainers:", error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (editingUser) {
      try {
        // check if email changed
        if (editingUser.email !== data.email) {
          toast({
            title: "Update failed",
            description: "Email cannot be changed",
            variant: "destructive",
          });
          return;
        }

        const userRef = doc(db, "users", editingUser.id!);
        await updateDoc(userRef, data);

        setUsers(
          users.map((t) => (t.id === editingUser.id ? { ...data, id: t.id } : t))
        );

        toast({
          title: "Success",
          description: "User updated successfully",
          variant: "default",
        });

        setEditingUser(null);
      } catch (error) {
        toast({
          title: "Update failed",
          description: "Failed to update user",
          variant: "destructive",
        });
      }

    } else {
      const addUser = async () => {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok || response.status === 200) {
          const data = await response.json();
          setUsers([...users, { ...data, id: Date.now().toString() }]);
          toast({
            title: "Success",
            description: "User added successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Failed",
            description: "Failed to add user",
            variant: "destructive",
          });
          console.error("Failed to add trainer:", response.statusText);
        }
      };
      addUser();
    }
    form.reset();
  };

  const editUser = (trainer: User) => {
    setEditingUser(trainer);
    form.reset(trainer);
  };

  const deleteUser = async (id: string) => {

    // take conset from user
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    const userRef = doc(db, "users", id)
    try{
      await deleteDoc(userRef)
      setUsers(users.filter((user) => user.id !== id));
      toast({
        title: "Success",
        description: "User deleted successfully",
        variant: "default",
      });
    }catch(e){
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{editingUser ? "Edit User" : "Add New User"}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={"Trainer"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Trainer">Trainer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  form.reset();
                  setEditingUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingUser ? "Update" : "Add"} User
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && <div
                className="w-max items-center text-center"
              >Loading...</div>}
              {users.map((trainer) => (
                <TableRow key={trainer.id}>
                  <TableCell>{trainer.name}</TableCell>
                  <TableCell>{trainer.role}</TableCell>
                  <TableCell>{trainer.email}</TableCell>
                  <TableCell>{trainer.contact}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => editUser(trainer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {
                        trainer.role !== "college" &&
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteUser(trainer.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
