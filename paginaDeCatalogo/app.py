import json
import os # <-- 1. Importa la librería 'os'
from flask import Flask, render_template, abort

app = Flask(__name__)

# 2. Obtenemos la ruta absoluta del directorio donde se encuentra app.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, 'productos.json')

def load_products():
    """Carga los productos desde el archivo JSON usando una ruta absoluta."""
    try:
        # 3. Usamos la nueva ruta absoluta para abrir el archivo
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"ADVERTENCIA: No se encontró productos.json en la ruta: {JSON_PATH}")
        return []

@app.route("/")
@app.route("/UnicTime")
def home():
    products = load_products()
    return render_template('index.html', productos=products)

@app.route('/producto/<product_id>')
def producto_detail(product_id):
    products = load_products()
    product = next((p for p in products if p['id'] == product_id), None)
    
    if product is None:
        abort(404, description="Producto no encontrado")
        
    return render_template('articulo_popup.html', producto=product)

if __name__ == "__main__":
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        use_reloader=True 
    )