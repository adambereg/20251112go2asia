# Go2Asia — UI/UX Style Guide v1.1 (Atlas Asia baseline)

> Цель: обеспечить единый визуальный язык и UX‑паттерны для всех модулей (Atlas, Space, Pulse, Blog, Connect, Russian Friendly, Quest, Rielt.Market и др.) на базе стилистики Atlas Asia.

---

## 1) Дизайн‑система: Design Tokens

### 1.1 Цвета

**Brand/Primary:**
- Base: `#1677FF` (`bg-sky-600`)
- Hover: `#186ae0` (`bg-sky-700`)
- Light: `#E0F2FE` (`bg-sky-100`)
- Text on Light: `#0369A1` (`text-sky-700`)

**Semantic Colors:**
- **Success**: `#16A34A` (`bg-green-600`)
- **Warning**: `#F59E0B` (`bg-amber-500`)
- **Danger**: `#EF4444` (`bg-red-500`)
- **Info**: `#06B6D4` (`bg-cyan-500`)

**Text Hierarchy:**
- Primary: `#0F172A` (`text-slate-900`)
- Secondary: `#475569` (`text-slate-600`)
- Muted: `#94A3B8` (`text-slate-400`)
- On Primary: `#FFFFFF` (`text-white`)

**Backgrounds:**
- Base: `#F8FAFC` (`bg-slate-50`)
- Surface: `#FFFFFF` (`bg-white`)
- Hover: `#F1F5F9` (`bg-slate-100`)

**Borders:**
- Soft: `#E2E8F0` (`border-slate-200`)
- Medium: `#CBD5E1` (`border-slate-300`)
- Focus: `#1677FF` (`border-sky-600`)
- Hover: `#7DD3FC` (`border-sky-300`)

**Badges (специализированные):**
- UGC: `bg-sky-100 text-sky-700`
- Verified/Curator: `bg-green-100 text-green-700`
- Editor: `bg-purple-100 text-purple-700`
- Russian Friendly: `bg-blue-100 text-blue-700`
- New: `bg-amber-100 text-amber-700`
- Popular: `bg-rose-100 text-rose-700`
- Has Prices: `bg-emerald-50 text-emerald-600`
- Has Dates: `bg-orange-50 text-orange-600`
- Has Photos: `bg-violet-50 text-violet-600`

> **Dark mode**: авто‑инверсия по скейлу (Text ↔ BG, границы +40 контраста), Primary сохраняем.

### 1.2 Типографика

**Размеры и высоты строк:**
- **Display**: `text-3xl` (30px) / `leading-tight` (1.25), `font-bold`
- **H1**: `text-2xl` (24px) / `leading-8` (32px), `font-bold`
- **H2**: `text-xl` (20px) / `leading-7` (28px), `font-semibold`
- **H3**: `text-lg` (18px) / `leading-6` (24px), `font-medium`
- **Body**: `text-base` (16px) / `leading-6` (24px), `font-normal`
- **Small**: `text-sm` (14px) / `leading-5` (20px), `font-normal`
- **Tiny**: `text-xs` (12px) / `leading-4` (16px), `font-normal`
- **Mono** (коды, даты): `text-sm font-mono`

**Шрифты:**
```css
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI',
             system-ui, sans-serif;
```

**Применение:**
- Заголовки страниц: H1 + text-slate-900
- Подзаголовки секций: H2 + text-slate-700
- Карточки: H3 для title + text-base для excerpt
- Мета-информация: text-sm + text-slate-500
- Бейджи и чипы: text-xs + font-medium

### 1.3 Радиусы и тени

**Border Radius:**
- **xs**: `rounded` (4px) — инпуты, мелкие элементы
- **sm**: `rounded-lg` (8px) — кнопки, мелкие карточки
- **md**: `rounded-xl` (12px) — основные карточки
- **lg**: `rounded-2xl` (16px) — крупные карточки, модалы
- **full**: `rounded-full` — бейджи, аватары, pill-кнопки

**Box Shadow:**
```css
/* Card default */
shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05)
border: 1px solid #E2E8F0

/* Card hover */
shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.1),
           0 4px 6px -2px rgba(15, 23, 42, 0.05)

/* Overlay/Modal */
shadow-xl: 0 20px 25px -5px rgba(15, 23, 42, 0.1),
           0 10px 10px -5px rgba(15, 23, 42, 0.04)

/* Focused элементы */
ring-2 ring-sky-500 ring-offset-2
```

**Tailwind классы:**
```jsx
// Карточка
<div className="bg-white rounded-xl border border-slate-200 shadow-sm
                hover:shadow-lg hover:border-sky-300
                transition-all duration-200">

// Кнопка Primary
<button className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg
                   shadow-sm hover:shadow-md transition-all">

// Модал
<div className="bg-white rounded-2xl shadow-xl">
```

### 1.4 Отступы и сетка

**Spacing Scale (Tailwind):**
- 1: 4px
- 1.5: 6px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px
- 16: 64px
- 20: 80px

**Container:**
- Max width: `max-w-7xl` (1280px)
- Gutters: `px-4 sm:px-6 lg:px-8`
- Centered: `mx-auto`

**Grid системы:**
```jsx
// Desktop: 3 колонки
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Tablet: 2 колонки
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

// Cards плотная сетка
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

### 1.5 Адаптивные брейкпоинты

**Tailwind breakpoints:**
- **Mobile**: `< 640px` (default, no prefix)
- **Tablet**: `sm: 640px` до `md: 768px`
- **Desktop**: `lg: 1024px+`
- **Wide**: `xl: 1280px+`, `2xl: 1536px+`

**Типичные паттерны:**
```jsx
// Скрытие на мобиле
<div className="hidden lg:block">

// Разные размеры
<h1 className="text-xl md:text-2xl lg:text-3xl">

// Адаптивные отступы
<div className="p-4 md:p-6 lg:p-8">

// Grid адаптация
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

---

## 2) Базовые компоненты (универсальные)

### 2.1 Icons (Lucide React)

**Размеры:**
- Tiny: `size={12}` `w-3 h-3` — в мелких бейджах
- Small: `size={14}` `w-3.5 h-3.5` — в бейджах, тегах
- Default: `size={20}` `w-5 h-5` — основной размер
- Medium: `size={24}` `w-6 h-6` — заголовки, кнопки
- Large: `size={32}` `w-8 h-8` — hero секции

**Цвета:**
- Primary action: `text-sky-600`
- Secondary action: `text-slate-600`
- Muted/inactive: `text-slate-400`
- Success: `text-green-600`
- Danger: `text-red-500`

**Используемые иконки:**
```tsx
// Navigation
import { MapPin, Users, Globe, BookOpen, MessageSquare,
         Calendar, Building, Compass } from 'lucide-react';

// Actions
import { Heart, Bookmark, Eye, Share2, ExternalLink,
         ChevronRight, ArrowLeft } from 'lucide-react';

// States
import { CheckCircle2, AlertCircle, Info, Clock,
         TrendingUp, Award } from 'lucide-react';

// Filters & Controls
import { Filter, Search, SlidersHorizontal, X,
         ChevronDown } from 'lucide-react';

// Content Types
import { Image, FileText, Video, Link2, MapPinned } from 'lucide-react';
```

**Примеры использования:**
```tsx
// С текстом
<span className="flex items-center gap-1.5 text-sm text-slate-500">
  <Clock size={14} />
  <span>Обновлено 2 дня назад</span>
</span>

// Кнопка-иконка
<button className="p-2 text-slate-400 hover:text-sky-600 transition-colors">
  <Heart size={20} />
</button>

// Статус индикатор
<div className="flex items-center gap-2">
  <CheckCircle2 size={16} className="text-green-600" />
  <span className="text-sm text-green-700">Проверено редакцией</span>
</div>
```

### 2.2 TopAppBar (Navigation)

**Структура:**
```tsx
<header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Globe className="w-8 h-8 text-sky-600" />
        <span className="text-xl font-bold">Go2Asia</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <a className="text-slate-600 hover:text-sky-600">Atlas</a>
        <a className="text-slate-600 hover:text-sky-600">Space</a>
        {/* ... */}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="p-2">
          <Search size={20} />
        </button>
        <Avatar />
      </div>
    </div>
  </div>
</header>
```

**Scroll behavior:**
```tsx
// Уменьшение при скролле
const [isScrolled, setIsScrolled] = useState(false);

<header className={`sticky top-0 transition-all ${
  isScrolled ? 'h-14 shadow-md' : 'h-16 shadow-sm'
}`}>
```

### 2.3 Card (универсальная)

