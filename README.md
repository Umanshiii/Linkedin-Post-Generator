# LinkedInk AI — Linkedin post generator

LinkedInk AI is a developer-focused content generation engine designed to create structured, high-impact LinkedIn posts. The platform focuses on narrative structure, hook optimization, and tone calibration, helping professionals, developers, and creators share insights with minimal drafting friction.

---

## Key Features

- **Structured Post Generation:** Outlines and drafts complete posts from bulleted concepts or raw notes.
- **Hook & Flow Optimization:** Formats opening lines to maximize retention before the platform fold.
- **Multi-Tone Engine:** Generates variants across storytelling, technical deep dives, milestones, and contrarian perspectives.
- **Clean Architecture:** Modular separation between API inference logic and interactive frontend state.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python, Django, Django REST Framework, SQLite |
| **Frontend** | React, TypeScript, Tailwind CSS, Lucide Icons |
| **Inference / AI** | Cerebras API (`llama-3.3-70b`), Custom Prompt Pipelines |

---

## Installation & Local Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/Umanshiii/Linkedin-Post-Generator.git](https://github.com/Umanshiii/Linkedin-Post-Generator.git)
cd Linkedin-Post-Generator

```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start server
python manage.py migrate
python manage.py runserver

```

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

```

---

## Active Engineering Roadmap

| Status | Milestone / Feature | Technical Focus |
| --- | --- | --- |
| **Completed** | Core Generation Pipeline | Prompt templating & initial DRF endpoints |
| **Completed** | React + TypeScript Dashboard | Input forms, post preview, and copy mechanics |
| **In Progress** | Streaming Responses (SSE) | Server-Sent Events via Django ASGI for real-time token streaming |
| **Planned** | Multi-Angle Hook Engine | Concurrent asynchronous prompt evaluation (`asyncio`) |
| **Planned** | Schema Validation & Retries | Pydantic response parsing with automated repair loops |
| **Future Scope** | PDF Carousel Exporter | Dynamic multi-slide document generation for LinkedIn carousels |

---

## License

Copyright (c) 2026 Umanshi Gupta. All rights reserved.

This source code is proprietary. Unauthorized copying, modification, distribution, or commercial use of this software, via any medium, is strictly prohibited.

```
