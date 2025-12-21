# 🗺️ Site Structure & Navigation

## Visual Site Map

```
                    🏠 Home (index.md)
                    yourusername.github.io
                           |
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    📝 Content         🎯 Portfolio        💬 Connect
        │                  │                  │
        ├─ About          ├─ CV              └─ Contact
        ├─ Blog           ├─ Publications
        └─ Teaching       └─ Projects
```

## Page Hierarchy

### 1. 🏠 Home Page (`index.md`)
**Purpose:** First impression, quick overview
**Content:**
- Welcome message
- Brief introduction
- Recent highlights
- Quick links to main sections
- Latest blog posts preview

**File:** `index.md`
**URL:** `https://yourusername.github.io/`

---

### 2. 👤 About Page (`about.md`)
**Purpose:** Tell your story
**Content:**
- Profile photo
- Background and journey
- Current work and interests
- Technical expertise
- Personal interests
- Call to action

**File:** `about.md`
**URL:** `https://yourusername.github.io/about/`

---

### 3. 📄 CV Page (`cv.md`)
**Purpose:** Formal resume/curriculum vitae
**Content:**
- Education
- Professional experience
- Research interests
- Technical skills
- Awards and honors
- Teaching experience
- Publications (brief list)
- Talks and presentations
- Downloadable PDF version

**File:** `cv.md`
**URL:** `https://yourusername.github.io/cv/`

---

### 4. 📚 Publications Page (`publications.md`)
**Purpose:** Showcase research and writings
**Content:**
- Journal articles
- Conference papers
- Workshop papers
- Technical reports
- Theses
- Patents
- Popular science articles
- Citation metrics
- Links to papers, code, videos

**File:** `publications.md`
**URL:** `https://yourusername.github.io/publications/`

---

### 5. 🚀 Projects Page (`projects.md`)
**Purpose:** Portfolio of work
**Content:**
- Featured projects (3-5 main ones)
- Research implementations
- Fun side projects
- Open source contributions
- Hackathon projects
- YouTube demos
- Links to GitHub, demos, papers

**File:** `projects.md`
**URL:** `https://yourusername.github.io/projects/`

---

### 6. ✍️ Blog (`blog.md` + `_posts/`)
**Purpose:** Share thoughts and tutorials
**Content:**
- All blog posts listed
- Topics/categories
- Featured posts
- RSS feed
- Search functionality (optional)

**Main File:** `blog.md`
**Posts Folder:** `_posts/`
**URL:** `https://yourusername.github.io/blog/`
**Post URL format:** `https://yourusername.github.io/YYYY/MM/DD/post-title/`

---

### 7. 🎓 Teaching Page (`teaching.md`)
**Purpose:** Educational resources
**Content:**
- Tutorial series
- Course materials
- Video tutorials
- Written guides (beginner to advanced)
- Code templates and tools
- Cheat sheets
- Office hours info
- Past presentations

**File:** `teaching.md`
**URL:** `https://yourusername.github.io/teaching/`

---

### 8. 📧 Contact Page (`contact.md`)
**Purpose:** Ways to connect
**Content:**
- Email addresses
- Social media links
- Contact form
- Professional inquiries info
- Student mentoring info
- Meeting scheduler
- Current location
- Response time expectations

**File:** `contact.md`
**URL:** `https://yourusername.github.io/contact/`

---

## Navigation Flow

### Primary Navigation (Header)
```
[Your Name/Logo]  About | CV | Publications | Projects | Blog | Teaching | Contact
```

### Typical User Journeys

**Journey 1: Recruiter/Hiring Manager**
```
Home → CV → Projects → Publications → Contact
```

**Journey 2: Student/Learner**
```
Home → Teaching → Blog → Projects → Contact
```

**Journey 3: Researcher/Collaborator**
```
Home → Publications → CV → Projects → Contact
```

**Journey 4: Casual Visitor**
```
Home → About → Blog → Projects
```

## Content Organization

### Collections

