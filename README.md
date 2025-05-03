# Student Registration System Documentation

## Overview
This documentation explains the Student Registration System - a web application that dynamically displays student information, organizing them by class and grade levels using vanilla JavaScript.

## Table of Contents
- [Features](#features)
- [Code Structure](#code-structure)
- [Data Model](#data-model)
- [Functions](#functions)
- [Implementation Details](#implementation-details)
- [Customization Guide](#customization-guide)


## Features
- Display students grouped by their class (JSS1, JSS2, JSS3)
- Display students grouped by grade (A, B, C, D, F)
- Color-coded grade visualization 
- Responsive design that works on both mobile and desktop
- Sort students alphabetically within classes
- Sort students by score within grade categories

## Code Structure
The entire application is contained in a single HTML file with three main sections:
1. **HTML**: Basic structure with containers for displaying student data
2. **CSS**: Styling for responsive and visually appealing UI
3. **JavaScript**: Logic for processing and displaying student data

## Data Model
Students are stored as an array of objects with the following structure:
```javascript
const students = [
    { name: "John Doe", class: "JSS1", score: 75 },
    { name: "Jane Smith", class: "JSS1", score: 92 },
    ...
];
```

Each student object contains:
- `name`: Student's full name
- `class`: Class identifier (JSS1, JSS2, JSS3)
- `score`: Numeric score (0-100)

## Functions

### `getGrade(score)`
Maps a numeric score to a letter grade according to the following scale:
- A: 70-100
- B: 60-69
- C: 50-59
- D: 40-49
- F: 0-39

### `groupStudentsBy(property)`
Groups students based on a specific property (either class or grade).
- Returns an object where keys are the property values and values are arrays of student objects

### `displayStudentsByClass()`
- Fetches students grouped by class
- Creates HTML elements to display each class and its students
- Sorts students alphabetically within each class

### `displayStudentsByGrade()`
- Fetches students grouped by grade
- Creates HTML elements to display each grade category and its students
- Sorts students by score (descending) within each grade category

## Implementation Details

### Grading Logic
The system automatically calculates a letter grade based on the student's numeric score:
```javascript
function getGrade(score) {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 40) return "D";
    return "F";
}
```

### Dynamic Element Creation
The application dynamically generates HTML elements to display student information:
```javascript
const listItem = document.createElement('li');
listItem.className = 'student-item';
listItem.innerHTML = `
    <span class="student-name">${student.name}</span>
    <span class="student-score grade-${grade}">
        Score: ${student.score} (Grade: ${grade})
    </span>
`;
```

### Event Listeners
The application initializes when the DOM content is fully loaded:
```javascript
document.addEventListener('DOMContentLoaded', () => {
    displayStudentsByClass();
    displayStudentsByGrade();
});
```

## Customization Guide

### Modifying Student Data
To add, edit, or remove students, update the `students` array in the JavaScript section:
```javascript
const students = [
    { name: "New Student Name", class: "JSS1", score: 85 },
    // Add more students here
];
```

### Changing Grade Scale
To modify the grade scale, edit the `getGrade()` function:
```javascript
function getGrade(score) {
    if (score >= 75) return "A"; // Changed from 70
    if (score >= 65) return "B"; // Changed from 60
    // etc.
}
```

### Styling Modifications
To change the appearance, modify the CSS variables and classes in the `<style>` section.
