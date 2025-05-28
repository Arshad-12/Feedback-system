import React, { useState } from 'react';
import './FacilitiesFeedback.css';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const questions = [
  "How do you rate the internet speed and connectivity on campus?",
  "How do you rate the availability of Wi-Fi in classrooms and common areas?",
  "How do you rate the efficiency of processes like fee payment, attendance, and scholarship applications?",
  "Are the administrative staff approachable and helpful?",
  "How do you rate the cleanliness and maintenance of restrooms on campus?",
  "Are there enough restrooms available to meet student needs?",
];

const FacilitiesFeedback = () => {
  const [formData, setFormData] = useState({
    year: '',
    responses: Array(questions.length).fill(null),
    suggestions: ''
  });

  const handleInputChange = (index, value) => {
    const updatedResponses = [...formData.responses];
    updatedResponses[index] = value;
    setFormData({ ...formData, responses: updatedResponses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allAnswered = formData.responses.every(response => response !== null);

    if (!formData.year || !formData.suggestions || !allAnswered) {
      alert("Please fill in all required fields including year, suggestions, and all feedback questions.");
      return;
    }

    try {
      await addDoc(collection(db, 'facilitiesFeedback'), {
        ...formData,
        submittedAt: Timestamp.now()
      });

      alert('Feedback submitted successfully!');
      setFormData({
        year: '',
        responses: Array(questions.length).fill(null),
        suggestions: ''
      });
    } catch (error) {
      console.error("Error writing document: ", error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-header">Facilities Feedback Form</h2>

      <div className="row-container">
        <label className="half-width label">
          Year of Study <span className="text-danger">*</span>
          <input
            type="text"
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="input-field"
          />
        </label>
      </div>

      {questions.map((question, index) => (
        <div key={index} className="question-block">
          <p className="question-text">
            {question} <span className="text-danger">*</span>
          </p>
          <div className="radio-group">
            {[5, 4, 3, 2, 1].map((value) => (
              <label key={value} className="radio-label">
                <input
                  type="radio"
                  name={`q${index}`}
                  value={value}
                  checked={formData.responses[index] === value}
                  onChange={() => handleInputChange(index, value)}
                  className="radio-button"
                />
                {value}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="suggestions-section">
        <label htmlFor="suggestions" className="suggestions-label">
          Additional Suggestions <span className="text-danger">*</span>
        </label>
        <textarea
          id="suggestions"
          required
          value={formData.suggestions}
          onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="submit-section">
        <button type="submit" className="submit-button">
          Submit
        </button>
      </div>
    </form>
  );
};

export default FacilitiesFeedback;
