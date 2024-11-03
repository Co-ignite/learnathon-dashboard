"use client"

import { useState, useEffect, useCallback } from "react"
import { FilterIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { CollegeRegistration } from "@/app/models/registration"
import { Participant } from "@/app/models/participant"

type SortConfig = {
  field: keyof Participant
  direction: 'asc' | 'desc'
}

export default function ParticipantsList() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [colleges, setColleges] = useState<CollegeRegistration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    collegeId: "",
    participantName: ""
  })
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'Name',
    direction: 'asc'
  })
  const [lastDoc, setLastDoc] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    fetchColleges()
  }, [])

  const fetchParticipants = useCallback(async (reset: boolean = false) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        ...(debouncedFilters.collegeId && { collegeId: debouncedFilters.collegeId.toString() }),
        ...(debouncedFilters.participantName && { participantName: debouncedFilters.participantName.toString() }),
        sortField: sortConfig.field.toString(),
        sortDirection: sortConfig.direction.toString(),
        pageSize: '20', // Increased page size for better performance
        ...(lastDoc && !reset && { lastDoc: lastDoc.toString() }) // Ensure lastDoc is a string
      })

      const response = await fetch(`/api/participants?${params}`)
      if (!response.ok) throw new Error('Failed to fetch participants')
      const data = await response.json()

      setParticipants(prev => reset ? data.participants : [...prev, ...data.participants])
      setLastDoc(data.lastDoc)
      setHasMore(data.hasMore)
    } catch (error) {
      setError('Error fetching participants. Please try again.')
      console.error('Error fetching participants:', error)
    } finally {
      setLoading(false)
    }
    }, [debouncedFilters, sortConfig, lastDoc]
  )

  useEffect(() => {
    fetchParticipants(true)
  }, [])

  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges')
      if (!response.ok) throw new Error('Failed to fetch colleges')
      const data = await response.json()
      setColleges(data.registrations)
    } catch (error) {
      console.error('Error fetching colleges:', error)
      setError('Failed to fetch colleges')
    }
  }


  const handleFilterChange = (key: keyof typeof filters) => (value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setLastDoc(null)
  }

  const handleSort = (field: keyof Participant) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }))
    setLastDoc(null)
  }

  const getSortIcon = (field: keyof Participant) => {
    if (sortConfig.field === field) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUpIcon className="ml-2 h-4 w-4" />
      ) : (
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      )
    }
    return <FilterIcon className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100" />
  }

  const getCollegeName = (collegeId: string) => {
    return colleges.find(c => c.id === collegeId)?.collegeName || 'Unknown College'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Participants List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select
            value={filters.collegeId}
            onValueChange={(value) => handleFilterChange("collegeId")(value)}
          >
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Select College" />
            </SelectTrigger>
            <SelectContent
              className="bg-white"
            >
              {colleges.map((college) => (
                <SelectItem key={college.id} value={college.id!}>
                  {college.collegeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search by participant name"
            value={filters.participantName}
            onChange={(e) => handleFilterChange("participantName")(e.target.value)}
            className="w-full sm:w-[300px]"
          />
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="group cursor-pointer"
                  onClick={() => handleSort('Name')}
                >
                  Name {getSortIcon('Name')}
                </TableHead>
                <TableHead>College</TableHead>
                <TableHead
                  className="group cursor-pointer"
                  onClick={() => handleSort('Branch')}
                >
                  Branch {getSortIcon('Branch')}
                </TableHead>
                <TableHead
                  className="group cursor-pointer"
                  onClick={() => handleSort('Degree')}
                >
                  Degree {getSortIcon('Degree')}
                </TableHead>
                <TableHead
                  className="group cursor-pointer"
                  onClick={() => handleSort('Year')}
                >
                  Year {getSortIcon('Year')}
                </TableHead>
                <TableHead
                  className="group cursor-pointer"
                  onClick={() => handleSort('Percentage')}
                >
                  Percentage {getSortIcon('Percentage')}
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.Name}</TableCell>
                  <TableCell>{getCollegeName(participant.collegeId)}</TableCell>
                  <TableCell>{participant.Branch}</TableCell>
                  <TableCell>{participant.Degree}</TableCell>
                  <TableCell>{participant.Year}</TableCell>
                  <TableCell>{participant.Percentage}%</TableCell>
                  <TableCell>{participant.Contact}</TableCell>
                  <TableCell>{participant.Email}</TableCell>
                </TableRow>
              ))}
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!loading && participants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No participants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {hasMore && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchParticipants(false)}
              disabled={loading}
            >
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}