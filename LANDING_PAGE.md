# ASFALIS — Landing Page Content & Design Guide

> **Target audience:** Women aged 16–45 | **Tone:** Empowering, warm, trustworthy, urgent-but-calm  
> **App platform:** Android  
> **Brand colour palette:** Deep Crimson `#C0392B` · Ivory White `#FAF9F6` · Charcoal `#2C2C2C` · Blush Rose `#F1948A` · Dark Teal `#1A6B6B`

---

## Design Philosophy

| Principle | Application |
|---|---|
| **Safety-first aesthetics** | No neon, no aggressive red. Use deep crimson as an accent, not a flood. |
| **Feminine without being fragile** | Bold typography, confident copy — not cute pastel overload. |
| **Trust signals everywhere** | OTP-verified contacts, JWT security, ML technology — surface these subtly. |
| **Minimal cognitive load** | Each section answers ONE question. Short paragraphs. Breathing whitespace. |
| **Mobile-first mockups** | All hero imagery shows the Android app on phone screens. |

---

## Section 1 — Hero

### Headline
```
Your safety.
In your hands.
Always.
```

### Sub-headline
```
Asfalis is the personal safety companion every woman deserves —
silent, smart, and always ready when you need it most.
```

### CTA Buttons
- **Primary** → `Download on Google Play` *(Deep Crimson background, Ivory text)*
- **Secondary** → `See how it works ↓` *(outline, Dark Teal)*

### Hero Visual
Full-width split layout:
- **Left side** — Bold headline text on Ivory background with a subtle rose gradient from the bottom.
- **Right side** — Phone mockup showing the SOS trigger screen with the 10-second countdown UI.

### Hero Tagline (small text beneath CTA)
```
Free to download · No ads · Your data never sold
```

---

## Section 2 — The Problem (Why Asfalis Exists)

### Section Headline
```
Every 20 minutes, a woman in India faces violence.
You deserve better than hoping someone notices.
```

### Body Copy
```
Walking home late. Travelling solo. A situation that just feels wrong.

In those moments, fumbling with your phone to call someone — or hoping someone
will see you're in trouble — isn't good enough.

Asfalis was built because women shouldn't have to choose between looking calm
and staying safe. You deserve a guardian that works before you even have to ask.
```

### Visual
Three-panel illustration (line art style, Charcoal on Ivory):
1. Woman walking alone at night (uneasy expression)
2. Phone quietly registering the danger (subtle sensor ripple animation)
3. Alert already sent — contacts notified — safety confirmed

---

## Section 3 — Features (The Heart of the Page)

### Section Headline
```
One app. Every layer of protection.
```

### Section Sub-headline
```
Asfalis doesn't wait for you to ask for help. It's already watching.
```

---

### Feature Block 1 — SOS in One Tap

**Icon:** 🆘  
**Headline:** `Send an SOS before anyone realises you did.`

**Body:**
```
One tap on the SOS button starts a 10-second countdown.
If you're safe, cancel it. If you're not — do nothing.

Asfalis automatically sends your live location via SMS and
push notification to every trusted contact you've set up.
They'll know exactly where you are and that you need help.
```

**Visual:** Phone screen showing the SOS countdown timer with "I AM SAFE" and "SEND NOW" buttons.

---

### Feature Block 2 — Shake to Send SOS

**Icon:** 📳  
**Headline:** `Can't reach your screen? Just shake.`

**Body:**
```
When your hands are full, your phone is in your bag, or you simply
can't risk being seen — shake your phone.

Asfalis detects the motion and triggers an SOS automatically.
You control the sensitivity. You stay in control.
```

**Visual:** Illustrated hand gripping phone tightly with motion-blur shake lines. SOS dispatch animation on screen.

---

### Feature Block 3 — AI-Powered Auto SOS

**Icon:** 🤖  
**Headline:** `It knows something's wrong — even before you do.`

**Body:**
```
Asfalis uses a machine learning model trained on real movement patterns
to detect danger from your phone's accelerometer and gyroscope.

Sudden impact. Unusual struggling motion. An erratic fall.

The moment the AI detects danger, it starts an automatic SOS countdown —
giving you 10 seconds to cancel if it was a false alarm, and sending
help if you don't.

No button press needed. No words spoken.
```

**Design Note:** Use a subtle animated "brain + waveform" icon. Place this feature prominently — it's the strongest differentiator.

**Visual:** Side-by-side: raw sensor waveform animation on the left, "DANGER DETECTED" countdown screen on the right.

---

### Feature Block 4 — Wearable SOS Button (IoT)

**Icon:** ⌚  
**Headline:** `A discreet button. Hidden in plain sight.`

