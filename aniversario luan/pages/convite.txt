import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PartyInfo } from "@/entities/PartyInfo";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

export default function Convite() {
  const [partyInfo, setPartyInfo] = useState(null);

  useEffect(() => {
    loadPartyInfo();
  }, []);

  const loadPartyInfo = async () => {
    const data = await PartyInfo.list();
    if (data.length > 0) {
      setPartyInfo(data[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Convite Principal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 fruit-shadow mb-8"
        >
          {/* Imagem do convite */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/d55e81016_convite.png"
              alt="Convite do Luan"
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Texto do convite */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
              Você está convidado!
            </h1>
            
            <div className="text-lg md:text-xl text-gray-700 space-y-2">
              <p>Venha celebrar o <strong className="text-orange-600">primeiro aniversário</strong></p>
              <p>do nosso pequeno <strong className="text-green-600">Luan</strong>!</p>
            </div>

            <div className="flex justify-center gap-2 text-3xl my-6">
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>🍎</motion.span>
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>🍌</motion.span>
              <motion.span animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>🍓</motion.span>
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🍊</motion.span>
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}>🍍</motion.span>
            </div>

            {partyInfo && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 space-y-3 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{new Date(partyInfo.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{partyInfo.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-pink-500" />
                  <span className="font-medium">{partyInfo.location_name}</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Botões de ação */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to={createPageUrl("Confirmacao")}>
            <Button className="fruit-button px-8 py-4 text-lg rounded-2xl">
              Confirmar Presença
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          <Link to={createPageUrl("Informacoes")}>
            <Button variant="outline" className="px-8 py-4 text-lg rounded-2xl border-2 border-orange-300 text-orange-600 hover:bg-orange-50">
              Ver Informações
            </Button>
          </Link>
        </motion.div>

        {/* Mensagem especial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600 italic font-medium">
            "Será uma festa muito <span className="text-orange-500">especial</span> e <span className="text-green-500">divertida</span>!"
          </p>
          <div className="flex justify-center gap-1 text-2xl mt-4">
            🎈🎂🎉🎁🎊
          </div>
        </motion.div>
      </div>
    </div>
  );
}