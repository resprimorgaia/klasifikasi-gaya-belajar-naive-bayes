from flask import Flask, render_template, request, jsonify
from joblib import load
import os

app = Flask(__name__, static_url_path='/static')
model = load('model/modelsaya.model')

@app.route("/")
def beranda():
    return render_template('index.html')

@app.route('/api/deteksi', methods=['POST'])
def predict():
    data = request.get_json()

    total_visual = data.get('totalVisual', 0)
    total_audio = data.get('totalAudio', 0)
    total_kinestetik = data.get('totalKinestetik', 0)

    # Memastikan nilai-nilai yang diterima adalah integer
    try:
        total_visual = int(total_visual)
        total_audio = int(total_audio)
        total_kinestetik = int(total_kinestetik)
    except ValueError:
        return jsonify({'error': 'Invalid input'}), 400

    # Melakukan prediksi menggunakan model
    prediction = model.predict([[total_visual, total_audio, total_kinestetik]])

    # Mengonversi kelas prediksi ke label yang sesuai
    if prediction[0] == 0:
        prediction_label = "Gaya Belajar Auditori"
        additional_paragraph = "Individu dengan gaya belajar auditori cenderung memproses informasi lebih baik melalui pendengaran. Mereka memahami dan mengingat informasi yang disampaikan melalui ucapan, pembicaraan, atau rekaman audio. Metode pembelajaran yang efektif bagi mereka mencakup mendengarkan ceramah, berpartisipasi dalam diskusi kelompok, menggunakan rekaman audio, serta terlibat dalam pertunjukan atau drama. Media pembelajaran yang cocok untuk gaya belajar ini meliputi podcast, rekaman audio, ceramah yang direkam, dan materi pembelajaran yang disertai dengan dialog atau narasi."
    elif prediction[0] == 1:
        prediction_label = "Gaya Belajar Kinestetik"
        additional_paragraph ="Individu dengan gaya belajar kinestetik lebih efektif dalam memahami informasi melalui pengalaman praktis dan interaksi fisik dengan materi pembelajaran. Mereka belajar lebih baik melalui aktivitas fisik dan eksperimen. Metode pembelajaran yang tepat untuk individu dengan gaya belajar kinestetik meliputi pembelajaran berbasis proyek, simulasi, permainan peran, eksperimen, dan kegiatan lapangan. Media pembelajaran yang sesuai untuk gaya belajar ini termasuk simulasi interaktif, permainan pembelajaran, model 3D, dan kegiatan praktis yang melibatkan manipulasi objek."
    else:
        prediction_label = "Gaya Belajar Visual"
        additional_paragraph ="Individu dengan gaya belajar visual cenderung memproses informasi dengan lebih baik melalui melihat dan mengingat gambar, diagram, atau grafik. Mereka membutuhkan visualisasi yang kuat untuk memahami konsep-konsep baru. Metode pembelajaran yang tepat untuk mereka termasuk penggunaan gambar, diagram, presentasi visual, dan papan tulis interaktif. Menyajikan informasi dalam bentuk grafis atau visual akan membantu mereka memahami dan mengingat materi dengan lebih baik. Media pembelajaran yang sesuai untuk gaya belajar visual meliputi video pembelajaran, gambar, slide presentasi, animasi, dan aplikasi berbasis visual."

    response = {'kelas_prediksi_label': prediction_label, 'additional_paragraph' : additional_paragraph}
    return jsonify(response)

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)