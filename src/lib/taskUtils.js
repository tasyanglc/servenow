export const calculateTaskStatus = (remainingSlaHours, slaHours) => {
  // If no SLA is defined, default to ON TRACK
  if (slaHours === undefined || slaHours === null) return "ON TRACK";
  if (remainingSlaHours === undefined || remainingSlaHours === null) return "ON TRACK";

  if (remainingSlaHours < 0) {
    return "OVERDUE";
  }

  // PRD threshold: 25% of SLA remaining means it's AT RISK
  const remainingPercentage = (remainingSlaHours / slaHours) * 100;
  
  if (remainingPercentage <= 25) {
    return "AT RISK";
  }

  return "ON TRACK";
};

export const formatHours = (hours) => {
  if (hours === undefined || hours === null) return "-";
  
  const isNegative = hours < 0;
  const absHours = Math.abs(hours);
  
  const h = Math.floor(absHours);
  const m = Math.round((absHours - h) * 60);
  
  let result = "";
  if (h > 0) result += `${h}h `;
  if (m > 0 || h === 0) result += `${m}m`;
  
  return (isNegative ? "-" : "") + result.trim();
};
