import React, { useState, useEffect } from 'react';
import { Form, Table, Button, Alert } from 'react-bootstrap';
import './SyllabiForm.css';

function SyllabiForm() {
  const [displayform, setDisplay] = useState(true);
  const [recommendations, setRecommendations] = useState('');
  const [error_msg, setErrorMsg] = useState('');
  const [responses, setResponses] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const questions = {
    q1: "The syllabus clearly explains the key technical concepts required.",
    q2: "The syllabus matches well with the stated learning objectives.",
    q3: "There is a good balance between theoretical and practical aspects.",
    q4: "The syllabus covers current, relevant engineering topics effectively.",
    q5: "Projects, internships, or research work enhance the syllabus content.",
    q6: "Evaluation methods are fair, transparent, and easy to understand.",
    q7: "Syllabus encourages critical thinking and real-world problem solving.",
    q8: "Faculty have flexibility to use innovative teaching methods.",
    q9: "Resources and infrastructure support the syllabus delivery well."
  };

  const setNames = [
    "Subject 1", "Subject 2", "Subject 3", "Subject 4",
    "Subject 5", "Lab 1", "Lab 2", "Lab 3"
  ];

  const handleResponseChange = (qKey, setIdx, value) => {
    setResponses(prev => ({
      ...prev,
      [qKey]: {
        ...prev[qKey],
        [setNames[setIdx]]: value
      }
    }));
  };

  const validateForm = () => {
    if (Object.keys(responses).length < Object.keys(questions).length) return false;
    for (const q of Object.keys(questions)) {
      if (!responses[q] || Object.keys(responses[q]).length < setNames.length) {
        return false;
      }
    }
    if (!recommendations.trim()) return false;
    return true;
  };

  const formSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let existingEntries = JSON.parse(localStorage.getItem("syllabusFeedback")) || [];
      const newEntry = {
        id: existingEntries.length,
        responses,
        recommendations
      };
      existingEntries.push(newEntry);
      localStorage.setItem("syllabusFeedback", JSON.stringify(existingEntries));
      setDisplay(false);
      setErrorMsg('');
    } else {
      setErrorMsg('Please fill all required fields before submitting.');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  return (
    <>
      <div className="theme-toggle-container">
        <label htmlFor="theme-toggle">Dark Mode</label>
        <input
          type="checkbox"
          id="theme-toggle"
          className="theme-toggle-btn"
          checked={darkMode}
          onChange={e => setDarkMode(e.target.checked)}
        />
      </div>

      <div className="syllabi-form-page">
        <div className="syllabi-form-card">
          {displayform ? (
            <>
              <h2 className="card-title">Syllabus Feedback Form</h2>
              <form onSubmit={formSubmit}>
                <div className="table-wrapper">
                  <Table bordered className="syllabi-form-table" responsive style={{ minWidth: '1600px' }}>
                    <thead>
                      <tr>
                        <th rowSpan="2" style={{ minWidth: '300px', position: 'sticky', left: 0, backgroundColor: 'var(--table-header-bg)', zIndex: 2 }}>Question</th>
                        {setNames.map((setName, idx) => (
                          <th key={idx} colSpan={5} className="text-center">{setName}</th>
                        ))}
                      </tr>
                      <tr>
                        {setNames.flatMap(() =>
                          [5, 4, 3, 2, 1].map(score => (
                            <th key={score} className="text-center">{score}</th>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(questions).map(([qKey, question], qIdx) => (
                        <tr key={qKey}>
                          <td className="question-cell" style={{ position: 'sticky', left: 0, backgroundColor: 'var(--card-bg)', zIndex: 1 }}>
                            {qIdx + 1}. {question} <span className='text-danger'>*</span>
                          </td>
                          {setNames.flatMap((setName, setIdx) =>
                            [5, 4, 3, 2, 1].map(score => {
                              const fieldId = `${qKey}-${setName}-score${score}`;
                              return (
                                <td key={fieldId} className="text-center">
                                  <Form.Check
                                    type="radio"
                                    name={`${qKey}-${setName}`}
                                    value={score}
                                    checked={responses[qKey]?.[setName] === String(score)}
                                    onChange={e => handleResponseChange(qKey, setIdx, e.target.value)}
                                    id={fieldId}
                                    required
                                  />
                                </td>
                              );
                            })
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <Form.Group className="mb-4">
  <Form.Label className="tenth-question">
  <strong style={{ color: 'black' }}>
    10. What specific areas of improvement or modifications would you recommend for revising the syllabi?
    <span className='text-danger'> *</span>
  </strong>
</Form.Label>

  <Form.Control
    as="textarea"
    rows={4}
    className="syllabi-form-textarea"
    value={recommendations}
    onChange={e => setRecommendations(e.target.value)}
    placeholder="Your suggestions here..."
    required
  />
</Form.Group>


                {error_msg && <Alert variant="danger" className="syllabi-form-error">{error_msg}</Alert>}

                <div style={{ textAlign: 'center' }}>
                  <Button type="submit" className="syllabi-form-submit-btn">Submit Feedback</Button>
                </div>
              </form>
            </>
          ) : (
            <div className="syllabi-thanks-card">
              <h4>Thank you for your feedback!</h4>
              <p>We appreciate your valuable input towards improving our syllabi.</p>
              <Button variant="success" onClick={() => window.location.reload()}>Submit Another Response</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SyllabiForm;
