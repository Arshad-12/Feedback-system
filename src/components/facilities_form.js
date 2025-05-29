import React, { useState } from 'react';
import './FacilitiesFeedback.css';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


const questions = [
  "How do you rate the internet speed and connectivity on campus?",
  "How do you rate the availability of Wi-Fi in classrooms and common areas?",
  "Are the laboratories equipped with the necessary tools for your coursework?",
  "How do you rate the condition and maintenance of lab equipment?",
  "How comfortable and conducive to learning are the classrooms?",
  "How do you rate the availability of teaching aids like projectors or smart boards?",
  "How do you rate the availability of computers for academic use?",
  "Are the systems well-maintained and updated regularly?",
  "How do you rate the availability of sports facilities and playgrounds?",
  "Are the playground and sports equipment well-maintained?",
  "How do you rate the condition of campus roads and walkways?",
  "Are the water and electricity supplies reliable?",
  "How do you rate the quality of food provided in the canteen?",
  "Are the seating arrangements in the canteen sufficient?",
  "How accessible are campus facilities for differently-abled students?",
  "Are ramps, elevators, and restrooms available and functional?",
  "How do you rate the availability of first aid and medical services on campus?",
  "How accessible are doctors or medical professionals when needed?",
  "Are the facilities for indoor and outdoor games satisfactory?",
  "How do you rate the maintenance of sports equipment?",
  "How do you rate the equipment and maintenance of the gym?",
  "Are the gym timings convenient for student use?",
  "How do you rate the library infrastructure (seating, lighting, and environment)?",
  "Are the operating hours of the library convenient?",
  "How do you rate the availability of books, e-resources, and journals?",
  "How do you rate the variety of clubs available for extracurricular activities?",
  "Are there sufficient facilities to conduct club activities effectively?",
  "How do you rate the support provided by the college for club activities and events?",
  "How do you rate the availability of self-learning resources (MOOC, SWAYAM-NPTEL, etc.)?",
  "Are these resources effectively promoted and accessible?",
  "How do you rate the availability of printing and photocopying services?",
  "Are these services affordable and reliable?",
  "How do you rate the accessibility of banking facilities, including ATMs, on campus?",
  "Are these facilities sufficient to meet your needs?",
  "How do you rate the efficiency of processes like fee payment, attendance, and scholarship applications?",
  "Are the administrative staff approachable and helpful?",
  "How do you rate the cleanliness and maintenance of restrooms on campus?",
  "Are there enough restrooms available to meet student needs?"
];

const FacilitiesFeedback = () => {
  const [formData, setFormData] = useState({
    year: '',
    responses: Array(questions.length).fill(null),
    suggestions: ''
  });

  const navigate = useNavigate();

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
      const username = localStorage.getItem("username") || "unknown";

      await addDoc(collection(db, 'facilitiesFeedback'), {
        username,
        ...formData,
        submittedAt: Timestamp.now()
      });

      alert('Feedback submitted successfully!');
      setFormData({
        year: '',
        responses: Array(questions.length).fill(null),
        suggestions: ''
      });

      navigate('/select-form');
      
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