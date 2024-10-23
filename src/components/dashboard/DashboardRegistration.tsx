"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Users, FileSpreadsheet, CreditCard, Menu } from 'lucide-react'
import axios from 'axios'

// Mock data for states, districts, and colleges
const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu']
const districts = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai']
}
const colleges = {
  'Mumbai': ['Mumbai University', 'IIT Bombay'],
  'Pune': ['Pune University', 'COEP Pune'],
  'Nagpur': ['Nagpur University', 'VNIT Nagpur'],
  'Bangalore': ['Bangalore University', 'IISc Bangalore'],
  'Mysore': ['University of Mysore', 'NIE Mysore'],
  'Hubli': ['Dharwad University', 'KLE Technological University'],
  'Chennai': ['Anna University', 'IIT Madras'],
  'Coimbatore': ['PSG College of Technology', 'Coimbatore Institute of Technology'],
  'Madurai': ['Madurai Kamaraj University', 'Thiagarajar College of Engineering']
}

export default function Component() {
  const [step, setStep] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    collegeName: '',
    repContact: '',
    repEmail: '',
    repName: '',
    role: '',
    courses: [{ course: '', count: '' }],
    paymentMethod: '',
    coupon: '',
    uploadLater: false
  })
  const [excelFile, setExcelFile] = useState<File | null>(null)

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])
  const [availableColleges, setAvailableColleges] = useState<string[]>([])

  useEffect(() => {
    if (formData.state) {
        setAvailableDistricts(districts[formData.state as keyof typeof districts] || [])
        setFormData(prev => ({ ...prev, district: '', collegeName: '' }))
    }
  }, [formData.state])

  useEffect(() => {
    if (formData.district) {
        setAvailableColleges(colleges[formData.state as keyof typeof colleges] || [])
      setFormData(prev => ({ ...prev, collegeName: '' }))
    }
  }, [formData.district])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, { course: '', count: '' }]
    }))
  }

  const removeCourse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }))
  }

  const updateCourse = (index: number, field: 'course' | 'count', value: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map((course, i) =>
        i === index ? { ...course, [field]: value } : course
      )
    }))
  }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setExcelFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      if (step === 3 && !excelFile && !formData.uploadLater) {
        alert("Please upload a file or select 'Upload later' to continue.")
        return
      }
      setStep(step + 1)
    } else {
      try {
        const response = await initiateCashfreePayment(formData)
        console.log(response)
        // Here you would typically redirect the user to the Cashfree payment page
        // or handle the payment flow based on the Cashfree SDK documentation
        if (response.success) {
          // Redirect to Cashfree payment page or initiate Cashfree SDK
          // This depends on how you want to implement the payment flow
          console.log('Payment initiated:', response);
          // For example, you could redirect to a payment page:
          // window.location.href = `https://sandbox.cashfree.com/pg/view/${response.paymentSessionId}`;
        } else {
          throw new Error('Payment initiation failed');
        }
      } catch (error) {
        console.error('Payment initiation failed:', error)
      }
    }
  }

  const initiateCashfreePayment = async (data: any) => {
    try {
      const response = await axios.post('/api/payment', {
        amount: calculateTotalAmount(data),
        currency: 'INR',
        customerDetails: {
          id: data.repEmail,
          name: data.repName,
          email: data.repEmail,
          phone: data.repContact,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  };

  const calculateTotalAmount = (data: any) => {
    return data.courses.reduce((total: number, course: { count: string }) => {
      const participantCount = parseInt(course.count.split('-')[0], 10);
      return total + participantCount * 100; // Assuming 100 INR per participant
    }, 0);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select onValueChange={(value) => handleSelectChange('state', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Select onValueChange={(value) => handleSelectChange('district', value)} disabled={!formData.state}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collegeName">College Name</Label>
              <Select onValueChange={(value) => handleSelectChange('collegeName', value)} disabled={!formData.district}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {availableColleges.map((college) => (
                    <SelectItem key={college} value={college}>{college}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repName">Representative Name</Label>
              <Input
                id="repName"
                name="repName"
                value={formData.repName}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repEmail">Representative Email</Label>
              <Input
                id="repEmail"
                name="repEmail"
                type="email"
                value={formData.repEmail}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repContact">Representative Contact</Label>
              <Input
                id="repContact"
                name="repContact"
                type="tel"
                value={formData.repContact}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => handleSelectChange('role', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Principal">Principal</SelectItem>
                  <SelectItem value="Dean">Dean</SelectItem>
                  <SelectItem value="HOD">HOD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">Next</Button>
          </form>
        )
      case 2:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <Label>Courses and Participant Counts</Label>
              {formData.courses.map((course, index) => (
                <div key={index} className="flex space-x-2">
                  <Select onValueChange={(value) => updateCourse(index, 'course', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white flex-grow">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B.Tech">B.Tech</SelectItem>
                      <SelectItem value="M.Tech">M.Tech</SelectItem>
                      <SelectItem value="MBA">MBA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => updateCourse(index, 'count', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white flex-grow">
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50-100">50-100</SelectItem>
                      <SelectItem value="100-200">100-200</SelectItem>
                      <SelectItem value="200+">200+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="destructive" onClick={() => removeCourse(index)} className="px-2 py-0">
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addCourse} className="w-full">
                Add Course
              </Button>
            </div>
            <Button type="submit" className="w-full">Next</Button>
          </form>
        )
      case 3:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="excelFile">Upload Students Excel Sheet</Label>
              <Input
                id="excelFile"
                name="excelFile"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="bg-gray-800 border-gray-700 text-white"
                disabled={formData.uploadLater}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="uploadLater"
                checked={formData.uploadLater}
                onChange={(e) => setFormData(prev => ({ ...prev, uploadLater: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="uploadLater">Upload later</Label>
            </div>
            <Button type="submit" className="w-full">
              {formData.uploadLater ? 'Next' : excelFile ? 'Next' : 'Please upload file or select "Upload later" to continue'}
            </Button>
          </form>
        )
      case 4:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Select Payment Method</Label>
              <Select onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creditCard">Credit Card</SelectItem>
                  <SelectItem value="debitCard">Debit Card</SelectItem>
                  <SelectItem value="netBanking">Net Banking</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon">Coupon Code (Optional)</Label>
              <Input
                id="coupon"
                name="coupon"
                value={formData.coupon}
                onChange={handleInputChange}
                placeholder="Enter coupon code"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!formData.paymentMethod}>
              Proceed to Payment
            </Button>
          </form>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className={`bg-gray-800 w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto`}>
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 py-4">
            <li>
              <a href="#" className={`flex  items-center px-4 py-2 hover:bg-gray-700 ${step === 1 ? 'bg-gray-700' : ''}`} onClick={() => setStep(1)}>
                <Home className="mr-3 h-5 w-5" />
                College Details
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center px-4 py-2 hover:bg-gray-700 ${step === 2 ? 'bg-gray-700' : ''}`} onClick={() => setStep(2)}>
                <Users className="mr-3 h-5 w-5" />
                Courses
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center px-4 py-2 hover:bg-gray-700 ${step === 3 ? 'bg-gray-700' : ''}`} onClick={() => setStep(3)}>
                <FileSpreadsheet className="mr-3 h-5 w-5" />
                Upload Excel
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center px-4 py-2 hover:bg-gray-700 ${step === 4 ? 'bg-gray-700' : ''}`} onClick={() => setStep(4)}>
                <CreditCard className="mr-3 h-5 w-5" />
                Payment
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">College Registration</h1>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>
        <main className="flex-grow p-6 overflow-y-auto">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Step {step} of 4</CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button onClick={() => setStep(step - 1)} variant="outline">
                  Back
                </Button>
              )}
              <div className="text-sm">Step {step} of 4</div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  )
}