import json

from flask import Flask, render_template, url_for, request, jsonify, escape, session, redirect, make_response
from util import json_response, hash_password, verify_password
from flask_cors import CORS

import data_handler
import util

app = Flask(__name__)
# CORS(app)
# cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.secret_key = util.random_key()


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    logged_in = None
    if 'username' in session:
        logged_in = session['username']
    return data_handler.get_boards(logged_in)


# @app.route("/get-cards/<int:board_id>")
# @json_response
# def get_cards_for_board(board_id: int):
#     """
#     All cards that belongs to a board
#     :param board_id: id of the parent board
#     """
#     return data_handler.get_cards_for_board(board_id)
#

@app.route("/get-statuses/<board_id>")
@json_response
def get_statuses_for_board(board_id):
    return data_handler.get_statuses_for_board(board_id)


@app.route("/get-cards/<status_id>")
@json_response
def get_cards_for_status(status_id):
    return data_handler.get_cards_for_status(status_id)


@app.route('/move', methods=['POST'])
def reorder_cards():
    req = request.get_json()
    print(req)
    card_id = int(req['id'][10:])
    board_id = int(req['board_id'])
    status_id = int(req['status_id'])
    column_order = int(req['column_order'])

    print(card_id, board_id, status_id, column_order)
    data_handler.insert_new_ordered_cards(card_id, board_id, status_id, column_order)
    return make_response('OK', 200)


@app.route("/api/create-board", methods=['GET', 'POST'])
def create_new_board():
    board_title = request.form['board-title']
    data_handler.create_new_board(board_title)
    return redirect(url_for('index'))


@app.route('/api/delete-board', methods=['POST'])
def delete_board():
    board_id = request.json['board_id']
    data_handler.delete_board(board_id)
    return redirect("/")


@app.route("/api/create-private-board", methods=['GET', 'POST'])
def create_private_new_board():
    logged_in = None
    if 'username' in session:
        logged_in = session['username']
    private_board_title = request.form['private-board-title']
    data_handler.create_private_new_board(private_board_title, logged_in)
    return redirect(url_for('index'))


@app.route('/api/view-archive/<board_id>')
def view_archive(board_id):
    data = data_handler.view_archive(board_id)
    return jsonify(data)


@app.route('/archive-card/<card_id>')
def archive_cards(card_id):
    data_handler.archive_cards(card_id)
    return redirect("/")


@app.route('/api/undo-archive/<card_id>')
def undo_archive(card_id):
    data_handler.undo_archive(card_id)
    return redirect('/')


@app.route('/api/create-status', methods=['POST'])
def create_status():
    board_id = request.json['board_id']
    status_title = request.json['status_title']
    data_handler.add_new_status(status_title, board_id)
    return make_response("OK", 200)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


@app.route('/')
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    logged_in = None
    if 'username' in session:
        logged_in = session['username']
    return render_template('index.html', logged_in=logged_in)


@app.route('/register', methods=['POST'])
def register():
    try:
        username = util.username_validation(request.form['username'])
        password = hash_password(request.form['password'])
        if username and password:
            data_handler.save_credentials(username, password)
            return jsonify({'success': 'Account created, try to login.'})
        else:
            return jsonify({'error': 'Missing Data'})
    except:
        return jsonify({'error': 'Username already exists, try again.'})


@app.route('/login', methods=['GET', 'POST'])
def login():
    try:
        username = util.username_validation(request.form['username'])
        password = request.form['password']
        table_hash_pass = data_handler.get_hash_pass(username=username)
        if verify_password(password, table_hash_pass[0]['password']):
            session['username'] = username
    except:
        return jsonify({'error': 'Invalid username or password.'})
    return render_template('index.html')


@app.route('/api/create-card', methods=['POST'])
def create_card():
    try:
        board_id = request.json['board_id']
        card_title = request.json['card_title']
        status_id = data_handler.get_first_status_id_for_board(board_id)
        data_handler.create_card(card_title, board_id, status_id)
        return make_response('ssttrriinngg', 200)
    except:
        print('Tried new card without status.')
        return make_response('SOmething went wrong', 500)


@app.route('/api/rename-card/<card_id>', methods=['POST'])
def rename_card(card_id):
    try:
        card_id = request.json['cardId']
        new_title = request.json['tempValue']
        data_handler.rename_card(card_id, new_title)
        return make_response('OK', 200)
    except:
        print('Card rename unsuccessful.')
        return make_response('Card rename unsuccessful.', 500)


@app.route('/api/delete-card/<card_id>', methods=['POST'])
def delete_card(card_id):
    try:
        card_id = request.json['cardId']
        data_handler.delete_card(card_id)
        return make_response('OK', 200)
    except:
        print('Card delete unsuccessful.')
        return make_response('Card delete unsuccessful.', 500)


@app.route('/api/board-first-status/<board_id>')
@json_response
def api_board_first_status(board_id):
    first_status_id = data_handler.get_first_status_id_for_board(board_id)
    last_card_id = data_handler.get_status_last_card_id(first_status_id)
    last_card_order = data_handler.get_status_last_card_order(first_status_id)
    return {'first_status_id': first_status_id, 'last_card_id': last_card_id, 'last_card_order': last_card_order}


@app.route('/api/rename-board-title/<board_id>', methods=['POST'])
def rename_board_title(board_id):
    data = request.get_data().decode()
    dict_data = json.loads(data)
    print(dict_data)
    try:
        board_id = dict_data['boardId']
        new_title = dict_data['tempValue']
        print(board_id)
        print(new_title)
        data_handler.rename_board_title(board_id, new_title)
        return make_response('OK', 200)
    except:
        return make_response('Card rename unsuccessful.', 500)


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))


@app.route('/update-statuses', methods=['POST'])
def update_status_title():
    req = request.get_json()
    new_status_value = req['value']
    status_id = int(req['status_id'])
    data_handler.replace_status_column(status_id, new_status_value)
    return make_response('Success', 200)


@app.route('/sw.js', methods=['GET'])
def sw():
    return app.send_static_file('sw.js')


@app.route('/bootstrap-4.3.1-dist/css/bootstrap.css', methods=['GET'])
def return_bootstrap_css():
    return app.send_static_file('bootstrap-4.3.1-dist/css/bootstrap.css')


@app.route('/bootstrap-4.3.1-dist/js/bootstrap.js', methods=['GET'])
def return_bootstrap_js():
    return app.send_static_file('bootstrap-4.3.1-dist/js/bootstrap.js')


@app.route('/js/main.js', methods=['GET'])
def return_main_js():
    return app.send_static_file('js/main.js')


@app.route('/js/dom.js', methods=['GET'])
def return_dom_js():
    return app.send_static_file('js/dom.js')


@app.route('/offline_page', methods=['GET'])
def return_offline_page():
    return app.send_static_file('offline_page.html')


@app.route('/js/offlineScript.js', methods=['GET'])
def return_offline_script():
    return app.send_static_file('js/offlineScript.js')


@app.route('/return-offline-boards')
def return_offline_boards():
    boards = data_handler.return_all_boards_for_offline()

    if boards is False:
        failed_status = {'status': 'failed'}
        return make_response(jsonify(failed_status), 200)
    return make_response(jsonify(boards), 200)


@app.route('/return-offline-cards')
def return_offline_cards():
    cards = data_handler.return_all_statuses_and_cards()

    if cards is False:
        failed_status = {'status': 'failed'}
        return make_response(jsonify(failed_status), 200)
    return make_response(jsonify(cards), 200)


if __name__ == '__main__':
    main()
