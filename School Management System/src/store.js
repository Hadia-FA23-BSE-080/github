export const initialData = {
  users: [
    { id: 1, name: 'Admin Neha', role: 'admin', email: 'admin@school.com', password: 'Admin@Secure$2026' },
    
    // Teachers
    { id: 2, name: 'John Doe', role: 'teacher', email: 'john@school.com', subject: 'Mathematics', password: 'Teacher@Math1' },
    { id: 3, name: 'Sarah Connor', role: 'teacher', email: 'sarah@school.com', subject: 'Physics', password: 'Teacher@Phys2' },
    { id: 4, name: 'Bruce Wayne', role: 'teacher', email: 'bruce@school.com', subject: 'English', password: 'Teacher@Eng3' },
    { id: 5, name: 'Clark Kent', role: 'teacher', email: 'clark@school.com', subject: 'Chemistry', password: 'Teacher@Chem4' },
    { id: 6, name: 'Diana Prince', role: 'teacher', email: 'diana@school.com', subject: 'Biology', password: 'Teacher@Bio5' },
    { id: 7, name: 'Barry Allen', role: 'teacher', email: 'barry@school.com', subject: 'History', password: 'Teacher@Hist6' },

    // Students - Class 10A
    { id: 101, name: 'Jane Smith', role: 'student', email: 'jane@student.com', class: '10A', rollNo: '101', feeStatus: 'Paid', password: 'StudentPass@1' },
    { id: 102, name: 'Ali Khan', role: 'student', email: 'ali@student.com', class: '10A', rollNo: '102', feeStatus: 'Pending', password: 'StudentPass@2' },
    { id: 103, name: 'Ayesha Tariq', role: 'student', email: 'ayesha@student.com', class: '10A', rollNo: '103', feeStatus: 'Paid', password: 'StudentPass@3' },
    { id: 104, name: 'Bilal Ahmed', role: 'student', email: 'bilal@student.com', class: '10A', rollNo: '104', feeStatus: 'Paid', password: 'StudentPass@4' },
    { id: 105, name: 'Fatima Zohra', role: 'student', email: 'fatima@student.com', class: '10A', rollNo: '105', feeStatus: 'Pending', password: 'StudentPass@5' },

    // Students - Class 9B
    { id: 201, name: 'Sara Khan', role: 'student', email: 'sara@student.com', class: '9B', rollNo: '201', feeStatus: 'Paid', password: 'StudentPass@6' },
    { id: 202, name: 'Omer Farooq', role: 'student', email: 'omer@student.com', class: '9B', rollNo: '202', feeStatus: 'Paid', password: 'StudentPass@7' },
    { id: 203, name: 'Usman Ghani', role: 'student', email: 'usman@student.com', class: '9B', rollNo: '203', feeStatus: 'Pending', password: 'StudentPass@8' },
    { id: 204, name: 'Talha Jamil', role: 'student', email: 'talha@student.com', class: '9B', rollNo: '204', feeStatus: 'Paid', password: 'StudentPass@9' },
    { id: 205, name: 'Zainab Bibi', role: 'student', email: 'zainab@student.com', class: '9B', rollNo: '205', feeStatus: 'Paid', password: 'StudentPass@10' },
    
    // Students - Class 8C
    { id: 301, name: 'Mariam Ali', role: 'student', email: 'mariam@student.com', class: '8C', rollNo: '301', feeStatus: 'Paid', password: 'StudentPass@11' },
    { id: 302, name: 'Hasan Raza', role: 'student', email: 'hasan@student.com', class: '8C', rollNo: '302', feeStatus: 'Pending', password: 'StudentPass@12' }
  ],
  classes: [
    { id: '10A', name: 'Class 10 Section A', feeAmount: 5000 },
    { id: '9B', name: 'Class 9 Section B', feeAmount: 4500 },
    { id: '8C', name: 'Class 8 Section C', feeAmount: 4000 }
  ],
  timetable: [
    // 10A
    { id: 1, classId: '10A', day: 'Monday', subject: 'Mathematics', teacherName: 'John Doe', time: '08:30 - 10:00 AM' },
    { id: 2, classId: '10A', day: 'Monday', subject: 'Physics', teacherName: 'Sarah Connor', time: '10:00 - 11:30 AM' },
    { id: 3, classId: '10A', day: 'Tuesday', subject: 'English', teacherName: 'Bruce Wayne', time: '08:30 - 10:00 AM' },
    { id: 4, classId: '10A', day: 'Wednesday', subject: 'Chemistry', teacherName: 'Clark Kent', time: '11:30 - 01:00 PM' },
    { id: 5, classId: '10A', day: 'Thursday', subject: 'Biology', teacherName: 'Diana Prince', time: '01:30 - 03:00 PM' },
    
    // 9B
    { id: 6, classId: '9B', day: 'Monday', subject: 'English', teacherName: 'Bruce Wayne', time: '10:00 - 11:30 AM' },
    { id: 7, classId: '9B', day: 'Tuesday', subject: 'Physics', teacherName: 'Sarah Connor', time: '11:30 - 01:00 PM' },
    { id: 8, classId: '9B', day: 'Wednesday', subject: 'History', teacherName: 'Barry Allen', time: '08:30 - 10:00 AM' },
    { id: 9, classId: '9B', day: 'Friday', subject: 'Mathematics', teacherName: 'John Doe', time: '03:00 - 04:30 PM' },
    
    // 8C
    { id: 10, classId: '8C', day: 'Monday', subject: 'History', teacherName: 'Barry Allen', time: '01:30 - 03:00 PM' },
    { id: 11, classId: '8C', day: 'Wednesday', subject: 'Chemistry', teacherName: 'Clark Kent', time: '10:00 - 11:30 AM' },
    { id: 12, classId: '8C', day: 'Thursday', subject: 'Biology', teacherName: 'Diana Prince', time: '08:30 - 10:00 AM' }
  ],
  attendance: [
    { 
      id: 1, 
      date: new Date().toISOString().split('T')[0], 
      classId: '10A', 
      teacherId: 2, 
      records: [
        { studentId: 101, status: 'Present' },
        { studentId: 102, status: 'Absent' },
        { studentId: 103, status: 'Present' },
        { studentId: 104, status: 'Present' },
        { studentId: 105, status: 'Present' }
      ] 
    },
    { 
      id: 2, 
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], 
      classId: '10A', 
      teacherId: 2, 
      records: [
        { studentId: 101, status: 'Present' },
        { studentId: 102, status: 'Present' },
        { studentId: 103, status: 'Present' },
        { studentId: 104, status: 'Absent' },
        { studentId: 105, status: 'Present' }
      ] 
    }
  ],
  marks: [
    { id: 1, studentId: 101, classId: '10A', subject: 'Mathematics', exam: 'Mid Term', marks: 85, grade: 'A+' },
    { id: 2, studentId: 101, classId: '10A', subject: 'Physics', exam: 'Mid Term', marks: 78, grade: 'A' },
    { id: 3, studentId: 102, classId: '10A', subject: 'Mathematics', exam: 'Mid Term', marks: 45, grade: 'F' },
    { id: 4, studentId: 103, classId: '10A', subject: 'Mathematics', exam: 'Mid Term', marks: 92, grade: 'A+' }
  ],
  notices: [
    { id: 1, title: 'Spring 2026 Final Exams Schedule', content: 'The final examinations will commence from next Monday. Ensure all dues are cleared to get your roll number slips.', date: new Date().toISOString(), author: 'Admin Dept' },
    { id: 2, title: 'Annual Sports Gala', content: 'Students interested in participating in the Annual Sports Gala must register with their class teachers by Friday.', date: new Date(Date.now() - 86400000).toISOString(), author: 'Sports Committee' }
  ]
};

export const loadData = () => {
  const data = localStorage.getItem('schoolDataV4');
  if (!data) {
    localStorage.setItem('schoolDataV4', JSON.stringify(initialData));
    return initialData;
  }
  const parsedData = JSON.parse(data);
  
  // Migrate old timetable to new format without losing users/classes
  if (parsedData.timetable.length > 0 && !parsedData.timetable[0].time.includes('-')) {
    parsedData.timetable = initialData.timetable;
    localStorage.setItem('schoolDataV4', JSON.stringify(parsedData));
  }
  
  // Add notices if they don't exist
  if (!parsedData.notices) {
     parsedData.notices = initialData.notices;
     localStorage.setItem('schoolDataV4', JSON.stringify(parsedData));
  }
  
  return parsedData;
};

export const saveData = (data) => {
  localStorage.setItem('schoolDataV4', JSON.stringify(data));
};
