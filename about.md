---
layout: page
title: About
permalink: /about/
---

# About Me

![Profile Photo](/assets/images/daniellatola_cropped.jpg){: style="float: right; margin-left: 20px; margin-top: -150px; max-width: 250px; border-radius: 10px;"}

I'm a software and robotics engineer with a passion for building intelligent systems that interact with the physical world. My work spans robotics systems integration, machine learning, simulation, 3D visualisation, computer vision, safety, and manufacturing.

My strength lies in systems thinking and working across disciplines to build innovative solutions.
I work methodically, breaking down complex challenges into manageable pieces while keeping the end goal in sight.



## How I Work

Beyond technical skills, these are the capabilities that define how I approach complex, multidisciplinary challenges.


<div class="capabilities-hexagon">

  <div class="capability-circle" onclick="toggleDetail(this, 'framing')">
    <div class="circle-icon">🎯</div>
    <div class="circle-label">Problem Framing</div>
  </div>
  
  <div class="capability-circle" onclick="toggleDetail(this, 'innovation')">
    <div class="circle-icon">💡</div>
    <div class="circle-label">Innovation Under Constraints</div>
  </div>

  
  <div class="capability-circle" onclick="toggleDetail(this, 'adaptation')">
    <div class="circle-icon">🔄</div>
    <div class="circle-label">Domain Adaptation</div>
  </div>
  
  <div class="capability-circle" onclick="toggleDetail(this, 'integration')">
    <div class="circle-icon">⚙️</div>
    <div class="circle-label">Systems Integration</div>
  </div>

  <div class="capability-circle" onclick="toggleDetail(this, 'safety')">
    <div class="circle-icon">🛡️</div>
    <div class="circle-label">Safety-Critical Thinking</div>
  </div>
  
  <div class="capability-circle" onclick="toggleDetail(this, 'leadership')">
    <div class="circle-icon">🤝</div>
    <div class="circle-label">Technical Leadership & Mentoring</div>
  </div>

</div>

<p class="capabilities-instruction">Select a capability to explore how I apply it in practice</p>

<!-- Detail sections (shown below circles when clicked) -->
<div id="capability-details">

  <div id="framing-detail" class="capability-detail-content">
    <h3>Problem Framing</h3>
    <div class="capability-principle">
      <p>I challenge problem statements to ensure we solve root causes, not symptoms.</p>
    </div>
    <div class="capability-evidence">
      <p><strong>Evidence:</strong></p>
      <ul>
        <li>Recognised URDF was a challenge for most practitioners but no one had tried to understand the root causes of the challenges. Surveyed 500+ practitioners to understand the gap</li>
        <li>Reframed Novo Nordisk's factory layout question from <i>"optimise this configuration"</i> to <i>"what are we actually optimising for?"</i> - Led to KPI development that enabled quantitative comparison</li>
        <li>Structured PhD research around practitioner pain points (vendor lock-in, months-long integration, limited reuse) rather than theoretical gaps</li>
      </ul>
    </div>
    <div class="capability-transfer">
      <p><em>This skill prevents wasted effort and ensures solutions address root causes, not symptoms.</em></p>
    </div>
  </div>

