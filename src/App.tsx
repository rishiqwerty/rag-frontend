import UploadDocument from './components/UploadDocument';
import QueryDocument from './components/QueryDocument';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>RAG System Frontend</h1>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Upload your documents and ask questions
      </h3>
      <UploadDocument />
      <QueryDocument />
    </div>
  );
}

export default App;
