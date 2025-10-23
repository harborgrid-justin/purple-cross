import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';
import Button from './Button';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the card',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle below the title',
    },
    noPadding: {
      control: 'boolean',
      description: 'Removes padding from card body',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: <p>This is a basic card with some content inside.</p>,
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Patient Information',
    children: (
      <div>
        <p><strong>Name:</strong> Max</p>
        <p><strong>Species:</strong> Dog</p>
        <p><strong>Breed:</strong> Golden Retriever</p>
        <p><strong>Age:</strong> 5 years</p>
      </div>
    ),
  },
};

export const WithTitleAndSubtitle: Story = {
  args: {
    title: 'Upcoming Appointments',
    subtitle: 'You have 3 appointments scheduled this week',
    children: (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
          <strong>Monday, 10:00 AM</strong> - Max (Checkup)
        </li>
        <li style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
          <strong>Wednesday, 2:00 PM</strong> - Luna (Vaccination)
        </li>
        <li style={{ padding: '12px 0' }}>
          <strong>Friday, 11:30 AM</strong> - Charlie (Grooming)
        </li>
      </ul>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: 'Patient Profile',
    subtitle: 'View and edit patient information',
    actions: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button size="sm" variant="secondary">Edit</Button>
        <Button size="sm" variant="danger">Delete</Button>
      </div>
    ),
    children: (
      <div>
        <p><strong>Patient ID:</strong> PAT-12345</p>
        <p><strong>Owner:</strong> John Smith</p>
        <p><strong>Last Visit:</strong> Oct 15, 2024</p>
      </div>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    title: 'Recent Activity',
    noPadding: true,
    children: (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Activity</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>User</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px' }}>Oct 23, 2024</td>
            <td style={{ padding: '12px' }}>Created appointment</td>
            <td style={{ padding: '12px' }}>Dr. Smith</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px' }}>Oct 22, 2024</td>
            <td style={{ padding: '12px' }}>Updated patient record</td>
            <td style={{ padding: '12px' }}>Nurse Johnson</td>
          </tr>
          <tr>
            <td style={{ padding: '12px' }}>Oct 21, 2024</td>
            <td style={{ padding: '12px' }}>Added medical note</td>
            <td style={{ padding: '12px' }}>Dr. Smith</td>
          </tr>
        </tbody>
      </table>
    ),
  },
};

export const ComplexCard: Story = {
  args: {
    title: 'Invoice Summary',
    subtitle: 'Total amount due: $450.00',
    actions: (
      <Button size="sm" variant="success">Mark as Paid</Button>
    ),
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Consultation Fee</span>
          <strong>$150.00</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Medication</span>
          <strong>$200.00</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Lab Tests</span>
          <strong>$100.00</strong>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '2px solid #333',
          fontSize: '18px'
        }}>
          <strong>Total</strong>
          <strong>$450.00</strong>
        </div>
      </div>
    ),
  },
};
