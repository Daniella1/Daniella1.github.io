---
layout: page
title: Leave calculator
permalink: /tools/leave-tool/leave-calculator/
---

Work out how much annual and sick leave you will have on any date, starting from your latest payslip. Everything runs in your browser. Nothing you enter or upload is sent anywhere.

<iframe id="leave-frame" src="{{ '/tools/leave-tool/index.html' | relative_url }}" title="Leave calculator"
  allow="clipboard-read; clipboard-write" loading="lazy"
  style="width:100%;height:700px;border:0;display:block"></iframe>

<noscript>This tool needs JavaScript. You can also <a href="{{ '/tools/leave-tool/index.html' | relative_url }}">open it on its own page</a>.</noscript>

<script>
  /* Grow the frame to fit the tool so the page scrolls once, like any other page. */
  (function () {
    var f = document.getElementById('leave-frame');
    function fit() {
      try {
        var d = f.contentDocument, h = Math.ceil(d.documentElement.getBoundingClientRect().height);
        if (h) f.style.height = h + 'px';
        if (!f._ro && window.ResizeObserver) { f._ro = new ResizeObserver(fit); f._ro.observe(d.body); }
      } catch (e) { /* leave the default height */ }
    }
    f.addEventListener('load', fit);
  })();
</script>
