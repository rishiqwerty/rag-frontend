import { useState } from 'react';
import styles from './UploadDocument.module.css';
import config from '../config';

const UploadDocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", email);

    const response = await fetch(`${config.API_BASE_URL}/upload-document`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setStatus(`Task ID: ${data.task_id}, Status: ${data.Status}`);
  };

  return (
    <div className={styles.container}>
      <h2>Upload a Document</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
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
