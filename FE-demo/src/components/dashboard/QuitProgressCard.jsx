import React, { useState } from "react";
import "./quitProgressCard.css";
import { parseDate, formatDate } from "../../services/dateUtils";

function QuitProgressCard({ quitplan, progressLogs = [] }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const startDate= quitplan.startDate;
  const targetEndDate = quitplan.targetEndDate;

  // Dùng parseDate đã được định nghĩa
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today); // "dd-MM-yyyy"

  // Generate list of days between start and end
  const generateDaysArray = (startStr, endStr) => {
    const start = parseDate(startStr);
    const end = parseDate(endStr);
    if (!start || !end) return [];

    const dates = [];
    let current = new Date(start);
    current.setHours(0, 0, 0, 0);
    while (current <= end) {
      const copy = new Date(current);
      dates.push(copy);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dateList = generateDaysArray(startDate, targetEndDate);

  // Tạo map để tra nhanh log theo ngày
  const logMap = {};
  progressLogs.forEach((log) => {
    const logDate = parseDate(log.createdAt);
    const formatted = formatDate(logDate);
    logMap[formatted] = log;
  });

  return (
    <div className="quit-progress-container">
      <h1>Quit Journey Progress</h1>
      <div className="road-track">
        {dateList.map((date, index) => {
          const dateStr = formatDate(date); // "dd-MM-yyyy"
          const log = logMap[dateStr];
          const isFilled = !!log;

          const isStart = index === 0;
          const isEnd = index === dateList.length - 1;
          const isToday = dateStr === todayStr;
          const isPast = date < today && !isToday;

          let classNames = "road-segment";
          if (isStart) classNames += " start";
          else if (isEnd) classNames += " end";
          else if (isToday) classNames += " today";
          else if (isPast) classNames += " past";
          else classNames += " future";

          classNames += isFilled ? " filled" : " empty";

          return (
            <div
              key={dateStr}
              className={classNames}
              title={dateStr}
              onClick={() => setSelectedLog(log || { createdAt: dateStr })}
            >
              <div className="day-label">
                {isStart ? `Day ${index + 1} 🚩` : isEnd ? `Day ${index + 1} 🎉` : `Day ${index + 1}`}
              </div>
              <div className="info-label">
                {date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                •{" "}
                {log?.cigarettesSmoked != null
                  ? `${log.cigarettesSmoked} 🚬`
                  : "N/A 🚬"}
              </div>
            </div>
          );
        })}
      </div>

      {selectedLog && (
        <div className="log-details">
          <h3>Details for {selectedLog.createdAt}</h3>
          <p>
            <strong>Cigarettes Smoked:</strong>{" "}
            {selectedLog.cigarettesSmoked ?? "N/A"}
          </p>
          <p>
            <strong>Notes:</strong> {selectedLog.notes || "No notes recorded."}
          </p>
        </div>
      )}
    </div>
  );
}

export default QuitProgressCard;