**Базовая структура:**
```tsx
<article className="bg-white rounded-xl border border-slate-200
                    shadow-sm hover:shadow-lg hover:border-sky-300
                    hover:-translate-y-1 transition-all duration-200
                    overflow-hidden group">

  {/* Cover Image (опционально) */}
  {coverImage && (
    <div className="aspect-video overflow-hidden">
      <img
        src={coverImage}
        className="w-full h-full object-cover group-hover:scale-105
                   transition-transform duration-300"
      />
    </div>
  )}

  {/* Content */}
  <div className="p-5">
    {/* Badges */}
    <div className="flex flex-wrap gap-2 mb-3">
      <Badge variant="ugc">UGC</Badge>
      <Badge variant="verified">Проверено куратором</Badge>
    </div>

    {/* Title */}
    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2
                   group-hover:text-sky-600 transition-colors">
      {title}
    </h3>

    {/* Excerpt */}
    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
      {excerpt}
    </p>

    {/* Tags */}
    <div className="flex flex-wrap gap-1.5 mb-4">
      {tags.slice(0, 3).map(tag => (
        <Chip key={tag} size="sm">{tag}</Chip>
      ))}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between pt-3
                    border-t border-slate-100">
      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Heart size={14} />
          {likesCount}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} />
          {viewsCount}
        </span>
      </div>

      {/* CTA */}
      <button className="text-sm font-medium text-sky-600
                         hover:text-sky-700">
        Читать →
      </button>
    </div>
  </div>
</article>
```

**Варианты:**
```tsx
// Компактная (для списков)
<Card variant="compact" className="p-4" />

// С боковым изображением
<Card layout="horizontal" />

// Без тени (в группах)
<Card elevation="none" />
```

### 2.4 Badge (статусы и метки)

**Компонент:**
```tsx
interface BadgeProps {
  variant: 'ugc' | 'verified' | 'editor' | 'russian-friendly' |
           'new' | 'popular' | 'prices' | 'dates' | 'photos';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Badge = ({ variant, size = 'md', icon, children }: BadgeProps) => {
  const variants = {
    ugc: 'bg-sky-100 text-sky-700',
    verified: 'bg-green-100 text-green-700',
    editor: 'bg-purple-100 text-purple-700',
    'russian-friendly': 'bg-blue-100 text-blue-700',
    new: 'bg-amber-100 text-amber-700',
    popular: 'bg-rose-100 text-rose-700',
    prices: 'bg-emerald-50 text-emerald-600',
    dates: 'bg-orange-50 text-orange-600',
    photos: 'bg-violet-50 text-violet-600'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-medium
      ${variants[variant]} ${sizes[size]}
    `}>
      {icon}
      {children}
    </span>
  );
};
```

**Использование:**
```tsx
<Badge variant="ugc">UGC</Badge>
<Badge variant="verified" icon={<CheckCircle2 size={12} />}>
  Проверено куратором
</Badge>
<Badge variant="prices" size="sm" icon={<Coins size={12} />}>
  Есть цены
</Badge>
```

### 2.5 Chip (фильтры и теги)

**Компонент:**
```tsx
interface ChipProps {
  selected?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
  onRemove?: () => void;
  children: React.ReactNode;
}

