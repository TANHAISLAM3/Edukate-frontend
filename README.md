# 🎓 Edukate — Cloud Educational Video Platform

A cloud-native educational short-form video platform built
entirely on Microsoft Azure as part of university coursework.

## 🏗️ Azure Architecture

- **Azure Blob Storage** — Video file storage (MP4, thumbnails)
- **Azure SQL Database** — Users and video metadata
- **Azure Cosmos DB** — Likes, comments, view tracking (NoSQL)
- **Azure Logic Apps** — Serverless REST API (7 endpoints, no code)
- **Azure Functions** — Event-driven thumbnail generation
- **Azure Event Grid** — Automatic triggers on blob upload
- **Azure AI Speech** — Voice search + text-to-speech accessibility
- **Azure App Insights** — Live monitoring and failure alerts
- **Azure App Service** — Frontend hosting
- **GitHub Actions** — CI/CD automatic deployment

## 🔧 Run Locally

> Requires your own Azure account and Logic App URLs

```bash
# Clone the repo
git clone https://github.com/TANHAISLAM3/Edukate-frontend

# Install dependencies
cd Edukate-frontend

# Replace Logic App URLs in server.js with your own
# Then run:
node server.js

# Open browser at:
http://localhost:3000
```

## 📡 REST API Endpoints

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | /api/videos       | Get all videos           |
| POST   | /api/videos       | Upload video metadata    |
| GET    | /api/videos/:id   | Get single video         |
| PUT    | /api/videos       | Update video             |
| DELETE | /api/videos/:id   | Delete video             |
| POST   | /api/users        | Register user            |
| POST   | /api/interactions | Record like/view/comment |

## 🔒 Security Features

- HTTPS only endpoints
- Input validation and XSS protection
- Azure Blob SAS token authentication
- SQL firewall rules
- CORS protection via local proxy server

## 🛠️ Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | HTML, CSS, JavaScript             |
| API        | Azure Logic Apps (no-code)        |
| Database   | Azure SQL + Cosmos DB             |
| Storage    | Azure Blob Storage                |
| AI         | Azure Cognitive Services (Speech) |
| Hosting    | Azure App Service                 |
| CI/CD      | GitHub Actions                    |
| Events     | Azure Event Grid                  |
| Compute    | Azure Functions                   |
| Monitoring | Azure App Insights                |

## 👤 Author

Tanha Islam Sarani
Ulster University — Cloud Native Development
