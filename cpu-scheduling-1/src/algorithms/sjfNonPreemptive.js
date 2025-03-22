// Shortest Job First (Non-Preemptive)
export const calculateSJFNonPreemptive = (processes) => {
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;
  const result = Array(n).fill(null);
  const remaining = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
  }));

  while (completed < n) {
    let minBurst = Infinity;
    let nextProcess = null;
    // Tìm tiến trình có burst time ngắn nhất trong số các tiến trình đã đến
    for (let i = 0; i < n; i++) {
      if (
        !result[i] &&
        remaining[i].arrivalTime <= currentTime &&
        remaining[i].remainingTime < minBurst
      ) {
        minBurst = remaining[i].remainingTime;
        nextProcess = i;
      }
    }

    if (nextProcess === null) {
      currentTime++; // Nếu không có tiến trình nào sẵn sàng, tăng thời gian
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
