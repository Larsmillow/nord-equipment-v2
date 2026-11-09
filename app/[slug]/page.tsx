import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ContactRequestForm } from "@/components/contact-request-form";
import { MESSENGERS } from "@/components/messenger-links";
import { getProductById } from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/site-config";

const pages: Record<
  string,
  {
    title: string;
    description: string;
    eyebrow: string;
    metrics: Array<{ label: string; value: string; note: string }>;
    sections: Array<{
      index: string;
      badge: string;
      title: string;
      text: string;
      highlights?: string[];
      ctaLabel?: string;
      ctaHref?: string;
      external?: boolean;
      showMessengers?: boolean;
    }>;
  }
> = {
  about: {
    title: "Инженерный центр и склад оборудования NORD",
    description:
      "Поставка, посуточная аренда и стендовые испытания безвоздушных окрасочных, шпаклёвочных и огнезащитных станций в Москве и по всей России.",
    eyebrow: "О КОМПАНИИ NORD · МОСКВА",
    metrics: [
      { label: "СКЛАДСКАЯ ПРОГРАММА", value: "12 серий", note: "Станции от 2,5 до 50 л/мин в наличии" },
      { label: "СТЕНД ОПРЕССОВКИ", value: "200–350 бар", note: "Проверка каждого насоса перед отгрузкой" },
      { label: "АРЕНДНЫЙ ПАРК", value: "от 1 500 ₽/сут", note: "Готовые малярные посты на объект" },
      { label: "ГАРАНТИЯ И ЗИП", value: "до 24 мес.", note: "Ремкомплекты, поршни, шланги и сопла" },
    ],
    sections: [
      {
        index: "НАПРАВЛЕНИЕ 01 · ПРЯМЫЕ ПОСТАВКИ",
        badge: "200–350 БАР",
        title: "Промышленные станции ВД под задачу",
        text: "Комплектуем строительные управления, генподрядчиков и малярные бригады аппаратами для безвоздушной окраски Q4, механизированной шпаклёвки ЖК, огнезащиты и гидроизоляции.",
        highlights: [
          "Подбор станции строго по вязкости состава и площади объекта",
          "Полная комплектация рабочего поста из коробки (шланг, пистолет, сопло, удочка)",
          "Работа по безналичному счёту с НДС 20%, ЭДО Диадок / СБИС",
        ],
        ctaLabel: "Перейти в каталог станций →",
        ctaHref: "/catalog",
      },
      {
        index: "НАПРАВЛЕНИЕ 02 · ПРОКАТ НА ОБЪЕКТ",
        badge: "ОТ 1 500 ₽ / СУТ",
        title: "Дежурный арендный парк в Москве",
        text: "Поддерживаем парк обслуженных станций от 2,5 до 18,0 л/мин для оперативного закрытия пиковых объёмов и проверки оборудования на реальном объекте перед покупкой.",
        highlights: [
          "Выдача готового поста от 1 суток со шлангами 15–45 м",
          "Зачёт арендной платы при последующем выкупе станции",
          "Оформление за 10 минут для ООО, ИП и физических лиц",
        ],
        ctaLabel: "Смотреть тарифы проката →",
        ctaHref: "/rent",
      },
      {
        index: "НАПРАВЛЕНИЕ 03 · ИСПЫТАТЕЛЬНЫЙ СТЕНД",
        badge: "ПРОВЕРКА ПРИ ВАС",
        title: "Предпродажная опрессовка 230–350 бар",
        text: "Мы не отгружаем нераспакованные коробки вслепую: перед выдачей механик запускает станцию на стенде, проверяет удержание рабочего давления и герметичность соединений.",
        highlights: [
          "Демонстрационный стенд: Москва, Окружной проезд, 34Ас6",
          "Обучение маляра запуску, настройке факела и промывке насоса",
          "Интерактивный 3D-стенд расчёта выработки онлайн",
        ],
        ctaLabel: "Испытать станции в 3D-стенде →",
        ctaHref: "/lab",
      },
    ],
  },
  delivery: {
    title: "Доставка на объект, самовывоз и расчёты",
    description:
      "Отгрузка со склада в Москве (Окружной проезд, 34Ас6) с проверкой на стенде, экспресс-доставка на стройплощадку за 3 часа и отправка ТК по всей России.",
    eyebrow: "ЛОГИСТИКА И ОПЛАТА · МОСКВА И РФ",
    metrics: [
      { label: "САМОВЫВОЗ СО СКЛАДА", value: "В день заказа", note: "Окружной проезд, 34Ас6 (без пропусков)" },
      { label: "ДОСТАВКА НА ОБЪЕКТ", value: "3–4 часа", note: "Прямая машина по Москве и МО" },
      { label: "ОТПРАВКА ПО РОССИИ", value: "0 ₽ до ТК", note: "Деловые Линии, ПЭК, СДЭК с обрешёткой" },
      { label: "ДОКУМЕНТООБОРОТ", value: "Счёт за 15 мин", note: "Безнал с НДС 20%, УПД, ЭДО, 54-ФЗ" },
    ],
    sections: [
      {
        index: "ЛОГИСТИКА 01 · САМОВЫВОЗ И СТЕНД",
        badge: "В ДЕНЬ ЗАКАЗА",
        title: SITE_CONFIG.address,
        text: `${SITE_CONFIG.metro}. ${SITE_CONFIG.workHours}. При получении механик проводит контрольный запуск станции под давлением 230 бар, проверяет комплектность и помогает с погрузкой.`,
        highlights: [
          "Свободный заезд под погрузку коммерческого транспорта",
          "Контрольная опрессовка и проверка факела при вас",
          "Возможность сразу доукомплектовать пост шлангами 30–45 м и соплами",
        ],
        ctaLabel: "Построить маршрут в Яндекс.Картах ↗",
        ctaHref: SITE_CONFIG.mapUrl,
        external: true,
      },
      {
        index: "ЛОГИСТИКА 02 · МОСКВА, МО И РЕГИОНЫ РФ",
        badge: "НА ОБЪЕКТ / ТК",
        title: "Экспедирование до стройплощадки",
        text: "Доставляем станции непосредственно на строительный объект в Москве и области в день обращения. В регионы РФ отправляем через Деловые Линии, ПЭК и СДЭК.",
        highlights: [
          "Фото- и видеоотчёт опрессовки станции на стенде перед отправкой в регион",
          "Бесплатная сдача груза на терминал транспортной компании в Москве",
          "Жёсткая защитная обрешётка и 100% страхование груза на полную стоимость",
        ],
        ctaLabel: "Рассчитать доставку у инженера →",
        ctaHref: "/contacts",
      },
      {
        index: "ЛОГИСТИКА 03 · ОПЛАТА И ДОКУМЕНТЫ",
        badge: "С НДС 20% / ЭДО / КАРТА",
        title: "Расчёты с юрлицами (ООО, ИП) и физлицами",
        text: "Выставляем счёт по реквизитам за 15 минут. Полный комплект закрывающих документов (УПД в бумажном виде или через ЭДО Диадок / СБИС), онлайн-оплата картой с чеком 54-ФЗ.",
        highlights: [
          "Фиксация цены и складского резерва станции на 3 рабочих дня",
          "Оплата по счёту, корпоративной картой, СБП или при получении на складе",
          "Паспорт изделия на русском языке, гарантийный талон и сертификат",
        ],
        ctaLabel: "Запросить счёт по реквизитам →",
        ctaHref: "/contacts",
      },
    ],
  },
  warranty: {
    title: "Гарантия до 24 месяцев, сервис и склад ЗИП",
    description:
      "Собственная ремонтная база в Москве, предпродажная опрессовка каждого агрегата и 100% наличие поршней, ремкомплектов, плат, шлангов и сопел.",
    eyebrow: "СЕРВИСНАЯ СЛУЖБА И ЗИП · NORD",
    metrics: [
      { label: "СРОК ГАРАНТИИ", value: "до 24 мес.", note: "Официальная поддержка силовой части и насоса" },
      { label: "СКЛАД ЗАПЧАСТЕЙ", value: "100% в Москве", note: "Ремкомплекты, штоки, клапаны и платы" },
      { label: "ДИАГНОСТИКА", value: "за 30 минут", note: "Испытательный стенд на Окружном проезде" },
      { label: "ПОДМЕННЫЙ ФОНД", value: "Без простоя", note: "Выдача подменной станции на время ТО" },
    ],
    sections: [
      {
        index: "СЕРВИС 01 · ГАРАНТИЙНЫЕ ОБЯЗАТЕЛЬСТВА",
        badge: "ДО 24 МЕСЯЦЕВ",
        title: "Официальная инженерная гарантия NORD",
        text: "Обеспечиваем полное гарантийное и постгарантийное сопровождение бесщёточных приводов, гидравлических систем, электронных блоков управления и поршневых групп.",
        highlights: [
          "Ремонтный цех и испытательный стенд непосредственно при складе в Москве",
          "Предоставление подменного аппарата из арендного парка на время сервиса",
          "Отсутствие ожидания поставок запчастей из-за рубежа",
        ],
        ctaLabel: "Связаться с сервисным инженером →",
        ctaHref: "/contacts",
      },
      {
        index: "СЕРВИС 02 · СКЛАД ЗИП И КОМПЛЕКТУЮЩИХ",
        badge: "В НАЛИЧИИ В МОСКВЕ",
        title: "Ремкомплекты, насосы и оснастка ВД",
        text: "Постоянно поддерживаем в наличии уплотнения верхнего и нижнего цилиндров, шарики и сёдла клапанов, штоки, гильзы, датчики давления, рукава ВД 1/4″ и 3/8″, пистолеты и сопла.",
        highlights: [
          "Шланги высокого давления 15, 30 и 45 м (230–350 бар)",
          "Пистолеты окрасочные и шпаклёвочные HD, удочки 50–150 см, вертлюги",
          "Реверсивные сопла всех калибров (от 0.013″ до 0.065″) и фильтры",
        ],
        ctaLabel: "Открыть раздел комплектующих и ЗИП →",
        ctaHref: "/category/accessories",
      },
      {
        index: "СЕРВИС 03 · ТЕХПОДДЕРЖКА НА ОБЪЕКТЕ",
        badge: "ПРЯМАЯ ЛИНИЯ МЕХАНИКА",
        title: SITE_CONFIG.phone,
        text: "Дистанционная консультация по телефону и видеосвязи прямо со стройплощадки: поможем сбросить ошибку датчика, прочистить клапан, подобрать сопло или промыть систему после смены.",
        showMessengers: true,
      },
    ],
  },
  contacts: {
    title: "Контакты, склад выдачи и стенд NORD в Москве",
    description: `Демонстрационный зал, испытательный стенд 230–350 бар и склад самовывоза: ${SITE_CONFIG.address}. Прямой телефон инженерного отдела: ${SITE_CONFIG.phone}.`,
    eyebrow: "КОНТАКТЫ И СКЛАД · МОСКВА",
    metrics: [
      { label: "АДРЕС СКЛАДА И СТЕНДА", value: "Окружной пр., 34Ас6", note: "ВАО · удобный въезд без пропусков" },
      { label: "МЕТРО / МЦК", value: "5 мин пешком", note: "ст. м. Черкизовская / МЦК Локомотив" },
      { label: "ГРАФИК ОТГРУЗКИ", value: "Пн–Сб 09:00–19:00", note: "Демонстрация и выдача в день обращения" },
      { label: "ОТДЕЛ СНАБЖЕНИЯ", value: "Счёт за 15 мин", note: SITE_CONFIG.email },
    ],
    sections: [
      {
        index: "КОНТАКТЫ 01 · СКЛАД И СТЕНД ОПРЕССОВКИ",
        badge: "ПН–СБ 09:00–19:00",
        title: SITE_CONFIG.address,
        text: `${SITE_CONFIG.metro}. Приезжайте на склад перед покупкой или арендой: покажем станции всех 5 направлений вживую, запустим под давлением и подберём комплектацию под ваш состав.`,
        highlights: [
          "Бесплатная парковка и удобная зона погрузки у ворот склада",
          "Контрольная опрессовка 230–350 бар при получении каждого аппарата",
          "Выдача со склада за 15 минут после оплаты или подписания договора",
        ],
        ctaLabel: "Построить маршрут в Яндекс.Картах ↗",
        ctaHref: SITE_CONFIG.mapUrl,
        external: true,
      },
      {
        index: "КОНТАКТЫ 02 · ИНЖЕНЕРНЫЙ ОТДЕЛ И МЕССЕНДЖЕРЫ",
        badge: "ОТВЕТ ЗА 5 МИНУТ",
        title: SITE_CONFIG.phone,
        text: `Почта для ТЗ, смет и реквизитов: ${SITE_CONFIG.email}. Оперативный расчёт требуемой подачи (л/мин), калибра сопла и длины шлангов под ваш материал.`,
        showMessengers: true,
      },
      {
        index: "КОНТАКТЫ 03 · ОТДЕЛ ПО РАБОТЕ С ЮРЛИЦАМИ (ИП / ООО)",
        badge: "КП И СЧЁТ ЗА 15 МИН",
        title: "Быстрое выставление КП и резерв на складе",
        text: "Отправьте карточку предприятия и задачу через форму ниже, на почту или в Telegram — подготовим коммерческое предложение с НДС 20% и закрепим станцию в резерве.",
        highlights: [
          "Полный пакет закрывающих документов (УПД в бумажном виде и ЭДО)",
          "Фиксация цены и складского наличия на 3 рабочих дня",
          "Комплектация под ключ: дополнительные посты, шланги и ЗИП в одном счёте",
        ],
        ctaLabel: `Отправить реквизиты на ${SITE_CONFIG.email}`,
        ctaHref: `mailto:${SITE_CONFIG.email}`,
      },
    ],
  },
  privacy: {
    title: "Политика обработки персональных данных",
    description:
      "Порядок сбора, хранения и защиты персональных данных покупателей и арендаторов оборудования NORD в соответствии с 152-ФЗ РФ.",
    eyebrow: "ДОКУМЕНТЫ · 152-ФЗ РФ",
    metrics: [
      { label: "СТАНДАРТ ЗАЩИТЫ", value: "152-ФЗ РФ", note: "Обработка данных строго для исполнения заказа" },
      { label: "КАССОВЫЕ ЧЕКИ", value: "54-ФЗ РФ", note: "Официальная фискализация платежей" },
      { label: "ДОКУМЕНТООБОРОТ", value: "ЭДО / УПД", note: "Защищённый обмен документами с юрлицами" },
      { label: "КОНТАКТ ОПЕРАТОРА", value: SITE_CONFIG.email, note: "Оперативное рассмотрение обращений" },
    ],
    sections: [
      {
        index: "ПОЛОЖЕНИЕ 01 · СОСТАВ ДАННЫХ",
        badge: "152-ФЗ РФ",
        title: "Только для исполнения заказа",
        text: "Мы запрашиваем только имя/наименование организации, контактный телефон, email и адрес доставки, необходимые для оформления счёта, договора поставки/проката и кассового чека 54-ФЗ.",
      },
      {
        index: "ПОЛОЖЕНИЕ 02 · ЗАЩИТА И НЕРАЗГЛАШЕНИЕ",
        badge: "БЕЗОПАСНОСТЬ",
        title: "Конфиденциальность",
        text: "Персональные данные хранятся в защищённой базе данных и не передаются третьим лицам, за исключением платёжного оператора (ЮKassa) и транспортных компаний при заказе доставки.",
      },
      {
        index: "ПОЛОЖЕНИЕ 03 · ОБРАЩЕНИЯ СУБЪЕКТОВ ПДН",
        badge: "ПО ЗАПРОСУ",
        title: "Отзыв согласия",
        text: `По любым вопросам изменения или удаления данных направьте запрос на ${SITE_CONFIG.email} или по телефону ${SITE_CONFIG.phone}.`,
      },
    ],
  },
  terms: {
    title: "Условия поставки и аренды оборудования",
    description:
      "Основные положения договора поставки и проката промышленного окрасочного и шпаклёвочного оборудования NORD.",
    eyebrow: "ДОКУМЕНТЫ · УСЛОВИЯ ПОСТАВКИ",
    metrics: [
      { label: "ФОРМА РАСЧЁТОВ", value: "С НДС 20% / Карта", note: "Безналичный расчёт для ООО/ИП и оплата картой" },
      { label: "ПРИЁМКА ПОСТА", value: "Стенд 230 бар", note: "Акт приёма-передачи после опрессовки" },
      { label: "ГАРАНТИЯ", value: "до 24 мес.", note: "Официальная сервисная база в Москве" },
      { label: "ЗАКОНОДАТЕЛЬСТВО", value: "ГК РФ", note: "Прозрачные договорные условия" },
    ],
    sections: [
      {
        index: "РАЗДЕЛ 01 · ПОКУПКА ОБОРУДОВАНИЯ",
        badge: "ПОСТАВКА",
        title: "Поставка и приёмка",
        text: "Оборудование передаётся в полной комплектации с проверкой работоспособности. Оплата производится по безналичному счёту (для юрлиц и ИП) или через платёжный шлюз.",
      },
      {
        index: "РАЗДЕЛ 02 · АРЕНДА (ПРОКАТ) СТАНЦИЙ",
        badge: "ПРОКАТ",
        title: "Акт приёма-передачи и возврат",
        text: "Станция выдаётся в чистом, исправном состоянии после контрольного пуска и подлежит возврату промытой от лакокрасочных и шпаклёвочных составов.",
      },
      {
        index: "РАЗДЕЛ 03 · ГАРАНТИЯ И ВОЗВРАТ",
        badge: "ГК РФ",
        title: "Законодательство РФ",
        text: "Возврат, обмен и гарантийное обслуживание осуществляются в соответствии с ГК РФ и договором поставки.",
      },
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
      <section className="section section-blueprint">
        <div className="container">
          {/* Top 4-Metric Industrial Fact Strip */}
          <div className="info-metrics-strip">
            {page.metrics.map((m) => (
              <div key={m.label} className="info-metric-box">
                <span>{m.label}</span>
                <strong>{m.value}</strong>
                <small>{m.note}</small>
              </div>
            ))}
          </div>

          <div className="info-grid">
            {page.sections.map((sec) => (
              <article className="info-card" key={sec.index}>
                <div className="info-card-topbar">
                  <span className="info-card-index">{sec.index}</span>
                  <span className="info-card-badge">{sec.badge}</span>
                </div>

                <div className="info-card-body">
                  <h3>
                    {sec.title === SITE_CONFIG.phone ? (
                      <a href={SITE_CONFIG.phoneHref} className="info-phone-link">
                        {sec.title}
                      </a>
                    ) : (
                      sec.title
                    )}
                  </h3>
                  <p>{sec.text}</p>

                  {sec.highlights && sec.highlights.length > 0 && (
                    <ul className="info-card-list">
                      {sec.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {sec.showMessengers && (
                    <div className="info-card-messengers">
                      {MESSENGERS.map(({ key, label, href, Icon }) => (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="info-msg-chip"
                        >
                          <Icon />
                          <span>{label}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {sec.ctaLabel && sec.ctaHref && (
                    <div className="info-card-footer">
                      {sec.external ? (
                        <a
                          className="info-card-cta"
                          href={sec.ctaHref}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {sec.ctaLabel}
                        </a>
                      ) : (
                        <Link className="info-card-cta" href={sec.ctaHref}>
                          {sec.ctaLabel}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {(slug === "contacts" || slug === "delivery" || slug === "about" || slug === "warranty") && (
            <div className="dispatch-hub-card" style={{ marginTop: 28 }}>
              <div className="dispatch-hub-left">
                <div className="dispatch-hub-pill">
                  <span className="dispatch-hub-dot" />
                  <span>СКЛАД ВЫДАЧИ И СТЕНД ОПРЕССОВКИ NORD · МОСКВА</span>
                </div>
                <h3>Испытательный стенд 230–350 бар, сервис и самовывоз</h3>
                <p>
                  Перед выдачей в аренду, продажей или отправкой ТК каждый аппарат проходит контрольную проверку под рабочим давлением. Поможем с погрузкой и комплектацией поста под ваш объект.
                </p>

                <div className="dispatch-hub-metrics">
                  <div>
                    <span>АДРЕС СКЛАДА</span>
                    <strong>{SITE_CONFIG.address}</strong>
                  </div>
                  <div>
                    <span>ТРАНСПОРТНАЯ ДОСТУПНОСТЬ</span>
                    <strong>{SITE_CONFIG.metro}</strong>
                  </div>
                  <div>
                    <span>РЕЖИМ ОТГРУЗКИ</span>
                    <strong>{SITE_CONFIG.workHours}</strong>
                  </div>
                </div>
              </div>

              <div className="dispatch-hub-right">
                <div className="dispatch-hub-direct">
                  <span>ДЕЖУРНЫЙ ИНЖЕНЕР СКЛАДА</span>
                  <a href={SITE_CONFIG.phoneHref} className="dispatch-hub-phone">
                    {SITE_CONFIG.phone}
                  </a>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="dispatch-hub-email">
                    {SITE_CONFIG.email}
                  </a>
                </div>

                <div className="dispatch-hub-actions">
                  <a
                    className="button button-white"
                    href={SITE_CONFIG.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Открыть маршрут в Яндекс.Картах ↗
                  </a>
                  <Link className="button button-outline-light" href="/catalog">
                    Выбрать станцию в каталоге →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 36 }}>
            <ContactRequestForm subject={contactSubject} />
          </div>
        </div>
      </section>
    </>
  );
}
