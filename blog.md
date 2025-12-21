---
layout: page
title: Blog
permalink: /blog/
---

<!-- # Blog -->

Thoughts, tutorials, and explorations in robotics, software engineering, and AI.

---

{% for post in site.posts %}
  <article class="blog-post-preview">
    <h2>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <p class="post-meta">
      <time datetime="{{ post.date | date_to_xmlschema }}">
        {{ post.date | date: "%B %-d, %Y" }}
      </time>
      {% if post.categories.size > 0 %}
        • {{ post.categories | join: ", " }}
      {% endif %}
    </p>
    {% if post.excerpt %}
      <p>{{ post.excerpt | strip_html | truncatewords: 50 }}</p>
    {% endif %}
    <a href="{{ post.url | relative_url }}" class="read-more">Read more →</a>
  </article>
  <hr>
{% endfor %}

{% if site.posts.size == 0 %}
  <p>No posts yet. Check back soon!</p>
{% endif %}



<!-- ---
layout: page
title: Blog
permalink: /blog/
---

<!-- # Blog -->

<!-- ## 🏗️ Under Construction -->

<!-- Thoughts, tutorials, and explorations in robotics, software engineering, ethics, and AI. -->

<!-- ## All Posts

<!-- Jekyll will automatically list all blog posts here -->
