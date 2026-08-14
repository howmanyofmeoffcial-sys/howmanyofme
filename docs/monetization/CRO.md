# Conversion Rate Optimization (CRO)

## 1. Funnel Architecture
The CRO engine optimizes the journey from initial organic landing to multi-page exploration and tool usage:

```text
Organic Search Visitor
         ↓
Instant Quick-Answer Verification (< 1s)
         ↓
Tool Interaction / Deep Dive (Related names, full-name lookup, comparison tool)
         ↓
Multi-Page Session / Citation Copy / Data Download
```

---

## 2. High-Converting Interaction Surfaces

1. **Tool Call-to-Action (`ToolCTA.astro`)**:
   - Placed at the base of entity pages to guide users into related tools (e.g. "Looking for a full name?", "Compare another name").
2. **Copy Citation Island (`CopyCitationButton.tsx`)**:
   - One-click copy interaction providing pre-formatted citations for researchers and students.
3. **Phonetic & Similar Name Cards**:
   - Encourages lateral navigation into sibling name profiles.
