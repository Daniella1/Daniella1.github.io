---
layout: post
title: "Beyond Academic AI: Machine Learning in Industrial Systems"
date: 2025-12-20 10:00:00 -0000
categories: [machine learning, academia, industry]
tags: [machine learning, research, industry, computer vision]
author: Daniella Tola
excerpt: "What I learnt about Machine Learning when going from academia to industry"
---

# 🏗️ _Under construction_ 🏗️


# Main Steps

![Main steps: requirements, hardware/software setup, data and ML pipeline, deployment and monitoring](/assets/images/posts/steps.png)

### 1 System Requirements

These requirements are essential for the business and technical decisions and outcomes.
Therefore, they need to be as precise and unambiguous as possible.
Essentially when going through the requirements, you need to _understand_ the system deeply, so ask as many necessary questions to ensure no incorrect assumptions are made, and that everyone is on the same page. 

Functional requirements may include:
- Object types and sizes to detect
- Defect types
- Background and object color

Non-functional requirements may include, something like:
- GDPR-compliant anonymisation of faces before storing data
- NVIDIA Jetson as computer
- 95% precision and 90% recall (these numbers must be understood and agreed upon or changed to the actual needs)

### 2 Hardware and Software Setup

Requires planning and then execution.

This includes planning and executing the following:
- Hardware:
    * which sensor type: rgb, infrared, LiDAR
    * how many sensors are needed and where should they be placed (physical/geometrical setup)
    * sensor requirements: frame rate, bandwidth, field of view, image size
    * lighting: type, color
- Capture images: how many are needed, static, dynamic, time
- Annotation: which tools, manually or AI-assisted, need for review, per object, per unique set
- Data storage: server's geographical location, local in-house, GDPR
- Software architecture
- CI/CD tools

### 3 Data and ML Pipeline

This includes:
- Data collection and analysis (takes a lot of time!): need to setup the capturing of the data, ensure captured data is balanced and cleaned, may need to annotate, may need to generate synthetic data.
- Model development: select most appropriate model given system requirements and goals
- Model evaluation: determine how to evaluate the model's performance, e.g., consider: F1-score, precision and recall, per frame, per object, and so on

### 4 Deployment and Monitoring
Deployment on edge and cloud can be done using different technologies. 

Nowadays, edge devices are typically NVIDIA Jetsons.
Cloud can be anything from Google Cloud to AWS.

Monitoring includes:
- Drift detection
- Shadow mode testing (run new models in parallel silently)
- Feedback systems (retraining the models)


# Industrial ML Roles


# ML in Industrial Vision Systems
ML systems have increasingly been developed over the past few years and in different types of domains: robotics control, perception, medical imaging, and much more.
With my background in robotics, I have mainly been working with ML in the context of vision systems.
Such systems can be used in automated manufacturing for quality assurance, safety, and robot control.
<!-- add images? and more examples -->


# Challenges in Vision Systems

These include:
- Motion blur
- Object texture and color uniformity
- Dynamic environment

---
*Questions or thoughts? [Get in touch](/contact) - I'd love to discuss!*
