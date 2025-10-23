import type { Meta } from '@storybook/react';
import { DataGrid } from './DataGrid';
import { ColumnDef } from '@tanstack/react-table';
import './DataGrid.css';

// Sample data types
interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  owner: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
}

interface Appointment {
  id: string;
  patientName: string;
  clientName: string;
  appointmentType: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

// Sample data
const patientData: Patient[] = [
  { id: 'PAT-001', name: 'Max', species: 'Dog', breed: 'Golden Retriever', age: 5, owner: 'John Smith', lastVisit: '2024-10-15', status: 'Active' },
  { id: 'PAT-002', name: 'Luna', species: 'Cat', breed: 'Siamese', age: 3, owner: 'Jane Doe', lastVisit: '2024-10-18', status: 'Active' },
  { id: 'PAT-003', name: 'Charlie', species: 'Dog', breed: 'Labrador', age: 7, owner: 'Bob Johnson', lastVisit: '2024-10-10', status: 'Active' },
  { id: 'PAT-004', name: 'Bella', species: 'Cat', breed: 'Persian', age: 2, owner: 'Alice Brown', lastVisit: '2024-10-12', status: 'Active' },
  { id: 'PAT-005', name: 'Rocky', species: 'Dog', breed: 'German Shepherd', age: 4, owner: 'Mike Wilson', lastVisit: '2024-10-20', status: 'Active' },
  { id: 'PAT-006', name: 'Mittens', species: 'Cat', breed: 'Tabby', age: 6, owner: 'Sarah Davis', lastVisit: '2024-09-28', status: 'Inactive' },
  { id: 'PAT-007', name: 'Buddy', species: 'Dog', breed: 'Beagle', age: 8, owner: 'Tom Anderson', lastVisit: '2024-10-05', status: 'Active' },
  { id: 'PAT-008', name: 'Whiskers', species: 'Cat', breed: 'Maine Coon', age: 4, owner: 'Lisa Martinez', lastVisit: '2024-10-22', status: 'Active' },
  { id: 'PAT-009', name: 'Duke', species: 'Dog', breed: 'Boxer', age: 3, owner: 'Chris Taylor', lastVisit: '2024-10-08', status: 'Active' },
  { id: 'PAT-010', name: 'Shadow', species: 'Cat', breed: 'Black Cat', age: 5, owner: 'Emma White', lastVisit: '2024-10-17', status: 'Active' },
  { id: 'PAT-011', name: 'Zeus', species: 'Dog', breed: 'Husky', age: 6, owner: 'David Lee', lastVisit: '2024-10-14', status: 'Active' },
  { id: 'PAT-012', name: 'Princess', species: 'Cat', breed: 'Ragdoll', age: 2, owner: 'Amy Clark', lastVisit: '2024-10-19', status: 'Active' },
];

const appointmentData: Appointment[] = [
  { id: 'APT-001', patientName: 'Max', clientName: 'John Smith', appointmentType: 'Checkup', date: '2024-10-25', time: '10:00 AM', status: 'Scheduled' },
  { id: 'APT-002', patientName: 'Luna', clientName: 'Jane Doe', appointmentType: 'Vaccination', date: '2024-10-25', time: '11:00 AM', status: 'Scheduled' },
  { id: 'APT-003', patientName: 'Charlie', clientName: 'Bob Johnson', appointmentType: 'Surgery', date: '2024-10-26', time: '09:00 AM', status: 'Scheduled' },
  { id: 'APT-004', patientName: 'Bella', clientName: 'Alice Brown', appointmentType: 'Dental', date: '2024-10-24', time: '02:00 PM', status: 'Completed' },
  { id: 'APT-005', patientName: 'Rocky', clientName: 'Mike Wilson', appointmentType: 'Checkup', date: '2024-10-23', time: '03:00 PM', status: 'Cancelled' },
];

// Patient columns
const patientColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'id',
    header: 'Patient ID',
    cell: (info) => <span style={{ fontFamily: 'monospace' }}>{info.getValue() as string}</span>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'species',
    header: 'Species',
  },
  {
    accessorKey: 'breed',
    header: 'Breed',
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: (info) => `${info.getValue()} years`,
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
  },
  {
    accessorKey: 'lastVisit',
    header: 'Last Visit',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue() as string;
      const color = status === 'Active' ? '#10b981' : '#6b7280';
      return (
        <span style={{ 
          color, 
          fontWeight: 600,
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          background: status === 'Active' ? '#d1fae5' : '#f3f4f6',
        }}>
          {status}
        </span>
      );
    },
  },
];

// Appointment columns
const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: 'id',
    header: 'Appointment ID',
  },
  {
    accessorKey: 'patientName',
    header: 'Patient',
  },
  {
    accessorKey: 'clientName',
    header: 'Client',
  },
  {
    accessorKey: 'appointmentType',
    header: 'Type',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'time',
    header: 'Time',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue() as string;
      let color = '#3b82f6';
      let bg = '#dbeafe';
      
      if (status === 'Completed') {
        color = '#10b981';
        bg = '#d1fae5';
      } else if (status === 'Cancelled') {
        color = '#ef4444';
        bg = '#fee2e2';
      }
      
      return (
        <span style={{ 
          color, 
          fontWeight: 600,
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          background: bg,
        }}>
          {status}
        </span>
      );
    },
  },
];

const meta: Meta<typeof DataGrid> = {
  title: 'Components/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const PatientList = {
  args: {
    data: patientData,
    columns: patientColumns,
    pageSize: 10,
  },
};

export const AppointmentList = {
  args: {
    data: appointmentData,
    columns: appointmentColumns,
    pageSize: 5,
  },
};

export const SmallPageSize = {
  args: {
    data: patientData,
    columns: patientColumns,
    pageSize: 5,
  },
};

export const WithoutSorting = {
  args: {
    data: patientData,
    columns: patientColumns,
    enableSorting: false,
  },
};

export const WithoutFiltering = {
  args: {
    data: patientData,
    columns: patientColumns,
    enableFiltering: false,
  },
};

export const WithoutPagination = {
  args: {
    data: appointmentData,
    columns: appointmentColumns,
    enablePagination: false,
  },
};

export const Loading = {
  args: {
    data: patientData,
    columns: patientColumns,
    loading: true,
  },
};

export const Empty = {
  args: {
    data: [],
    columns: patientColumns,
    emptyMessage: 'No patients found',
  },
};

export const MinimalFeatures = {
  args: {
    data: appointmentData,
    columns: appointmentColumns,
    enableSorting: false,
    enableFiltering: false,
    enablePagination: false,
  },
};
