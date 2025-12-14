# GitHub Repository Analyzer 🚀

🌐 **Live Project:** [https://repository-mirror.vercel.app/](https://repository-mirror.vercel.app/)
## 🎥 [Sample Video](https://drive.google.com/file/d/1xSYqf-fKMv8bzLtoliBS1UPy5uJ6x4Fn/view?usp=sharing) 


An AI-powered web application that objectively evaluates GitHub repositories using real-world recruiter standards. The system analyzes repository metadata, structure, commit activity, and development practices, then uses an LLM to generate scores, rankings, and improvement roadmaps.

---

## ✨ Features

* 🔍 **GitHub Repository Analysis**

  * Stars, forks, issues, primary language
  * Project structure (README, tests, file layout)
  * Commit activity (frequency, authors, message quality)

* 🤖 **AI-Based Evaluation**

  * Objective scoring (0–100)
  * Recruiter-style feedback
  * Beginner / Intermediate / Advanced ranking
  * Actionable improvement roadmap

* 🏆 **Leaderboard**

  * Top repositories by score
  * Prevents duplicate entries via URL normalization

* ⚡ **Modern Stack**

  * Django + Django REST Framework (Backend)
  * OpenAI API (LLM evaluation)
  * GitHub REST API (repository data)

---

## 🧠 How It Works

1. User submits a GitHub repository URL
2. Backend fetches:

   * Repository metadata
   * Top-level file structure
   * Recent commits
3. Signals are extracted and summarized
4. Signals are sent to an LLM with strict evaluation rules
5. The LLM returns structured JSON with scores and feedback
6. Results can be added to the leaderboard

---

## 🏗️ Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Backend      | Django, Django REST Framework       |
| AI           | OpenAI API                          |
| External API | GitHub REST API                     |
| Database     | SQLite                              |
| Deployment   | Render (Backend), Vercel (Frontend) |

---

## 📁 Project Structure

```
backend/
├── api/
│   ├── views.py
│   ├── services.py
│   ├── models.py
│   └── urls.py
├── settings.py
├── urls.py
└── manage.py
```

---

## 🔑 Environment Variables

Create a `.env` file and add:

```env
OPENAI_APIKEY=your_openai_api_key
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_API=https://api.github.com
```

> ⚠️ GitHub token must have **public_repo** access.

---

## ▶️ Running the Project Locally

### 1️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 2️⃣ Run migrations

```bash
python manage.py migrate
```

### 3️⃣ Start the server

```bash
python manage.py runserver
```

Backend will run at:

```
http://127.0.0.1:8000/
```

---

## 📡 API Endpoints

### 🔍 Analyze Repository

**POST** `/api/analyze/`

```json
{
  "repo_url": "https://github.com/owner/repo"
}
```

Returns:

* Overall score
* Category breakdown
* Recruiter-style summary
* Improvement roadmap

---

### 🏆 Leaderboard

**GET** `/api/leaderboard/`

Returns top analyzed repositories.

**POST** `/api/leaderboard/`

```json
{
  "repo_url": "https://github.com/owner/repo",
  "score_overall": 78,
  "rank": "Intermediate"
}
```

---

## 📊 Scoring Criteria

* Code Quality
* Documentation
* Testing
* Project Structure
* Real-World Value
* Commit Activity & Consistency

Scores are intentionally **strict** and **realistic**.

---

## 🚧 Limitations

* Only top-level files are analyzed (no deep tree yet)
* Commit diffs are not analyzed (summary-based)
* Private repositories are not supported

---

## 🛣️ Future Improvements

* Deep file tree analysis
* Commit diff intelligence
* CI/CD detection
* Security & license checks
* Frontend visual dashboard

---

## 👨‍💻 Author

**Mohamed Aazil S**
B.Tech AI & Data Science
Full Stack Developer

* GitHub: [https://github.com/MohamedAazil](https://github.com/MohamedAazil)
* LinkedIn: [https://www.linkedin.com/in/mohamed-aazil/](https://www.linkedin.com/in/mohamed-aazil/)

---

## ⭐ If you like this project

Give it a star ⭐ and share it with fellow developers!
