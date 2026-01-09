from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Vercel Configuration
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024 

# Global Memory Storage (Note: Serverless functions are stateless. 
# Global variables reset between requests. For a production app, 
# you would need external storage like AWS S3 or a database. 
# For this demo, we will try to pass data back and forth or accept limitations.)
# TO FIX THIS FOR VERCEL: We must assume the frontend sends the image every time 
# OR we rely on the container staying warm (which is unreliable).
# For now, we will keep it as is, but be aware of this limitation.
original_image = None

def array_to_base64(img_array):
    _, buffer = cv2.imencode('.jpg', img_array, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    return f"data:image/jpeg;base64,{base64.b64encode(buffer).decode('utf-8')}"

def base64_to_array(b64_string):
    if ',' in b64_string:
        b64_string = b64_string.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(b64_string), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

# --- ROUTES ---
# Note: In Vercel, this file maps to /api
# So @app.route('/upload') becomes https://your-site.vercel.app/api/upload

@app.route('/api/upload', methods=['POST'])
def upload_image():
    global original_image
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({"error": "No image data"}), 400

        # On serverless, printing logs appears in Vercel Dashboard
        print("📥 Receiving Image Upload...")
        original_image = base64_to_array(data['image'])
        
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"❌ Upload Failed: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/process', methods=['POST'])
def process_image():
    global original_image
    
    # CRITICAL SERVERLESS FIX:
    # Since Vercel functions might restart, 'original_image' might be lost.
    # A robust fix requires the frontend to send the image with every request 
    # OR the backend to store it in a temp URL/Database.
    # For this simple port, we check if it exists.
    if original_image is None:
        return jsonify({"error": "Session lost. Please re-upload image."}), 400

    try:
        data = request.json
        params = data.get('params', {})
        
        img = original_image.copy()

        # --- APPLY FILTERS (Same Logic as before) ---
        if params.get('sketch'):
            img = apply_sketch(img)
        elif params.get('edge'):
            img = apply_edge_detection(img)
        else:
            if params.get('grayscale'):
                img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
            if params.get('sepia'):
                img = apply_sepia(img, intensity=params.get('sepia'))
            
            brightness = int(params.get('brightness', 0))
            contrast = int(params.get('contrast', 0))
            if brightness != 0 or contrast != 0:
                alpha = 1.0 + (contrast / 100.0)
                beta = brightness
                img = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

            saturation = int(params.get('saturation', 0))
            hue = int(params.get('hue', 0))
            if saturation != 0 or hue != 0:
                hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype("float32")
                (h, s, v) = cv2.split(hsv)
                s = s * (1.0 + saturation / 100.0)
                s = np.clip(s, 0, 255)
                h = h + hue
                h = np.clip(h, 0, 179)
                hsv = cv2.merge([h, s, v])
                img = cv2.cvtColor(hsv.astype("uint8"), cv2.COLOR_HSV2BGR)

            if params.get('invert'):
                img = cv2.bitwise_not(img)

        # Blur
        blur_val = int(params.get('blur', 0))
        if blur_val > 0:
            k = (blur_val * 2) + 1
            img = cv2.GaussianBlur(img, (k, k), 0)

        # Sharpness
        sharpness = int(params.get('sharpness', 0))
        if sharpness > 0:
            kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
            sharp_img = cv2.filter2D(img, -1, kernel)
            img = cv2.addWeighted(img, 1.0 - (sharpness/100), sharp_img, (sharpness/100), 0)

        # Rotate
        rotate = int(params.get('rotate', 0))
        if rotate == 90: img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        elif rotate == 180: img = cv2.rotate(img, cv2.ROTATE_180)
        elif rotate == 270: img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)

        # Flip
        if params.get('flipH') == -1: img = cv2.flip(img, 1)
        if params.get('flipV') == -1: img = cv2.flip(img, 0)

        return jsonify({
            "status": "success",
            "processed_image": array_to_base64(img)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper functions (Keep your existing apply_sepia, apply_sketch, etc here)
def apply_sepia(img, intensity=100):
    k = intensity / 100.0
    sepia_filter = np.array([[0.272, 0.534, 0.131], [0.349, 0.686, 0.168], [0.393, 0.769, 0.189]])
    sepia_img = cv2.transform(img, sepia_filter)
    sepia_img = np.clip(sepia_img, 0, 255)
    if k >= 1.0: return sepia_img.astype(np.uint8)
    else: return cv2.addWeighted(img, 1.0 - k, sepia_img.astype(np.uint8), k, 0)

def apply_sketch(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    inv = cv2.bitwise_not(gray)
    blur = cv2.GaussianBlur(inv, (21, 21), 0)
    sketch = cv2.divide(gray, 255 - blur, scale=256)
    return cv2.cvtColor(sketch, cv2.COLOR_GRAY2BGR)

def apply_edge_detection(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 100, 200)
    edges = cv2.bitwise_not(edges)
    return cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

# For Local Development (Vercel ignores this part)
if __name__ == '__main__':
    app.run(port=5000)