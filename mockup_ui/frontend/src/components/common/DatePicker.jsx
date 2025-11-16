import { useState, useEffect, useRef } from "react";
import styles from "../../styles/DatePicker.module.css";

/**
 * DatePicker component that displays date in dd/mm/yyyy format with custom calendar dropdown
 * @param {Object} props
 * @param {string} props.value - Date value in YYYY-MM-DD format
 * @param {Function} props.onChange - Callback function when date changes
 * @param {string} props.label - Label text for the date picker
 * @param {boolean} props.required - Whether the field is required
 */
export default function DatePicker({
  value = "",
  onChange,
  label,
  required = false,
}) {
  const [displayValue, setDisplayValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  // Convert YYYY-MM-DD to dd/mm/yyyy for display
  useEffect(() => {
    if (value) {
      const date = new Date(value + "T00:00:00");
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      setDisplayValue(`${day}/${month}/${year}`);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize currentMonth based on value
  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value + "T00:00:00"));
    }
  }, [value]);

  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    onChange(`${year}-${month}-${day}`);
    setIsOpen(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelectedDate = (date) => {
    if (!value || !date) return false;
    const selectedDate = new Date(value + "T00:00:00");
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={styles.datePickerContainer} ref={containerRef}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.datePickerWrapper}>
        <div className={styles.inputWrapper} onClick={() => setIsOpen(!isOpen)}>
          <div className={styles.displayValue}>
            {displayValue || "dd/mm/yyyy"}
          </div>
          <div className={styles.calendarIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className={styles.calendarDropdown}>
            <div className={styles.calendarHeader}>
              <button
                type="button"
                className={styles.navButton}
                onClick={previousMonth}
              >
                ‹
              </button>
              <div className={styles.monthYear}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              <button
                type="button"
                className={styles.navButton}
                onClick={nextMonth}
              >
                ›
              </button>
            </div>

            <div className={styles.weekDays}>
              {weekDays.map((day) => (
                <div key={day} className={styles.weekDay}>
                  {day}
                </div>
              ))}
            </div>

            <div className={styles.daysGrid}>
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div
                  key={index}
                  className={`${styles.dayCell} ${
                    date ? styles.dayActive : styles.dayEmpty
                  } ${isSelectedDate(date) ? styles.daySelected : ""} ${
                    isToday(date) ? styles.dayToday : ""
                  }`}
                  onClick={() => date && handleDateSelect(date)}
                >
                  {date ? date.getDate() : ""}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
