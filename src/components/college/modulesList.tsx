"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import type { ModuleConfirmation } from '@/app/models/moduleConfirmation';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface ModulesListProps {
  initialModules?: ModuleConfirmation[];
}

export default function ModulesList({ initialModules = [] }: ModulesListProps) {
  const [modules, setModules] = useState<ModuleConfirmation[]>(initialModules);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<string | null>(null);
  const router = useRouter();

  const fetchModules = async (reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (!reset && lastDoc) params.append('lastDocId', lastDoc);
      params.append('page', reset ? '1' : page.toString());
      params.append('pageSize', '10');

      const response = await axios.get(`/api/modules?${params.toString()}`);
      
      if (response.data.success) {
        setModules(reset ? response.data.modules : [...modules, ...response.data.modules]);
        setHasMore(response.data.hasMore);
        setLastDoc(response.data.lastDoc);
        if (reset) setPage(1);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch modules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules(true);
  }, [status]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredModules = modules.filter(module => 
    module.college?.collegeName.toLowerCase().includes(search.toLowerCase()) ||
    module.spoc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Modules</CardTitle>
        <Button onClick={() => router.push('/admin/modules/form')}>
          <Plus className="mr-2 h-4 w-4" /> Add Module
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search by college or SPOC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College</TableHead>
                <TableHead>SPOC</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Batches</TableHead>
                <TableHead>MOU</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">
                    {module.college?.collegeName}
                  </TableCell>
                  <TableCell>{module.spoc}</TableCell>
                  <TableCell>{getStatusBadge(module.status)}</TableCell>
                  <TableCell>{format(new Date(module.startDate), 'PP')}</TableCell>
                  <TableCell>{format(new Date(module.endDate), 'PP')}</TableCell>
                  <TableCell>{module.batchesCount}</TableCell>
                  <TableCell>
                    <Badge variant={module.isMouSigned ? "default" : "secondary"}>
                      {module.isMouSigned ? "Signed" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/modules/${module.id}`)}
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/modules/${module.id}/edit`)}
                        >
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredModules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No modules found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {hasMore && !loading && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => {
                setPage(prev => prev + 1);
                fetchModules();
              }}
            >
              Load More
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}