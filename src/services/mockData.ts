import { User, Course, Assignment, Submission, Announcement, NotificationItem, CalendarEvent } from '../types';

export const initialUsers: User[] = [
  {
    id: 'user_lecturer_1',
    name: 'Prof. Dr. Cusson',
    email: 'dr.cusson@faculty.edu',
    role: 'lecturer',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Associate Professor',
    office: 'Turing Hall, Room 402',
  },
  {
    id: 'user_student_1',
    name: 'Alex Rivera',
    email: 'a.rivera@student.edu',
    role: 'student',
    matricNumber: 'CSC/2023/0481',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_student_2',
    name: 'Chioma Adeyemi',
    email: 'c.adeyemi@student.edu',
    role: 'student',
    matricNumber: 'CSC/2023/0512',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_student_3',
    name: 'Marcus Chen',
    email: 'm.chen@student.edu',
    role: 'student',
    matricNumber: 'CSC/2023/0429',
    department: 'Software Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_student_4',
    name: 'Sophia Martinez',
    email: 's.martinez@student.edu',
    role: 'student',
    matricNumber: 'CSC/2023/0604',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_student_5',
    name: 'Liam Davies',
    email: 'l.davies@student.edu',
    role: 'student',
    matricNumber: 'CSC/2023/0398',
    department: 'Information Technology',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_student_6',
    name: 'Fatima Zahra',
    email: 'f.zahra@student.edu',
    role: 'student',
    matricNumber: 'CSC/2023/0719',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_student_7',
    name: 'Kwesi Mensah',
    email: 'k.mensah@student.edu',
    role: 'student',
    matricNumber: 'CSC/2023/0455',
    department: 'Software Engineering',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_student_8',
    name: 'Elena Rostova',
    email: 'e.rostova@student.edu',
    role: 'student',
    matricNumber: 'CSC/2023/0530',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  }
];

const allStudentIds = initialUsers.filter(u => u.role === 'student').map(u => u.id);

