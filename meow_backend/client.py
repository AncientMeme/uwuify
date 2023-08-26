import requests

def sendGet():
    id = 'test'
    r = requests.get('http://localhost:8000/api/name={}'.format(id))
    print(r.text)

def sentPost():
    data = {'urls': 'value'}
    r = requests.post('http://localhost:8000/', json=data)
    print(r.json())

def sentDownloadImgPost():
    data = {'urls': ['https://i.ytimg.com/vi/L45Ua8weKqs/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC9XUQUbDSSoNC2SwmU10yn5tbCLQ']}
    r = requests.post('http://8.222.181.202:9999/echoJson', json=data)
    print(r.json())



if __name__ == '__main__':
    # sendGet()
    # sentPost()
    sentDownloadImgPost()
