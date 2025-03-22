import React, { useState } from "react";
import "./App.css";
import { calculateFCFS } from "./algorithms/fcfs";
import { calculateSJFNonPreemptive } from "./algorithms/sjfNonPreemptive";
import { calculateSJFPreemptive } from "./algorithms/sjfPreemptive";
import { calculatePriorityNonPreemptive } from "./algorithms/priorityNonPreemptive";
import { calculatePriorityPreemptive } from "./algorithms/priorityPreemptive";
import { calculateRoundRobin } from "./algorithms/roundRobin";

function App() {
  const [numProcesses, setNumProcesses] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [quantum, setQuantum] = useState(2);
  const [results, setResults] = useState(null);

  const handleNumProcessesChange = (e) => {
    const n = parseInt(e.target.value) || 0;
    setNumProcesses(n);
    setProcesses(
      Array(n)
        .fill()
        .map((_, i) => ({
          id: i + 1,
          arrivalTime: 0,
          burstTime: 0,
          priority: 0,
        }))
    );
  };

  const handleProcessChange = (index, field, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][field] = parseInt(value) || 0;
    setProcesses(updatedProcesses);
  };

  const handleCalculate = () => {
    switch (algorithm) {
      case "FCFS":
        setResults(calculateFCFS(processes));
        break;
      case "SJF-NP":
        setResults(calculateSJFNonPreemptive(processes));
        break;
      case "SJF-P":
        setResults(calculateSJFPreemptive(processes));
        break;
      case "Priority-NP":
        setResults(calculatePriorityNonPreemptive(processes));
        break;
      case "Priority-P":
        setResults(calculatePriorityPreemptive(processes));
        break;
      case "RR":
        setResults(calculateRoundRobin(processes, quantum));
        break;

      default:
        break;
    }
  };

  const requiresPriority =
    algorithm.includes("Priority") ||
    algorithm === "MLQ" ||
    algorithm === "MLFQ";

  const calculateSummary = () => {
    if (!results || results.length === 0) return { sum: {}, avg: {} };

    const sum = {
      turnaroundTime: 0,
      responseTime: 0,
      waitingTime: 0,
    };
    results.forEach((r) => {
      sum.turnaroundTime += r.turnaroundTime;
      sum.responseTime += r.responseTime;
      sum.waitingTime += r.waitingTime;
    });

    const avg = {
      turnaroundTime: (sum.turnaroundTime / results.length).toFixed(2),
      responseTime: (sum.responseTime / results.length).toFixed(2),
      waitingTime: (sum.waitingTime / results.length).toFixed(2),
    };

    return { sum, avg };
  };

  const summary = results ? calculateSummary() : null;

  return (
    <div className="App">
      <h1>Lập lịch CPU</h1>

      <div>
        <label>Chọn thuật toán: </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="FCFS">FCFS</option>
          <option value="SJF-NP">SJF (Non-Preemptive)</option>
          <option value="SJF-P">SJF (Preemptive)</option>
          <option value="Priority-NP">Priority (Non-Preemptive)</option>
          <option value="Priority-P">Priority (Preemptive)</option>
          <option value="RR">Round Robin</option>
        </select>
      </div>

      <div>
        <label>Số tiến trình: </label>
        <input type="number" min="0" onChange={handleNumProcessesChange} />
      </div>

      {(algorithm === "RR" || algorithm === "MLQ") && (
        <div>
          <label>Quantum: </label>
          <input
            type="number"
            min="1"
            value={quantum}
            onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
          />
        </div>
      )}

      {processes.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Tiến trình</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              {requiresPriority && <th>Priority</th>}
            </tr>
          </thead>
          <tbody>
            {processes.map((p, index) => (
              <tr key={p.id}>
                <td>P{p.id}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      handleProcessChange(index, "arrivalTime", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    onChange={(e) =>
                      handleProcessChange(index, "burstTime", e.target.value)
                    }
                  />
                </td>
                {requiresPriority && (
                  <td>
                    <input
                      type="number"
                      min="0"
                      onChange={(e) =>
                        handleProcessChange(index, "priority", e.target.value)
                      }
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={handleCalculate}>Tính toán</button>

      {results && (
        <table>
          <thead>
            <tr>
              <th>Tiến trình</th>
              <th>Turnaround Time</th>
              <th>Response Time</th>
              <th>Waiting Time</th>
              {requiresPriority && <th>Priority</th>}
            </tr>
          </thead>
          <tbody>
            {results.map((r, index) => (
              <tr key={index}>
                <td>P{r.id}</td>
                <td>{r.turnaroundTime}</td>
                <td>{r.responseTime}</td>
                <td>{r.waitingTime}</td>
                {requiresPriority && <td>{r.priority}</td>}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Tổng</td>
              <td>{summary.sum.turnaroundTime}</td>
              <td>{summary.sum.responseTime}</td>
              <td>{summary.sum.waitingTime}</td>
              {requiresPriority && <td>-</td>}
            </tr>
            <tr>
              <td>Trung bình</td>
              <td>{summary.avg.turnaroundTime}</td>
              <td>{summary.avg.responseTime}</td>
              <td>{summary.avg.waitingTime}</td>
              {requiresPriority && <td>-</td>}
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

export default App;
