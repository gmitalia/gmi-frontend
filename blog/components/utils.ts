export const formatDate = (date: Date) => {
  const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];
  return [date.getDate(), monthNames[date.getMonth()], date.getFullYear()].join(
    " "
  );
};
