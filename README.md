# Mandal Minds - AI Interview Assistant

An advanced AI-powered platform for interview preparation, resume optimization, and job application management.

## 🚀 Features

- **AI Interview Practice**: Conduct mock interviews with AI-powered feedback
- **Resume Management**: Create and manage multiple resume versions
- **Job Description Analysis**: Analyze job descriptions against your resume
- **Resume Builder**: AI-enhanced resume building and optimization
- **Performance Analytics**: Track your interview performance and improvement

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Remix Icons
- **Routing**: React Router DOM
- **Deployment**: GitLab Pages

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-gitlab-repo-url>
cd mandal-minds
```

2. Navigate to the app directory and install dependencies:
```bash
cd app
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🚀 Deployment

This project is configured for automatic deployment to GitLab Pages using GitLab CI/CD.

### GitLab Pages Deployment

1. Push your code to the main/master branch
2. GitLab CI/CD will automatically:
   - Install dependencies
   - Build the production version
   - Deploy to GitLab Pages

The site will be available at: `https://<username>.gitlab.io/<repository-name>`

### Manual Deployment

To build for production manually:

```bash
cd app
npm run build
```

The built files will be in the `app/dist/` directory.

## 🔧 Configuration

### Vite Configuration

The project is configured for GitLab Pages deployment with:
- Relative base path (`./`)
- Optimized build settings
- Asset organization

### CI/CD Pipeline

The `.gitlab-ci.yml` file includes:
- Node.js 18 Alpine image
- Dependency caching
- Build artifact management
- Automatic Pages deployment

## 📁 Project Structure

```
mandal-minds/
├── app/                    # React application
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── data/          # JSON data files
│   │   └── assets/        # Images and assets
│   ├── package.json       # Dependencies
│   └── vite.config.js     # Vite configuration
├── .gitlab-ci.yml         # GitLab CI/CD pipeline
└── README.md              # This file
```

## 🎨 Components

- **Landing**: Authentication and welcome page
- **Resume**: Main AI chat interface
- **ManageJDs**: Job description management
- **ManageResume**: Resume version management
- **AnalyzeResume**: AI-powered resume analysis and building

## 🔐 Environment Setup

The application is designed to work out of the box without additional environment variables for the demo version.

For production deployment, you may want to add:
- API endpoints
- Authentication configurations
- Analytics tracking

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Merge Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitLab repository.

---

Built with ❤️ by the Mandal Minds team
