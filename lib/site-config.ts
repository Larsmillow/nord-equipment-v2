export const SITE_CONFIG = {
  name: "NORD",
  fullName: "NORD // Промышленное окрасочное и шпаклёвочное оборудование",
  phone: "+7 999 600-23-18",
  phoneHref: "tel:+79996002318",
  phoneClean: "79996002318",
  whatsappHref: "https://wa.me/79996002318",
  telegramHref: "https://t.me/+79996002318",
  // MAX не поддерживает ссылки по номеру телефона — нужна ссылка на профиль вида https://max.ru/u/...
  maxHref: process.env.NEXT_PUBLIC_MAX_URL || "https://max.ru/",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "larsmillow@nord-equip.ru",
  address: "Москва, Окружной проезд, 34Ас6",
  metro: "МЦК Соколиная гора · м. Шоссе Энтузиастов",
  workHours: "Пн–Сб: 09:00–19:00",
  mapUrl: "https://yandex.ru/maps/?text=Москва%2C%20Окружной%20проезд%2C%2034Ас6",
} as const;
