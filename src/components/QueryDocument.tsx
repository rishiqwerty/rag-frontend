import React, { useState } from 'react';
import config from '../config';

interface Task {
  task_id: string;
  file_name: string;
  status: string;
}

const QueryDocument: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchTasks = async (reset: boolean = false) => {
    if (reset) {
      setEmailSubmitted(false);
      setTasks([]);
      return;
    }
  
    if (!userEmail) {
      setError('Please enter your email.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/users/tasks/${userEmail}`);
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0) {
        setTasks(data);
        setEmailSubmitted(true);
      } else {
        setError('No documents found for this email.');
      }
    } catch (err) {
      setError('Failed to fetch documents. Please check your email.');
    }
  
    setLoading(false);
  };

  const handleQuery = async () => {
    if (!selectedTaskId || !question) {
      setError('Please select a document and enter a question.');
      return;
    }

    setLoading(true);
    setAnswers([]);
    setError(null);

    try {
      const response = await fetch(`${config.API_BASE_URL}/document/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: selectedTaskId, question }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.error === 'Task not found') {
          setError('Task not found. Please check your selection.');
        } else if (data.answers) {
          setAnswers(data.answers);
        } else {
          setError('Unexpected response from server.');
        }
      } else {
        setError(data.error || 'Failed to fetch answers.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const checkTaskStatus = async () => {
    if (!selectedTaskId) {
      setError('Please select a document to check status.');
      return;
    }

    setStatusLoading(true);
    setError(null);
    setTaskStatus(null);

    try {
      const response = await fetch(`${config.API_BASE_URL}/task-status/${selectedTaskId}`);
      const data = await response.json();

      if (response.ok) {
        if (data.error) {
          setTaskStatus('Task not found.');
        } else {
          setTaskStatus(`Task Status: ${data.status}`);
        }
      } else {
        setTaskStatus('Failed to fetch task status.');
      }
    } catch (err) {
      setTaskStatus('Error checking status.');
    }

    setStatusLoading(false);
  };

    return (
    <div style={{ border: '1px solid #ddd', padding: '0.75rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {!emailSubmitted && (
        <>
          <h2 style={{ marginBottom: '1rem', }}>Enter your Email</h2>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            style={{
              width: '95%',
              padding: '0.75rem 0rem 0.75rem 0.75rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
            placeholder="your.email@example.com"
          />
          <button
            onClick={() => fetchTasks()}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Documents'}
          </button>
        </>
      )}
  
      {emailSubmitted && (
        <>
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Select Document & Ask a Question</h2>

          <p style={{ textAlign: 'center', marginBottom: '1rem', fontStyle: 'italic', color: '#555' }}>
            Email: <strong>{userEmail}</strong>
          </p>
          <button
            onClick={() => fetchTasks(true)}
            disabled={loading}
            style={{
              width: '50%',
              margin: 'auto 25%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Refetching...' : 'Refetch Documents'}
          </button>
  
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Document:</label>
          <select
            value={selectedTaskId}
            onChange={(e) => {
              setSelectedTaskId(e.target.value);
              setTaskStatus(null);
            }}
            style={{
              width: '98%',
              padding: '0.75rem 0rem 0.75rem 0.75rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          >
            <option value="">-- Select a document --</option>
            {tasks.map((task) => (
              <option key={task.task_id} value={task.task_id}>
                {task.file_name}
              </option>
            ))}
          </select>
  
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={checkTaskStatus}
              disabled={statusLoading}
              style={{
                width: '50%',
                margin: 'auto 25%',
                padding: '0.75rem',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: statusLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {statusLoading ? 'Checking...' : 'Check Status'}
            </button>
            {taskStatus && (
              <p style={{ marginTop: '0.5rem', textAlign: 'center' }}>{taskStatus}</p>
            )}
          </div>
  
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              width: '95%',
              padding: '0.75rem 0rem 0.75rem 0.75rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
            placeholder="Type your question here"
          />
  
          <button
            onClick={handleQuery}
            disabled={loading}
            style={{
              width: '98%',
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Searching...' : 'Ask'}
          </button>
        </>
      )}
  
      {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
  
      {answers.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ textAlign: 'center' }}>Answers:</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {answers.map((ans, index) => (
              <li
                key={index}
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
              >
                {ans}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QueryDocument;
