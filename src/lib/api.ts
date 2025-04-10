const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export interface StudentDetails {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  email: string;
  phone: string;
  attendance: number;
  averageMarks: number;
}

export const getStudentDetails = async (studentId: string): Promise<StudentDetails> => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch student details');
  }

  return response.json();
}; 
