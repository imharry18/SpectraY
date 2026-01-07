from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64

app = Flask(__name__)
# Allow requests from Next.js (Port 3000)
CORS(app, resources={r"/*": {"origins": "*"}})

# 🚀 CRITICAL FIX: Allow large image uploads (50MB Limit)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024 

# Global Memory Storage (In-memory for this session)
original_image = None

def array_to_base64(img_array):
    """Convert NumPy array to Base64 string for the Frontend"""
    _, buffer = cv2.imencode('.jpg', img_array, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    return f"data:image/jpeg;base64,{base64.b64encode(buffer).decode('utf-8')}"

def base64_to_array(b64_string):
    """Convert Base64 string from Frontend to NumPy array"""
    if ',' in b64_string:
        b64_string = b64_string.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(b64_string), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

@app.route('/upload', methods=['POST'])
def upload_image():
    global original_image
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({"error": "No image data"}), 400

        print("📥 Receiving Image Upload...")
        original_image = base64_to_array(data['image'])
        
        print(f"✅ Image Loaded: {original_image.shape}")
        return jsonify({"status": "success", "message": "Image loaded into memory"})
    
    except Exception as e:
        print(f"❌ Upload Failed: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/process', methods=['POST'])
def process_image():
    global original_image
    
    if original_image is None:
        return jsonify({"error": "No image loaded in backend. Please re-upload."}), 400

    try:
        data = request.json
        params = data.get('params', {})
        print(f"⚡ Processing: {params}")

        # 1. Start from the fresh ORIGINAL image every time
        img = original_image.copy()

        # 2. BRIGHTNESS & CONTRAST
        brightness = int(params.get('brightness', 0))
        contrast = int(params.get('contrast', 0))
        if brightness != 0 or contrast != 0:
            alpha = 1.0 + (contrast / 100.0) # Contrast (1.0 is neutral)
            beta = brightness                # Brightness
            img = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

        # 3. COLOR (Saturation & Hue)
        saturation = int(params.get('saturation', 0))
        hue = int(params.get('hue', 0))
        if saturation != 0 or hue != 0:
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype("float32")
            (h, s, v) = cv2.split(hsv)
            
            # Adjust Saturation
            s = s * (1.0 + saturation / 100.0)
            s = np.clip(s, 0, 255)
            
            # Adjust Hue
            h = h + hue
            h = np.clip(h, 0, 179) # Hue wraps 0-179 in OpenCV

            hsv = cv2.merge([h, s, v])
            img = cv2.cvtColor(hsv.astype("uint8"), cv2.COLOR_HSV2BGR)

        # 4. EFFECTS (Blur & Sharpness)
        blur_val = int(params.get('blur', 0))
        if blur_val > 0:
            k = (blur_val * 2) + 1 # Kernel must be odd
            img = cv2.GaussianBlur(img, (k, k), 0)

        sharpness = int(params.get('sharpness', 0))
        if sharpness > 0:
            kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
            sharp_img = cv2.filter2D(img, -1, kernel)
            # Blend
            img = cv2.addWeighted(img, 1.0 - (sharpness/100), sharp_img, (sharpness/100), 0)

        # 5. FILTERS (Grayscale / Invert)
        if params.get('grayscale'):
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR) # Keep 3 channels
        
        if params.get('invert'):
            img = cv2.bitwise_not(img)

        # 6. GEOMETRY (Rotate & Flip)
        rotate = int(params.get('rotate', 0)) # Expected 0, 90, 180, 270
        if rotate == 90: img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        elif rotate == 180: img = cv2.rotate(img, cv2.ROTATE_180)
        elif rotate == 270: img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)

        if params.get('flipH') == -1: img = cv2.flip(img, 1)
        if params.get('flipV') == -1: img = cv2.flip(img, 0)

        # 7. RETURN RESULT
        return jsonify({
            "status": "success",
            "processed_image": array_to_base64(img)
        })

    except Exception as e:
        print(f"❌ Processing Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Turn off debug reloader to prevent double-loading issues
    app.run(port=5000, debug=True, use_reloader=False)