import { defineLocale } from 'fullcalendar';

defineLocale("sv", {
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4  // The week that contains Jan 4th is the first week of the year.
  },
  buttonText: {
    prev: "Förra",
    next: "Nästa",
    today: "Idag",
    month: "Månad",
    week: "Vecka",
    day: "Dag",
    list: "Program"
  },
  weekLabel: "v.",
  allDayText: "Heldag",
  eventLimitText: "till",
  noEventsMessage: "Inga händelser att visa"
});
