import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyInfo } from "@/entities/PartyInfo";
import { InvokeLLM } from "@/integrations/Core";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";

export default function ChatLulu({ onVoltar }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [partyInfo, setPartyInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadPartyInfo();
    // Mensagem inicial
    setMessages([
      {
        id: 1,
        text: "Oi! Eu sou o Lulu! 👶🎂 Estou muito animado para a minha festa de 1 aninho! Pergunte qualquer coisa sobre a festa ou sobre mim!",
        sender: "lulu",
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadPartyInfo = async () => {
    const data = await PartyInfo.list();
    if (data.length > 0) {
      setPartyInfo(data[0]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const context = `
        Você é o Lulu, um bebê de 1 ano que está fazendo aniversário. Responda como se fosse ele mesmo, de forma fofa, animada e infantil.
        
        Informações sobre você (Lulu):
        - Nasceu no dia 27/11/2024
        - Pesou 3.100kg e mediu 49.5cm ao nascer
        - Nasceu no Hospital Unimed em Caxias do Sul
        - Mãe: Tainá
        - Pai: Eduardo  
        - Irmão: Bernardo
        - Não come açúcar ainda
        - É alérgico a ovo
        
        Informações da festa:
        ${partyInfo ? `
        - Nome do evento: ${partyInfo.event_name}
        - Data: ${new Date(partyInfo.date).toLocaleDateString('pt-BR')}
        - Horário: ${partyInfo.time}
        - Local: ${partyInfo.location_name}
        - Endereço: ${partyInfo.address}
        - Informações extras: ${partyInfo.additional_info || 'Nenhuma'}
        ` : '- Informações da festa ainda não foram definidas'}
        
        Dicas de presente:
        - Brinquedos educativos
        - Roupas tamanho 2 de verão ou 3 de inverno
        
        Regras:
        1. Seja sempre fofo, alegre e use emojis de bebê/frutas
        2. Fale sobre como está animado para a festa
        3. Se não souber alguma coisa, peça para entrar em contato no WhatsApp (55) 54 99165-6068
        4. Use linguagem simples como um bebê falaria
        5. Mencione que o tema da festa é frutas 🍎🍌🍓
      `;

      const response = await InvokeLLM({
        prompt: `${context}\n\nPergunta do convidado: ${inputMessage}`,
        response_json_schema: null
      });

      const luluMessage = {
        id: Date.now() + 1,
        text: response,
        sender: "lulu",
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, luluMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Ops! Estou um pouquinho sonolento agora... 😴 Tente perguntar de novo ou entre em contato no WhatsApp (55) 54 99165-6068!",
        sender: "lulu",
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <Button onClick={onVoltar} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600">Chat com o Lulu</h1>
            <p className="text-gray-600">Converse com o aniversariante! 👶</p>
          </div>
          
          <div></div>
        </motion.div>

        <Card className="bg-white/95 backdrop-blur-md fruit-shadow h-[70vh] flex flex-col">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e88e9e6ca_RostodeBebAlegreeBrilhante.png"
                alt="Lulu"
                className="w-12 h-12 rounded-full border-3 border-white"
              />
              <div>
                <p className="text-blue-600 font-bold">Lulu</p>
                <p className="text-sm text-gray-600">O aniversariante 🎂</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-md' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      {message.sender === 'lulu' && (
                        <div className="flex items-center gap-2 mb-2">
                          <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e88e9e6ca_RostodeBebAlegreeBrilhante.png"
                            alt="Lulu"
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-xs font-bold text-blue-600">Lulu</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e88e9e6ca_RostodeBebAlegreeBrilhante.png"
                        alt="Lulu"
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta para o Lulu..."
                  className="flex-1 text-base"
                  disabled={isLoading}
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="fruit-button px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Pressione Enter para enviar • Lulu responde em poucos segundos! 👶
              </p>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Contact */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-200">
            <CardContent className="text-center p-6">
              <h3 className="text-lg font-bold text-green-700 mb-2">
                Precisa falar com os papais? 👨‍👩‍👧‍👦
              </h3>
              <a 
                href="https://wa.me/5554991656068" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/>
                </svg>
                WhatsApp (55) 54 99165-6068
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}