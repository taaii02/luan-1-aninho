{
  "name": "PartyInfo",
  "type": "object",
  "properties": {
    "event_name": {
      "type": "string",
      "description": "Nome do evento"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Data da festa"
    },
    "time": {
      "type": "string",
      "description": "Horário da festa"
    },
    "address": {
      "type": "string",
      "description": "Endereço completo"
    },
    "location_name": {
      "type": "string",
      "description": "Nome do local"
    },
    "additional_info": {
      "type": "string",
      "description": "Informações adicionais"
    },
    "map_embed": {
      "type": "string",
      "description": "HTML embed do mapa"
    }
  },
  "required": [
    "event_name",
    "date",
    "time",
    "address"
  ]
}