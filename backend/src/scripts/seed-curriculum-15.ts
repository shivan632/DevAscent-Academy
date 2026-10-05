import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding 15 Topics + 15 Quizzes (100 MCQs) + 3 AI Videos for Web Development Virtual Internship...');

  const course = await prisma.course.findUnique({
    where: { slug: 'web-development-internship' },
  });

  if (!course) {
    console.error('Course web-development-internship not found!');
    return;
  }

  // 1. Delete existing modules, lessons, quizzes, aiVideos for this course
  const existingModules = await prisma.module.findMany({
    where: { courseId: course.id },
    include: { lessons: true },
  });

  const lessonIds = existingModules.flatMap((m) => m.lessons.map((l) => l.id));

  // Clean related records
  await prisma.quizAttempt.deleteMany({
    where: { quiz: { lessonId: { in: lessonIds } } },
  });
  await prisma.quizSubmission.deleteMany({
    where: { quiz: { lessonId: { in: lessonIds } } },
  });
  await prisma.quizQuestion.deleteMany({
    where: { quiz: { lessonId: { in: lessonIds } } },
  });
  await prisma.quiz.deleteMany({
    where: { lessonId: { in: lessonIds } },
  });
  await prisma.lessonProgress.deleteMany({
    where: { lessonId: { in: lessonIds } },
  });
  await prisma.doubt.deleteMany({
    where: { lessonId: { in: lessonIds } },
  });
  await prisma.lesson.deleteMany({
    where: { id: { in: lessonIds } },
  });
  await prisma.module.deleteMany({
    where: { courseId: course.id },
  });

  await prisma.aiVideoProgress.deleteMany({
    where: { aiVideo: { courseId: course.id } },
  });
  await prisma.aiVideo.deleteMany({
    where: { courseId: course.id },
  });

  // 2. Create 3 AI Overview Milestone Videos
  const video1 = await prisma.aiVideo.create({
    data: {
      courseId: course.id,
      order: 1,
      title: 'Introduction of Part 1 — HTML5 & Modern CSS Architecture',
      description: 'Milestone 1 orientation: Master semantic markup, responsive flex/grid layouts, mobile breakpoints, and accessibility primitives before starting Topics 1-5.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      durationSec: 15,
      unlocksFromLesson: 1,
      unlocksToLesson: 5,
    },
  });

  const video2 = await prisma.aiVideo.create({
    data: {
      courseId: course.id,
      order: 2,
      title: 'Introduction of Part 2 — JavaScript ES6+, Async & State',
      description: 'Milestone 2 orientation: Master modern JavaScript engines, event loops, DOM manipulation, asynchronous APIs, and persistent browser storage across Topics 6-10.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      durationSec: 15,
      unlocksFromLesson: 6,
      unlocksToLesson: 10,
    },
  });

  const video3 = await prisma.aiVideo.create({
    data: {
      courseId: course.id,
      order: 3,
      title: 'Introduction of Part 3 — React 19 Components & Capstone',
      description: 'Milestone 3 orientation: Build high-performance declarative UIs with React 19, hooks, custom architecture, and prepare your capstone project for verification.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      durationSec: 15,
      unlocksFromLesson: 11,
      unlocksToLesson: 15,
    },
  });

  console.log('✅ Created 3 AI Milestone Videos');

  // 3. Module 1: Topics 1-5 (each with 6 MCQs)
  const mod1 = await prisma.module.create({
    data: {
      courseId: course.id,
      moduleNumber: 1,
      title: 'Part 1: HTML5 Semantics, Modern CSS & Responsive Layouts',
      description: 'Foundational front-end engineering: DOM structuring, CSS Grid, Flexbox, and accessible design.',
    },
  });

  const mod1TopicsData = [
    {
      lessonNumber: 1,
      title: '1.1 Semantic HTML5 & Modern Layout Architecture',
      durationMinutes: 35,
      summary: 'Structured semantic layout rules, accessibility, SEO best practices, and clean DOM trees.',
      writtenContent: `# 1.1 Semantic HTML5 & Modern Layout Architecture

### 📖 Core Engineering Principles
Semantic HTML provides meaning to web pages rather than just visual presentation. Search engine crawlers, screen readers, and browser rendering engines rely on semantic elements to properly index and render documents.

### 💡 Essential Semantic Elements
- \`<header>\`: Introductory content, logos, or primary navigation wrapper.
- \`<nav>\`: Container for primary or secondary navigation links.
- \`<main>\`: The primary, dominant content of the \`<body>\` (only one per document).
- \`<article>\`: Self-contained composition in a document (blog posts, product cards, news items).
- \`<section>\`: Thematic grouping of content, typically with an introductory heading.
- \`<aside>\`: Content tangentially related to the main content (sidebars, callouts, footnotes).
- \`<footer>\`: Footer containing authorship, copyright, and secondary links.

\`\`\`html
<!-- Semantic Layout Scaffold -->
<header class="site-header">
  <nav aria-label="Main Navigation">
    <a href="/" class="brand-logo">DevAscent Academy</a>
  </nav>
</header>

<main id="main-content">
  <article class="course-summary">
    <h1>Web Development Virtual Internship</h1>
    <section>
      <h2>Architecture Overview</h2>
      <p>Clean semantic markup optimizes DOM size and maximizes SEO indexability.</p>
    </section>
  </article>
</main>

<footer class="site-footer">
  <p>&copy; 2026 DevAscent Academy. All rights reserved.</p>
</footer>
\`\`\`

### 🎯 Production Standards Checklist
1. **Single \`<h1>\` Rule**: Always maintain exactly one \`<h1>\` tag per page for unambiguous document outlining.
2. **Accessible Images**: Every content image must contain a descriptive \`alt\` attribute; decorative images use \`alt=""\`.
3. **Semantic Interactive Elements**: Use native \`<button>\` and \`<a>\` tags rather than clickable \`<div onclick="...">\`.`,
      questions: [
        {
          order: 1,
          question: 'Which HTML5 element represents the primary and dominant self-contained content of a document?',
          options: ['<main>', '<header>', '<aside>', '<section>'],
          correctOptionIndex: 0,
          explanation: '<main> represents the dominant and unique content of the page body. A document must not have more than one non-hidden <main> element.',
        },
        {
          order: 2,
          question: 'Why should clickable interactive elements use <button> instead of <div onclick="...">?',
          options: [
            '<button> provides built-in keyboard accessibility (Enter/Space) and focus management automatically',
            '<div> tags cannot execute JavaScript functions',
            '<button> tags automatically reload the web page',
            'CSS styles cannot be applied to <div> elements',
          ],
          correctOptionIndex: 0,
          explanation: '<button> elements natively support keyboard focus, Enter/Space activation, and expose correct accessibility tree roles to assistive technologies.',
        },
        {
          order: 3,
          question: 'What is the correct semantic tag for an independent, reusable piece of content such as a blog post or product card?',
          options: ['<article>', '<section>', '<div>', '<span>'],
          correctOptionIndex: 0,
          explanation: '<article> is intended for self-contained compositions that make sense on their own and could be independently distributed.',
        },
        {
          order: 4,
          question: 'What is the semantic purpose of the <aside> tag in modern HTML?',
          options: [
            'Content tangentially related to the surrounding content (e.g. sidebars, callouts, related links)',
            'To format text in italic style',
            'To hide content from mobile screens',
            'To create horizontal divider lines',
          ],
          correctOptionIndex: 0,
          explanation: '<aside> represents a portion of a document whose content is only tangentially related to the surrounding primary content.',
        },
        {
          order: 5,
          question: 'What happens when an image is purely decorative and carries no informative value?',
          options: [
            'Provide an empty alt attribute alt="" so screen readers gracefully skip it',
            'Omit the alt attribute entirely',
            'Write alt="image"',
            'Write alt="decorative"',
          ],
          correctOptionIndex: 0,
          explanation: 'Setting alt="" explicitly tells assistive technologies that the image is presentational and should be skipped.',
        },
        {
          order: 6,
          question: 'How many <h1> elements should ideally be placed on a standard single-page document?',
          options: ['Exactly 1', 'Unlimited', 'At least 5', 'Zero'],
          correctOptionIndex: 0,
          explanation: 'Best practice dictates a single <h1> per page to establish the unambiguous top-level title in the document outline.',
        },
      ],
    },
    {
      lessonNumber: 2,
      title: '1.2 Flexbox vs. CSS Grid & 375px Mobile Breakpoints',
      durationMinutes: 45,
      summary: 'Building fluid 1D and 2D layouts using CSS Flexbox and Grid with 375px mobile-first responsiveness.',
      writtenContent: `# 1.2 Flexbox vs. CSS Grid & 375px Mobile Breakpoints

### 📐 Understanding 1D (Flexbox) vs. 2D (Grid)
- **CSS Flexbox (1-Dimensional)**: Ideal for laying out components along a single axis (row OR column). Examples: navigation bars, button toolbars, card content alignment, badges.
- **CSS Grid (2-Dimensional)**: Ideal for simultaneous row and column layouts. Examples: full page layout skeletons, photo galleries, dashboard widget grids.

\`\`\`css
/* Responsive CSS Grid with auto-fit and minmax */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Flexbox component alignment */
.navbar-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
\`\`\`

### 📱 375px Mobile Viewport Checklist
1. **No Horizontal Overflow**: Ensure no containers exceed \`100vw\` or have fixed widths larger than \`320px\`.
2. **Touch Targets**: All buttons and links must maintain a minimum touch area of **44px × 44px**.
3. **Fluid Media**: Always declare \`max-width: 100%; height: auto;\` on images and videos.`,
      questions: [
        {
          order: 1,
          question: 'What is the primary architectural difference between CSS Flexbox and CSS Grid?',
          options: [
            'Flexbox is 1-dimensional (row or column) whereas Grid is 2-dimensional (rows and columns simultaneously)',
            'Flexbox is only for desktop while Grid is only for mobile',
            'Flexbox requires JavaScript while Grid is pure CSS',
            'Grid cannot support gap properties',
          ],
          correctOptionIndex: 0,
          explanation: 'Flexbox works along one dimension at a time (main axis), while CSS Grid allows item positioning across both rows and columns at once.',
        },
        {
          order: 2,
          question: 'In CSS Grid, what does `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` achieve?',
          options: [
            'It creates a fully responsive grid that wraps columns automatically without requiring media queries',
            'It forces all items to be exactly 280px on every screen',
            'It creates exactly 3 columns on all devices',
            'It hides columns on mobile screens',
          ],
          correctOptionIndex: 0,
          explanation: 'repeat(auto-fit, minmax(280px, 1fr)) creates as many 280px+ columns as fit the viewport, stretching them evenly (1fr) without media queries.',
        },
        {
          order: 3,
          question: 'What is the recommended minimum touch target size for mobile web interactive elements according to WCAG?',
          options: ['44px × 44px', '20px × 20px', '10px × 10px', '100px × 100px'],
          correctOptionIndex: 0,
          explanation: 'WCAG 2.1 Success Criterion 2.5.5 specifies a minimum target size of 44 by 44 CSS pixels for touch inputs.',
        },
        {
          order: 4,
          question: 'In Flexbox, which property aligns items along the cross axis (perpendicular to flex-direction)?',
          options: ['align-items', 'justify-content', 'flex-wrap', 'order'],
          correctOptionIndex: 0,
          explanation: 'align-items controls alignment along the cross axis, whereas justify-content aligns items along the main axis.',
        },
        {
          order: 5,
          question: 'How do you prevent images from causing horizontal overflow on small mobile viewports (e.g. 375px)?',
          options: [
            'img { max-width: 100%; height: auto; }',
            'img { width: 1000px; }',
            'img { display: none; }',
            'img { overflow: hidden; }',
          ],
          correctOptionIndex: 0,
          explanation: 'Declaring max-width: 100% ensures images never exceed their parent container width while height: auto preserves the aspect ratio.',
        },
        {
          order: 6,
          question: 'What is the purpose of `flex-shrink: 0` on a flex item?',
          options: [
            'Prevents the flex item from shrinking smaller than its basis/intrinsic width when space is tight',
            'Makes the flex item expand to fill remaining space',
            'Hides the flex item on mobile',
            'Sets the opacity of the item to zero',
          ],
          correctOptionIndex: 0,
          explanation: 'flex-shrink: 0 prevents the item from being compressed below its flex-basis width when container width is constrained.',
        },
      ],
    },
    {
      lessonNumber: 3,
      title: '1.3 Responsive Typography, clamp(), and CSS Custom Properties',
      durationMinutes: 40,
      summary: 'Fluid typography calculations using clamp(min, val, max) and scalable design tokens with CSS variables.',
      writtenContent: `# 1.3 Responsive Typography, clamp(), and CSS Custom Properties

### 🎯 Fluid Typography with clamp()
The CSS \`clamp()\` function takes three parameters: a minimum value, a preferred value, and a maximum value. It eliminates clunky breakpoint jumps by scaling typography linearly with the viewport width.

\`\`\`css
:root {
  /* Design Tokens (CSS Custom Properties) */
  --color-primary: #6366f1;
  --color-surface: #0f172a;
  --color-text: #f8fafc;
  --font-heading: 'Inter', system-ui, sans-serif;

  /* Fluid typography formula */
  --font-h1: clamp(1.75rem, 4vw + 1rem, 3.25rem);
  --font-body: clamp(0.95rem, 1vw + 0.75rem, 1.125rem);
}

h1 {
  font-family: var(--font-heading);
  font-size: var(--font-h1);
  color: var(--color-primary);
}
\`\`\`

### 💡 Why CSS Custom Properties Outperform Preprocessors
1. **Runtime Dynamism**: Can be updated on the fly with JavaScript or scoped to themes (\`[data-theme="dark"]\`).
2. **Cascade Inheritance**: Variables inherit down the DOM tree naturally.`,
      questions: [
        {
          order: 1,
          question: 'In CSS, what are the three arguments passed to the `clamp()` function?',
          options: [
            'clamp(minimum, preferredValue, maximum)',
            'clamp(maximum, minimum, defaultValue)',
            'clamp(width, height, depth)',
            'clamp(margin, padding, border)',
          ],
          correctOptionIndex: 0,
          explanation: 'clamp(MIN, VAL, MAX) clamps a value between an upper and lower bound, resolving to VAL when between MIN and MAX.',
        },
        {
          order: 2,
          question: 'How do you access a CSS custom property `--primary-color` in a stylesheet rule?',
          options: [
            'color: var(--primary-color);',
            'color: $primary-color;',
            'color: prop(--primary-color);',
            'color: @primary-color;',
          ],
          correctOptionIndex: 0,
          explanation: 'CSS Custom Properties are retrieved using the var(--property-name) function.',
        },
        {
          order: 3,
          question: 'What is a major runtime advantage of native CSS Custom Properties over Sass/SCSS variables?',
          options: [
            'They exist at runtime in the browser DOM and can be altered dynamically with JavaScript or media queries',
            'They run on the web server before compilation',
            'They disable browser caching',
            'They make CSS files larger and slower',
          ],
          correctOptionIndex: 0,
          explanation: 'Native CSS variables exist in the live DOM and can be modified at runtime with JavaScript or scoped per DOM element.',
        },
        {
          order: 4,
          question: 'What unit is `1rem` relative to in modern browsers by default?',
          options: [
            'The font-size of the root <html> element (typically 16px)',
            'The viewport height',
            'The parent container width',
            'The screen DPI resolution',
          ],
          correctOptionIndex: 0,
          explanation: 'rem stands for "root em" and is directly relative to the font-size of the root <html> element (usually 16px).',
        },
        {
          order: 5,
          question: 'How do you provide a fallback value in `var()` in case a variable is undefined?',
          options: [
            'var(--theme-color, #6366f1)',
            'var(--theme-color || #6366f1)',
            'var(--theme-color default #6366f1)',
            'var(--theme-color ?? #6366f1)',
          ],
          correctOptionIndex: 0,
          explanation: 'The second parameter in var() is the fallback value used if the custom property is not set.',
        },
        {
          order: 6,
          question: 'Why is using `vw` units inside `clamp()` preferred for fluid typography?',
          options: [
            'It enables text to scale continuously with the browser window width without stepped media queries',
            'It prevents the browser from zooming',
            'It converts rem units into pixels',
            'It disables font antialiasing',
          ],
          correctOptionIndex: 0,
          explanation: 'Viewport width (vw) units scale with screen size, providing a smooth sliding scale between minimum and maximum clamp boundaries.',
        },
      ],
    },
    {
      lessonNumber: 4,
      title: '1.4 Modern CSS Animations, Transitions & Glassmorphism',
      durationMinutes: 45,
      summary: 'GPU-accelerated CSS animations using transform and opacity with backdrop-filter glassmorphism effects.',
      writtenContent: `# 1.4 Modern CSS Animations, Transitions & Glassmorphism

### 🚀 GPU-Accelerated CSS Transitions
For 60fps / 120fps animations, always animate properties that can be offloaded directly to the GPU compositor thread:
- **Good (GPU):** \`transform\` (translate, scale, rotate) and \`opacity\`.
- **Bad (CPU Reflow/Repaint):** \`width\`, \`height\`, \`top\`, \`left\`, \`margin\`, \`padding\`.

\`\`\`css
/* Glassmorphism Card Style */
.glass-card {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}
\`\`\`

### 💡 Accessibility: Respecting \`prefers-reduced-motion\`
Always respect users who suffer from vestibular motion sensitivity:
\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\``,
      questions: [
        {
          order: 1,
          question: 'Which two CSS properties can the browser compositor animate directly on the GPU without triggering layout reflows?',
          options: [
            'transform and opacity',
            'width and height',
            'top and left',
            'margin and padding',
          ],
          correctOptionIndex: 0,
          explanation: 'transform and opacity can be composited directly on the GPU, avoiding expensive DOM layout recalculations (reflows) and repaints.',
        },
        {
          order: 2,
          question: 'Which CSS property creates the frosted glass blur effect behind an element in modern web design?',
          options: [
            'backdrop-filter: blur(...)',
            'filter: blur(...)',
            'box-shadow: inset blur',
            'background-blur: true',
          ],
          correctOptionIndex: 0,
          explanation: 'backdrop-filter applies graphical effects (such as blur or color shifting) to the area behind an element.',
        },
        {
          order: 3,
          question: 'What is the purpose of the `@media (prefers-reduced-motion: reduce)` media query?',
          options: [
            'To disable or minimize animations for users with motion sickness or vestibular disorders',
            'To speed up CPU clock rate',
            'To reduce video resolution',
            'To turn off CSS stylesheets',
          ],
          correctOptionIndex: 0,
          explanation: 'prefers-reduced-motion detects if the user has requested that the system minimize the amount of non-essential motion.',
        },
        {
          order: 4,
          question: 'What does `will-change: transform` tell the browser rendering engine?',
          options: [
            'Hints to the browser to prepare GPU resources and create a separate compositing layer for that element',
            'Forces the element to reload from server',
            'Transforms text to uppercase',
            'Disables CSS transitions',
          ],
          correctOptionIndex: 0,
          explanation: 'will-change informs the browser ahead of time what properties are likely to change, allowing it to optimize layer allocations.',
        },
        {
          order: 5,
          question: 'What is the cubic-bezier timing function primarily used for?',
          options: [
            'Defining custom acceleration curves for CSS transitions and animations',
            'Calculating image aspect ratios',
            'Drawing 3D vector polygons',
            'Setting font weights',
          ],
          correctOptionIndex: 0,
          explanation: 'cubic-bezier() specifies a cubic Bézier curve that governs the speed of transitions over time (easing).',
        },
        {
          order: 6,
          question: 'Why should you avoid animating `margin-top` or `top` during hover states?',
          options: [
            'They cause CPU layout reflows on every frame, leading to noticeable stutter (jank)',
            'They are not supported in Chromium browsers',
            'They turn off hardware acceleration forever',
            'They cause JavaScript errors',
          ],
          correctOptionIndex: 0,
          explanation: 'Animating geometric properties like top and margin triggers full document reflows and repaints, degrading frame rates.',
        },
      ],
    },
    {
      lessonNumber: 5,
      title: '1.5 Accessible Web Design (A11y), ARIA Roles & Screen Readers',
      durationMinutes: 40,
      summary: 'Keyboard navigation, focus rings, ARIA landmark roles, and automated accessibility testing with axe-core.',
      writtenContent: `# 1.5 Accessible Web Design (A11y), ARIA Roles & Screen Readers

### ♿ Core Accessibility (A11y) Rules
Web accessibility ensures that all users, including those with visual, motor, auditory, or cognitive disabilities, can navigate and interact with your applications.

### 🔑 The First Rule of ARIA
> *"If you can use a native HTML element or attribute with the semantics and behavior you require, then do so instead of using ARIA."* — W3C WAI

\`\`\`html
<!-- Bad Non-Semantic Pattern -->
<div class="btn" onclick="openModal()" role="button" tabindex="0">Open Modal</div>

<!-- Good Native Semantic Pattern -->
<button type="button" aria-haspopup="dialog" aria-expanded="false" onclick="openModal()">
  Open Modal
</button>
\`\`\`

### 🎯 Keyboard Navigation & Focus Visible
Never remove browser outline indicators without providing an accessible alternative:
\`\`\`css
/* Bad: destroys keyboard accessibility */
:focus { outline: none; }

/* Good: custom high-contrast focus ring for keyboard users */
:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}
\`\`\``,
      questions: [
        {
          order: 1,
          question: 'What is the "First Rule of ARIA" established by the W3C?',
          options: [
            'Use native semantic HTML elements whenever possible before adding ARIA attributes',
            'Every HTML element must have an aria-label',
            'Never use button tags',
            'Always override native browser styles with ARIA',
          ],
          correctOptionIndex: 0,
          explanation: 'W3C states that native HTML elements already carry built-in accessibility roles, so native elements should always be preferred over ARIA.',
        },
        {
          order: 2,
          question: 'What is the purpose of the CSS `:focus-visible` pseudo-class?',
          options: [
            'Applies focus styles only when the user is navigating via keyboard or assistive devices, avoiding focus rings on mouse clicks',
            'Hides focused elements completely',
            'Changes text color on hover',
            'Validates form inputs on submit',
          ],
          correctOptionIndex: 0,
          explanation: ':focus-visible selectively applies focus indicators when keyboard or non-pointer modality is detected.',
        },
        {
          order: 3,
          question: 'Which attribute should be used to announce dynamic live updates (such as incoming chat or alerts) to screen readers?',
          options: [
            'aria-live="polite" or aria-live="assertive"',
            'aria-hidden="true"',
            'role="none"',
            'tabindex="-1"',
          ],
          correctOptionIndex: 0,
          explanation: 'aria-live informs screen readers to announce dynamic content changes as they occur.',
        },
        {
          order: 4,
          question: 'What does `tabindex="0"` do when placed on an HTML element?',
          options: [
            'Inserts the element into natural sequential keyboard tab order in the document',
            'Removes the element from tab order completely',
            'Makes the element focusable only with JavaScript',
            'Closes all open modals',
          ],
          correctOptionIndex: 0,
          explanation: 'tabindex="0" places an element into natural keyboard tab order matching its source code position.',
        },
        {
          order: 5,
          question: 'What is the minimum color contrast ratio required by WCAG AA for normal body text?',
          options: ['4.5:1', '2:1', '10:1', '1.5:1'],
          correctOptionIndex: 0,
          explanation: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.',
        },
        {
          order: 6,
          question: 'What does `aria-hidden="true"` indicate to assistive technologies?',
          options: [
            'The element and all of its children should be completely ignored by screen readers and the accessibility tree',
            'The element is visible only to screen readers',
            'The element must be read with maximum volume',
            'The element is required in a form',
          ],
          correctOptionIndex: 0,
          explanation: 'aria-hidden="true" hides elements from the accessibility tree (useful for decorative icons accompanying text).',
        },
      ],
    },
  ];

  for (const tData of mod1TopicsData) {
    const { questions, ...lessonProps } = tData;
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: mod1.id,
        ...lessonProps,
      },
    });

    await prisma.quiz.create({
      data: {
        lessonId: lesson.id,
        title: `${lesson.title} - Skill Quiz`,
        passingScore: 60,
        maxAttempts: 3,
        timeLimitMin: 15,
        questions: {
          create: questions.map((q) => ({
            order: q.order,
            question: q.question,
            questionText: q.question,
            optionsJson: JSON.stringify(q.options),
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
          })),
        },
      },
    });
  }

  console.log('✅ Created Module 1: Topics 1-5 with 30 MCQs');

  // 4. Module 2: Topics 6-10 (each with 6 MCQs)
  const mod2 = await prisma.module.create({
    data: {
      courseId: course.id,
      moduleNumber: 2,
      title: 'Part 2: JavaScript ES6+, DOM Manipulation & State',
      description: 'Intermediate JavaScript engineering: Closures, Event Loop, Promises, REST APIs, and client storage.',
    },
  });

  const mod2TopicsData = [
    {
      lessonNumber: 1,
      title: '2.1 ES6+ Modern JavaScript, Closures & Event Loop',
      durationMinutes: 45,
      summary: 'Execution contexts, call stack, microtasks vs macrotasks, lexical scope, and functional array pipelines.',
      writtenContent: `# 2.1 ES6+ Modern JavaScript, Closures & Event Loop

### ⚡ The JavaScript Event Loop & Concurrency Model
JavaScript is single-threaded: it executes one statement at a time in its **Call Stack**. Asynchronous operations (fetch, setTimeout, Promises) are offloaded to Web APIs, and their callbacks wait in queues.

### 🔄 Microtasks vs. Macrotasks
- **Microtask Queue (High Priority):** Promise \`.then()\` / \`.catch()\`, \`queueMicrotask()\`, \`MutationObserver\`. Executed immediately after the current synchronous script finishes before rendering.
- **Macrotask Queue (Task Queue):** \`setTimeout\`, \`setInterval\`, \`requestAnimationFrame\`, I/O events.

\`\`\`javascript
// Event loop order demonstration
console.log('1. Synchronous Code');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask (Promise)');
});

console.log('2. Synchronous Code');
// Expected console output: 1 -> 2 -> 3 -> 4
\`\`\`

### 🔒 Lexical Scope & Closures
A closure is the combination of a function bundled together with references to its surrounding lexical environment.
\`\`\`javascript
function createCounter(initialValue = 0) {
  let count = initialValue; // Private encapsulated variable
  return {
    increment: () => ++count,
    getValue: () => count,
  };
}
const counter = createCounter(10);
console.log(counter.increment()); // 11
\`\`\``,
      questions: [
        {
          order: 1,
          question: 'What is the execution order between synchronous code, microtasks (Promises), and macrotasks (setTimeout)?',
          options: [
            'Synchronous Call Stack → Microtasks → Macrotasks',
            'Macrotasks → Microtasks → Synchronous',
            'Microtasks → Synchronous → Macrotasks',
            'Random based on CPU speed',
          ],
          correctOptionIndex: 0,
          explanation: 'The JavaScript engine drains the call stack synchronously, then drains the entire microtask queue before processing the next macrotask.',
        },
        {
          order: 2,
          question: 'What is a closure in JavaScript?',
          options: [
            'A function that retains access to its outer lexical scope variables even after the outer function has returned',
            'A syntax error that stops script execution',
            'A method to close browser windows',
            'A tool to encrypt passwords',
          ],
          correctOptionIndex: 0,
          explanation: 'A closure allows an inner function to remember and access variables from its enclosing lexical scope after the outer function finishes.',
        },
        {
          order: 3,
          question: 'Which of the following array methods creates a new array without mutating the original array?',
          options: [
            'arr.map() and arr.filter()',
            'arr.push() and arr.pop()',
            'arr.splice() and arr.reverse()',
            'arr.sort()',
          ],
          correctOptionIndex: 0,
          explanation: 'map() and filter() return brand new arrays and adhere to pure functional immutability.',
        },
        {
          order: 4,
          question: 'What is the primary difference between `let` and `var` declaration in modern JavaScript?',
          options: [
            '`let` is block-scoped while `var` is function-scoped and hoists undefined',
            '`let` creates global variables only',
            '`var` cannot be reassigned',
            '`let` was deprecated in ES6',
          ],
          correctOptionIndex: 0,
          explanation: 'let and const respect block scope ({ ... }), preventing variable leakage across if statements and loops.',
        },
        {
          order: 5,
          question: 'What does the JavaScript nullish coalescing operator (`??`) evaluate?',
          options: [
            'Returns the right-hand operand only if the left operand is null or undefined (not false or 0)',
            'Returns true if both operands are strings',
            'Checks if two objects have the same reference',
            'Divides two numbers safely',
          ],
          correctOptionIndex: 0,
          explanation: 'Unlike || which checks for any falsy value (including 0 and ""), ?? specifically checks only for null or undefined.',
        },
        {
          order: 6,
          question: 'What is the purpose of `structuredClone()` in modern JavaScript environments?',
          options: [
            'Deeply clones complex objects including nested objects, arrays, and Dates without JSON serialization issues',
            'Creates a shallow copy like Object.assign',
            'Clones DOM nodes into HTML strings',
            'Minifies JavaScript bundles',
          ],
          correctOptionIndex: 0,
          explanation: 'structuredClone() performs deep recursive cloning of complex nested data structures natively in standard JavaScript.',
        },
      ],
    },
    {
      lessonNumber: 2,
      title: '2.2 DOM Manipulation, Event Bubbling & Delegation',
      durationMinutes: 45,
      summary: 'Direct DOM manipulation, Event bubbling vs Capturing, event.stopPropagation, and event delegation patterns.',
      writtenContent: `# 2.2 DOM Manipulation, Event Bubbling & Delegation

### 🌊 Event Flow: Capture ➔ Target ➔ Bubble
When an event occurs on a DOM element:
1. **Capturing Phase:** The event travels down from \`window\` ➔ \`document\` ➔ parent elements to the target.
2. **Target Phase:** The event reaches the element clicked.
3. **Bubbling Phase (Default):** The event bubbles back up from the target ➔ parent elements ➔ \`window\`.

\`\`\`javascript
// Efficient Event Delegation Pattern (1 listener for 1,000 list items)
const userList = document.querySelector('#user-list');

userList.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('.btn-delete');
  if (!deleteBtn) return;

  const userId = deleteBtn.dataset.userId;
  console.log('Deleting user ID:', userId);
});
\`\`\`

### 🎯 Benefits of Event Delegation
- **Zero Memory Leaks:** Avoids attaching individual event listeners to thousands of table or list rows.
- **Dynamic Elements:** Automatically works for items added to the DOM dynamically after initial render.`,
      questions: [
        {
          order: 1,
          question: 'What is the main performance benefit of Event Delegation in JavaScript?',
          options: [
            'Attaches a single listener to a parent container instead of hundreds of listeners to child nodes, conserving memory',
            'Speeds up database queries',
            'Encrypts user click events',
            'Converts JavaScript to WebAssembly',
          ],
          correctOptionIndex: 0,
          explanation: 'Event delegation leverages event bubbling to handle events for all children on a single parent listener.',
        },
        {
          order: 2,
          question: 'Which DOM method finds the nearest ancestor matching a CSS selector starting from the target element?',
          options: ['element.closest(selector)', 'element.parentElement', 'element.querySelector()', 'element.matches()'],
          correctOptionIndex: 0,
          explanation: 'element.closest() traverses the element and its parents up toward the document until it finds a match for the specified selector.',
        },
        {
          order: 3,
          question: 'What is the difference between `event.target` and `event.currentTarget`?',
          options: [
            'event.target is the actual element clicked, while event.currentTarget is the element the event listener is attached to',
            'event.target is always the <body> element',
            'They are always identical in every scenario',
            'event.currentTarget only exists during form submissions',
          ],
          correctOptionIndex: 0,
          explanation: 'event.target points to the originating clicked element, whereas currentTarget refers to the element handling the event.',
        },
        {
          order: 4,
          question: 'What does `event.stopPropagation()` accomplish?',
          options: [
            'Prevents the event from bubbling further up the DOM tree',
            'Prevents the browser default action (e.g. following a hyperlink)',
            'Deletes the element from the DOM',
            'Reloads the web page',
          ],
          correctOptionIndex: 0,
          explanation: 'stopPropagation() stops the event from propagating further along the capture or bubbling phases.',
        },
        {
          order: 5,
          question: 'What is the difference between `element.innerHTML` and `element.textContent`?',
          options: [
            'textContent sets plain text safely without parsing HTML (preventing XSS), while innerHTML parses markup',
            'innerHTML is faster and safer than textContent',
            'textContent is only supported on button tags',
            'innerHTML automatically sanitizes all script tags',
          ],
          correctOptionIndex: 0,
          explanation: 'textContent is secure against Cross-Site Scripting (XSS) because it never parses strings as executable HTML markup.',
        },
        {
          order: 6,
          question: 'Which object should you use to batch multiple DOM insertions to minimize browser layout recalculations?',
          options: ['document.createDocumentFragment()', 'window.localStorage', 'new ArrayBuffer()', 'document.body.append()'],
          correctOptionIndex: 0,
          explanation: 'DocumentFragment is an off-DOM container; appending it to the DOM causes a single reflow instead of multiple layout updates.',
        },
      ],
    },
    {
      lessonNumber: 3,
      title: '2.3 Asynchronous JavaScript: Promises, Async/Await & Microtasks',
      durationMinutes: 45,
      summary: 'Promise states, error handling with try/catch, Promise.all vs Promise.allSettled, and async concurrency.',
      writtenContent: `# 2.3 Asynchronous JavaScript: Promises, Async/Await & Microtasks

### 🎯 Promise States & Chaining
A \`Promise\` is in one of three states:
1. **Pending:** Initial state, neither fulfilled nor rejected.
2. **Fulfilled:** Operation completed successfully (\`resolve(value)\`).
3. **Rejected:** Operation failed (\`reject(error)\`).

\`\`\`javascript
// Parallel asynchronous operations with Promise.all
async function loadDashboardData(userId) {
  try {
    const [userRes, coursesRes, notificationsRes] = await Promise.all([
      fetch(\`/api/users/\${userId}\`),
      fetch(\`/api/courses\`),
      fetch(\`/api/notifications\`),
    ]);

    if (!userRes.ok || !coursesRes.ok) {
      throw new Error('Failed to load critical dashboard services');
    }

    const [user, courses, notifications] = await Promise.all([
      userRes.json(),
      coursesRes.json(),
      notificationsRes.json(),
    ]);

    return { user, courses, notifications };
  } catch (error) {
    console.error('Dashboard load failed:', error);
    throw error;
  }
}
\`\`\`

### 💡 Promise Combinators Comparison
- **\`Promise.all([p1, p2])\`**: Fails immediately if ANY promise rejects (fail-fast).
- **\`Promise.allSettled([p1, p2])\`**: Always waits for ALL promises to complete, returning an array of \`{ status: 'fulfilled'|'rejected', value|reason }\`.
- **\`Promise.race([p1, p2])\`**: Resolves or rejects as soon as the FIRST promise settles.`,
      questions: [
        {
          order: 1,
          question: 'What is the primary difference in behavior between `Promise.all()` and `Promise.allSettled()`?',
          options: [
            'Promise.all rejects immediately if any promise fails, while Promise.allSettled waits for all promises to finish regardless of success or failure',
            'Promise.all executes on the server while allSettled executes on client',
            'Promise.allSettled is synchronous',
            'Promise.all cannot accept arrays',
          ],
          correctOptionIndex: 0,
          explanation: 'Promise.all short-circuits on first rejection, whereas Promise.allSettled collects the individual outcome of every promise.',
        },
        {
          order: 2,
          question: 'What does calling an `async` function always return in JavaScript?',
          options: ['A Promise', 'An Array', 'A Callback function', 'undefined'],
          correctOptionIndex: 0,
          explanation: 'async functions always wrap their return value in a resolved Promise.',
        },
        {
          order: 3,
          question: 'How should unhandled rejected promises be caught in `async/await` syntax?',
          options: [
            'Wrapping the await expression in a try { ... } catch (error) { ... } block',
            'Using if (error) statements',
            'Adding a finally block without try',
            'Async functions cannot throw errors',
          ],
          correctOptionIndex: 0,
          explanation: 'try/catch blocks catch both synchronous runtime errors and rejected asynchronous Promise exceptions.',
        },
        {
          order: 4,
          question: 'What is a race condition in asynchronous JavaScript applications?',
          options: [
            'A bug where the timing or order of asynchronous responses causes unexpected state or incorrect data display',
            'A fast algorithm benchmark',
            'A feature in Next.js caching',
            'A CSS animation conflict',
          ],
          correctOptionIndex: 0,
          explanation: 'Race conditions happen when network responses return out of order, causing older requests to overwrite newer user state.',
        },
        {
          order: 5,
          question: 'What Web API should be used to cancel in-flight `fetch()` HTTP requests to avoid memory leaks?',
          options: ['AbortController & AbortSignal', 'window.stop()', 'Promise.cancel()', 'document.close()'],
          correctOptionIndex: 0,
          explanation: 'AbortController provides an AbortSignal that can be passed to fetch() to terminate active network requests.',
        },
        {
          order: 6,
          question: 'What happens when `await` is executed inside a JavaScript function?',
          options: [
            'It pauses execution of the async function until the promise settles, without blocking the browser main thread',
            'It freezes the entire operating system',
            'It converts the script into synchronous C++ code',
            'It reloads all DOM stylesheets',
          ],
          correctOptionIndex: 0,
          explanation: 'await pauses the surrounding async function context non-blockingly while allowing other browser tasks and user events to execute.',
        },
      ],
    },
    {
      lessonNumber: 4,
      title: '2.4 REST API Integration, fetch(), & Error Handling Patterns',
      durationMinutes: 50,
      summary: 'HTTP verbs, status codes, JSON serialization, bearer token authentication headers, and exponential backoff retry patterns.',
      writtenContent: `# 2.4 REST API Integration, fetch(), & Error Handling Patterns

### 🌐 HTTP Status Codes & Error Boundaries
- **2xx (Success):** \`200 OK\`, \`201 Created\`, \`204 No Content\`.
- **4xx (Client Errors):** \`400 Bad Request\`, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`429 Rate Limited\`.
- **5xx (Server Errors):** \`500 Internal Server Error\`, \`502 Bad Gateway\`, \`503 Service Unavailable\`.

\`\`\`typescript
// Resilient API Fetch Helper with Bearer Token & Error Extraction
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
    ...options.headers,
  };

  const response = await fetch(endpoint, { ...options, headers });

  if (!response.ok) {
    let errorMessage = \`HTTP \${response.status}: \${response.statusText}\`;
    try {
      const errorJson = await response.json();
      if (errorJson?.message) errorMessage = errorJson.message;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
\`\`\`

### 🛡️ Preventing Insecure API Requests
1. Never send sensitive auth secrets directly in query parameters (\`?api_key=...\`).
2. Always inspect \`response.ok\` before parsing JSON: \`fetch()\` does NOT reject on 404 or 500 status codes!`,
      questions: [
        {
          order: 1,
          question: 'Why does native `fetch()` NOT reject its Promise when the server responds with a 404 or 500 error code?',
          options: [
            'Because fetch only rejects on genuine network failures (e.g. offline, DNS lookup failure); HTTP status codes must be checked via response.ok',
            'Because 404 and 500 are considered successful requests in HTTP',
            'It is a bug in JavaScript',
            'Fetch only rejects on POST requests',
          ],
          correctOptionIndex: 0,
          explanation: 'fetch() fulfills its Promise as long as the server responded with HTTP headers, requiring developers to inspect response.ok.',
        },
        {
          order: 2,
          question: 'What is the correct HTTP request header for passing a JWT Bearer authentication token?',
          options: [
            'Authorization: Bearer <token>',
            'Authentication: Token <token>',
            'JWT-Token: <token>',
            'User-Token: Bearer <token>',
          ],
          correctOptionIndex: 0,
          explanation: 'Standard RFC 6750 specifies the Authorization: Bearer <token> header for transmitting credentials.',
        },
        {
          order: 3,
          question: 'Which HTTP status code signifies that the client has sent too many requests in a given amount of time (Rate Limited)?',
          options: ['429 Too Many Requests', '403 Forbidden', '502 Bad Gateway', '408 Request Timeout'],
          correctOptionIndex: 0,
          explanation: 'HTTP 429 indicates the user has exceeded their allocated rate-limiting quota.',
        },
        {
          order: 4,
          question: 'What is the purpose of Exponential Backoff in network communication?',
          options: [
            'Gradually increases the waiting delay between successive retry attempts to avoid overwhelming struggling servers',
            'Compresses JSON payloads before upload',
            'Encrypts SSL certificates',
            'Permanently terminates the server',
          ],
          correctOptionIndex: 0,
          explanation: 'Exponential backoff prevents catastrophic thundering herds by spacing out retry intervals exponentially (1s, 2s, 4s, 8s).',
        },
        {
          order: 5,
          question: 'Which HTTP method should be used when you want to update only specific fields of a resource rather than replacing it completely?',
          options: ['PATCH', 'PUT', 'POST', 'GET'],
          correctOptionIndex: 0,
          explanation: 'PATCH applies partial modifications to a resource, whereas PUT replaces the entire entity.',
        },
        {
          order: 6,
          question: 'What is Cross-Origin Resource Sharing (CORS) enforced by?',
          options: [
            'Enforced by the client web browser as a security sandbox mechanism',
            'Enforced by the PostgreSQL database driver',
            'Enforced by the user Wi-Fi router',
            'Enforced by GitHub repositories',
          ],
          correctOptionIndex: 0,
          explanation: 'CORS is a browser security mechanism that restricts cross-origin HTTP requests unless permitted by server response headers.',
        },
      ],
    },
    {
      lessonNumber: 5,
      title: '2.5 Client-Side Storage: LocalStorage, SessionStorage & Cookies',
      durationMinutes: 40,
      summary: 'Storage capacity limits, security vulnerabilities (XSS vs CSRF), httpOnly cookies, and structured state persistence.',
      writtenContent: `# 2.5 Client-Side Storage: LocalStorage, SessionStorage & Cookies

### 🗄️ Storage Mechanisms Comparison

| Feature | LocalStorage | SessionStorage | Cookies |
| :--- | :--- | :--- | :--- |
| **Capacity** | ~5MB - 10MB | ~5MB | ~4KB |
| **Lifespan** | Persistent until cleared | Cleared when browser tab closes | Configurable (\`Expires\` / \`Max-Age\`) |
| **Server Access** | Client-only (never sent in headers) | Client-only | Sent with every HTTP request |
| **XSS Vulnerable** | **Yes** (readable by JS) | **Yes** (readable by JS) | No if \`httpOnly\` flag is set |
| **CSRF Vulnerable**| No | No | Yes if \`SameSite\` not configured |

\`\`\`javascript
// Safe LocalStorage Wrapper with JSON Parsing & Error Boundaries
export const storage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage quota exceeded or disabled:', e);
    }
  },
  remove: (key: string): void => {
    window.localStorage.removeItem(key);
  },
};
\`\`\`

### 🔐 Security Best Practice: The httpOnly Cookie
Always store authentication session tokens in **httpOnly, Secure, SameSite=Strict/Lax cookies** to make token theft via malicious XSS injection impossible.`,
      questions: [
        {
          order: 1,
          question: 'Why should sensitive authentication tokens ideally be stored inside `httpOnly` cookies rather than `localStorage`?',
          options: [
            'httpOnly cookies cannot be accessed or read by client-side JavaScript, rendering stolen tokens via XSS attacks impossible',
            'localStorage can only store 10 bytes of data',
            'Cookies are 100x faster than localStorage',
            'localStorage only works in Safari',
          ],
          correctOptionIndex: 0,
          explanation: 'The httpOnly flag prevents document.cookie access from client scripts, eliminating token exfiltration through XSS.',
        },
        {
          order: 2,
          question: 'When is data stored in `sessionStorage` automatically cleared by the browser?',
          options: [
            'When the specific browser tab or window session is closed',
            'Every 15 minutes',
            'When the user refreshes the page',
            'Never; it stays forever like localStorage',
          ],
          correctOptionIndex: 0,
          explanation: 'sessionStorage persists across page reloads in the same tab, but is completely destroyed when the tab is closed.',
        },
        {
          order: 3,
          question: 'What is the approximate storage limit for `localStorage` in modern browsers?',
          options: ['5MB to 10MB per origin', '4KB total', 'Unlimited', '500MB'],
          correctOptionIndex: 0,
          explanation: 'Browsers typically allocate between 5MB and 10MB of storage per origin for localStorage.',
        },
        {
          order: 4,
          question: 'What is the purpose of the `SameSite=Lax` or `SameSite=Strict` cookie attribute?',
          options: [
            'Protects against Cross-Site Request Forgery (CSRF) by preventing the cookie from being sent in cross-site requests',
            'Compresses cookie data using GZIP',
            'Encrypts the cookie with RSA-2048',
            'Forces cookies to delete on midnight',
          ],
          correctOptionIndex: 0,
          explanation: 'SameSite restricts whether cookies are sent with cross-site requests, mitigating CSRF vulnerabilities.',
        },
        {
          order: 5,
          question: 'What happens if a user browser is in private/incognito mode or storage quota is full when calling `localStorage.setItem()`?',
          options: [
            'It throws a QuotaExceededError exception that must be wrapped in try/catch',
            'It crashes the computer',
            'It silently overwrites the operating system files',
            'It converts the value to a string automatically',
          ],
          correctOptionIndex: 0,
          explanation: 'Exceeding quota or operating in restrictive privacy modes throws an exception, necessitating defensive try/catch code.',
        },
        {
          order: 6,
          question: 'Can objects or arrays be stored directly in `localStorage` without serialization?',
          options: [
            'No, localStorage only stores strings, so objects must be serialized with JSON.stringify()',
            'Yes, localStorage natively stores binary objects',
            'Yes, with the saveObject() method',
            'Only numbers and booleans can be stored',
          ],
          correctOptionIndex: 0,
          explanation: 'localStorage key-value storage supports only strings, requiring JSON.stringify() on save and JSON.parse() on read.',
        },
      ],
    },
  ];

  for (const tData of mod2TopicsData) {
    const { questions, ...lessonProps } = tData;
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: mod2.id,
        ...lessonProps,
      },
    });

    await prisma.quiz.create({
      data: {
        lessonId: lesson.id,
        title: `${lesson.title} - Skill Quiz`,
        passingScore: 60,
        maxAttempts: 3,
        timeLimitMin: 15,
        questions: {
          create: questions.map((q) => ({
            order: q.order,
            question: q.question,
            questionText: q.question,
            optionsJson: JSON.stringify(q.options),
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
          })),
        },
      },
    });
  }

  console.log('✅ Created Module 2: Topics 6-10 with 30 MCQs');

  // 5. Module 3: Topics 11-15 (each with 8 MCQs)
  const mod3 = await prisma.module.create({
    data: {
      courseId: course.id,
      moduleNumber: 3,
      title: 'Part 3: React 19 Components, Hooks & Capstone Portfolio',
      description: 'Advanced React engineering: Component lifecycle, state management, custom hooks, and capstone deployment.',
    },
  });

  const mod3TopicsData = [
    {
      lessonNumber: 1,
      title: '3.1 React 19 Fundamentals: JSX, Virtual DOM & Reconciliation',
      durationMinutes: 45,
      summary: 'Declarative UI rendering, React element trees, Fiber architecture, and key reconciliation rules.',
      writtenContent: `# 3.1 React 19 Fundamentals: JSX, Virtual DOM & Reconciliation

### ⚛️ Declarative UI Architecture
In traditional imperative programming, you manually manipulate DOM nodes. In React, UI is a direct mathematical projection of application state:
$$\\text{UI} = f(\\text{state})$$

### 🌳 The Virtual DOM & Fiber Reconciliation
React creates a lightweight in-memory representation of the DOM tree. When state changes:
1. **Render Phase:** React executes component functions and computes a new Virtual DOM tree.
2. **Diffing Algorithm:** React compares the new Virtual DOM tree with the previous one.
3. **Commit Phase:** React batches and applies only the exact modified DOM nodes to the real browser DOM.

\`\`\`tsx
// Modern React 19 Component with Strict Types
interface UserProfileProps {
  name: string;
  role: string;
  avatarUrl?: string;
}

export function UserProfile({ name, role, avatarUrl }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
      <img
        src={avatarUrl || '/avatars/default.png'}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-white">{name}</h3>
        <p className="text-xs text-indigo-400 font-medium">{role}</p>
      </div>
    </div>
  );
}
\`\`\`

### 🔑 The Importance of the \`key\` Prop
Always provide stable, unique IDs as keys when rendering dynamic lists. Never use array index as keys for lists that can be reordered, inserted, or filtered!`,
      questions: [
        {
          order: 1,
          question: 'What is the primary role of the React Virtual DOM?',
          options: [
            'Maintains an in-memory representation of the UI to calculate minimal real DOM updates via diffing',
            'Replaces HTML entirely with C++ code',
            'Connects directly to the PostgreSQL database',
            'Encrypts client passwords',
          ],
          correctOptionIndex: 0,
          explanation: 'The Virtual DOM allows React to compute changes in memory before updating the real DOM efficiently in batches.',
        },
        {
          order: 2,
          question: 'Why should you avoid using array indices as `key` props on dynamic lists in React?',
          options: [
            'Reordering or deleting items causes React to reuse wrong component states and degrades reconciliation performance',
            'React throws a compile error if index is used',
            'Keys must always be random numbers',
            'Indices cannot be converted to strings',
          ],
          correctOptionIndex: 0,
          explanation: 'Using array indices as keys disrupts React item identity tracking during insertions or reordering, producing state corruption.',
        },
        {
          order: 3,
          question: 'What is JSX in React?',
          options: [
            'A syntax extension for JavaScript that compiles to native React.createElement() or JSX runtime calls',
            'A brand new programming language created by Google',
            'A database query language',
            'A CSS framework',
          ],
          correctOptionIndex: 0,
          explanation: 'JSX allows writing HTML-like markup inside JavaScript files, which the compiler transforms into standard JavaScript object calls.',
        },
        {
          order: 4,
          question: 'What is the difference between React Server Components (RSC) and Client Components?',
          options: [
            'Server Components render exclusively on the server with zero client bundle footprint, while Client Components render with browser interactivity',
            'Server components cannot display text',
            'Client components cannot use CSS',
            'There is no difference in React 19',
          ],
          correctOptionIndex: 0,
          explanation: 'Server Components execute only on the server, outputting pure HTML/JSON and keeping heavy dependencies out of client JS bundles.',
        },
        {
          order: 5,
          question: 'What happens during the "Render Phase" of React lifecycle?',
          options: [
            'React calls component functions to determine what should be displayed by creating Virtual DOM elements',
            'React physically inserts DOM elements into the browser window',
            'React sends emails to users',
            'React terminates all network requests',
          ],
          correctOptionIndex: 0,
          explanation: 'The render phase is a pure computation phase without DOM mutations where React calculates changes via diffing.',
        },
        {
          order: 6,
          question: 'What must all JSX tags have in React to be valid syntax?',
          options: [
            'All tags must be explicitly closed (e.g. <img /> or <input />)',
            'All tags must have an ID attribute',
            'All tags must be uppercase',
            'All tags must be wrapped in <table>',
          ],
          correctOptionIndex: 0,
          explanation: 'Unlike relaxed HTML parsing, JSX enforces strict XML-like rules where every tag must have a matching closing tag or self-close.',
        },
        {
          order: 7,
          question: 'What is a React Fragment (`<>...</>` or `<React.Fragment>`) used for?',
          options: [
            'Grouping a list of children elements without adding an extra unnecessary wrapper DOM node (like a redundant <div>)',
            'Creating background blur filters',
            'Triggering async database queries',
            'Restarting React application state',
          ],
          correctOptionIndex: 0,
          explanation: 'Fragments allow grouping multiple JSX elements without introducing unwanted wrapper nodes into the DOM.',
        },
        {
          order: 8,
          question: 'What does the term "Lifting State Up" mean in React architecture?',
          options: [
            'Moving shared state to the closest common ancestor component so multiple sibling components can access it',
            'Uploading state to a cloud database',
            'Converting useState to Redux',
            'Moving state into the window global object',
          ],
          correctOptionIndex: 0,
          explanation: 'Lifting state up involves moving state to the nearest common parent component to allow synchronized data sharing among siblings.',
        },
      ],
    },
    {
      lessonNumber: 2,
      title: '3.2 React State & Props: useState, useReducer & Controlled Forms',
      durationMinutes: 45,
      summary: 'State immutability, useState updater functions, useReducer action dispatching, and controlled form patterns.',
      writtenContent: `# 3.2 React State & Props: useState, useReducer & Controlled Forms

### ⚡ State Immutability: The Core Rule
Never mutate React state directly. Mutating existing object references bypasses React shallow equality checks (\`Object.is\`), preventing re-renders.

\`\`\`tsx
// Correct functional state update pattern
const [todos, setTodos] = useState<Todo[]>([]);

const toggleTodo = (id: string) => {
  setTodos((prevTodos) =>
    prevTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );
};
\`\`\`

### 📦 When to use \`useReducer\` vs \`useState\`
Use \`useReducer\` when:
- State logic is complex with multiple sub-values.
- The next state depends on previous state through distinct actions.
- You want to separate business logic from UI rendering.`,
      questions: [
        {
          order: 1,
          question: 'Why should you never mutate React state directly like `state.count = 5`?',
          options: [
            'React relies on shallow object reference equality (Object.is) to detect changes; mutating the reference avoids re-renders',
            'It causes immediate browser crash',
            'JavaScript forbids changing object properties',
            'It converts numbers to strings',
          ],
          correctOptionIndex: 0,
          explanation: 'Direct state mutation keeps the same memory reference, causing React shallow comparison to assume nothing changed and skip re-rendering.',
        },
        {
          order: 2,
          question: 'When should you pass an updater function to setState like `setCount(prev => prev + 1)`?',
          options: [
            'Whenever the new state depends directly on the previous state value, ensuring queued updates execute correctly',
            'Only when count is a string',
            'Only inside useEffect hooks',
            'Never; updater functions are deprecated',
          ],
          correctOptionIndex: 0,
          explanation: 'Functional updater forms ensure state updates read the latest pending state from the queue rather than stale closure snapshots.',
        },
        {
          order: 3,
          question: 'What is a "Controlled Component" in React forms?',
          options: [
            'A form element whose value is driven directly by React state via value and onChange handlers',
            'A component guarded by password auth',
            'A component rendered on the backend',
            'A button disabled by default',
          ],
          correctOptionIndex: 0,
          explanation: 'Controlled components have their current value managed exclusively by React state through value and onChange props.',
        },
        {
          order: 4,
          question: 'What are the two items returned by the `useReducer(reducer, initialState)` hook in React?',
          options: [
            'The current state and a dispatch function [state, dispatch]',
            'A promise and a callback function',
            'A getter and a setter function',
            'The initial state and an error object',
          ],
          correctOptionIndex: 0,
          explanation: 'useReducer returns [state, dispatch], where dispatch sends action objects to the pure reducer function.',
        },
        {
          order: 5,
          question: 'What must a React Reducer function always be?',
          options: [
            'A pure function with zero side-effects that takes (state, action) and returns the new state',
            'An asynchronous function that calls fetch',
            'A class with constructor',
            'A global variable',
          ],
          correctOptionIndex: 0,
          explanation: 'Reducers must be pure functions: given the same state and action, they must always return the exact same new state object.',
        },
        {
          order: 6,
          question: 'What is "Props Drilling" and how can it be resolved in large React applications?',
          options: [
            'Passing props down through multiple layers of components that do not need them; resolved with Context API or state stores',
            'Drilling holes into motherboard hardware',
            'A method to speed up React build time',
            'A technique to bundle CSS with JavaScript',
          ],
          correctOptionIndex: 0,
          explanation: 'Props drilling is passing props through intermediaries; resolved via React Context, Zustand, or component composition.',
        },
        {
          order: 7,
          question: 'Can props passed into a child React component be modified by the child directly?',
          options: [
            'No, props are read-only and immutable from the perspective of child components',
            'Yes, child components can modify parent props anytime',
            'Only if the prop is a number',
            'Only in class components',
          ],
          correctOptionIndex: 0,
          explanation: 'Props follow unidirectional top-down data flow and are strictly read-only in child components.',
        },
        {
          order: 8,
          question: 'What happens if you initialize state with an expensive computation `useState(computeHeavyData())` vs `useState(() => computeHeavyData())`?',
          options: [
            'The arrow function (lazy initial state) runs only on initial mount, while the direct call executes on EVERY render',
            'They perform identically with zero difference',
            'The arrow function causes a memory leak',
            'The direct call is 10x faster',
          ],
          correctOptionIndex: 0,
          explanation: 'Passing an initializer function () => compute() tells React to run the expensive setup only during the initial mount.',
        },
      ],
    },
    {
      lessonNumber: 3,
      title: '3.3 Side Effects & Lifecycle: useEffect, useLayoutEffect & Cleanup',
      durationMinutes: 45,
      summary: 'Dependency array mechanics, memory leak prevention, cleanup functions, AbortController integration, and useLayoutEffect.',
      writtenContent: `# 3.3 Side Effects & Lifecycle: useEffect, useLayoutEffect & Cleanup

### 🔄 The \`useEffect\` Dependency Array Rules
1. **No Dependency Array (\`useEffect(fn)\`):** Runs after EVERY render.
2. **Empty Dependency Array (\`useEffect(fn, [])\`):** Runs ONCE after initial mount.
3. **With Dependencies (\`useEffect(fn, [a, b])\`):** Runs on mount and whenever \`a\` or \`b\` changes.

\`\`\`tsx
// Resilient useEffect with AbortController Cleanup
useEffect(() => {
  const controller = new AbortController();

  async function fetchLesson() {
    try {
      const res = await fetch(\`/api/lessons/\${lessonId}\`, {
        signal: controller.signal,
      });
      const data = await res.json();
      setLesson(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Fetch failed:', err);
      }
    }
  }

  fetchLesson();

  // Cleanup function runs before re-running effect and on unmount
  return () => {
    controller.abort();
  };
}, [lessonId]);
\`\`\`

### ⏱️ \`useEffect\` vs \`useLayoutEffect\`
- **\`useEffect\` (Standard):** Asynchronous and non-blocking; runs after browser paints to screen.
- **\`useLayoutEffect\` (Rare):** Synchronous; runs after DOM mutation but BEFORE browser paints (useful for measuring DOM elements to prevent visual flickers).`,
      questions: [
        {
          order: 1,
          question: 'When does the cleanup function returned from `useEffect` execute in React?',
          options: [
            'Before the component unmounts and before re-running the effect when dependencies change',
            'Only on initial application startup',
            'Immediately before JSX is parsed',
            'Only when a form is submitted',
          ],
          correctOptionIndex: 0,
          explanation: 'React runs the cleanup function to tear down subscriptions/timers before re-executing the effect with new dependencies and when unmounting.',
        },
        {
          order: 2,
          question: 'What happens if you omit the dependency array completely from `useEffect(() => { ... })`?',
          options: [
            'The effect executes after EVERY single render of the component',
            'The effect runs only once on mount',
            'The effect never runs',
            'React throws a compile error',
          ],
          correctOptionIndex: 0,
          explanation: 'Omitting the second argument means React will run the effect after every completed render cycle.',
        },
        {
          order: 3,
          question: 'What is the key timing difference between `useEffect` and `useLayoutEffect`?',
          options: [
            'useLayoutEffect fires synchronously after DOM mutation before browser paint, while useEffect fires asynchronously after paint',
            'useEffect runs on the server, useLayoutEffect on client',
            'useLayoutEffect cannot have a cleanup function',
            'There is no timing difference',
          ],
          correctOptionIndex: 0,
          explanation: 'useLayoutEffect runs synchronously before the browser paints, preventing visual layout glitches when measuring DOM.',
        },
        {
          order: 4,
          question: 'Why should you include all reactive variables (props, state) used inside useEffect in its dependency array?',
          options: [
            'To ensure the effect closure always has access to fresh, up-to-date state rather than stale values',
            'To increase memory usage',
            'To disable React StrictMode',
            'To prevent JSX compilation',
          ],
          correctOptionIndex: 0,
          explanation: 'Omitting reactive values causes stale closure bugs where the effect reads outdated state or props.',
        },
        {
          order: 5,
          question: 'How do you prevent setting state on an unmounted component after an asynchronous fetch completes?',
          options: [
            'Use an AbortController in the useEffect cleanup function to cancel the fetch request',
            'Call window.location.reload()',
            'Set state inside setTimeout',
            'Disable JavaScript on unmount',
          ],
          correctOptionIndex: 0,
          explanation: 'Canceling in-flight requests with AbortController in the cleanup function eliminates memory leaks and unmounted state updates.',
        },
        {
          order: 6,
          question: 'In React 18 & 19 StrictMode in development, why does useEffect run twice on initial mount?',
          options: [
            'To stress-test and verify that effect cleanup logic properly handles teardown and setup without memory leaks',
            'Because the browser reloaded the page',
            'Because of a bug in Vite and Next.js',
            'To test database connection speed',
          ],
          correctOptionIndex: 0,
          explanation: 'StrictMode intentionally mounts, unmounts, and re-mounts components in development to expose missing cleanup logic.',
        },
        {
          order: 7,
          question: 'Can you mark the callback passed directly to `useEffect(async () => { ... })` as `async`?',
          options: [
            'No, because async functions return a Promise instead of a cleanup function; define the async function inside the effect',
            'Yes, async callbacks are recommended',
            'Only in Next.js Server Components',
            'Only if using Axios',
          ],
          correctOptionIndex: 0,
          explanation: 'useEffect expects either nothing or a cleanup function; returning a Promise directly causes unexpected behavior.',
        },
        {
          order: 8,
          question: 'What is an infinite re-render loop typically caused by in `useEffect`?',
          options: [
            'Updating a state variable inside useEffect that is listed in the effect dependency array without a conditional guard',
            'Using CSS Grid with Flexbox',
            'Rendering more than 10 buttons',
            'Having an empty dependency array',
          ],
          correctOptionIndex: 0,
          explanation: 'Updating state inside an effect that depends on that same state triggers an endless cycle of render ➔ effect ➔ update ➔ render.',
        },
      ],
    },
    {
      lessonNumber: 4,
      title: '3.4 Custom Hooks, Context API & Performance Optimization (useMemo/useCallback)',
      durationMinutes: 45,
      summary: 'Reusable logic encapsulation with custom hooks, React Context design patterns, and memoization with useMemo & useCallback.',
      writtenContent: `# 3.4 Custom Hooks, Context API & Performance Optimization

### 🎣 Encapsulating Logic with Custom Hooks
Custom hooks must start with the prefix \`use\` (e.g. \`useDebounce\`, \`useLocalStorage\`, \`useMediaQuery\`). They allow extracting stateful logic without changing component hierarchy.

\`\`\`tsx
// Custom Hook: useDebounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

### ⚡ Optimization Primitives: When to use \`useMemo\` and \`useCallback\`
- **\`useMemo(() => compute(), [deps])\`**: Caches the *result* of an expensive calculation across re-renders.
- **\`useCallback(fn, [deps])\`**: Caches the *function definition* itself between renders to prevent breaking child component memoization (\`React.memo\`).`,
      questions: [
        {
          order: 1,
          question: 'What naming convention MUST all custom hooks follow in React?',
          options: [
            'Must start with the lowercase prefix "use" (e.g. useAuth, useDebounce)',
            'Must start with "get"',
            'Must end with "Hook"',
            'Must be written in all capital letters',
          ],
          correctOptionIndex: 0,
          explanation: 'React linter and compiler rely on the "use" prefix to identify and enforce the Rules of Hooks on custom hooks.',
        },
        {
          order: 2,
          question: 'What is the difference between `useMemo` and `useCallback` in React?',
          options: [
            'useMemo caches the calculated value of a function, while useCallback caches the function definition itself',
            'useMemo is for CSS, useCallback is for HTML',
            'useCallback runs on server, useMemo runs on client',
            'They are aliases for the exact same implementation',
          ],
          correctOptionIndex: 0,
          explanation: 'useMemo(() => value, deps) returns a memoized value; useCallback(fn, deps) returns a memoized function reference.',
        },
        {
          order: 3,
          question: 'What does `React.memo(Component)` do?',
          options: [
            'Higher-Order Component that skips re-rendering the wrapped component if its props have not shallowly changed',
            'Memorizes user passwords in database',
            'Converts components to Server Actions',
            'Caches network images on disk',
          ],
          correctOptionIndex: 0,
          explanation: 'React.memo wraps a component to memoize its rendered output, preventing re-renders when incoming props remain shallowly identical.',
        },
        {
          order: 4,
          question: 'What is a common pitfall when using the React Context API?',
          options: [
            'All consumer components re-render whenever any value inside the Context Provider value object changes',
            'Context cannot be used in functional components',
            'Context requires Redux to function',
            'Context is limited to 1 component per app',
          ],
          correctOptionIndex: 0,
          explanation: 'Any update to a context provider value triggers re-renders across all components subscribing to that context via useContext.',
        },
        {
          order: 5,
          question: 'What is the purpose of a `useDebounce` custom hook in search input fields?',
          options: [
            'Delays firing API search requests until the user stops typing for a designated duration (e.g. 300ms)',
            'Forces instant form submission on every keystroke',
            'Encrypts typed characters',
            'Clears the search input automatically',
          ],
          correctOptionIndex: 0,
          explanation: 'Debouncing delays execution until a pause in typing occurs, dramatically reducing redundant backend search API queries.',
        },
        {
          order: 6,
          question: 'Can custom React hooks call other built-in React hooks like `useState` and `useEffect`?',
          options: [
            'Yes, custom hooks are designed specifically to compose built-in hooks and encapsulate reusable stateful logic',
            'No, custom hooks can only contain pure math functions',
            'Only if using TypeScript',
            'Only on mobile browsers',
          ],
          correctOptionIndex: 0,
          explanation: 'Custom hooks compose native React hooks (useState, useEffect, useId, etc.) into reusable modular units.',
        },
        {
          order: 7,
          question: 'Why should you NOT wrap every single function or value in `useCallback` and `useMemo` indiscriminately?',
          options: [
            'The overhead of dependency array allocation and comparison on trivial functions can exceed the negligible cost of recreation',
            'It crashes the JavaScript garbage collector',
            'React disables TypeScript when memoized',
            'It makes all pages load in light mode',
          ],
          correctOptionIndex: 0,
          explanation: 'Indiscriminate memoization adds memory overhead and code complexity without measurable performance benefits for simple functions.',
        },
        {
          order: 8,
          question: 'How should you split React Context to prevent unnecessary re-renders across consumers?',
          options: [
            'Split state and dispatch into two separate contexts (e.g. AuthStateContext and AuthDispatchContext)',
            'Put all application state into a single global context',
            'Disable Context completely and use window globals',
            'Convert context values into strings',
          ],
          correctOptionIndex: 0,
          explanation: 'Separating frequently changing state from stable dispatch functions prevents dispatch-only components from re-rendering.',
        },
      ],
    },
    {
      lessonNumber: 5,
      title: '3.5 Capstone Architecture: Full-Stack Integration, Git Workflow & Production Deployment',
      durationMinutes: 60,
      summary: 'Production deployment guidelines, verifiable SHA-256 certificate workflow, GitHub portfolio curation, and LinkedIn review submission.',
      writtenContent: `# 3.5 Capstone Architecture: Full-Stack Integration, Git Workflow & Production Deployment

### 🏆 Capstone Certification & Review Criteria
To earn your **DevAscent Verifiable Digital Certificate** and **Official Letter of Recommendation (LOR)**:

1. **Complete all 15 Topics & Quizzes**: Achieve at least 60% passing score on every topic quiz.
2. **Build a Production Capstone Project**: Choose 1 of the 5 capstone project blueprints in the Capstone Guide.
3. **Push to Public GitHub Repository**:
   - Clean commit history with conventional commits (\`feat:\`, \`fix:\`, \`docs:\`).
   - Professional \`README.md\` containing architecture diagrams, feature highlights, and live demo link.
4. **Deploy Live**: Deploy your project on Vercel, Netlify, Render, or Railway.
5. **Share on LinkedIn**: Share a post showcasing your project demo, key learnings, and tag \`#DevAscentAcademy\`.
6. **Submit Capstone Form**: Submit your links on the official **Submit Capstone** page for verification.

\`\`\`markdown
<!-- Example Capstone README Structure -->
# 🚀 DevAscent Capstone: High-Performance Web Application

## 🌟 Features
- ⚡ 100/100 Lighthouse Performance with Next.js App Router
- 🔒 Cryptographic Auth & Role-Based Access Control
- 📱 Responsive 375px+ UI with Tailwind CSS & Glassmorphic tokens
\`\`\``,
      exercisePdfTitle: 'Official Capstone Submission Rubric & GitHub Guidelines PDF',
      exercisePdfUrl: 'https://drive.google.com/file/d/1dtrV7i90kKfAumqe0kLSfgYdYFJmevbk/preview',
      questions: [
        {
          order: 1,
          question: 'What are the required deliverables for submitting your DevAscent Capstone Project?',
          options: [
            'Public GitHub repository URL with detailed README and a live LinkedIn post showcase link',
            'A screenshot emailed to support',
            'A zip file on Google Drive',
            'No deliverables required',
          ],
          correctOptionIndex: 0,
          explanation: 'Official certification requires a public GitHub repository demonstrating clean code and a public LinkedIn post for industry visibility.',
        },
        {
          order: 2,
          question: 'What makes DevAscent Academy certificates tamper-proof and verifiable by tech employers?',
          options: [
            'Each certificate is stamped with an immutable SHA-256 cryptographic hash registered in the public verification ledger',
            'They are printed on physical paper only',
            'They are password protected zip files',
            'They are stored only on client computers',
          ],
          correctOptionIndex: 0,
          explanation: 'Certificates feature a unique SHA-256 cryptographic hash that employers can verify instantly on the DevAscent public ledger.',
        },
        {
          order: 3,
          question: 'What is the standard git branching workflow recommended for production software development?',
          options: [
            'Feature branches (feature/...) branched from main/develop, merged via reviewed Pull Requests',
            'Directly committing all code to main branch on production',
            'Never creating git commits',
            'Sharing code via email attachments',
          ],
          correctOptionIndex: 0,
          explanation: 'Feature branch workflows ensure code is isolated, tested, and reviewed before merging into the production main branch.',
        },
        {
          order: 4,
          question: 'What information must be included in a professional GitHub repository README.md for a capstone project?',
          options: [
            'Project overview, live deployment URL, tech stack, architecture decisions, and setup instructions',
            'Only the author name',
            'A single image without text',
            'The entire package-lock.json file',
          ],
          correctOptionIndex: 0,
          explanation: 'A comprehensive README communicates the project value, technical architecture, and enables evaluators to test the deployment.',
        },
        {
          order: 5,
          question: 'What is the purpose of Environment Variables (`.env`) in web application deployments?',
          options: [
            'Securing API keys, database secrets, and configuration values outside source control repositories',
            'Formatting CSS stylesheets',
            'Minifying JavaScript files',
            'Speeding up image download times',
          ],
          correctOptionIndex: 0,
          explanation: 'Environment variables keep sensitive database credentials and private API keys out of public git repositories.',
        },
        {
          order: 6,
          question: 'What is the role of CI/CD (Continuous Integration / Continuous Deployment) pipelines in modern web hosting?',
          options: [
            'Automatically runs linting, automated tests, and builds/deploys the project upon pushing git commits',
            'Deletes old database records automatically',
            'Generates artificial user traffic',
            'Forces users to clear browser cookies',
          ],
          correctOptionIndex: 0,
          explanation: 'CI/CD pipelines automate testing, bundle optimization, and seamless production deployments upon code changes.',
        },
        {
          order: 7,
          question: 'What is Lighthouse audit in Chrome DevTools primarily used to evaluate?',
          options: [
            'Performance, Accessibility (A11y), Best Practices, and Search Engine Optimization (SEO)',
            'Database query response times',
            'Git branch history',
            'Wi-Fi signal strength',
          ],
          correctOptionIndex: 0,
          explanation: 'Google Lighthouse evaluates web applications across Performance, Accessibility, Best Practices, and SEO metrics.',
        },
        {
          order: 8,
          question: 'After submitting your Capstone form on DevAscent Academy, what happens next in the verification process?',
          options: [
            'Admin and evaluator review your GitHub repository and LinkedIn post, approve your submission, and issue your verifiable certificate',
            'Your account is automatically deleted',
            'The course resets back to lesson 1',
            'You must retake all 15 quizzes again',
          ],
          correctOptionIndex: 0,
          explanation: 'Submissions enter "Pending Admin Review" where evaluators verify project requirements before issuing verifiable certificates.',
        },
      ],
    },
  ];

  for (const tData of mod3TopicsData) {
    const { questions, ...lessonProps } = tData;
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: mod3.id,
        ...lessonProps,
      },
    });

    await prisma.quiz.create({
      data: {
        lessonId: lesson.id,
        title: `${lesson.title} - Skill Quiz`,
        passingScore: 60,
        maxAttempts: 3,
        timeLimitMin: 15,
        questions: {
          create: questions.map((q) => ({
            order: q.order,
            question: q.question,
            questionText: q.question,
            optionsJson: JSON.stringify(q.options),
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
          })),
        },
      },
    });
  }

  console.log('✅ Created Module 3: Topics 11-15 with 40 MCQs');
  console.log('🎉 Successfully seeded 15 Topics, 15 Quizzes (100 MCQs total), and 3 AI Overview Videos for Web Development Internship!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
