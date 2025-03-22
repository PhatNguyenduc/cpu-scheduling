// Shortest Job First (Preemptive - SRTF)
export const calculateSJFPreemptive = (processes) => {
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;
  const result = Array(n).fill(null);
  const remaining = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
  }));
  const firstResponse = Array(n).fill(-1); // Thời gian phản hồi đầu tiên

  while (completed < n) {
    let minRemaining = Infinity;
    let nextProcess = -1;

    for (let i = 0; i < n; i++) {
      if (
        !result[i] &&
        remaining[i].arrivalTime <= currentTime &&
        remaining[i].remainingTime < minRemaining &&
        remaining[i].remainingTime > 0
      ) {
        minRemaining = remaining[i].remainingTime;
        nextProcess = i;
      }
    }

    if (nextProcess === -1) {
      currentTime++;
      continue;
    }

    if (firstResponse[nextProcess] === -1)
      firstResponse[nextProcess] = currentTime;
    remaining[nextProcess].remainingTime--;
    currentTime++;

    if (remaining[nextProcess].remainingTime === 0) {
      completed++;
      result[nextProcess] = {
        ...remaining[nextProcess],
        turnaroundTime: currentTime - remaining[nextProcess].arrivalTime,
        waitingTime:
          currentTime -
          remaining[nextProcess].arrivalTime -
          remaining[nextProcess].burstTime,
        responseTime:
          firstResponse[nextProcess] - remaining[nextProcess].arrivalTime,
      };
    }
  }
  return result;
};
