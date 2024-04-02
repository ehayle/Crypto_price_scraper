from flask import Flask, render_template, jsonify
from flask_bootstrap import Bootstrap
from whitenoise import WhiteNoise
import requests

app = Flask(__name__, static_url_path='/static')
app.config['DEBUG'] = False
bootstrap = Bootstrap(app)

# Fetch cryptocurrency data in smaller batches
def get_cryptocurrency_data(start=1, limit=100):
    url = 'https://web-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
    params = {
        'start': start,
        'limit': limit,
    }
    response = requests.get(url, params=params)
    data = response.json()
    return data['data']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/top_ten_prices')
def top_ten_prices():
    cryptocurrency_data = get_cryptocurrency_data(limit=10)
    return jsonify(cryptocurrency_data)

@app.route('/remaining_prices')
def remaining_prices():
    cryptocurrency_data = get_cryptocurrency_data(start=11, limit=90)  # Fetch remaining 90 cryptocurrencies
    return jsonify(cryptocurrency_data)

if __name__ == '__main__':
    app.run(debug=True)
