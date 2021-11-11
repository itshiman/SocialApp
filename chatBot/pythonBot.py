from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from chatterbot.trainers import ListTrainer

chatbot = ChatBot(
    'CoronaBot',
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    logic_adapters=[
        'chatterbot.logic.MathematicalEvaluation',
        'chatterbot.logic.TimeLogicAdapter',
        'chatterbot.logic.BestMatch',
        {
            'import_path': 'chatterbot.logic.BestMatch',
            'default_response': 'I am sorry, but I do not understand. I am still learning.',
            'maximum_similarity_threshold': 0.90
        }
    ],
    database_uri='sqlite:///database.sqlite3'
)

training_data_quesans = open(
    '/home/himanshu/Desktop/PythonBot/ques_ans.txt').read().splitlines()
training_data_personal = open(
    '/home/himanshu/Desktop/PythonBot/personal_ques.txt').read().splitlines()

training_data = training_data_quesans + training_data_personal

trainer = ListTrainer(chatbot)
trainer.train(training_data)

# Training with English Corpus Data
trainer_corpus = ChatterBotCorpusTrainer(chatbot)
trainer_corpus.train(
    'chatterbot.corpus.english'
)

app = Flask(__name__)
cors = CORS(app)


@cross_origin()
@app.route("/")
@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    return str(chatbot.get_response(userText))


if __name__ == "__main__":
    app.run()
