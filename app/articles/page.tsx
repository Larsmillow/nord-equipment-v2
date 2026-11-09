import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ContactRequestForm } from "@/components/contact-request-form";
import { SITE_CONFIG } from "@/lib/site-config";
import { MESSENGERS } from "@/components/messenger-links";

export const metadata: Metadata = {
  title: "Инженерная база знаний и технологические карты распыла | NORD Москва",
  description:
    "Технологические регламенты безвоздушной окраски и механизированной шпаклёвки: подбор калибра сопла, рабочего давления, фильтрации и длины рукава ВД под состав.",
};

interface ArticleItem {
  id: string;
  tag: string;
  specBadge: string;
  readTime: string;
  title: string;
  teaser: string;
  keyPoints: string[];
  machineId: string;
  labId: string;
  machineName: string;
  machineSpec: string;
  machinePrice: string;
  machineRent: string;
  image: string;
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
}

const NOZZLE_CHART = [
  {
    material: "Грунты глубокого проникновения и пропитки",
    nozzle: "0.013″ – 0.015″ (213, 315)",
    pressure: "100 – 130 бар",
    filter: "100 Mesh (жёлтый)",
    flow: "от 2,0 л/мин",
    station: "NORD-2500",
    stationHref: "/product/nord-2500",
  },
  {
    material: "Интерьерные краски (акрил, латекс под Q4)",
    nozzle: "0.017″ – 0.019″ (517, 519)",
    pressure: "160 – 190 бар",
    filter: "60 Mesh (белый)",
    flow: "от 2,5 л/мин",
    station: "NORD-2500 / NORD-3300",
    stationHref: "/product/nord-3300",
  },
  {
    material: "Фасадные краски, грунт-эмали 3-в-1, антикор",
    nozzle: "0.021″ – 0.027″ (521, 525)",
    pressure: "200 – 230 бар",
    filter: "60 / 30 Mesh",
    flow: "от 4,2 л/мин",
    station: "NORD-4500",
    stationHref: "/product/nord-4500",
  },
  {
    material: "Финишные полимерные пасты (Danogips, Sheetrock) + клеи",
    nozzle: "0.031″ – 0.043″ (531, 535, 543)",
    pressure: "210 – 230 бар",
    filter: "Без фильтра в ручке",
    flow: "от 6,5 л/мин",
    station: "NORD-6000",
    stationHref: "/product/nord-6000",
  },
  {
    material: "Базовые и финишные шпаклёвки + мастики 350 бар",
    nozzle: "0.039″ – 0.049″ (539, 545)",
    pressure: "230 – 350 бар",
    filter: "Без фильтра · рукав 3/8″",
    flow: "7,5 – 9,0 л/мин",
    station: "NORD-8000 PRO / NORD-9200",
    stationHref: "/product/nord-8000-pro",
  },
  {
    material: "Конструктивная огнезащита (ОГЗ) и гидроизоляция",
    nozzle: "0.049″ – 0.065″ (549, 655)",
    pressure: "230 бар",
    filter: "Прямоточный тракт",
    flow: "11,0 – 18,0 л/мин",
    station: "NORD-9900 / NORD-18X",
    stationHref: "/product/nord-18x",
  },
];

