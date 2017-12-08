from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def main():

    root = { 'js_file': 'main.js', 'next_page': 1}

    return render_template('index.html', data = root)

@app.route('/p/<p>')
def page(p):

    # Example route: example.com/p/abc
    pages = {
        '1': { 'js_file': 'chapter_1/title/main.js', 'next_page': 2},
        '2': { 'js_file': 'chapter_1/piece/main.js' },
        '3': { 'js_file': 'chapter_2/title/main.js', 'button': True } # or some other data telling it where to go next
    }

    if p in pages:
        return render_template('index.html', data=pages[p])

    else: # return a 404
        return render_template('404.html'), 404

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
