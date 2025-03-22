// Priority Scheduling (Non-Preemptive)
export const calculatePriorityNonPreemptive = (processes) => {
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;
  const result = Array(n).fill(null);
  const remaining = processes.map((p) => ({ ...p }));

  while (completed < n) {
    let maxPriority = -Infinity;
    let nextProcess = null;
    // Tìm tiến trình có ưu tiên cao nhất (số lớn hơn là ưu tiên cao hơn)
    for (let i = 0; i < n; i++) {
      if (
        !result[i] &&
        remaining[i].arrivalTime <= currentTime &&
        remaining[i].priority > maxPriority
      ) {
        maxPriority = remaining[i].priority;
        nextProcess = i;
      }
    }

    if (nextProcess === null) {
      currentTime++;
      continue;
    }

    const p = remaining[nextProcess];
    const startTime = Math.max(currentTime, p.arrivalTime);
    currentTime = startTime + p.burstTime;
    const finishTime = currentTime;
    result[nextProcess] = {
      ...p,
      turnaroundTime: finishTime - p.arrivalTime,
      waitingTime: finishTime - p.arrivalTime - p.burstTime,
      responseTime: startTime - p.arrivalTime,
    };
    completed++;
  }
  return result;
};
