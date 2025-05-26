import { useEffect, useState } from 'react';
import UploadDocument from './components/UploadDocument';
import QueryDocument from './components/QueryDocument';
import config from './config';

function App() {
  const [lambdaStatus, setLambdaStatus] = useState<string | null>(null);

  useEffect(() => {
    const bringUpLambda = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLambdaStatus(`Backend Status: Active`);
        } else {
          setLambdaStatus('Error: Backend service is not ready yet.');
          setTimeout(bringUpLambda, 20000);
        }
      } catch (error) {
        setLambdaStatus('Error: Backend service is not ready yet.');
        setTimeout(bringUpLambda, 20000);
      }
    };

    // Call the API once when the component mounts
    bringUpLambda();
  }, []); // Empty dependency array ensures this runs only once
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>RAG System Frontend</h1>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Upload your documents and ask questions
      </h3>
      {lambdaStatus && (
        <p style={{ textAlign: 'center', color: lambdaStatus.includes('Error') ? 'red' : 'green' }}>
          {lambdaStatus}
        </p>
      )}
      <UploadDocument />
      <QueryDocument />
    </div>
  );
}

export default App;
