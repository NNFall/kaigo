# kAIgo

kAIgo - продакшен-сайт-портфолио AI-разработчика, который делает автоматизацию бизнеса, голосовых ассистентов, AI-чат-ботов и кастомные AI-интеграции.

![Главный экран kAIgo](https://kaigo.online/docs/screenshots/home-hero.png)

## Сайт

- Продакшен: [https://kaigo.online](https://kaigo.online)
- Подробный дизайн-обзор: [docs/DESIGN_WALKTHROUGH.md](docs/DESIGN_WALKTHROUGH.md)

## Что Внутри

- Лендинг с анимированным particle-фоном, typing-effect hero, секциями услуг, каруселью проектов, преимуществами, отзывами, контактной формой и плавающим AI-виджетом.
- Страница «Обо мне» с позиционированием, подходом к работе, метриками опыта, компетенциями и CTA для связи.
- Страница проектов с фильтрами, статусами, тегами и переходами в подробные кейсы.
- Детальные страницы проектов с задачей, решением, стеком технологий, результатами и навигацией между кейсами.
- Auth и admin-маршруты на базе Supabase.

## Скриншоты

### Главная

![Секция навыков](https://kaigo.online/docs/screenshots/home-skills.png)

### Проекты

![Страница проектов](https://kaigo.online/docs/screenshots/projects-page.png)

### AI-Виджет

![AI-виджет](https://kaigo.online/docs/screenshots/ai-widget.png)

Больше скриншотов и описание каждого раздела есть в [docs/DESIGN_WALKTHROUGH.md](docs/DESIGN_WALKTHROUGH.md).

## Технологии

- Vite
- React 18
- TypeScript
- React Router
- Tailwind CSS
- shadcn/ui и Radix UI
- lucide-react
- Supabase Auth, Database и Edge Functions
- Recharts для аналитики в админке

## Локальный Запуск

```sh
npm install
npm run dev
```

Dev-сервер Vite настроен на порт `8080`.

## Продакшен-Сборка

```sh
npm run build
npm run preview
```

Собранный сайт появляется в `dist/`.

## Основные Маршруты

- `/` - главная страница
- `/about` - страница «Обо мне»
- `/projects` - портфолио проектов
- `/project/:id` - детальная страница проекта
- `/auth` - вход, регистрация и сброс пароля
- `/login` - вход в админку
- `/admin` - админ-панель и управление сайтом

## Интеграции

- Supabase Auth для сессий и проверки ролей.
- Supabase-таблицы для заявок, AI-настроек, истории диалогов, сообщений и профилей.
- Supabase Edge Functions для AI-чата, голосовой транскрибации и отправки контактных email.
- VseGPT/OpenAI-compatible конфигурация модели для AI-ассистента сайта.