const Chip = ({ selected, size = 'md', onClick, onRemove, children }: ChipProps) => (
  <button
    onClick={onClick}
    className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      transition-all duration-150
      ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'}
      ${selected
        ? 'bg-sky-600 text-white shadow-sm'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }
    `}
  >
    {children}
    {onRemove && (
      <X
        size={size === 'sm' ? 12 : 14}
        className="hover:text-red-500"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
      />
    )}
  </button>
);
```

**Использование:**
```tsx
// Фильтры
<div className="flex flex-wrap gap-2">
  <Chip selected={activeFilter === 'all'} onClick={() => setFilter('all')}>
    Все
  </Chip>
  <Chip selected={activeFilter === 'verified'} onClick={() => setFilter('verified')}>
    Проверенные
  </Chip>
</div>

// Теги (только отображение)
<div className="flex flex-wrap gap-1.5">
  {tags.map(tag => (
    <Chip key={tag} size="sm">{tag}</Chip>
  ))}
</div>

// С удалением
<Chip selected onRemove={() => removeTag(tag)}>
  {tag}
</Chip>
```

### 2.6 Tabs (навигация по контенту)

**Структура:**
```tsx
<div className="border-b border-slate-200">
  <nav className="flex gap-8 px-4 -mb-px overflow-x-auto">
    <button className={`
      py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap
      transition-colors
      ${active
        ? 'border-sky-600 text-sky-600'
        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
      }
    `}>
      Обзор
    </button>
    {/* ... остальные табы */}
  </nav>
</div>

{/* Content */}
<div className="p-4 md:p-6">
  {activeTabContent}
</div>
```

**Sticky tabs (на детальных страницах):**
```tsx
<div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
  <Tabs />
</div>
```

### 2.7 Pagination

**Load More pattern (рекомендуемый):**
```tsx
<div className="mt-8 text-center">
  <button
    onClick={loadMore}
    disabled={loading || !hasMore}
    className="px-6 py-3 bg-sky-600 text-white rounded-lg
               hover:bg-sky-700 disabled:bg-slate-300
               disabled:cursor-not-allowed transition-colors"
  >
    {loading ? (
      <span className="flex items-center gap-2">
        <LoadingSpinner size={16} />
        Загрузка...
      </span>
    ) : hasMore ? (
      'Показать ещё'
    ) : (
      'Всё загружено'
    )}
  </button>
</div>
```

**Infinite scroll (desktop):**
```tsx
const [ref, inView] = useInView({
  threshold: 0.5,
  triggerOnce: false
});

useEffect(() => {
  if (inView && hasMore && !loading) {
    loadMore();
  }
}, [inView]);

return (
  <>
    {items.map(item => <Card key={item.id} {...item} />)}
    {hasMore && <div ref={ref} className="h-20" />}
  </>
);
```

### 2.8 Empty States

**Компонент:**
```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="text-center py-12 px-4">
    {icon && (
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-slate-100
                        flex items-center justify-center text-slate-400">
          {icon}
        </div>
      </div>
    )}

    <h3 className="text-lg font-semibold text-slate-900 mb-2">
      {title}
    </h3>

    {description && (
      <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
    )}

    {action && (
      <button
        onClick={action.onClick}
        className="px-4 py-2 bg-sky-600 text-white rounded-lg
                   hover:bg-sky-700 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);
```

**Варианты:**
```tsx
// Нет постов
<EmptyState
  icon={<MessageSquare size={32} />}
  title="Пока нет постов"
  description="Станьте первым, кто поделится опытом"
  action={{ label: 'Создать пост', onClick: createPost }}
/>

// Нет результатов поиска
<EmptyState
  icon={<Search size={32} />}
  title="Ничего не найдено"
  description="Попробуйте изменить параметры поиска"
/>

// Нет сохранённых
<EmptyState
  icon={<Bookmark size={32} />}
  title="Нет сохранённых постов"
  description="Сохраняйте интересные материалы для быстрого доступа"
/>
```

### 2.9 Skeleton Loaders

**Grid Skeleton:**
```tsx
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
    <div className="flex gap-2 mb-3">
      <div className="h-5 w-16 bg-slate-200 rounded-full" />
      <div className="h-5 w-24 bg-slate-200 rounded-full" />
    </div>
    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-slate-200 rounded w-full mb-2" />
    <div className="h-4 bg-slate-200 rounded w-5/6 mb-4" />
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-slate-200 rounded-full" />
      <div className="h-6 w-20 bg-slate-200 rounded-full" />
    </div>
    <div className="h-10 bg-slate-200 rounded" />
  </div>
);

const LoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
```

**Detail Page Skeleton:**
```tsx
const SkeletonDetail = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-slate-200 rounded w-2/3 mb-4" />
    <div className="flex gap-2 mb-6">
      <div className="h-5 w-20 bg-slate-200 rounded-full" />
      <div className="h-5 w-24 bg-slate-200 rounded-full" />
    </div>
    <div className="space-y-3 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded" />
      ))}
      <div className="h-4 bg-slate-200 rounded w-5/6" />
    </div>
  </div>
);
```

### 2.10 Toast Notifications

**Компонент:**
```tsx
interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

const Toast = ({ type, message, onClose }: ToastProps) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800'
  };

  const icons = {
    success: <CheckCircle2 size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertCircle size={20} />
  };

  return (
    <div className={`
      fixed top-20 right-4 z-50 max-w-sm
      flex items-start gap-3 p-4 rounded-lg border shadow-lg
      animate-slide-in
      ${styles[type]}
    `}>
      {icons[type]}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};
```

---

## 3) Шаблоны страниц

### 3.1 List Page (Списки)

**Структура:**
```tsx
<div className="min-h-screen bg-slate-50">
  {/* Header */}
  <div className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Страны Азии
      </h1>
      <p className="text-slate-600">
        Гайды, советы и истории про жизнь в Азии от сообщества
      </p>
    </div>
  </div>

  {/* Filters */}
  <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-wrap gap-2">
        <Chip selected>Все</Chip>
        <Chip>Проверенные</Chip>
        <Chip>С ценами</Chip>
        {/* ... */}
      </div>
    </div>
  </div>

  {/* Content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {loading ? (
      <LoadingGrid />
    ) : items.length > 0 ? (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <Card key={item.id} {...item} />
          ))}
        </div>
        <Pagination />
      </>
    ) : (
      <EmptyState />
    )}
  </div>
</div>
```

### 3.2 Detail Page (Детальная)

**Структура:**
```tsx
<div className="min-h-screen bg-slate-50">
  {/* Hero */}
  <div className="bg-white border-b border-slate-200">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
        <a href="/" className="hover:text-sky-600">Atlas</a>
        <ChevronRight size={16} />
        <a href="/countries" className="hover:text-sky-600">Страны</a>
        <ChevronRight size={16} />
        <span className="text-slate-900">Таиланд</span>
      </nav>

      {/* Title & Meta */}
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Таиланд
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="verified">Проверено редакцией</Badge>
        <Badge variant="popular">Популярное</Badge>
      </div>

      <div className="flex items-center gap-6 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <Clock size={14} />
          Обновлено 2 дня назад
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} />
          1,234 просмотра
        </span>
      </div>
    </div>
  </div>

  {/* Tabs */}
  <div className="sticky top-16 z-40 bg-white border-b border-slate-200">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Tabs />
    </div>
  </div>

  {/* Content */}
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Editorial Content */}
    <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
      <article className="prose prose-slate max-w-none">
        {content}
      </article>
    </section>

    {/* UGC Posts */}
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Посты сообщества
      </h2>
      <CommunityPosts context={{ type: 'country', id: countryId }} />
    </section>

    {/* Related */}
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Связанные материалы
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedItems.map(item => (
          <Card key={item.id} {...item} variant="compact" />
        ))}
      </div>
    </section>
  </div>
</div>
```

### 3.3 Form Page (Создание/Редактирование)

**Layout:**
```tsx
<div className="min-h-screen bg-slate-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Steps TOC (левая колонка) */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold mb-4">Шаги</h3>
          <nav className="space-y-2">
            <button className={`
              w-full text-left px-3 py-2 rounded-lg text-sm
              ${activeStep === 1
                ? 'bg-sky-100 text-sky-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
              }
            `}>
              1. Основная информация
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              2. Контент
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              3. Медиа
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              4. Публикация
            </button>
          </nav>

          {/* Quality Checklist */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="font-medium text-sm mb-3">Чеклист качества</h4>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 size={16} className="text-green-600" />
                Заголовок ≤ 80 символов
              </label>
              <label className="flex items-center gap-2 text-slate-400">
                <Circle size={16} />
                Лид-абзац добавлен
              </label>
              <label className="flex items-center gap-2 text-slate-400">
                <Circle size={16} />
                Изображение добавлено
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Form (центр) */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <form className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Заголовок
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg
                           focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                           transition-colors"
                placeholder="Введите заголовок..."
              />
              <p className="text-xs text-slate-500 mt-1">
                42 / 80 символов
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Краткое описание
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg
                           focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                           transition-colors resize-none"
                placeholder="1-2 предложения..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Теги
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Chip selected onRemove={() => {}}>visa</Chip>
                <Chip selected onRemove={() => {}}>thailand</Chip>
              </div>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="Добавить тег..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
              <button
                type="submit"
                className="px-6 py-2 bg-sky-600 text-white rounded-lg
                           hover:bg-sky-700 transition-colors"
              >
                Опубликовать
              </button>
              <button
                type="button"
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg
                           hover:bg-slate-50 transition-colors"
              >
                Сохранить черновик
              </button>
              <span className="text-xs text-slate-500 ml-auto">
                Автосохранение 2 мин назад
              </span>
            </div>

          </form>
        </div>
      </div>

    </div>
  </div>
</div>
```

---

## 4) Паттерны контента для модулей

### 4.1 Atlas Asia (Справочник)

**Иерархия:**
```
Countries → Cities → Places → Guides → Topics
     ↓         ↓        ↓        ↓        ↓
         User-Generated Posts (UGC)
```

**Структура детальной страницы:**

1. **Hero Section** — название, мета, бейджи
2. **Tabs** — Обзор, Визы, Жильё, Транспорт, Работа, Культура, Бизнес
3. **Editorial Content** (редакционный блок):
   - TL;DR (краткая суть)
   - Факты и цифры
   - Структурированный контент с подзаголовками
   - Источники и даты актуальности
4. **Community Posts** (UGC блок):
   - Заголовок "Посты сообщества"
   - Фильтры (Все / Новые / Полезные)
   - Карточки постов с бейджами
   - Пагинация
5. **Related** — связанные города, места, гайды

**UGC карточка (детально):**
```tsx
<article className="bg-white rounded-xl border border-slate-200 shadow-sm
                    hover:shadow-lg hover:border-sky-300 transition-all">

  {/* Cover (опционально) */}
  {post.photos?.[0] && (
    <div className="aspect-video overflow-hidden">
      <img
        src={post.photos[0]}
        className="w-full h-full object-cover"
      />
    </div>
  )}

  {/* Content */}
  <div className="p-5">

    {/* Badges Row */}
    <div className="flex flex-wrap gap-2 mb-3">
      <Badge variant="ugc">UGC</Badge>
      {post.verified_by && (
        <Badge variant="verified">
          <CheckCircle2 size={12} />
          Проверено {post.verified_by === 'editor' ? 'редакцией' : 'куратором'}
        </Badge>
      )}
      {post.has_prices && (
        <Badge variant="prices" size="sm">
          <Coins size={12} />
          Цены
        </Badge>
      )}
      {post.has_dates && (
        <Badge variant="dates" size="sm">
          <Calendar size={12} />
          Даты
        </Badge>
      )}
      {post.has_photos && (
        <Badge variant="photos" size="sm">
          <Image size={12} />
          Фото
        </Badge>
      )}
    </div>

    {/* Title */}
    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2
                   hover:text-sky-600 transition-colors">
      {post.title}
    </h3>

    {/* Excerpt */}
    <p className="text-sm text-slate-600 line-clamp-3 mb-3">
      {post.excerpt}
    </p>

    {/* Tags */}
    <div className="flex flex-wrap gap-1.5 mb-4">
      {post.tags.slice(0, 3).map(tag => (
        <Chip key={tag} size="sm">#{tag}</Chip>
      ))}
      {post.tags.length > 3 && (
        <span className="text-xs text-slate-400">+{post.tags.length - 3}</span>
      )}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between pt-3 border-t border-slate-100">

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Heart size={14} />
          {post.likes_count}
        </span>
        <span className="flex items-center gap-1">
          <Bookmark size={14} />
          {post.saves_count}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} />
          {post.views_count}
        </span>
      </div>

      {/* CTA */}
      <button className="text-sm font-medium text-sky-600 hover:text-sky-700
                         flex items-center gap-1">
        Читать
        <ChevronRight size={16} />
      </button>

    </div>
  </div>

</article>
```

**Сортировка постов:**
```typescript
// По умолчанию: score + time decay
ORDER BY (score * 0.7 + time_decay * 0.3) DESC

// Новые
ORDER BY published_at DESC

// Полезные
ORDER BY (likes_count + saves_count * 2) DESC
```

### 4.2 Space Asia (Соцсеть)

**Структура:**

**Feed Page:**
```tsx
<div className="max-w-2xl mx-auto">

  {/* Filters */}
  <div className="sticky top-16 z-40 bg-white border-b border-slate-200 py-3">
    <div className="flex gap-2 overflow-x-auto">
      <Chip selected>Моя лента</Chip>
      <Chip>Друзья</Chip>
      <Chip>Группы</Chip>
      <Chip>Популярное</Chip>
    </div>
  </div>

  {/* Create Post */}
  <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
    <div className="flex items-center gap-3">
      <Avatar size={40} />
      <button className="flex-1 text-left px-4 py-2 bg-slate-50
                         text-slate-500 rounded-full hover:bg-slate-100">
        О чём думаете?
      </button>
    </div>
    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
      <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600">
        <Image size={18} />
        Фото
      </button>
      <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600">
        <MapPin size={18} />
        Место
      </button>
    </div>
  </div>

  {/* Posts Feed */}
  <div className="space-y-4">
    {posts.map(post => (
      <PostCard key={post.id} {...post} />
    ))}
  </div>

</div>
```

**Post Card (Social):**
```tsx
<article className="bg-white rounded-xl border border-slate-200 p-5">

  {/* Header */}
  <div className="flex items-start gap-3 mb-4">
    <Avatar src={post.author.avatar} size={40} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-900 truncate">
          {post.author.display_name}
        </span>
        {post.author.verified && (
          <CheckCircle2 size={16} className="text-sky-600" />
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>{formatTimeAgo(post.created_at)}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          {post.privacy === 'public' ? <Globe size={14} /> : <Users size={14} />}
          {post.privacy === 'public' ? 'Публично' : 'Друзья'}
        </span>
      </div>
    </div>
    <button className="p-1 text-slate-400 hover:text-slate-600">
      <MoreHorizontal size={20} />
    </button>
  </div>

  {/* Content */}
  <div className="mb-4">
    <p className="text-slate-900 whitespace-pre-wrap">{post.content}</p>
    {post.photos && post.photos.length > 0 && (
      <div className="mt-3 rounded-lg overflow-hidden">
        <img src={post.photos[0]} className="w-full" />
      </div>
    )}
  </div>

  {/* Stats */}
  <div className="flex items-center justify-between py-2 border-y border-slate-100 text-sm text-slate-500">
    <span>{post.likes_count} лайков</span>
    <div className="flex items-center gap-3">
      <span>{post.comments_count} комментариев</span>
      <span>{post.shares_count} репостов</span>
    </div>
  </div>

  {/* Actions */}
  <div className="flex items-center justify-around pt-2">
    <button className={`
      flex items-center gap-2 px-4 py-2 rounded-lg
      ${post.is_liked ? 'text-red-600' : 'text-slate-600 hover:bg-slate-50'}
    `}>
      <Heart size={18} fill={post.is_liked ? 'currentColor' : 'none'} />
      Нравится
    </button>
    <button className="flex items-center gap-2 px-4 py-2 text-slate-600
                       hover:bg-slate-50 rounded-lg">
      <MessageSquare size={18} />
      Комментировать
    </button>
    <button className="flex items-center gap-2 px-4 py-2 text-slate-600
                       hover:bg-slate-50 rounded-lg">
      <Share2 size={18} />
      Поделиться
    </button>
  </div>

</article>
```

**Номинация в Atlas/Blog:**
```tsx
// В PostCard добавляется кнопка для PRO пользователей
{user.is_pro && (
  <button className="flex items-center gap-2 px-3 py-1.5 text-sm
                     bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100">
    <Award size={16} />
    Номинировать в Atlas
  </button>
)}

// Modal номинации
<Modal>
  <h3>Куда номинировать пост?</h3>
  <div className="space-y-2">
    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
      <input type="radio" name="target" value="atlas" />
      <div>
        <div className="font-medium">Atlas Asia</div>
        <div className="text-sm text-slate-500">Справочный контент</div>
      </div>
    </label>
    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
      <input type="radio" name="target" value="blog" />
      <div>
        <div className="font-medium">Blog Asia</div>
        <div className="text-sm text-slate-500">Лонгриды и подборки</div>
      </div>
    </label>
  </div>
  <button className="w-full mt-4 bg-sky-600 text-white">
    Отправить на модерацию
  </button>
</Modal>
```

### 4.3 Pulse Asia (События)

**Event Card:**
```tsx
<article className="bg-white rounded-xl border border-slate-200 overflow-hidden
                    hover:shadow-lg hover:border-sky-300 transition-all">

  {/* Date Badge (overlay на cover) */}
  <div className="relative aspect-video overflow-hidden">
    <img src={event.cover} className="w-full h-full object-cover" />
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 text-center">
      <div className="text-2xl font-bold text-slate-900">{event.day}</div>
      <div className="text-xs text-slate-600 uppercase">{event.month}</div>
    </div>
  </div>

  {/* Content */}
  <div className="p-5">

    {/* Category Badge */}
    <Badge variant="info" className="mb-3">
      {event.category}
    </Badge>

    {/* Title */}
    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-3">
      {event.title}
    </h3>

    {/* Meta */}
    <div className="space-y-2 text-sm text-slate-600 mb-4">
      <div className="flex items-center gap-2">
        <Calendar size={16} />
        <span>{formatEventDate(event.start_date, event.end_date)}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={16} />
        <span>{event.location}</span>
      </div>
      {event.price && (
        <div className="flex items-center gap-2">
          <Coins size={16} />
          <span>{event.price}</span>
        </div>
      )}
    </div>

    {/* Attendees */}
    <div className="flex items-center gap-2 mb-4">
      <div className="flex -space-x-2">
        {event.attendees.slice(0, 3).map(user => (
          <Avatar key={user.id} src={user.avatar} size={24} />
        ))}
      </div>
      <span className="text-sm text-slate-600">
        {event.attendees_count} участников
      </span>
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      <button className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg
                         hover:bg-sky-700 transition-colors">
        Участвовать
      </button>
      <button className="p-2 border border-slate-300 rounded-lg
                         hover:bg-slate-50 transition-colors">
        <Share2 size={18} />
      </button>
    </div>

  </div>
</article>
```

**Calendar View:**
```tsx
<div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
  {/* Header */}
  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
    <div key={day} className="bg-slate-50 p-2 text-center text-sm font-medium">
      {day}
    </div>
  ))}

  {/* Days */}
  {days.map(day => (
    <div key={day.date} className={`
      bg-white p-2 min-h-[100px] relative
      ${day.isToday ? 'ring-2 ring-sky-600' : ''}
    `}>
      <div className="text-sm font-medium mb-1">{day.number}</div>
      {day.events.map(event => (
        <div key={event.id} className="text-xs bg-sky-100 text-sky-700
                                        rounded px-1 py-0.5 mb-1 truncate">
          {event.title}
        </div>
      ))}
    </div>
  ))}
</div>
```

### 4.4 Connect Asia (Партнёрства)

**Business Card (Russian Friendly):**
```tsx
<article className="bg-white rounded-xl border border-slate-200 overflow-hidden
                    hover:shadow-lg hover:border-blue-300 transition-all">

  {/* Cover */}
  <div className="relative aspect-[21/9] overflow-hidden">
    <img src={business.cover} className="w-full h-full object-cover" />
    <Badge
      variant="russian-friendly"
      className="absolute top-4 right-4 shadow-lg"
    >
      🇷🇺 Russian Friendly
    </Badge>
  </div>

  {/* Logo Overlay */}
  <div className="px-5 -mt-8 relative z-10">
    <div className="w-16 h-16 rounded-xl bg-white border-2 border-white shadow-lg overflow-hidden">
      <img src={business.logo} className="w-full h-full object-cover" />
    </div>
  </div>

  {/* Content */}
  <div className="p-5 pt-3">

    {/* Title & Category */}
    <h3 className="text-lg font-bold text-slate-900 mb-1">
      {business.name}
    </h3>
    <p className="text-sm text-slate-600 mb-3">{business.category}</p>

    {/* Description */}
    <p className="text-sm text-slate-700 line-clamp-2 mb-4">
      {business.description}
    </p>

    {/* Meta */}
    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
      <span className="flex items-center gap-1">
        <MapPin size={14} />
        {business.city}
      </span>
      <span className="flex items-center gap-1">
        <Star size={14} className="text-amber-500" fill="currentColor" />
        {business.rating}
      </span>
    </div>

    {/* Vouchers */}
    {business.vouchers && business.vouchers.length > 0 && (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm font-medium text-green-700">
          <Tag size={16} />
          Скидка {business.vouchers[0].discount}%
        </div>
        <p className="text-xs text-green-600 mt-1">
          {business.vouchers[0].description}
        </p>
      </div>
    )}

    {/* Actions */}
    <div className="flex gap-2">
      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg
                         hover:bg-blue-700 transition-colors">
        Связаться
      </button>
      <button className="px-4 py-2 border border-slate-300 rounded-lg
                         hover:bg-slate-50 transition-colors">
        <ExternalLink size={18} />
      </button>
    </div>

  </div>
</article>
```

### 4.5 Blog Asia (Лонгриды)

**Article Card:**
```tsx
<article className="bg-white rounded-xl border border-slate-200 overflow-hidden
                    hover:shadow-lg hover:border-sky-300 transition-all">

  {/* Cover */}
  <div className="aspect-[21/9] overflow-hidden">
    <img
      src={article.cover}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
    />
  </div>

  {/* Content */}
  <div className="p-6">

    {/* Type & Reading Time */}
    <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
      <Badge variant="info">{article.type}</Badge>
      <span className="flex items-center gap-1">
        <Clock size={14} />
        {article.reading_time} мин
      </span>
    </div>

    {/* Title */}
    <h2 className="text-xl font-bold text-slate-900 line-clamp-2 mb-3
                   hover:text-sky-600 transition-colors">
      {article.title}
    </h2>

    {/* Excerpt */}
    <p className="text-slate-700 line-clamp-3 mb-4">
      {article.excerpt}
    </p>

    {/* Footer */}
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Avatar src={article.author.avatar} size={32} />
        <div>
          <div className="text-sm font-medium text-slate-900">
            {article.author.name}
          </div>
          <div className="text-xs text-slate-500">
            {formatDate(article.published_at)}
          </div>
        </div>
      </div>

      <button className="text-sky-600 hover:text-sky-700 font-medium">
        Читать →
      </button>
    </div>

  </div>
</article>
```

**Article Detail (Prose):**
```tsx
<article className="prose prose-slate max-w-none
                    prose-headings:font-bold prose-headings:text-slate-900
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-slate-700 prose-p:leading-relaxed
                    prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-900 prose-strong:font-semibold
                    prose-blockquote:border-l-4 prose-blockquote:border-sky-600
                    prose-blockquote:bg-sky-50 prose-blockquote:py-4 prose-blockquote:px-6
                    prose-code:text-sky-600 prose-code:bg-slate-100
                    prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-img:rounded-xl prose-img:shadow-lg">

  {/* TOC для длинных статей */}
  {article.toc && (
    <div className="not-prose bg-slate-50 rounded-xl p-6 mb-8">
      <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase">
        Содержание
      </h3>
      <nav className="space-y-2">
        {article.toc.map((item, i) => (
          <a
            key={i}
            href={`#${item.id}`}
            className="block text-sm text-slate-600 hover:text-sky-600"
          >
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  )}

  {/* Markdown Content */}
  <div dangerouslySetInnerHTML={{ __html: article.html }} />

