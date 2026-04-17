# Лабораторна робота №6. Технічне SEO та зовнішня оптимізація: від аудиту до стратегії

## Інструменти

| Інструмент                 | Для чого                                           | Посилання                           |
|----------------------------|----------------------------------------------------|-------------------------------------|
| Google Search Console      | Індексація, sitemap, links report                  | search.google.com/search-console    |
| PageSpeed Insights         | Lab + Field дані, Core Web Vitals                 | pagespeed.web.dev                   |
| Lighthouse                 | Детальний performance аудит у Chrome DevTools      | вбудовано в Chrome                  |
| Screaming Frog SEO Spider  | Технічний crawl, статус-коди, canonical, редіректи (free до 500 URL) | screamingfrog.co.uk/seo-spider      |
| Rich Results Test          | Перевірка Schema.org                               | search.google.com/test/rich-results |
| Ahrefs Free Backlink Checker | Базовий аналіз донорів і зовнішніх посилань      | ahrefs.com/backlink-checker         |
| Google Sheets              | Командні таблиці аудиту і плану робіт              | sheets.google.com                   |

> Використовуємо лише безкоштовні режими інструментів. Для backlink аналізу достатньо даних `Links` у GSC + Ahrefs Free Backlink Checker.

---

## Хід роботи

### 1. Технічний аудит (діагностика)

#### 1.1 - Crawl та інвентаризація технічного стану

