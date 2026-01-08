from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64

app = Flask(__name__)
# Allow all origins to prevent CORS errors
CORS(app, resources={r"/*": {"origins": "*"}})

# 50MB Upload Limit
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024 

# Global Memory Storage
original_image = None

def array_to_base64(img_array):
    _, buffer = cv2.imencode('.jpg', img_array, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    return f"data:image/jpeg;base64,{base64.b64encode(buffer).decode('utf-8')}"

def base64_to_array(b64_string):
    if ',' in b64_string:
        b64_string = b64_string.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(b64_string), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

def apply_sepia(img, intensity=100):
    """Applies Sepia tone using matrix multiplication."""
    # Normalized intensity 0.0 to 1.0
    k = intensity / 100.0
    
    # Sepia Matrix
    # We blend the original image with the Sepia matrix based on intensity
    sepia_filter = np.array([[0.272, 0.534, 0.131],
                             [0.349, 0.686, 0.168],
                             [0.393, 0.769, 0.189]])
    
    sepia_img = cv2.transform(img, sepia_filter)
    sepia_img = np.clip(sepia_img, 0, 255)
    
    # Blend: (1-k)*Original + k*Sepia
    if k >= 1.0:
        return sepia_img.astype(np.uint8)
    else:
        # Weighted add
        return cv2.addWeighted(img, 1.0 - k, sepia_img.astype(np.uint8), k, 0)

def apply_sketch(img):
    """Creates a pencil sketch effect."""
    # 1. Convert to Gray
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # 2. Invert
    inv = cv2.bitwise_not(gray)
    # 3. Gaussian Blur
    blur = cv2.GaussianBlur(inv, (21, 21), 0)
    # 4. Color Dodge (Blend)
    # We use divide to simulate 'Color Dodge' blending mode
    sketch = cv2.divide(gray, 255 - blur, scale=256)
    return cv2.cvtColor(sketch, cv2.COLOR_GRAY2BGR)

def apply_edge_detection(img):
    """Applies Canny Edge Detection."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Canny edge detection
    edges = cv2.Canny(gray, 100, 200)
    # Invert to make it look like pencil on paper (black edges on white)
    edges = cv2.bitwise_not(edges)
    return cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

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
        
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"❌ Upload Failed: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/process', methods=['POST'])
def process_image():
    global original_image
    
    if original_image is None:
        return jsonify({"error": "No image loaded. Please re-upload."}), 400

    try:
        data = request.json
        params = data.get('params', {})
        print(f"⚡ Processing Filters: {params}")

        img = original_image.copy()

        # --- PHASE 1: STRUCTURAL FILTERS (Override standard processing) ---
        if params.get('sketch'):
            img = apply_sketch(img)
            # We usually return early for sketch, or allow rotate afterwards
            
        elif params.get('edge'):
            img = apply_edge_detection(img)

        # --- PHASE 2: STANDARD PIPELINE (If not structural) ---
        else:
            # 1. Grayscale (Standard)
            if params.get('grayscale'):
                img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

            # 2. Sepia (Color Matrix)
            if params.get('sepia'):
                img = apply_sepia(img, intensity=params.get('sepia'))

            # 3. Brightness & Contrast
            brightness = int(params.get('brightness', 0))
            contrast = int(params.get('contrast', 0))
            if brightness != 0 or contrast != 0:
                alpha = 1.0 + (contrast / 100.0)
                beta = brightness
                img = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

            # 4. Color Adjustments (HSV)
            saturation = int(params.get('saturation', 0))
            hue = int(params.get('hue', 0))
            
            if saturation != 0 or hue != 0:
                hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype("float32")
                (h, s, v) = cv2.split(hsv)
                
                # Saturation
                s = s * (1.0 + saturation / 100.0)
                s = np.clip(s, 0, 255)
                
                # Hue
                h = h + hue
                h = np.clip(h, 0, 179)
                
                hsv = cv2.merge([h, s, v])
                img = cv2.cvtColor(hsv.astype("uint8"), cv2.COLOR_HSV2BGR)

            # 5. Invert Colors
            if params.get('invert'):
                img = cv2.bitwise_not(img)

        # --- PHASE 3: FINISHING (Blur/Sharpness/Geometry) ---
        # These can apply to both Sketch/Edge results AND standard images
        
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
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False)