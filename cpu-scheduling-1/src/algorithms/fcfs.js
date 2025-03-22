// First-Come-First-Serve Scheduling
export const calculateFCFS = (processes) => {
  let currentTime = 0;
  return processes.map((p) => {
    const startTime = Math.max(currentTime, p.arrivalTime); // Thời gian bắt đầu là thời gian hiện tại hoặc khi tiến trình đến
    const finishTime = startTime + p.burstTime; // Thời gian hoàn thành
    const turnaroundTime = finishTime - p.arrivalTime; // Thời gian quay vòng
    const waitingTime = turnaroundTime - p.burstTime; // Thời gian chờ
    const responseTime = startTime - p.arrivalTime; // Thời gian phản hồi

    currentTime = finishTime; // Cập nhật thời gian hiện tại
    return { ...p, turnaroundTime, waitingTime, responseTime };
  });
};