<!-- INNOVATION START -->
<div id="innovation-detail" class="capability-detail-content">
  <h3>Innovation Under Constraints</h3>
  <div class="capability-principle">
    <p>I find breakthrough solutions by questioning assumptions and drawing insights from unexpected domains.</p>
  </div>
  
  <div class="capability-evidence">
    <p><strong>Evidence:</strong></p>
    <ul class="case-studies-list">
      <li class="case-study">
        <div class="case-study-summary" onclick="toggleCase(this)">
          <span class="case-toggle">▸</span>
          <strong>Patent-assessed computer vision approach</strong> (Trifork, first week of project)
        </div>
        <div class="case-study-detail">
          <p><span class="case-label">Challenge:</span> Client assumed complex multi-camera setup was required for manufacturing inspection.</p>
          <p><span class="case-label">Insight:</span> Recognised method to combine information from multiple cameras, reducing camera count without compromising coverage.</p>
          <p><span class="case-label">Impact:</span> Client assessed concept for patent potential, demonstrating value of questioning baseline assumptions.</p>
        </div>
      </li>
      
  <li class="case-study">
    <div class="case-study-summary" onclick="toggleCase(this)">
      <span class="case-toggle">▸</span>
      <strong>Pharmaceutical factory layout from dissimilar domain</strong> (Novo Nordisk)
    </div>
    <div class="case-study-detail">
      <p><span class="case-label">Challenge:</span> Design efficient automated material flow in GMP-regulated facility with stringent cleaning requirements.</p>
      <p><span class="case-label">Insight:</span> Applied automated bathroom cleaning system concepts to pharmaceutical layout design for efficient cleaning workflows.</p>
      <p><span class="case-label">Impact:</span> Generated layouts balancing compliance with operational efficiency in ways domain experts hadn't previously considered.</p>
    </div>
  </li>

  <li class="case-study">
    <div class="case-study-summary" onclick="toggleCase(this)">
      <span class="case-toggle">▸</span>
      <strong>First robotic systems configurator</strong> (PhD research)
    </div>
    <div class="case-study-detail">
      <p><span class="case-label">Challenge:</span> Configuring robotic systems is difficult due to incomplete documentation, compatibility conflicts, and lack of standardisation.</p>
      <p><span class="case-label">Insight:</span> Robotic systems resemble PCs, containing multiple vendor components with specific compatibility requirements.</p>
      <p><span class="case-label">Impact:</span> Developed first configurator concept for robotic systems using defeasible reasoning to handle incomplete information.</p>
    </div>
  </li>

  <!-- Others: -->
  <!-- Noted that the camera position in the trains was on the right, slightly pointing towards the left, even though ALL the signals were on the right, meaning when turning the camera would see the signals after the driver has seen them. -->
</ul>
  </div>
  
  <div class="capability-transfer">
    <p><em>This approach works in any environment where innovation must happen within regulatory, technical, or resource constraints.</em></p>
  </div>
</div>
<!-- INNOVATION END -->

  <div id="adaptation-detail" class="capability-detail-content">
    <h3>Domain Adaptation</h3>
    <div class="capability-principle">
      <p>I specialise in entering unfamiliar technical and regulatory domains and becoming effective quickly.</p>
    </div>
    <div class="capability-evidence">
      <p><strong>Evidence:</strong></p>
      <ul>
        <li>Entered GMP-regulated pharmaceutical manufacturing and facilitated workshops with quality, operations, and cleanroom experts, despite coming from robotics background</li>
        <li>Independently learned safety case methodology, fault tree analysis, and hazard identification to develop complete safety case for autonomous agricultural machinery (M.Sc. thesis)</li>
        <li>Applied robotics expertise to new computer vision project at Trifork, and proposed patent-assessed solution within first week of project by quickly understanding manufacturing detection challenges</li>
      </ul>
    </div>
    <div class="capability-transfer">
      <p><em>This allows me to solve problems at domain intersections where deep specialists struggle to bridge gaps.</em></p>
    </div>
  </div>

  <div id="integration-detail" class="capability-detail-content">
    <h3>Systems Integration</h3>
    <div class="capability-principle">
      <p>I build complete systems that bridge hardware, software, and operational reality, not just components that work in isolation.</p>
    </div>
    <div class="capability-evidence">
      <p><strong>Evidence:</strong></p>
      <ul>
        <li>Conducted PhD with system integrator Technicon addressing real integration bottlenecks: vendor lock-in, undefined interfaces, integration timelines that stretch months</li>
        <li>Built ROS2 systems interfacing with industrial hardware where "plug and play" is aspirational and every device requires custom integration work</li>
        <li>Led URDF standardisation research (500+ participants, 37k+ dataset views) to create shared understanding across fragmented robotics community</li>
      </ul>
    </div>
    <div class="capability-transfer">
      <p><em>This matters in any domain where textbook integration doesn't exist and systems must be made to work despite gaps and conflicts.</em></p>
    </div>
  </div>

  <div id="safety-detail" class="capability-detail-content">
    <h3>Safety-Critical Thinking</h3>
    <div class="capability-principle">
      <p>I design systems assuming failure modes exist and must be managed through systematic analysis and mitigation.</p>
    </div>
    <div class="capability-evidence">
      <p><strong>Evidence:</strong></p>
      <ul>
        <li>Conducted formal safety analysis of autonomous combine harvester including fault tree analysis, hazard identification, and failure mode mitigation strategies</li>
        <li>Understood safety thinking in GMP-regulated pharmaceutical environments where validation, traceability, and risk documentation are mandatory</li>
        <li>Developed computer vision system for railway signal detection where failures (missed signals, false detections) directly impact operational safety</li>
      </ul>
    </div>
    <div class="capability-transfer">
      <p><em>This mindset transfers to any system where reliability, compliance, and human safety are non-negotiable.</em></p>
    </div>
  </div>

  <div id="leadership-detail" class="capability-detail-content">
    <h3>Technical Leadership & Mentoring</h3>
    <div class="capability-principle">
      <p>I elevate teams through knowledge sharing, mentorship, and creating environments where people can learn from mistakes.</p>
    </div>
    <div class="capability-evidence">
      <p><strong>Evidence:</strong></p>
      <ul>
        <li>Taught university courses while managing full-time consulting work, demonstrating communication across experience levels</li>
        <li>Initiated knowledge-sharing sessions focused on learning from technical challenges, building psychological safety and organizational learning</li>
        <li>Mentored students and junior engineers, with multiple crediting me as essential to their success</li>
      </ul>
    </div>
    <div class="capability-transfer">
      <p><em>TThis leadership style raises team capability rather than just directing work, creating lasting impact beyond individual projects..</em></p>
    </div>
  </div>

