from pymongo import MongoClient
from flask import Flask, render_template, request, jsonify

import random

app = Flask(__name__)

client = MongoClient(
    "mongodb+srv://sparta:test@cluster0.svk42ds.mongodb.net/?retryWrites=true&w=majority"
)
db = client.dbUpDown
upDown = db.upDown
maxCnt = db.maxCnt

@app.route('/')
def hello():
    return render_template('index.html')

# 생성 post 요청
@app.route("/createNumber", methods=["POST"])
def number_create():
    randomNumber = random.randint(1, 100)
    print("랜덤 생성 숫자 1 ~ 100까지 중: ", randomNumber)

    doc = {
        "number": randomNumber,
    }

    number = list(upDown.find({}, {"_id": False}))
    print("현재 넘버의 길이 : ", len(number))

    if len(number) == 1:
        print("이미 숫자가 있음")
        return
    else:
        
        upDown.insert_one(doc)
        print("post 숫자 저장", doc)
        return jsonify({"msg": "app.py > post 요청 create"})
    

@app.route("/changeNumber", methods=["POST"])
def restart():
    randomNumber = random.randint(1, 100)

    curVal = list(upDown.find({}, {"_id": False}))

    upDown.update_one({'number': curVal[0]['number']},{'$set':{'number': randomNumber}})
    return jsonify({"msg": "숫자 변경"})

# 맥스 카운트 
@app.route("/maxCnt", methods=["POST"])
def max_cnt():
    max_receive = request.form['max_give']

    maxVal = list(maxCnt.find({}, {"_id": False}))

    print('???: ',maxVal[0]['maxCnt'])
    doc = {
        "maxCnt":  max_receive
        }

    if(len(maxVal) == 0):
        print(len(maxVal), '빈 배열이기 때문에 값 넣음')
        maxCnt.insert_one(doc)
        return jsonify({'msg': '빈배열에 맥스 값 넣음'})
    elif(int(maxVal[0]['maxCnt']) < int(max_receive)):
        print('더 큰 값이 들어옴')
        maxCnt.update_one({'maxCnt': maxVal[0]['maxCnt']},{'$set':{'maxCnt': max_receive}})
        return jsonify({'msg': '더 큰 값 들어옴'})
    elif(int(maxVal[0]['maxCnt']) > int(max_receive)):
        print('받은 값보다 이미 큼')
        return jsonify({'msg': '아무일도 없음'})
    

# 읽기 get 요청
@app.route("/readMaxCnt", methods=["GET"])
def max_get():
    maxVal = list(maxCnt.find({}, {"_id": False}))

    print(maxVal)
    return jsonify({"maxVal": maxVal})

    

# 읽기 get 요청
@app.route("/readNumber", methods=["GET"])
def number_get():
    number = list(upDown.find({}, {"_id": False}))

    print(number)
    return jsonify({"msg": number})


if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True)
