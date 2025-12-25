const formatDate = (date: string) => {
  if (!date) return "";
  const d = new Date(date + "-01");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
export { formatDate };