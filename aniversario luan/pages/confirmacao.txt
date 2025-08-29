
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Guest } from "@/entities/Guest";
import { UserCheck, Heart, Users, MessageSquare, CheckCircle, XCircle } from "lucide-react";

export default function Confirmacao() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    will_attend: null,
    adults_count: 1,
    children_count: 0,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.will_attend === null) {
      alert("Por favor, confirme se você vai participar da festa.");
      return;
    }

    setIsSubmitting(true);
    try {
      await Guest.create(formData);
      setIsSubmitted(true);
    } catch (error) {
      alert("Erro ao enviar confirmação. Tente novamente.");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto text-center"
        >
          <Card className="bg-white/95 backdrop-blur-md fruit-shadow">
            <CardContent className="p-8">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                {formData.will_attend ? "Confirmação Recebida!" : "Obrigado pela resposta!"}
              </h2>
              <p className="text-gray-600 mb-6">
                {formData.will_attend 
                  ? "Mal podemos esperar para celebrar com você!" 
                  : "Sentiremos sua falta, mas entendemos."}
              </p>
              <div className="flex justify-center gap-2 text-3xl">
                🍎 🍌 🍓 🍊 🍍
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Confirme sua Presença
          </h1>
          <p className="text-lg text-gray-600">
            Adoraríamos ter você na festa do Luan! 🎂
          </p>
          <div className="flex justify-center gap-2 text-3xl mt-4">
            🍎 🍌 🍓 🍊 🍍
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="bg-white/95 backdrop-blur-md fruit-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-green-600">
                <UserCheck className="w-7 h-7" />
                Informações do Convidado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações pessoais */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1 text-base"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1 text-base"
                        placeholder="seuemail@exemplo.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-base font-semibold">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1 text-base"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirmação de presença */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">
                    Você vai participar da festa? *
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      onClick={() => handleInputChange('will_attend', true)}
                      className={`flex-1 py-4 px-3 text-sm sm:text-base rounded-xl transition-all ${
                        formData.will_attend === true
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-white border-2 border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Sim, estarei lá! 🎉</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleInputChange('will_attend', false)}
                      className={`flex-1 py-4 px-3 text-sm sm:text-base rounded-xl transition-all ${
                        formData.will_attend === false
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-white border-2 border-red-200 text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Não poderei ir 😔</span>
                    </Button>
                  </div>
                </div>

                {/* Número de pessoas - só mostra se confirmou presença */}
                {formData.will_attend === true && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl"
                  >
                    <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Quantas pessoas vão comparecer?
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adults" className="text-base font-semibold">Adultos</Label>
                        <Input
                          id="adults"
                          type="number"
                          min="1"
                          value={formData.adults_count}
                          onChange={(e) => handleInputChange('adults_count', parseInt(e.target.value) || 1)}
                          className="mt-1 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="children" className="text-base font-semibold">Crianças</Label>
                        <Input
                          id="children"
                          type="number"
                          min="0"
                          value={formData.children_count}
                          onChange={(e) => handleInputChange('children_count', parseInt(e.target.value) || 0)}
                          className="mt-1 text-base"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Mensagem */}
                <div>
                  <Label htmlFor="message" className="text-base font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Mensagem para o Luan (opcional)
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="mt-1 text-base h-24"
                    placeholder="Deixe uma mensagem carinhosa para o Luan..."
                  />
                </div>

                {/* Botão de envio */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || formData.will_attend === null}
                  className="w-full fruit-button py-4 text-lg rounded-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="text-xl"
                      >
                        🍎
                      </motion.div>
                      Enviando...
                    </div>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      Confirmar Presença
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