За допомогою [LibreCrawl](https://librecrawl.com/) було проведено crawling сайту. Результати аналізу занесені до Google таблиці. Було проаналізовано 44 сторінки.

**Рекомендації на покращення E-E-A-T**
- ✍️ Add Author Information. Only 0 out of 44 pages have author information. Add author bylines with credentials to demonstrate expertise
- 📊 Implement Structured Data. 0 pages have schema markup
- 📝 Improve Content Depth. 1 pages have sufficient content (300+ words). Create comprehensive, in-depth content to demonstrate expertise

**EEAT аналіз сторінок**

<img width="1481" height="679" alt="image" src="https://github.com/user-attachments/assets/c1d43b46-acc9-4de4-b8c2-d0788c1d86f3" />

#### 1.2 - Перевірка технічних файлів і протоколу

Було перевірено доступність `robots.txt` та `sitemap.xml` та канонічність домену.

| Перевірка | Статус (OK / Problem) | Деталі проблеми | Пріоритет |
|----------|------------------------|-----------------|-----------|
| доступність robots.txt доступний | Problem | Не вдалося підтвердити доступність robots.txt автоматично. Він відсутній | High |
| Немає Disallow: / на продакшені | Problem | robots.txt відсутній | High |
| sitemap.xml доступний | Problem | Sitemap.xml відсутній | High |
| У sitemap тільки 200 + canonical URL | Problem | Sitemap.xml відсутній | High |
| Єдина канонічна версія домену (HTTPS, www/non-www) | OK | У crawl baseUrl = https://betterstack.tech (без www) |  |
| Переспрямування на HTTPS | OK | Завжди переспрямовує на HTTPS версію сторінки |  |

#### 1.3 - Canonical, редіректи, статус-коди, Schema

| Тип проблеми | URL | Що знайдено | Ризик (High/Med/Low) | Рішення |
|-------------|-----|-------------|----------------------|---------|
| status codes | https://betterstack.tech/article/python | У crawl: status_code=500, meta robots = noindex, meta_description="The requested software could not be found.", але на неї посилаються (typescript/html/rust/go + comparison). | Med | Збільшити ресурси сервера, щоб уникати 500 помилок у даному випадку |
| status codes | https://betterstack.tech/catalog?page=2 | У crawl: status_code=200, але H3="Nothing found." (порожній лістинг). | Med | Перевірити пагінацію/параметри/бекенд |
| status codes | https://betterstack.tech/catalog?page=3 | У crawl: status_code=200, але H3="Nothing found." (порожній лістинг). | Med | Аналогічно: виправити пагінацію або закрити від індексації/прибрати з навігації. |
| canonical | https://betterstack.tech/catalog?page=2 | Canonical вказує на першу сторінку пагінації: https://betterstack.tech/catalog | High | Вказувати номер сторінки у canonical |
| schema | (усі URL зі звіту) | У crawl поля json_ld та schema_org всюди порожні. Тобто структуровані дані або відсутні, або не витягнулися. | Low | Додати Schema: WebSite + SearchAction (home), Organization, BreadcrumbList (catalog/article), Article (article/*), ProfilePage (profile/*) |

---

### 2. Впровадження налаштувань і виправлень

#### 2.1 - Обов'язкові технічні налаштування (Lecture 6)

Якщо у проєкті ще немає базових SEO-файлів і правил - налаштувати їх з нуля.

**A. Налаштувати `robots.txt`**

1. Створити/оновити файл `https://ваш-домен/robots.txt`
2. Додати базові правила для продакшену:

```txt
User-agent: *
Disallow: /admin/
Disallow: /cart/
Allow: /

Sitemap: https://ваш-домен/sitemap.xml
```

3. Переконатися, що **немає** `Disallow: /`

**B. Налаштувати `sitemap.xml`**

1. Створити/оновити `https://ваш-домен/sitemap.xml`
2. Включити тільки canonical URL зі статусом `200`
3. Додати поле `lastmod` для URL, що змінювалися
4. Відправити sitemap у Google Search Console

**C. Налаштувати canonical на шаблонах**

1. Перевірити шаблони: головна, категорія, стаття/товар
2. Для кожного шаблону canonical має:
   - бути абсолютним URL
   - вести на сторінку зі статусом `200`
   - не вести на URL з параметрами

**D. Перевірити єдину канонічну версію домену**

1. Перевірити, чи `http` автоматично веде на `https`
2. Перевірити, чи немає дублювання між `www` і `non-www`
3. Якщо альтернативні версії доступні паралельно - налаштувати `301` на єдину канонічну версію
4. Перевірити відсутність redirect chains

Таблиця контролю налаштувань:

| Налаштування | Було | Стало | Доказ |
|--------------|------|-------|-------|
| robots.txt   |      |       |       |
| sitemap.xml  |      |       |       |
| canonical    |      |       |       |
| Канонічна версія домену (HTTPS, www/non-www) |      |       |       |

#### 2.2 - Виправлення знайдених помилок

На основі аудиту (розділ 1) виправити щонайменше **6 технічних проблем**:

- мінімум 2 проблеми рівня High
- мінімум 2 проблеми пов'язані з індексацією/crawling
- мінімум 1 проблема canonical/redirect
- мінімум 1 проблема structured data або статус-кодів

Заповнити таблицю:

| № | Проблема | Вплив на SEO | Що зроблено | Де перевірено | Статус |
|---|----------|--------------|-------------|---------------|--------|
| 1 | Canonical вів на URL з параметром | Розмивання сигналів, ризик дублів | Замінено canonical на чистий URL без параметрів | DevTools + повторний crawl | Done |
| 2 |          |              |             |               |        |
| 3 |          |              |             |               |        |
| 4 |          |              |             |               |        |
| 5 |          |              |             |               |        |
| 6 |          |              |             |               |        |

> Для кожного виправлення додати доказ: скріншот "до/після", витяг із коду або результат повторної перевірки.

#### 2.3 - Валідація після змін (re-audit)

Після впровадження всіх правок виконати короткий повторний аудит і підтвердити, що критичні проблеми закрито:

| Що перевіряємо повторно | Метод перевірки | Результат |
|-------------------------|-----------------|-----------|
| robots.txt              | URL + ручна перевірка правил |           |
| sitemap.xml             | URL + перевірка у GSC         |           |
| Canonical на ключових шаблонах | DevTools / crawler       |           |
| Канонічна версія домену (HTTPS, www/non-www) | curl / browser check |           |
| 4xx/5xx та redirect chains | crawler                     |           |
| Schema.org (1-2 ключові шаблони) | Rich Results Test      |           |

У висновку вказати: які проблеми закрито повністю, які залишились у backlog і чому.

---

### 3. Аналіз швидкості

#### 3.1 - Baseline вимірювання (до оптимізації)

Вибрати **2 пріоритетні шаблони сторінок**:

- Головна
- Одна пріоритетна сторінка (категорія або стаття/товар)

Для кожного URL зняти показники з PageSpeed Insights (Mobile + Desktop):

| URL                                  | Device  | Performance | LCP  | INP | CLS | TTFB | FCP  | Статус CWV        |
|--------------------------------------|---------|-------------|------|-----|-----|------|------|-------------------|
| https://betterstack.tech/            | Mobile  | 98          | 2.7s | N/A | 0   | N/A  | 0.9s | Needs Improvement |
| https://betterstack.tech/            | Desktop | 100         | 0.6s | N/A | 0   | N/A  | 0.2s | Passed            |
| https://betterstack.tech/article/vim | Mobile  | 97          | 3.3s | N/A | 0   | N/A  | 0.9s | Needs Improvement |
| https://betterstack.tech/article/vim | Desktop | 100         | 0.5s | N/A | 0   | N/A  | 0.3s | Passed            |

#### 3.2 - Аналіз причин

Для кожного URL виписати топ-2 проблеми з розділів **Opportunities** та **Diagnostics**:

| URL                                  | Проблема                                   | Яку метрику псує | Потенційний вплив  | Пріоритет |
|--------------------------------------|--------------------------------------------|------------------|--------------------|-----------|
| https://betterstack.tech/            | Устарівший код JavaScript                  | LCP, FCP         | Повільний рендер   | High      |
| https://betterstack.tech/            | Невикористаний код JavaScript              | LCP, FCP         | Білий екран        | High      |
| https://betterstack.tech/article/vim | Розмір зображень більше розміру контейнера | LCP, FCP         | Довге завантаження | Medium    |
| https://betterstack.tech/article/vim | Невикористаний код JavaScript              | LCP, FCP         | Зависання кліків   | High      |

> Орієнтири Core Web Vitals: `LCP <= 2.5s`, `INP <= 200ms`, `CLS <= 0.1` (зелена зона).

---

### 4. Оптимізація Core Web Vitals

Виконати практичні оптимізації і повторно виміряти метрики. Ключова мета цього розділу - показати вимірюваний ефект у
форматі "було/стало". Мінімальна вимога - **4 впроваджені зміни**:

- мінімум 1 зміна для LCP
- мінімум 1 зміна для INP
- мінімум 1 зміна для CLS
- мінімум 1 зміна на рівні кешування/сервера/доставки ресурсів

Приклади допустимих змін:

- Оптимізація hero-зображення (WebP/AVIF, пріоритетне завантаження)
- Видалення або відкладення невикористаного JS
- Lazy-load для нижньої частини сторінки
- Фіксовані `width/height` для зображень та iframe
- `font-display: swap` і preload критичних шрифтів
- Кешування статичних ресурсів

Таблиця результатів:

| Метрика | Було | Стало | Delta | Досягнуто цілі?         |
|---------|------|-------|-------|-------------------------|
| LCP     | 2.7s | 1.9s  | -0.8s | Так                     |
| INP     | N/A  | N/A   | N/A   | N/A                     |
| CLS     | 0    | 0     | 0     | Не потребує оптимізації |

---

### 5. Аналіз backlink профілю

#### 5.1 - Поточний стан профілю

Зібрати базові дані через безкоштовні інструменти (GSC + Ahrefs Free Backlink Checker).

Якщо у вашого домену немає достатніх даних (новий сайт, немає live URL, 0-2 backlinks), дозволено режим
**"конкурентний benchmark"**: взяти 2-3 релевантних конкурентів і зібрати агреговані метрики по ніші.


| Показник                          | Значення          | Висновок                                                                 |
|-----------------------------------|-------------------|--------------------------------------------------------------------------|
| Кількість referring domains       | 23                | Дуже малий профіль, майже повністю складається зі спамних доменів       |
| Кількість backlinks               | 23                | Всі 23 посилання — спамні, низької якості                               |
| Частка dofollow / nofollow        | 0% / 100%         | 100% nofollow — посилання не передають вагу, тільки створюють ризик     |
| Частка branded анкорів            | ~8%               | Переважна більшість анкорів — довгі комерційні exact-match              |
| Частка exact-match анкорів        | ~92%              | Критично висока частка точних комерційних анкорів — сильний спам-сигнал |
| Нові/втрачені посилання за 30 днів| +23 / N/A         | Різкий спамний пік за короткий період — високий ризик пенальті          |

#### 5.2 - Якість донорів і анкорний профіль

**Проаналізовано 15 зовнішніх посилань (спам-лінки)**

| Донор                  | URL сторінки-донору                                                                 | Тип          | Анкор                                                                 | Dofollow/Nofollow | Якість  |
|------------------------|-------------------------------------------------------------------------------------|--------------|-----------------------------------------------------------------------|-------------------|---------|
| seogeko.shop          | https://seogeko.shop/premium-seo-backlinks-to-boost-website-betterstack-tech...     | blog        | Premium SEO Backlinks betterstack.tech Provides High-Quality Authority Backlinks, Professional Guest Posting, and Advanced Link Building Services to Boost Google Rankings, Drive Targeted Organic Traffic, and Strengthen Website Authority in Gambling, Casino, Crypto, and Competitive Markets | NF                | Risky  |
| seogeko.shop          | https://seogeko.shop/premium-seo-backlinks-to-boost-website-betterstack-tech...     | blog        | Premium SEO Backlinks betterstack.tech Provides High-Quality Authority Backlinks, Professional Guest Posting, and Advanced Link Building Services to Boost Google Rankings, Drive Targeted Organic Traffic, and Strengthen Website Authority in Gambling, Casino, Crypto, and Competitive Markets | NF                | Risky  |
| serpzilla.com         | https://serpzilla.com/premium-guest-post-betterstack-tech-stack-directory...        | blog        | High DA Guest Post Backlinks betterstack.tech Tech Stack Comparison Tool – Boost Your SEO Rankings Fast, Buy Premium Authority Links, Professional Link Building Services for Developer Tools, Web Development and SaaS Niche | NF                | Risky  |
| serpzilla.com         | https://serpzilla.com/premium-guest-post-betterstack-tech-stack-directory...        | blog        | High DA Guest Post Backlinks betterstack.tech Tech Stack Comparison Tool – Boost Your SEO Rankings Fast, Buy Premium Authority Links, Professional Link Building Services for Developer Tools, Web Development and SaaS Niche | NF                | Risky  |
| serpzilla.com         | https://serpzilla.com/premium-guest-post-betterstack-tech-stack-directory...        | blog        | High DA Guest Post Backlinks betterstack.tech Tech Stack Comparison Tool – Boost Your SEO Rankings Fast, Buy Premium Authority Links, Professional Link Building Services for Developer Tools, Web Development and SaaS Niche | NF                | Risky  |
| vefogix.com           | https://vefogix.com/premium-backlinks-betterstack-tech-developer-tools...           | directory   | Buy Premium Backlinks betterstack.tech – Tech Stack Directory & Comparison Platform, High Authority Links, Guest Posting Services to Skyrocket Google Rankings and Domain Authority in Programming and Dev Tools Market | NF                | Risky  |
| vefogix.com           | https://vefogix.com/premium-backlinks-betterstack-tech-developer-tools...           | directory   | Buy Premium Backlinks betterstack.tech – Tech Stack Directory & Comparison Platform, High Authority Links, Guest Posting Services to Skyrocket Google Rankings and Domain Authority in Programming and Dev Tools Market | NF                | Risky  |
| web20ranker.com       | https://web20ranker.com/guest-post-betterstack-tech-authority-links...              | blog        | Premium Guest Posting Service betterstack.tech – High Authority Backlinks for Developer Tools, Tech Stack Directory, Unbiased Reviews, Boost SEO Rankings with Professional Link Building and Contextual Links | NF                | Risky  |
| web20ranker.com       | https://web20ranker.com/guest-post-betterstack-tech-authority-links...              | blog        | Premium Guest Posting Service betterstack.tech – High Authority Backlinks for Developer Tools, Tech Stack Directory, Unbiased Reviews, Boost SEO Rankings with Professional Link Building and Contextual Links | NF                | Risky  |
| badassbacklinks.com   | https://badassbacklinks.com/premium-seo-links-betterstack-tech...                   | blog        | Buy High Authority Backlinks betterstack.tech – Tech Stack Directory & Unbiased Reviews, Premium SEO Services, Guest Posts to Increase Domain Rating, Organic Traffic and Google Visibility in Web Development Niche | NF                | Risky  |
| badassbacklinks.com   | https://badassbacklinks.com/premium-seo-links-betterstack-tech...                   | blog        | Buy High Authority Backlinks betterstack.tech – Tech Stack Directory & Unbiased Reviews, Premium SEO Services, Guest Posts to Increase Domain Rating, Organic Traffic and Google Visibility in Web Development Niche | NF                | Risky  |
| legiit.com            | https://legiit.com/premium-backlinks-betterstack-tech-stack-comparison...           | blog        | High Quality SEO Backlinks betterstack.tech – Boost Domain Authority in Tech Niche, Premium Guest Posts, Authority Links for Tech Stack Directory, Comparison Tools and Developer Resources | NF                | Risky  |
| legiit.com            | https://legiit.com/premium-backlinks-betterstack-tech-stack-comparison...           | blog        | High Quality SEO Backlinks betterstack.tech – Boost Domain Authority in Tech Niche, Premium Guest Posts, Authority Links for Tech Stack Directory, Comparison Tools and Developer Resources | NF                | Risky  |
| seobacklinkpro.shop   | https://seobacklinkpro.shop/premium-guest-post-betterstack-tech...                  | blog        | Premium SEO Backlinks betterstack.tech – Professional Link Building for Web Development Tools, Tech Stack Directory, High DA Guest Posts to Drive Massive Organic Traffic and Skyrocket Rankings | NF                | Risky  |
| seobacklinkpro.shop   | https://seobacklinkpro.shop/premium-guest-post-betterstack-tech...                  | blog        | Premium SEO Backlinks betterstack.tech – Professional Link Building for Web Development Tools, Tech Stack Directory, High DA Guest Posts to Drive Massive Organic Traffic and Skyrocket Rankings | NF                | Risky  |

### Ризики від виявлених спам-посилань

- **Потенційно спамні домени** — 15 посилань з сервісів масового продажу backlinks (seogeko.shop, serpzilla.com, vefogix.com тощо)
- **Підозрілий ріст exact-match анкорів** — довгі комерційні анкори з ключовими словами «Premium SEO Backlinks betterstack.tech», «High Authority Backlinks» тощо
- **Нерівномірна link velocity** — можливе масове розміщення кількох посилань за короткий період
- **Низька тематична релевантність донорів** — донори не мають відношення до веб-розробки, tech stack directory або dev tools

#### 5.3 - Якщо власний анкорний профіль порожній

Якщо у вашого сайту немає достатньої історії посилань, виконати fallback-аналіз:

1. Обрати 2-3 конкурентів із вашої ніші
2. Для кожного зібрати приклади анкорів і класифікувати їх за типом
3. Порахувати орієнтовний розподіл anchor mix у конкурентів
4. Сформувати цільовий anchor mix для свого проєкту (на найближчі 30 днів)

Таблиця для benchmark:

| Конкурент | Branded % | URL/Naked % | Partial % | Generic % | Exact % | Висновок |
|-----------|-----------|-------------|-----------|-----------|---------|----------|
|           |           |             |           |           |         |          |

У звіті окремо вказати: "Власний анкорний профіль недостатній для аналізу, використано конкурентний benchmark".

---

### 6. Побудова link strategy

#### 6.1 - Backlink Gap (конкурентний аналіз)

Обрано 3 конкурентів : https://stackshare.io/ , https://www.slant.co/ , https://alternativeto.net/ у вашій ніші і провести gap-аналіз (через безкоштовні дані інструментів):

| Донорський домен                    | Є у конкурента 1 (StackShare) | Є у конкурента 2 (Slant.co) | Є у конкурента 3 (AlternativeTo) | Є у нас | Пріоритет |
|-------------------------------------|-------------------------------|-----------------------------|----------------------------------|---------|-----------|
|stackvarta.pp.ua|	Ні|	Partner/Blog|	betterstack.tech|	Dofollow | High     |
| python.org                          | Так                          | Так                         | Так                             | Так    | High     |
| github.com/python/cpython           | Ні                           | Ні                          | Ні                              | Так    | Low      |
| typescriptlang.org                  | Так                          | Так                         | Так                             | Так    | High     |
| go.dev                              | Так                          | Так                         | Так                             | Так    | High     |
| github.com/topics/html              | Ні                           | Ні                          | Ні                              | Так    | Low      |
| rust-lang.org                       | Так                          | Ні                          | Так                             | Так    | High     |
| mongodb.com                         | Так                          | Так                         | Так                             | Так    | High     |
| postgresql.org                      | Так                          | Так                         | Так                             | Так    | High     |
| github.com/postgres/postgres        | Ні                           | Ні                          | Ні                              | Так    | Low      |
| redis.io                            | Так                          | Так                         | Так                             | Так    | High     |
| mysql.com                           | Так                          | Так                         | Так                             | Так    | High     |
| github.com/redis/redis              | Ні                           | Ні                          | Ні                              | Так    | Low      |
| vim.org                             | Так                          | Так                         | Так                             | Так    | High     |
| github.com/vim/vim                  | Ні                           | Ні                          | Ні                              | Так    | Low      |
| jetbrains.com/rider                 | Так                          | Ні                          | Так                             | Так    | High     |
| code.visualstudio.com               | Так                          | Так                         | Так                             | Так    | High     |
| github.com/microsoft/vscode         | Ні                           | Ні                          | Ні                              | Так    | Low      |
| github.com/microsoft/TypeScript     | Ні                           | Ні                          | Ні                              | Так    | Low      |
| github.com/golang/go                | Ні                           | Ні                          | Ні                              | Так    | Low      |
| github.com/rust-lang/rust           | Ні                           | Ні                          | Ні                              | Так    | Low      |

**Мінімальна вимога:** знайти **20 доменів-можливостей** (prospects) і розставити пріоритети.

#### 6.2 - 30-денний план зовнішньої оптимізації

Скласти покроковий план на 4 тижні:

| Тиждень | Ціль | Конкретні дії | KPI | Відповідальні |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Cleanup & Safety** | Підготовка `disavow` файлу для 15 спам-доменів. Налаштування моніторингу в GSC. | Файл відправлений в Google | **Коля** (Tech) |
| **2** | **Foundational Links** | Розміщення партнерського посилання на **StackVarta**. Створення профілів на ProductHunt та AlternativeTo. | +3 DR домени | **Влад** (Outreach) |
| **3** | **Content Outreach** | Публікація статті на **dev.to** про "Better Way to Compare Tech Stacks" з посиланням на betterstack.tech. | 1 Guest Post | Lead/Content |
| **4** | **Social Signals** | Посів посилання в тематичних гілках Reddit та LinkedIn-групах розробників. | 50+ реферальних переходів | **Влад** |

#### 6.3 - Anchor strategy та правила безпеки

Задати цільовий розподіл анкорів для майбутніх посилань:

| Тип анкору | Цільова частка |
|------------|----------------|
| Branded    | 50-75%         |
| Partial    | 20-30%         |
| Exact      | 10-15%         |
| Generic    | 5%             |
| URL/Naked  | 0%             |

короткі правила:

1. Не використовувати голі URL як анкори  
2. Не використовувати неінформативні generic анкори («тут», «читати», «детальніше», «перейти»)  
3. Анкор повинен точно описувати цільову сторінку  
4. Уникати масового повторення одного й того ж анкору  
5. Працювати тільки з тематично релевантними внутрішніми сторінками  
6. Щомісяця проводити ревізію розподілу внутрішніх анкорів



---

### Результати для звіту

```
1. Google Sheets з мінімум 5 аркушами:
   - Technical Audit
   - Fix Log
   - Speed Baseline + After
   - Backlink Audit
   - Link Strategy (Gap + 30-day plan)

2. Таблиця знайдених технічних проблем і пріоритезація
3. Налаштовані `robots.txt` і `sitemap.xml` + підтвердження відправки sitemap у GSC
4. Таблиця виправлених проблем (мін. 6) з доказами до/після
5. Показники Core Web Vitals до/після оптимізації (мін. 2 URL)
6. Список впроваджених оптимізацій швидкості (мін. 4)
7. Backlink аналіз мінімум 15 посилань з оцінкою якості (або конкурентний benchmark, якщо власних даних недостатньо)
8. Backlink gap таблиця з мін. 20 можливостями
9. Link strategy на 30 днів (тижневий план + KPI)
10. Короткий висновок: що дало найбільший SEO-ефект і чому
11. Формат виконання (Варіант A або Варіант B) + обґрунтування
```

---

## Контрольні питання

### Рівень 1 - Розуміння термінів

1. Яка різниця між `crawling`, `indexing` та `rendering` і чому це важливо для технічного SEO?
2. Чому canonical є "сильною рекомендацією", а не абсолютною командою для Google?
3. Які порогові значення для LCP, INP і CLS вважаються хорошими?
4. У чому різниця між `301`, `302`, `404`, `410` і коли який код варто використовувати?
5. Чим відрізняються природні (natural) і аутріч-посилання (outreach links)?

### Рівень 2 - Аналіз

6. У sitemap знайдено URL зі статусами 3xx і 404. Які ризики це створює для індексації?  
 
- Googlebot витрачає crawl budget на неіснуючі/перенаправлені URL.  
- 404 сигналізує про погану якість сайту → зниження довіри.  
- 3xx (особливо ланцюжки) втрачає link equity і затримує індексацію корисних сторінок.  
- Результат: повільніше індексування пріоритетних сторінок + можливе зниження ранжування.

7. Сторінка має хороший контент, але LCP = 4.2s на Mobile. Які три технічні причини найімовірніші?  

- Повільний TTFB (сервер/база/відсутність кешу).  
- Неоптимізовані великі зображення (без WebP, srcset, lazy-load).  
- Render-blocking JS/CSS (критичні ресурси блокують рендеринг).

8. Чому різкий ріст exact-match анкорів може підвищувати ризик санкцій?  

Google розцінює це як маніпуляцію (over-optimization). Різкий сплеск точних анкорів виглядає неприродно → тригерить SpamBrain / manual actions / algorithmic demotion.

9. Поясніть, як помилки у mobile-версії (контент-паритет, повільне меню, важкі pop-up) впливають на SEO при mobile-first indexing.  

- Відсутність контент-паритету → Google індексує біднішу mobile-версію → втрата трафіку.  
- Повільне меню + важкі pop-up → погані Core Web Vitals (LCP/INP/CLS) → зниження ранжування.  
- Google crawls і ранжує тільки mobile-версію → всі помилки безпосередньо б’ють по позиціях.

10. У проєкті є багато фільтрів каталогу (`?sort=`, `?brand=`, `?price=`). Як зменшити ризик роздування індексу?  
 
- Поставити `rel="canonical"` на головну категорію.  
- Додати `<meta name="robots" content="noindex">` або X-Robots-Tag: noindex на всі параметри.  
- У robots.txt: `Disallow: /*?sort=` (та інші параметри).  
- У GSC → URL Parameters вказати «No: Doesn’t affect content».  
- Закрити через JS (history.pushState) або серверний редирект 301 на чисту URL при застосуванні фільтрів.

### Рівень 3 - Синтез та висновки

11. Сформуйте пріоритетний backlog із 5 задач після аудиту: що робити першими і чому саме в такому порядку?
12. Запропонуйте план, як утримувати Core Web Vitals без регресій після кожного релізу.
13. Порівняйте дві стратегії: швидке нарощування великої кількості дешевих лінків vs повільний white-hat лінкбілдінг. Які коротко- і довгострокові наслідки?
14. Якщо команда має лише 1 місяць і обмежений ресурс, що дасть більший ефект: технічні виправлення чи зовнішня оптимізація? Обґрунтуйте для вашого проєкту.

---

## Критерії оцінювання

| Завдання                                                | Балів  |
|---------------------------------------------------------|--------|
| Технічний аудит + налаштування robots/sitemap/canonical | 2      |
| Виправлення технічних помилок (мін. 6)                  | 3      |
| Аналіз швидкості (baseline для 2 URL, mobile + desktop) | 1      |
| Оптимізація Core Web Vitals (мін. 4 зміни, до/після)    | 2      |
| Аналіз backlink профілю (мін. 15 посилань або benchmark) | 1      |
| Backlink gap + link strategy на 30 днів                 | 1      |
| **Разом**                                               | **10** |
