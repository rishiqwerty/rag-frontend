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

  const fetchTasks = async () => {
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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      {!emailSubmitted && (
        <>
          <h2>Enter your Email</h2>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            placeholder="your.email@example.com"
          />
          <button onClick={fetchTasks} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Documents'}
          </button>
        </>
      )}

      {emailSubmitted && (
        <>
          <h2>Select Document & Ask a Question</h2>

          <label>Select Document:</label>
          <select
            value={selectedTaskId}
            onChange={(e) => {
              setSelectedTaskId(e.target.value);
              setTaskStatus(null);
            }}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          >
            <option value="">-- Select a document --</option>
            {tasks.map((task) => (
              <option key={task.task_id} value={task.task_id}>
                {task.file_name}
              </option>
            ))}
          </select>

          <div style={{ marginBottom: '1rem' }}>
            <button onClick={checkTaskStatus} disabled={statusLoading}>
              {statusLoading ? 'Checking...' : 'Check Status'}
            </button>
            {taskStatus && (
              <p style={{ marginTop: '0.5rem' }}>{taskStatus}</p>
            )}
          </div>

          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            placeholder="Type your question here"
          />

          <button onClick={handleQuery} disabled={loading}>
            {loading ? 'Searching...' : 'Ask'}
          </button>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {answers.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Answers:</h3>
          <ul>
            {answers.map((ans, index) => (
              <li key={index}>{ans}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QueryDocument;
