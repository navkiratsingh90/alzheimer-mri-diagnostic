# 🧠 NeuroSight – Alzheimer's MRI Diagnostic Co‑pilot

[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/downloads/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20-orange.svg)](https://tensorflow.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

> **End‑to‑end system** that classifies Alzheimer's disease stages from brain MRI scans, provides an AI chat assistant, and tracks patient history through a modern web interface.

![NeuroSight Demo](https://via.placeholder.com/800x400?text=NeuroSight+Screenshot) <!-- replace with actual screenshot -->

---

## 📌 Table of Contents
- [Overview](#overview)
- [Why Build This System?](#why-build-this-system)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Performance & Metrics](#performance--metrics)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker (Optional)](#docker-optional)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Model Training](#model-training)
- [Results](#results)
- [Future Work](#future-work)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## 📖 Overview

**NeuroSight** is a production‑grade medical AI application that:

1. **Analyzes brain MRI scans** using a fine‑tuned **MobileNetV2** convolutional neural network.
2. **Classifies** the scan into one of four Alzheimer's stages:
   - Non‑Demented
   - Very Mild Demented
   - Mild Demented
   - Moderate Demented
3. **Provides instant predictions** with confidence scores.
4. **Answers clinical questions** via an AI chat assistant (OpenAI GPT‑3.5).
5. **Tracks patient history** with reports and progression tracking.

The system is built as a **full‑stack web application** with a FastAPI backend and a Next.js frontend, designed for simplicity, scalability, and ease of use.

---

## ❓ Why Build This System?

Alzheimer's disease affects over **55 million people worldwide**, yet early diagnosis remains challenging. Current clinical practice relies on:
- **Subjective cognitive assessments** (e.g., MMSE, CDR) that can miss subtle changes.
- **Manual MRI reading** by radiologists – time‑consuming and variable.
- **Delayed intervention** – by the time symptoms are obvious, significant neuronal loss has already occurred.

**NeuroSight addresses these gaps by:**

| Problem | Solution |
|---------|----------|
| **Slow, subjective diagnosis** | AI‑powered staging in <2 seconds, consistent and reproducible |
| **Complex interfaces** | Simple web UI – upload, view, chat – no complex software installation |
| **Information overload** | AI chat assistant retrieves relevant information on demand |
| **Scalability gap** | Docker containerisation allows deployment in any hospital with a GPU |
| **Limited tracking** | Patient history and reports enable progression monitoring |

> **The goal** is not to replace clinicians but to serve as a **second reader** – reducing missed diagnoses, accelerating triage, and providing decision support.

---

## ✨ Key Features

| Area | Feature |
|------|---------|
| **Deep Learning** | MobileNetV2 fine‑tuned on OASIS MRI dataset (93%+ accuracy) |
| **Backend API** | REST endpoints for prediction, chat, reports, and admin (FastAPI) |
| **AI Chat** | OpenAI‑powered assistant for clinical questions |
| **Frontend** | Next.js 14 with drag‑and‑drop upload, chat interface, and reports |
| **Authentication** | JWT‑based auth with role‑based access (user/admin) |
| **Admin Panel** | User management and all‑scans overview |
| **Production** | Docker compose, environment configuration, ready for cloud deployment |

---

## 🧰 Tech Stack

| Component | Technology |
|-----------|------------|
| **Deep Learning** | TensorFlow 2.20, Keras, MobileNetV2, Albumentations |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy, Pydantic |
| **Authentication** | JWT (python‑jose), bcrypt (passlib) |
| **AI Chat** | OpenAI GPT‑3.5‑turbo |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Axios |
| **Database** | SQLite (development) / PostgreSQL (production) |
| **Deployment** | Docker, Docker Compose |

---

## 📊 Performance & Metrics

Trained on the **OASIS-1** cross‑sectional MRI dataset (416 subjects, augmented). Results on the held‑out test set:

| Metric | Value |
|--------|-------|
| **Accuracy** | **93.2%** |
| **Precision** | 92.1% |
| **Recall** | 91.8% |
| **F1‑Score** | **92.0%** |

> *Results may vary based on dataset split and augmentation. This model is intended for research purposes.*

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.12
- Node.js 18+
- OpenAI API key (optional)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neurosight.git
   cd neurosight/backend
