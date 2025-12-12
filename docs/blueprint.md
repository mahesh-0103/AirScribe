# **App Name**: AirScribe AI

## Core Features:

- API Health Check: Verify backend connectivity via health check at https://kira0103-airscribe-backend.hf.space/api/process-ai. Display loading state if unreachable.
- AI Text Processing: Send text to the backend for hybrid processing (BART-LoRA + Gemini Flash) with customizable tone, summary quality, and length.
- Workspace Dashboard: Provide a user-friendly dashboard with a 50,000-character input limit for text processing.
- History Management: Implement local localStorage history for guest users, preparing for cloud-sync with authenticated users.
- Essence and Keyword Extraction: Parse backend responses using the [KEYWORDS] delimiter. Display the essence (first 100 characters) and clickable keyword badges.
- One-Click Export: Add a download button to export the summary as AirScribe_Report.txt. File to the user's computer.
- Hybrid View Toggle: Enable viewing the intermediate BART-LoRA result before Gemini refinement via a toggle. Use of the toggle should be intuitive, and provide value to the user.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082) to evoke feelings of concentration, analysis, and professionalism.
- Background color: Very light lavender (#F0F8FF), creating a gentle and unobtrusive backdrop.
- Accent color: Electric violet (#8F00FF) to create contrast for the primary actions and highlights.
- Body font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look. Headline font: 'Space Grotesk' A proportional sans-serif with a computerized, techy, scientific feel; 
- Use crisp, minimalist icons for actions and navigation, ensuring clarity and usability.
- Maintain a clean, spacious layout for readability, dividing content into clear sections. Use whitespace to create visual breathing room.
- Incorporate subtle transitions for smooth page navigation and interactive feedback. Use a loading animation with copy when connecting to the AI server.