export const initialCourses: Course[] = [
  {
    id: 'course_csc301',
    code: 'CSC 301',
    name: 'Data Structures & Algorithms',
    department: 'Computer Science',
    level: '300 Level',
    semester: 'First Semester',
    session: '2026/2027',
    description: 'Comprehensive analysis of fundamental data structures, graph traversals, amortized complexity, and dynamic programming applications.',
    color: '#3b82f6', // blue
    lecturerId: 'user_lecturer_1',
    enrolledStudentIds: allStudentIds,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'course_csc305',
    code: 'CSC 305',
    name: 'Database Systems & Architecture',
    department: 'Computer Science',
    level: '300 Level',
    semester: 'First Semester',
    session: '2026/2027',
    description: 'Relational data modeling, normal forms, transaction ACID properties, indexing strategies, and distributed database consistency.',
    color: '#10b981', // emerald
    lecturerId: 'user_lecturer_1',
    enrolledStudentIds: ['user_student_1', 'user_student_2', 'user_student_3', 'user_student_4', 'user_student_5'],
    createdAt: '2026-09-01T09:30:00Z',
  },
  {
    id: 'course_csc309',
    code: 'CSC 309',
    name: 'Software Engineering & Architecture',
    department: 'Software Engineering',
    level: '300 Level',
    semester: 'First Semester',
    session: '2026/2027',
    description: 'Agile development methodologies, microservices decomposition, design patterns, testing suites, CI/CD pipelines, and UML modeling.',
    color: '#8b5cf6', // purple
    lecturerId: 'user_lecturer_1',
    enrolledStudentIds: ['user_student_1', 'user_student_2', 'user_student_3', 'user_student_6', 'user_student_7'],
    createdAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'course_csc315',
    code: 'CSC 315',
    name: 'Modern Web & Cloud Applications',
    department: 'Computer Science',
    level: '300 Level',
    semester: 'First Semester',
    session: '2026/2027',
    description: 'High-performance reactive frontends, stateless RESTful APIs, edge deployment, containerization, and authentication mechanisms.',
    color: '#f59e0b', // amber
    lecturerId: 'user_lecturer_1',
    enrolledStudentIds: ['user_student_1', 'user_student_2', 'user_student_4', 'user_student_5', 'user_student_7', 'user_student_8'],
    createdAt: '2026-09-02T11:00:00Z',
  }
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg_1',
    courseId: 'course_csc301',
    title: 'Assignment 2: Red-Black Trees & Self-Balancing Maps',
    description: 'Implement a self-balancing Red-Black binary search tree in Java or C++ with complete logarithmic insertion and rotation proofs.',
    instructions: `1. Implement RedBlackTree with insert(key, val), search(key), and delete(key) methods.
2. Provide amortized time complexity benchmarks comparing against standard AVL trees for 100,000 random operations.
3. Submit your source code alongside a comprehensive PDF analysis report including node color diagrams.
4. Ensure all unit tests pass with zero memory leaks.`,
    dueDate: '2026-10-10',
    dueTime: '23:59',
    totalMarks: 100,
    allowedFileTypes: ['.pdf', '.zip', '.tar.gz', '.java', '.cpp'],
    maxFileSizeMB: 25,
    lateSubmissionPolicy: 'allowed_penalty',
    latePenaltyPercentPerDay: 10,
    allowResubmission: true,
    anonymousGrading: false,
    autoReleaseGrades: false,
    status: 'published',
    rubrics: [
      { id: 'r1', title: 'Data Structure Correctness & Rotations', description: 'Accurate implementation of left/right rotation and color recoloring logic without cycle bugs.', maxPoints: 40 },
      { id: 'r2', title: 'Performance & Benchmarking', description: 'Rigorous empirical analysis and big-O asymptotic proof comparing with AVL trees.', maxPoints: 30 },
      { id: 'r3', title: 'Code Quality & Documentation', description: 'Clean indentation, modular design, memory management, and inline comments.', maxPoints: 20 },
      { id: 'r4', title: 'Report Presentation & Clarity', description: 'Proper LaTeX/PDF structure, visual diagrams, and clear conclusions.', maxPoints: 10 }
    ],
    attachments: [
      { id: 'att1', name: 'rb_tree_starter_specification.pdf', size: '1.2 MB', type: 'application/pdf', url: '#' },
      { id: 'att2', name: 'benchmark_dataset_100k.csv', size: '3.4 MB', type: 'text/csv', url: '#' }
    ],
    createdAt: '2026-09-25T10:00:00Z',
  },
  {
    id: 'asg_2',
    courseId: 'course_csc305',
    title: 'Milestone 1: Relational Schema Normalization & SQL Queries',
    description: 'Design a 3NF normalized schema for a multi-tenant university portal and write optimized indexing queries.',
    instructions: `1. Formulate the entity relationship diagram (ERD) based on the case study provided.
2. Decompose all relations into BCNF / 3NF and show functional dependency preservation.
3. Formulate SQL DDL scripts and test 10 complex queries involving window functions and CTEs.
4. Provide EXPLAIN ANALYZE execution plans before and after index creation.`,
    dueDate: '2026-10-09',
    dueTime: '17:00',
    totalMarks: 100,
    allowedFileTypes: ['.pdf', '.sql', '.zip'],
    maxFileSizeMB: 15,
    lateSubmissionPolicy: 'allowed_penalty',
    latePenaltyPercentPerDay: 15,
    allowResubmission: false,
    anonymousGrading: false,
    autoReleaseGrades: true,
    status: 'published',
    rubrics: [
      { id: 'r21', title: 'Normalization & Functional Dependencies', description: 'Strict verification of 1NF, 2NF, 3NF and BCNF compliance.', maxPoints: 35 },
      { id: 'r22', title: 'SQL Query Correctness & Efficiency', description: 'Proper syntax, execution efficiency, and handling of edge cases.', maxPoints: 35 },
      { id: 'r23', title: 'Indexing & Query Plan Analysis', description: 'Meaningful index selection justified by EXPLAIN ANALYZE metrics.', maxPoints: 20 },
      { id: 'r24', title: 'Submission Formatting', description: 'Clean executable SQL files and formatted documentation.', maxPoints: 10 }
    ],
    attachments: [
      { id: 'att21', name: 'case_study_university_portal.pdf', size: '840 KB', type: 'application/pdf', url: '#' }
    ],
    createdAt: '2026-09-28T14:00:00Z',
  },
  {
    id: 'asg_3',
    courseId: 'course_csc309',
    title: 'Sprint 2: Architecture Design Document & Design Patterns',
    description: 'Create an Architecture Decision Record (ADR) and UML structural models applying Factory, Observer, and Strategy patterns.',
    instructions: `Submit your system design document addressing latency constraints, fault tolerance, and concurrency models. Include UML sequence and class diagrams.`,
    dueDate: '2026-10-18',
    dueTime: '23:59',
    totalMarks: 50,
    allowedFileTypes: ['.pdf', '.docx'],
    maxFileSizeMB: 20,
    lateSubmissionPolicy: 'disallowed',
    allowResubmission: true,
    anonymousGrading: true,
    autoReleaseGrades: false,
    status: 'published',
    rubrics: [
      { id: 'r31', title: 'Architectural Soundness', description: 'Appropriate component decomposition and pattern choice.', maxPoints: 25 },
      { id: 'r32', title: 'UML Diagrams Precision', description: 'Standard UML compliance and clarity of interactions.', maxPoints: 15 },
      { id: 'r33', title: 'Technical Writing & ADR Quality', description: 'Professional argumentation of trade-offs.', maxPoints: 10 }
    ],
    attachments: [],
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'asg_4',
    courseId: 'course_csc315',
    title: 'Lab 4: Secure Authentication & JWT Token Exchange',
    description: 'Build an Express/Node.js authentication service featuring password hashing with bcrypt, refresh token rotation, and CSRF protection.',
    instructions: `Include unit tests using Jest or Vitest demonstrating token expiry handling, revocation blacklists, and role-based endpoint authorization.`,
    dueDate: '2026-10-06',
    dueTime: '23:59',
    totalMarks: 50,
    allowedFileTypes: ['.zip', '.tar.gz'],
    maxFileSizeMB: 30,
    lateSubmissionPolicy: 'allowed_penalty',
    latePenaltyPercentPerDay: 5,
    allowResubmission: false,
    anonymousGrading: false,
    autoReleaseGrades: false,
    status: 'published',
    rubrics: [
      { id: 'r41', title: 'Security & Encryption', description: 'Proper salt rounds, secret safety, and HTTPS token cookies.', maxPoints: 25 },
      { id: 'r42', title: 'Token Lifecycle & Rotation', description: 'Correct refresh token exchange logic and revocation handling.', maxPoints: 15 },
      { id: 'r43', title: 'Automated Test Suite', description: 'High test coverage of authorization scenarios.', maxPoints: 10 }
    ],
    attachments: [],
    createdAt: '2026-09-20T12:00:00Z',
  },
  {
    id: 'asg_5',
    courseId: 'course_csc301',
    title: 'Assignment 1: Amortized Analysis of Dynamic Arrays & Heaps',
    description: 'Mathematical proofs and implementation of binary min-heaps and Fibonacci heap operations.',
    instructions: `Written proof and benchmark comparison. Completed and graded.`,
    dueDate: '2026-09-22',
    dueTime: '23:59',
    totalMarks: 100,
    allowedFileTypes: ['.pdf'],
    maxFileSizeMB: 10,
    lateSubmissionPolicy: 'disallowed',
    allowResubmission: false,
    anonymousGrading: false,
    autoReleaseGrades: true,
    status: 'closed',
    rubrics: [
      { id: 'r51', title: 'Mathematical Rigor', description: 'Correct potential function and accounting method proofs.', maxPoints: 50 },
      { id: 'r52', title: 'Implementation & Tests', description: 'Heapify and extractMin running in verified logarithmic bounds.', maxPoints: 50 }
    ],
    attachments: [],
    createdAt: '2026-09-05T09:00:00Z',
  },
  {
    id: 'asg_6',
    courseId: 'course_csc305',
    title: 'Draft: Concurrency Control & Write-Ahead Logging (WAL)',
    description: 'Experimental laboratory on two-phase locking (2PL) and ARIES crash recovery algorithm.',
    instructions: `Draft assignment not yet published to students.`,
    dueDate: '2026-10-25',
    dueTime: '23:59',
    totalMarks: 75,
    allowedFileTypes: ['.pdf', '.zip'],
    maxFileSizeMB: 20,
    lateSubmissionPolicy: 'allowed_penalty',
    allowResubmission: true,
    anonymousGrading: false,
    autoReleaseGrades: false,
    status: 'draft',
    rubrics: [],
    attachments: [],
    createdAt: '2026-10-04T16:00:00Z',
  }
];

