const now = new Date();

const options = {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

const formatter = new Intl.DateTimeFormat("en-GB", options);
const formattedDateTime = formatter.format(now);

export default formattedDateTime;
//console.log(formattedDateTime, now);
