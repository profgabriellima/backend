from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os # Importar os caso vá usar os.path.exists depois, como nos slides

app = Flask(__name__)
CORS(app)

def carregar_usuarios():
    # É uma boa prática verificar se o arquivo existe antes de abrir para leitura
    if os.path.exists('data/usuarios.json'):
        with open('data/usuarios.json', 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []
    
def salvar_usuarios(usuarios):
    with open('data/usuarios.json', 'w', encoding='utf-8') as f:
        json.dump(usuarios, f, ensure_ascii=False, indent=2)

@app.route('/usuarios', methods=['POST'])
def cadastrar_usuario():
    try:
        dados = request.get_json()
        
        if not dados or 'nome' not in dados or 'email' not in dados:
            return jsonify({'erro': 'Dados inválidos'}), 400
            
        usuarios = carregar_usuarios()
        
        if any(u['email'] == dados['email'] for u in usuarios):
            return jsonify({'erro': 'Usuário já cadastrado'}), 409
            
        usuarios.append(dados)
        salvar_usuarios(usuarios)
        
        return jsonify(dados), 201
        
    except Exception as e:
        return jsonify({'erro': f'Erro interno: {str(e)}'}), 500

if __name__ == '__main__':
        app.run(port=5000, debug=True)