import React, { useState } from "react";
import "./quitProgressCard.css";
import { parseDate, formatDate } from "../../services/dateUtils";
import {
  saveQuitProgressLog,
  updateQuitProgressLog,
  cancelQuitPlan,
} from "../../services/quitPlanService";
import { toast } from "react-toastify";
import StatCard from "./StatCard";
import { FaPiggyBank } from "react-icons/fa";

function QuitProgressCard({ quitplan, fullToken, costPerPack }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [cigarettes, setCigarettes] = useState("");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const startDate = quitplan.startDate;
  const targetEndDate = quitplan.targetEndDate;
  const progressLogs = quitplan.progressLogs || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);

  const generateDaysArray = (startStr, endStr) => {
    const start = parseDate(startStr);
    const end = parseDate(endStr);
    if (!start || !end) return [];

    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dateList = generateDaysArray(startDate, targetEndDate);

  const logMap = {};
  progressLogs.forEach((log) => {
    const parsed = parseDate(log.createdAt); // <-- Sửa ở đây
    if (parsed) {
      const formatted = formatDate(parsed);
      logMap[formatted] = log;
      //console.log("[Mapped Log]", log.createdAt, "->", formatted);
    } else {
      console.warn("[Invalid log date]", log.createdAt);
    }
  });
  //Hủy bỏ Quit Plan
  const handleCancelQuitPlan = async () => {
    if (!window.confirm("Are you sure you want to cancel this quit plan?"))
      return;

    try {
      await cancelQuitPlan(quitplan.id, fullToken);
      toast.success("Quit plan cancelled.", { theme: "colored" });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel quit plan.", { theme: "dark" });
    }
  };

  //Hiện log đuọc chọn
  const handleSelectLog = (log, dateStr) => {
    const existingLog = log || { createdAt: dateStr };
    setSelectedLog(existingLog);
    setCigarettes(existingLog.cigarettesSmoked ?? "");
    setNote(existingLog.notes ?? "");
  };

  //Lưu log mới hoặc cập nhật log đã có
  const handleSave = async () => {
    const isExistingLog = !!selectedLog?.logId;

    const payload = {
      quitPlanId: quitplan.id,
      cigarettesSmoked: parseInt(cigarettes) || null,
      notes: note,
      createdAt: selectedLog.createdAt,
    };

    setIsSaving(true);
    try {
      if (isExistingLog) {
        // Gọi API update nếu có logId
        await updateQuitProgressLog(selectedLog.logId, payload, fullToken);
      } else {
        // Gọi API create nếu chưa có logId
        await saveQuitProgressLog(payload, fullToken);
      }

      toast.success("Progress saved successfully!", {
        theme: "colored",
        position: "top-right",
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save progress. Please try again.", {
        theme: "dark",
        position: "top-left",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="quit-progress-container">
      <h1>Quit Journey Progress</h1>
      <div className="road-track">
        {dateList.map((date, index) => {
          const dateStr = formatDate(date);
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
              onClick={() => {
                if (date <= today) handleSelectLog(log, dateStr);
              }}
            >
              <div className="day-label">
                {isStart
                  ? `Day ${index + 1} 🚩`
                  : isEnd
                  ? `Day ${index + 1} 🎉`
                  : `Day ${index + 1}`}
              </div>
              <div className="roadinfo-label">
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
      {/* Hiển thị thông tin của quit plan */}
      <div className="summary-section">
        <div className="summary-left">
          <StatCard
            icon={<FaPiggyBank />}
            iconClass="card-icon--money"
            value={(quitplan.totalSmoke * (costPerPack/20)).toLocaleString() + " VND"}
            label="Money Saved"
          />
          <StatCard
            icon="🚭"
            iconClass="card-icon--avoided"
            value={quitplan.totalSmoke}
            label="Cigarettes Avoided"
          />
        </div>
        <div className="summary-right">
          {quitplan.methodOptions?.map((method) => (
            <div key={method.id} className="method-description">
              <h4 className="method-title">{method.optionText}</h4>
              <div
                dangerouslySetInnerHTML={{ __html: method.optionDescription }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={handleCancelQuitPlan}
          style={{
            backgroundColor: "#e53935",
            color: "white",
            padding: "12px 24px",
            fontSize: "1rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cancel Quit Plan
        </button>
      </div>

      {/* Hiển thị UI overlay của log khi click vào các day*/}
      {selectedLog && (
        <div className="overlay">
          <div className="modal">
            <h3>Log for {selectedLog.createdAt}</h3>
            <div>
              <label>Number of Cigarettes Smoked:</label>
              <input
                type="number"
                min="0"
                value={cigarettes}
                onChange={(e) => setCigarettes(e.target.value)}
              />
            </div>
            <div>
              <label>Note:</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setSelectedLog(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuitProgressCard;
