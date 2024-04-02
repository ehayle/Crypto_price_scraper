from flask import Flask, render_template, jsonify
from flask_bootstrap import Bootstrap
import requests

app = Flask(__name__, static_url_path='/static')
app.config['DEBUG'] = False
bootstrap = Bootstrap(app)

def get_cryptocurrency_data():
    url = 'https://web-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
    cryptocurrency_data = []

    for start in range(1, 20000, 5000):
        params = {
            'start': start,
            'limit': 5000,
        }

        r = requests.get(url, params=params)
        data = r.json()

        cryptocurrency_data.extend(data['data'])

    return cryptocurrency_data

def get_top_ten_prices():
    cryptocurrency_data = get_cryptocurrency_data()
    top_ten = cryptocurrency_data[:10]
    return top_ten

def get_remaining_prices():
    cryptocurrency_data = get_cryptocurrency_data()
    remaining = cryptocurrency_data[10:100]
    return remaining

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/top_ten_prices')
def top_ten_prices():
    return jsonify(get_top_ten_prices())

@app.route('/remaining_prices')
def remaining_prices():
    return jsonify(get_remaining_prices())

if __name__ == '__main__':
    app.run(debug=True)