**Blog Posts** (`_posts/`)
```
_posts/
├── 2024-11-06-getting-started-ros2.md
├── 2024-10-15-slam-tutorial.md
├── 2024-09-20-python-optimization.md
└── ... (add more posts)
```

**Projects** (`_projects/`)
```
_projects/
├── autonomous-navigation.md
├── robotic-manipulation.md
├── object-tracking.md
└── ... (add more projects)
```

**Publications** (`_publications/`)
```
_publications/
├── paper-2024-slam.md
├── paper-2023-manipulation.md
└── ... (add more publications)
```

### Assets Organization

```
assets/
├── images/
│   ├── profile.jpg              ← Your photo
│   ├── favicon.ico              ← Site icon
│   ├── projects/                ← Project screenshots
│   │   ├── nav-system.png
│   │   ├── manipulation.png
│   │   └── tracking.png
│   └── blog/                    ← Blog post images
│       ├── ros2-setup.png
│       └── slam-diagram.jpg
├── cv/
│   └── your-name-cv.pdf         ← Downloadable CV
└── cheatsheets/
    ├── ros2-commands.pdf
    └── python-robotics.pdf
```

## URL Structure

```
Main Site:
/                          → Home page
/about/                    → About page
/cv/                       → CV page
/publications/             → Publications list
/projects/                 → Projects list
/blog/                     → Blog home
/teaching/                 → Teaching resources
/contact/                  → Contact page

Blog Posts:
/YYYY/MM/DD/post-title/    → Individual blog post
/blog/topics/robotics/     → Posts by topic (optional)

Projects:
/projects/project-name/    → Individual project page

Publications:
/publications/paper-name/  → Individual publication page

Assets:
/assets/images/...         → Images
/assets/cv/...             → CV PDFs
/feed.xml                  → RSS feed
```

## Key Features Per Page

| Page | Search | Comments | Downloads | External Links | Media |
|------|--------|----------|-----------|----------------|-------|
| Home | ❌ | ❌ | ❌ | ✅ | ✅ |
| About | ❌ | ❌ | ❌ | ✅ | ✅ |
| CV | ❌ | ❌ | ✅ PDF | ❌ | ❌ |
| Publications | ✅ | ❌ | ✅ PDF | ✅ | ❌ |
| Projects | ✅ | ❌ | ✅ Code | ✅ | ✅ |
| Blog | ✅ | ✅* | ❌ | ✅ | ✅ |
| Teaching | ✅ | ❌ | ✅ | ✅ | ✅ |
| Contact | ❌ | ❌ | ❌ | ✅ | ❌ |

*Optional - can add comment system like Disqus or Giscus

## Mobile Navigation

On small screens, navigation collapses to a hamburger menu:
```
☰  [Your Name]
```

Tap to reveal:
```
☰ Menu
  ├── About
  ├── CV
  ├── Publications
  ├── Projects
  ├── Blog
  ├── Teaching
  └── Contact
```

## Footer (All Pages)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        [GitHub]  [LinkedIn]  [Twitter]  [YouTube]

             © 2024 Your Name
          Built with Jekyll & GitHub Pages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## SEO Structure

Each page includes:
- **Title tag:** "Page Title | Your Name"
- **Meta description:** Brief page description
- **Open Graph tags:** For social media sharing
- **Canonical URL:** Proper URL structure
- **Schema.org markup:** For better search results

## Adding New Sections

To add a new section:

1. Create `newsection.md` in root
2. Add front matter:
```yaml
---
layout: page
title: New Section
permalink: /newsection/
---
```
3. Add to `_config.yml` navigation:
```yaml
header_pages:
  - newsection.md
```

## Best Practices

✅ **Clear hierarchy** - Max 2-3 clicks to any page
✅ **Consistent navigation** - Same menu on every page
✅ **Descriptive URLs** - `/projects/` not `/p/`
✅ **Mobile-friendly** - Responsive design
✅ **Fast loading** - Optimized images
✅ **Accessibility** - Proper heading structure
✅ **Internal linking** - Connect related content

---

This structure gives you a complete, professional website that showcases your work effectively!
