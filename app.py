from flask import Flask, request, jsonify
from PIL import Image
import io
import base64
import numpy as np
import tensorflow as tf
from flask_cors import CORS


model = tf.keras.models.load_model(r'C:\Users\ADMIN\Downloads\dev\project\mnist_model.h5')

# Tạo Flask app
app = Flask(__name__)
CORS(app)  
@app.route('/predict', methods=['POST']) # /predict name ==> that use in script at line 42 (script)
def predict():
    try:
        data = request.get_json()
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        image_data = data['image'].split(",")[1]
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))
        # image.save("received.png")

        
        image = image.convert('L')  # Chuyển sang grayscale
        image = image.resize((28, 28))  
        image_array = np.array(image) / 255.0  
        image_array = image_array.reshape(1, 28, 28)  
        predictions = model.predict(image_array)
        probabilities = predictions[0].tolist()  
        predicted_label = np.argmax(predictions)

        return jsonify({
            'prediction': int(predicted_label),
            'probabilities': probabilities
        })  #Json package
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
