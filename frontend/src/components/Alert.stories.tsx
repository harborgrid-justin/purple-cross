import type { Meta, StoryObj } from '@storybook/react';
import Alert from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'Type of alert (changes color and icon)',
    },
    onClose: {
      description: 'Callback when close button is clicked',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    type: 'info',
    children: 'This is an informational message.',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    children: 'Your changes have been saved successfully!',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    children: 'Please review your information before submitting.',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    children: 'An error occurred while processing your request.',
  },
};

export const WithCloseButton: Story = {
  args: {
    type: 'info',
    children: 'You can close this alert by clicking the × button.',
    onClose: () => console.log('Alert closed'),
  },
};

export const LongMessage: Story = {
  args: {
    type: 'warning',
    children: (
      <>
        <strong>Important Notice:</strong> Your session will expire in 5 minutes. Please save your
        work to prevent any data loss. If you need more time, you can extend your session by
        clicking the "Stay Logged In" button in the top navigation bar.
      </>
    ),
  },
};

export const WithList: Story = {
  args: {
    type: 'error',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>Please correct the following errors:</strong>
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Patient name is required</li>
          <li>Species must be selected</li>
          <li>Date of birth cannot be in the future</li>
        </ul>
      </div>
    ),
  },
};

export const SuccessfulAppointment: Story = {
  args: {
    type: 'success',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>Appointment Confirmed!</strong>
        </p>
        <p style={{ margin: 0 }}>
          Your appointment for Max on Monday, October 23 at 10:00 AM has been scheduled. A
          confirmation email has been sent to john.smith@example.com.
        </p>
      </div>
    ),
    onClose: () => console.log('Alert closed'),
  },
};

export const PaymentWarning: Story = {
  args: {
    type: 'warning',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>Outstanding Balance</strong>
        </p>
        <p style={{ margin: 0 }}>
          You have an outstanding balance of $450.00. Please settle your account to avoid service
          interruptions.
        </p>
      </div>
    ),
  },
};

export const SystemError: Story = {
  args: {
    type: 'error',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>Connection Error</strong>
        </p>
        <p style={{ margin: 0 }}>
          Unable to connect to the server. Please check your internet connection and try again. If
          the problem persists, contact support.
        </p>
      </div>
    ),
    onClose: () => console.log('Alert closed'),
  },
};
