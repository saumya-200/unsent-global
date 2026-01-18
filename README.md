# 🌌 UNSENT

> *The Anonymous Map of Unspoken Human Emotion*

**UNSENT** is a global, real-time platform where people share the words they never sent—apologies, goodbyes, gratitude—completely anonymously. Each message becomes a star in a living constellation, forming a collective map of human emotion across the world.

When two strangers resonate with the same feeling, they can briefly connect through an **Ephemeral Knot**—a private, anonymous space to chat and draw together before everything disappears.

**No profiles. No history. No permanence.**  
Just presence.

---

## ✨ Core Features

### 🌟 Anonymous Emotion Sharing
Submit unsent messages without identity or accounts. Your words become part of a shared human experience.

### 🗺️ Living Star Map
Messages are rendered as stars on a dynamic, interactive map:
- **Color** → detected emotion (joy, sadness, longing, gratitude, etc.)
- **Brightness** → number of "I feel this too" resonances from others

### 🤖 AI-Driven Emotion Detection
Natural language processing classifies sentiment and emotion in real time, creating an authentic emotional landscape.

### 🔗 Ephemeral Knot Sessions
Two strangers who resonate with the same feeling can enter a time-limited, anonymous space to:
- Chat freely
- Draw together on a shared canvas
- Connect authentically

**All sessions auto-expire. No data is stored. No replay.**

### 🌍 Global & Trans-Lingual
Language detection and translation allow emotions to resonate across borders, connecting humanity beyond words.

---

## 🧠 Architecture Overview

```
Frontend (Next.js + Canvas)
         |
         | REST / WebSocket
         |
Backend (Flask + Socket.io)
         |
         |
Supabase (PostgreSQL)
```

---

## 🛠 Tech Stack

### Frontend
- **Next.js** (React framework)
- **HTML5 Canvas** (interactive star map visualization)

### Backend
- **Python** (core language)
- **Flask** (REST API)
- **Socket.io** (real-time WebSocket communication)

### AI / NLP
- **TextBlob** (sentiment analysis)
- **Custom Emotion Classification Models**

### Database
- **Supabase** (PostgreSQL with real-time subscriptions)

### Deployment
- **Vercel** (Frontend)
- **Render** (Backend & WebSockets)

### Version Control
- **GitHub**

---

## 🌱 Development Workflow

### 🔒 Branch Protection Rules

- `main` is **protected** and always deployable
- No direct commits to `main`
- All features must go through Pull Requests

### Branch Strategy

- `main` → production-ready code
- `develop` → integration branch
- `feature/<feature-name>` → feature development

### Contribution Workflow

1. **Create a feature branch from `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-feature
   ```

2. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "feat: add emotion clustering visualization"
   ```

3. **Push your branch**
   ```bash
   git push origin feature/my-feature
   ```

4. **Open a Pull Request** to `develop`
   - Ensure all tests pass
   - Request code review
   - Merge only when build is green ✅

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Supabase** account (free tier works)

### Local Development

See **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** for detailed instructions on:
- Environment configuration
- Supabase setup
- Running frontend and backend locally
- Database migrations

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/unsent.git
cd unsent

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development servers
npm run dev        # Frontend (port 3000)
python app.py      # Backend (port 5000)
```

---

## 📦 Deployment Status

| Service | Status | URL |
|---------|--------|-----|
| Frontend (Vercel) | 🟡 Pending | - |
| Backend (Render) | 🟡 Pending | - |
| Database (Supabase) | 🟢 Active | - |

---

## 🧪 Project Philosophy

**UNSENT** is built around a simple idea:

> *The most meaningful connections are the ones we never save.*

Ephemerality is not a limitation—it's a **design choice**. By removing permanence, UNSENT encourages honesty, vulnerability, and presence in a digital world obsessed with memory.

We believe in:
- **Anonymous authenticity** over curated identity
- **Ephemeral connections** over permanent records
- **Emotional resonance** over engagement metrics
- **Human presence** over digital persistence

---

## 🔮 Roadmap

### Phase 1 (Current)
- [x] Core anonymous message submission
- [x] Basic emotion detection
- [x] Star map visualization
- [ ] Ephemeral Knot chat implementation
- [ ] Drawing canvas in Knot sessions

### Phase 2 (Upcoming)
- [ ] Generative SVG art from Ephemeral Knot sessions
- [ ] Advanced emotion clustering & trend visualization
- [ ] Multi-language support with real-time translation
- [ ] Improved moderation via on-device filtering

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Voice message support
- [ ] Ambient soundscapes based on collective emotion
- [ ] AR star map experience

---

## 🤝 Contributing

We welcome contributions that align with UNSENT's philosophy of empathy, privacy, and ephemeral connection.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct

- Be respectful and empathetic
- Prioritize user privacy and anonymity
- Write clear, maintainable code
- Test thoroughly before submitting PRs

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Connect

- **Issues**: [GitHub Issues](https://github.com/yourusername/unsent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/unsent/discussions)

---

<p align="center">
  <i>Built with care, intention, and empathy.</i><br>
  🌟 For all the words we never sent 🌟
</p>
