# Harbour

Harbour is a responsive student companion for non-local university students settling into Hong Kong. It brings practical safety, language, settling-in, and local guidance tools into one calm, welcoming place.

This repository contains the app and its API. The separately exported Figma Make prototype is kept as a local reference and excluded from Git.

## What Harbour does

### Public landing and arrival

- Introduces Harbour with a responsive editorial landing page, animated scroll reveals, and an illustrated Three.js arrival scene.
- Guides new visitors into profile setup or returning visitors back to the profile already saved in their browser.
- Provides a local-profile login flow. This prototype does not create server accounts or passwords.

### Student tools

- **Scam X-ray:** checks a pasted message for warning patterns, explains the result, and suggests next steps. It is educational guidance, not a verified fraud determination.
- **Settle-in list:** loads starter tasks, saves checked items locally, and lets students create their own lists and tasks. Finishing the list triggers a celebration.
- **Cantonese helper:** translates a phrase into Cantonese and shows a clear loading, result, or error state.
- **Ask Harbour:** answers everyday Hong Kong student-life questions through the configured AI service.

### Harbour home and community

- Shows a seven-day activity graph, live Hong Kong weather, Tide Bank demo balance, Voice SOS preview, and sample community events.
- Includes a persistent navigation drawer to the dashboard, profile, people directory, Bunny garden, community, Tide Bank, and Voice SOS.
- Keeps the emergency numbers visible near the bottom of Home: 999, the Police Anti-Scam Helpline at 18222, and Immigration enquiries at 2824 6111. Tap a number on a supported device to call.
- Labels sample or simulated features clearly. Community events, friend profiles, Tide Bank points, and Voice SOS are demos; they do not book events, transfer money, or place calls.

### Profiles and progress

- Saves profile details, profile photo, friend list, checklist progress, and custom lists in this browser.
- Provides separate profile and dashboard screens, including progress analytics, tide points, friends, and optional social usernames.
- Offers a searchable university picker with the eight Hong Kong UGC-funded universities and logo marks, with a monogram fallback.
- Recognizes profile data saved by earlier Harbour prototype versions and migrates it to the current local profile format.

## Design and brand

The visual system follows the approved Harbour prototype: warm ivory surfaces, deep harbour green, pale water blue, soft sage, coral, and a restrained gold accent. Large Fraunces display headings pair with DM Sans interface text. Pages use editorial grids, rounded panels, generous spacing, and clear action states.

The custom Harbour mark combines a harbour entrance, a rising sun, and calm wave lines. The SVG mark is used in the site favicon and brand badges. A horizontal SVG wordmark is included for reuse.

Motion and layout adapt for smaller screens and reduced-motion preferences. Navigation becomes a scrollable mobile drawer; tool layouts stack; forms and university selection remain usable on narrow viewports. Slow operations include loading or skeleton states, and tools present explicit results and errors.

## Project timeline

| Milestone | Work completed |
| --- | --- |
| 1. App foundation | Set up the React/Vite client and Express API; connected client requests through the Vite `/api` proxy. |
| 2. Harbour prototype | Added the landing page, LandIn arrival scene, local profile setup, and the four student tools. |
| 3. Portal and personal space | Added the Home portal, profile and dashboard, activity charts, local progress, custom checklists, friend search, social links, and Bunny garden. |
| 4. Prototype alignment | Reworked the signed-in tool pages to match the approved Figma layouts and restored the side navigation, activity graph, emergency numbers, and decorative water ripples. |
| 5. Responsive and service polish | Improved mobile navigation and layouts, added saved-profile recovery, Hong Kong weather, university selection, loading and error states, and clearer demo labels. |
| 6. Brand and release preparation | Created the Harbour SVG logo and favicon, documented the app, and excluded the Figma Make export from Git tracking. |

## Technology

- **Client:** React 18, React Router, Vite, CSS, Three.js, and Recharts.
- **Server:** Node.js and Express.
- **AI and translation:** Gemini/Groq provider support for text assistance and Baidu Translate configuration; provider keys are optional for local UI work.
- **Data:** curated JSON files and browser `localStorage` for this prototype. There is no persistent database or server-side user authentication.
- **Weather:** current Hong Kong conditions from Open-Meteo. The client refreshes periodically and shows a retry state if weather cannot be reached.

## Run locally

From the `harbour/` directory:

```bash
npm run setup
npm run dev
```

The Vite client runs at `http://localhost:5173` and the Express API at `http://localhost:5000`.

For AI-backed features, copy `server/.env.example` to `server/.env` and add the keys for the providers you intend to use. Keep `.env` local; never commit API keys. The public landing page and browser-local profile flows do not require provider keys.

To build the client for production:

```bash
cd client
npm run build
```

## Repository map

```text
harbour/
├── client/
│   ├── public/              # Harbour logo, mark, and SVG favicon
│   └── src/
│       ├── components/      # Shared controls, logo picker, and 3D scene
│       ├── context/         # Browser-local profile state and migration
│       ├── data/            # Hong Kong university options
│       ├── lib/             # API calls and country helpers
│       └── pages/           # Landing, portal, dashboard, and tool screens
└── server/
    ├── ai/                  # AI provider clients and prompts
    ├── data/                # Checklist and reference JSON
    └── routes/              # Scam, translation, chat, and data endpoints
```

The Figma Make export lives beside this folder at the repository root for local design reference. The root `.gitignore` excludes it, and it is not part of the application build.

## Safety and privacy notes

- Profile and checklist information is stored in the browser that created it. Browser storage is scoped to the site origin, so `localhost`, a LAN address, and a deployed domain have separate local profiles.
- Scam, translation, and chat text may be sent to the configured Harbour API and AI provider to produce a response. Do not paste passwords, one-time codes, or sensitive personal information.
- Emergency, immigration, weather, and other external information should be checked with the relevant official service for urgent or high-impact decisions.
- Voice SOS, Tide Bank, sample friends, and community listings are non-production demonstrations.
