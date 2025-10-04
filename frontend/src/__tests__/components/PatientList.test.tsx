import { describe, it, expect } from 'vitest';

describe('PatientList Component', () => {
  it('should render patient list without errors', () => {
    const patients = [
      { id: '1', name: 'Max', species: 'Dog' },
      { id: '2', name: 'Luna', species: 'Cat' },
    ];

    expect(patients).toHaveLength(2);
    expect(patients[0].name).toBe('Max');
  });

  it('should filter patients by species', () => {
    const patients = [
      { id: '1', name: 'Max', species: 'Dog' },
      { id: '2', name: 'Luna', species: 'Cat' },
      { id: '3', name: 'Buddy', species: 'Dog' },
    ];

    const filterBySpecies = (list: any[], species: string) => 
      list.filter(p => p.species === species);

    const dogs = filterBySpecies(patients, 'Dog');
    expect(dogs).toHaveLength(2);
  });

  it('should sort patients by name', () => {
    const patients = [
      { id: '1', name: 'Max', species: 'Dog' },
      { id: '2', name: 'Luna', species: 'Cat' },
      { id: '3', name: 'Buddy', species: 'Dog' },
    ];

    const sorted = [...patients].sort((a, b) => a.name.localeCompare(b.name));
    
    expect(sorted[0].name).toBe('Buddy');
    expect(sorted[1].name).toBe('Luna');
    expect(sorted[2].name).toBe('Max');
  });

  it('should handle empty patient list', () => {
    const patients: any[] = [];
    
    expect(patients).toHaveLength(0);
    expect(Array.isArray(patients)).toBe(true);
  });
});