**Body:**
```
Pair Asfalis with our ESP32-powered wearable — a tiny Bluetooth button
you can wear as a pendant, clip to a bag, or keep in your pocket.

Single press → triggers SOS.
Double press → cancels it.

No screen needed. No one watching will know what you just did.
```

**Design Note:** Show a minimal, elegant hardware mockup next to the phone.  
**Visual:** Lifestyle photo of the wearable as a small pendant worn by a woman in everyday clothing.

---

### Feature Block 5 — Live Location Sharing

**Icon:** 🗺️  
**Headline:** `Let the people who matter know exactly where you are.`

**Body:**
```
Share your real-time GPS location with trusted contacts via a
live WebSocket stream — no SMS delays, no guessing.

Your map, your route, your safety — visible to the people you trust
for as long as you need.
```

**Visual:** In-app map screen mockup with a moving location pin and a "Sharing with 3 contacts" indicator.

---

### Feature Block 6 — Verified Trusted Contacts

**Icon:** 👥  
**Headline:** `Your safety circle — built on trust, not guesswork.`

**Body:**
```
Every contact you add goes through OTP verification.
An SMS is sent to their phone, confirming they're real, reachable,
and ready to receive your alerts.

Add family. Add friends. Mark one as Primary — they're the first to know.
```

**Visual:** "Add Contact" screen mockup with the OTP verification step highlighted.

---

### Feature Block 7 — SOS History

**Icon:** 📜  
**Headline:** `A record of every moment Asfalis had your back.`

**Body:**
```
Every SOS event — triggered, cancelled, or confirmed — is logged
with time, location, and status.

Keep it for yourself. Share it with authorities if needed.
Your history, your evidence.
```

**Visual:** SOS History list screen mockup.

---

### Feature Block 8 — Privacy & Security Built In

**Icon:** 🔒  
**Headline:** `Your data is yours. Full stop.`

**Body:**
```
One device at a time. Your account is locked to your phone — 
switching devices requires a 12-hour verified handset transfer.

Screenshots of sensitive screens like your contacts and SOS history
are blocked inside the app.

OTP login. JWT-secured sessions. No password to steal.
Your safety app is itself — safe.
```

**Visual:** Shield icon with a subtle lock animation. No screenshots warning screen mockup.

---

## Section 4 — Why Asfalis? (Comparison / Positioning)

### Section Headline
```
Not just an emergency dialler. A complete safety layer.
```

### Comparison Table

| Feature | Basic safety apps | Asfalis |
|---|---|---|
| One-tap SOS | ✅ | ✅ |
| Shake to SOS | ❌ | ✅ |
| AI motion detection | ❌ | ✅ |
| IoT wearable support | ❌ | ✅ |
| Live GPS streaming | ❌ | ✅ |
| OTP-verified contacts | ❌ | ✅ |
| Screenshot protection | ❌ | ✅ |
| Single-device security | ❌ | ✅ |
| No ads, no data selling | ❌ | ✅ |

**Design Note:** Table cells use Deep Crimson ✅ ticks and Charcoal ❌ crosses. Asfalis column has a Blush Rose highlight strip.

---

## Section 5 — How It Works (3 Simple Steps)

### Section Headline
```
Set up in under 3 minutes.
```

### Step 1
**Icon:** 📱  
**Title:** `Download & Register`  
**Body:** `Sign up with your phone number. A one-time OTP confirms it's really you on your real device.`

### Step 2
**Icon:** 👥  
**Title:** `Add Your Safety Circle`  
**Body:** `Add trusted contacts — family, friends, a neighbour. Each one is OTP-verified so your alerts reach real people.`

### Step 3
**Icon:** 🛡️  
**Title:** `Live Your Life. We're Watching.`  
**Body:** `Enable Auto SOS, adjust your shake sensitivity, pair your wearable — and simply go. Asfalis runs silently in the background.`

**Visual:** Three phone screens in sequence, connected by a subtle dotted line path. Minimal, clean.

---

## Section 6 — Social Proof / Testimonials

### Section Headline
```
Women who chose to stop worrying.
```

### Testimonial 1
> *"I travel for work every week. Before Asfalis, I'd text my sister my location manually every hour.
> Now I just turn on live sharing and she can see me the whole time."*
>
> — **Priya, 29, Marketing Manager**

### Testimonial 2
> *"The shake feature saved me in a situation where I couldn't even look at my phone.
> My mom called me within 90 seconds."*
>
> — **Rhea, 22, College Student**

### Testimonial 3
> *"I love that my contacts had to verify via OTP. I know my alerts go to real people
> who are ready to help — not a number I added by mistake."*
>
> — **Sanjana, 35, Working Mother**

