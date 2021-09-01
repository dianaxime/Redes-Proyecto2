# Universidad del Valle de Guatemala
# CC3067 Curso de Redes
# Proyecto 2
# Integrantes
# * Maria Ines Vasquez Figueroa - 18250
# * Paula Camila Gonzalez Ortega - 18398
# * Diana Ximena de Leon Figueroa - 18607
# * Maria Jose Castro Lemus - 181202

#TODO: Adaptar a necesidades del juego
TURN_ERROR = "It isn't your turn right now."
INPUT_ERROR = "Invalid input: %s. Try again."
WAIT_MSG = "Awaiting players... (%s/%s).\n"
MAX_PLAYERS = 2
BUFF_SIZE = 8192
TIME_LIMIT = 900 #for 15 mins
SERVER_DEFAULT_IP = "0.0.0.0"

# Communication - Packet codes
HANDSHAKE = 'H'
SERVER_FULL = 'F'
REGISTER = 'P'
NEW_MOVE = 'M'
GAME_END = 'W'
ILLEGAL_MOVE = 'I'