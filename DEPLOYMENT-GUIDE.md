# 🚀 Step-by-Step Deployment Guide

## Complete Walkthrough: From Files to Live Website in 15 Minutes

This guide will take you through deploying your website to GitHub Pages, step by step.

---

## Prerequisites Checklist

- [ ] You have the `personal-website` folder downloaded
- [ ] You have a GitHub account (create one at github.com if not)
- [ ] You've edited `_config.yml` with your basic info

---

## Part 1: Prepare Your Files (5 minutes)

### Step 1: Essential Customizations

Before deploying, update these files:

**File: `_config.yml`**
```yaml
# Change these lines:
title: Your Actual Name               # ← Change this
email: your.real.email@example.com    # ← Change this
description: >-
  Your actual bio/description         # ← Change this

# Update social media:
github_username: youractualusername   # ← Change this
linkedin_username: yourlinkedin       # ← Change this
youtube_username: youryoutube         # ← Change this (or leave blank)
twitter_username: yourtwitter         # ← Change this (or leave blank)
```

**File: `index.md`**
- Replace `[Your Name]` with your actual name
- Update the "What I Do" section with your actual work

**File: `contact.md`**
- Update email addresses
- Update social media links

### Step 2: Add Your Photo (Optional but recommended)

1. Find a professional photo of yourself (square format works best)
2. Rename it to `profile.jpg`
3. Place it in `assets/images/` folder

---

## Part 2: Create GitHub Repository (3 minutes)

### Step 1: Go to GitHub

1. Open your browser and go to: https://github.com
2. Log in to your account
3. Click the **"+"** icon in the top-right corner
4. Select **"New repository"**

### Step 2: Configure Repository

**Repository name:** `yourusername.github.io`
- Replace `yourusername` with your ACTUAL GitHub username
- This MUST match exactly - e.g., if your username is `john-doe`, name it `john-doe.github.io`

**Description:** (Optional) `My personal website`

**Visibility:** Select **Public**
- Must be public for free GitHub Pages hosting

**Initialize repository:** Leave ALL checkboxes UNCHECKED
- Don't add README
- Don't add .gitignore
- Don't add license

Click **"Create repository"**

---

## Part 3: Upload Your Files (4 minutes)

You have two options: Web Upload (easier) or Git Command Line (for developers)

### Option A: Web Upload (Recommended for beginners)

1. On your new repository page, click **"uploading an existing file"** link
2. Drag and drop ALL files from your `personal-website` folder into the upload area
   - Include all files and folders
   - Make sure to include hidden files like `.gitignore`
3. Scroll down to the commit message box
4. Type: `Initial commit: Add personal website`
5. Click **"Commit changes"**

**Wait for upload to complete** (may take 1-2 minutes)

### Option B: Git Command Line (For developers)

Open terminal in your `personal-website` folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Add personal website"

# Set branch name to main
git branch -M main

# Add remote (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/yourusername.github.io.git

# Push to GitHub
git push -u origin main
```

Enter your GitHub username and password (or use a personal access token) when prompted.

---

## Part 4: Enable GitHub Pages (2 minutes)

### Step 1: Go to Repository Settings

1. In your repository, click **"Settings"** (top-right, next to About)
2. In the left sidebar, scroll down and click **"Pages"**

### Step 2: Configure GitHub Pages

**Source:**
- Under "Build and deployment"
- Under "Source", select: **"Deploy from a branch"**

**Branch:**
- Select branch: **main**
- Select folder: **/ (root)**
- Click **"Save"**

You'll see a message: "GitHub Pages source saved"

### Step 3: Wait for Deployment

- GitHub will build your site (takes 2-3 minutes)
- You'll see a blue box saying "Your site is ready to be published at..."
- Refresh the page after 2-3 minutes
- The box will turn green: "Your site is live at https://yourusername.github.io"

---

## Part 5: Visit Your Live Site! (1 minute)

1. Click the link or go to: `https://yourusername.github.io`
2. Your website should be live! 🎉

**If you see a 404 error:**
- Wait another 2-3 minutes
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

---

## Part 6: Make Updates

### Making Changes After Deployment

**Web Interface (Easier):**

1. Go to your repository on GitHub
2. Navigate to the file you want to edit
3. Click the pencil icon (✏️) to edit
4. Make your changes
5. Scroll down, add commit message
6. Click "Commit changes"
7. Wait 2-3 minutes for site to rebuild

**Git Command Line:**

```bash
# Make your changes to files locally

# Stage changes
git add .

# Commit with message
git commit -m "Update about page"

# Push to GitHub
git push origin main

# Wait 2-3 minutes for site to rebuild
```

---

## Troubleshooting Common Issues

### Issue 1: Site Shows 404 Error

**Solutions:**
- ✅ Wait 5 minutes and try again
- ✅ Check repository name matches your username exactly
- ✅ Verify GitHub Pages is enabled in settings
- ✅ Ensure branch is set to "main" and folder to "/ (root)"
- ✅ Check that repository is public

