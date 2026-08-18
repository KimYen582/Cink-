const isoTimeFormat = (time) => {
  const [hours, minutes] = time.split(':');

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default isoTimeFormat;