</article>
```

### 4.6 Quest Asia (Квесты/Челленджи)

**Quest Card:**
```tsx
<article className="bg-white rounded-xl border border-slate-200 overflow-hidden
                    hover:shadow-lg hover:border-purple-300 transition-all">

  {/* Cover with Progress Overlay */}
  <div className="relative aspect-video overflow-hidden">
    <img src={quest.cover} className="w-full h-full object-cover" />

    {/* Progress Badge */}
    {quest.progress > 0 && (
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2">
        <div className="text-xs text-slate-600 mb-1">Прогресс</div>
        <div className="text-lg font-bold text-purple-600">
          {quest.progress}%
        </div>
      </div>
    )}

    {/* Difficulty Badge */}
    <Badge
      variant={quest.difficulty === 'easy' ? 'success' : 'warning'}
      className="absolute top-4 left-4 shadow-lg"
    >
      {quest.difficulty === 'easy' ? 'Легко' : quest.difficulty === 'medium' ? 'Средне' : 'Сложно'}
    </Badge>
  </div>

  {/* Content */}
  <div className="p-5">

    {/* Title */}
    <h3 className="text-lg font-bold text-slate-900 mb-2">
      {quest.title}
    </h3>

    {/* Description */}
    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
      {quest.description}
    </p>

    {/* Meta */}
    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
      <span className="flex items-center gap-1">
        <MapPin size={14} />
        {quest.location}
      </span>
      <span className="flex items-center gap-1">
        <Clock size={14} />
        {quest.duration}
      </span>
      <span className="flex items-center gap-1">
        <Award size={14} />
        +{quest.points} pts
      </span>
    </div>

    {/* Steps Progress */}
    <div className="mb-4">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-slate-700 font-medium">
          {quest.completed_steps} / {quest.total_steps} шагов
        </span>
        <span className="text-slate-500">
          {quest.participants_count} участников
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
          style={{ width: `${quest.progress}%` }}
        />
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      {quest.progress > 0 ? (
        <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg
                           hover:bg-purple-700 transition-colors">
          Продолжить
        </button>
      ) : (
        <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg
                           hover:bg-purple-700 transition-colors">
          Начать квест
        </button>
      )}
      <button className="p-2 border border-slate-300 rounded-lg
                         hover:bg-slate-50 transition-colors">
        <Share2 size={18} />
      </button>
    </div>

  </div>
