import '../styles/Page.css';

const Patients = () => {
  const patients = [
    { id: 1, name: 'Max', species: 'Dog', breed: 'Labrador', owner: 'John Smith', lastVisit: '2024-01-15' },
    { id: 2, name: 'Bella', species: 'Cat', breed: 'Persian', owner: 'Sarah Johnson', lastVisit: '2024-01-14' },
    { id: 3, name: 'Charlie', species: 'Dog', breed: 'Golden Retriever', owner: 'Mike Brown', lastVisit: '2024-01-13' },
    { id: 4, name: 'Luna', species: 'Cat', breed: 'Siamese', owner: 'Emily Davis', lastVisit: '2024-01-12' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>🐕 Patients</h1>
        <button className="btn-primary">+ Add New Patient</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search patients by name, owner, or microchip ID..." />
        <button className="btn-secondary">Search</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Owner</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.species}</td>
                <td>{patient.breed}</td>
                <td>{patient.owner}</td>
                <td>{patient.lastVisit}</td>
                <td>
                  <button className="btn-action">View</button>
                  <button className="btn-action">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
