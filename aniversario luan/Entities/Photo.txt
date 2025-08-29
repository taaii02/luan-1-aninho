{
  "name": "Photo",
  "type": "object",
  "properties": {
    "guest_name": {
      "type": "string",
      "description": "Nome de quem postou"
    },
    "photo_url": {
      "type": "string",
      "description": "URL da foto"
    },
    "caption": {
      "type": "string",
      "description": "Legenda da foto"
    },
    "approved": {
      "type": "boolean",
      "default": false,
      "description": "Se a foto foi aprovada pelo admin"
    }
  },
  "required": [
    "guest_name",
    "photo_url"
  ],
  "rls": {
    "read": {
      "$or": [
        {
          "approved": true
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "write": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}