</article>
```

**Quest Detail (Checklist):**
```tsx
<div className="space-y-3">
  {quest.steps.map((step, index) => (
    <div
      key={step.id}
      className={`
        p-4 rounded-xl border-2 transition-all
        ${step.completed
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-slate-200 hover:border-purple-300'
        }
      `}
    >
      <div className="flex items-start gap-3">

        {/* Checkbox */}
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          flex-shrink-0 transition-all
          ${step.completed
            ? 'bg-green-600 border-green-600'
            : 'border-slate-300'
          }
        `}>
          {step.completed && (
            <CheckCircle2 size={16} className="text-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className={`
            font-semibold mb-1
            ${step.completed ? 'text-green-900 line-through' : 'text-slate-900'}
          `}>
            {index + 1}. {step.title}
          </h4>
          <p className="text-sm text-slate-600 mb-2">
            {step.description}
          </p>

          {/* Actions */}
          {!step.completed && (
            <div className="flex gap-2">
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                Выполнить
              </button>
              {step.location && (
                <a
                  href={step.map_url}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900
                             flex items-center gap-1"
                >
                  <MapPin size={14} />
                  На карте
                </a>
              )}
            </div>
          )}

          {/* Proof (если выполнено) */}
          {step.completed && step.proof_photo && (
            <div className="mt-2">
              <img
                src={step.proof_photo}
                className="w-20 h-20 rounded-lg object-cover border border-green-200"
              />
            </div>
          )}
        </div>

        {/* Points */}
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Очки</div>
          <div className={`
            text-lg font-bold
            ${step.completed ? 'text-green-600' : 'text-slate-400'}
          `}>
            +{step.points}
          </div>
        </div>

      </div>
    </div>
  ))}
</div>

{/* Submit Quest */}
{allStepsCompleted && (
  <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700
                     text-white py-4 rounded-xl font-semibold text-lg
                     hover:from-purple-700 hover:to-purple-800
                     transition-all shadow-lg">
    Завершить квест и получить награду 🏆
  </button>
)}
```

---

## 5) Состояния и доступность

### 5.1 Focus States (клавиатурная навигация)

**Требования:**
- Все интерактивные элементы должны иметь видимый focus ring
- Focus ring: `focus:ring-2 focus:ring-sky-500 focus:ring-offset-2`
- Порядок фокуса логичный (tab index)
- Skip links для навигации

**Примеры:**
```tsx
// Button
<button className="... focus:ring-2 focus:ring-sky-500 focus:outline-none">

// Input
<input className="... focus:ring-2 focus:ring-sky-500 focus:border-sky-500">

// Link
<a className="... focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded">

// Skip link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
             focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border"
>
  Перейти к содержимому
</a>
```

### 5.2 Hover States

**Паттерны:**
```tsx
// Card hover
<div className="
  hover:shadow-lg
  hover:border-sky-300
  hover:-translate-y-1
  transition-all duration-200
">

// Button hover
<button className="
  bg-sky-600
  hover:bg-sky-700
  hover:shadow-md
  transition-all
">

// Link hover
<a className="
  text-slate-600
  hover:text-sky-600
  hover:underline
  transition-colors
">

// Icon button hover
<button className="
  text-slate-400
  hover:text-sky-600
  hover:bg-slate-50
  rounded-lg
  p-2
  transition-all
">
```

### 5.3 Disabled States

```tsx
// Button disabled
<button
  disabled
  className="
    bg-slate-300
    text-slate-500
    cursor-not-allowed
    hover:bg-slate-300
  "
>

// Input disabled
<input
  disabled
  className="
    bg-slate-100
    text-slate-500
    cursor-not-allowed
    border-slate-200
  "
/>
```

### 5.4 Error States

```tsx
// Input with error
<div>
  <input
    className="
      border-red-300
      focus:ring-red-500
      focus:border-red-500
    "
  />
  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
    <AlertCircle size={14} />
    Это поле обязательно
  </p>
</div>

// Form error alert
<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
  <div className="flex gap-3">
    <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-red-900 mb-1">
        Ошибка отправки формы
      </h4>
      <p className="text-sm text-red-700">
        Проверьте заполнение всех обязательных полей
      </p>
    </div>
  </div>
</div>
```

### 5.5 Success States

```tsx
// Success message
<div className="bg-green-50 border border-green-200 rounded-lg p-4">
  <div className="flex gap-3">
    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-green-900 mb-1">
        Успешно сохранено
      </h4>
      <p className="text-sm text-green-700">
        Ваш пост опубликован и виден другим пользователям
      </p>
    </div>
  </div>
</div>
```

### 5.6 Контрастность (WCAG AA/AAA)

**Требования:**
- Текст ≥16px: контраст ≥4.5:1 (AA)
- Текст <16px: контраст ≥7:1 (AAA для критичного)
- Иконки и UI элементы: ≥3:1

**Проверенные комбинации:**
```css
/* AA Compliant */
text-slate-900 на bg-white          (16.1:1) ✅
text-slate-600 на bg-white          (7.5:1)  ✅
text-sky-700 на bg-sky-100          (4.7:1)  ✅
text-green-700 на bg-green-100      (5.2:1)  ✅

/* Fail (избегать) */
text-slate-400 на bg-white          (2.8:1)  ❌ (только для secondary info)
text-sky-300 на bg-white            (2.1:1)  ❌
```

---

## 6) Анимации (микро‑взаимодействия)

### 6.1 Базовые transitions

**Tailwind config:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        DEFAULT: '200ms'
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  }
}
```

**Применение:**
```tsx
// Default transition (200ms)
<div className="transition-all">

// Specific properties
<div className="transition-colors duration-150">
<div className="transition-transform duration-300">
<div className="transition-opacity duration-200">

// Hover effects
<button className="
  transform
  transition-all
  hover:scale-105
  active:scale-95
">
```

### 6.2 Card animations

```tsx
<article className="
  group
  hover:shadow-lg
  hover:border-sky-300
  hover:-translate-y-1
  transition-all
  duration-200
">
  {/* Image zoom on card hover */}
  <img className="
    transition-transform
    duration-300
    group-hover:scale-105
  " />
</article>
```

### 6.3 Loading animations

**Spinner:**
```tsx
const Spinner = ({ size = 20 }: { size?: number }) => (
  <svg
    className="animate-spin"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
```

**Skeleton shimmer:**
```css
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.animate-shimmer {
  animation: shimmer 1.2s ease-in-out infinite;
  background: linear-gradient(
    to right,
    #f8fafc 0%,
    #e2e8f0 20%,
    #f8fafc 40%,
    #f8fafc 100%
  );
  background-size: 800px 104px;
}
```

### 6.4 Entrance animations

```css
/* Fade in up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

/* Slide in from right (modals) */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}
```

**Usage:**
```tsx
// Stagger list items
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-fade-in-up"
    style={{ animationDelay: `${i * 50}ms` }}
  >
    <Card {...item} />
  </div>
))}
```

### 6.5 Interactive feedback

```tsx
// Button press
<button className="
  active:scale-95
  transition-transform
