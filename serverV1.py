import selectors
import socket
import types
import json
import numpy as np

# IP y Puerto
HOST = '127.0.0.1'
PORT = 8080

# Almacenar informacion de los rooms y usuarios
rooms = {}
users = {}

def process_message(message, connection): 
    obj = json.loads(message)
    response =	{
        "type": 0
    }
    #TODO: Evaluar tipo de mensaje y aplicar logica correspondiente
    return response

def registro(sock):
    # Aceptar conexiones
    conn, addr = sock.accept()
    print('accepted connection from', addr)
    conn.setblocking(False)
    data = types.SimpleNamespace(addr=addr, inb=b'', outb=b'')
    # Eventos permitidos y asignarlos a la conexion
    events = selectors.EVENT_READ | selectors.EVENT_WRITE 
    sel.register(conn, events, data=data)

def procesar_solicitud(key, mask):
    # Objeto enviado por...
    sock = key.fileobj 
    # El objeto enviado es...
    data = key.data 
    # Verificamos si se puede leer
    if mask & selectors.EVENT_READ:
        recv_data = sock.recv(1024) 
        if recv_data: 
            data.outb += recv_data
        else: 
            # La conexion se ha cerrado
            print('closing connection to', data.addr)
            sel.unregister(sock)
            sock.close()
    # Escribir en el socket
    if mask & selectors.EVENT_WRITE: 
        if data.outb:
            print(key, mask)
            message = data.outb
            print("recibi", message.decode("utf-8"), type(message.decode("utf-8")))
            response = process_message(message.decode("utf-8"), sock)
            if (response):
                sock.send(repr(response).encode("utf-8"))  
            data.outb = data.outb[len(message):]


sel = selectors.DefaultSelector() 

# Crear socket
lsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
lsock.bind((HOST, PORT)) 
lsock.listen() 
print('listening on', (HOST, PORT))
lsock.setblocking(False)
sel.register(lsock, selectors.EVENT_READ, data=None) 

while True:
    # Esperar a que se registren eventos
    events = sel.select(timeout=None)
    for key, mask in events:
        # Se recorren los eventos y si el cliente aun no esta registrado
        # Se procede a registrar, caso contrario se procesa la solicitud
        if key.data is None:
            registro(key.fileobj)
        else:
            procesar_solicitud(key, mask)
