'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useNavigation } from '@/hooks/use-navigation';
import { employeesApi } from '@/lib/api/employees';
import { departmentsApi } from '@/lib/api/departments';
import type { Employee, Department, UpdateEmployeeRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function EditEmployeePage() {
  const params = useParams();
  const navigation = useNavigation();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<UpdateEmployeeRequest>({
    position: '',
    departmentId: '',
    managerId: '',
    status: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [empResponse, deptResponse, allEmpResponse] = await Promise.all([
          employeesApi.getEmployeeById(params.id as string),
          departmentsApi.getAllDepartments(),
          employeesApi.getAllEmployees(),
        ]);

        // Handle both response formats for employee
        let employeeData: Employee | null = null;
        if (empResponse.success && empResponse.data) {
          employeeData = empResponse.data;
        } else if ('id' in empResponse) {
          employeeData = empResponse as unknown as Employee;
        }

        if (employeeData) {
          setEmployee(employeeData);
          setFormData({
            position: employeeData.position,
            departmentId: employeeData.department.id,
            managerId: employeeData.manager?.id || '',
            status: employeeData.status,
          });
        }

        // Handle departments response
        if (deptResponse.success && deptResponse.data) {
          setDepartments(deptResponse.data);
        } else if (Array.isArray(deptResponse)) {
          setDepartments(deptResponse as unknown as Department[]);
        }

        // Handle employees response
        if (allEmpResponse.success && allEmpResponse.data) {
          setEmployees(allEmpResponse.data);
        } else if (Array.isArray(allEmpResponse)) {
          setEmployees(allEmpResponse as unknown as Employee[]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await employeesApi.updateEmployee(params.id as string, formData);
      if (response.success) {
        toast.success('Employee updated successfully');
        navigation.push('/dashboard/admin/employees');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
    } finally {
      setSaving(false);
    }
  };

  const potentialManagers = employees.filter(
    (emp) => emp.id !== params.id && ['MANAGER', 'HR_MANAGER', 'ADMIN'].includes(emp.position)
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => navigation.push('/dashboard/admin/employees')}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Employee not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigation.push('/dashboard/admin/employees')}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Edit Employee</h2>
          </div>
          <p className="text-muted-foreground">
            Update employee information for {employee.user.firstName} {employee.user.lastName}
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Employee Information */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Basic employee details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={`${employee.user.firstName} ${employee.user.lastName}`}
                disabled
                className="bg-muted"
              />
              <p className="text-muted-foreground text-xs">To change name, edit the user profile</p>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={employee.user.email} disabled className="bg-muted" />
              <p className="text-muted-foreground text-xs">
                To change email, edit the user profile
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="HR_MANAGER">HR Manager</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Department & Manager */}
        <Card>
          <CardHeader>
            <CardTitle>Department & Reporting</CardTitle>
            <CardDescription>Department assignment and manager</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department *</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger id="departmentId">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerId">Manager (Optional)</Label>
              <Select
                value={formData.managerId || 'no-manager'}
                onValueChange={(value) =>
                  setFormData({ ...formData, managerId: value === 'no-manager' ? '' : value })
                }
              >
                <SelectTrigger id="managerId">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-manager">No Manager</SelectItem>
                  {potentialManagers.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.user.firstName} {emp.user.lastName} - {emp.department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted rounded-md p-4">
              <h4 className="mb-2 text-sm font-medium">Current Information</h4>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p>
                  <strong>Current Department:</strong> {employee.department.name}
                </p>
                <p>
                  <strong>Current Manager:</strong>{' '}
                  {employee.manager
                    ? `${employee.manager.user.firstName} ${employee.manager.user.lastName}`
                    : 'No manager'}
                </p>
                <p>
                  <strong>Hire Date:</strong>{' '}
                  {new Date(employee.hireDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
