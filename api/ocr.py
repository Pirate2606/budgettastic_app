from veryfi import Client
import requests
import os


veryfi_client = Client(
    os.environ.get('CLIENT_ID'),
    os.environ.get('CLIENT_SECRET'),
    os.environ.get('USERNAME'),
    os.environ.get('API_KEY')
)

def perform_ocr(url, category):
    with open('pic1.jpg', 'wb') as handle:
        response = requests.get(url, stream=True)
        if not response.ok:
            return response

        for block in response.iter_content(1024):
            if not block:
                break
            handle.write(block)
    
    categories = ['Grocery', 'Utilities', 'Travel']
    categories.append(category)
    file_path = './pic1.jpg'
    response = veryfi_client.process_document(file_path, categories=categories)
    return response
