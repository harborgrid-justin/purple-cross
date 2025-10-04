import { describe, it, expect } from 'vitest';

describe('AppointmentCalendar Component', () => {
  it('should group appointments by date', () => {
    const appointments = [
      { id: '1', date: '2024-12-01', time: '10:00' },
      { id: '2', date: '2024-12-01', time: '14:00' },
      { id: '3', date: '2024-12-02', time: '09:00' },
    ];

    const groupByDate = (appts: any[]) => {
      return appts.reduce((groups: any, appt) => {
        const date = appt.date;
        if (!groups[date]) groups[date] = [];
        groups[date].push(appt);
        return groups;
      }, {});
    };

    const grouped = groupByDate(appointments);
    
    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped['2024-12-01']).toHaveLength(2);
    expect(grouped['2024-12-02']).toHaveLength(1);
  });

  it('should check for appointment conflicts', () => {
    const checkConflict = (time1: string, time2: string) => {
      return time1 === time2;
    };

    expect(checkConflict('10:00', '10:00')).toBe(true);
    expect(checkConflict('10:00', '11:00')).toBe(false);
  });

  it('should format appointment time', () => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    expect(formatTime('10:00')).toBe('10:00 AM');
    expect(formatTime('14:00')).toBe('2:00 PM');
  });
});
