import styles from './about.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Student Details</h2>
        <p><strong>Name:</strong> Mallam Vikram Adithya</p>
        <p><strong>Student Number:</strong> 21950303</p>
      </div>

      <div className={styles.videoSection}>
        <h2>How to use this website</h2>
        <div className={styles.videoWrapper}>
          <video controls className={styles.videoPlayer}>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