">

// Like button
<button
  onClick={handleLike}
  className={`
    transition-all
    ${isLiked ? 'scale-110' : 'scale-100'}
  `}
>
  <Heart
    className={isLiked ? 'fill-current text-red-500' : ''}
  />
</button>

// Save button with success feedback
const [saved, setSaved] = useState(false);

<button
  onClick={() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }}
  className={`
    transition-all
    ${saved ? 'text-green-600 scale-110' : 'text-slate-400'}
  `}
>
  <Bookmark className={saved ? 'fill-current' : ''} />
</button>
```

---

## 7) UGC‑блоки (универсальный компонент)

### 7.1 Компонент CommunityPosts

```tsx
interface CommunityPostsProps {
  context: {
    type: 'country' | 'city' | 'place' | 'guide' | 'theme' | 'topic';
    id: string;
    tab?: string; // optional: 'overview' | 'visa' | 'housing' | etc.
  };
  filters?: {
    verified?: boolean;
    hasPrices?: boolean;
    hasDates?: boolean;
    hasPhotos?: boolean;
  };
  limit?: number;
  sort?: 'relevant' | 'recent' | 'popular';
}

const CommunityPosts = ({
  context,
  filters = {},
  limit = 9,
  sort = 'relevant'
}: CommunityPostsProps) => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [activeSort, setActiveSort] = useState(sort);

  // Fetch posts
  const fetchPosts = async (cursor?: string) => {
    const query = supabase
      .from('posts')
      .select('*')
      .eq('context_type', context.type)
      .eq('context_id', context.id)
      .eq('status', 'published')
      .in('verified_by', ['curator', 'editor']);

    // Apply filters
    if (filters.verified) {
      query.eq('verified_by', 'editor');
    }
    if (filters.hasPrices) {
      query.eq('has_prices', true);
    }
    if (filters.hasDates) {
      query.eq('has_dates', true);
    }
    if (filters.hasPhotos) {
      query.eq('has_photos', true);
    }

    // Apply sorting
    switch (activeSort) {
      case 'recent':
        query.order('published_at', { ascending: false });
        break;
      case 'popular':
        query.order('likes_count', { ascending: false });
        break;
      case 'relevant':
      default:
        // Score-based sorting (implement custom logic)
        query.order('score', { ascending: false });
        break;
    }

    query.limit(limit);
    if (cursor) {
      query.gt('id', cursor);
    }

    const { data, error } = await query;

    if (!error && data) {
      setPosts(prev => cursor ? [...prev, ...data] : data);
      setHasMore(data.length === limit);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [context, filters, activeSort]);

  return (
    <section>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Посты сообщества
        </h2>

        {/* Sort Filters */}
        <div className="flex gap-2">
          <Chip
            selected={activeSort === 'relevant'}
            onClick={() => setActiveSort('relevant')}
          >
            Релевантные
          </Chip>
          <Chip
            selected={activeSort === 'recent'}
            onClick={() => setActiveSort('recent')}
          >
            Новые
          </Chip>
          <Chip
            selected={activeSort === 'popular'}
            onClick={() => setActiveSort('popular')}
          >
            Полезные
          </Chip>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingGrid />
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => fetchPosts(posts[posts.length - 1].id)}
                className="px-6 py-3 bg-sky-600 text-white rounded-lg
                           hover:bg-sky-700 transition-colors"
              >
                Показать ещё
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<MessageSquare size={32} />}
          title="Пока нет постов"
          description="Станьте первым, кто поделится опытом"
        />
      )}

    </section>
  );
};
```

### 7.2 Размещение UGC-блоков

**Правила:**
1. UGC блок **всегда ниже** редакционного контента
2. На детальных страницах: после основного контента, перед Related
3. Отступ от предыдущего блока: `mt-12` или `mt-16`
4. Контейнер: такой же как у основного контента

**Примеры размещения:**

```tsx
// Country Detail Page
<>
  <EditorialContent />          {/* Редакционный блок */}
  <div className="mt-16">
    <CommunityPosts
      context={{ type: 'country', id: countryId, tab: activeTab }}
    />
  </div>
  <div className="mt-12">
    <RelatedCities />           {/* Связанные материалы */}
  </div>
</>

// City Detail Page
<>
  <CityOverview />
  <div className="mt-16">
    <CommunityPosts
      context={{ type: 'city', id: cityId }}
    />
  </div>
</>

// Place Detail Page
<>
  <PlaceInfo />
  <div className="mt-12">
    <CommunityPosts
      context={{ type: 'place', id: placeId }}
      limit={6}
    />
  </div>
</>

// Guide Detail Page
<>
  <GuideContent />
  <div className="mt-16">
    <CommunityPosts
      context={{ type: 'guide', id: guideId }}
    />
  </div>
</>
```

### 7.3 Tracking для UGC

```tsx
// Track post impression
const [ref, inView] = useInView({
  threshold: 0.5,
  triggerOnce: true
});

useEffect(() => {
  if (inView) {
    trackEvent('post_shown', {
      postId: post.id,
      contextType: context.type,
      contextId: context.id
    });
  }
}, [inView]);

// Track post click
const handlePostClick = (post: Post) => {
  trackEvent('post_clicked', {
    postId: post.id,
    position: index,
    source: 'community_posts'
  });

  navigateToPost(post.slug);
};
```

---

## 8) Чеклист качества контента

### 8.1 Обязательные требования

**Заголовок:**
- ✅ Длина 40-80 символов
- ✅ Информативный, без clickbait
- ✅ Содержит ключевые слова
- ✅ Без CAPS LOCK и эмодзи (кроме UGC)

**Лид-абзац (excerpt):**
- ✅ 1-2 предложения (100-200 символов)
- ✅ Отвечает на вопрос "О чём этот пост?"
- ✅ Не дублирует заголовок

**Структура:**
- ✅ Подзаголовки каждые 3-5 абзацев
- ✅ Абзацы 2-4 строки максимум
- ✅ Списки вместо больших абзацев
- ✅ Выделение важного (bold)

**Даты и цены:**
- ✅ Всегда с указанием месяца/года
- ✅ Пример: "2,500 THB/месяц (ноябрь 2024)"
- ✅ Не "дёшево", а конкретные цифры

**Изображения:**
- ✅ Минимум 1 уместное изображение
- ✅ Формат 16:9 для cover
- ✅ Качество ≥1200px ширина
- ✅ Оптимизированы (WebP предпочтительно)

**Источники:**
- ✅ Для виз/правил — обязательны ссылки
- ✅ Для цен — указать источник и дату
- ✅ Для фактов — желательны подтверждения

### 8.2 Компонент Quality Checklist

```tsx
interface QualityChecklistProps {
  content: {
    title: string;
    excerpt: string;
    body: string;
    images: string[];
    sources: string[];
    dates: boolean;
    prices: boolean;
  };
}