### Issue 2: Site Looks Broken or Unstyled

**Solutions:**
- ✅ Check `_config.yml` has correct `baseurl: ""`
- ✅ Verify all files were uploaded correctly
- ✅ Hard refresh browser (Ctrl+Shift+R)
- ✅ Check browser console for errors (F12 → Console tab)

### Issue 3: Changes Not Showing

**Solutions:**
- ✅ Wait 2-3 minutes after pushing changes
- ✅ Hard refresh browser (Ctrl+Shift+R)
- ✅ Clear browser cache
- ✅ Check GitHub Actions tab for build errors

### Issue 4: Images Not Loading

**Solutions:**
- ✅ Verify image paths start with `/assets/`
- ✅ Check file names match exactly (case-sensitive)
- ✅ Ensure images were uploaded to correct folder
- ✅ Try absolute URLs with full site address

### Issue 5: Can't Push to GitHub

**Solutions:**
- ✅ Check you have write access to repository
- ✅ Use personal access token instead of password
- ✅ Verify remote URL is correct: `git remote -v`

---

## Adding a Custom Domain (Optional)

Want `yourname.com` instead of `username.github.io`?

### Step 1: Buy a Domain

Purchase from:
- Namecheap (recommended)
- Google Domains
- Cloudflare
- Any domain registrar

Cost: ~$10-15/year

### Step 2: Configure DNS

In your domain registrar's settings, add these DNS records:

**For apex domain (yourname.com):**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |

**For www subdomain:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | www | yourusername.github.io | 3600 |

### Step 3: Configure GitHub Pages

1. Go to repository Settings → Pages
2. Under "Custom domain", enter: `yourname.com`
3. Click "Save"
4. Wait for DNS check (green checkmark appears)
5. Check "Enforce HTTPS" (wait 24 hours if greyed out)

### Step 4: Wait for DNS Propagation

- Can take 24-48 hours
- Check status: https://dnschecker.org
- Once propagated, visit your custom domain!

---

## Next Steps After Deployment

### Immediate (Today)
- [ ] Test all navigation links
- [ ] Check mobile view on your phone
- [ ] Share with a friend for feedback
- [ ] Add to your email signature
- [ ] Update LinkedIn profile with link

### This Week
- [ ] Write your first blog post
- [ ] Add 2-3 projects with images
- [ ] Fill out publications page
- [ ] Upload CV PDF
- [ ] Set up contact form with Formspree

### This Month
- [ ] Write 2-3 more blog posts
- [ ] Add teaching materials
- [ ] Submit to Google Search Console
- [ ] Share on social media
- [ ] Consider custom domain

### Ongoing
- [ ] Update weekly/monthly with new content
- [ ] Monitor with Google Analytics (optional)
- [ ] Respond to contact form submissions
- [ ] Keep CV and projects current

---

## Monitoring Your Site

### Check Build Status

1. Go to your repository
2. Click "Actions" tab (top menu)
3. See list of deployments
4. Green checkmark = successful
5. Red X = build failed (click for details)

### View Site Statistics

**GitHub (basic):**
- Repository → Insights → Traffic
- Shows visitors and page views (last 14 days)

**Google Analytics (advanced):**
1. Create Google Analytics account
2. Get tracking ID
3. Add to `_config.yml`:
```yaml
google_analytics: UA-XXXXXXXXX-X
```

---

## Getting Help

### Official Resources
- Jekyll Docs: https://jekyllrb.com/docs/
- GitHub Pages: https://pages.github.com/
- GitHub Community: https://github.community/

### Your Documentation
- README.md - Complete guide
- QUICK-REFERENCE.md - Commands and syntax
- SITE-STRUCTURE.md - Site organization

### Common Questions

**Q: How do I add a new page?**
A: Create a `.md` file in root folder, add front matter, add to `_config.yml` navigation

**Q: How do I add a blog post?**
A: Create `YYYY-MM-DD-title.md` in `_posts/` folder

**Q: Can I use a different theme?**
A: Yes! Browse http://jekyllthemes.org/ and update `_config.yml`

**Q: Is it really free?**
A: Yes! GitHub Pages is completely free for public repositories

**Q: Can I use this for commercial purposes?**
A: Yes, but consider upgrading to a custom domain for professionalism

---

## Success Checklist

- [ ] Repository created at `yourusername.github.io`
- [ ] All files uploaded
- [ ] GitHub Pages enabled
- [ ] Site accessible at your URL
- [ ] Navigation works
- [ ] Images load correctly
- [ ] Mobile view looks good
- [ ] Basic customizations complete
- [ ] Shared with at least one person!

---

## 🎉 Congratulations!

Your website is now live! You've just:
- Created a professional online presence
- Learned to use GitHub Pages
- Built a foundation you can grow over time

Remember: A published website with minimal content is better than a perfect website that never launches. You can always update and improve it later!

**Now go share your new website with the world!** 🚀

---

*Questions? Check README.md for more detailed information or search online for Jekyll/GitHub Pages tutorials.*
