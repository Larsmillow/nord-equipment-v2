import { SITE_CONFIG } from "@/lib/site-config";

export function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#229ED9" />
      <path
        fill="#fff"
        d="M5.4 11.7 16.9 7.3c.53-.2 1 .13.83.93l-1.96 9.24c-.14.66-.53.82-1.08.51l-3-2.21-1.45 1.4c-.16.16-.3.3-.6.3l.21-3.05 5.55-5.01c.24-.21-.05-.33-.37-.12l-6.86 4.32-2.96-.92c-.64-.2-.65-.64.14-.95z"
      />
    </svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M12 5.2a6.75 6.75 0 0 0-5.8 10.2l-.95 3.4 3.5-.92A6.75 6.75 0 1 0 12 5.2zm0 12.3c-1.03 0-2.03-.28-2.9-.8l-.2-.12-2.07.55.55-2.02-.14-.21A5.55 5.55 0 1 1 12 17.5zm3.05-4.15c-.17-.08-.99-.49-1.14-.54-.15-.06-.27-.08-.38.08-.11.17-.43.54-.53.66-.1.11-.2.13-.36.04-.17-.08-.71-.26-1.35-.83-.5-.45-.84-1-.93-1.17-.1-.17-.01-.26.07-.34.08-.08.17-.2.25-.29.08-.1.11-.17.17-.28.05-.11.03-.21-.02-.3-.04-.08-.38-.91-.52-1.25-.14-.33-.28-.28-.38-.29h-.33a.63.63 0 0 0-.46.21c-.16.17-.6.59-.6 1.43s.62 1.66.7 1.78c.09.11 1.21 1.85 2.94 2.6.41.18.73.28.98.36.41.13.79.11 1.09.07.33-.05 1-.41 1.15-.81.14-.4.14-.74.1-.81-.04-.07-.15-.11-.32-.2z"
      />
    </svg>
  );
}

export function MaxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="maxIconGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3F8CFF" />
          <stop offset="100%" stopColor="#8B3FFD" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="7" fill="url(#maxIconGrad)" />
      <path
        fill="#fff"
        d="M12 5.6a6.4 6.4 0 0 0-5.5 9.7l-.7 2.6c-.1.38.26.7.62.56l2.62-.98A6.4 6.4 0 1 0 12 5.6zm0 2.4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
      />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.6 3.5 9 3l1.8 4.3-2.1 1.5a11 11 0 0 0 6.5 6.5l1.5-2.1L21 15l-.5 2.4a2.4 2.4 0 0 1-2.4 2A15.6 15.6 0 0 1 4.6 5.9a2.4 2.4 0 0 1 2-2.4z" />
    </svg>
  );
}

export const MESSENGERS = [
  { key: "telegram", label: "Telegram", href: SITE_CONFIG.telegramHref, Icon: TelegramIcon },
  { key: "whatsapp", label: "WhatsApp", href: SITE_CONFIG.whatsappHref, Icon: WhatsAppIcon },
  { key: "max", label: "MAX", href: SITE_CONFIG.maxHref, Icon: MaxIcon },
] as const;

/** Компактный блок связи для мобильной версии: крупный номер + 3 мессенджера. */
export function MobileContactBlock({ title = "Подберём аппарат под ваш объект" }: { title?: string }) {
  return (
    <div className="m-contact">
      <p className="m-contact-title">{title}</p>
      <p className="m-contact-sub">Ответим за 5 минут · {SITE_CONFIG.workHours}</p>
      <a className="m-contact-phone" href={SITE_CONFIG.phoneHref}>
        <PhoneIcon />
        {SITE_CONFIG.phone}
      </a>
      <div className="m-contact-messengers">
        {MESSENGERS.map(({ key, label, href, Icon }) => (
          <a key={key} className={`m-msg m-msg--${key}`} href={href} target="_blank" rel="noopener noreferrer">
            <Icon />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
