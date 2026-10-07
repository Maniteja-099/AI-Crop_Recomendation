# Product Requirements Document (PRD)

## AI-Driven Agricultural Intelligence System — Phase 2 Enhancements

**Document Version:** 1.0  
**Date:** March 9, 2026  
**Author:** Project Team  

---

## 1. Executive Summary

This PRD covers four key enhancements requested by the project coordinator:

1. **User Authentication (Register & Login)** — Gate the application behind a registration/login flow.
2. **Agricultural Imagery on Landing Page** — Add visually appealing crop/plant/tree images to the home page.
3. **Full Multi-Language Interface Support** — Ensure the entire UI changes when any language is selected, and fix the language dropdown visibility (not hidden behind white/transparent elements).
4. **Real-Time Multilingual Chatbot** — Make the AI chatbot work in real-time across all supported languages, including voice input/output.

---

## 2. Feature 1: User Authentication (Register & Login)

### 2.1 Overview
Add a **Register** page and a **Login** page. Unauthenticated users see only the login/register screens. After successful login, users land on the home page with full access to all features.

### 2.2 Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-1 | Register page with fields: Full Name, Email, Password, Confirm Password | P0 |
| AUTH-2 | Login page with fields: Email, Password | P0 |
| AUTH-3 | Client-side form validation (email format, password match, min 6 chars) | P0 |
| AUTH-4 | Auth state persisted in localStorage so user stays logged in across refreshes | P0 |
| AUTH-5 | Logout button in navbar | P0 |
| AUTH-6 | Protected routes — redirect to /login if not authenticated | P0 |
| AUTH-7 | Backend API endpoints: POST /api/auth/register, POST /api/auth/login | P0 |
| AUTH-8 | Passwords hashed with bcrypt before storage | P0 |
| AUTH-9 | Simple JSON file-based user storage (upgradeable to DB later) | P1 |

### 2.3 User Flow
```
Start → /login (or /register)
  ↓ Register → create account → redirect to /login
  ↓ Login → validate credentials → store token → redirect to /home
  ↓ All other routes → check auth → if not logged in → redirect to /login
  ↓ Logout → clear token → redirect to /login
```

### 2.4 UI Design
- **Login Page**: Clean card layout with green agricultural theme, background with subtle crop pattern, "AI Crop Recommendation & Growth Prediction System" branding
- **Register Page**: Same theme, with Full Name, Email, Password, Confirm Password fields
- Both pages have links to switch between Login ↔ Register

---

## 3. Feature 2: Agricultural Imagery on Home Page

### 3.1 Overview
After login, the landing home page should showcase beautiful agricultural imagery — crops, plants, trees — to make the application visually engaging and project-relevant.

### 3.2 Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| IMG-1 | Add a visual gallery/showcase section on ModernHome page with crop/plant images | P0 |
| IMG-2 | Use free, high-quality images from Unsplash (via URL) | P0 |
| IMG-3 | Display at least 6 agricultural images (rice, wheat, corn, cotton, tea plantation, vegetable farm) | P0 |
| IMG-4 | Images should have captions/labels | P1 |
| IMG-5 | Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop) | P0 |
| IMG-6 | Smooth hover effects and rounded corners | P1 |

### 3.3 Image Categories
1. Rice paddy fields
2. Wheat fields
3. Corn/Maize crops
4. Cotton plantation
5. Tea garden
6. Vegetable farming

---

## 4. Feature 3: Full Multi-Language Interface Support

### 4.1 Overview
When a user selects any language from the dropdown (in Settings or Navbar), the **entire** interface must update to that language. The language dropdown must be fully visible — not hidden behind white or transparent elements.

### 4.2 Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| LANG-1 | Language dropdown in navbar: fix z-index and background so all options are visible | P0 |
| LANG-2 | Dropdown must have solid background color, proper contrast, and scroll for many languages | P0 |
| LANG-3 | Max-height with scroll for the dropdown (40+ languages won't fit on screen) | P0 |
| LANG-4 | When language is changed, ALL UI text (navbar, sidebar, pages, buttons) must update | P0 |
| LANG-5 | Translation keys for auth pages (Login, Register, etc.) must be added | P0 |
| LANG-6 | Dynamic translation via backend for non-static languages continues to work | P0 |

### 4.3 Dropdown Fix
- Set `max-height: 400px` with `overflow-y: auto` on the dropdown
- Use `bg-white` with `shadow-2xl` and high `z-index` (z-50)
- Ensure dropdown items have solid background on hover

---

## 5. Feature 4: Real-Time Multilingual Chatbot

### 5.1 Overview
The chatbot must work in real-time and understand/respond in whatever language the user has selected. It should support voice input and text-to-speech output in all available languages.

### 5.2 Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| CHAT-1 | Chatbot sends the current app language to the backend with every message | P0 |
| CHAT-2 | Backend uses Gemini AI with language-aware system prompt to respond in the user's language | P0 |
| CHAT-3 | Backend uses deep-translator as fallback to translate responses | P0 |
| CHAT-4 | Speech Recognition uses correct BCP-47 locale for the selected language | P0 |
| CHAT-5 | Text-to-Speech uses correct locale for the selected language | P0 |
| CHAT-6 | Quick questions update to match the selected language | P1 |
| CHAT-7 | Chatbot greeting updates when language changes | P0 |
| CHAT-8 | The chatbot header text updates based on selected language | P1 |

### 5.3 Architecture
```
User speaks/types in Language X
  → Frontend sends { message, language: "X" } to POST /api/chat
  → Backend Gemini prompt includes "Respond in language X"
  → If Gemini fails, FAQ response translated via deep-translator
  → Response returned in Language X
  → Frontend TTS speaks in Language X
```

---

## 6. Implementation Plan

### Phase 1: Authentication (Backend + Frontend)
1. Create backend auth endpoints (register, login)
2. Create AuthContext in frontend
3. Build Login and Register pages
4. Add route protection
5. Add logout to navbar

### Phase 2: Home Page Images
1. Add agricultural image gallery section to ModernHome
2. Add translation keys for image section

### Phase 3: Language Dropdown Fix
1. Fix navbar dropdown styling (z-index, bg, max-height, scroll)
2. Verify all languages visible and selectable

### Phase 4: Chatbot Multilingual
1. Pass language from GlobalSettings to AdvancedChatbot
2. Ensure backend Gemini prompt includes language instruction
3. Update chatbot header/greeting dynamically
4. Test voice in multiple languages

---

## 7. Success Criteria

- [ ] User can register a new account and login
- [ ] Unauthenticated users are redirected to login
- [ ] Home page displays agricultural crop images after login
- [ ] Language dropdown shows all languages with solid background, scrollable
- [ ] Changing language updates the entire UI
- [ ] Chatbot responds in the selected language
- [ ] Voice input/output works in the selected language
- [ ] All changes work without breaking existing functionality
