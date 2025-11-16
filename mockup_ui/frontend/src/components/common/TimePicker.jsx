import { useState, useEffect } from "react";
import styles from "../../styles/TimePicker.module.css";

/**
 * TimePicker component with hour (0-23) and minute (00-59) dropdowns
 * @param {Object} props
 * @param {string} props.value - Time value in HH:MM format (e.g., "14:30")
 * @param {Function} props.onChange - Callback function when time changes
 * @param {string} props.label - Label text for the time picker
 * @param {boolean} props.required - Whether the field is required
 */
export default function TimePicker({ value = "00:00", onChange, label, required = false }) {
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");

  // Parse value when it changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHour(h || "00");
      setMinute(m || "00");
    }
  }, [value]);

  const handleHourChange = (newHour) => {
    setHour(newHour);
    onChange(`${newHour}:${minute}`);
  };

  const handleMinuteChange = (newMinute) => {
    setMinute(newMinute);
    onChange(`${hour}:${newMinute}`);
  };

  // Generate hour options (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, "0");
    return (
      <option key={h} value={h}>
        {h}
      </option>
    );
  });

  // Generate minute options (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => {
    const m = i.toString().padStart(2, "0");
    return (
      <option key={m} value={m}>
        {m}
      </option>
    );
  });

  return (
    <div className={styles.timePickerContainer}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.timePicker}>
        <select
          className={styles.select}
          value={hour}
          onChange={(e) => handleHourChange(e.target.value)}
          required={required}
        >
          {hours}
        </select>
        <span className={styles.separator}>:</span>
        <select
          className={styles.select}
          value={minute}
          onChange={(e) => handleMinuteChange(e.target.value)}
          required={required}
        >
          {minutes}
        </select>
      </div>
    </div>
  );
}
