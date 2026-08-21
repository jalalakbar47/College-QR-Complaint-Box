import { Category, LocationItem } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { category_id: 'CAT-01', category_name: 'Academic', description: 'Curriculum, classes, syllabus coverage, lectures', status: 'Active' },
  { category_id: 'CAT-02', category_name: 'Examination', description: 'Exam scheduling, seating, hall tickets, grading anomalies', status: 'Active' },
  { category_id: 'CAT-03', category_name: 'Harassment', description: 'Verbal, physical, or discriminatory harassment', status: 'Active' },
  { category_id: 'CAT-04', category_name: 'Bullying', description: 'Ragging, intimidation, or peer hostility', status: 'Active' },
  { category_id: 'CAT-05', category_name: 'Discipline', description: 'Campus conduct, misconduct, disturbance', status: 'Active' },
  { category_id: 'CAT-06', category_name: 'Infrastructure', description: 'Classrooms, furniture, boards, civil repairs', status: 'Active' },
  { category_id: 'CAT-07', category_name: 'Cleanliness', description: 'Waste disposal, sanitation, campus grounds hygiene', status: 'Active' },
  { category_id: 'CAT-08', category_name: 'Electricity', description: 'Power cuts, fans, lighting, backup generators', status: 'Active' },
  { category_id: 'CAT-09', category_name: 'Water', description: 'Drinking water stations, washroom water supply', status: 'Active' },
  { category_id: 'CAT-10', category_name: 'Security', description: 'Gate pass, guards, surveillance, theft issues', status: 'Active' },
  { category_id: 'CAT-11', category_name: 'Transport', description: 'College buses, timings, route issues, drivers', status: 'Active' },
  { category_id: 'CAT-12', category_name: 'Hostel', description: 'Mess food, hostel wardens, rooms, maintenance', status: 'Active' },
  { category_id: 'CAT-13', category_name: 'Teacher/Staff', description: 'Faculty behavior, staff coordination, complaints', status: 'Active' },
  { category_id: 'CAT-14', category_name: 'IT/Internet', description: 'Wi-Fi connectivity, lab computers, portal access', status: 'Active' },
  { category_id: 'CAT-15', category_name: 'Other', description: 'General or miscellaneous campus issues', status: 'Active' },
];

export const INITIAL_LOCATIONS: LocationItem[] = [
  { location_id: 'LOC-01', location_name: 'Main Gate', status: 'Active' },
  { location_id: 'LOC-02', location_name: 'Administration Block', status: 'Active' },
  { location_id: 'LOC-03', location_name: 'Academic Block A', status: 'Active' },
  { location_id: 'LOC-04', location_name: 'Academic Block B', status: 'Active' },
  { location_id: 'LOC-05', location_name: 'Computer Lab 1 & 2', status: 'Active' },
  { location_id: 'LOC-06', location_name: 'Science & Core Labs', status: 'Active' },
  { location_id: 'LOC-07', location_name: 'Central Library', status: 'Active' },
  { location_id: 'LOC-08', location_name: 'Classrooms Floor 1-3', status: 'Active' },
  { location_id: 'LOC-09', location_name: 'Examination Hall', status: 'Active' },
  { location_id: 'LOC-10', location_name: 'Cafeteria & Canteen', status: 'Active' },
  { location_id: 'LOC-11', location_name: 'Hostel Boys / Girls', status: 'Active' },
  { location_id: 'LOC-12', location_name: 'Playground & Sports Arena', status: 'Active' },
  { location_id: 'LOC-13', location_name: 'Student Parking Area', status: 'Active' },
  { location_id: 'LOC-14', location_name: 'Washrooms & Restrooms', status: 'Active' },
  { location_id: 'LOC-15', location_name: 'Other', status: 'Active' },
];

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Business Administration (MBA/BBA)',
  'Applied Sciences & Humanities',
  'Pharmacy / Allied Health',
  'Other',
];

export const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

export const FORM_LIMITS = {
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 120,
  DESC_MIN_LENGTH: 15,
  DESC_MAX_LENGTH: 1500,
};