</div>

<script>
let currentDetail = null;

function toggleDetail(circle, detailId) {
  const detail = document.getElementById(detailId + '-detail');
  const allDetails = document.querySelectorAll('.capability-detail-content');
  const allCircles = document.querySelectorAll('.capability-circle');
  
  // Remove active from all circles
  allCircles.forEach(c => c.classList.remove('active'));
  
  // If clicking same circle, close it
  if (currentDetail === detail && detail.classList.contains('show')) {
    detail.classList.remove('show');
    currentDetail = null;
  } else {
    // Hide all details
    allDetails.forEach(d => d.classList.remove('show'));
    
    // Show clicked detail
    detail.classList.add('show');
    circle.classList.add('active');
    currentDetail = detail;
    
    // Scroll to detail
    setTimeout(() => {
      detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

function toggleCase(summary) {
  const caseStudy = summary.closest('.case-study');
  const wasExpanded = caseStudy.classList.contains('expanded');
  
  // Optionally close other case studies in same section
  // caseStudy.closest('.case-studies-list').querySelectorAll('.case-study').forEach(cs => {
  //   cs.classList.remove('expanded');
  // });
  
  // Toggle clicked case study
  if (wasExpanded) {
    caseStudy.classList.remove('expanded');
  } else {
    caseStudy.classList.add('expanded');
  }
}
</script>

## Beyond Work

When I'm not coding or tinkering with robots, you can find me gaming with friends, at the gym or in the water (when I'm lucky, watching fish), hiking in nature, and reading broadly across philosophy, psychology, business and whatever else catches my curiosity. I'm also very passionate about teaching and mentoring.
<!-- which is why I maintain this blog and create educational content. -->

## Background

I was born in Melbourne, Australia; we moved to Iraq when I was 9 and then moved to Denmark when I was 13. At 30 I decided to move back to Australia as my mum and sister had previously moved back, and I was missing having my family nearby. Somehow, Australia always felt like _home_ to me.

My experiences have taught me to be grateful for the opportunities that I have had, especially education-wise, and have made me realise how unfair the world is, depending on where you were born or what citizenship you have. This is one of the major reasons that I love sharing knowledge, encouraging and empowering others, hoping they can utilise whatever opportunities exist and make something out of them to improve their lives.


## Get In Touch

Feel free to [contact me](/contact) if you'd like to collaborate, discuss research ideas, chat about robotics and technology, or even about life experiences!
