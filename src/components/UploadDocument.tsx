import { useState } from 'react';
import styles from './UploadDocument.module.css';
import config from '../config';

const UploadDocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isStructuredJson, setIsStructuredJson] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", email);
    formData.append("is_structured_json", String(isStructuredJson));

    const response = await fetch(`${config.API_BASE_URL}/upload-document`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setStatus(`Task ID: ${data.task_id}, Status: ${data.Status}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    // Check if the selected file is a JSON file
    if (selectedFile && selectedFile.name.endsWith('.json')) {
      setIsStructuredJson(false); // Default to false
    } else {
      setIsStructuredJson(false); // Reset if not a JSON file
    }
  };

  return (
    <div className={styles.container}>
      <h2>Upload a Document</h2>
      <input type="file" onChange={handleFileChange} />
      {file && file.name.endsWith('.json') && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={isStructuredJson}
              onChange={(e) => setIsStructuredJson(e.target.checked)}
            />
            Is this a structured JSON file?
          </label>
          {isStructuredJson && (
            <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px', }}>
              <h4>JSON should strictly follow this format and have these fields:</h4>
              <pre style={{ fontSize: '0.9rem', overflowX: 'auto' }}>
  {`{
    "customer_id": 147,
    "name": "Customer 147",
    "age": 44,
    "membership": "Gold",
    "purchases_last_6_months": 11,
    "total_spent": 24071.11,
    "preferred_category": "Fitness",
    "last_purchase_date": "2024-09-09",
    "nearest_store": "Pune Koregaon Park"
  }`}
              </pre>
            </div>
          )}
        </div>
      )}
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleUpload} className={styles.button}>Upload</button>
      <p>{status}</p>
    </div>
  );
};

export default UploadDocument;