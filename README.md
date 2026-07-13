<div align="center">

# 🎭 Playwright TypeScript Test Framework

[![Playwright](https://img.shields.io/badge/Playwright-1.61.1-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A production-ready, enterprise-grade test automation framework built with Playwright and TypeScript**

[Features](#-features) • [Quick Start](#-quick-start) • [Usage](#-usage) • [Reporting](#-reporting) • [Docker](#-docker)

</div>

---

## 📖 Overview

This framework provides a robust, scalable, and maintainable solution for end-to-end testing of modern web applications. Built on Microsoft's Playwright with TypeScript, it supports UI testing, API testing, visual regression, and mobile device emulation—all in one unified framework.

---

## ✨ Features

### 🌐 Cross-Browser Testing
| Browser | Status | Channel Support |
|---------|--------|-----------------|
| Chrome | ✅ | `chrome` |
| Chromium | ✅ | Default |
| Firefox | ✅ | Default |
| Microsoft Edge | ✅ | `msedge` |
| WebKit (Safari) | ✅ | Default |

### 🧪 Testing Capabilities

<table>
<tr>
<td width="50%">

**UI Testing**
- ✅ Page Object Model (POM) design pattern
- ✅ Custom fixtures for reusable page objects
- ✅ Auto-wait for elements
- ✅ Screenshot & video on failure
- ✅ Trace file generation
- ✅ HAR file recording & replay

</td>
<td width="50%">

**API Testing**
- ✅ REST API testing support
- ✅ Response body & header validation
- ✅ Token-based authentication
- ✅ Reusable API action helpers

</td>
</tr>
<tr>
<td>

**Visual Testing**
- ✅ Screenshot comparison
- ✅ Pixel-perfect validation
- ✅ Baseline management

</td>
<td>

**Mobile Emulation**
- ✅ 100+ device profiles
- ✅ Responsive testing
- ✅ Touch & gesture support

</td>
</tr>
</table>

### 🔧 Framework Features

| Feature | Description |
|---------|-------------|
| **Multi-Environment** | Supports `qa`, `dev`, `prod` environments with region support (`US`, `UK`) |
| **Parallel Execution** | Run tests across multiple browsers simultaneously |
| **Serial Execution** | Run tests sequentially when needed |
| **Custom Reporter** | Winston-based logging with custom Playwright reporter |
| **Data-Driven** | Excel file read/write support with ExcelJS |
| **Secure Credentials** | AES encryption for sensitive data |
| **Database Testing** | PostgreSQL integration for DB testing |
| **Docker Ready** | Containerized test execution |

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology |
|----------|------------|
| **Test Framework** | ![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat-square&logo=playwright&logoColor=white) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **Reporting** | ![Allure](https://img.shields.io/badge/Allure-FF5733?style=flat-square) ![HTML](https://img.shields.io/badge/HTML_Report-E34F26?style=flat-square&logo=html5&logoColor=white) |
| **Logging** | ![Winston](https://img.shields.io/badge/Winston-231F20?style=flat-square) |
| **Linting** | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) |
| **Data** | ![ExcelJS](https://img.shields.io/badge/ExcelJS-217346?style=flat-square&logo=microsoft-excel&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) |
| **Containerization** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |

</div>

---

## 📁 Project Structure

```
playwright-ts-tests/
├── 📂 base/                    # Base classes & utilities
│   ├── APIActions.ts           # API testing helpers
│   ├── BaseTest.ts             # Custom fixtures setup
│   └── PageActions.ts          # Page interaction utilities
├── 📂 pageObjectClasses/       # Page Object Model classes
│   ├── HomePage.ts
│   └── LoginPage.ts
├── 📂 tests/                   # Test suites
│   ├── 📂 api/                 # API test cases
│   ├── 📂 devices/             # Mobile emulation tests
│   ├── 📂 functional/          # UI functional tests
│   └── 📂 visualComparison/    # Visual regression tests
├── 📂 utils/                   # Utility files & test data
├── 📄 playwright.config.ts     # Playwright configuration
├── 📄 testConfig.ts            # Environment configuration
├── 📄 CustomReporterConfig.ts  # Custom Winston reporter
├── 📄 global-setup.ts          # Pre-test setup
├── 📄 global-teardown.ts       # Post-test cleanup
└── 📄 Dockerfile               # Docker configuration
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| Java (for Allure) | 8+ |

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwright-ts-tests

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install Allure CLI (for reports)
npm install -g allure-commandline
```

---

## 📋 Usage

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm run test:single

# Run tests with specific tag (parallel)
npm run test:parallel

# Run tests sequentially
npm run test:serial

# Run API tests only
npm run test:api

# Run visual comparison tests
npm run test:visual

# Run device emulation tests
npm run test:device

# Record new tests with codegen
npm run test:record
```

### Environment Configuration

```bash
# Run tests on specific environment
npx cross-env TEST_ENV=qa npm test

# Run tests on specific region
npx cross-env TEST_ENV=prod TEST_REGION=UK npm test

# Run tests on specific browser
npx cross-env BROWSER=firefox npm test

# Run tests on multiple browsers
npx cross-env BROWSER=chrome,firefox,webkit npm test
```

### Browser Options

| Browser | Command |
|---------|---------|
| Chrome | `BROWSER=chrome` |
| Chromium | `BROWSER=chromium` |
| Firefox | `BROWSER=firefox` |
| Edge | `BROWSER=edge` |
| WebKit | `BROWSER=webkit` |

---

## 📊 Reporting

### Available Reports

<table>
<tr>
<td align="center" width="50%">

### 🎨 Allure Report

Rich, interactive test reports with:
- Test execution history
- Screenshots & videos
- Detailed step breakdown
- Trend analysis

```bash
npm run allureReport
```

</td>
<td align="center" width="50%">

### 📄 HTML Report

Built-in Playwright HTML reports:
- Test results summary
- Failure screenshots
- Trace viewer integration

```bash
npx playwright show-report html-report
```

</td>
</tr>
</table>

### Report Artifacts (on Failure)

| Artifact | Description |
|----------|-------------|
| 📸 Screenshots | Captured on test failure |
| 🎬 Videos | Recorded test execution |
| 📋 Trace Files | Detailed execution trace |
| 📝 Logs | Winston-based execution logs |

---

## 🐳 Docker

### Build & Run

```bash
# Build the Docker image
docker build -t playwright-tests .

# Run tests in container
docker run playwright-tests

# Run with custom environment
docker run -e ENV=qa playwright-tests
```

### Docker Configuration

The included Dockerfile:
- Uses official Playwright image
- Runs as non-root user for security
- Preconfigured for CI/CD pipelines

---

## ⚙️ Configuration

### Key Configuration Files

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Browser, timeout, reporter settings |
| `testConfig.ts` | Environment URLs, credentials, DB config |
| `credentials.json` | User credentials per environment |
| `CustomReporterConfig.ts` | Winston logging configuration |

### Test Settings (playwright.config.ts)

```typescript
{
  timeout: 120000,              // Test timeout
  retries: 0,                   // Retry count
  headless: true,               // Headless mode
  viewport: { width: 1500, height: 730 },
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure'
}
```

---

## 🏷️ Test Tags

Use tags to organize and filter tests:

```typescript
test('@Smoke Login test', async ({ page }) => { ... });
test('@API Get users', async ({ request }) => { ... });
```

```bash
# Run only smoke tests
npx playwright test --grep @Smoke

# Run only API tests
npx playwright test --grep @API
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 👨‍💻 Author

**Sunil Patro**

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

</div>
