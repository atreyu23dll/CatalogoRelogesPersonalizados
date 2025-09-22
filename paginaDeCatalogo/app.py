from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
@app.route("/UnicTime")
def home():
    return render_template('index.html', title="home")

if __name__ == "__main__":
    app.run(debug=True)
