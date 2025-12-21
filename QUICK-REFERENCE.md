# Quick Reference Guide

## Common Commands

### Local Development
```bash
# Install dependencies (first time only)
bundle install

# Start local server
bundle exec jekyll serve

# Start with drafts visible
bundle exec jekyll serve --drafts

# Clear cache and rebuild
bundle exec jekyll clean
bundle exec jekyll serve
```

View site at: http://localhost:4000

### Git Commands
```bash
# Add all changes
git add .

# Commit with message
git commit -m "Update content"

# Push to GitHub (deploys automatically)
git push origin main

# Check status
git status
```

## File Naming Conventions

### Blog Posts
Format: `YYYY-MM-DD-title-with-dashes.md`
Example: `2024-11-06-my-first-post.md`
Location: `_posts/`

### Projects
Format: `project-name.md`
Example: `autonomous-robot.md`
Location: `_projects/`

### Images
Location: `assets/images/`
- Blog images: `assets/images/blog/`
- Project images: `assets/images/projects/`
- Profile: `assets/images/profile.jpg`

## Front Matter Templates

### Blog Post
```yaml
---
layout: post
title: "Post Title"
date: 2024-11-06 10:00:00 -0000
categories: [category1, category2]
tags: [tag1, tag2, tag3]
author: Your Name
excerpt: "Brief description for SEO"
image: /assets/images/blog/post-image.jpg
---
```

### Project
```yaml
---
layout: project
title: "Project Name"
date: 2024-11-06
tech: [Python, ROS2, PyTorch]
github: https://github.com/yourusername/project
demo: https://demo-link.com
image: /assets/images/projects/project.jpg
---
```

### Regular Page
```yaml
---
layout: page
title: "Page Title"
permalink: /page-url/
---
```

## Markdown Quick Reference

### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
```

### Links
```markdown
[Link text](https://url.com)
[Internal link](/page-url/)
```

### Images
```markdown
![Alt text](/assets/images/image.jpg)
![Alt text](/assets/images/image.jpg){: style="max-width: 500px;"}
```

### Code Blocks
````markdown
```python
def hello():
    print("Hello, world!")
```
````

### Lists
```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Bold and Italic
```markdown
**bold text**
*italic text*
***bold and italic***
```

### Quotes
```markdown
> This is a blockquote
```

### Horizontal Rule
```markdown
---
```

## Useful Snippets

### YouTube Embed
```html
<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/VIDEO_ID" 
  frameborder="0" allowfullscreen>
</iframe>
```

### Button Link
```markdown
[Download PDF](/path/to/file.pdf){: .button}
```

### Two-Column Layout
```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
  <div>Column 1 content</div>
  <div>Column 2 content</div>
</div>
```

### Image with Caption
```html
<figure>
  <img src="/assets/images/image.jpg" alt="Description">
  <figcaption>Caption text here</figcaption>
</figure>
```

## Troubleshooting

### Site not updating after push?
- Wait 2-3 minutes for GitHub Pages to rebuild
- Check GitHub Actions tab for build errors
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Images not showing?
- Check file path starts with `/assets/`
- Verify image file exists
- Check file name matches exactly (case-sensitive)

### Changes not showing locally?
- Stop server (Ctrl+C)
- Run: `bundle exec jekyll clean`
- Restart: `bundle exec jekyll serve`
- Hard refresh browser (Ctrl+Shift+R)

### Ruby/Bundle errors?
```bash
gem install bundler
bundle update
bundle install
```

## Site Structure Quick View

```
├── _config.yml          ← Site settings
├── index.md            ← Home page
├── about.md            ← About page
├── cv.md               ← CV page
├── _posts/             ← Blog posts here
│   └── YYYY-MM-DD-title.md
├── _projects/          ← Project pages here
│   └── project-name.md
├── assets/
│   ├── images/         ← All images here
│   ├── cv/            ← CV PDFs here
│   └── css/           ← Custom CSS here
└── _site/             ← Generated site (don't edit)
```

## Testing Checklist

Before pushing changes:
- [ ] Preview locally looks good
- [ ] All links work
- [ ] Images load
- [ ] No typos
- [ ] Mobile view looks good
- [ ] Code blocks formatted correctly

## Deployment Workflow

1. Make changes to files
2. Test locally: `bundle exec jekyll serve`
3. Commit: `git add . && git commit -m "Description"`
4. Push: `git push origin main`
5. Wait 2-3 minutes
6. Check live site

## Resources

- [Markdown Guide](https://www.markdownguide.org/basic-syntax/)
- [Jekyll Docs](https://jekyllrb.com/docs/)
- [Liquid Template Guide](https://shopify.github.io/liquid/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

---

**Pro Tip:** Bookmark this file for quick reference!