const ARTICLES: ArticleItem[] = [
  {
    id: "choose-sprayer",
    tag: "ПОДБОР ПОД ОБЪЕКТ",
    specBadge: "2,5 – 18,0 Л/МИН",
    readTime: "4 мин",
    title: "Как подобрать окрасочную или шпаклёвочную станцию под вязкость состава",
    teaser:
      "Методика расчёта запаса производительности насоса по максимальному калибру сопла, сухому остатку ЛКМ и длине рукава высокого давления.",
    keyPoints: [
      "Запас по калибру сопла минимум +0.004″ к рабочему",
      "Переход с рукава 1/4″ на 3/8″ для высоковязких паст",
      "Расчёт выработки: от 400 до 3 000 м² в смену",
    ],
    machineId: "nord-6000",
    labId: "nord-6000",
    machineName: "NORD-6000 HD",
    machineSpec: "6,5 л/мин · 230 бар · сопло до 0.043″",
    machinePrice: "95 000 ₽",
    machineRent: "2 300 ₽/сут",
    image: "/assets/machines/nord-6000/NORD-6000-view-3q-a-source.jpg",
    sections: [
      {
        heading: "1. Отталкивайтесь от самого густого материала на объекте",
        paragraphs: [
          "Главная ошибка при комплектации бригады — выбор аппарата по минимальной задаче (например, под грунт или водоэмульсионную краску), когда в смете также заложены стеклохолст, клей или финишная полимерная паста.",
          "Производительность поршневого насоса (л/мин) жестко определяет максимальный диаметр проходного сечения сопла, при котором станция способна удерживать стабильное давление 200–230 бар без просадки факела («усов» по краям).",
        ],
        bullets: [
          "2,5–3,3 л/мин (сопло до 0.023″–0.033″) — интерьерные краски, эмали, грунты и плотные акрилаты (NORD-2500, NORD-3300).",
          "4,2 л/мин (сопло до 0.037″) — фасадные краски, грунт-эмали по металлу и антикоры (NORD-4500).",
          "6,5 л/мин (сопло до 0.043″) — универсальный порог: работа в 2 малярных поста на краске плюс нанесение готовых полимерных шпаклёвок (NORD-6000).",
          "7,5–18,0 л/мин (сопло 0.045″–0.065″, до 350 бар) — тяжёлые шпаклёвочные станции для многоэтажных ЖК, мастик и огнезащиты (NORD-8000 PRO, NORD-9200, NORD-9900, NORD-18X).",
        ],
      },
      {
        heading: "2. Учитывайте длину магистрали и потерю давления",
        paragraphs: [
          "Каждые дополнительные 15 метров рукава высокого давления создают гидравлическое сопротивление. На трассах 30–60 метров (работа с лесов на фасаде или подача с одного этажа без переноски станции) аппарат должен иметь запас по мощности привода не менее 3,5–4,0 кВт.",
        ],
        bullets: [
          "Для интерьерных красок используйте рукав 1/4″ длиной 15 м.",
          "Для шпаклёвок и огнезащиты обязателен основной рукав 3/8″ с коротким поводком 1/4″ (2,0–2,5 м) перед пистолетом для разгрузки кисти маляра.",
        ],
      },
    ],
  },
  {
    id: "putty-mechanization",
    tag: "МЕХАНИЗАЦИЯ ШПАКЛЁВКИ",
    specBadge: "СОПЛА 0.035″ – 0.049″",
    readTime: "5 мин",
    title: "Технология безвоздушного нанесения полимерных и гипсовых шпаклёвок под Q3–Q4",
    teaser:
      "Правильная подготовка пасты, демонтаж сеточных фильтров, рабочее давление 210–230 бар и техника сведения слоя шпателем 60 см.",
    keyPoints: [
      "Демонтаж фильтра из рукоятки пистолета и колбы ВД",
      "Работа соплами 535–549 без разбавления пасты сверх техкарты",
      "Темп звена из 2 человек: до 1 500 – 2 200 м² за смену",
    ],
    machineId: "nord-9200",
    labId: "nord-9200",
    machineName: "NORD-9200",
    machineSpec: "9,0 л/мин · 230 бар · сопло до 0.049″",
    machinePrice: "125 000 ₽",
    machineRent: "2 500 ₽/сут",
    image: "/assets/machines/nord-9200/NORD-8000-view-front-3q-source.jpg",
    sections: [
      {
        heading: "1. Подготовка тракта высокого давления под пасту",
        paragraphs: [
          "При переходе с окрасочных работ на механизированное нанесение шпаклёвки (Danogips SuperFinish, Sheetrock, Semin Sem-Joint, Vetonit LR+) необходимо полностью освободить проходное сечение станции от мелкоячеистых сеток.",
        ],
        bullets: [
          "Извлеките сетчатый фильтр из рукоятки пистолета и из фильтра высокого давления (колбы) на корпусе станции.",
          "Используйте усиленный шпаклёвочный пистолет прямого потока (HD) и реверсивные сопла калибра 0.035″–0.049″ (например, 535, 543, 549).",
          "Соблюдайте угол распыла 50°–60° с перекрытием каждого прохода на 30%.",
        ],
      },
      {
        heading: "2. Синхронизация оператора пистолета и мастера на шпателе",
        paragraphs: [
          "Станция класса 9,0 л/мин наносит слой 1,2–1,5 мм на стену площадью 20 м² менее чем за 3 минуты. Чтобы материал не заветривался до прохода широким механизированным шпателем (60–80 см), оператор наносит пасту захватками по 15–25 м².",
        ],
      },
    ],
  },
  {
    id: "quickreel",
    tag: "СВЕРХВЫСОКОЕ ДАВЛЕНИЕ 350 БАР",
    specBadge: "350 БАР · ТРАССА ДО 90 М",
    readTime: "3 мин",
    title: "Работа на давлении 350 бар со станцией NORD-8000 PRO: мастики, антикор и длинные трассы",
    teaser:
      "Когда стандартных 230 бар недостаточно: преимущества баровой станции 350 бар при распылении вязких тиксотропных паст и подаче на высоту.",
    keyPoints: [
      "Стабильная атомизация высоковязких мастик и огнезащиты без разбавления",
      "Прокачка шлангов высокого давления длиной до 60–90 метров",
      "Усиленная поршневая группа 4,0 кВт с подачей 7,5 л/мин",
    ],
    machineId: "nord-8000-pro",
    labId: "nord-8000-pro",
    machineName: "NORD-8000 PRO",
    machineSpec: "7,5 л/мин · 350 бар · 4 000 Вт",
    machinePrice: "150 000 ₽",
    machineRent: "2 700 ₽/сут",
    image: "/assets/machines/nord-8000-pro/NORD-8000-view-side-nord-edit-2k.jpg",
    sections: [
      {
        heading: "1. Зачем на объекте запас давления до 350 бар",
        paragraphs: [
          "При работе с тяжёлыми антикоррозийными мастиками, битумно-полимерной гидроизоляцией и конструктивной огнезащитой на длинных рукавах ВД часть давления неизбежно гасится о стенки магистрали. Станция NORD-8000 PRO развивает до 350 бар, сохраняя эталонное раскрытие факела на пистолете.",
        ],
        bullets: [
          "Исключает непрокрасы и «усы» по краям факела на вязких эпоксидных и полиуретановых составах.",
          "Позволяет работать с одной точки без переноски аппарата по строительным лесам.",
          "Комплектуется усиленными рукавами ВД 3/8″ с рабочим запасом прочности.",
        ],
      },
      {
        heading: "2. Регламент безопасности при работе на 350 бар",
        paragraphs: [
          "Перед подачей рабочего давления проверьте маркировку шлангов и вертлюга (не менее 350 бар), а также затяжку резьбовых соединений.",
        ],
      },
    ],
  },
  {
    id: "two-posts-setup",
    tag: "РАБОТА В 2–3 ПОСТА",
    specBadge: "6,5 – 18,0 Л/МИН",
    readTime: "4 мин",
    title: "Подключение 2 малярных постов к одной станции: расчёт сопел и тройника ВД",
    teaser:
      "Формула деления потока насоса на два пистолета, подбор равнопроходного тройника и предотвращение пульсации факела.",
    keyPoints: [
      "Суммарный расход двух сопел не должен превышать 80% подачи насоса",
      "Симметричная длина рукавов (например, 15 м + 15 м или 30 м + 30 м)",
      "Удвоение сменной выработки бригады без покупки второго аппарата",
    ],
    machineId: "nord-18x",
    labId: "nord-18x",
    machineName: "NORD-18X",
    machineSpec: "18,0 л/мин · 5 500 Вт · на 2–3 поста",
    machinePrice: "155 000 ₽",
    machineRent: "2 900 ₽/сут",
    image: "/assets/machines/nord-18x/NORD-18X-view-front-3q-b.jpg",
    sections: [
      {
        heading: "1. Как правильно считать калибр сопел при работе вдвоём",
        paragraphs: [
          "При подключении второго малярного поста через штатный тройник высокого давления производительность насоса распределяется между двумя пистолетами. Если станция выдаёт 6,5 л/мин (NORD-6000) и способна нести одно сопло 0.043″, то при одновременной работе двух маляров максимальный калибр каждого сопла составляет до 0.025″–0.027″.",
        ],
        bullets: [
          "NORD-4500 (4,2 л/мин): 2 поста с соплами до 0.017″–0.019″ (интерьерные и фасадные краски).",
          "NORD-6000 (6,5 л/мин): 2 поста с соплами до 0.025″ (фасады, металлоконструкции, жидкие пасты).",
          "NORD-18X (18,0 л/мин): 2–3 поста одновременно даже на густых шпаклёвках и огнезащите (сопла до 0.039″ на каждый пост).",
        ],
      },
      {
        heading: "2. Балансировка длины рукавов",
        paragraphs: [
          "Чтобы оба маляра получали одинаковое давление на пистолете без рывков в момент нажатия курка напарником, используйте рукава одинакового сечения и равной длины на обоих плечах разветвителя.",
        ],
      },
    ],
  },
  {
    id: "rental-guide",
    tag: "АРЕНДА И ПРОКАТ",
    specBadge: "ОТ 1 500 ₽/СУТ",
    readTime: "3 мин",
    title: "Аренда станции в Москве: чек-лист главного инженера перед выездом на объект",
    teaser:
      "Что проверить на испытательном стенде при получении аппарата, как укомплектовать пост под свой состав и избежать простоя бригады.",
    keyPoints: [
      "Контрольная опрессовка 230 бар на стенде перед погрузкой",
      "Комплектация поста: рукав 15–30 м, пистолет, удочка 50 см и сопло",
      "Работа по договору с ИП/ООО (ЭДО) или быстрая выдача физлицам",
    ],
    machineId: "nord-4500",
    labId: "nord-4500",
    machineName: "NORD-4500",
    machineSpec: "4,2 л/мин · 230 бар · Прокат от 2 000 ₽/сут",
    machinePrice: "55 000 ₽",
    machineRent: "2 000 ₽/сут",
    image: "/assets/machines/nord-4500/NORD-4500-view-front-3q-nord-edit.jpg",
    sections: [
      {
        heading: "1. Какие данные сообщить инженеру проката до бронирования",
        paragraphs: [
          "Чтобы станция сразу выдала плановую квадратуру на объекте, перед выездом сообщите дежурному инженеру марку распыляемого материала (по техкарте ЛКМ), требуемую длину рукава от розетки до дальней стены и высоту потолков.",
        ],
        bullets: [
          "Мы укомплектуем аппарат соплом нужного угла и калибра (например, 517 для интерьера или 525 для фасада).",
          "При высоте потолков более 3,2 м в комплект добавляется алюминиевая удочка-удлинитель 50 или 100 см.",
          "При необходимости работы на удалении от щитка комплектуем трассу шлангами 30–45 м.",
        ],
      },
      {
        heading: "2. Проверка на стенде (Окружной проезд, 34Ас6)",
        paragraphs: [
          "При выдаче со склада механик запускает станцию при вас: проверяется плавность набора давления, срабатывание отсечки на 230 бар и герметичность всех резьбовых соединений.",
        ],
      },
    ],
  },
  {
    id: "sprayer-care",
    tag: "СЕРВИС И РЕСУРС",
    specBadge: "+300% К РЕСУРСУ",
    readTime: "4 мин",
    title: "Регламент промывки и консервации поршневого насоса после рабочей смены",
    teaser:
      "Пошаговый алгоритм сброса давления, промывки заборного и напорного трактов, очистки фильтров и смазки штока пластификатором.",
    keyPoints: [
      "Промывка в 2 цикла: оборотная и чистая жидкость",
      "Ежесменная подача 5–7 капель масла пластификатора в стакан штока",
      "Сброс давления через дренажный клапан перед любой разборкой",
    ],
    machineId: "nord-2500",
    labId: "nord-2500",
    machineName: "NORD-2500",
    machineSpec: "2,5 л/мин · 1 600 Вт · Масса 15 кг",
    machinePrice: "35 000 ₽",
    machineRent: "1 500 ₽/сут",
    image: "/assets/machines/nord-2500/NORD-2500-view-front-3q-nord-edit-2k.jpg",
    sections: [
      {
        heading: "1. Безопасный сброс давления и двухконтурная промывка",
        paragraphs: [
          "90% обращений в сервис связаны с полимеризацией остатков краски или шпаклёвки в клапанной группе и колбе фильтра ВД. Промывка станции занимает 10–12 минут в конце смены и полностью исключает залипание шариков впускного и выпускного клапанов.",
        ],
        bullets: [
          "Переведите регулятор давления в минимум, переключите кран в режим сброса (дренаж) и стравите остаточное давление.",
          "Снимите сопло и соплодержатель с пистолета, поместите их в промывочный состав.",
          "Прокачайте чистую воду (для водно-дисперсионных составов) или соответствующий растворитель сначала через дренажную трубку, затем через шланг и пистолет на минимальном давлении (40–60 бар).",
        ],
      },
      {
        heading: "2. Смазка уплотнений поршня и консервация",
        paragraphs: [
          "Перед началом каждой смены добавляйте 5–7 капель фирменного пластификатора (масла TSL) в заливную горловину уплотнений штока. Это предотвращает сухое трение манжет и налипание абразивного пигмента на зеркало поршня.",
        ],
      },
    ],
  },
];

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const article = id ? ARTICLES.find((item) => item.id === id) : null;
  if (id && !article) notFound();

  if (article) {
    const otherArticles = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);
    return (
      <>
        <PageHero
          title={article.title}
          description={article.teaser}
          eyebrow={`БАЗА ЗНАНИЙ NORD · ${article.tag}`}
          theme="spray"
        />

        <section className="section section-blueprint">
          <div className="container">
            <div className="kb-dossier-layout">
              {/* Left Column: Structured Engineering Regulation */}
              <article className="kb-dossier-main">
                <div className="kb-dossier-meta">
                  <span className="kb-tag-pill">{article.tag}</span>
                  <span className="kb-spec-pill">{article.specBadge}</span>
                  <span className="kb-time-pill">Время изучения: {article.readTime}</span>
                </div>

                <div className="kb-takeaways-box">
                  <strong>Ключевые положения регламента:</strong>
                  <ul>
                    {article.keyPoints.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {article.sections.map((sec) => (
                  <div key={sec.heading} className="kb-dossier-section">
                    <h2>{sec.heading}</h2>
                    {sec.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    {sec.bullets && (
                      <ul className="kb-dossier-list">
                        {sec.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                <div className="kb-dossier-footer">
                  <Link className="button button-outline" href="/articles">
                    ← Вернуться ко всем регламентам
                  </Link>
                  <Link className="button button-primary" href="/catalog">
                    Перейти в каталог станций →
                  </Link>
                </div>
              </article>

              {/* Right Sticky Column: Recommended Station & Engineer Hotline */}
              <aside className="kb-dossier-sidebar">
                <div className="kb-station-widget">
                  <div className="kb-station-top">
                    <span>БАЗОВАЯ СТАНЦИЯ ПО РЕГЛАМЕНТУ</span>
                    <strong>В НАЛИЧИИ · МОСКВА</strong>
                  </div>
                  <Link href={`/product/${article.machineId}`} className="kb-station-img">
                    <img src={article.image} alt={article.machineName} />
                  </Link>
                  <div className="kb-station-body">
                    <h3>{article.machineName}</h3>
                    <p className="kb-station-spec">{article.machineSpec}</p>
                    <div className="kb-station-prices">
                      <div>
                        <span>Покупка с НДС</span>
                        <strong>{article.machinePrice}</strong>
                      </div>
                      <div>
                        <span>Прокат на объект</span>
                        <strong>{article.machineRent}</strong>
                      </div>
                    </div>
                    <div className="kb-station-actions">
                      <Link className="button button-primary" href={`/product/${article.machineId}`}>
                        Открыть карточку станции →
                      </Link>
                      <Link className="button button-secondary" href={`/lab?machine=${article.labId}`}>
                        Испытать на 3D-стене NORD LAB
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="kb-engineer-card">
                  <span>КОНСУЛЬТАЦИЯ ТЕХНОЛОГА NORD</span>
                  <strong>Нужен подбор сопла и станции под ваш состав?</strong>
                  <p>Назовите марку краски или шпаклёвки — рассчитаем давление, калибр сопла и длину трассы за 5 минут.</p>
                  <a href={SITE_CONFIG.phoneHref} className="kb-engineer-phone">
                    {SITE_CONFIG.phone}
                  </a>
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
                </div>
              </aside>
            </div>

            {/* Related Articles */}
            <div className="section-heading" style={{ marginTop: 48 }}>
              <div>
                <p className="eyebrow">СМЕЖНЫЕ ТЕХНОЛОГИЧЕСКИЕ РЕГЛАМЕНТЫ</p>
                <h2>Другие материалы инженерной базы NORD</h2>
              </div>
              <Link className="button button-outline" href="/articles">
                Все регламенты →
              </Link>
            </div>

            <div className="kb-grid">
              {otherArticles.map((item) => (
                <article className="kb-card" key={item.id}>
                  <div className="kb-card-top">
                    <span className="kb-card-tag">{item.tag}</span>
                    <span className="kb-card-spec">{item.specBadge}</span>
                  </div>
                  <div className="kb-card-visual">
                    <img src={item.image} alt={item.machineName} loading="lazy" />
                    <div className="kb-card-visual-meta">
                      <span>Базовая модель:</span>
                      <strong>{item.machineName}</strong>
                    </div>
                  </div>
                  <div className="kb-card-body">
                    <h3>
                      <Link href={`/articles?id=${item.id}`}>{item.title}</Link>
                    </h3>
                    <p>{item.teaser}</p>
                    <div className="kb-card-footer">
                      <Link className="kb-read-btn" href={`/articles?id=${item.id}`}>
                        Открыть регламент →
                      </Link>
                      <Link className="kb-machine-link" href={`/product/${item.machineId}`}>
                        {item.machineName}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Инженерная база знаний и регламенты работ"
        description="Практические руководства по подбору окрасочных и шпаклёвочных станций, таблицы калибров сопел под вязкость ЛКМ, настройка работы на 2 поста и обслуживание насосов ВД."
        eyebrow="БАЗА ЗНАНИЙ · ТЕХНОЛОГИЧЕСКИЕ КАРТЫ NORD"
        theme="spray"
      />

      {/* 1. Chief Technologist Nozzle & Pressure Reference Matrix */}
      <section className="section section-blueprint">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">СПРАВОЧНИК ГЛАВНОГО ИНЖЕНЕРА · ТАБЛИЦА РЕЖИМОВ РАСПЫЛА</p>
              <h2>Подбор сопла, рабочего давления и фильтра под тип состава</h2>
            </div>
            <Link className="button button-primary" href="/lab">
              Проверить факел в 3D-стенде →
            </Link>
          </div>

          <div className="comparison-table-wrap" style={{ marginBottom: 44 }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Рабочий материал / состав</th>
                  <th>Калибр сопла</th>
                  <th>Давление ВД</th>
                  <th>Фильтр в пистолете</th>
                  <th>Подача насоса</th>
                  <th>Рекомендуемая станция</th>
                </tr>
              </thead>
              <tbody>
                {NOZZLE_CHART.map((row) => (
                  <tr key={row.material}>
                    <td>
                      <strong style={{ color: "var(--black)" }}>{row.material}</strong>
                    </td>
                    <td className="mono-cell">{row.nozzle}</td>
                    <td className="mono-cell">{row.pressure}</td>
                    <td>{row.filter}</td>
                    <td className="mono-cell">{row.flow}</td>
                    <td>
                      <Link href={row.stationHref} className="table-action-link">
                        {row.station} →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. 6 Illustrated Engineering Guides */}
          <div className="section-heading">
            <div>
              <p className="eyebrow">ПРАКТИЧЕСКИЕ РУКОВОДСТВА И ТЕХКАРТЫ ЭКСПЛУАТАЦИИ</p>
              <h2>Регламенты подбора, запуска и обслуживания станций ({ARTICLES.length})</h2>
            </div>
            <p>Каждый регламент содержит рабочие параметры давления, калибры сопел и привязку к оборудованию.</p>
          </div>

          <div className="kb-grid">
            {ARTICLES.map((item) => (
              <article className="kb-card" key={item.id}>
                <div className="kb-card-top">
                  <span className="kb-card-tag">{item.tag}</span>
                  <span className="kb-card-spec">{item.specBadge}</span>
                </div>

                <Link href={`/articles?id=${item.id}`} className="kb-card-visual">
                  <img src={item.image} alt={item.machineName} loading="lazy" />
                  <div className="kb-card-visual-meta">
                    <span>Оборудование в разборе:</span>
                    <strong>{item.machineName} · {item.machinePrice}</strong>
                  </div>
                </Link>

                <div className="kb-card-body">
                  <h3>
                    <Link href={`/articles?id=${item.id}`}>{item.title}</Link>
                  </h3>
                  <p>{item.teaser}</p>

                  <ul className="kb-card-points">
                    {item.keyPoints.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>

                  <div className="kb-card-footer">
                    <Link className="kb-read-btn" href={`/articles?id=${item.id}`}>
                      Читать регламент ({item.readTime}) →
                    </Link>
                    <Link className="kb-machine-link" href={`/product/${item.machineId}`}>
                      {item.machineName}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 3. Direct Engineering Consultation Block */}
          <div style={{ marginTop: 48 }}>
            <ContactRequestForm subject="Консультация технолога и подбор станции по техкарте материала (База знаний)" />
          </div>
        </div>
      </section>
    </>
  );
}
