# Examind AI - Assessment Analyzer

An intelligent assessment automation platform that uses AI to extract questions and answers documents, map student responses to questions, and provide automated grading and feedback.

## Overview

**Examind AI** is a web application designed to streamline the assessment process for educators. It automates the extraction and analysis of question papers and answer sheets, enabling teachers to efficiently review student responses and generate insights about assessment performance.

## Features

### 📄 Document Processing
- **Question Paper Extraction**: Automatically extracts all questions from uploaded PDFs with accurate numbering and mark allocation
- **Answer Sheet Analysis**: Intelligently identifies and extracts student answers with spatial information (page number, coordinates)
- **Multi-page Support**: Handles questions and answers spanning multiple pages seamlessly

### 🎯 Intelligent Mapping
- **Question-Answer Correlation**: Uses AI to match student responses to corresponding questions
- **Flexible Numbering**: Handles various question numbering formats (1, 1(a), 1.1, etc.)
- **Confidence Scoring**: Provides confidence levels for answer-to-question mappings

### 📊 Review & Analysis
- **Interactive Dashboard**: Two-panel interface for simultaneous question and answer viewing
- **Mobile-Responsive**: Tab-based interface on mobile, side-by-side on desktop
- **Responsive UI**: Optimized for different screen sizes with intelligent layout switching

### 🤖 AI Grading (Ready to integrate)
- Foundation for automated grading pipeline
- Extensible architecture for custom grading logic

## Tech Stack

### Frontend
- **Framework**: Next.js 16.3 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: Zustand
- **Type Safety**: TypeScript 5

### Backend
- **Runtime**: Node.js (via Next.js API routes)
- **PDF Processing**: PDF.js
- **Image Conversion**: Canvas-based PDF to image conversion

### AI & APIs
- **AI Model**: Google Gemini 3.6 Flash
- **API Integration**: Google Generative AI SDK

## Architecture

### Three-Phase Processing Pipeline

```
Upload Files
    ↓
Phase 1: Extraction (Parallel)
├── Extract Questions from Question Paper
└── Extract Answers from Answer Sheet
    ↓
Phase 2: Intelligent Mapping
└── Match Answers to Questions
    ↓
Phase 3: Analysis & Display
└── Interactive Review Interface
```

### Component Structure

```
app/
├── page.tsx (Main layout & navigation)
├── layout.tsx (Root layout with Navbar)
└── api/
    ├── extract-questions/ (Question extraction endpoint)
    └── extract-answers/ (Answer extraction endpoint)

components/
├── SidePanel.tsx (Navigation sidebar)
├── Navbar.tsx (Top navigation)
├── UploadCard.tsx (File upload UI)
└── screens/
    ├── UploadScreen.tsx (Upload flow)
    ├── ExtractionScreen.tsx (Processing status)
    └── ReviewScreen.tsx (Q&A review interface)
└── review/
    ├── QuestionList.tsx (Question browser)
    └── AnswerViewer.tsx (Answer display)

lib/
├── ai/
│   ├── gemini.ts (AI model initialization)
│   ├── extractQuestion.ts (Question extraction logic)
│   ├── extractAnswer.ts (Answer extraction logic)
│   ├── mapping.ts (Question-answer matching)
│   └── gradeAnswers.ts (Grading pipeline)
├── assessment/
│   ├── processAssessment.ts (Orchestration)
│   └── assessmentStats.ts (Analytics)
└── pdf-to-img.ts (PDF conversion utilities)

store/
└── assessmentStore.ts (Zustand state management)

types/
└── assessment.ts (TypeScript interfaces)
```

## AI Model & Approach

### Google Gemini 3.6 Flash

**Why Gemini?**
- Excellent document understanding and OCR capabilities
- Cost-effective for high-volume processing
- Fast inference speed suitable for user-facing applications
- Strong JSON output support for structured data extraction

### Extraction Strategy

