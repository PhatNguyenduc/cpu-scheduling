// Priority Scheduling (Preemptive)
export const calculatePriorityPreemptive = (processes) => {
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;
  const result = Array(n).fill(null);
  const remaining = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
  }));
  const firstResponse = Array(n).fill(-1);

  while (completed < n) {
    let maxPriority = -Infinity;
    let nextProcess = -1;

    for (let i = 0; i < n; i++) {
      if (
        !result[i] &&
        remaining[i].arrivalTime <= currentTime &&
        remaining[i].priority > maxPriority &&
        remaining[i].remainingTime > 0
      ) {
        maxPriority = remaining[i].priority;
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