const QualityChecklist = ({ content }: QualityChecklistProps) => {

  const checks = [
    {
      id: 'title_length',
      label: 'Заголовок 40-80 символов',
      passed: content.title.length >= 40 && content.title.length <= 80
    },
    {
      id: 'excerpt',
      label: 'Лид-абзац добавлен',
      passed: content.excerpt.length >= 100
    },
    {
      id: 'headings',
      label: 'Подзаголовки добавлены',
      passed: content.body.match(/<h2|<h3/gi)?.length >= 2
    },
    {
      id: 'images',
      label: 'Изображения добавлены',
      passed: content.images.length > 0
    },
    {
      id: 'dates',
      label: 'Даты актуализированы',
      passed: content.dates
    },
    {
      id: 'sources',
      label: 'Источники указаны (если нужны)',
      passed: content.sources.length > 0 || !needsSources(content)
    }
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const progress = (passedCount / checks.length) * 100;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">Качество контента</h4>
        <span className="text-sm font-medium text-slate-600">
          {passedCount}/{checks.length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all ${
            progress === 100 ? 'bg-green-600' : 'bg-sky-600'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checks */}
      <div className="space-y-2">
        {checks.map(check => (
          <label
            key={check.id}
            className="flex items-center gap-2 text-sm"
          >
            {check.passed ? (
              <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            ) : (
              <Circle size={16} className="text-slate-300 flex-shrink-0" />
            )}
            <span className={check.passed ? 'text-slate-700' : 'text-slate-400'}>
              {check.label}
            </span>
          </label>
        ))}
      </div>

      {/* Publish Gate */}
      {progress === 100 ? (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <CheckCircle2 size={16} />
            Готово к публикации
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            Выполните все пункты для публикации
          </p>
        </div>
      )}

    </div>
  );
};
```

---

## 9) Код‑стандарты (React + TypeScript + Tailwind)

### 9.1 Структура компонентов

```tsx
// ✅ Good: Атомарный компонент
interface BadgeProps {
  variant: 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge = ({ variant, size = 'md', children }: BadgeProps) => {
  // Component logic
  return <span className={...}>{children}</span>;
};

// ✅ Good: Composition
<Card>
  <CardHeader>
    <Badge variant="primary">UGC</Badge>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>

// ❌ Bad: Monolithic component
const Card = ({ showBadge, badgeText, badgeVariant, ... }) => {
  // Too many props, too much logic
};
```

### 9.2 TypeScript типы

```typescript
// Shared types
interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  verified_by: 'curator' | 'editor' | null;
  tags: string[];
  context_type: 'country' | 'city' | 'place' | 'guide' | 'theme';
  context_id: string;
  context_tab?: string;
  likes_count: number;
  saves_count: number;
  views_count: number;
  has_prices: boolean;
  has_dates: boolean;
  has_photos: boolean;
  photos: string[];
  score: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  display_name: string;
  avatar_url: string;
  is_pro: boolean;
  verified: boolean;
}

interface Context {
  type: 'country' | 'city' | 'place' | 'guide' | 'theme';
  id: string;
  tab?: string;
}
```

### 9.3 Tailwind организация

```tsx
// ✅ Good: Группировка классов
<div className="
  // Layout
  flex items-center justify-between
  // Spacing
  p-5 mb-4
  // Visual
  bg-white rounded-xl border border-slate-200
  // Interactive
  hover:shadow-lg hover:border-sky-300
  // Animation
  transition-all duration-200
">

// ✅ Good: Использование @apply для повторяющихся паттернов
// globals.css
@layer components {
  .card {
    @apply bg-white rounded-xl border border-slate-200 shadow-sm;
    @apply hover:shadow-lg hover:border-sky-300;
    @apply transition-all duration-200;
  }

  .btn-primary {
    @apply bg-sky-600 text-white px-4 py-2 rounded-lg;
    @apply hover:bg-sky-700;
    @apply transition-colors;
  }
}

// ❌ Bad: Inline styles
<div style={{ backgroundColor: '#fff', padding: '20px' }}>
```

### 9.4 Условные классы

```tsx
// ✅ Good: clsx/classnames
import clsx from 'clsx';

<button className={clsx(
  'px-4 py-2 rounded-lg transition-colors',
  variant === 'primary' && 'bg-sky-600 text-white hover:bg-sky-700',
  variant === 'secondary' && 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  disabled && 'opacity-50 cursor-not-allowed'
)}>

// ✅ Good: Утилита cn (tailwind-merge + clsx)
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  conditionalClasses && 'conditional',
  className // allow override
)}>
```

### 9.5 Hooks и state management

```tsx
// ✅ Good: Custom hooks для переиспользования
const usePost = (postId: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPost(postId)
      .then(setPost)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [postId]);

  return { post, loading, error };
};

// Usage
const PostDetail = ({ postId }: Props) => {
  const { post, loading, error } = usePost(postId);

  if (loading) return <SkeletonDetail />;
  if (error) return <ErrorState error={error} />;
  if (!post) return <NotFound />;

  return <PostContent post={post} />;
};
```

### 9.6 Семантическая разметка

```tsx
// ✅ Good: Semantic HTML
<article className="post-card">
  <header>
    <h3>{title}</h3>
  </header>
  <section>
    <p>{excerpt}</p>
  </section>
  <footer>
    <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
  </footer>
</article>

<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<main id="main-content">
  {/* Main content */}
</main>

<aside aria-label="Related posts">
  {/* Sidebar */}
</aside>

// ❌ Bad: Div soup
<div className="post">
  <div className="header">
    <div className="title">{title}</div>
  </div>
</div>
```

### 9.7 Интернационализация (i18n)

```tsx
// ✅ Good: Все строки через словарь
import { useTranslation } from '@/lib/i18n';

const PostCard = ({ post }: Props) => {
  const { t } = useTranslation();

  return (
    <article>
      <h3>{post.title}</h3>
      <button>{t('common.readMore')}</button>
      <span>{t('post.likesCount', { count: post.likes_count })}</span>
    </article>
  );
};

// locales/ru.json
{
  "common": {
    "readMore": "Читать далее"
  },
  "post": {
    "likesCount": "{{count}} лайков",
    "likesCount_one": "{{count}} лайк",
    "likesCount_few": "{{count}} лайка",
    "likesCount_many": "{{count}} лайков"
  }
}

// ❌ Bad: Hardcoded strings
<button>Read more</button>
```

---

## 10) Нейминг и структура проекта

### 10.1 Файловая структура (монорепо)

```
go2asia/
├── apps/
│   ├── atlas/           # Atlas Asia app
│   ├── space/           # Space Asia app
│   ├── pulse/           # Pulse Asia app
│   ├── blog/            # Blog Asia app
│   ├── connect/         # Connect Asia app
│   ├── quest/           # Quest Asia app
│   └── web/             # Marketing site
│
├── packages/
│   ├── ui/              # Shared UI components
│   │   ├── Badge/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Chip/
│   │   ├── Empty/
│   │   ├── Pagination/
│   │   ├── Skeleton/
│   │   ├── Tabs/
│   │   └── index.ts
│   │
│   ├── tokens/          # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── tailwind.preset.js
│   │
│   ├── layouts/         # Shared layouts
│   │   ├── AppLayout/
│   │   ├── DetailLayout/
│   │   ├── ListLayout/
│   │   └── FormLayout/
│   │
│   ├── lib/             # Shared utilities
│   │   ├── supabase.ts
│   │   ├── analytics.ts
│   │   ├── i18n.ts
│   │   └── utils.ts
│   │
│   └── types/           # Shared TypeScript types
│       ├── database.ts
│       ├── post.ts
│       ├── user.ts
│       └── index.ts
│
├── supabase/            # Database
│   ├── migrations/
│   └── functions/
│
└── package.json
```

### 10.2 Структура приложения (app)

```
apps/atlas/
├── src/
│   ├── components/      # App-specific components
│   │   ├── CountryCard/
│   │   ├── CityCard/
│   │   ├── PlaceCard/
│   │   └── CommunityPosts/
│   │
│   ├── pages/           # Route pages
│   │   ├── CountriesPage.tsx
│   │   ├── CountryDetailPage.tsx
│   │   ├── CitiesPage.tsx
│   │   └── ...
│   │
│   ├── lib/             # App-specific utilities
│   │   ├── api.ts
│   │   └── hooks.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
└── vite.config.ts
```

### 10.3 Нейминг конвенции

**Компоненты:**
- PascalCase: `CountryCard`, `CommunityPosts`
- Файлы: `CountryCard.tsx`, `CountryCard.test.tsx`
- Индекс: `index.ts` для экспорта

**Хуки:**
- camelCase с префиксом `use`: `usePost`, `useAuth`
- Файлы: `usePost.ts`

**Утилиты:**
- camelCase: `formatDate`, `truncateText`
- Файлы: `date.ts`, `string.ts`

**Типы:**
- PascalCase: `Post`, `User`, `Context`
- Интерфейсы: `interface PostProps`
- Types: `type PostStatus = 'draft' | 'published'`

**Константы:**
- UPPER_SNAKE_CASE: `MAX_TITLE_LENGTH`, `API_BASE_URL`
- Файлы: `constants.ts`, `config.ts`

**CSS классы:**
- kebab-case: `post-card`, `community-posts`
- BEM если нужно: `post-card__title`, `post-card--featured`

### 10.4 Экспорты (packages/ui)

```typescript
// packages/ui/index.ts
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

