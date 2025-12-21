# 🚀 Getting Started with Your Personal Website

## What You Have

I've created a complete, professional personal website for you with:

✅ **Home page** - Welcome section with highlights
✅ **About page** - Your bio and background
✅ **CV page** - Complete curriculum vitae
✅ **Publications page** - Research papers and articles
✅ **Projects page** - Portfolio of your work
✅ **Blog** - With sample post showing format
✅ **Teaching page** - Tutorials and educational resources
✅ **Contact page** - Multiple ways to reach you

## 🎯 Three Ways to Get Started

### Option 1: GitHub Pages (Recommended - FREE!)
**Time: 10 minutes | Cost: FREE**

1. Download the `personal-website` folder
2. Create a GitHub account (if you don't have one)
3. Create a new repository named `yourusername.github.io`
4. Upload all files from the personal-website folder
5. Enable GitHub Pages in repository settings
6. Your site is live at `https://yourusername.github.io`!

**Pros:** Free, automatic updates, easy to manage
**Best for:** Everyone, especially those starting out

### Option 2: Custom Domain + GitHub Pages
**Time: 30 minutes | Cost: ~$12/year**

Same as Option 1, but:
1. Buy a domain from Namecheap/Google Domains
2. Configure DNS settings (instructions in README)
3. Add custom domain in GitHub settings
4. Your site is at `https://yourname.com`!

**Pros:** Professional domain, still free hosting
**Best for:** Professional presence, business use

### Option 3: Local Development First
**Time: 20 minutes setup**

1. Install Ruby and Bundler
2. Run `bundle install` in the website folder
3. Run `bundle exec jekyll serve`
4. Preview at `localhost:4000`
5. Deploy to GitHub when ready

**Pros:** Test changes before publishing
**Best for:** Developers, frequent updaters

## 📋 What to Customize (Priority Order)

### 🔴 Must Do (before deploying):
1. **_config.yml** - Your name, email, social media usernames
2. **index.md** - Update welcome message
3. **about.md** - Write your bio
4. **contact.md** - Add your contact info

### 🟡 Should Do (first week):
5. **cv.md** - Fill in your education and experience
6. **publications.md** - Add your papers
7. **projects.md** - Showcase 2-3 key projects
8. Add profile photo to `assets/images/profile.jpg`

### 🟢 Can Do Later:
9. Write blog posts in `_posts/`
10. Add teaching materials to teaching.md
11. Upload CV PDF to `assets/cv/`
12. Set up contact form with Formspree
13. Customize theme colors

## 📁 File Structure Explained

```
personal-website/
│
├── _config.yml                 ← EDIT THIS FIRST! (site settings)
│
├── Main Pages (edit these)
│   ├── index.md               ← Home page
│   ├── about.md               ← About you
│   ├── cv.md                  ← Your CV
│   ├── publications.md        ← Your papers
│   ├── projects.md            ← Your projects
│   ├── blog.md                ← Blog landing
│   ├── teaching.md            ← Teaching materials
│   └── contact.md             ← Contact info
│
├── _posts/                    ← Add blog posts here
│   └── 2024-11-06-getting-started-ros2.md (example)
│
├── assets/
│   ├── images/               ← Add images here
│   │   ├── profile.jpg       ← Your photo
│   │   ├── projects/         ← Project images
│   │   └── blog/             ← Blog images
│   └── cv/                   ← Upload CV PDFs here
│
├── Documentation
│   ├── README.md             ← Full setup guide
│   ├── CHECKLIST.md          ← Deployment checklist
│   └── QUICK-REFERENCE.md    ← Command reference
│
└── Configuration
    ├── Gemfile               ← Ruby dependencies
    └── .gitignore            ← Git ignore rules
```

## 🎨 Customization Tips

### Changing Colors
Create `assets/css/style.scss`:
```scss
---
---
@import "minima";

$brand-color: #0366d6;  // Change this!
```

### Adding a New Page
1. Create `newpage.md` in root folder
2. Add this at top:
```yaml
---
layout: page
title: New Page
permalink: /newpage/
---
```
3. Add to navigation in `_config.yml`

### Adding a Blog Post
1. Create file: `_posts/2024-11-06-my-post.md`
2. Add front matter:
```yaml
---
layout: post
title: "Post Title"
date: 2024-11-06
categories: [robotics]
---
```

## 🔧 Common Commands

```bash
# Local preview
bundle exec jekyll serve

# Deploy to GitHub
git add .
git commit -m "Update content"
git push origin main
```

## ⚡ Quick Start Steps

1. **Download** the personal-website folder
2. **Edit** _config.yml with your info
3. **Update** index.md, about.md, contact.md
4. **Test locally** (optional): `bundle exec jekyll serve`
5. **Deploy** to GitHub Pages
6. **Visit** your new site!
7. **Iterate** - add more content over time

## 📚 Documentation Files

- **README.md** - Complete setup guide with troubleshooting
- **CHECKLIST.md** - Pre-deployment checklist
- **QUICK-REFERENCE.md** - Command and syntax reference

## 💡 Pro Tips

1. **Start minimal** - Don't wait for perfection to launch
2. **Use placeholders** - "[Coming soon]" is better than blank
3. **Update regularly** - Even small updates keep it fresh
4. **Backup** - Your GitHub repo is your backup
5. **Share** - Add link to LinkedIn, email signature, etc.

## 🆘 Need Help?

Check these resources:
- README.md for detailed instructions
- QUICK-REFERENCE.md for common tasks
- Jekyll docs: https://jekyllrb.com/docs/
- GitHub Pages guide: https://pages.github.com/

## 🎯 Your Next Hour

1. **0-10 min:** Edit _config.yml with your actual info
2. **10-30 min:** Update index.md, about.md, contact.md
3. **30-45 min:** Add profile photo, fill in CV basics
4. **45-60 min:** Deploy to GitHub Pages and go live!

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just personalize the content and deploy!

**Remember:** This is YOUR website. Make it reflect your personality and work. Don't stress about making it perfect - you can always update it later.

Good luck! 🚀
