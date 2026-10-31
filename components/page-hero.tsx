import Link from "next/link";

export function PageHero({
  title,
  description,
  eyebrow,
  theme = "corporate",
}: {
  title: string;
  description: string;
  eyebrow: string;
  theme?: "corporate" | "spray" | "rent" | "nozzle";
}) {
  const graphic = theme === "corporate"
    ? <svg className="page-theme page-theme--dots" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <circle key={index} cx={(index * 97 + 41) % 1380 + 30} cy={(index * 53 + 31) % 360 + 24} r={index % 3 === 0 ? 2.4 : 1.5} />)}</svg>
    : theme === "spray"
      ? <svg className="page-theme page-theme--spray" viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden="true"><g>{[0, 1, 2, 3, 4, 5, 6].map((line) => <path key={line} d={`M35 ${210 + line * 11} Q440 ${120 + line * 18} 1435 ${24 + line * 54}`} />)}</g><circle className="spray-nozzle" cx="35" cy="265" r="5" /></svg>
      : theme === "rent"
        ? <svg className="page-theme page-theme--hose" viewBox="0 0 520 420" aria-hidden="true"><path className="hose-line" pathLength="100" d="M-36 355 C110 360 190 352 218 310 C247 266 191 235 203 172 C216 103 321 81 374 130 C429 181 398 260 344 269 C302 276 277 244 285 211 C292 178 326 166 349 182 C371 197 365 224 347 232" /></svg>
        : <svg className="page-theme page-theme--nozzle" viewBox="0 0 300 300" aria-hidden="true"><path className="nozzle-body" d="M48 151h82l22-18 26 4 13 14-13 14-26 4-22-18H48l-12 12v-24z" /><path className="nozzle-fan" d="M190 151 286 77M190 151h103M190 151l96 76" /><path className="nozzle-fan nozzle-fan--thin" d="M190 151 270 99M190 151h85M190 151l80 52" /></svg>;
  return (
    <section className={`page-hero page-hero--${theme} is-visible`}>
      <div className="container">
        <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span aria-hidden="true"> / </span>{eyebrow}</nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </div>
      {graphic}
    </section>
  );
}
