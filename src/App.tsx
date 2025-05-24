import UploadDocument from './components/UploadDocument';
import QueryDocument from './components/QueryDocument';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>RAG System Frontend</h1>
      <UploadDocument />
      <QueryDocument />
    </div>
  );
}

export default App;
