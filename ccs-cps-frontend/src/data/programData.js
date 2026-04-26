// src/data/programData.js
// Frontend copy of program data — used by AddScheduleModal (Fix 3: no API needed)

const PROGRAM_DATA = [
  {
    program: "BS Computer Science",
    code: "BSCS",
    years: [
      {
        year: "1st Year",
        sections: ["A", "B", "C", "D"],
        subjects: [
          { code: "CS101", title: "Introduction to Computing", units: 3 },
          { code: "CS102", title: "Computer Programming 1", units: 3 },
          {
            code: "MATH101",
            title: "Mathematics in the Modern World",
            units: 3,
          },
          { code: "GE101", title: "Understanding the Self", units: 3 },
          { code: "GE102", title: "Readings in Philippine History", units: 3 },
          { code: "GE103", title: "The Contemporary World", units: 3 },
          { code: "PE101", title: "Physical Education 1", units: 2 },
          {
            code: "NSTP101",
            title: "National Service Training Program 1",
            units: 3,
          },
        ],
      },
      {
        year: "2nd Year",
        sections: ["A", "B", "C", "D"],
        subjects: [
          { code: "CS201", title: "Data Structures and Algorithms", units: 3 },
          { code: "CS202", title: "Computer Programming 2", units: 3 },
          { code: "CS203", title: "Discrete Mathematics", units: 3 },
          { code: "CS204", title: "Digital Logic Design", units: 3 },
          { code: "MATH201", title: "Calculus 1", units: 3 },
          { code: "GE201", title: "Ethics", units: 3 },
          { code: "PE201", title: "Physical Education 2", units: 2 },
          {
            code: "NSTP201",
            title: "National Service Training Program 2",
            units: 3,
          },
        ],
      },
      {
        year: "3rd Year",
        sections: ["A", "B", "C", "D"],
        subjects: [
          { code: "CS301", title: "Operating Systems", units: 3 },
          { code: "CS302", title: "Database Management Systems", units: 3 },
          { code: "CS303", title: "Software Engineering", units: 3 },
          { code: "CS304", title: "Computer Networks", units: 3 },
          { code: "CS305", title: "Algorithm Analysis and Design", units: 3 },
          { code: "CS306", title: "Object-Oriented Programming", units: 3 },
          { code: "CS307", title: "Web Development", units: 3 },
          { code: "PE301", title: "Physical Education 3", units: 2 },
        ],
      },
      {
        year: "4th Year",
        sections: ["A", "B", "C", "D"],
        subjects: [
          { code: "CS401", title: "Artificial Intelligence", units: 3 },
          { code: "CS402", title: "Machine Learning", units: 3 },
          { code: "CS403", title: "Capstone Project 1", units: 3 },
          { code: "CS404", title: "Capstone Project 2", units: 3 },
          { code: "CS405", title: "Information Security", units: 3 },
          { code: "CS406", title: "Mobile Application Development", units: 3 },
          { code: "CS407", title: "Practicum / On-the-Job Training", units: 6 },
          {
            code: "CS408",
            title: "Professional Ethics in Computing",
            units: 3,
          },
        ],
      },
    ],
  },
  {
    program: "BS Information Technology",
    code: "BSIT",
    years: [
      {
        year: "1st Year",
        sections: ["A", "B", "C", "D"],
        subjects: [
          {
            code: "IT101",
            title: "Introduction to Information Technology",
            units: 3,
          },
          { code: "IT102", title: "Computer Programming 1 (Python)", units: 3 },
          {
            code: "MATH101",
            title: "Mathematics in the Modern World",
            units: 3,
          },
          { code: "GE101", title: "Understanding the Self", units: 3 },
          { code: "GE102", title: "Readings in Philippine History", units: 3 },
          { code: "GE103", title: "The Contemporary World", units: 3 },
          { code: "PE101", title: "Physical Education 1", units: 2 },
          {
            code: "NSTP101",
            title: "National Service Training Program 1",
            units: 3,
          },
        ],
      },
      {
        year: "2nd Year",
        sections: ["A", "B", "C", "D"],
        subjects: [
          {
            code: "IT201",
            title: "Data Communications and Networking",
            units: 3,
          },
          { code: "IT202", title: "Computer Programming 2 (Java)", units: 3 },
          { code: "IT203", title: "Database Management", units: 3 },
          { code: "IT204", title: "Systems Analysis and Design", units: 3 },
          { code: "IT205", title: "Web Design and Development", units: 3 },
          { code: "GE201", title: "Ethics", units: 3 },
          { code: "PE201", title: "Physical Education 2", units: 2 },
          {
            code: "NSTP201",
            title: "National Service Training Program 2",
            units: 3,
          },
        ],
      },
      {
        year: "3rd Year",
        sections: ["A", "B", "C", "D"],
        subjects: [
          { code: "IT301", title: "Network Administration", units: 3 },
          { code: "IT302", title: "Advanced Database Management", units: 3 },
          { code: "IT303", title: "Human-Computer Interaction", units: 3 },
          { code: "IT304", title: "Software Quality Assurance", units: 3 },
          {
            code: "IT305",
            title: "IT Infrastructure and Cloud Computing",
            units: 3,
          },
          {
            code: "IT306",
            title: "Mobile and Web Application Development",
            units: 3,
          },
          {
            code: "IT307",
            title: "Information Assurance and Security",
            units: 3,
          },
          { code: "PE301", title: "Physical Education 3", units: 2 },
        ],
      },
      {
        year: "4th Year",
        sections: ["A", "B", "C", "D"],
        subjects: [
          { code: "IT401", title: "IT Project Management", units: 3 },
          { code: "IT402", title: "Capstone Project 1", units: 3 },
          { code: "IT403", title: "Capstone Project 2", units: 3 },
          {
            code: "IT404",
            title: "System Integration and Architecture",
            units: 3,
          },
          { code: "IT405", title: "Technopreneurship", units: 3 },
          { code: "IT406", title: "Practicum / On-the-Job Training", units: 6 },
          {
            code: "IT407",
            title: "Social and Professional Issues in IT",
            units: 3,
          },
        ],
      },
    ],
  },
];

export default PROGRAM_DATA;