export const initialSubmissions: Submission[] = [
  // Submissions for asg_1 (CSC 301 - Red-Black Trees, Due Oct 10)
  {
    id: 'sub_1',
    assignmentId: 'asg_1',
    studentId: 'user_student_1', // Alex Rivera
    courseId: 'course_csc301',
    submittedAt: '2026-10-07T14:22:00Z',
    status: 'submitted', // Needs grading
    files: [
      {
        id: 'f_1',
        name: 'AlexRivera_CSC301_RBTree_Project.zip',
        size: '4.8 MB',
        type: 'application/zip',
        uploadedAt: '2026-10-07T14:22:00Z',
        mockContent: `// RedBlackTree.java Implementation Summary
package edu.algorithms.trees;

public class RedBlackTree<T extends Comparable<T>> {
    private Node<T> root;
    private final Node<T> TNULL;

    // Fully implemented leftRotate, rightRotate, and insertFixup
    // 100,000 operation benchmark shows average 14.2ms search latency
    // Memory leak check passed with Valgrind / JProfiler
}`
      },
      {
        id: 'f_2',
        name: 'AlexRivera_Analysis_Report.pdf',
        size: '1.9 MB',
        type: 'application/pdf',
        uploadedAt: '2026-10-07T14:22:00Z',
        mockContent: `EXECUTIVE SUMMARY: RED-BLACK TREE EMPIRICAL EVALUATION
Student: Alex Rivera (CSC/2023/0481)
Course: CSC 301 - Data Structures & Algorithms

1. THEORETICAL BOUNDS:
Height of a red-black tree with n internal nodes is at most 2 * log2(n + 1).
Our implementation guarantees maximum 2 rotations per insertion and O(log n) recolorings.

2. BENCHMARK COMPARISONS:
Under 100,000 pseudo-random insertions:
- Red-Black Tree insertion time: 18.4 ms (Average rotations: 0.58)
- Standard AVL Tree insertion time: 26.2 ms (Average rotations: 1.21)

Conclusion: For write-heavy workloads, the Red-Black tree demonstrated 29.7% lower latency over AVL.`
      }
    ],
    studentNote: 'Professor, I added the additional unit tests testing the double-black deletion edge case as requested in lecture 7.',
    attemptNumber: 1,
  },
  {
    id: 'sub_2',
    assignmentId: 'asg_1',
    studentId: 'user_student_2', // Chioma Adeyemi
    courseId: 'course_csc301',
    submittedAt: '2026-10-07T18:45:00Z',
    status: 'submitted', // Needs grading
    files: [
      {
        id: 'f_3',
        name: 'Chioma_Adeyemi_CSC301_Assignment2.pdf',
        size: '2.4 MB',
        type: 'application/pdf',
        uploadedAt: '2026-10-07T18:45:00Z',
        mockContent: `CSC 301 ASSIGNMENT 2: RED-BLACK TREE IMPLEMENTATION
Chioma Adeyemi | Matric: CSC/2023/0512

Includes complete C++17 templated RedBlackTree with RAII pointers and comprehensive test suite.
Logarithmic depth verified across 250,000 nodes.`
      }
    ],
    studentNote: 'Implemented in modern C++ with smart pointers to prevent memory leaks.',
    attemptNumber: 1,
  },
  {
    id: 'sub_3',
    assignmentId: 'asg_1',
    studentId: 'user_student_3', // Marcus Chen
    courseId: 'course_csc301',
    submittedAt: '2026-10-08T00:15:00Z',
    status: 'submitted',
    files: [
      {
        id: 'f_4',
        name: 'MarcusChen_RBTree_Submission.zip',
        size: '3.1 MB',
        type: 'application/zip',
        uploadedAt: '2026-10-08T00:15:00Z',
        mockContent: `Marcus Chen - CSC 301 Assignment 2 code archive.`
      }
    ],
    attemptNumber: 1,
  },
  {
    id: 'sub_4',
    assignmentId: 'asg_1',
    studentId: 'user_student_4', // Sophia Martinez
    courseId: 'course_csc301',
    submittedAt: '2026-10-06T11:10:00Z',
    status: 'graded',
    files: [
      {
        id: 'f_5',
        name: 'Sophia_Martinez_RBTree.pdf',
        size: '1.5 MB',
        type: 'application/pdf',
        uploadedAt: '2026-10-06T11:10:00Z',
        mockContent: `Sophia Martinez - Red-Black Tree implementation with color visualization.`
      }
    ],
    attemptNumber: 1,
    score: 94,
    maxScore: 100,
    rubricScores: {
      r1: 38,
      r2: 28,
      r3: 19,
      r4: 9
    },
    privateNotes: 'Exceptional diagramming of recoloring cases. Strong candidate for TA next semester.',
    studentFeedback: 'Brilliant work, Sophia! Your visual diagrams made following the recoloring cascades very straightforward. Consider testing deletion fixups with sentinel nodes in future projects.',
    gradedAt: '2026-10-07T16:00:00Z',
    isReturned: true,
    returnedAt: '2026-10-07T16:05:00Z',
  },

  // Submissions for asg_2 (CSC 305 - Milestone 1: Relational Schema Normalization, Due Oct 9)
  {
    id: 'sub_5',
    assignmentId: 'asg_2',
    studentId: 'user_student_1', // Alex Rivera
    courseId: 'course_csc305',
    submittedAt: '2026-10-07T21:10:00Z',
    status: 'submitted', // Needs grading
    files: [
      {
        id: 'f_6',
        name: 'AlexRivera_CSC305_Milestone1_Schema.sql',
        size: '220 KB',
        type: 'application/sql',
        uploadedAt: '2026-10-07T21:10:00Z',
        mockContent: `-- CSC 305 Milestone 1: Schema Normalization & Complex Queries
-- Student: Alex Rivera (CSC/2023/0481)

CREATE TABLE departments (
    dept_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dept_id UUID REFERENCES departments(dept_id),
    code VARCHAR(12) NOT NULL,
    credits INT CHECK (credits > 0)
);

CREATE INDEX idx_courses_dept ON courses(dept_id);
-- BCNF verified: all determinants are candidate keys.`
      },
      {
        id: 'f_7',
        name: 'AlexRivera_Normalization_Proof.pdf',
        size: '1.4 MB',
        type: 'application/pdf',
        uploadedAt: '2026-10-07T21:10:00Z',
        mockContent: `RELATIONAL NORMALIZATION & QUERY PLAN REPORT
Case Study: University Multi-Tenant Portal
Normal forms: 3NF & BCNF functional decomposition matrices included.`
      }
    ],
    studentNote: 'Includes both the SQL migration script and the query execution plans.',
    attemptNumber: 1,
  },
  {
    id: 'sub_6',
    assignmentId: 'asg_2',
    studentId: 'user_student_2', // Chioma Adeyemi
    courseId: 'course_csc305',
    submittedAt: '2026-10-08T01:10:00Z',
    status: 'submitted',
    files: [
      {
        id: 'f_8',
        name: 'Chioma_Adeyemi_CSC305_M1.sql',
        size: '180 KB',
        type: 'application/sql',
        uploadedAt: '2026-10-08T01:10:00Z',
        mockContent: `Postgres schema for university portal with full text search index.`
      }
    ],
    attemptNumber: 1,
  },

  // Submissions for asg_4 (CSC 315 - Due Oct 6, Late Submissions)
  {
    id: 'sub_7',
    assignmentId: 'asg_4',
    studentId: 'user_student_5', // Liam Davies
    courseId: 'course_csc315',
    submittedAt: '2026-10-07T09:30:00Z', // Submitted after deadline (Late!)
    status: 'late',
    files: [
      {
        id: 'f_9',
        name: 'LiamDavies_Lab4_AuthService.zip',
        size: '5.2 MB',
        type: 'application/zip',
        uploadedAt: '2026-10-07T09:30:00Z',
        mockContent: `Node.js JWT auth service with Redis session store.`
      }
    ],
    studentNote: 'Apologies for the delay Professor, my machine had an issue during the Redis docker build.',
    attemptNumber: 1,
  },
  {
    id: 'sub_8',
    assignmentId: 'asg_4',
    studentId: 'user_student_1', // Alex Rivera
    courseId: 'course_csc315',
    submittedAt: '2026-10-05T20:15:00Z',
    status: 'graded',
    files: [
      {
        id: 'f_10',
        name: 'AlexRivera_Lab4_AuthJWT.zip',
        size: '6.1 MB',
        type: 'application/zip',
        uploadedAt: '2026-10-05T20:15:00Z',
        mockContent: `Express server with bcrypt, HTTP-only secure cookie JWT tokens, Vitest tests.`
      }
    ],
    attemptNumber: 1,
    score: 47,
    maxScore: 50,
    rubricScores: {
      r41: 24,
      r42: 14,
      r43: 9
    },
    privateNotes: 'Very thorough testing suite and secure cookie flags properly set.',
    studentFeedback: 'Great implementation of refresh token rotation. You handled the simultaneous token race condition gracefully.',
    gradedAt: '2026-10-07T11:00:00Z',
    isReturned: true,
    returnedAt: '2026-10-07T11:05:00Z',
  },

  // Submissions for asg_5 (CSC 301 - Amortized Analysis, Closed & Graded)
  {
    id: 'sub_9',
    assignmentId: 'asg_5',
    studentId: 'user_student_1',
    courseId: 'course_csc301',
    submittedAt: '2026-09-21T16:00:00Z',
    status: 'graded',
    files: [
      {
        id: 'f_11',
        name: 'AlexRivera_CSC301_Amortized_Analysis.pdf',
        size: '1.1 MB',
        type: 'application/pdf',
        uploadedAt: '2026-09-21T16:00:00Z',
        mockContent: `CSC 301 Assignment 1 - Proofs of Fibonacci Heap extract-min O(log n) amortized cost.`
      }
    ],
    attemptNumber: 1,
    score: 96,
    maxScore: 100,
    rubricScores: {
      r51: 48,
      r52: 48
    },
    privateNotes: 'Solid work.',
    studentFeedback: 'Outstanding mathematical derivation of the potential function. Keep up the high standard.',
    gradedAt: '2026-09-24T10:00:00Z',
    isReturned: true,
    returnedAt: '2026-09-24T10:15:00Z',
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Mid-Semester Examination Schedule & Office Hours Extended',
    message: 'Please take note that mid-semester assessments for CSC 301 and CSC 305 will take place starting next Wednesday. I will hold extended office hours on Monday and Tuesday from 2:00 PM to 5:30 PM in Turing Hall 402 or via the faculty conference room.',
    courseId: 'all',
    authorId: 'user_lecturer_1',
    authorName: 'Prof. Dr. Cusson',
    authorRole: 'Senior Associate Professor',
    publishDate: '2026-10-07T09:00:00Z',
    isUrgent: true,
    readByUserIds: ['user_student_1', 'user_student_4']
  },
  {
    id: 'ann_2',
    title: 'CSC 301: Clarification on Red-Black Tree Deletion Sentinel Nodes',
    message: 'A few students asked regarding handling the external NIL nodes. You may represent leaf NIL nodes either as explicit singleton sentinel objects or null checks, provided the black-height invariance rule (Property 5) is strictly respected in your verification routine.',
    courseId: 'course_csc301',
    authorId: 'user_lecturer_1',
    authorName: 'Prof. Dr. Cusson',
    authorRole: 'Senior Associate Professor',
    publishDate: '2026-10-06T15:30:00Z',
    isUrgent: false,
    readByUserIds: ['user_student_1', 'user_student_2', 'user_student_3']
  },
  {
    id: 'ann_3',
    title: 'CSC 305: Guest Speaker from Cloud Database Infrastructure',
    message: 'We are thrilled to host a guest lecture this Friday at 11:00 AM on modern distributed transaction consensus protocols (Raft & Spanner). Attendance is mandatory for registered students.',
    courseId: 'course_csc305',
    authorId: 'user_lecturer_1',
    authorName: 'Prof. Dr. Cusson',
    authorRole: 'Senior Associate Professor',
    publishDate: '2026-10-05T11:00:00Z',
    isUrgent: false,
    readByUserIds: ['user_student_1']
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_lecturer_1',
    title: 'New Submission from Alex Rivera',
    message: 'Alex Rivera submitted "Assignment 2: Red-Black Trees & Self-Balancing Maps" for CSC 301.',
    type: 'submission',
    linkTab: 'submissions',
    linkId: 'sub_1',
    read: false,
    createdAt: '2026-10-07T14:22:00Z'
  },
  {
    id: 'notif_2',
    userId: 'user_lecturer_1',
    title: 'Late Submission Detected',
    message: 'Liam Davies submitted "Lab 4: Secure Authentication" 10 hours after deadline.',
    type: 'submission',
    linkTab: 'submissions',
    linkId: 'sub_7',
    read: false,
    createdAt: '2026-10-07T09:30:00Z'
  },
  {
    id: 'notif_3',
    userId: 'user_lecturer_1',
    title: 'Assignment Deadline Approaching',
    message: 'CSC 305 Milestone 1 deadline is tomorrow at 5:00 PM. 3 submissions pending grading.',
    type: 'assignment',
    linkTab: 'assignments',
    linkId: 'asg_2',
    read: false,
    createdAt: '2026-10-08T00:00:00Z'
  },
  {
    id: 'notif_4',
    userId: 'user_student_1', // Alex
    title: 'Assignment Graded: Lab 4 Authentication',
    message: 'Prof. Dr. Cusson graded your submission with 47/50. View lecturer feedback.',
    type: 'grade',
    linkTab: 'grades',
    linkId: 'sub_8',
    read: false,
    createdAt: '2026-10-07T11:05:00Z'
  },
  {
    id: 'notif_5',
    userId: 'user_student_1',
    title: 'Important Announcement Posted',
    message: 'Prof. Dr. Cusson posted: "Mid-Semester Examination Schedule & Office Hours Extended".',
    type: 'announcement',
    linkTab: 'announcements',
    linkId: 'ann_1',
    read: true,
    createdAt: '2026-10-07T09:05:00Z'
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev_1',
    title: 'CSC 305 Milestone 1 Deadline',
    date: '2026-10-09',
    time: '17:00',
    courseId: 'course_csc305',
    courseCode: 'CSC 305',
    type: 'assignment_deadline',
    description: 'Relational Schema Normalization & SQL Queries'
  },
  {
    id: 'ev_2',
    title: 'CSC 301 Assignment 2 Deadline',
    date: '2026-10-10',
    time: '23:59',
    courseId: 'course_csc301',
    courseCode: 'CSC 301',
    type: 'assignment_deadline',
    description: 'Red-Black Trees & Self-Balancing Maps'
  },
  {
    id: 'ev_3',
    title: 'Extended Office Hours (Turing 402)',
    date: '2026-10-12',
    time: '14:00 - 17:30',
    type: 'office_hours',
    description: 'One-on-one consultation for algorithm proofs and database design.'
  },
  {
    id: 'ev_4',
    title: 'CSC 305 Guest Lecture: Cloud DB Architecture',
    date: '2026-10-09',
    time: '11:00',
    courseId: 'course_csc305',
    courseCode: 'CSC 305',
    type: 'lecture',
    description: 'Special session on distributed replication with invited guest engineer.'
  },
  {
    id: 'ev_5',
    title: 'CSC 309 Sprint 2 Submission Due',
    date: '2026-10-18',
    time: '23:59',
    courseId: 'course_csc309',
    courseCode: 'CSC 309',
    type: 'assignment_deadline',
    description: 'Architecture Design Document & Design Patterns'
  }
];
