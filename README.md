# Personal Website - Setup Guide

A professional personal website built with Jekyll, perfect for software/robotics engineers to showcase their CV, publications, projects, blog, and teaching materials.

## 🚀 Quick Start

### Prerequisites

- Git installed
- Ruby 2.7+ and Bundler (for local development)
- A GitHub account (for free hosting)

### Option 1: Deploy to GitHub Pages (Recommended - FREE!)

This is the easiest way to get your site online for free at `yourusername.github.io`.

1. **Create a GitHub repository**
   - Go to GitHub and create a new repository
   - Name it: `yourusername.github.io` (replace `yourusername` with your actual GitHub username)
   - Make it public

2. **Upload your files**
   ```bash
   cd personal-website
   git init
   git add .
   git commit -m "Initial commit: Personal website"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Select branch: `main` and folder: `/ (root)`
   - Click Save

4. **Wait 2-3 minutes** and visit `https://yourusername.github.io`

That's it! Your site is live! 🎉

### Option 2: Local Development

To preview your site locally before deploying:

1. **Install dependencies**
   ```bash
   cd personal-website
   bundle install
   ```

2. **Run the development server**
   ```bash
   bundle exec jekyll serve
   ```

3. **View your site** at `http://localhost:4000`

The site will auto-reload when you make changes to files.

## 📝 Customization Guide

### 1. Update Site Configuration

Edit `_config.yml` and replace placeholder text:

```yaml
title: Your Actual Name
email: your.actual.email@example.com
description: Your actual description
github_username: yourgithubusername
linkedin_username: yourlinkedin
# ... etc
```

### 2. Customize Pages

Edit the `.md` files in the root directory:
- `index.md` - Home page
- `about.md` - About/bio page
- `cv.md` - Your CV
- `publications.md` - Your publications
- `projects.md` - Your projects
- `blog.md` - Blog landing page
- `teaching.md` - Teaching materials
- `contact.md` - Contact information

### 3. Add Your Content

**Add a blog post:**
Create a new file in `_posts/` with the format: `YYYY-MM-DD-title.md`

```markdown
---
layout: post
title: "Your Post Title"
date: 2024-11-06 10:00:00 -0000
categories: [category1, category2]
tags: [tag1, tag2]
---

Your content here...
```

**Add a project:**
Create a file in `_projects/` folder:

```markdown
---
layout: project
title: "Project Name"
date: 2024-11-06
tech: [Python, ROS2, PyTorch]
github: https://github.com/yourusername/project
---

Project description...
```

**Add images:**
Place images in `assets/images/` and reference them:
```markdown
![Alt text](/assets/images/your-image.jpg)
```

### 4. Update Contact Form

The contact form uses Formspree (free tier available). To set it up:

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form
3. Copy your form endpoint
4. In `contact.md`, replace `YOUR_FORM_ID` with your actual form ID:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

## 🎨 Themes and Styling

The site uses the Minima theme by default. To customize:

### Change Colors and Fonts

Create a file `assets/css/style.scss`:

```scss
---
---

@import "minima";

// Custom colors
$brand-color: #0366d6;
$text-color: #24292e;
$background-color: #ffffff;

// Add your custom CSS here
```

### Use a Different Theme

Browse [Jekyll themes](http://jekyllthemes.org/) and update `_config.yml`:

```yaml
theme: theme-name
# or
remote_theme: username/theme-repo
```

## 📁 Site Structure

```
personal-website/
├── _config.yml          # Site configuration
├── _posts/              # Blog posts
├── _projects/           # Project pages
├── _publications/       # Publication pages
├── assets/
│   ├── images/          # Images
│   ├── cv/              # CV PDFs
│   └── cheatsheets/     # Downloadable resources
├── index.md             # Home page
├── about.md             # About page
├── cv.md                # CV page
├── publications.md      # Publications page
├── projects.md          # Projects page
├── blog.md              # Blog landing page
├── teaching.md          # Teaching page
├── contact.md           # Contact page
├── Gemfile              # Ruby dependencies
└── README.md            # This file
```

## 🔧 Common Tasks

### Adding a New Page

1. Create a new `.md` file in the root directory
2. Add front matter:
   ```markdown
   ---
   layout: page
   title: Page Title
   permalink: /page-url/
   ---
   ```
3. Add it to navigation in `_config.yml`:
   ```yaml
   header_pages:
     - newpage.md
   ```

### Updating Your CV PDF

1. Export your CV as PDF
2. Place it in `assets/cv/`
3. Update the link in `cv.md`:
   ```markdown
   [Download PDF](/assets/cv/your-cv.pdf)
   ```

### Adding Social Media Icons

Update the usernames in `_config.yml`:
```yaml
github_username: yourusername
linkedin_username: yourusername
twitter_username: yourusername
youtube_username: yourusername
```

## 🌐 Adding a Custom Domain (Optional)

If you want `yourname.com` instead of `username.github.io`:

1. **Buy a domain** from Namecheap, Google Domains, etc. ($10-15/year)

2. **Configure DNS** at your domain registrar:
   - Add an A record pointing to GitHub's IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add a CNAME record pointing to `yourusername.github.io`

3. **Add domain to GitHub**:
   - In your repo settings → Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

4. **Wait for DNS propagation** (can take 24-48 hours)

## 📊 Analytics (Optional)

To track visitors, add Google Analytics:

1. Get your Google Analytics tracking ID
2. Add to `_config.yml`:
   ```yaml
   google_analytics: UA-XXXXXXXXX-X
   ```

## 🔍 SEO Optimization

The site includes `jekyll-seo-tag` plugin. To optimize:

1. Fill out all fields in `_config.yml`
2. Add featured images to posts:
   ```yaml
   image: /assets/images/post-image.jpg
   ```
3. Write good meta descriptions in post front matter:
   ```yaml
   excerpt: "Brief description of your post"
   ```

## 🚨 Troubleshooting

**Site not showing up?**
- Check GitHub Pages is enabled in repo settings
- Ensure repo is named `yourusername.github.io`
- Wait a few minutes after pushing changes

**Local preview not working?**
```bash
bundle install
bundle update
bundle exec jekyll serve
```

**Ruby/Jekyll errors?**
- Ensure Ruby 2.7+ is installed: `ruby -v`
- Install Bundler: `gem install bundler`
- Clear cache: `bundle exec jekyll clean`

## 📚 Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Guide](https://pages.github.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Jekyll Themes](http://jekyllthemes.org/)

## 🎯 Next Steps

1. **Customize content** - Replace all placeholder text with your actual information
2. **Add your photo** - Add a profile picture to `assets/images/`
3. **Write your first post** - Create a blog post in `_posts/`
4. **Share your site** - Add the link to your email signature, LinkedIn, etc.
5. **Keep it updated** - Regularly add new projects, publications, and blog posts

## 💡 Tips for Success

- **Start simple** - Don't try to fill everything at once
- **Update regularly** - Add content consistently
- **Showcase your best work** - Quality over quantity
- **Make it personal** - Let your personality shine through
- **Keep learning** - Experiment with new features and designs

## 📬 Need Help?

If you run into issues or have questions, feel free to:
- Check the [Jekyll documentation](https://jekyllrb.com/docs/)
- Search [GitHub Pages community](https://github.community/c/github-pages/)
- Open an issue in your repository

---

**Good luck with your website! 🚀**
