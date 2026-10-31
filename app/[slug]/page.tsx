import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ContactRequestForm } from "@/components/contact-request-form";
import { getProductById } from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/site-config";

const pages: Record<
  string,
  {
    title: string;
    description: string;
    eyebrow: string;
    sections: Array<[string, string, string]>;
  }
> = {
  about: {
    title: "О подразделении NORD",
    description:
      "Поставка, аренда и техническое сопровождение безвоздушного окрасочного, шпаклёвочного и огнезащитного оборудования в Москве и РФ.",
    eyebrow: "О КОМПАНИИ NORD",
    sections: [
      [
        "01 // Прямые поставки",
        "Промышленные станции ВД",
        "Комплектуем строительные управления и подрядчиков аппаратами для безвоздушной окраски, механизированной шпаклёвки, огнезащиты и дорожной разметки.",
      ],
      [
        "02 // Собственный арендный парк",
        "Прокат техники на объект",
        "Поддерживаем дежурный парк обслуженных станций в Москве для оперативного закрытия пиковых объёмов без заморозки оборотных средств.",
      ],
      [
        "03 // Контрольный стенд",
        "Опрессовка 230–350 бар",
        "Не отгружаем «коробки вслепую»: проверяем клапанную группу, герметичность фитингов и стабильность удержания рабочего давления.",
      ],
    ],
  },
  delivery: {
    title: "Доставка, самовывоз и оплата",
    description:
      "Отгрузка со склада в Москве (Окружной проезд, 34Ас6), курьерская доставка на строительный объект и отправка ТК по всей России.",
    eyebrow: "ЛОГИСТИКА И ОПЛАТА",
    sections: [
      [
        "01 // Самовывоз со склада",
        SITE_CONFIG.address,
        `${SITE_CONFIG.metro}. ${SITE_CONFIG.workHours}. Демонстрация запуска, проверка комплектности и погрузка в ваш транспорт.`,
      ],
      [
        "02 // Доставка по Москве и РФ",
        "На объект или терминал ТК",
        "Оперативная доставка по Москве и МО в день заказа. Отправка в регионы через Деловые Линии, ПЭК, СДЭК с жёсткой обрешёткой.",
      ],
      [
        "03 // Расчёты с ИП, ООО и физлицами",
        "Безнал / СБП / Карты",
        "Выставление счёта для юрлиц (закрывающие документы УПД, ЭДО Диадок/СБИС), онлайн-оплата картой с кассовым чеком 54-ФЗ или оплата при получении.",
      ],
    ],
  },
  warranty: {
    title: "Гарантия, сервис и ЗИП",
    description:
      "Гарантийное обслуживание до 24 месяцев, наличие ремкомплектов, поршней, гильз, плат управления и расходников на складе в Москве.",
    eyebrow: "СЕРВИСНАЯ СЛУЖБА",
    sections: [
      [
        "01 // Гарантийные обязательства",
        "До 24 месяцев гарантии",
        "Официальная гарантия от поставщика на силовую часть, гидравлику, электронные платы контроля давления и насосную группу.",
      ],
      [
        "02 // Склад запчастей и ЗИП",
        "Ремкомплекты всегда в наличии",
        "Уплотнения верхнего и нижнего цилиндров, шарики и сёдла клапанов, штоки поршня, датчики давления, шланги, пистолеты и сопла.",
      ],
      [
        "03 // Техподдержка на объекте",
        `Прямая линия ${SITE_CONFIG.phone}`,
        "Дистанционная диагностика по видеосвязи: поможем устранить просадку давления, подобрать фильтр или промыть систему после работы.",
      ],
    ],
  },
  contacts: {
    title: "Контакты и склад выдачи NORD",
    description: `Склад и демонстрационный стенд в Москве: ${SITE_CONFIG.address}. Прямой телефон инженерного отдела: ${SITE_CONFIG.phone}.`,
    eyebrow: "КОНТАКТЫ И РЕКВИЗИТЫ",
    sections: [
      [
        "01 // Склад и пункт выдачи",
        SITE_CONFIG.address,
        `${SITE_CONFIG.metro}. Режим работы: ${SITE_CONFIG.workHours}. Удобный подъезд под погрузку.`,
      ],
      [
        "02 // Отдел продаж и проката",
        SITE_CONFIG.phone,
        `Электронная почта для реквизитов и ТЗ: ${SITE_CONFIG.email}. Подготовка счёта и коммерческого предложения за 15 минут.`,
      ],
      [
        "03 // Для снабженцев (ИП / ООО)",
        "Быстрое выставление счёта",
        "Отправьте карточку предприятия и требуемую модель через форму ниже или на почту — закрепим резерв на складе.",
      ],
    ],
  },
  privacy: {
    title: "Политика обработки персональных данных",
    description:
      "Порядок сбора, хранения и защиты персональных данных покупателей и арендаторов оборудования NORD в соответствии с 152-ФЗ РФ.",
    eyebrow: "ДОКУМЕНТЫ // 152-ФЗ",
    sections: [
      [
        "01 // Состав данных",
        "Только для исполнения заказа",
        "Мы запрашиваем только имя/наименование организации, контактный телефон, email и адрес доставки, необходимые для оформления счёта, договора поставки/проката и кассового чека 54-ФЗ.",
      ],
      [
        "02 // Защита и неразглашение",
        "Конфиденциальность",
        "Персональные данные хранятся в защищённой базе данных и не передаются третьим лицам, за исключением платёжного оператора (ЮKassa) и транспортных компаний при заказе доставки.",
      ],
      [
        "03 // Обращения субъектов ПДн",
        "Отзыв согласия",
        `По любым вопросам изменения или удаления данных направьте запрос на ${SITE_CONFIG.email} или по телефону ${SITE_CONFIG.phone}.`,
      ],
    ],
  },
  terms: {
    title: "Условия поставки и аренды оборудования",
    description:
      "Основные положения договора поставки и проката промышленного окрасочного и шпаклёвочного оборудования NORD.",
    eyebrow: "ДОКУМЕНТЫ // ОФЕРТА",
    sections: [
      [
        "01 // Покупка оборудования",
        "Поставка и приёмка",
        "Оборудование передаётся в полной комплектации с проверкой работоспособности. Оплата производится по безналичному счёту (для юрлиц и ИП) или через платёжный шлюз.",
      ],
      [
        "02 // Аренда (прокат) станций",
        "Акт приёма-передачи и возврат",
        "Станция выдаётся в чистом, исправном состоянии после контрольного пуска и подлежит возврату промытой от лакокрасочных и шпаклёвочных составов.",
      ],
      [
        "03 // Гарантия и возврат",
        "Законодательство РФ",
        "Возврат, обмен и гарантийное обслуживание осуществляются в соответствии с ГК РФ и договором поставки.",
      ],
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return { title: "NORD" };
  return {
    title: `${page.title} | NORD Москва`,
    description: page.description,
  };
}

export default async function InformationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ product?: string; rent?: string }>;
}) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const page = pages[slug];
  if (!page) notFound();

  const selectedProductId = slug === "contacts" ? search.product || search.rent : undefined;
  const selectedProduct = selectedProductId ? await getProductById(selectedProductId) : null;
  const contactSubject = selectedProduct
    ? `${search.rent ? "Запрос на аренду" : "Запрос КП / счёта на покупку"}: ${selectedProduct.name} (${selectedProduct.model}).`
    : "";

  return (
    <>
      <PageHero title={page.title} description={page.description} eyebrow={page.eyebrow} />
      <section className="section">
        <div className="container">
          <div className="info-grid">
            {page.sections.map(([eyebrow, title, text]) => (
              <article className="info-card" key={title}>
                <p className="eyebrow">{eyebrow}</p>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          {(slug === "contacts" || slug === "delivery" || slug === "about") && (
            <div className="address-card" style={{ marginTop: 24 }}>
              <div>
                <p className="eyebrow" style={{ color: "#ffffff" }}>
                  СКЛАД И ВЫДАЧА ТЕХНИКИ В МОСКВЕ
                </p>
                <h3>{SITE_CONFIG.address}</h3>
                <p>
                  {SITE_CONFIG.metro} · {SITE_CONFIG.workHours} · Телефон:{" "}
                  <a href={SITE_CONFIG.phoneHref}>{SITE_CONFIG.phone}</a> · Email:{" "}
                  <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
                </p>
              </div>
              <div className="hero-actions">
                <a
                  className="button button-primary"
                  href={SITE_CONFIG.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Построить маршрут в Яндекс.Картах ↗
                </a>
                <a className="button button-outline" href={SITE_CONFIG.phoneHref}>
                  Позвонить на склад
                </a>
              </div>
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <ContactRequestForm subject={contactSubject} />
          </div>
        </div>
      </section>
    </>
  );
}
