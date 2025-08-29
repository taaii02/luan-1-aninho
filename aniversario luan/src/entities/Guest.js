{
  "name": "Guest",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome do convidado"
    },
    "email": {
      "type": "string",
      "description": "Email do convidado"
    },
    "phone": {
      "type": "string",
      "description": "Telefone do convidado"
    },
    "will_attend": {
      "type": "boolean",
      "description": "Se vai comparecer"
    },
    "adults_count": {
      "type": "number",
      "default": 1,
      "description": "Número de adultos"
    },
    "children_count": {
      "type": "number",
      "default": 0,
      "description": "Número de crianças"
    },
    "message": {
      "type": "string",
      "description": "Mensagem do convidado"
    }
  },
  "required": [
    "name"
  ]
}