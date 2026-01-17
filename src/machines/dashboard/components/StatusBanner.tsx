import styles from '../styles/StatusBanner.module.css';

interface StatusBannerProps {
  isSupported: boolean;
}

export default function StatusBanner({ isSupported }: StatusBannerProps) {
  if (!isSupported) {
    return (
      <div className={styles.banner} data-status="error">
        <div className={styles.header}>
          <span className={styles.icon}>❌</span>
          <strong>Web Bluetooth Not Supported</strong>
        </div>
        <p className={styles.message}>
          Your browser does not support Web Bluetooth API. Please use Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.banner} data-status="success">
      <div className={styles.header}>
        <span className={styles.icon}>✅</span>
        <strong>Web Bluetooth Supported</strong>
      </div>
      <p className={styles.message}>
        Ready to discover and connect to devices.
      </p>
    </div>
  );
}
