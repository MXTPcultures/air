from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def main():

    page = {
        '0': { 'js_file': 'main.js', 'next_page': 1}
    }

    return render_template('index.html', data = page['0'])

@app.route('/p/<p>')
def page(p): 

    pages = {
        '1': { 'js_file': 'chapter_1/title.js', 'next_page': 2},
        '2': { 'js_file': 'chapter_1/piece.js', 'next_page': 3},
        '3': { 'js_file': 'chapter_2/title.js', 'next_page': 4}, # or some other data telling it where to go next
        '4': { 'js_file': 'chapter_2/piece.js', 'next_page': 5}, # or some other data telling it where to go next
        '5': { 'js_file': 'chapter_3/title.js', 'next_page': 6}, # or some other data telling it where to go next
        '6': { 'js_file': 'chapter_3/piece_1.js', 'next_page': 7}, # or some other data telling it where to go next
        '7': { 'js_file': 'chapter_3/piece_2.js', 'next_page': 1}, # or some other data telling it where to go next
    }

    if p in pages:
        return render_template('index.html', data=pages[p])

    else: # return a 404
        return render_template('404.html'), 404

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