**Design Note:** Testimonials appear in Blush Rose soft-bordered quote cards. Small avatar circle (illustrated, not real photos for privacy).

---

## Section 7 — Safety Statistics (Trust Anchor)

### Section Headline
```
The numbers that make Asfalis necessary.
```

### Statistics (displayed as large type)

```
1 in 3
women worldwide experience physical or sexual violence in their lifetime.
— WHO, 2021

86%
of women in India report feeling unsafe in public spaces.
— IANS Survey, 2023

< 10 seconds
is all Asfalis needs to alert your entire safety circle.
```

**Design Note:** Statistics use oversized bold numerals in Deep Crimson. Supporting text in Charcoal. Dark Teal thin separator lines between each stat.

---

## Section 8 — Call to Action (Bottom)

### Headline
```
You deserve to walk through the world without fear.
```

### Sub-headline
```
Download Asfalis today. Free. No subscriptions. No compromises.
```

### CTA Buttons
- **Primary** → `Download on Google Play`
- **Secondary** → `Learn more about our technology`

### Trust Badges (beneath buttons)
- 🔒 End-to-end secure sessions
- 📵 No ads. Ever.
- 🛡️ Your data stays yours

---

## Section 9 — Footer

```
© 2026 Asfalis. All rights reserved.

Links:
Privacy Policy | Terms of Service | Contact Us | GitHub (Open Source)

Social:
[Instagram] [Twitter/X] [LinkedIn]

Tagline:
"Safety isn't a privilege. It's a right."
```

---

## Typography Guide

| Element | Font Style | Weight | Size |
|---|---|---|---|
| Hero Headline | Serif (e.g. Playfair Display) | Bold | 64px desktop / 36px mobile |
| Section Headlines | Sans-serif (e.g. Inter) | SemiBold | 40px desktop / 28px mobile |
| Feature Headlines | Sans-serif | Medium | 24px |
| Body copy | Sans-serif | Regular | 16px / line-height 1.7 |
| CTAs | Sans-serif | Bold | 18px |
| Testimonials | Serif italic | Regular | 17px |
| Statistics numerals | Sans-serif | ExtraBold | 72px |

---

## Colour Usage Guide

| Colour | Hex | Use |
|---|---|---|
| Deep Crimson | `#C0392B` | Primary CTA buttons, accent lines, statistic numerals, feature icons |
| Ivory White | `#FAF9F6` | Page background, card backgrounds |
| Charcoal | `#2C2C2C` | Body text, headings |
| Blush Rose | `#F1948A` | Testimonial card borders, soft highlights, secondary accents |
| Dark Teal | `#1A6B6B` | Secondary CTA, dividers, trust badges |
| Light Grey | `#EFEFEF` | Section dividers, table alternate rows |

---

## Animation & Interaction Notes

- **Hero CTA button** — subtle pulse animation (Blush Rose glow) on hover/focus.
- **Feature block icons** — gentle entrance animation (fade up) as the user scrolls into view.
- **SOS countdown visual** — looping animation of the 10-second ring filling up and resetting.
- **Statistics section** — numbers count up from zero when scrolled into view (JS counter animation).
- **Wearable button** — single click animation → SOS ripple propagation effect.
- **Scroll behaviour** — sticky navigation bar that becomes opaque on scroll. Deep Crimson accent line on active nav link.

---

## Page Structure Summary (Build Order)

```
[1] Navigation Bar          → Logo | Features | How it works | Download
[2] Hero Section            → Headline + CTA + Phone mockup
[3] Problem Statement       → Emotional hook + illustration
[4] Features Grid           → 8 feature blocks (alternating layout L/R)
[5] Why Asfalis Table       → Competitor comparison
[6] How It Works            → 3-step visual flow
[7] Testimonials            → 3 quote cards
[8] Statistics              → 3 big-number trust anchors
[9] Final CTA               → Download + trust badges
[10] Footer                 → Links + tagline
```

---

## SEO & Meta Tags

```html
<title>Asfalis — Women's Personal Safety App for Android</title>
<meta name="description" content="Asfalis is an AI-powered women's safety Android app with one-tap SOS, shake-to-alert, live GPS sharing, IoT wearable support, and verified trusted contacts. Download free." />
<meta name="keywords" content="women safety app, SOS app India, personal safety android, emergency alert app, women security app" />
<meta property="og:title" content="Asfalis — Your Safety. In Your Hands. Always." />
<meta property="og:description" content="The most complete personal safety app for women. AI-powered Auto SOS, shake detection, live GPS, IoT wearable, OTP-verified contacts. Free on Android." />
```