// Usage in apps
import { Badge, Card, Button } from '@go2asia/ui';
import type { BadgeProps } from '@go2asia/ui';
```

---

## 11) Do & Don't

### ✅ Do (Делайте)

**Контент:**
- ✅ Используйте пустые состояния (EmptyState)
- ✅ Показывайте скелетоны при загрузке
- ✅ Добавляйте бейджи для UGC контента
- ✅ Пишите короткими абзацами (2-4 строки)
- ✅ Указывайте источники для фактов
- ✅ Добавляйте даты актуальности
- ✅ Используйте списки вместо длинных текстов

**UI/UX:**
- ✅ Следуйте 8px spacing system
- ✅ Используйте семантические цвета
- ✅ Добавляйте hover состояния
- ✅ Делайте видимые focus rings
- ✅ Проверяйте контрастность текста
- ✅ Тестируйте клавиатурную навигацию

**Код:**
- ✅ Создавайте атомарные компоненты
- ✅ Используйте TypeScript типы
- ✅ Группируйте Tailwind классы логически
- ✅ Добавляйте aria-labels для доступности
- ✅ Используйте семантическую разметку

### ❌ Don't (Не делайте)

**Контент:**
- ❌ Яркие "кричащие" плашки
- ❌ Более 2 строк фильтров на мобиле
- ❌ Текст без дат актуальности
- ❌ Перегруженные карточки (слишком много инфо)
- ❌ Clickbait заголовки
- ❌ "Скоро" или "недавно" вместо конкретных дат

**UI/UX:**
- ❌ Инлайн стили вместо Tailwind
- ❌ Текст без достаточного контраста
- ❌ Кнопки без hover состояний
- ❌ Формы без валидации
- ❌ Модалы без возможности закрыть (ESC/клик вне)

**Код:**
- ❌ Монолитные компоненты (>300 строк)
- ❌ Props drilling (передача через 3+ уровня)
- ❌ Хардкод текстов (i18n обязателен)
- ❌ Div soup (используйте семантику)
- ❌ Глобальные переменные для состояния

---

## 12) Acceptance для новых модулей

### Чеклист для запуска модуля:

**Design System:**
- [ ] Используются общие токены из `@go2asia/tokens`
- [ ] Все компоненты из `@go2asia/ui`
- [ ] Layout из `@go2asia/layouts`
- [ ] Нет локальных переопределений токенов

**Компоненты:**
- [ ] Card, Badge, Chip, Tabs используются
- [ ] Pagination реализована (Load More)
- [ ] Skeleton для всех loading состояний
- [ ] EmptyState для пустых списков

**UGC (если применимо):**
- [ ] CommunityPosts интегрирован
- [ ] UGC блок ниже editorial контента
- [ ] Бейджи UGC/Verified присутствуют
- [ ] Фильтры работают

**Адаптивность:**
- [ ] Mobile (< 640px) — проверено
- [ ] Tablet (640-1024px) — проверено
- [ ] Desktop (1024px+) — проверено
- [ ] Grid корректно адаптируется

**Доступность:**
- [ ] Keyboard navigation работает
- [ ] Focus rings видимы
- [ ] Контраст текста AA/AAA
- [ ] ARIA labels добавлены
- [ ] Screen reader tested

**Performance:**
- [ ] Lazy loading изображений
- [ ] Code splitting
- [ ] Bundle size < 200kb (gzip)
- [ ] Lighthouse score > 90

**i18n:**
- [ ] Все строки через словарь
- [ ] Pluralization настроен
- [ ] Даты локализованы

**Analytics:**
- [ ] События трекаются
- [ ] IntersectionObserver для impressions
- [ ] Click events работают

---

## 13) Roadmap стилей

### v1.0 (Current) — Baseline
- ✅ Токены и базовые компоненты
- ✅ UGC карточки и блоки
- ✅ Pagination и Empty states
- ✅ Atlas Asia как референс

### v1.1 (Next) — Refinement
- [ ] Анимации расширенные (stagger, transitions)
- [ ] Dark mode полная поддержка
- [ ] Accessibility AAA для критичных экранов
- [ ] Storybook/Showcase со всеми состояниями

### v2.0 (Future) — Customization
- [ ] Темы для брендов модулей (тонкая кастомизация)
- [ ] Advanced animations (framer-motion)
- [ ] Micro-interactions библиотека
- [ ] Design system documentation site

---

## 14) Tracking & Analytics

### События (стандартизированные)

```typescript
interface AnalyticsEvent {
  eventType:
    | 'card_shown'           // IntersectionObserver
    | 'card_clicked'         // Клик на карточку
    | 'cta_clicked'          // CTA кнопка
    | 'filter_applied'       // Фильтр изменён
    | 'load_more_clicked'    // Пагинация
    | 'post_liked'           // Лайк
    | 'post_saved'           // Сохранение
    | 'share_clicked';       // Шаринг

  entityType: 'post' | 'place' | 'guide' | 'event' | 'business';
  entityId: string;

  metadata: {
    context: string;          // 'country_detail', 'city_list', etc.
    source: string;           // 'community_posts', 'related', 'feed'
    position?: number;        // Позиция в списке
    timestamp: number;
  };

  user?: {
    id: string;
    isPro: boolean;
  };
}

// Usage
const trackEvent = (event: AnalyticsEvent) => {
  // Send to analytics service
  analytics.track(event);

  // Also update database stats
  if (event.eventType === 'card_shown') {
    updateViews(event.entityId);
  }
};

// Implementation
const PostCard = ({ post, index, context }: Props) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      trackEvent({
        eventType: 'card_shown',
        entityType: 'post',
        entityId: post.id,
        metadata: {
          context: context.type,
          source: 'community_posts',
          position: index,
          timestamp: Date.now()
        }
      });
    }
  }, [inView]);

  const handleClick = () => {
    trackEvent({
      eventType: 'card_clicked',
      entityType: 'post',
      entityId: post.id,
      metadata: {
        context: context.type,
        source: 'community_posts',
        position: index,
        timestamp: Date.now()
      }
    });
  };

  return (
    <article ref={ref} onClick={handleClick}>
      {/* Card content */}
    </article>
  );
};
```

---

## 15) Tailwind Preset (финальный)

```js
// packages/tokens/tailwind.preset.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1677FF',
          hover: '#186ae0',
          light: '#E0F2FE',
          dark: '#0369A1'
        },
        slate: {
          // Tailwind defaults
        }
      },

      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Courier New', 'monospace']
      },

      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '26px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '38px']
      },

      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px'
      },

      boxShadow: {
        'sm': '0 1px 2px rgba(15, 23, 42, 0.05)',
        'DEFAULT': '0 1px 3px rgba(15, 23, 42, 0.1)',
        'md': '0 4px 6px -1px rgba(15, 23, 42, 0.1)',
        'lg': '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
        'xl': '0 20px 25px -5px rgba(15, 23, 42, 0.1)',
        'card': '0 1px 2px rgba(15, 23, 42, 0.05)',
        'lift': '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)'
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },

      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },

      transitionDuration: {
        DEFAULT: '200ms'
      },

      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },

      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'shimmer': 'shimmer 1.2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out'
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      }
    }
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
};
```

---

## 16) Финальные рекомендации для Bolt.New/Claude Code

### Приоритеты при создании новых модулей:

1. **Используйте пакеты:**
   - `@go2asia/ui` для всех базовых компонентов
   - `@go2asia/layouts` для структуры страниц
   - `@go2asia/tokens` для всех стилей

2. **Следуйте паттернам Atlas Asia:**
   - Editorial content → UGC posts → Related
   - Tabs для навигации по контенту
   - Бейджи для статусов
   - Фильтры через Chips

3. **Обязательные компоненты:**
   - Skeleton для loading
   - EmptyState для пустых списков
   - Toast для уведомлений
   - Quality Checklist для форм

4. **Тестирование:**
   - Mobile-first подход
   - Keyboard navigation
   - Screen reader compatibility
   - Performance (Lighthouse)

5. **Документация:**
   - Props для всех компонентов
   - Examples использования
   - Accessibility notes
   - Best practices

---

**Версия:** 1.1
**Дата:** 2024-11-10
**Базовая реализация:** Atlas Asia
**Статус:** Ready for production

---

Этот Style Guide — живой документ. Обновляйте его по мере развития дизайн-системы и появления новых паттернов.
