# Universidad del Valle de Guatemala
# CC3067 Curso de Redes
# Proyecto 2
# Integrantes
# * Maria Ines Vasquez Figueroa - 18250
# * Paula Camila Gonzalez Ortega - 18398
# * Diana Ximena de Leon Figueroa - 18607
# * Maria Jose Castro Lemus - 181202

import socket
import sys
import random
import numpy as np
import time
from settings import *

WINNER = False

if len(sys.argv) <= 1:
    print("server.py <port>")
    sys.exit()


# Logica general extraida de proyecto de IA de Hoppers

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:

    server_port = int(sys.argv[1])
    server_address = (SERVER_DEFAULT_IP, server_port)

    sock.bind(server_address)
    sock.listen(5)

    connections = []

    #TODO: Nuestro programa tiene un nuevo variable de jugadores
    while len(connections) < MAX_PLAYERS:
        print("Waiting for players ... ")
        conn, addr = sock.accept()
        print("One player entered!")
        connections.append(conn)

    print("Game ready!")

    #TODO: Cambiar a repartir las cartas a los jugadores
    connections[0].send(f"{REGISTER}(0,0)".encode())
    connections[1].send(f"{REGISTER}(9,9)".encode())

    
    while not WINNER:
        # TODO: make refactor, the two players do the same...
        # Start to receive moves
        print("Waiting for new move from Player 1...")
        first_player_req = connections[0].recv(BUFF_SIZE)
        
        # Parse bytes response to string
        first_player_req = first_player_req.decode()
        action, payload = first_player_req[0], first_player_req[1:]
        
        # Validate player 1 & action
        if action == NEW_MOVE:
            pass

        print("Waiting for new move from Player 2...")
        second_player_req = connections[1].recv(BUFF_SIZE)
        
        # Parse bytes response to string
        second_player_req = second_player_req.decode()
        action, payload = second_player_req[0], second_player_req[1:]
        
        # Validate player 2 & action
        if action == NEW_MOVE:
            pass

    # Close connection
    sock.close()

    # Send game status to both players
    connections[0].send(f"{GAME_END}".encode())
    connections[1].send(f"{GAME_END}".encode())