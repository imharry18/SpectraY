# ⚡ SpectraY: Next-Gen Image Processing Engine

<div align="center">

  ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
  ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
  ![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)

  <br />
  
  **Professional-grade image manipulation powered by Python matrices, running in your browser.**

  [View Demo](#) · [Report Bug](#) · [Request Feature](#)
</div>

---

## 🚀 Overview

**SpectraY** is a full-stack web application that bridges the gap between high-level web interactivity and low-level computer vision algorithms.

Unlike standard web editors that rely on CSS filters, SpectraY sends raw image data to a **Python backend**, where it is converted into **NumPy matrices**. This allows for scientific-grade precision in operations like edge detection, convolution, and histogram equalization, all while maintaining a smooth, 60fps React frontend.

### ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🎨 Pixel-Perfect Editing** | Manipulate RGB channels directly for Brightness, Contrast, and Saturation. |
| **⚡ Real-Time Pipeline** | 3-Stage processing (Structural → Color → Finishing) ensures logical effect stacking. |
| **🖼️ Filter Gallery** | One-click application of complex convolution matrices (Gaussian Blur, Canny Edge, Sharpen). |
| **🎛️ Dual Workflow** | Choose between the **Studio Editor** for granular control or the **Filter Library** for instant presets. |
| **🛠️ Full-Stack Power** | Seamless JSON-over-HTTP communication between Next.js and Flask. |

---

## 🏗️ Architecture

The system follows a modern **Client-Server** architecture optimized for heavy computational tasks.

```mermaid
graph LR
  A[User / Browser] -- Uploads Image --> B[Next.js Frontend]
  B -- Base64 JSON Payload --> C[Flask Backend]
  C -- Decodes to Matrix --> D[OpenCV / NumPy Engine]
  D -- Applies Math Operations --> D
  D -- Encodes to Base64 --> C
  C -- Returns JSON --> B
  B -- Updates Canvas --> A

💻 Tech StackFrontend (Client)Framework: Next.js 16 (App Router)UI Library: React 18Styling: Tailwind CSSMotion: Framer Motion (Animations)UX: Lenis (Smooth Scroll)Backend (Server)Runtime: Python 3.10+Framework: FlaskCore Processing: OpenCV (cv2) & NumPy🚀 Getting StartedFollow these steps to set up SpectraY locally.PrerequisitesNode.js (v18+)Python (v3.8+)1. Clone the RepoBashgit clone [https://github.com/yourusername/spectray.git](https://github.com/yourusername/spectray.git)
cd spectray
2. Frontend SetupBash# Install dependencies
npm install

# Run the development server
npm run dev
The frontend will launch at http://localhost:3000.3. Backend SetupOpen a new terminal window in the root directory.Bash# (Optional) Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python requirements
pip install Flask flask-cors opencv-python-headless numpy

# Start the Flask server
python api/index.py
The backend will launch at http://localhost:5000 (or api/ in Vercel environment).
---

##📂 Project StructurePlaintext/
├── api/                  # Python Backend (Serverless Ready)
│   └── index.py          # Main Application Entry
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.js       # Landing Page
│   │   └── studio/       # Workspace (Editor/Filters)
│   ├── components/       # UI Library
│   │   ├── ui/           # Atoms (Sliders, Cards)
│   │   └── studio/       # Complex Modules
│   └── utils/            # Helper Functions
├── public/               # Static Assets
└── next.config.mjs       # API Rewrites Config

🧠 The Math Behind the MagicHow does SpectraY turn a slider movement into a visual change?Input: The user requests Brightness +50.Matrix Operation: The backend receives the image as a matrix $M$. It applies the scalar addition:$$M_{new}(x, y) = M_{old}(x, y) + 50$$Clamping: Values exceeding 255 are clamped to prevent integer overflow artifacts.Output: The modified matrix is re-encoded and sent back.For Edge Detection, we utilize the Canny Algorithm:Apply Gaussian Blur to reduce noise.Find intensity gradients ($G_x, G_y$).Apply non-maximum suppression and hysteresis thresholding.🔮 Roadmap[x] Core Editor: Brightness, Contrast, Rotation.[x] Filter Library: Sepia, Grayscale, Invert.[ ] Generative AI: Integration with PyTorch for Neural Style Transfer.[ ] Procedural Workspace: Generate noise patterns and gradients from scratch.[ ] Batch Processing: Zip file upload support.📄 LicenseDistributed under the MIT License. See LICENSE for more information.