# LinkedIn Post — UT Simulator (English)

## Version 1 — Technical, ~1,300 characters (recommended)

How many times have you watched a Level-1 trainee misread an A-scan because the V1 block calibration was wrong from the start?

Ultrasonic testing looks simple on paper — until the echo at 73 mm turns out to be a mode-converted shear wave from the back wall, not the planar reflector you were chasing.

I built a browser-based UT Simulator on MetallurgyTools to close that exact gap between textbook physics and the buttons on a Krautkrämer.

What it lets you do:
• Switch material (carbon steel, aluminum, copper, custom v) and watch longitudinal/shear velocities update in real time
• Use straight, angle (35°–80°), or twin-crystal probes — frequency and diameter adjustable
• Calibrate against V1 (IIW) or V2 blocks before each scan
• Tune gain (dB), time base, gate position, and temperature compensation
• Read the A-scan with live near-field (N = D²f / 4v), Snell refraction (sin θ₂/sin θ₁ = v₂/v₁), and distance (v = 2d/t) calculated on screen

Built for:
→ NDT Level-1/2 candidates preparing under EN ISO 9712 / SNT-TC-1A
→ Quality engineers explaining UT principles to production teams
→ Metallurgists who want to feel beam spread and attenuation before walking onto the shop floor

Not a substitute for hands-on certification training — but a fast way to internalize the physics before you pick up the transducer.

Free to try. No login required for the core simulator.

🔗 www.metallurgytools.com/tools/ultrasonic

#UltrasonicTesting #NDT #NonDestructiveTesting #Metallurgy #QualityControl #SteelIndustry #ASNT #ISO9712 #PipelineInspection #WeldInspection

---

## Version 2 — Shorter, ~600 characters (for higher click-through)

A-scan interpretation lives or dies on calibration.

I built a browser-based UT Simulator to let engineers practice the full chain — probe selection, V1/V2 calibration, gain tuning, gate placement, and A-scan reading — without needing a flaw detector in front of them.

Supports straight / angle / twin-crystal probes, four material presets with editable velocities, real-time near-field and Snell calculations, and temperature compensation.

Useful for NDT Level-1/2 prep (EN ISO 9712) and shop-floor UT training.

Free. No signup for the simulator itself.

🔗 www.metallurgytools.com/tools/ultrasonic

#UltrasonicTesting #NDT #Metallurgy #QualityControl #WeldInspection

---

## Version 3 — Story hook, ~900 characters (for engagement)

Years ago I watched a colleague reject a 16 mm API X65 plate because his V1 calibration was off by 4 dB. The reflector was real — but the sizing was wrong, and the plate was good.

That moment is why I built the UT Simulator on MetallurgyTools.

It runs in the browser. You pick a material (steel, Al, Cu, custom), mount a virtual straight / angle / twin probe, calibrate against V1 or V2, tune gain, set the gate, and read the A-scan. Near field, Snell refraction, and time-of-flight distance are all calculated live.

Not a replacement for a real flaw detector — but a way for trainees, QC engineers, and production metallurgists to internalize the physics before they touch the equipment.

Built from 18+ years of integrated-plant UT data.

🔗 www.metallurgytools.com/tools/ultrasonic

#UltrasonicTesting #NDT #Metallurgy #SteelIndustry #ASNT #ISO9712 #WeldInspection #QC

---

## Posting tips

• Best time to post: Tuesday–Thursday, 08:00–10:00 local time (your audience is at their desk before shift handover).
• First 2 lines are the only ones visible before "see more" — they decide click-through.
• If you have a 10–15 sec screen-capture GIF of the A-scan responding to gain changes, attach it. LinkedIn boosts video/GIF reach ~2× vs text-only.
• Reply to the first 3–5 comments within 30 min of posting — drives algorithm push.
• Tag 1–2 relevant NDT communities if any tag your organization (e.g., @ASNT, @BINDT) — but only if genuinely relevant.

## Notes on technical claims

[Unverified] — Confirm before posting that your simulator actually supports:
• 35°–80° angle range (verify in `components/ultrasonic/UTSimulator.js`)
• Twin-crystal probe mode
• Temperature compensation toggle
• Real-time near-field display

If any of these are not yet implemented, edit that bullet out — overstated features in a public post damage credibility with NDT engineers, who will test the claim within minutes.
