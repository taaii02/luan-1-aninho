{
  "name": "Timeline",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Título do marco"
    },
    "description": {
      "type": "string",
      "description": "Descrição do momento"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Data do marco"
    },
    "age_months": {
      "type": "number",
      "description": "Idade em meses"
    },
    "photo_url": {
      "type": "string",
      "description": "URL da foto"
    },
    "order": {
      "type": "number",
      "description": "Ordem de exibição"
    }
  },
  "required": [
    "title",
    "date",
    "age_months",
    "order"
  ]
}