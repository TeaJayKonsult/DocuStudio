# DocuStudio — The Modern PDF & Document Workspace

DocuStudio by **TeaJay Konsult** is an all-in-one document suite rewritten as a reactive Single Page Application (SPA) powered by **React 19, TypeScript, Vite, and Tailwind CSS**.

## ✨ Core Features & Workspaces

1. **PDF Viewer & Reader**:
   - Vector-accurate client-side PDF rendering via PDF.js.
   - Smooth multi-level zoom (up to 250%), 90° clockwise rotation, page jump navigation.
   - Direct browser printing and one-click document downloading.

2. **PDF Editor & Form Filler**:
   - Interactive annotation overlays: custom text boxes with variable font sizes & colors.
   - Form field stamps and checkmarks (✓).
   - Digital signature pad with touch and mouse drawing support.
   - Real binary compilation via **PDF-Lib** into downloadable, vector-grade signed PDFs.
   - Live activity execution log.

3. **Rich Text & Note Editor**:
   - Full WYSIWYG typography formatting (Bold, Italic, Underline, Strikethrough, Headings, Lists, Quotes).
   - Real-time word count, character count, and reading time estimation.
   - Direct export to Plain Text (`.txt`), Web Page (`.html`), and formatted print-to-PDF.

4. **Multi-Format Document Viewers**:
   - **Excel & CSV (`.xlsx`, `.xls`, `.csv`)**: Interactive data grids powered by **SheetJS (xlsx)** with sheet tabs, row filtering, and column search.
   - **PowerPoint Presenter (`.pptx`)**: Slide deck viewer with presenter notes and pagination controls.
   - **E-Book Reader (`.epub`, `.txt`)**: Reader mode with Light, Sepia, and Night theme presets with dynamic font sizing.
   - **Word Document Viewer (`.docx`)**: Formatted contract and memo previewer.

5. **User Workspace & Account Dashboard**:
   - Action quota tracking: 5 Free monthly operations, or unlimited operations for Pro members.
   - Auditable recent activity history log with instant search.
   - Firebase Auth integration (Email/Password, Google Sign-In) with zero-friction demo testing mode.
   - Account management with password updates and data deletion controls.

6. **Pro Tier & Paystack Integration**:
   - Flat ₦700/month Pro membership upgrade with Paystack inline checkout.

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Compile for production
npm run build
```
