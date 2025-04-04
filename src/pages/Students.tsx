
import { useState } from "react";
import { StudentForm } from "@/components/students/StudentForm";
import { StudentTable } from "@/components/students/StudentTable";

const Students = () => {
  const [showForm, setShowForm] = useState(false);
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };
  
  const handleFormSuccess = () => {
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Students</h2>
        <p className="text-muted-foreground">
          Manage student accounts and information
        </p>
      </div>

      {showForm ? (
        <StudentForm onSuccess={handleFormSuccess} />
      ) : (
        <StudentTable onAddClick={toggleForm} />
      )}
    </div>
  );
};

export default Students;
