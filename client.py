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
import threading
from settings import *

EXIT_CODES = {
    SERVER_FULL: "Server is full! Try again later",
    GAME_END : "Thank you for playing!"
}

ERROR_CODES = {
    ILLEGAL_MOVE: "Opponent sent an illegal move, change turn!",
}
GAME_OVER = False

if len(sys.argv) != 3:
    print("client.py <server-ip> <port>")
    sys.exit()

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server_ip = sys.argv[1]
server_port = int(sys.argv[2])
if sys.argv[1] == "default":
    server_ip = SERVER_DEFAULT_IP

server_address = (server_ip, server_port)

def game_thread():
    # this function handles display
    global GAME_OVER
    global my_turn

    while not GAME_OVER:
        response, _ = sock.recvfrom(BUFF_SIZE)

        # Parse bytes response to string
        response = response.decode()
        action, payload = response[0], response[1:]
        
        if action == REGISTER:
            #TODO: Repartir cartas a los jugadores 
            pass

        elif action == NEW_MOVE:
            #TODO: Acciones correspondientes al juego
            pass


        elif action in EXIT_CODES:
            print(EXIT_CODES[response])
            GAME_OVER = True

        elif action in ERROR_CODES:
            print(ERROR_CODES[response])
            # TODO: change/omit opponent turn, and continue game

        else:
            print(action, payload)

def bot_thread():
    """
    This function handles bot response (moves)
    """
    # Server handshake
    # handshake_message = HANDSHAKE
    # sock.sendto(handshake_message.encode(), server_address)

    global GAME_OVER
    global my_turn
    
    while not GAME_OVER:
        pass

def start_game():
    # this function launches the game
    bot = threading.Thread(target=bot_thread)
    game = threading.Thread(target=game_thread)
    bot.daemon = True
    game.daemon = True
    bot.start()
    game.start()
    while not GAME_OVER:
        time.sleep(1)

def initialize():
    print(f"Connecting to Hoppers server on {server_ip}...")
    sock.connect(server_address)

initialize()
start_game()