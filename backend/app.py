from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import jieba

# 加載模型和矢量化器
model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

# 初始化 Flask 應用
app = Flask(__name__)
CORS(app)

def preprocess_text(text):
    return " ".join(jieba.cut(text)).strip()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided!'}), 400

    # 預處理並轉換為特徵向量
    preprocessed_text = preprocess_text(text)
    text_tfidf = vectorizer.transform([preprocessed_text])

    # 預測
    prediction = model.predict(text_tfidf)[0]
    response = "你是舔狗" if prediction == 1 else "你是純情男"
    return jsonify({'prediction': response})

if __name__ == '__main__':
    app.run(debug=True)