#### Question Extraction
The AI analyzes the question paper PDF and extracts:
- **Question Number**: Preserves original numbering (handles sub-parts like 1(a), 1(b))
- **Question Text**: Complete question content with proper formatting
- **Page Number**: Location of question in the paper
- **Max Marks**: Allocated marks per question (parsed from various formats: [5], (10 marks), 5M, etc.)
- **Order**: Sequence in which question appears

**Key Rules Applied:**
- Treats sub-parts as separate questions
- Combines multi-page questions into single entries
- Ignores section headings and instructions
- Preserves original numbering exactly
- Handles marks from multiple formats

#### Answer Extraction
The AI processes the answer sheet and identifies:
- **Answer Text**: Student's written response
- **Answer Regions**: Spatial coordinates (page, x, y, width, height) for visualization
- **Question Number Inference**: Initial mapping attempt (refined in Phase 2)

#### Answer Mapping
Uses semantic understanding to:
- Match answers to questions with confidence scores
- Handle misaligned or unclear question references
- Provide fallback matching strategies

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Google Gemini API Key

### Installation

```bash
# Clone repository
git clone <repository-url>
cd ExamindAI

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
```

### Configuration

Create a `.env.local` file with:

```env
GEMINI_API_KEY=your_api_key_here
```

### Running the Application

```bash
# Development server
pnpm dev

# Production build
pnpm build
pnpm start

# Linting
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Important Assumptions & Limitations

### Assumptions

1. **PDF Quality**: Question papers and answer sheets are reasonably clear and well-formatted
2. **Language**: Currently optimized for English-language documents
3. **Question Numbering**: Questions follow standard numbering patterns (1, 2, 1(a), 1(b), etc.)
4. **Answer Clarity**: Student answers are legible and distinguishable from other page content
5. **Single Assessment**: Each upload represents one distinct assessment event
6. **Marks Visibility**: Mark allocations are explicitly printed on question papers

### Limitations

1. **Handwritten Text**: Accuracy depends on handwriting legibility; cursive/unclear handwriting may be misread
2. **Complex Layouts**: Questions with irregular formatting, embedded images, or multiple columns may be incorrectly parsed
3. **OCR Limitations**: Blurry PDFs, poor scans, or non-standard fonts reduce extraction accuracy
4. **Language Support**: Non-English documents may have reduced accuracy
5. **Marks Inference**: If marks aren't printed, they cannot be extracted; manual entry required
6. **Mixed Content**: Papers with non-text elements (graphs, diagrams) are extracted as text only
7. **API Rate Limits**: Subject to Google Generative AI rate limits and quotas
8. **Processing Time**: Large PDFs (100+ pages) may take several minutes to process
9. **Token Limits**: Very large documents may exceed model token limits

### Known Issues

- Sub-questions must have explicit numbering; implicit sub-questions may be missed
- Marks from images/scanned documents may not be extractable
- Answer region coordinates are approximate and best-effort
- Grading pipeline is scaffolded 


## Data Flow

```
User Uploads Files
        ↓
Frontend: Upload Screen
        ↓
Backend: Extract via Gemini API
├── Questions → Structured JSON
└── Answers → Structured JSON + Regions
        ↓
Frontend: Extraction Screen (Progress)
        ↓
Zustand Store: Save extracted data
        ↓
AI Mapping: Match Q&A pairs
        ↓
Frontend: Review Screen
├── Left Panel: Question List (desktop) / Tab (mobile)
└── Right Panel: Answer Viewer (desktop) / Tab (mobile)
```

## Performance Considerations

- **Lazy Loading**: Components load on-demand
- **Image Optimization**: PDFs converted to images only when needed
- **Streaming**: Large PDFs processed incrementally
- **Caching**: Extraction results cached in browser state

## License

MIT

## Support

For issues, questions, or feedback, please open an issue in the repository.

---

**Built with ❤️ for educators everywhere**
