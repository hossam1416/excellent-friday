export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export function signed(number) {
  return `\u200E${number > 0 ? "+" : ""}${number}`;
}

// Maps tournament conclusion codes to display labels
export function endReasonText(reason) {
  if (reason === "clinched") return "حسم مبكر";
  if (reason === "manual") return "إنهاء يدوي";
  return "ختام المباريات";
}

// Formats matches with sequence labels or final match indicators
export function numberMatches(matches) {
  let count = 0;

  return matches.map((match) => {
    if (match.isFinalMatch) {
      return { ...match, label: "المباراة الفاصلة" };
    }

    count += 1;
    return { ...match, label: `المباراة ${count}` };
  });
}
export function statusText(status) {
  if (status === "active") return "جارية";
  if (status === "pending") return "لم تبدأ";
  return "منتهية";
}
