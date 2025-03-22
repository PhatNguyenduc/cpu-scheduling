// Round Robin Scheduling
export const calculateRoundRobin = (processes, quantum) => {
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;
  const result = Array(n).fill(null);
  const remaining = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
  }));
  const queue = [];
  const firstResponse = Array(n).fill(-1);

  while (completed < n) {
    // Thêm các tiến trình đã đến vào hàng đợi
    for (let i = 0; i < n; i++) {
      if (
        !result[i] &&
        remaining[i].arrivalTime <= currentTime &&
        !queue.includes(i)
      ) {
        queue.push(i);
      }
    }

    if (queue.length === 0) {
      currentTime++;
      continue;
    }

    const idx = queue.shift();
    if (firstResponse[idx] === -1) firstResponse[idx] = currentTime;

    const timeSlice = Math.min(quantum, remaining[idx].remainingTime);
    currentTime += timeSlice;
    remaining[idx].remainingTime -= timeSlice;

    if (remaining[idx].remainingTime === 0) {
      completed++;
      result[idx] = {
        ...remaining[idx],
        turnaroundTime: currentTime - remaining[idx].arrivalTime,
        waitingTime:
          currentTime - remaining[idx].arrivalTime - remaining[idx].burstTime,
        responseTime: firstResponse[idx] - remaining[idx].arrivalTime,
      };
    } else {
      // Thêm các tiến trình mới đến trong khi thực thi
      for (let i = 0; i < n; i++) {
        if (
          !result[i] &&
          remaining[i].arrivalTime <= currentTime &&
          !queue.includes(i) &&
          i !== idx
        ) {
          queue.push(i);
        }
      }
      queue.push(idx); // Đưa lại vào hàng đợi nếu chưa hoàn thành
    }
  }
  return result;
};
